const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

const LOCAL_DATA_FILE = path.join(__dirname, 'ssw2_accommodation_progress.json');
const SCRATCH_DATA_FILE = 'C:/Users/tharu/.gemini/antigravity/brain/f23ab097-1f23-47e8-9ca0-12b1dbf8d6bd/scratch/ssw2_accommodation_progress.json';

const MODULE_CONFIG = [
  {
    code: 'SSW2_ACCOM_MOD1',
    title: 'SSW 2 Accommodation Module 1: Reservation Management (宿泊予約管理・PMSシステム・オーバーブッキング対策)',
    sectionName: 'Reservation Management (予約管理)',
    durationMinutes: 35,
    passingScore: 60,
    description: 'Room inventory control, reservation channels (OTA/direct), PMS systems, overbooking management, and cancellation policies (30 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD2',
    title: 'SSW 2 Accommodation Module 2: Check-in Operations (チェックイン実務・宿帳・本人確認・鍵受渡)',
    sectionName: 'Check-in Operations (チェックイン実務)',
    durationMinutes: 35,
    passingScore: 60,
    description: 'Hotel Business Act registry compliance, foreign guest passport inspection, key handover etiquette, luggage handling, and room escorting (30 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD3',
    title: 'SSW 2 Accommodation Module 3: Stay and Payment (滞在対応・精算・宿泊税・両替・チェックアウト)',
    sectionName: 'Stay & Payment (滞在・精算)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Mid-stay customer requests, room billing, local accommodation & bathing tax, invoice compliance, foreign exchange, and lost & found management (40 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD4',
    title: 'SSW 2 Accommodation Module 4: Hotel Planning & Package Creation (宿泊プラン企画・季節プロモーション)',
    sectionName: 'Hotel Planning (企画・プラン造成)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Target customer persona segmentation, seasonal tour packages, inbound cultural experience packages, and off-peak promotions (40 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD5',
    title: 'SSW 2 Accommodation Module 5: Metrics, Yield Management & Profit (指標管理・ADR・RevPAR・OCC・収益最大化)',
    sectionName: 'Metrics & Profit (指標・収益管理)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Hotel KPIs: ADR (Average Daily Rate), RevPAR (Revenue Per Available Room), OCC (Occupancy Rate), GOP (Gross Operating Profit), and dynamic pricing (40 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD6',
    title: 'SSW 2 Accommodation Module 6: Public Relations & Reputation Management (広報・SNS運用・レピュテーション管理)',
    sectionName: 'Public Relations (広報・レピュテーション)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Press releases, social media marketing (UGC / Instagram / TikTok), OTA review management, addressing criticism, and brand reputation preservation (40 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD7',
    title: 'SSW 2 Accommodation Module 7: Greetings & Politeness (挨拶・第一印象・身だしなみ)',
    sectionName: 'Greetings & Grooming (挨拶・身だしなみ)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Hospitality mindset, grooming 3 principles (cleanliness, functionality, harmony), welcoming greetings, eye contact, and departure send-off courtesy (40 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD8',
    title: 'SSW 2 Accommodation Module 8: Posture & Bowing Etiquette (姿勢・お辞儀・所作動作・語先後礼)',
    sectionName: 'Posture & Bowing (姿勢・お辞儀)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Standing posture, hand positioning, three types of Japanese bows (Eshaku 15°, Keirei 30°, Saikeirei 45°), directional hand signs, and Gosen-gorei etiquette (40 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD9',
    title: 'SSW 2 Accommodation Module 9: Speaking & Honorific Keigo (言葉遣い・敬語表現・クッション言葉)',
    sectionName: 'Speaking & Keigo (言葉遣い・敬語)',
    durationMinutes: 35,
    passingScore: 60,
    description: 'Sonkeigo (respectful), Kenjougo (humble), Teineigo (polite), eliminating improper baito-keigo, cushion phrases, and active confirmation (30 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD10',
    title: 'SSW 2 Accommodation Module 10: Telephone & Complaint Handling (電話応対・クレーム対応実務)',
    sectionName: 'Phone & Complaints (電話・クレーム対応)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Professional phone standards (3 rings), 5-step complaint handling protocol, active listening, initial apology, and duty manager escalation (25 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD11',
    title: 'SSW 2 Accommodation Module 11: Dining Basics & Appearance (料飲サービスの基本・身だしなみ・衛生)',
    sectionName: 'Dining Basics (料飲基本・衛生)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Dining room service staff hierarchy, grooming and hygiene standards, tableware layout, and glassware/silverware polishing (25 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD12',
    title: 'SSW 2 Accommodation Module 12: Serving Actions & Table Management (配膳動作・オーダーテイク・バッシング)',
    sectionName: 'Serving Actions (配膳動作・テーブル管理)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Order taking protocols, dish presentation rules (serve/clear from right), beverage tray balance, table bussing, and beverage refills (25 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD13',
    title: 'SSW 2 Accommodation Module 13: Food Culture & Japanese Dining Manners (食文化・日本料理・懐石・マナー)',
    sectionName: 'Food Culture & Kaiseki (食文化・懐石)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Traditional Kaiseki course sequence, Japanese sake classification (Daiginjo, Junmai, Honjozo), Western full-course dining, and Halal/Vegetarian dietary restrictions (25 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD14',
    title: 'SSW 2 Accommodation Module 14: Allergens & Food Hygiene Management (食物アレルギー・特定原材料8品目・衛生管理)',
    sectionName: 'Allergens & Hygiene (アレルギー・衛生)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Mandatory 8 allergens under Food Labeling Act, allergen cross-contact prevention in dining service, and emergency anaphylaxis response (25 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD15',
    title: 'SSW 2 Accommodation Module 15: Store Operations, Inventory & Terminology (料飲店舗運営・在庫管理・専門用語)',
    sectionName: 'Store Operations (店舗運営・在庫管理)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'FIFO inventory control, food cost ratio calculation, opening/closing checklists, POS reconciliation, and culinary terminology (25 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD16',
    title: 'SSW 2 Accommodation Module 16: Hotel Laws, Contracts & Risk Management (旅館業法・宿泊約款・個人情報保護法)',
    sectionName: 'Laws & Risk (法令・リスク管理)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Hotel Business Act Article 5 legal grounds for refusing lodging, standard accommodation contract terms, and customer personal data security (25 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD17',
    title: 'SSW 2 Accommodation Module 17: Customer Safety & Emergency Response (宿泊客の安全確保・避難誘導・AED救命救急)',
    sectionName: 'Customer Safety (顧客安全・避難誘導)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Earthquake and nighttime fire emergency protocols, 119/110 calls, evacuation announcements, AED life support, and security access control (25 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD18',
    title: 'SSW 2 Accommodation Module 18: Employee Safety & Workplace Sanitation (従業員の安全衛生・労災防止・感染症対策)',
    sectionName: 'Employee Safety (従業員安全・衛生)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Slips/trips/falls prevention, ergonomics for luggage/housekeeping lifting, Norovirus and infectious disease sanitation with sodium hypochlorite (25 Questions).'
  },
  {
    code: 'SSW2_ACCOM_MOD19',
    title: 'SSW 2 Accommodation Module 19: Facility, Environmental & Energy Management (施設管理・SDGs・省エネ・バリアフリー)',
    sectionName: 'Facilities & SDGs (施設管理・環境)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Eco-friendly housekeeping & linen reuse SDGs, public bath Legionella chlorination standards, energy conservation, and Universal Design accessibility (25 Questions).'
  }
];

async function seedSSW2Accommodation() {
  console.log('--- Starting SSW 2 Accommodation Industry (特定技能2号 宿泊業) Seeding ---');

  let rawData = null;
  if (fs.existsSync(LOCAL_DATA_FILE)) {
    rawData = JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, 'utf8'));
  } else if (fs.existsSync(SCRATCH_DATA_FILE)) {
    rawData = JSON.parse(fs.readFileSync(SCRATCH_DATA_FILE, 'utf8'));
  }

  if (!rawData || !rawData.modules) {
    console.warn('⚠️ No SSW 2 Accommodation question data found. Skipping seeding.');
    return;
  }

  const courseCode = 'SSW2-ACCOMMODATION';
  const courseName = 'SSW 2 - Accommodation Industry (特定技能2号 宿泊業)';
  const courseDesc = 'Official Specified Skilled Worker Type 2 (SSW 2 / 特定技能2号) Accommodation Industry assessment curriculum covering Front Desk Work, Planning & PR, Customer Service & Omotenashi, Restaurant & Dining Operations, and Safety, Health & Legal Compliance.';
  const courseCategory = 'Specified Skilled Worker 2 (SSW 2 / 特定技能2号)';

  let course = await query.get('SELECT * FROM courses WHERE code = ?', [courseCode]);
  if (!course) {
    const res = await query.run(
      'INSERT INTO courses (code, name, description, category) VALUES (?, ?, ?, ?)',
      [courseCode, courseName, courseDesc, courseCategory]
    );
    course = { id: res.id, code: courseCode, name: courseName };
    console.log(`✅ Created course: [${courseCode}] ${courseName} under category '${courseCategory}' (ID: ${course.id})`);
  } else {
    await query.run(
      'UPDATE courses SET name = ?, description = ?, category = ? WHERE id = ?',
      [courseName, courseDesc, courseCategory, course.id]
    );
    console.log(`ℹ️ Course already exists: [${courseCode}] (ID: ${course.id}). Updated category to '${courseCategory}'.`);
  }

  let totalQuestionsInserted = 0;
  let totalExamsCreated = 0;

  for (let i = 0; i < MODULE_CONFIG.length; i++) {
    const cfg = MODULE_CONFIG[i];
    const modData = rawData.modules[i] || rawData.modules.find(m => m.code === cfg.code);

    if (!modData || !modData.questions || modData.questions.length === 0) {
      console.warn(`⚠️ No questions found for module config ${cfg.code}`);
      continue;
    }

    let exam = await query.get('SELECT * FROM exams WHERE course_id = ? AND title = ?', [course.id, cfg.title]);

    if (!exam) {
      const examRes = await query.run(
        'INSERT INTO exams (title, course_id, duration_minutes, passing_score, description, is_active) VALUES (?, ?, ?, ?, ?, 1)',
        [cfg.title, course.id, cfg.durationMinutes, cfg.passingScore, cfg.description]
      );
      exam = { id: examRes.id, title: cfg.title };
      totalExamsCreated++;
      console.log(`  ➕ Created Exam: ${cfg.title} (ID: ${exam.id})`);
    } else {
      await query.run(
        'UPDATE exams SET duration_minutes = ?, passing_score = ?, description = ?, is_active = 1 WHERE id = ?',
        [cfg.durationMinutes, cfg.passingScore, cfg.description, exam.id]
      );
    }

    const existingQuestions = await query.all('SELECT id FROM questions WHERE exam_id = ?', [exam.id]);
    if (existingQuestions.length >= modData.questions.length) {
      console.log(`  ℹ️ Exam ID ${exam.id} already has ${existingQuestions.length} questions. Skipping question inserts.`);
      continue;
    }

    await query.run('DELETE FROM questions WHERE exam_id = ?', [exam.id]);

    for (let qIdx = 0; qIdx < modData.questions.length; qIdx++) {
      const q = modData.questions[qIdx];
      await query.run(
        `INSERT INTO questions 
         (exam_id, section_name, question_text, question_type, option_a, option_b, option_c, option_d, correct_option, marks, explanation, order_num) 
         VALUES (?, ?, ?, 'multiple_choice', ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          exam.id,
          cfg.sectionName || 'General',
          q.question_text,
          q.option_a,
          q.option_b,
          q.option_c,
          q.option_d,
          q.correct_option,
          q.marks || 1,
          q.explanation || '',
          qIdx + 1
        ]
      );
      totalQuestionsInserted++;
    }

    console.log(`  📝 Seeded ${modData.questions.length} questions into Exam ID ${exam.id}: ${cfg.title}`);
  }

  console.log(`\n🎉 SSW 2 Accommodation Industry Seeding Complete!`);
  console.log(`   - Modules/Exams: ${MODULE_CONFIG.length}`);
  console.log(`   - Total Questions Inserted: ${totalQuestionsInserted}`);
}

module.exports = { seedSSW2Accommodation };

if (require.main === module) {
  seedSSW2Accommodation()
    .then(() => {
      console.log('Seeder script execution finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeding error:', err);
      process.exit(1);
    });
}
