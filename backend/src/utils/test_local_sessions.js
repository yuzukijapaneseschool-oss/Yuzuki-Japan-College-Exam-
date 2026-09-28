const { query } = require('c:/Users/tharu/OneDrive/Documents/Yuzuki Japan College exam/backend/src/config/database');
const examController = require('c:/Users/tharu/OneDrive/Documents/Yuzuki Japan College exam/backend/src/controllers/examController');

async function testLocalExamSession(examId) {
  return new Promise((resolve) => {
    const req = {
      params: { id: String(examId) },
      user: null // Anonymous
    };

    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        resolve({
          examId,
          statusCode: this.statusCode,
          data
        });
      }
    };

    examController.getExamSession(req, res);
  });
}

(async () => {
  const testIds = [1, 26, 88, 4, 5, 66];
  console.log('=== LOCAL EXAM SESSION GATING TEST ===');
  
  for (const id of testIds) {
    const exam = await query.get(`
      SELECT e.id, e.title, c.code as course_code, c.name as course_name 
      FROM exams e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.id = ?
    `, [id]);

    const res = await testLocalExamSession(id);
    console.log(`\nExam ID: ${id}`);
    console.log(`Actual title: "${exam.title}"`);
    console.log(`Actual category (from course): "${exam.course_code}"`);
    console.log(`HTTP status: ${res.statusCode}`);
    console.log(`Displayed category in error: "${res.data.required_category}"`);
    console.log(`Error message: "${res.data.error}"`);
  }
})();
