const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

const LOCAL_DATA_FILE = path.join(__dirname, 'ssw_aviation_progress.json');
const SCRATCH_DATA_FILE = 'C:/Users/tharu/.gemini/antigravity/brain/f23ab097-1f23-47e8-9ca0-12b1dbf8d6bd/scratch/ssw_aviation_progress.json';

const MODULE_CONFIG = [
  {
    code: 'AVIATION_MOD1',
    title: 'SSW Aviation Module 1: Fastening Work & Hardware (締結作業・締結部品)',
    sectionName: 'Fastening Work (締結作業)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Aviation bolts, nuts, washers, torque wrench standards, cotter pins, safety wiring (lock wire), rivets, and Hi-Lok fasteners (28 Questions).'
  },
  {
    code: 'AVIATION_MOD2',
    title: 'SSW Aviation Module 2: Electrical Measurement & Tools (電気計測・測定機器)',
    sectionName: 'Electrical Measurement (電気計測・測定)',
    durationMinutes: 25,
    passingScore: 60,
    description: 'Multimeters, continuity checks, 28V DC / 115V AC (400Hz) aircraft standards, bonding checks, Megger insulation, ESD safety, calipers, and wire stripping (24 Questions).'
  },
  {
    code: 'AVIATION_MOD3',
    title: 'SSW Aviation Module 3: Aviation Safety & FOD Prevention (航空安全・異物混入防止)',
    sectionName: 'Aviation Safety & FOD Prevention (航空安全・FOD防止)',
    durationMinutes: 25,
    passingScore: 60,
    description: 'FOD detection and walk sweeps, tool count accountability, shadow boards, jet engine intake/exhaust hazard zones, PPE, and hot brake safety (25 Questions).'
  },
  {
    code: 'AVIATION_MOD4',
    title: 'SSW Aviation Module 4: Quality Control & Maintenance Procedures (品質管理・作業手順書)',
    sectionName: 'Quality Control & Maintenance Rules (品質管理・作業手順)',
    durationMinutes: 25,
    passingScore: 60,
    description: 'AMM, SRM, WDM, IPC manuals, sign-off integrity, double inspection (RII), near-miss reporting (Hiyari-Hatto), 5S methodology, and tool calibration (25 Questions).'
  },
  {
    code: 'AVIATION_MOD5',
    title: 'SSW Aviation Module 5: Aircraft Structure & Flight Principles (航空機構造・飛行力学)',
    sectionName: 'Aircraft Structure & Flight Principles (航空機構造・飛行原理)',
    durationMinutes: 25,
    passingScore: 60,
    description: 'Four forces of flight, Bernoulli principle, 3-axis control (aileron, elevator, rudder), high-lift devices (flaps/slats), spoilers, CFRP composites, and semi-monocoque fuselage (25 Questions).'
  },
  {
    code: 'AVIATION_MOD6',
    title: 'SSW Aviation Module 6: Aircraft Systems & Engines (航空機システム・推進装置)',
    sectionName: 'Aircraft Systems & Engines (航空機システム・推進装置)',
    durationMinutes: 25,
    passingScore: 60,
    description: 'Turbofan jet engines, APU, Jet A-1 fuel, 3,000 psi hydraulic systems, Skydrol fluids, bleed air conditioning, thrust reversers, and emergency RAT deployment (25 Questions).'
  },
  {
    code: 'AVIATION_MOD7',
    title: 'SSW Aviation Module 7: Ramp Operations & Marshalling (ランプハンドリング・機体誘導)',
    sectionName: 'Ramp Operations & Marshalling (ランプハンドリング・航空機誘導)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'Marshalling hand signals, wheel chocks, pushback towing, bypass pins, headset communications, and wing walker clearances (30 Questions).'
  },
  {
    code: 'AVIATION_MOD8',
    title: 'SSW Aviation Module 8: Baggage, Cargo & GSE Operations (手荷物・貨物取扱・GSE車両)',
    sectionName: 'Baggage, Cargo & GSE Operations (手荷物・貨物・特殊車両)',
    durationMinutes: 30,
    passingScore: 60,
    description: 'GSE vehicles (belt loaders, high loaders, GPU, ASU), ULD containers, cargo door sill protectors, floor cargo locks, cargo nets, and baggage loading ergonomics (30 Questions).'
  },
  {
    code: 'AVIATION_MOD9',
    title: 'SSW Aviation Module 9: Apron Safety & Dangerous Goods (エプロン安全・危険物取扱)',
    sectionName: 'Apron Safety & Dangerous Goods (エプロン安全・危険物)',
    durationMinutes: 20,
    passingScore: 60,
    description: 'Equipment Restraint Area (ERA), IATA Dangerous Goods Regulations (DGR), lithium battery restrictions, dry ice handling, fueling bonding, and forklift safety (20 Questions).'
  },
  {
    code: 'AVIATION_MOD10',
    title: 'SSW Aviation Module 10: Adverse Weather & Emergency Response (悪天候・緊急時対応)',
    sectionName: 'Adverse Weather & Emergency (悪天候・緊急対応)',
    durationMinutes: 20,
    passingScore: 60,
    description: 'De-icing and anti-icing fluids (Type I/IV), Holdover Time (HOT), Clean Aircraft Concept, aircraft tie-down in typhoons, fuel spill shutoff, fire classes, and slide safety (20 Questions).'
  },
  {
    code: 'AVIATION_EXAM_MODEL',
    title: 'SSW Aviation Comprehensive Model Examination (航空業総合模擬試験)',
    sectionName: 'Comprehensive Model Exam (航空業総合模擬試験)',
    durationMinutes: 60,
    passingScore: 60,
    description: 'Official 45-question CBT model examination covering the complete SSW Aviation & Airport Ground Handling assessment syllabus (45 Questions).'
  }
];

async function seedSSWAviation() {
  console.log('✈️ Starting SSW Aviation & Airport Ground Handling (航空業・空港グランドハンドリング) Database Seeding...');

  // 1. Ensure SSW-AIRPORT-GROUND course exists
  let course = await query.get("SELECT id FROM courses WHERE code = 'SSW-AIRPORT-GROUND'");
  if (!course) {
    const courseRes = await query.run(`
      INSERT INTO courses (code, name, category, description)
      VALUES (?, ?, ?, ?)
    `, [
      'SSW-AIRPORT-GROUND',
      'SSW - Airport Ground Handling & Aviation (空港グランドハンドリング・航空業)',
      'Specified Skilled Worker (SSW)',
      'Official Japan Aviation assessment curriculum covering Fastening, Electrical Measurement, Work Safety, Quality Control, Aviation Overview, Ramp Operations, Baggage & Cargo GSE, Apron Safety, and Comprehensive CBT Model Exam.'
    ]);
    course = { id: courseRes.id };
  } else {
    await query.run(`
      UPDATE courses 
      SET name = ?, description = ?, category = 'Specified Skilled Worker (SSW)'
      WHERE id = ?
    `, [
      'SSW - Airport Ground Handling & Aviation (空港グランドハンドリング・航空業)',
      'Official Japan Aviation assessment curriculum covering Fastening, Electrical Measurement, Work Safety, Quality Control, Aviation Overview, Ramp Operations, Baggage & Cargo GSE, Apron Safety, and Comprehensive CBT Model Exam.',
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
    console.warn('⚠️ No SSW Aviation question data found in JSON files.');
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

  console.log(`🎉 SSW Aviation Seeding Complete! Total questions inserted: ${totalQuestionsInserted}`);
}

module.exports = { seedSSWAviation };
