const { query } = require('c:/Users/tharu/OneDrive/Documents/Yuzuki Japan College exam/backend/src/config/database');

function resolveExamCategory(exam) {
  const code = (exam.course_code || '').toUpperCase();
  const title = (exam.title || '').toUpperCase();

  // 1. Authoritative Course Code Matches (Explicit Mapping)
  if (code === 'JLPT-N5') return 'JLPT-N5';
  if (code === 'JLPT-N4') return 'JLPT-N4';
  if (code === 'JLPT-N3') return 'JLPT-N3';
  if (code === 'JFT-BASIC') return 'JFT-BASIC';
  if (code === 'SSW2-ACCOMMODATION') return 'SSW2-ACCOMMODATION';
  if (code === 'SSW-FOOD-MANUFACTURING') return 'SSW-FOOD-MANUFACTURING';
  if (code === 'SSW-CONSTRUCTION') return 'SSW-CONSTRUCTION';
  if (code === 'SSW-AIRPORT-GROUND') return 'SSW-AIRPORT-GROUND';
  if (code === 'SSW-FOOD-SERVICE') return 'SSW-FOOD-SERVICE';
  if (code === 'SSW-CAREGIVER') return 'SSW-CAREGIVER';
  if (code === 'SSW-AGRICULTURE') return 'SSW-AGRICULTURE';
  if (code === 'SSW-ACCOMMODATION') return 'SSW-ACCOMMODATION';
  if (code === 'SSW-AUTOMOBILE') return 'SSW-AUTOMOBILE';
  if (code === 'SSW-TRUCK-DRIVING') return 'SSW-TRUCK-DRIVING';

  // 2. Fallback Title Matching for dynamic or unmapped records
  if (title.includes('JLPT N5') || (title.includes('N5') && title.includes('JLPT'))) return 'JLPT-N5';
  if (title.includes('JLPT N4') || (title.includes('N4') && title.includes('JLPT')) || (exam.id >= 159 && exam.id <= 168)) return 'JLPT-N4';
  if (title.includes('JLPT N3') || (title.includes('N3') && title.includes('JLPT'))) return 'JLPT-N3';
  if (title.includes('JFT')) return 'JFT-BASIC';
  if (title.includes('SSW 2') || title.includes('特定技能2号') || title.includes('2号')) return 'SSW2-ACCOMMODATION';
  if (title.includes('FOOD MANUFACTURING') || title.includes('飲食料品製造') || title.includes('製造業')) return 'SSW-FOOD-MANUFACTURING';
  if (title.includes('CONSTRUCTION') || title.includes('建設') || title.includes('土木') || title.includes('型枠') || title.includes('鉄筋')) return 'SSW-CONSTRUCTION';
  if (title.includes('AVIATION') || title.includes('AIRPORT') || title.includes('航空') || title.includes('グランドハンドリング')) return 'SSW-AIRPORT-GROUND';
  if ((title.includes('FOOD') && !title.includes('MANUFACTURING')) || title.includes('RESTAURANT') || title.includes('外食')) return 'SSW-FOOD-SERVICE';
  if (title.includes('CAREGIVER') || title.includes('NURSING') || title.includes('介護')) return 'SSW-CAREGIVER';
  if (title.includes('AGRI') || title.includes('農業')) return 'SSW-AGRICULTURE';
  if (title.includes('ACCOM') || title.includes('宿泊')) return 'SSW-ACCOMMODATION';
  if (title.includes('AUTO') || title.includes('自動車整備')) return 'SSW-AUTOMOBILE';
  if (title.includes('TRUCK') || title.includes('トラック') || title.includes('運送')) return 'SSW-TRUCK-DRIVING';

  return code || 'UNKNOWN';
}

function isJlptFreeCategory(categoryCode) {
  return ['JLPT-N5', 'JLPT-N4', 'JLPT-N3'].includes(categoryCode);
}

async function runTest() {
  const allExams = await query.all(`
    SELECT e.id, e.title, e.is_active, e.course_id, c.code as course_code, c.name as course_name
    FROM exams e
    LEFT JOIN courses c ON e.course_id = c.id
    ORDER BY e.id ASC
  `);

  console.log('=== AUTHORITATIVE CATEGORIZATION AUDIT ===');
  let activeFreeCount = 0;
  let archivedFreeCount = 0;
  let activePaidCount = 0;
  let archivedPaidCount = 0;
  const activePaidByCategory = {};

  for (const ex of allExams) {
    const resolved = resolveExamCategory(ex);
    const isFree = isJlptFreeCategory(resolved);
    
    if (ex.is_active === 1) {
      if (isFree) {
        activeFreeCount++;
      } else {
        activePaidCount++;
        activePaidByCategory[resolved] = (activePaidByCategory[resolved] || 0) + 1;
      }
    } else {
      if (isFree) {
        archivedFreeCount++;
      } else {
        archivedPaidCount++;
      }
    }
  }

  console.log('1. Total all exams:', allExams.length);
  console.log('2. Total active exams:', activeFreeCount + activePaidCount);
  console.log('3. Total archived exams:', archivedFreeCount + archivedPaidCount);
  console.log('4. Active FREE exams:', activeFreeCount);
  console.log('5. Archived FREE exams:', archivedFreeCount);
  console.log('6. Active PAID exams:', activePaidCount);
  console.log('7. Archived PAID exams:', archivedPaidCount);
  console.log('8. Active PAID breakdown by exact category:', activePaidByCategory);

  const exam6 = allExams.find(e => e.id === 6);
  console.log('9. Exam ID 6:', {
    id: exam6.id,
    title: exam6.title,
    is_active: exam6.is_active,
    status: exam6.is_active === 0 ? 'Archived (Hidden)' : 'Active',
    course_code: exam6.course_code,
    category: resolveExamCategory(exam6)
  });
}

runTest().catch(console.error);
