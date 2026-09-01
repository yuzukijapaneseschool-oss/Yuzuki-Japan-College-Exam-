const { query } = require('../config/database');

async function updateCoursesAndExams() {
  const coursesToSeed = [
    {
      code: 'SSW-AUTOMOBILE',
      name: 'SSW - Automobile Repair & Maintenance (自動車整備)',
      category: 'Specified Skilled Worker (SSW)',
      description: 'Specialized technical Japanese, automotive parts terminology, safety protocols, and inspection procedures for the SSW Automobile sector.'
    },
    {
      code: 'SSW-TRUCK-DRIVING',
      name: 'SSW - Truck Driving & Automobile Transport (自動車運送業・トラック運転)',
      category: 'Specified Skilled Worker (SSW)',
      description: 'Logistics terminology, Japanese traffic safety regulations, freight handling, and route navigation Japanese.'
    },
    {
      code: 'SSW-CAREGIVER',
      name: 'SSW - Nursing Care / Caregiver (介護)',
      category: 'Specified Skilled Worker (SSW)',
      description: 'Elderly care communication, bodily assistance terminology, medical Japanese, and patient interaction skills (Kaigo Japanese).'
    },
    {
      code: 'SSW-ACCOMMODATION',
      name: 'SSW - Accommodation & Hotel Management (宿泊業)',
      category: 'Specified Skilled Worker (SSW)',
      description: 'Hospitality Japanese (Omotenashi), front desk customer service, Japanese honorifics (Keigo / 敬語), and hotel operations.'
    },
    {
      code: 'SSW-AIRPORT-GROUND',
      name: 'SSW - Airport Ground Handling & Aviation (空港グランドハンドリング・航空業)',
      category: 'Specified Skilled Worker (SSW)',
      description: 'Aviation terminology, ramp services, baggage handling operations, tarmac safety signals, and international airport communication.'
    },
    {
      code: 'SSW-FOOD-SERVICE',
      name: 'SSW - Food Service & Restaurant Operations (外食業)',
      category: 'Specified Skilled Worker (SSW)',
      description: 'Kitchen safety, culinary terms, food hygiene standards (HACCP), table service, and customer order management in Japanese.'
    }
  ];

  try {
    await query.run(`ALTER TABLE courses ADD COLUMN category TEXT DEFAULT 'General Language'`);
    console.log('Added category column to courses table.');
  } catch (e) {}

  for (const c of coursesToSeed) {
    const existing = await query.get('SELECT id FROM courses WHERE code = ?', [c.code]);
    if (!existing) {
      const res = await query.run(
        'INSERT INTO courses (code, name, category, description) VALUES (?, ?, ?, ?)',
        [c.code, c.name, c.category, c.description]
      );
      console.log('Added course:', c.name, 'ID:', res.id);
    } else {
      await query.run(
        'UPDATE courses SET name = ?, category = ?, description = ? WHERE code = ?',
        [c.name, c.category, c.description, c.code]
      );
    }
  }

  await query.run(`UPDATE courses SET category = 'General Language' WHERE code IN ('JFT-BASIC', 'JLPT-N5', 'JLPT-N4', 'JLPT-N3')`);

  // Seed sample mock exams for the new SSW sectors
  const autoCourse = await query.get("SELECT id FROM courses WHERE code = 'SSW-AUTOMOBILE'");
  if (autoCourse) {
    const existingExam = await query.get("SELECT id FROM exams WHERE course_id = ?", [autoCourse.id]);
    if (!existingExam) {
      const examRes = await query.run(`
        INSERT INTO exams (title, course_id, duration_minutes, passing_score, description, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        'SSW Automobile Maintenance Technical Japanese Skill Exam',
        autoCourse.id,
        45,
        60,
        'Technical Japanese exam covering vehicle inspection (車検), engine parts (エンジン部品), tool names (工具), and workshop safety regulations (作業安全).',
        1
      ]);

      const qList = [
        {
          section: 'Technical Vocabulary (専門用語)',
          text: '自動車整備でタイヤの空気圧を測定・調整する工具の名前は何ですか。',
          optA: 'エアゲージ (Air Gauge)',
          optB: 'トルクレンチ (Torque Wrench)',
          optC: 'ジャッキ (Jack)',
          optD: 'スパナ (Spanner)',
          correct: 'A', marks: 2,
          explanation: 'タイヤの空気圧を測る測定器は「エアゲージ」です。'
        },
        {
          section: 'Workshop Safety (作業安全)',
          text: '工場内でリフトを使って車を持ち上げるとき、作業員が必ず確認するべき安全行動は何ですか。',
          optA: '窓を開けておく',
          optB: 'ロック機構が正しくかかっているか確認し、周囲に人がいないか指差呼称する',
          optC: 'エンジンの回転数を上げる',
          optD: 'ラジオの音量を大きくする',
          correct: 'B', marks: 2,
          explanation: 'リフト作業時の安全確保にはロックの確認と「指差呼称（指差し確認）」が最も重要です。'
        },
        {
          section: 'Customer Dialogue (接客・報告)',
          text: 'ブレーキパッドの交換が終わった後、お客様に説明する適切な言葉はどれですか。',
          optA: 'ブレーキパッドを新品に交換いたしました。安全にご走行いただけます。',
          optB: 'ブレーキはもう触らないでください。',
          optC: 'タイヤを捨てておきました。',
          optD: '車の鍵はどこかへ行きました。',
          correct: 'A', marks: 2,
          explanation: '丁寧な完了報告は「ブレーキパッドを新品に交換いたしました。安全にご走行いただけます」です。'
        }
      ];

      for (let i = 0; i < qList.length; i++) {
        const q = qList[i];
        await query.run(`
          INSERT INTO questions (exam_id, section_name, question_text, option_a, option_b, option_c, option_d, correct_option, marks, explanation, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [examRes.id, q.section, q.text, q.optA, q.optB, q.optC, q.optD, q.correct, q.marks, q.explanation, i + 1]);
      }
    }
  }

  // Caregiver exam
  const careCourse = await query.get("SELECT id FROM courses WHERE code = 'SSW-CAREGIVER'");
  if (careCourse) {
    const existingExam = await query.get("SELECT id FROM exams WHERE course_id = ?", [careCourse.id]);
    if (!existingExam) {
      const examRes = await query.run(`
        INSERT INTO exams (title, course_id, duration_minutes, passing_score, description, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        'SSW Nursing Care (介護) Japanese Communication Exam',
        careCourse.id,
        45,
        60,
        'Evaluates caregiver communication with elderly residents (声かけ), meal assistance (食事介助), mobility support (移乗), and hygiene care.',
        1
      ]);

      const qList = [
        {
          section: 'Caregiving Communication (声かけ)',
          text: '車いすからベッドへ移乗（いじょう）するとき、利用者様（高齢者）への最初の声かけとして最も適切なものはどれですか。',
          optA: '「早く立ってください。」',
          optB: '「田中様、これからベッドへ移りましょうか。準備はよろしいですか。」',
          optC: '「重いので自分で動いてください。」',
          optD: '「何も言わずに持ち上げます。」',
          correct: 'B', marks: 2,
          explanation: '介護では丁寧な敬語と、事前の確認（声かけ）が基本です。'
        },
        {
          section: 'Meal Assistance (食事介助)',
          text: '誤嚥（ごえん / 食べ物が気管に入ること）を防ぐための姿勢として正しいものはどれですか。',
          optA: 'あごを少し引いた姿勢（前屈位）',
          optB: '首を大きく後ろに反らせた姿勢',
          optC: '横を向いて寝たままの状態',
          optD: '歩きながら食べる姿勢',
          correct: 'A', marks: 2,
          explanation: '誤嚥予防には「あごを軽く引いた前屈位（ぜんくつい）」が最も安全です。'
        }
      ];

      for (let i = 0; i < qList.length; i++) {
        const q = qList[i];
        await query.run(`
          INSERT INTO questions (exam_id, section_name, question_text, option_a, option_b, option_c, option_d, correct_option, marks, explanation, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [examRes.id, q.section, q.text, q.optA, q.optB, q.optC, q.optD, q.correct, q.marks, q.explanation, i + 1]);
      }
    }
  }

  // Airport Ground Handling Exam
  const airportCourse = await query.get("SELECT id FROM courses WHERE code = 'SSW-AIRPORT-GROUND'");
  if (airportCourse) {
    const existingExam = await query.get("SELECT id FROM exams WHERE course_id = ?", [airportCourse.id]);
    if (!existingExam) {
      const examRes = await query.run(`
        INSERT INTO exams (title, course_id, duration_minutes, passing_score, description, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        'SSW Airport Ground Handling Safety & Ramp Operations Exam',
        airportCourse.id,
        45,
        60,
        'Aviation tarmac safety (エプロン内安全), baggage sorting & loading (手荷物仕分け・搭載), Marshalling signals, and flight ground communication.',
        1
      ]);

      const qList = [
        {
          section: 'Airport Safety (空港安全規則)',
          text: '航空機の駐機場（エプロン内）で車両を運転する際、航空機と車両の優先関係について正しいものはどれですか。',
          optA: '車両が常に最優先である',
          optB: '航空機が常に最優先であり、車両は航空機の進路を妨げてはならない',
          optC: 'スピードの速い方が優先である',
          optD: 'クラクションを鳴らせばどちらでもよい',
          correct: 'B', marks: 2,
          explanation: '空港制限区域内では、常に「航空機（Aircraft）」が最優先です。'
        },
        {
          section: 'Baggage Handling (受託手荷物)',
          text: '「FRAGILE（壊れ物）」のタグが付いたお客様のお荷物（スーツケース）を取り扱う際、どうするべきですか。',
          optA: '投げて運ぶ',
          optB: '衝撃を与えないよう両手で丁寧に持ち、荷崩れしないよう一番上に積載する',
          optC: '重い荷物の下に敷く',
          optD: 'タグを取り外す',
          correct: 'B', marks: 2,
          explanation: '壊れ物指定の荷物は両手で丁寧に扱い、上に積載（トップロード）します。'
        }
      ];

      for (let i = 0; i < qList.length; i++) {
        const q = qList[i];
        await query.run(`
          INSERT INTO questions (exam_id, section_name, question_text, option_a, option_b, option_c, option_d, correct_option, marks, explanation, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [examRes.id, q.section, q.text, q.optA, q.optB, q.optC, q.optD, q.correct, q.marks, q.explanation, i + 1]);
      }
    }
  }

  // Truck Driving Exam
  const truckCourse = await query.get("SELECT id FROM courses WHERE code = 'SSW-TRUCK-DRIVING'");
  if (truckCourse) {
    const existingExam = await query.get("SELECT id FROM exams WHERE course_id = ?", [truckCourse.id]);
    if (!existingExam) {
      const examRes = await query.run(`
        INSERT INTO exams (title, course_id, duration_minutes, passing_score, description, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        'SSW Truck Driving & Logistics Japanese Skill Exam',
        truckCourse.id,
        45,
        60,
        'Daily vehicle inspection (日常点検), cargo securing (荷崩れ防止), Japanese road signs, delivery receipt communication (納品伝票), and safe driving.',
        1
      ]);

      const qList = [
        {
          section: 'Logistics & Delivery (納品・配送)',
          text: '配送先でお客様に荷物を引き渡す際、納品伝票（のうひんでんぴょう）に何をもらう必要がありますか。',
          optA: '受領印（またはサイン）',
          optB: 'お菓子',
          optC: 'お客様の運転免許証',
          optD: '名刺だけ',
          correct: 'A', marks: 2,
          explanation: '荷物の引き渡し完了時には受領印（じゅりょういん）またはサインをいただきます。'
        },
        {
          section: 'Pre-trip Inspection (日常点検)',
          text: '運行前の日常点検で行う「タイヤの点検項目」として不適切なものはどれですか。',
          optA: '亀裂や偏摩耗の有無',
          optB: '空気圧の適正値確認',
          optC: 'ホイールナットの緩み（ゆるみ）',
          optD: 'カーナビの音楽プレイリスト',
          correct: 'D', marks: 2,
          explanation: '日常点検では空気圧、溝の深さ、ナットの緩みなどを確認します。'
        }
      ];

      for (let i = 0; i < qList.length; i++) {
        const q = qList[i];
        await query.run(`
          INSERT INTO questions (exam_id, section_name, question_text, option_a, option_b, option_c, option_d, correct_option, marks, explanation, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [examRes.id, q.section, q.text, q.optA, q.optB, q.optC, q.optD, q.correct, q.marks, q.explanation, i + 1]);
      }
    }
  }

  // Accommodation Exam
  const hotelCourse = await query.get("SELECT id FROM courses WHERE code = 'SSW-ACCOMMODATION'");
  if (hotelCourse) {
    const existingExam = await query.get("SELECT id FROM exams WHERE course_id = ?", [hotelCourse.id]);
    if (!existingExam) {
      const examRes = await query.run(`
        INSERT INTO exams (title, course_id, duration_minutes, passing_score, description, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        'SSW Accommodation & Hotel Hospitality (おもてなし) Exam',
        hotelCourse.id,
        45,
        60,
        'Front desk check-in Keigo (フロント接客・敬語), room service, concierge responses, and emergency evacuation guidance in hotels.',
        1
      ]);

      const qList = [
        {
          section: 'Hospitality Keigo (接客敬語)',
          text: 'ホテルのフロントでお客様をお迎えする時の最も適切な挨拶はどれですか。',
          optA: '「いらっしゃいませ。ゆづきホテルへようこそお越しくださいました。」',
          optB: '「やあ、元気でしたか。」',
          optC: '「部屋番号は何番ですか。」',
          optD: '「どうぞ適当に入ってください。」',
          correct: 'A', marks: 2,
          explanation: 'ホテル接客の基本の挨拶は「いらっしゃいませ。〜へようこそお越しくださいました」です。'
        },
        {
          section: 'Guest Service (客室対応)',
          text: 'お客様から「部屋にタオルをもう一枚持ってきてほしい」と電話がありました。承諾の返答として正しい敬語はどれですか。',
          optA: '「かしこまりました。ただちにお届けいたします。」',
          optB: '「了解しました。あとで行きます。」',
          optC: '「自分で取りに来てください。」',
          optD: '「分かりました、OKです。」',
          correct: 'A', marks: 2,
          explanation: 'ホテルでの丁寧な承諾は「かしこまりました。ただちにお届けいたします」です。'
        }
      ];

      for (let i = 0; i < qList.length; i++) {
        const q = qList[i];
        await query.run(`
          INSERT INTO questions (exam_id, section_name, question_text, option_a, option_b, option_c, option_d, correct_option, marks, explanation, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [examRes.id, q.section, q.text, q.optA, q.optB, q.optC, q.optD, q.correct, q.marks, q.explanation, i + 1]);
      }
    }
  }

  console.log('All SSW specialized sectors and mock papers successfully updated!');
}

updateCoursesAndExams().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
