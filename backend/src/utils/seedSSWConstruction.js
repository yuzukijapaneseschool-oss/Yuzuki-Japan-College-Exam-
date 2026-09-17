const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

const LOCAL_DATA_FILE = path.join(__dirname, 'ssw_construction_progress.json');
const SCRATCH_DATA_FILE = 'C:/Users/tharu/.gemini/antigravity/brain/f23ab097-1f23-47e8-9ca0-12b1dbf8d6bd/scratch/ssw_construction_progress.json';

const MODULE_CONFIG = [
  {
    code: 'CONSTRUCTION_MOD1',
    title: 'SSW Construction Module 1: Site Basics (現場の基本 / 現場基礎知識)',
    sectionName: 'Site Basics (現場基礎知識)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Site safety rules, morning assembly (Chourei), KYK hazard prediction, 5S principles, PPE, hazard signs, radio callouts, and heatstroke prevention (34 Questions).'
  },
  {
    code: 'CONSTRUCTION_MOD2',
    title: 'SSW Construction Module 2: Laws and Regulations (法令・安全衛生法規)',
    sectionName: 'Laws and Safety Regulations (法令・安全衛生)',
    durationMinutes: 45,
    passingScore: 60,
    description: 'Industrial Safety and Health Act, Construction Business Act, Operations Chiefs, Special Education, heights work, scaffolding laws, and excavation slope regulations (79 Questions).'
  },
  {
    code: 'CONSTRUCTION_MOD3',
    title: 'SSW Construction Module 3: Types of Construction Work (建設工事の種類・工種)',
    sectionName: 'Types of Construction Work (工種・施工技術)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'Structural framing, rebar work, scaffolding, formwork, concrete placing, interior finishing, plastering, painting, waterproofing, plumbing, civil earthwork, and demolition (135 Questions).'
  },
  {
    code: 'CONSTRUCTION_MOD4',
    title: 'SSW Construction Module 4: Site Manners (現場マナー・モラル・近隣配慮)',
    sectionName: 'Site Manners & Neighborhood (現場マナー・モラル)',
    durationMinutes: 40,
    passingScore: 60,
    description: 'Site etiquette, greetings, punctuality, neighborhood noise/vibration mitigation, dust control, traffic control, waste sorting, and emergency response (67 Questions).'
  },
  {
    code: 'CONSTRUCTION_MOD5',
    title: 'SSW Construction Module 5: Civil Engineering 1 - Earthwork, Foundation & Paving (土木1: 土工・基礎・舗装工事)',
    sectionName: 'Civil Engineering: Earthwork & Paving (土工・舗装)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Soil classification, cuts & fills, compaction, retaining walls, deep foundation piles, asphalt pavement layers, and drainage trenches (30 Questions).'
  },
  {
    code: 'CONSTRUCTION_MOD6',
    title: 'SSW Construction Module 6: Civil Engineering 2 - Tunnel, Bridge & River Construction (土木2: トンネル・橋梁・河川工事)',
    sectionName: 'Civil Engineering: Structures & River (構造物・河川)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Mountain NATM & Shield tunneling, bridge substructures & superstructures, bearings, expansion joints, river levees, revetments, cofferdams, and Sabo dams (30 Questions).'
  },
  {
    code: 'CONSTRUCTION_MOD7',
    title: 'SSW Construction Module 7: Building Construction 1 - Reinforcing Bar, Scaffolding & Formwork (建築1: 鉄筋・足場・型枠工)',
    sectionName: 'Building Structure: Rebar, Scaffolding & Formwork (構造躯体工)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Rebar cover thickness, bend radius, lap splices, scaffolding cross-bracing & wall ties, lateral concrete pressure, formwork separators, and P-cones (30 Questions).'
  },
  {
    code: 'CONSTRUCTION_MOD8',
    title: 'SSW Construction Module 8: Building Construction 2 - Interior Finishing, Waterproofing & Plastering (建築2: 内装仕上げ・防水・左官工)',
    sectionName: 'Building Finishes: Drywall, Waterproofing & Plastering (仕上・防水工)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'LGS framing & gypsum drywall, joint putty, caulking & sealants, urethane/sheet/asphalt waterproofing, plaster mortar mixing, self-leveling, and tile setting (30 Questions).'
  },
  {
    code: 'CONSTRUCTION_MOD9',
    title: 'SSW Construction Module 9: Heavy Machinery & Hydraulic Excavators (設備・重機1: 油圧ショベル・車両系建設機械)',
    sectionName: 'Heavy Machinery & Hydraulic Excavators (重機・建設機械)',
    durationMinutes: 25,
    passingScore: 60,
    description: 'Hydraulic excavators, bulldozers, motor graders, wheel loaders, crane-function excavators, blind-spot safety, pre-operation daily checks, and outriggers (25 Questions).'
  },
  {
    code: 'CONSTRUCTION_MOD10',
    title: 'SSW Construction Module 10: Plumbing, Electrical & Piping Equipment (設備・配管2: 設備・電気・給排水衛生工)',
    sectionName: 'MEP: Plumbing, HVAC & Electrical Equipment (設備・配管・電気)',
    durationMinutes: 25,
    passingScore: 60,
    description: 'PVC & copper piping, solvent & threaded joints, drainage slope & vent piping, HVAC ducts & fire dampers, electrical conduit, and earthing/grounding safety (25 Questions).'
  },
  {
    code: 'CONSTRUCTION_MOD11',
    title: 'SSW Construction Comprehensive CBT Model Examination (建設業総合模擬試験)',
    sectionName: 'Comprehensive CBT Model Examination (建設業総合模擬試験)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'Official 45-question CBT model examination covering the complete SSW Construction Industry assessment syllabus (45 Questions).'
  }
];

async function seedSSWConstruction() {
  console.log('🏗️ Starting SSW Construction Industry (特定技能 建設業 - 土木・建築・設備) Database Seeding...');

  // 1. Ensure SSW-CONSTRUCTION course exists
  let course = await query.get("SELECT id FROM courses WHERE code = 'SSW-CONSTRUCTION'");
  if (!course) {
    const courseRes = await query.run(`
      INSERT INTO courses (code, name, category, description)
      VALUES (?, ?, ?, ?)
    `, [
      'SSW-CONSTRUCTION',
      'SSW - Construction Industry (特定技能 建設業 - 土木・建築・設備)',
      'Specified Skilled Worker (SSW)',
      'Official Japan Construction assessment curriculum covering Site Basics, Laws & Safety Regulations, Types of Construction Work, Site Manners, Civil Engineering, Building Construction, Heavy Equipment, Plumbing/Electrical, and Comprehensive CBT Model Exam.'
    ]);
    course = { id: courseRes.id };
  } else {
    await query.run(`
      UPDATE courses 
      SET name = ?, description = ?, category = 'Specified Skilled Worker (SSW)'
      WHERE id = ?
    `, [
      'SSW - Construction Industry (特定技能 建設業 - 土木・建築・設備)',
      'Official Japan Construction assessment curriculum covering Site Basics, Laws & Safety Regulations, Types of Construction Work, Site Manners, Civil Engineering, Building Construction, Heavy Equipment, Plumbing/Electrical, and Comprehensive CBT Model Exam.',
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
    console.warn('⚠️ No SSW Construction question data found in JSON files.');
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

  console.log(`🎉 SSW Construction Seeding Complete! Total questions inserted: ${totalQuestionsInserted}`);
}

module.exports = { seedSSWConstruction };
