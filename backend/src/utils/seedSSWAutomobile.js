const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

const LOCAL_DATA_FILE = path.join(__dirname, 'ssw_auto_progress.json');
const SCRATCH_DATA_FILE = 'C:/Users/tharu/.gemini/antigravity/brain/f23ab097-1f23-47e8-9ca0-12b1dbf8d6bd/scratch/ssw_auto_progress.json';

const TOPIC_CONFIG = [
  {
    topicId: '1_structure_operation',
    title: 'SSW Automobile Module 1: Structure, Function, and Handling (構造・機能・取扱法)',
    sectionName: 'Structure, Function, and Handling (構造・機能・取扱法)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'Structure, Function, and Handling of automotive engines, chassis, electrical components, and vehicle mechanisms (99 Questions).'
  },
  {
    topicId: '2_inspection_repair',
    title: 'SSW Automobile Module 2: Inspection, Repair, and Adjustment (点検・修理・調整)',
    sectionName: 'Inspection, Repair, and Adjustment (点検・修理・調整)',
    durationMinutes: 90,
    passingScore: 60,
    description: 'Vehicle inspection standards (車検・定期点検), disassembly, repair procedures, and mechanical adjustments (140 Questions).'
  },
  {
    topicId: '3_equipment_tools',
    title: 'SSW Automobile Module 3: Testing Machines, Measuring Instruments, and Tools (試験機・計量器・工具)',
    sectionName: 'Testing Machines, Measuring Instruments, and Tools (試験機・計量器・工具)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'Automotive diagnostic tools, measuring equipment (micrometer, torque wrench, multimeter), and workshop machinery (84 Questions).'
  },
  {
    topicId: '4_materials_fuels',
    title: 'SSW Automobile Module 4: Materials, Fuels, Oils, and Grease (材料・燃料・油脂)',
    sectionName: 'Materials, Fuels, Oils, and Grease (材料・燃料・油脂)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'Automotive fuels, engine oils, transmission fluids, brake fluids, grease, and engineering materials (96 Questions).'
  }
];

async function seedSSWAutomobile() {
  console.log('🚗 Starting SSW Automobile Database Seeding...');

  // 1. Ensure SSW-AUTOMOBILE course exists
  let autoCourse = await query.get("SELECT id FROM courses WHERE code = 'SSW-AUTOMOBILE'");
  if (!autoCourse) {
    const courseRes = await query.run(`
      INSERT INTO courses (code, name, category, description)
      VALUES (?, ?, ?, ?)
    `, [
      'SSW-AUTOMOBILE',
      'SSW - Automobile Repair & Maintenance (自動車整備)',
      'Specified Skilled Worker (SSW)',
      'Official technical Japanese, engine mechanics, inspection & repair procedures, tools & measuring instruments, and automotive materials.'
    ]);
    autoCourse = { id: courseRes.id };
  } else {
    await query.run(`
      UPDATE courses 
      SET name = 'SSW - Automobile Repair & Maintenance (自動車整備)',
          category = 'Specified Skilled Worker (SSW)',
          description = 'Official technical Japanese, engine mechanics, inspection & repair procedures, tools & measuring instruments, and automotive materials.'
      WHERE id = ?
    `, [autoCourse.id]);
  }

  // 2. Load questions from progress/scraped JSON
  let rawData = null;
  if (fs.existsSync(LOCAL_DATA_FILE)) {
    rawData = JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, 'utf8'));
  } else if (fs.existsSync(SCRATCH_DATA_FILE)) {
    rawData = JSON.parse(fs.readFileSync(SCRATCH_DATA_FILE, 'utf8'));
  } else {
    console.warn('⚠️ SSW Automobile data file not found at:', LOCAL_DATA_FILE, 'or', SCRATCH_DATA_FILE);
    return;
  }

  // 3. Seed each of the 4 topic modules
  for (const conf of TOPIC_CONFIG) {
    const topicData = rawData[conf.topicId];
    if (!topicData || !topicData.questions) {
      console.warn(`⚠️ No data found for topic ${conf.topicId}`);
      continue;
    }

    const questionKeys = Object.keys(topicData.questions).sort((a, b) => Number(a) - Number(b));
    console.log(`Processing ${conf.title} - ${questionKeys.length} questions available...`);

    // Check or create Exam
    let exam = await query.get("SELECT id FROM exams WHERE course_id = ? AND title = ?", [autoCourse.id, conf.title]);
    let examId;
    if (!exam) {
      const examRes = await query.run(`
        INSERT INTO exams (course_id, title, description, duration_minutes, passing_score, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
      `, [autoCourse.id, conf.title, conf.description, conf.durationMinutes, conf.passingScore]);
      examId = examRes.id;
    } else {
      examId = exam.id;
      await query.run(`
        UPDATE exams 
        SET description = ?, duration_minutes = ?, passing_score = ?, is_active = 1
        WHERE id = ?
      `, [conf.description, conf.durationMinutes, conf.passingScore, examId]);
    }

    // Check existing questions count
    const countRes = await query.get("SELECT COUNT(*) as count FROM questions WHERE exam_id = ?", [examId]);
    if (countRes && countRes.count >= questionKeys.length && questionKeys.length > 0) {
      console.log(`✓ ${conf.title} already has ${countRes.count} questions. Skipping re-insert.`);
      continue;
    }

    // Replace questions with fresh full set
    await query.run("DELETE FROM questions WHERE exam_id = ?", [examId]);

    let order = 1;
    for (const key of questionKeys) {
      const q = topicData.questions[key];
      if (!q || !q.question_text) continue;

      await query.run(`
        INSERT INTO questions (
          exam_id, section_name, question_text,
          option_a, option_b, option_c, option_d,
          correct_option, marks, explanation, order_num
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        examId,
        conf.sectionName,
        q.question_text,
        q.option_a || '',
        q.option_b || '',
        q.option_c || '',
        q.option_d || '',
        q.correct_option || 'A',
        1,
        q.explanation || '',
        order++
      ]);
    }
    console.log(`✅ Successfully seeded ${order - 1} questions for: ${conf.title}`);
  }

  // 4. Seed Comprehensive Mock Exam (40 questions balanced across all 4 topics)
  const mockTitle = 'SSW Automobile Comprehensive Model Paper (自動車整備 総合模擬試験)';
  let mockExam = await query.get("SELECT id FROM exams WHERE course_id = ? AND title = ?", [autoCourse.id, mockTitle]);
  let mockExamId;
  if (!mockExam) {
    const mRes = await query.run(`
      INSERT INTO exams (course_id, title, description, duration_minutes, passing_score, is_active)
      VALUES (?, ?, ?, 60, 60, 1)
    `, [
      autoCourse.id,
      mockTitle,
      'Comprehensive 40-question official mock test covering all 4 core automotive test domains with furigana explanations.'
    ]);
    mockExamId = mRes.id;
  } else {
    mockExamId = mockExam.id;
  }

  const mockCount = await query.get("SELECT COUNT(*) as count FROM questions WHERE exam_id = ?", [mockExamId]);
  if (!mockCount || mockCount.count < 40) {
    await query.run("DELETE FROM questions WHERE exam_id = ?", [mockExamId]);
    let mockOrder = 1;

    for (const conf of TOPIC_CONFIG) {
      const topicData = rawData[conf.topicId];
      if (!topicData || !topicData.questions) continue;
      const keys = Object.keys(topicData.questions).sort((a, b) => Number(a) - Number(b));
      
      // Select 10 evenly spaced questions
      const step = Math.max(1, Math.floor(keys.length / 10));
      for (let i = 0; i < 10 && (i * step) < keys.length; i++) {
        const q = topicData.questions[keys[i * step]];
        if (!q || !q.question_text) continue;

        await query.run(`
          INSERT INTO questions (
            exam_id, section_name, question_text,
            option_a, option_b, option_c, option_d,
            correct_option, marks, explanation, order_num
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          mockExamId,
          conf.sectionName,
          q.question_text,
          q.option_a || '',
          q.option_b || '',
          q.option_c || '',
          q.option_d || '',
          q.correct_option || 'A',
          2,
          q.explanation || '',
          mockOrder++
        ]);
      }
    }
    console.log(`✅ Successfully seeded Comprehensive Model Paper with ${mockOrder - 1} questions.`);
  }

  console.log('🎉 SSW Automobile seeding completed successfully!');
}

module.exports = { seedSSWAutomobile };

if (require.main === module) {
  seedSSWAutomobile()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
