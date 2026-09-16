const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

const LOCAL_DATA_FILE = path.join(__dirname, 'ssw_nursing_progress.json');
const SCRATCH_DATA_FILE = 'C:/Users/tharu/.gemini/antigravity/brain/f23ab097-1f23-47e8-9ca0-12b1dbf8d6bd/scratch/ssw_nursing_progress.json';

const MODULE_CONFIG = [
  {
    code: 'CAREGIVER_MOD1',
    title: 'SSW Nursing Care Module 1: Dignity and Independence (人間の尊厳と自立)',
    sectionName: 'Dignity and Independence (人間の尊厳と自立)',
    durationMinutes: 20,
    passingScore: 60,
    description: 'Human dignity, client-centered care, self-determination, privacy, and normalization in elder care (15 Questions).'
  },
  {
    code: 'CAREGIVER_MOD2',
    title: 'SSW Nursing Care Module 2: Basics of Nursing Care (介護の基本)',
    sectionName: 'Basics of Nursing Care (介護の基本)',
    durationMinutes: 20,
    passingScore: 60,
    description: 'Professional ethics, confidentiality, infection prevention, body mechanics, occupational safety, and burnout prevention (15 Questions).'
  },
  {
    code: 'CAREGIVER_MOD3',
    title: 'SSW Nursing Care Module 3: Understanding Society (社会の理解・制度)',
    sectionName: 'Understanding Society (社会の理解・制度)',
    durationMinutes: 80,
    passingScore: 60,
    description: 'Long-term Care Insurance Act (介護保険法), insured categories, service types, certification process, and social security systems (94 Questions).'
  },
  {
    code: 'CAREGIVER_MOD4',
    title: 'SSW Nursing Care Module 4: Understanding Development and Aging (発達と老化の理解)',
    sectionName: 'Understanding Development and Aging (発達と老化の理解)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'Psychosocial development stages (Erikson), physiological aging of organ systems, sensory changes, frailty, sarcopenia, and disuse syndrome (71 Questions).'
  },
  {
    code: 'CAREGIVER_MOD5',
    title: 'SSW Nursing Care Module 5: Understanding Dementia (認知症の理解)',
    sectionName: 'Understanding Dementia (認知症の理解)',
    durationMinutes: 45,
    passingScore: 60,
    description: 'Core symptoms (memory, disorientation, executive function), BPSD, dementia types (Alzheimer, Lewy body, Vascular, FTD), and validation therapy (50 Questions).'
  },
  {
    code: 'CAREGIVER_MOD6',
    title: 'SSW Nursing Care Module 6: Understanding Disability (障害の理解)',
    sectionName: 'Understanding Disability (障害の理解)',
    durationMinutes: 90,
    passingScore: 60,
    description: 'Physical disabilities (hemiplegia, spinal injury), higher brain dysfunction (aphasia, spatial neglect), sensory/intellectual/mental disabilities, and ICF model (128 Questions).'
  },
  {
    code: 'CAREGIVER_MOD7',
    title: 'SSW Nursing Care Module 7: Structure of the Mind and Body (こころとからだのしくみ)',
    sectionName: 'Structure of the Mind and Body (こころとからだのしくみ)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Human psychology (Maslow, defense mechanisms), autonomic nervous system, body mechanics, vital signs assessment, and homeostasis (42 Questions).'
  },
  {
    code: 'CAREGIVER_MOD8',
    title: 'SSW Nursing Care Module 8: Human Relationships and Communication (人間関係とコミュニケーション)',
    sectionName: 'Human Relationships and Communication (人間関係とコミュニケーション)',
    durationMinutes: 50,
    passingScore: 60,
    description: 'Rapport building, active listening (傾聴), empathy, non-verbal cues, team communication (報連相), and self-awareness (58 Questions).'
  },
  {
    code: 'CAREGIVER_MOD9',
    title: 'SSW Nursing Care Module 9: Communication Skills (コミュニケーション技術)',
    sectionName: 'Communication Skills (コミュニケーション技術)',
    durationMinutes: 55,
    passingScore: 60,
    description: 'Communication techniques for sensory/speech impairments, dementia client interaction, care conferences, and assistive communication devices (65 Questions).'
  },
  {
    code: 'CAREGIVER_MOD10',
    title: 'SSW Nursing Care Module 10: Life Support Techniques (生活支援技術)',
    sectionName: 'Life Support Techniques (生活支援技術)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'Meal assistance, aspiration prevention, bathing safety, excretion care, wheelchair transfers, dressing (脱健着患), and room environment (69 Questions).'
  },
  {
    code: 'CAREGIVER_MOD11',
    title: 'SSW Nursing Care Module 11: Care Process (介護過程)',
    sectionName: 'Care Process (介護過程)',
    durationMinutes: 75,
    passingScore: 60,
    description: 'Four stages of the care process (Assessment, Planning, Implementation, Evaluation), goal setting, multidisciplinary collaboration, and PDCA cycle (87 Questions).'
  },
  {
    code: 'CAREGIVER_MOD12',
    title: 'SSW Nursing Care Module 12: Medical Care and First Aid (医療的ケア・応急処置)',
    sectionName: 'Medical Care and First Aid (医療的ケア・応急処置)',
    durationMinutes: 25,
    passingScore: 60,
    description: 'Oral/nasal sputum suctioning, tube feeding (PEG/nasogastric), first aid for choking (back blows/Heimlich), AED operation, and heatstroke protocols (19 Questions).'
  },
  {
    code: 'CAREGIVER_EXAM_MODEL',
    title: 'SSW Nursing Care Comprehensive Model Examination (介護総合模擬試験)',
    sectionName: 'Comprehensive Model Exam (介護総合模擬試験)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'Official 45-question CBT model exam synthesizing all 12 modules according to official MHLW SSW Tokutei Ginou specifications (45 Questions).'
  }
];

async function seedSSWCaregiver() {
  console.log('🩺 Starting SSW Caregiving (介護) Database Seeding...');

  // 1. Ensure SSW-CAREGIVER course exists
  let course = await query.get("SELECT id FROM courses WHERE code = 'SSW-CAREGIVER'");
  if (!course) {
    const courseRes = await query.run(`
      INSERT INTO courses (code, name, category, description)
      VALUES (?, ?, ?, ?)
    `, [
      'SSW-CAREGIVER',
      'SSW - Nursing Care / Caregiving (特定技能 介護 - Tokutei Ginou Kaigo)',
      'Specified Skilled Worker (SSW)',
      'Comprehensive official MHLW curriculum covering Dignity, Basics of Nursing Care, Social Security, Aging & Development, Dementia, Disabilities, Mind & Body, Communication, Life Support Techniques, Care Process, Medical Care, and Comprehensive Model Exam.'
    ]);
    course = { id: courseRes.id };
  } else {
    await query.run(`
      UPDATE courses 
      SET name = ?, description = ?, category = 'Specified Skilled Worker (SSW)'
      WHERE id = ?
    `, [
      'SSW - Nursing Care / Caregiving (特定技能 介護 - Tokutei Ginou Kaigo)',
      'Comprehensive official MHLW curriculum covering Dignity, Basics of Nursing Care, Social Security, Aging & Development, Dementia, Disabilities, Mind & Body, Communication, Life Support Techniques, Care Process, Medical Care, and Comprehensive Model Exam.',
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
    console.warn('⚠️ No SSW Caregiving question data found in JSON files.');
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

  console.log(`🎉 SSW Caregiving Seeding Complete! Total questions inserted: ${totalQuestionsInserted}`);
}

module.exports = { seedSSWCaregiver };
