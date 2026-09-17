const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

const LOCAL_DATA_FILE = path.join(__dirname, 'ssw_foodservice_progress.json');
const SCRATCH_DATA_FILE = 'C:/Users/tharu/.gemini/antigravity/brain/f23ab097-1f23-47e8-9ca0-12b1dbf8d6bd/scratch/ssw_foodservice_progress.json';

const MODULE_CONFIG = [
  {
    code: 'FOOD_MOD1',
    title: 'SSW Food Service Module 1: Customer Service Knowledge (接客知識)',
    sectionName: 'Customer Service Knowledge (接客知識)',
    durationMinutes: 25,
    passingScore: 60,
    description: 'Welcoming guests, order taking, table service, polite Japanese phrasing, cash register operations, and farewell manners (24 Questions).'
  },
  {
    code: 'FOOD_MOD2',
    title: 'SSW Food Service Module 2: Food Knowledge & Dietary Diversity (食物・食材知識)',
    sectionName: 'Food Knowledge & Diversity (食物・食材知識)',
    durationMinutes: 25,
    passingScore: 60,
    description: 'Food allergies (7 mandatory items), Halal, Vegetarian/Vegan diets, and Japanese seasoning basics (20 Questions).'
  },
  {
    code: 'FOOD_MOD3',
    title: 'SSW Food Service Module 3: Store Management (店舗管理)',
    sectionName: 'Store Management (店舗管理)',
    durationMinutes: 20,
    passingScore: 60,
    description: 'Pre-opening setup, dining hall inspection, cash float readiness, closing routine, and safety checks (14 Questions).'
  },
  {
    code: 'FOOD_MOD4',
    title: 'SSW Food Service Module 4: Complaint Handling (クレーム対応)',
    sectionName: 'Complaint Handling (クレーム対応)',
    durationMinutes: 20,
    passingScore: 60,
    description: 'Foreign body contamination complaints, order delays, service disputes, empathetic apologies, and escalation protocols (16 Questions).'
  },
  {
    code: 'FOOD_MOD5',
    title: 'SSW Food Service Module 5: Emergencies and Safety (緊急時対応)',
    sectionName: 'Emergencies and Safety (緊急時対応)',
    durationMinutes: 20,
    passingScore: 60,
    description: 'Kitchen fires, oil fires, earthquake response, guest safety, evacuation guidance, and 119 emergency reporting (16 Questions).'
  },
  {
    code: 'FOOD_MOD6',
    title: 'SSW Food Service Module 6: Preparation and Ingredients (下処理・食材の取扱い)',
    sectionName: 'Preparation & Ingredients (下処理・食材の取扱い)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Vegetable cutting techniques (Ran-giri, Sengiri), fish/meat prep, proper thawing methods, and cross-contamination prevention (25 Questions).'
  },
  {
    code: 'FOOD_MOD7',
    title: 'SSW Food Service Module 7: Heating and Non-Heating Cooking (加熱調理・非加熱調理)',
    sectionName: 'Heating & Non-Heating Cooking (加熱調理・非加熱調理)',
    durationMinutes: 35,
    passingScore: 60,
    description: 'Heating core temperature standards (75°C for 1 min, 85-90°C for bivalves), frying oil control, salad prep, and rapid chilling (30 Questions).'
  },
  {
    code: 'FOOD_MOD8',
    title: 'SSW Food Service Module 8: Seasoning and Plating (調味・盛り付け)',
    sectionName: 'Seasoning and Plating (調味・盛り付け)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Proper hygienic tasting methods, plating aesthetics, temperature retention, garnishes, and presentation standards (25 Questions).'
  },
  {
    code: 'FOOD_MOD9',
    title: 'SSW Food Service Module 9: Kitchen Equipment and Cleaning (調理機器・器具の取扱い)',
    sectionName: 'Kitchen Equipment & Cleaning (調理機器・器具の取扱い)',
    durationMinutes: 25,
    passingScore: 60,
    description: 'Color-coded cutting boards, knife safety, fryer maintenance, combi-steamer sanitization, and chemical safety (20 Questions).'
  },
  {
    code: 'FOOD_MOD10',
    title: 'SSW Food Service Module 10: General Hygiene Management (一般衛生管理の基本)',
    sectionName: 'General Hygiene Management (一般衛生管理の基本)',
    durationMinutes: 35,
    passingScore: 60,
    description: 'Three principles of food poisoning prevention, 5S workplace methodology, pest control, and grease trap sanitation (30 Questions).'
  },
  {
    code: 'FOOD_MOD11',
    title: 'SSW Food Service Module 11: Food Poisoning Prevention and HACCP (食中毒予防・HACCP)',
    sectionName: 'Food Poisoning Prevention & HACCP (食中毒予防・HACCP)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Campylobacter, Norovirus, Salmonella, E. coli O157, Staphylococcus aureus, HACCP 7 principles, and CCP monitoring (35 Questions).'
  },
  {
    code: 'FOOD_MOD12',
    title: 'SSW Food Service Module 12: Personal Hygiene and Health Management (従業員の衛生管理)',
    sectionName: 'Personal Hygiene & Health (従業員の衛生管理)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Two-step handwashing technique, clean uniforms, grooming standards, daily health check sheets, and infection control (25 Questions).'
  },
  {
    code: 'FOOD_EXAM_MODEL',
    title: 'SSW Food Service Comprehensive Model Examination (外食業総合模擬試験)',
    sectionName: 'Comprehensive Model Exam (外食業総合模擬試験)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'Official 45-question CBT model examination simulating the OTAFF Food Service Industry Skills Assessment Test (45 Questions).'
  }
];

async function seedSSWFoodService() {
  console.log('🍽️ Starting SSW Food Service / Restaurant (外食業) Database Seeding...');

  // 1. Ensure SSW-FOOD-SERVICE course exists
  let course = await query.get("SELECT id FROM courses WHERE code = 'SSW-FOOD-SERVICE'");
  if (!course) {
    const courseRes = await query.run(`
      INSERT INTO courses (code, name, category, description)
      VALUES (?, ?, ?, ?)
    `, [
      'SSW-FOOD-SERVICE',
      'SSW - Food Service & Restaurant Operations (外食業)',
      'Specified Skilled Worker (SSW)',
      'Official OTAFF Food Service curriculum covering Customer Service, Cooking & Food Preparation, General Hygiene Management, HACCP, and Comprehensive Model Exam.'
    ]);
    course = { id: courseRes.id };
  } else {
    await query.run(`
      UPDATE courses 
      SET name = ?, description = ?, category = 'Specified Skilled Worker (SSW)'
      WHERE id = ?
    `, [
      'SSW - Food Service & Restaurant Operations (外食業)',
      'Official OTAFF Food Service curriculum covering Customer Service, Cooking & Food Preparation, General Hygiene Management, HACCP, and Comprehensive Model Exam.',
      course.id
    ]);
  }

  const courseId = course.id;

  // 2. Load JSON question bank
  let data = null;
  if (fs.existsSync(LOCAL_DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, 'utf8'));
  } else if (fs.existsSync(SCRATCH_DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(SCRATCH_DATA_FILE, 'utf8'));
    fs.mkdirSync(path.dirname(LOCAL_DATA_FILE), { recursive: true });
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  if (!data || !data.modules) {
    console.warn('⚠️ No SSW Food Service question data found in JSON files.');
    return;
  }

  let totalQuestionsInserted = 0;

  // 3. Process each Module Exam
  for (let i = 0; i < MODULE_CONFIG.length; i++) {
    const cfg = MODULE_CONFIG[i];
    const modData = data.modules[i];

    if (!modData || !modData.questions || modData.questions.length === 0) {
      console.warn(`[Skip] No data for module ${cfg.code}`);
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

    // Clear old questions
    await query.run("DELETE FROM questions WHERE exam_id = ?", [examId]);

    let orderNum = 1;
    for (const q of modData.questions) {
      await query.run(`
        INSERT INTO questions (
          exam_id, section_name, question_text,
          option_a, option_b, option_c, option_d,
          correct_option, marks, explanation, order_num
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        examId,
        q.section_name || cfg.sectionName,
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

    console.log(`✅ Seeded ${cfg.title}: ${modData.questions.length} questions`);
  }

  console.log(`🎉 SSW Food Service Seeding Complete! Total questions inserted: ${totalQuestionsInserted}`);
}

module.exports = { seedSSWFoodService };
