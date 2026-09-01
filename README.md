# 🌸 YUZUKI Japan College - Examination & Quiz Portal
**ゆづき日本カレッジ • Online Examination & Quiz Management Platform**

A full-stack, responsive web application designed for **YUZUKI Japan College** to administer timed Japanese examinations (like 60-minute JFT papers and JLPT mock exams) with rich multimedia (listening tracks & image diagrams), student ID authentication, admin approval workflows, and automated grading.

---

## ✨ Key Features

### 🎓 1. Student Authentication & Course Gating
- **Registration with Mandatory Student ID**: Students register with Name, Email, Password, **Student ID** (e.g. `YZ-2026-088`), and **Selected Course** (e.g. JFT-Basic A2, JLPT N5, JLPT N4, SSW).
- **Admin Approval Gate**: Newly registered student accounts remain in `Pending Approval` status until verified and approved by the college administrator.
- **Course-Restricted Exam Access**: When logged in, students only see exam papers assigned to their enrolled course.

### ⏱️ 2. Timed Japanese Exam & Quiz Engine
- **JFT 60-Minute Countdown Timer**: Real-time timer with progress indication, 5-minute remaining alert, and automated submission when time expires.
- **Audio & Music Support (Choukai / 聴解)**: Built-in custom audio player for Japanese listening comprehension questions with play/pause, seek, and replay.
- **Picture / Diagram Support (Dokkai / 読解)**: Image viewer for questions containing signs, charts, and reading passages.
- **Interactive Question Palette**: Easily jump to questions, view answered/unanswered counts, and flag questions for review.
- **Instant Scoring & Detailed Review**: Automatic score calculation, percentage, pass/fail determination, and question-by-question explanations with answer keys.

### 👑 3. Administrator Management Portal
- **Student ID Approvals**: View pending student sign-ups, check their Student IDs and courses, and approve or reject access with one click.
- **Quiz & Exam Builder**: Create exams, customize durations (e.g. 60 minutes), passing marks, and active/draft visibility.
- **Rich Media Question Editor**: Add questions with Japanese text, upload **Audio files (MP3/WAV)** for listening tracks, upload **Images (JPG/PNG)**, set 4 multiple choice options (A, B, C, D), mark the correct key, points, and explanations.
- **Results Analytics**: View all student submissions across the college, filter by course or Student ID, and inspect scores and time taken.
- **Course Management**: Add/edit college courses (JFT-Basic, JLPT N5, JLPT N4, JLPT N3, SSW).

---

## 🚀 How to Run

### Method 1: Single-Click Launch (Windows)
Double-click `start.bat` in the root folder. It will start the server and automatically open `http://localhost:5000` in your web browser.

### Method 2: Manual Terminal Run
```bash
# In the project root:
cd backend
node src/server.js
```
Then open `http://localhost:5000` in your browser.

---

## 🔑 Default Accounts for Testing

| Role | Email / Student ID | Password | Notes |
|---|---|---|---|
| **Admin** | `admin@yuzuki.college` | `admin123` | Full access to approval system, quiz builder, and results |
| **Approved Student (JFT)** | `student@yuzuki.college` (or `YZ-2026-001`) | `student123` | Enrolled in JFT-Basic with access to 60-minute JFT model paper |

---

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/database.js     # SQLite schema & auto-seeding
│   │   ├── controllers/           # Auth, Exam, Admin, Course controllers
│   │   ├── middleware/            # JWT auth & Multer audio/image uploads
│   │   ├── routes/                # Express API routes
│   │   └── server.js              # Express app & static SPA server
│   ├── uploads/
│   │   ├── audio/                 # Listening comprehension audio tracks
│   │   └── images/                # Question diagrams and pictures
│   └── data/yuzuki.db             # Persistent SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/            # AudioPlayer, Timer, Navbar, etc.
│   │   ├── pages/                 # Login, Register, Dashboard, ExamSession, ExamResult
│   │   ├── pages/admin/           # AdminDashboard, Approvals, QuizManager, QuestionEditor
│   │   ├── context/               # AuthContext state management
│   │   └── services/api.js        # API service client
│   └── dist/                      # Production compiled frontend bundle
├── start.bat                      # Windows launcher
└── README.md
```
