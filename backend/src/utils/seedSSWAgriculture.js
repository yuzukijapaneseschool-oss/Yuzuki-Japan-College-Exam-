const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

const LOCAL_DATA_FILE = path.join(__dirname, 'ssw_agriculture_progress.json');
const SCRATCH_DATA_FILE = 'C:/Users/tharu/.gemini/antigravity/brain/f23ab097-1f23-47e8-9ca0-12b1dbf8d6bd/scratch/ssw_agriculture_progress.json';

const TOPIC_CONFIG = [
  {
    topicId: '1_general_agriculture',
    title: 'SSW Agriculture Module 1: General Agriculture (農業全般)',
    sectionName: 'General Agriculture (農業全般)',
    durationMinutes: 20,
    passingScore: 60,
    description: 'Overview of Japanese agriculture, farming seasons, regional climates, and agricultural environment (12 Questions).'
  },
  {
    topicId: '2_general_crop',
    title: 'SSW Agriculture Module 2: General Crop Farming (作物栽培全般)',
    sectionName: 'General Crop Farming (作物栽培全般)',
    durationMinutes: 90,
    passingScore: 60,
    description: 'Plant physiology, soil science, N-P-K fertilization, seeding, watering, pest control, and crop management (106 Questions).'
  },
  {
    topicId: '3_health_safety',
    title: 'SSW Agriculture Module 3: Occupational Safety and Health (安全衛生)',
    sectionName: 'Occupational Safety and Health (安全衛生)',
    durationMinutes: 35,
    passingScore: 60,
    description: 'Farm machinery safety (tractors, brush cutters), heat stroke prevention, PPE, and pesticide handling (30 Questions).'
  },
  {
    topicId: '4_rice_cultivation',
    title: 'SSW Agriculture Module 4: Rice Farming (稲作)',
    sectionName: 'Rice Farming (稲作)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Paddy preparation, seedling cultivation, transplanting, water control (中干し), and harvesting techniques (36 Questions).'
  },
  {
    topicId: '5_upland_vegetable',
    title: 'SSW Agriculture Module 5: Field Crops and Vegetables (畑作・野菜)',
    sectionName: 'Field Crops and Vegetables (畑作・野菜)',
    durationMinutes: 35,
    passingScore: 60,
    description: 'Open-field vegetables, ridge preparation, mulching, crop rotation, and post-harvest handling (32 Questions).'
  },
  {
    topicId: '6_horticulture',
    title: 'SSW Agriculture Module 6: Greenhouse Farming (施設園芸)',
    sectionName: 'Greenhouse Farming (施設園芸)',
    durationMinutes: 50,
    passingScore: 60,
    description: 'Vinyl greenhouse management, climate control, hydroponics, bee pollination, and vegetable cultivation (48 Questions).'
  },
  {
    topicId: '7_fruit_tree',
    title: 'SSW Agriculture Module 7: Fruit Growing (果樹栽培)',
    sectionName: 'Fruit Growing (果樹栽培)',
    durationMinutes: 50,
    passingScore: 60,
    description: 'Fruit tree management, pruning, artificial pollination, fruit thinning, bagging, and harvesting (48 Questions).'
  },
  {
    topicId: '8_terms',
    title: 'SSW Agriculture Module 8: Agricultural Terms and Knowledge (農業用語・基本知識)',
    sectionName: 'Agricultural Terms and Knowledge (農業用語・基本知識)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Technical farming terminology, Japanese units, tool names, weather terms, and basic knowledge (24 Questions).'
  }
];

async function seedSSWAgriculture() {
  console.log('🌾 Starting SSW Agriculture Database Seeding...');

  // 1. Ensure SSW-AGRICULTURE course exists
  let agriCourse = await query.get("SELECT id FROM courses WHERE code = 'SSW-AGRICULTURE'");
  if (!agriCourse) {
    const courseRes = await query.run(`
      INSERT INTO courses (code, name, category, description)
      VALUES (?, ?, ?, ?)
    `, [
      'SSW-AGRICULTURE',
      'SSW - Agriculture & Crop Farming (農業・耕種農業)',
      'Specified Skilled Worker (SSW)',
      'Crop cultivation techniques, soil and fertilizer management, greenhouse horticulture, rice farming, agricultural machinery safety, pesticide handling, and fruit growing.'
    ]);
    agriCourse = { id: courseRes.id };
  } else {
    await query.run(`
      UPDATE courses 
      SET name = ?, description = ?, category = 'Specified Skilled Worker (SSW)'
      WHERE id = ?
    `, [
      'SSW - Agriculture & Crop Farming (農業・耕種農業)',
      'Crop cultivation techniques, soil and fertilizer management, greenhouse horticulture, rice farming, agricultural machinery safety, pesticide handling, and fruit growing.',
      agriCourse.id
    ]);
  }

  const courseId = agriCourse.id;

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
    console.warn('⚠️ No SSW Agriculture question data found in JSON files.');
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

    // Remove existing questions for this exam
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
  const mockTitle = 'SSW Agriculture Industry Comprehensive Model Examination (農業・耕種農業 総合模擬試験)';
  let mockExam = await query.get("SELECT id FROM exams WHERE course_id = ? AND title = ?", [courseId, mockTitle]);
  if (!mockExam) {
    const mockRes = await query.run(`
      INSERT INTO exams (course_id, title, duration_minutes, passing_score, description, is_active)
      VALUES (?, ?, 45, 60, ?, 1)
    `, [
      courseId,
      mockTitle,
      'Official style 40-question CBT mock examination covering General Agriculture, Crop Farming, Safety, Rice, Field Crops, Greenhouses, Fruits, and Terms.'
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

  // Pick 40 balanced questions across all 8 modules (5 per module)
  const selected40 = [];
  TOPIC_CONFIG.forEach(cfg => {
    const fromMod = allSampleQuestionsForMock.filter(q => q.moduleTitle === cfg.sectionName);
    selected40.push(...fromMod.slice(0, 5));
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
      q.moduleTitle || 'General Agriculture',
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
  console.log(`🎉 SSW Agriculture Seeding Complete! Total questions inserted: ${totalQuestionsInserted}`);
}

module.exports = { seedSSWAgriculture };
