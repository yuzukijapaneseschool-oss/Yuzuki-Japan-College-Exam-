const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { initDatabase, query } = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again after a few minutes.' }
});
app.use('/api', generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many failed sign-in attempts. Please try again in 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use('/images', express.static(path.resolve(__dirname, '../uploads/images')));
app.use('/images', express.static(path.resolve(__dirname, '../public/images')));
app.use('/audio', express.static(path.resolve(__dirname, '../uploads/audio')));
app.use('/audio', express.static(path.resolve(__dirname, '../public/audio')));
app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    college: 'YUZUKI Japan College',
    security: 'hardened (Anti-BruteForce, Rate-Limited, Helmet Protected)',
    version: '1.3.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));

const candidateDistPaths = [
  path.resolve(__dirname, '../public/dist'),
  path.resolve(__dirname, '../../backend/public/dist'),
  path.resolve(__dirname, '../../frontend/dist'),
  path.resolve(__dirname, '../frontend/dist'),
  path.resolve(__dirname, '../../dist'),
  path.resolve(__dirname, '../dist'),
  path.resolve(__dirname, './dist')
];

const frontendDist = candidateDistPaths.find(p => fs.existsSync(p));
if (frontendDist) {
  console.log('Serving production frontend bundle from:', frontendDist);
  app.use(express.static(frontendDist, {
    maxAge: '1d',
    setHeaders: (res, path) => {
      if (path.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

async function applySecuritySchemaMigrations() {
  try {
    await query.run('ALTER TABLE exam_attempts ADD COLUMN tab_switches_count INTEGER DEFAULT 0');
  } catch (e) {}

  try {
    // Unconditional point migration for all JFT exams to standard 250 Total Marks (200 Pass)
    const jftExams = await query.all("SELECT id FROM exams WHERE course_id = 1 OR title LIKE '%JFT%'");
    for (const e of jftExams) {
      await query.run('UPDATE exams SET duration_minutes = 60, passing_score = 200 WHERE id = ?', [e.id]);
      await query.run('UPDATE questions SET marks = 1 WHERE exam_id = ? AND order_num >= 1 AND order_num <= 5', [e.id]);
      await query.run('UPDATE questions SET marks = 2 WHERE exam_id = ? AND order_num >= 6 AND order_num <= 15', [e.id]);
      await query.run('UPDATE questions SET marks = 5 WHERE exam_id = ? AND order_num >= 16 AND order_num <= 60', [e.id]);
    }
    console.log(`[DB Migration] Applied standard JFT 250-mark structure to ${jftExams.length} JFT exams.`);
  } catch (e) {
    console.error('Migration error:', e);
  }
}

const { initAutoBackup } = require('./utils/dbBackup');
const { seedJftModelPaper01 } = require('./utils/seedJftModelPaper01');
const { seedJftModelPaper03 } = require('./utils/seedJftModelPaper03');
const { seedJftModelPaper04 } = require('./utils/seedJftModelPaper04');
const { seedJftModelPaper05 } = require('./utils/seedJftModelPaper05');
const { seedJftModelPaper06 } = require('./utils/seedJftModelPaper06');
const { seedJftModelPaper07 } = require('./utils/seedJftModelPaper07');
const { seedJftModelPaper08 } = require('./utils/seedJftModelPaper08');
const { seedJftModelPaper09 } = require('./utils/seedJftModelPaper09');
const { seedJftModelPaper10 } = require('./utils/seedJftModelPaper10');
const { seedJftModelPaper11 } = require('./utils/seedJftModelPaper11');
const { seedJftModelPaper12 } = require('./utils/seedJftModelPaper12');
const { seedSSWAutomobile } = require('./utils/seedSSWAutomobile');
const { seedSSWAccommodation } = require('./utils/seedSSWAccommodation');
const { seedSSWAgriculture } = require('./utils/seedSSWAgriculture');
const { seedSSWCaregiver } = require('./utils/seedSSWCaregiver');
const { seedSSWFoodService } = require('./utils/seedSSWFoodService');
const { seedSSWAviation } = require('./utils/seedSSWAviation');
const { seedSSWConstruction } = require('./utils/seedSSWConstruction');

async function safeRunSeed(seedFn, name) {
  try {
    if (typeof seedFn === 'function') {
      await seedFn();
    } else if (seedFn && typeof seedFn[name] === 'function') {
      await seedFn[name]();
    }
  } catch (e) {
    console.warn(`[Seed Notice] Seed ${name} warning:`, e.message);
  }
}

async function start() {
  try {
    await initDatabase();
    await applySecuritySchemaMigrations();
    await safeRunSeed(seedJftModelPaper01, 'seedJftModelPaper01');
    await safeRunSeed(seedJftModelPaper03, 'seedJftModelPaper03');
    await safeRunSeed(seedJftModelPaper04, 'seedJftModelPaper04');
    await safeRunSeed(seedJftModelPaper05, 'seedJftModelPaper05');
    await safeRunSeed(seedJftModelPaper06, 'seedJftModelPaper06');
    await safeRunSeed(seedJftModelPaper07, 'seedJftModelPaper07');
    await safeRunSeed(seedJftModelPaper08, 'seedJftModelPaper08');
    await safeRunSeed(seedJftModelPaper09, 'seedJftModelPaper09');
    await safeRunSeed(seedJftModelPaper10, 'seedJftModelPaper10');
    await safeRunSeed(seedJftModelPaper11, 'seedJftModelPaper11');
    await safeRunSeed(seedJftModelPaper12, 'seedJftModelPaper12');
    await safeRunSeed(seedSSWAutomobile, 'seedSSWAutomobile');
    await safeRunSeed(seedSSWAccommodation, 'seedSSWAccommodation');
    await safeRunSeed(seedSSWAgriculture, 'seedSSWAgriculture');
    await safeRunSeed(seedSSWCaregiver, 'seedSSWCaregiver');
    await safeRunSeed(seedSSWFoodService, 'seedSSWFoodService');
    await safeRunSeed(seedSSWAviation, 'seedSSWAviation');
    await safeRunSeed(seedSSWConstruction, 'seedSSWConstruction');
    initAutoBackup();
    app.listen(PORT, () => {
      console.log('========================================================');
      console.log('🌸 YUZUKI Japan College Examination & Quiz Platform');
      console.log('   Security: Rate-Limiting + Anti-Cheat Engine Active');
      console.log('   Running at: http://localhost:' + PORT);
      console.log('========================================================');
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();