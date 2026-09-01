const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../data/yuzuki.db');
const backupDir = path.resolve(__dirname, '../../data/backups');

function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
}

function createBackup() {
  try {
    ensureBackupDir();
    if (!fs.existsSync(dbPath)) return null;

    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `yuzuki_backup_${dateStr}.sqlite`;
    const targetFile = path.join(backupDir, backupFileName);

    fs.copyFileSync(dbPath, targetFile);
    console.log(`[Database Backup] Created snapshot: ${backupFileName}`);

    // Maintain only the last 15 backups to save space
    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('yuzuki_backup_') && f.endsWith('.sqlite'))
      .map(f => ({ name: f, time: fs.statSync(path.join(backupDir, f)).mtime.getTime() }))
      .sort((a, b) => b.time - a.time);

    if (files.length > 15) {
      files.slice(15).forEach(f => {
        fs.unlinkSync(path.join(backupDir, f.name));
      });
    }

    return targetFile;
  } catch (err) {
    console.error('[Database Backup] Error creating backup:', err);
    return null;
  }
}

function initAutoBackup() {
  // Create initial backup on launch
  createBackup();

  // Run automated backup every 12 hours (43,200,000 ms)
  setInterval(() => {
    createBackup();
  }, 12 * 60 * 60 * 1000);
}

module.exports = {
  createBackup,
  initAutoBackup,
  backupDir,
  dbPath
};
