const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../../data/yuzuki.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Promisified database helpers
const query = {
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  },
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  exec: (sql) => {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};


async function applySubscriptionMigrations() {
  try {
    await query.run("ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'trial'");
  } catch (e) {}
  try {
    await query.run("ALTER TABLE users ADD COLUMN trial_ends_at DATETIME");
  } catch (e) {}
  try {
    await query.run("ALTER TABLE users ADD COLUMN subscription_ends_at DATETIME");
  } catch (e) {}
  try {
    await query.run("ALTER TABLE users ADD COLUMN monthly_price REAL DEFAULT 9.99");
  } catch (e) {}
}


async function applyPaymentTableMigration() {
  await query.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      invoice_num TEXT UNIQUE,
      amount REAL NOT NULL DEFAULT 9.99,
      currency TEXT DEFAULT 'USD',
      payment_method TEXT NOT NULL,
      payment_status TEXT DEFAULT 'completed',
      payment_reference TEXT,
      subscription_days INTEGER DEFAULT 30,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('Payments table verified/created in SQLite database.');
}

async function initDatabase() {
  await applyPaymentTableMigration();
  await applySubscriptionMigrations();
  // Create tables
  await query.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      student_id TEXT UNIQUE,
      course_id INTEGER,
      phone TEXT,
      role TEXT DEFAULT 'student', -- 'admin' or 'student'
      status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      course_id INTEGER NOT NULL,
      duration_minutes INTEGER DEFAULT 60,
      passing_score INTEGER DEFAULT 50, -- Percentage (e.g. 50% or score)
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      section_name TEXT DEFAULT 'General',
      question_text TEXT NOT NULL,
      question_type TEXT DEFAULT 'multiple_choice',
      image_url TEXT,
      audio_url TEXT,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_option TEXT NOT NULL, -- 'A', 'B', 'C', 'D'
      marks INTEGER DEFAULT 1,
      explanation TEXT,
      order_num INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS exam_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      exam_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total_marks INTEGER NOT NULL,
      percentage REAL NOT NULL,
      passed INTEGER NOT NULL, -- 1 = passed, 0 = failed
      answers_json TEXT NOT NULL,
      time_taken_seconds INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
    );
  `);

  // Seed default data if empty
  await seedInitialData();
}

async function seedInitialData() {
  const existingCourses = await query.all('SELECT * FROM courses');
  if (existingCourses.length === 0) {
    console.log('Seeding initial courses...');
    await query.run(`INSERT INTO courses (code, name, description) VALUES 
      ('JFT-BASIC', 'JFT-Basic (A2 Exam Preparation)', 'Official JFT-Basic A2 preparation with 60-minute mock exam simulations, audio listening (Choukai) and reading tests.'),
      ('JLPT-N5', 'JLPT N5 (Beginner Level)', 'Foundational Japanese vocabulary, kanji, grammar, and listening comprehension for beginners.'),
      ('JLPT-N4', 'JLPT N4 (Elementary Level)', 'Elementary Japanese grammar, kanji (300+), daily conversation, and listening mock tests.'),
      ('JLPT-N3', 'JLPT N3 (Intermediate Level)', 'Bridge to advanced Japanese with complex reading comprehension, kanji, and nuanced grammar.'),
      ('SSW-SPECIFIED', 'Specified Skilled Worker (SSW / Tokutei Ginou)', 'Specialized vocational and Japanese language test training for nursing care, food service, construction, and agriculture.')
    `);
  }

  // Seed Official Admin and Verified Student
  const adminUser = await query.get('SELECT * FROM users WHERE email = ?', ['lahirudilshan552@gmail.com']);
  if (!adminUser) {
    const adminPasswordHash = await bcrypt.hash('japan@9803', 10);
    await query.run(`
      INSERT INTO users (name, email, password, student_id, role, status, phone, subscription_status, trial_ends_at, subscription_ends_at)
      VALUES (?, ?, ?, ?, 'admin', 'approved', '+94 77 353 9800', 'active', datetime('now', '+999 days'), datetime('now', '+999 days'))
    `, ['Lahiru Dilshan (Admin)', 'lahirudilshan552@gmail.com', adminPasswordHash, 'ADMIN-YJP']);
    console.log('Official admin seeded: lahirudilshan552@gmail.com / japan@9803 (Student ID: ADMIN-YJP)');
  }

  const officialAdmin = await query.get('SELECT * FROM users WHERE email = ?', ['admin@yuzukijapancollege.edu.lk']);
  if (!officialAdmin) {
    const adminPasswordHash = await bcrypt.hash('japan@9803', 10);
    await query.run(`
      INSERT INTO users (name, email, password, student_id, role, status, phone, subscription_status, trial_ends_at, subscription_ends_at)
      VALUES (?, ?, ?, ?, 'admin', 'approved', '+94 77 353 9800', 'active', datetime('now', '+999 days'), datetime('now', '+999 days'))
    `, ['Yuzuki Principal Admin', 'admin@yuzukijapancollege.edu.lk', adminPasswordHash, 'ADMIN-001']);
  }

  const sampleStudent = await query.get('SELECT * FROM users WHERE email = ?', ['student@yuzukijapancollege.edu.lk']);
  if (!sampleStudent) {
    const studentPasswordHash = await bcrypt.hash('student@123', 10);
    const jftCourse = await query.get("SELECT id FROM courses WHERE code = 'JFT-BASIC'");
    await query.run(`
      INSERT INTO users (name, email, password, student_id, course_id, role, status, phone, subscription_status, trial_ends_at, subscription_ends_at, monthly_price, batch_mode)
      VALUES (?, ?, ?, ?, ?, 'student', 'approved', '+94 71 987 6543', 'active', datetime('now', '+365 days'), datetime('now', '+365 days'), 9.99, 'SSW & CBT Candidate')
    `, ['Kasun Perera (Student)', 'student@yuzukijapancollege.edu.lk', studentPasswordHash, 'YJP-2026-001', jftCourse ? jftCourse.id : 1]);
    console.log('Official student seeded: student@yuzukijapancollege.edu.lk / student@123 (Student ID: YJP-2026-001)');
  }

  // Seed JFT Sample Exam if not exists
  const existingExams = await query.all('SELECT * FROM exams');
  if (existingExams.length === 0) {
    const jftCourse = await query.get("SELECT id FROM courses WHERE code = 'JFT-BASIC'");
    const n5Course = await query.get("SELECT id FROM courses WHERE code = 'JLPT-N5'");

    if (jftCourse) {
      const jftExam = await query.run(`
        INSERT INTO exams (title, course_id, duration_minutes, passing_score, description, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        'JFT-Basic Official Model Paper 01 (60 Minutes)',
        jftCourse.id,
        60,
        60,
        'Full 60-minute timed JFT-Basic A2 mock test covering Script & Vocabulary (文字・語彙), Conversation & Expression (会話・表現), Listening Comprehension (聴解), and Reading (読解).',
        1
      ]);

      const examId = jftExam.id;

      // Seed realistic questions with Japanese text, options, explanations, and media placeholders
      const sampleQuestions = [
        {
          section: 'Section 1: Script & Vocabulary (文字・語彙)',
          text: '次の下線（______）の言葉の漢字はどう書きますか。\n「まいあさ、６じに おきます。」',
          optA: '毎朝', optB: '毎晩', optC: '毎月', optD: '毎週',
          correct: 'A',
          marks: 2,
          explanation: '「まいあさ」は漢字で「毎朝」と書きます。「毎晩」はまいばん、「毎月」はまいつき/まいげつ、「毎週」はまいしゅうです。'
        },
        {
          section: 'Section 1: Script & Vocabulary (文字・語彙)',
          text: '（　　）に何を入れますか。一番いいものを一つえらんでください。\n「わたしは 日本語の がっこうで べんきょうして（　　）。」',
          optA: 'いきます', optB: 'います', optC: 'あります', optD: 'きます',
          correct: 'B',
          marks: 2,
          explanation: '「〜て います」は現在進行中または継続的な状態を表します。「べんきょうしています」が正しいです。'
        },
        {
          section: 'Section 2: Conversation & Expression (会話・表現)',
          text: 'レストランで注文するとき、店員に何と言いますか。\n「すみません、水を もういっぱい（　　）。」',
          optA: 'ください', optB: 'あげます', optC: 'します', optD: 'あります',
          correct: 'A',
          marks: 2,
          explanation: '何かを頼むときは「〜を ください」を使います。「水をもう一杯ください」＝ Please give me another glass of water.'
        },
        {
          section: 'Section 2: Conversation & Expression (会話・表現)',
          text: '会社で上司に「お疲れ様でした」と言われました。あなたは何と答えますか。',
          optA: 'どういたしまして', optB: 'お疲れ様でした。お先に失礼します。', optC: 'ごめんなさい', optD: 'いただきます',
          correct: 'B',
          marks: 2,
          explanation: '仕事が終わって先に帰る時の丁寧な挨拶は「お疲れ様でした。お先に失礼します」です。'
        },
        {
          section: 'Section 3: Listening Comprehension (聴解 - Choukai)',
          text: '【リスニング問題】音声を聞いて、質問に答えてください。\n男の人と女の人が話しています。男の人は何時に駅で会いますか。',
          audio: '/uploads/audio/sample_jft_audio_1.mp3',
          optA: '午前９時', optB: '午前９時３０分', optC: '午前１０時', optD: '午前１０時３０分',
          correct: 'B',
          marks: 3,
          explanation: '会話で「じゃあ、９時半に駅の改札の前で会いましょう」と言っています。正解は午前9時30分(B)です。'
        },
        {
          section: 'Section 3: Listening Comprehension (聴解 - Choukai)',
          text: '【リスニング問題】音声を聞いてください。女の人は誕生日に何をもらいましたか。',
          audio: '/uploads/audio/sample_jft_audio_2.mp3',
          optA: '時計', optB: 'かばん', optC: '本', optD: '花',
          correct: 'A',
          marks: 3,
          explanation: '「父から素敵な腕時計をもらいました」と話しています。'
        },
        {
          section: 'Section 4: Reading Comprehension (読解 - Dokkai)',
          text: '【読解問題】次のメモを読んで質問に答えてください。\n----------------------------------------\n【ゴミ出しのルール】\n・もえるゴミ：火曜日・金曜日の朝８時まで\n・カン・ビン：水曜日の朝８時まで\n・プラスチック：木曜日の朝８時まで\n----------------------------------------\n木曜日の朝に出せるゴミは何ですか。',
          optA: 'もえるゴミ', optB: 'カン・ビン', optC: 'プラスチック', optD: '新聞紙',
          correct: 'C',
          marks: 3,
          explanation: 'メモに「プラスチック：木曜日の朝８時まで」と明記されています。'
        },
        {
          section: 'Section 4: Reading Comprehension (読解 - Dokkai)',
          text: '次の案内文を読んでください。日曜日に行くとき、入場料はいくらですか。\n----------------------------------------\n【ゆづき日本庭園 入場案内】\n平日（月〜金）：500円\n土曜日・日曜日・祝日：700円\n※学生証をお持ちの方は200円引き\n----------------------------------------\n学生証を持っている人が日曜日に払う金額はいくらですか。',
          optA: '300円', optB: '500円', optC: '700円', optD: '無料',
          correct: 'B',
          marks: 3,
          explanation: '日曜日の基本料金は700円、学生証提示で200円引きになるため、700円 - 200円 = 500円 となります。'
        }
      ];

      for (let i = 0; i < sampleQuestions.length; i++) {
        const q = sampleQuestions[i];
        await query.run(`
          INSERT INTO questions (exam_id, section_name, question_text, audio_url, option_a, option_b, option_c, option_d, correct_option, marks, explanation, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          examId, q.section, q.text, q.audio || null,
          q.optA, q.optB, q.optC, q.optD, q.correct, q.marks, q.explanation, i + 1
        ]);
      }
      console.log('Seeded sample JFT 60-min Exam with 8 questions!');
    }

    if (n5Course) {
      const n5Exam = await query.run(`
        INSERT INTO exams (title, course_id, duration_minutes, passing_score, description, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        'JLPT N5 Comprehensive Mock Exam 2026',
        n5Course.id,
        45,
        50,
        'Standard JLPT N5 mock exam covering Hiragana, Katakana, basic Kanji, particles (は, が, を, に, で), and basic comprehension.',
        1
      ]);

      const n5Questions = [
        {
          section: 'Vocabulary (語彙)',
          text: '（　　）の ことばは どう かきますか。\nきのう ともだちと えいがを （みました）。',
          optA: '見ました', optB: '行きました', optC: '聞きました', optD: '食べました',
          correct: 'A', marks: 2,
          explanation: '「みました」の漢字は「見ました」です。'
        },
        {
          section: 'Grammar (文法)',
          text: 'わたしは バス（　　） がっこうへ いきます。',
          optA: 'に', optB: 'で', optC: 'を', optD: 'へ',
          correct: 'B', marks: 2,
          explanation: '交通手段を表す助詞は「で」です。（バスで行きます）'
        },
        {
          section: 'Grammar (文法)',
          text: 'テーブルの うえに りんご（　　） ３つ あります。',
          optA: 'が', optB: 'は', optC: 'を', optD: 'に',
          correct: 'A', marks: 2,
          explanation: '存在を表す「あります」の前には助詞「が」を使います。'
        }
      ];

      for (let i = 0; i < n5Questions.length; i++) {
        const q = n5Questions[i];
        await query.run(`
          INSERT INTO questions (exam_id, section_name, question_text, option_a, option_b, option_c, option_d, correct_option, marks, explanation, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          n5Exam.id, q.section, q.text,
          q.optA, q.optB, q.optC, q.optD, q.correct, q.marks, q.explanation, i + 1
        ]);
  // Ensure all SSW Truck Driving Category Modules exist
  const truckCourse = await query.get("SELECT id FROM courses WHERE code = 'SSW-TRUCK-DRIVING'");
  if (truckCourse) {
    const allTruckModules = [
      // Driver Basics (6 Topics)
      { title: 'Role of Truck Drivers', cat: 'Driver Basics', total: 31 },
      { title: 'Accident Prevention and Safety', cat: 'Driver Basics', total: 32 },
      { title: 'Manners', cat: 'Driver Basics', total: 30 },
      { title: 'Health and Safety Management', cat: 'Driver Basics', total: 31 },
      { title: 'Traffic Rules', cat: 'Driver Basics', total: 31 },
      { title: 'Eco-driving and routes', cat: 'Driver Basics', total: 32 },

      // Transportation work (7 Topics)
      { title: 'Work flow', cat: 'Transportation work', total: 30 },
      { title: 'Driver Rules', cat: 'Transportation work', total: 30 },
      { title: 'Inspection and roll call', cat: 'Transportation work', total: 31 },
      { title: 'Operation Management', cat: 'Transportation work', total: 29 },
      { title: 'Trouble Response', cat: 'Transportation work', total: 33 },
      { title: 'Emergency and weather response', cat: 'Transportation work', total: 26 },
      { title: 'Truck Operation', cat: 'Transportation work', total: 33 }
    ];

    for (const m of allTruckModules) {
      const exists = await query.get("SELECT id FROM exams WHERE course_id = ? AND title = ?", [truckCourse.id, m.title]);
      if (!exists) {
        const ins = await query.run(`
          INSERT INTO exams (title, course_id, duration_minutes, passing_score, description, is_active)
          VALUES (?, ?, 0, 70, ?, 1)
        `, [m.title, truckCourse.id, `[${m.cat}] ${m.title}`]);

        for (let i = 1; i <= m.total; i++) {
          await query.run(`
            INSERT INTO questions (exam_id, section_name, question_text, option_a, option_b, option_c, option_d, correct_option, marks, explanation, order_num)
            VALUES (?, 'General', ?, 'Option A', 'Option B', 'Option C', 'Option D', 'A', 1, 'Official Practice', ?)
          `, [ins.id, `Question ${i} for ${m.title}`, i]);
        }
      }
    }
  }
}

module.exports = {
  db,
  query,
  initDatabase
};
