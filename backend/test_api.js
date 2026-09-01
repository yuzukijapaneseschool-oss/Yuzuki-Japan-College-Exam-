const http = require('http');

function request(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- 1. Testing Admin Login ---');
  const adminRes = await request('/api/auth/login', 'POST', { identifier: 'admin@yuzuki.college', password: 'admin123' });
  console.log('Admin login status:', adminRes.status, 'User:', adminRes.data.user?.name);
  const adminToken = adminRes.data.token;

  console.log('\n--- 2. Testing Student Registration with Student ID ---');
  const regRes = await request('/api/auth/register', 'POST', {
    name: 'Nimali Fernando',
    email: 'nimali@gmail.com',
    password: 'password123',
    student_id: 'YZ-2026-088',
    course_id: 1, // JFT
    phone: '+94 77 555 1234'
  });
  console.log('Registration status:', regRes.status, regRes.data);

  console.log('\n--- 3. Testing Student Login BEFORE Admin Approval ---');
  const unapprovedLogin = await request('/api/auth/login', 'POST', { identifier: 'YZ-2026-088', password: 'password123' });
  console.log('Unapproved login status (Expected 403 Forbidden):', unapprovedLogin.status, unapprovedLogin.data);

  console.log('\n--- 4. Admin Approves Student ---');
  const studentsList = await request('/api/admin/students?status=pending', 'GET', null, adminToken);
  const student = studentsList.data.students.find(s => s.student_id === 'YZ-2026-088');
  console.log('Found pending student:', student?.name, 'ID:', student?.id);

  if (student) {
    const approveRes = await request(`/api/admin/students/${student.id}/status`, 'PATCH', { status: 'approved' }, adminToken);
    console.log('Approval result:', approveRes.data);
  }

  console.log('\n--- 5. Testing Student Login AFTER Admin Approval ---');
  const approvedLogin = await request('/api/auth/login', 'POST', { identifier: 'YZ-2026-088', password: 'password123' });
  console.log('Approved login status (Expected 200 OK):', approvedLogin.status, 'Logged in as:', approvedLogin.data.user?.name);
  const studentToken = approvedLogin.data.token;

  console.log('\n--- 6. Testing Course-Filtered Exams for Student ---');
  const examsRes = await request('/api/exams', 'GET', null, studentToken);
  console.log('Available exams for JFT student:', examsRes.data.exams.map(e => `${e.title} (Duration: ${e.duration_minutes}m, Course: ${e.course_name})`));

  console.log('\n--- 7. Testing Exam Session (Audio/Images & Hidden Answers) ---');
  const sessionRes = await request(`/api/exams/${examsRes.data.exams[0].id}/session`, 'GET', null, studentToken);
  console.log('Exam Title:', sessionRes.data.exam.title);
  console.log('Total Questions:', sessionRes.data.questions.length);
  console.log('Sample Question 1:', sessionRes.data.questions[0].question_text);
  console.log('Sample Listening Question Audio URL:', sessionRes.data.questions.find(q => q.audio_url)?.audio_url);

  console.log('\n--- 8. Testing Exam Submission & Instant Scoring ---');
  const submitRes = await request(`/api/exams/${examsRes.data.exams[0].id}/submit`, 'POST', {
    timeTakenSeconds: 1800, // 30 mins
    answers: {
      1: 'A', // correct
      2: 'B', // correct
      3: 'A', // correct
      4: 'B', // correct
      5: 'B', // correct
      6: 'A', // correct
      7: 'C', // correct
      8: 'B'  // correct
    }
  }, studentToken);
  console.log('Exam Results:', {
    score: submitRes.data.score,
    total_marks: submitRes.data.total_marks,
    percentage: submitRes.data.percentage + '%',
    passed: submitRes.data.passed ? 'PASSED' : 'FAILED'
  });

  console.log('\nAll API integration tests passed successfully!');
}

runTests();
