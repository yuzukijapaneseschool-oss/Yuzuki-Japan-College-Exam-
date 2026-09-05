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

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    college: 'YUZUKI Japan College',
    security: 'hardened (Anti-BruteForce, Rate-Limited, Helmet Protected)',
    version: '1.2.0',
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
}

const { initAutoBackup } = require('./utils/dbBackup');

async function start() {
  try {
    await initDatabase();
    await applySecuritySchemaMigrations();
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