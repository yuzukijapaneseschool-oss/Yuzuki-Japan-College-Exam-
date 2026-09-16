const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

const LOCAL_DATA_FILE = path.join(__dirname, 'ssw_accommodation_progress.json');
const SCRATCH_DATA_FILE = 'C:/Users/tharu/.gemini/antigravity/brain/f23ab097-1f23-47e8-9ca0-12b1dbf8d6bd/scratch/ssw_accommodation_progress.json';

const TOPIC_CONFIG = [
  {
    topicId: '1_front_desk',
    title: 'SSW Accommodation Module 1: Front Desk Work (フロント業務)',
    sectionName: 'Front Desk Work (フロント業務)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Check-in/out procedures, key management, luggage handling, billing, inquiries, and front desk operations (24 Questions).'
  },
  {
    topicId: '2_planning_public_relations',
    title: 'SSW Accommodation Module 2: Planning and Public Relations (企画・広報業務)',
    sectionName: 'Planning and Public Relations (企画・広報業務)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Accommodation packages, OTA management, social media & PR marketing, seasonal events, and customer review response (24 Questions).'
  },
  {
    topicId: '3_customer_service',
    title: 'SSW Accommodation Module 3: Customer Service and Operations (接客・オペレーション業務)',
    sectionName: 'Customer Service and Operations (接客・オペレーション業務)',
    durationMinutes: 45,
    passingScore: 60,
    description: 'Omotenashi etiquette, Keigo, escorting guests, housekeeping inspection, lost & found, and emergency first aid (42 Questions).'
  },
  {
    topicId: '4_restaurant_service',
    title: 'SSW Accommodation Module 4: Restaurant Service (レストランサービス業務)',
    sectionName: 'Restaurant Service (レストランサービス業務)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'Table setting, Japanese & Western course serving order, beverages, food allergy management, buffet & banquet service (56 Questions).'
  },
  {
    topicId: '5_health_safety',
    title: 'SSW Accommodation Module 5: Occupational Health and Safety (安全衛生・その他基礎知識)',
    sectionName: 'Occupational Health and Safety (安全衛生・その他基礎知識)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'HACCP food hygiene, food poisoning pathogens, disinfectant chemicals, fire & disaster evacuation, and Hotel Business Act (60 Questions).'
  }
];

async function seedSSWAccommodation() {
  console.log('🏨 Starting SSW Accommodation Database Seeding...');

  // 1. Ensure SSW-ACCOMMODATION course exists
  let accomCourse = await query.get("SELECT id FROM courses WHERE code = 'SSW-ACCOMMODATION'");
  if (!accomCourse) {
    const courseRes = await query.run(`
      INSERT INTO courses (code, name, category, description)
      VALUES (?, ?, ?, ?)
    `, [
      'SSW-ACCOMMODATION',
      'SSW - Accommodation & Hotel Management (宿泊業)',
      'Specified Skilled Worker (SSW)',
      'Hospitality Japanese (Omotenashi), front desk customer service, Japanese honorifics (Keigo / 敬語), restaurant service, hygiene, and hotel operations.'
    ]);
    accomCourse = { id: courseRes.id };
  } else {
    await query.run(`
      UPDATE courses 
      SET name = ?, description = ?, category = 'Specified Skilled Worker (SSW)'
      WHERE id = ?
    `, [
      'SSW - Accommodation & Hotel Management (宿泊業)',
      'Hospitality Japanese (Omotenashi), front desk customer service, Japanese honorifics (Keigo / 敬語), restaurant service, hygiene, and hotel operations.',
      accomCourse.id
    ]);
  }

  const courseId = accomCourse.id;

  // 2. Load JSON question bank
  let data = null;
  if (fs.existsSync(LOCAL_DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, 'utf8'));
  } else if (fs.existsSync(SCRATCH_DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(SCRATCH_DATA_FILE, 'utf8'));
    fs.mkdirSync(path.dirname(LOCAL_DATA_FILE), { recursive: true });
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  if (!data) {
    console.warn('⚠️ No SSW Accommodation question data found in JSON files.');
    return;
  }

  let totalQuestionsInserted = 0;
  const allSampleQuestionsForMock = [];

  // 3. Process each Module Exam
  for (const cfg of TOPIC_CONFIG) {
    const topicData = data[cfg.topicId];
    if (!topicData || !topicData.questions) {
      console.warn(`[Skip] No data for topic ${cfg.topicId}`);
      continue;
    }

    let exam = await query.get("SELECT id FROM exams WHERE course_id = ? AND title = ?", [courseId, cfg.title]);
    if (!exam) {
      const examRes = await query.run(`
        INSERT INTO exams (course_id, title, duration_minutes, passing_score, description, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
      `, [
        courseId,
        cfg.title,
        cfg.durationMinutes,
        cfg.passingScore,
        cfg.description
      ]);
      exam = { id: examRes.id };
    } else {
      await query.run(`
        UPDATE exams
        SET duration_minutes = ?, passing_score = ?, description = ?, is_active = 1
        WHERE id = ?
      `, [
        cfg.durationMinutes,
        cfg.passingScore,
        cfg.description,
        exam.id
      ]);
    }

    const examId = exam.id;

    // Remove existing questions for this specific exam
    await query.run("DELETE FROM questions WHERE exam_id = ?", [examId]);

    const sids = Object.keys(topicData.questions).sort((a, b) => Number(a) - Number(b));
    let orderNum = 1;

    for (const sid of sids) {
      const q = topicData.questions[sid];
      if (!q || !q.question_text) continue;

      allSampleQuestionsForMock.push({ ...q, moduleTitle: cfg.sectionName });

      await query.run(`
        INSERT INTO questions (
          exam_id, section_name, question_text,
          option_a, option_b, option_c, option_d,
          correct_option, marks, explanation, order_num
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        examId,
        cfg.sectionName,
        q.question_text,
        q.option_a || '',
        q.option_b || '',
        q.option_c || '',
        q.option_d || '',
        q.correct_option || 'A',
        1,
        q.explanation || '',
        orderNum
      ]);

      orderNum++;
      totalQuestionsInserted++;
    }

    console.log(`✅ Seeded ${cfg.title}: ${sids.length} questions`);
  }

  // 4. Create Comprehensive Model Paper (40 Questions)
  const mockTitle = 'SSW Accommodation Industry Comprehensive Model Examination (宿泊業総合模擬試験)';
  let mockExam = await query.get("SELECT id FROM exams WHERE course_id = ? AND title = ?", [courseId, mockTitle]);
  if (!mockExam) {
    const mockRes = await query.run(`
      INSERT INTO exams (course_id, title, duration_minutes, passing_score, description, is_active)
      VALUES (?, ?, 45, 60, ?, 1)
    `, [
      courseId,
      mockTitle,
      'Official style 40-question CBT mock examination covering Front Desk, Planning & PR, Customer Service, Restaurant, and Safety.'
    ]);
    mockExam = { id: mockRes.id };
  } else {
    await query.run(`
      UPDATE exams
      SET duration_minutes = 45, passing_score = 60, is_active = 1
      WHERE id = ?
    `, [mockExam.id]);
  }

  await query.run("DELETE FROM questions WHERE exam_id = ?", [mockExam.id]);

  // Pick 40 balanced questions across modules
  const selected40 = [];
  TOPIC_CONFIG.forEach(cfg => {
    const fromMod = allSampleQuestionsForMock.filter(q => q.moduleTitle === cfg.sectionName);
    const countToTake = cfg.topicId === '1_front_desk' ? 5 :
                        cfg.topicId === '2_planning_public_relations' ? 5 :
                        cfg.topicId === '3_customer_service' ? 10 :
                        cfg.topicId === '4_restaurant_service' ? 10 : 10;
    selected40.push(...fromMod.slice(0, countToTake));
  });

  let mockOrder = 1;
  for (const q of selected40.slice(0, 40)) {
    await query.run(`
      INSERT INTO questions (
        exam_id, section_name, question_text,
        option_a, option_b, option_c, option_d,
        correct_option, marks, explanation, order_num
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      mockExam.id,
      q.moduleTitle || 'General Accommodation Knowledge',
      q.question_text,
      q.option_a || '',
      q.option_b || '',
      q.option_c || '',
      q.option_d || '',
      q.correct_option || 'A',
      1,
      q.explanation || '',
      mockOrder
    ]);

    mockOrder++;
    totalQuestionsInserted++;
  }

  console.log(`✅ Seeded ${mockTitle}: ${selected40.length} questions`);
  console.log(`🎉 SSW Accommodation Seeding Complete! Total questions inserted: ${totalQuestionsInserted}`);
}

module.exports = { seedSSWAccommodation };
