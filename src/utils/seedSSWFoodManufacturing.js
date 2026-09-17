const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

const LOCAL_DATA_FILE = path.join(__dirname, 'ssw_food_manufacturing_progress.json');
const SCRATCH_DATA_FILE = 'C:/Users/tharu/.gemini/antigravity/brain/f23ab097-1f23-47e8-9ca0-12b1dbf8d6bd/scratch/ssw_food_manufacturing_progress.json';

const MODULE_CONFIG = [
  {
    code: 'FOOD_MANU_MOD1',
    title: 'SSW Food Manufacturing Module 1: Hazards & Food Poisoning Pathogens (危害要因と食中毒原因微生物)',
    sectionName: 'Hazards & Food Poisoning (危害要因・微生物)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Biological, chemical, and physical hazards; food poisoning pathogens (Salmonella, Norovirus, Campylobacter, E. coli, etc.).'
  },
  {
    code: 'FOOD_MANU_MOD2',
    title: 'SSW Food Manufacturing Module 2: General Hygiene Management & 5S (一般衛生管理と5S活動)',
    sectionName: 'General Hygiene & 5S (一般衛生管理・5S)',
    durationMinutes: 50,
    passingScore: 60,
    description: 'Personal hygiene, handwashing 6 steps, work uniform, health checks, pest control, cleaning & sanitation 5S.'
  },
  {
    code: 'FOOD_MANU_MOD3',
    title: 'SSW Food Manufacturing Module 3: HACCP-based Hygiene Management (HACCPに沿った衛生管理)',
    sectionName: 'HACCP Management (HACCP管理)',
    durationMinutes: 25,
    passingScore: 60,
    description: '7 Principles and 12 Steps of HACCP, Hazard Analysis (HA), Critical Control Points (CCP), Critical Limits (CL), Monitoring & Corrective actions.'
  },
  {
    code: 'FOOD_MANU_MOD4',
    title: 'SSW Food Manufacturing Module 4: Work Safety Basics & PPE (食品工場における安全の基本・保護具)',
    sectionName: 'Work Safety Basics & PPE (安全の基本・保護具)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'PPE usage (hygiene caps, food boots, cut-resistant gloves), danger avoidance, slip/fall prevention, heatstroke measures.'
  },
  {
    code: 'FOOD_MANU_MOD5',
    title: 'SSW Food Manufacturing Module 5: Machinery & Equipment Safety (機械・設備の安全・挟まれ巻き込まれ防止)',
    sectionName: 'Machinery Safety & LOTO (機械設備安全・LOTO)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Pinch/entanglement hazard prevention, lockout/tagout (LOTO), interlocks, safety covers, cutters and slicers safety.'
  },
  {
    code: 'FOOD_MANU_MOD6',
    title: 'SSW Food Manufacturing Module 6: Factory Manners, Chemicals & Emergency Response (工場マナー・薬品取扱・緊急時対応)',
    sectionName: 'Factory Manners & Emergency (工場マナー・緊急対応)',
    durationMinutes: 35,
    passingScore: 60,
    description: 'Workplace manners, SDS usage, chemical safety, disaster/earthquake/fire preparedness, emergency stop procedures.'
  },
  {
    code: 'FOOD_MANU_MOD7',
    title: 'SSW Food Manufacturing Module 7: Raw Materials, Storage & Cold Chain (原材料管理・保管・温度管理)',
    sectionName: 'Raw Materials & Cold Chain (原材料・コールドチェーン)',
    durationMinutes: 35,
    passingScore: 60,
    description: 'Acceptance inspection, FIFO (First-in First-out), refrigerated/frozen storage temperature control, allergen segregation, cold chain.'
  },
  {
    code: 'FOOD_MANU_MOD8',
    title: 'SSW Food Manufacturing Module 8: Food Processing, Sterilization & Packaging (加工技術・加熱・殺菌・包装)',
    sectionName: 'Food Processing & Packaging (加工技術・殺菌・包装)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Core temperature (75°C/1min), rapid cooling (blast chilling), retort sterilization, vacuum/MAP packaging, CIP cleaning.'
  },
  {
    code: 'FOOD_MANU_MOD9',
    title: 'SSW Food Manufacturing Module 9: Foreign Matter Prevention & Inspection (異物混入防止・品質検査)',
    sectionName: 'Foreign Matter & QC Testing (異物防止・品質検査)',
    durationMinutes: 35,
    passingScore: 60,
    description: 'Hard/soft foreign matter control, metal detectors, X-ray inspection, sensory/physicochemical/microbiological testing (Brix, pH, coliforms).'
  },
  {
    code: 'FOOD_MANU_MOD10',
    title: 'SSW Food Manufacturing Module 10: SSW Food Manufacturing Comprehensive CBT Model Exam 1 (飲食料品製造業総合模擬試験1)',
    sectionName: 'Comprehensive CBT Model Exam 1 (総合模擬試験1)',
    durationMinutes: 60,
    passingScore: 65,
    description: 'Full-scale SSW Food & Beverage Manufacturing CBT Simulation Exam 1 covering all hygiene, safety, manufacturing, and QC domains.'
  },
  {
    code: 'FOOD_MANU_MOD11',
    title: 'SSW Food Manufacturing Module 11: SSW Food Manufacturing Comprehensive CBT Model Exam 2 (飲食料品製造業総合模擬試験2)',
    sectionName: 'Comprehensive CBT Model Exam 2 (総合模擬試験2)',
    durationMinutes: 60,
    passingScore: 65,
    description: 'Full-scale SSW Food & Beverage Manufacturing CBT Simulation Exam 2 with advanced practice questions and case studies.'
  }
];

async function seedSSWFoodManufacturing() {
  console.log('🏭 Starting SSW Food & Beverage Manufacturing Industry (特定技能 飲食料品製造業) Database Seeding...');

  // 1. Ensure SSW-FOOD-MANUFACTURING course exists
  let course = await query.get("SELECT id FROM courses WHERE code = 'SSW-FOOD-MANUFACTURING'");
  if (!course) {
    const courseRes = await query.run(`
      INSERT INTO courses (code, name, category, description)
      VALUES (?, ?, ?, ?)
    `, [
      'SSW-FOOD-MANUFACTURING',
      'SSW - Food & Beverage Manufacturing (特定技能 飲食料品製造業)',
      'Specified Skilled Worker (SSW)',
      'Official Japan Food & Beverage Manufacturing assessment curriculum covering Food Hygiene (Hazards, General Hygiene 5S, HACCP), Occupational Safety (Work Safety Basics, Machinery & Equipment Safety, Factory Manners & SDS), Manufacturing Processes & Quality Control (Raw Materials, Food Processing & Packaging, Foreign Matter Prevention & Testing), and Comprehensive CBT Model Exams.'
    ]);
    course = { id: courseRes.id };
  } else {
    await query.run(`
      UPDATE courses 
      SET name = ?, description = ?, category = 'Specified Skilled Worker (SSW)'
      WHERE id = ?
    `, [
      'SSW - Food & Beverage Manufacturing (特定技能 飲食料品製造業)',
      'Official Japan Food & Beverage Manufacturing assessment curriculum covering Food Hygiene (Hazards, General Hygiene 5S, HACCP), Occupational Safety (Work Safety Basics, Machinery & Equipment Safety, Factory Manners & SDS), Manufacturing Processes & Quality Control (Raw Materials, Food Processing & Packaging, Foreign Matter Prevention & Testing), and Comprehensive CBT Model Exams.',
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
    console.warn('⚠️ No SSW Food Manufacturing question data found in JSON files.');
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

  console.log(`🎉 SSW Food Manufacturing Seeding Complete! Total questions inserted: ${totalQuestionsInserted}`);
}

module.exports = { seedSSWFoodManufacturing };
