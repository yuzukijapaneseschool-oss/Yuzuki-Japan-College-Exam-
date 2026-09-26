-- ============================================================================
-- V2__enterprise_normalized_architecture.sql
-- YUZUKI JAPAN COLLEGE — ENTERPRISE NORMALIZED ARCHITECTURE MIGRATION
-- Non-Destructive, Additive DDL with Strict Referential Integrity
-- ============================================================================

PRAGMA foreign_keys = ON;

-- Extend existing tables safely
-- ALTER TABLE users ADD COLUMN person_id INTEGER REFERENCES persons(id) ON DELETE SET NULL;
-- ALTER TABLE exam_attempts ADD COLUMN exam_registration_id INTEGER REFERENCES exam_registrations(id) ON DELETE SET NULL;

-- 1. Master Identity: persons
CREATE TABLE IF NOT EXISTS persons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  person_uuid TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  name_with_initials TEXT NOT NULL,
  nic_number TEXT UNIQUE,
  passport_number TEXT UNIQUE,
  dob DATE,
  gender TEXT DEFAULT 'other' CHECK(gender IN ('male', 'female', 'other')),
  primary_phone TEXT NOT NULL,
  whatsapp_phone TEXT,
  primary_email TEXT NOT NULL UNIQUE,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT DEFAULT 'Kandy',
  district TEXT DEFAULT 'Kandy',
  postal_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  is_deleted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Academic Profile: students
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL UNIQUE, -- e.g. YJ-000001
  person_id INTEGER NOT NULL UNIQUE,
  legacy_user_id INTEGER UNIQUE,
  enrollment_status TEXT NOT NULL DEFAULT 'active' CHECK(enrollment_status IN ('pending', 'active', 'suspended', 'graduated', 'archived')),
  admission_date DATE DEFAULT (DATE('now')),
  batch_mode_preference TEXT DEFAULT 'physical_kandy',
  medical_notes TEXT,
  general_notes TEXT,
  is_deleted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE RESTRICT,
  FOREIGN KEY (legacy_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Master Academic Programs: programs
CREATE TABLE IF NOT EXISTS programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_code TEXT NOT NULL UNIQUE, -- YJP, YTD, YAG
  program_name TEXT NOT NULL,
  sector_category TEXT NOT NULL,
  default_duration_months INTEGER NOT NULL DEFAULT 6,
  target_qualification TEXT NOT NULL,
  monthly_tuition_lkr REAL NOT NULL DEFAULT 0.00,
  full_course_fee_lkr REAL NOT NULL DEFAULT 0.00,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Multi-Program Enrollments: program_registrations
CREATE TABLE IF NOT EXISTS program_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_id TEXT NOT NULL UNIQUE, -- e.g. YJP-2026-000001, YTD-2026-000001, YAG-2026-000001
  student_id INTEGER NOT NULL,
  program_id INTEGER NOT NULL,
  registration_date DATE DEFAULT (DATE('now')),
  status TEXT NOT NULL DEFAULT 'registered' CHECK(status IN ('applied', 'registered', 'in_training', 'completed', 'suspended', 'withdrawn', 'archived')),
  delivery_mode TEXT DEFAULT 'physical_kandy',
  tuition_agreed_lkr REAL NOT NULL DEFAULT 0.00,
  payment_plan TEXT DEFAULT 'monthly_installments' CHECK(payment_plan IN ('full_upfront', 'monthly_installments', 'scholarship', 'sponsored')),
  completion_date DATE,
  certificate_issued INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE RESTRICT
);

-- 5. Batches / Cohorts: batches
CREATE TABLE IF NOT EXISTS batches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_code TEXT NOT NULL UNIQUE, -- e.g. YJP-BATCH-06-KANDY
  program_id INTEGER NOT NULL,
  batch_name TEXT NOT NULL,
  intake_year INTEGER NOT NULL,
  intake_month INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  lead_teacher_name TEXT NOT NULL DEFAULT 'Sensei Lahiru Dilshan',
  max_capacity INTEGER NOT NULL DEFAULT 35,
  current_enrollment_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('scheduled', 'in_progress', 'completed', 'archived')),
  is_deleted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE RESTRICT
);

-- 6. Batch Enrollments: batch_enrollments
CREATE TABLE IF NOT EXISTS batch_enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_registration_id INTEGER NOT NULL,
  batch_id INTEGER NOT NULL,
  assigned_date DATE DEFAULT (DATE('now')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'transferred', 'completed', 'dropped')),
  transfer_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_registration_id) REFERENCES program_registrations(id) ON DELETE RESTRICT,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE RESTRICT,
  UNIQUE(program_registration_id, batch_id)
);

-- 7. Classroom Sessions: class_sessions
CREATE TABLE IF NOT EXISTS class_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id INTEGER NOT NULL,
  session_code TEXT NOT NULL UNIQUE,
  topic_title TEXT NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME DEFAULT '09:00',
  end_time TIME DEFAULT '12:00',
  teacher_name TEXT DEFAULT 'Sensei Lahiru Dilshan',
  delivery_type TEXT DEFAULT 'physical' CHECK(delivery_type IN ('physical', 'online_zoom', 'lab_practical')),
  status TEXT DEFAULT 'conducted' CHECK(status IN ('scheduled', 'conducted', 'cancelled', 'rescheduled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE RESTRICT
);

-- 8. Attendance Log: attendance
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_session_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  program_registration_id INTEGER NOT NULL,
  attendance_status TEXT NOT NULL CHECK(attendance_status IN ('present', 'absent', 'late', 'excused_medical', 'leave_approved')),
  minutes_late INTEGER DEFAULT 0,
  recorded_by_staff TEXT DEFAULT 'System',
  remarks TEXT,
  timestamp_recorded DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_session_id) REFERENCES class_sessions(id) ON DELETE RESTRICT,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  FOREIGN KEY (program_registration_id) REFERENCES program_registrations(id) ON DELETE RESTRICT,
  UNIQUE(class_session_id, student_id)
);

-- 9. Exam Types: exam_types
CREATE TABLE IF NOT EXISTS exam_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type_code TEXT NOT NULL UNIQUE, -- JLPT-N5, JLPT-N4, JLPT-N3, JFT-BASIC, SSW-TRUCK-DRIVING, SSW-AIRPORT-GROUND
  type_name TEXT NOT NULL,
  governing_body TEXT NOT NULL,
  default_duration_minutes INTEGER NOT NULL DEFAULT 60,
  default_total_marks INTEGER NOT NULL DEFAULT 250,
  default_passing_score INTEGER NOT NULL DEFAULT 200,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Program Exam Eligibility Matrix: program_exam_requirements
CREATE TABLE IF NOT EXISTS program_exam_requirements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_id INTEGER NOT NULL,
  exam_type_id INTEGER NOT NULL,
  requirement_type TEXT NOT NULL CHECK(requirement_type IN ('mandatory', 'optional_mock', 'prerequisite', 'exit_qualification')),
  minimum_attendance_pct_required INTEGER DEFAULT 80,
  minimum_fees_paid_pct_required INTEGER DEFAULT 100,
  max_free_attempts_allowed INTEGER DEFAULT 10,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE RESTRICT,
  FOREIGN KEY (exam_type_id) REFERENCES exam_types(id) ON DELETE RESTRICT,
  UNIQUE(program_id, exam_type_id)
);

-- 11. Exam Sittings / Papers: exam_sessions
CREATE TABLE IF NOT EXISTS exam_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_code TEXT NOT NULL UNIQUE,
  exam_type_id INTEGER NOT NULL,
  legacy_exam_id INTEGER,
  paper_title TEXT NOT NULL,
  session_date DATE DEFAULT (DATE('now')),
  start_window DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_window DATETIME DEFAULT (DATETIME('now', '+365 days')),
  total_marks INTEGER NOT NULL DEFAULT 250,
  passing_score INTEGER NOT NULL DEFAULT 200,
  status TEXT DEFAULT 'open' CHECK(status IN ('draft', 'open', 'in_progress', 'closed', 'graded', 'archived')),
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_type_id) REFERENCES exam_types(id) ON DELETE RESTRICT,
  FOREIGN KEY (legacy_exam_id) REFERENCES exams(id) ON DELETE SET NULL
);

-- 12. Exam Registrations / Booking: exam_registrations
CREATE TABLE IF NOT EXISTS exam_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_registration_id TEXT NOT NULL UNIQUE, -- e.g. JLPT-2026-000001, JFT-2026-000001
  student_id INTEGER NOT NULL,
  program_registration_id INTEGER NOT NULL,
  exam_session_id INTEGER NOT NULL,
  booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  eligibility_verified_by_staff TEXT DEFAULT 'Auto Verified',
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('requested', 'confirmed', 'attended', 'absent', 'cancelled', 'disqualified')),
  seat_number TEXT,
  access_token TEXT UNIQUE,
  is_deleted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  FOREIGN KEY (program_registration_id) REFERENCES program_registrations(id) ON DELETE RESTRICT,
  FOREIGN KEY (exam_session_id) REFERENCES exam_sessions(id) ON DELETE RESTRICT,
  UNIQUE(exam_session_id, student_id)
);

-- 13. Exam Section Results: exam_section_results
CREATE TABLE IF NOT EXISTS exam_section_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_attempt_id INTEGER NOT NULL,
  section_name TEXT NOT NULL,
  score_obtained INTEGER NOT NULL,
  max_section_marks INTEGER NOT NULL,
  percentage REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE
);

-- 14. Billing: invoices
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT NOT NULL UNIQUE, -- e.g. INV-2026-000042
  student_id INTEGER NOT NULL,
  program_registration_id INTEGER,
  invoice_date DATE DEFAULT (DATE('now')),
  due_date DATE DEFAULT (DATE('now', '+30 days')),
  subtotal_amount REAL NOT NULL,
  discount_amount REAL DEFAULT 0.00,
  total_amount REAL NOT NULL,
  paid_amount REAL DEFAULT 0.00,
  balance_due REAL NOT NULL,
  currency TEXT DEFAULT 'LKR' CHECK(currency IN ('LKR', 'USD', 'JPY')),
  status TEXT DEFAULT 'unpaid' CHECK(status IN ('draft', 'unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled', 'adjusted')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  FOREIGN KEY (program_registration_id) REFERENCES program_registrations(id) ON DELETE RESTRICT
);

-- 15. Invoice Line Items: invoice_items
CREATE TABLE IF NOT EXISTS invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  unit_price REAL NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_line_amount REAL NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT
);

-- 16. Financial Adjustments & Reversals: payment_adjustments
CREATE TABLE IF NOT EXISTS payment_adjustments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adjustment_number TEXT NOT NULL UNIQUE, -- e.g. ADJ-2026-000005
  original_payment_id INTEGER NOT NULL,
  invoice_id INTEGER,
  adjustment_type TEXT NOT NULL CHECK(adjustment_type IN ('full_reversal', 'partial_refund', 'fee_waiver', 'credit_note', 'bank_charge_adjustment')),
  adjustment_amount REAL NOT NULL,
  reason TEXT NOT NULL,
  authorized_by_admin TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (original_payment_id) REFERENCES payments(id) ON DELETE RESTRICT,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
);

-- 17. Document Versions: document_versions
CREATE TABLE IF NOT EXISTS document_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  version_number INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL DEFAULT 0,
  file_mime_type TEXT DEFAULT 'image/jpeg',
  sha256_checksum TEXT,
  uploaded_by_user_id INTEGER,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES student_documents(id) ON DELETE RESTRICT,
  FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(document_id, version_number)
);

-- ============================================================================
-- PERFORMANCE & INTEGRITY INDICES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_persons_nic ON persons(nic_number);
CREATE INDEX IF NOT EXISTS idx_persons_email ON persons(primary_email);
CREATE INDEX IF NOT EXISTS idx_students_pid ON students(person_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(enrollment_status);
CREATE INDEX IF NOT EXISTS idx_prog_reg_student ON program_registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_prog_reg_prog ON program_registrations(program_id, status);
CREATE INDEX IF NOT EXISTS idx_batches_prog ON batches(program_id, status);
CREATE INDEX IF NOT EXISTS idx_batch_enrollment_batch ON batch_enrollments(batch_id, status);
CREATE INDEX IF NOT EXISTS idx_attendance_student_prog ON attendance(student_id, program_registration_id);
CREATE INDEX IF NOT EXISTS idx_prog_exam_req ON program_exam_requirements(program_id, exam_type_id);
CREATE INDEX IF NOT EXISTS idx_exam_session_type ON exam_sessions(exam_type_id, status);
CREATE INDEX IF NOT EXISTS idx_exam_reg_student ON exam_registrations(student_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_student ON invoices(student_id, status);
CREATE INDEX IF NOT EXISTS idx_adj_payment ON payment_adjustments(original_payment_id);
CREATE INDEX IF NOT EXISTS idx_doc_versions_doc ON document_versions(document_id);
