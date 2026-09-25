const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');
const { createBackup, backupDir } = require('../utils/dbBackup');

async function getPublicSettings(req, res) {
  try {
    const rows = await query.all('SELECT setting_key, setting_value FROM system_settings');
    const settings = {};
    rows.forEach(r => {
      settings[r.setting_key] = r.setting_value;
    });

    return res.json({
      maintenance_mode: settings.maintenance_mode === 'true' || settings.maintenance_mode === '1',
      maintenance_title: settings.maintenance_title || 'YUZUKI Japan College - System Maintenance',
      maintenance_message: settings.maintenance_message || 'පද්ධතියේ නඩත්තු කටයුත්තක් සිදුවෙමින් පවතී. ඔබගේ සියලු දත්ත සුරක්ෂිතව ඇත.',
      maintenance_start_time: settings.maintenance_start_time || '',
      maintenance_end_time: settings.maintenance_end_time || '',
      maintenance_duration_minutes: parseInt(settings.maintenance_duration_minutes, 10) || 60,
      show_banner_alert: settings.show_banner_alert === 'true' || settings.show_banner_alert === '1',
      banner_alert_text: settings.banner_alert_text || '',
      allow_admin_bypass: settings.allow_admin_bypass !== 'false'
    });
  } catch (err) {
    console.error('getPublicSettings error:', err);
    return res.status(500).json({ error: 'Failed to retrieve public settings.' });
  }
}

async function getAdminSettings(req, res) {
  try {
    const rows = await query.all('SELECT setting_key, setting_value, updated_at FROM system_settings');
    const settings = {};
    rows.forEach(r => {
      settings[r.setting_key] = r.setting_value;
    });

    // Real-time system stats to reassure admin about student data safety
    const totalStudents = (await query.get('SELECT COUNT(*) as count FROM users WHERE role = "student"'))?.count || 0;
    const approvedStudents = (await query.get('SELECT COUNT(*) as count FROM users WHERE role = "student" AND status = "approved"'))?.count || 0;
    const pendingStudents = (await query.get('SELECT COUNT(*) as count FROM users WHERE role = "student" AND status = "pending"'))?.count || 0;
    const totalExams = (await query.get('SELECT COUNT(*) as count FROM exams'))?.count || 0;
    const totalAttempts = (await query.get('SELECT COUNT(*) as count FROM exam_attempts'))?.count || 0;
    const totalPayments = (await query.get('SELECT COUNT(*) as count FROM payments'))?.count || 0;

    let backupFiles = [];
    if (fs.existsSync(backupDir)) {
      backupFiles = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('yuzuki_backup_'))
        .map(f => {
          const full = path.join(backupDir, f);
          const stat = fs.statSync(full);
          return {
            filename: f,
            size_kb: Math.round(stat.size / 1024),
            created_at: stat.mtime
          };
        })
        .sort((a, b) => b.created_at - a.created_at);
    }

    return res.json({
      settings: {
        maintenance_mode: settings.maintenance_mode === 'true' || settings.maintenance_mode === '1',
        maintenance_title: settings.maintenance_title || 'YUZUKI Japan College - System Maintenance',
        maintenance_message: settings.maintenance_message || '',
        maintenance_start_time: settings.maintenance_start_time || '',
        maintenance_end_time: settings.maintenance_end_time || '',
        maintenance_duration_minutes: parseInt(settings.maintenance_duration_minutes, 10) || 60,
        show_banner_alert: settings.show_banner_alert === 'true' || settings.show_banner_alert === '1',
        banner_alert_text: settings.banner_alert_text || '',
        allow_admin_bypass: settings.allow_admin_bypass !== 'false'
      },
      stats: {
        total_students: totalStudents,
        approved_students: approvedStudents,
        pending_students: pendingStudents,
        total_exams: totalExams,
        total_attempts: totalAttempts,
        total_payments: totalPayments,
        total_backups: backupFiles.length,
        latest_backup: backupFiles.length > 0 ? backupFiles[0] : null
      }
    });
  } catch (err) {
    console.error('getAdminSettings error:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin settings.' });
  }
}

async function updateAdminSettings(req, res) {
  try {
    const {
      maintenance_mode,
      maintenance_title,
      maintenance_message,
      maintenance_start_time,
      maintenance_end_time,
      maintenance_duration_minutes,
      show_banner_alert,
      banner_alert_text,
      allow_admin_bypass
    } = req.body;

    const updates = [
      { key: 'maintenance_mode', val: maintenance_mode !== undefined ? (maintenance_mode ? 'true' : 'false') : null },
      { key: 'maintenance_title', val: maintenance_title !== undefined ? maintenance_title.trim() : null },
      { key: 'maintenance_message', val: maintenance_message !== undefined ? maintenance_message.trim() : null },
      { key: 'maintenance_start_time', val: maintenance_start_time !== undefined ? maintenance_start_time : null },
      { key: 'maintenance_end_time', val: maintenance_end_time !== undefined ? maintenance_end_time : null },
      { key: 'maintenance_duration_minutes', val: maintenance_duration_minutes !== undefined ? String(maintenance_duration_minutes) : null },
      { key: 'show_banner_alert', val: show_banner_alert !== undefined ? (show_banner_alert ? 'true' : 'false') : null },
      { key: 'banner_alert_text', val: banner_alert_text !== undefined ? banner_alert_text.trim() : null },
      { key: 'allow_admin_bypass', val: allow_admin_bypass !== undefined ? (allow_admin_bypass ? 'true' : 'false') : null }
    ];

    for (const u of updates) {
      if (u.val !== null) {
        const exists = await query.get('SELECT id FROM system_settings WHERE setting_key = ?', [u.key]);
        if (exists) {
          await query.run('UPDATE system_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?', [u.val, u.key]);
        } else {
          await query.run('INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?)', [u.key, u.val]);
        }
      }
    }

    return res.json({
      success: true,
      message: 'System settings saved successfully. (සැකසුම් සාර්ථකව සුරැකිණි)'
    });
  } catch (err) {
    console.error('updateAdminSettings error:', err);
    return res.status(500).json({ error: 'Failed to update system settings.' });
  }
}

async function createManualBackup(req, res) {
  try {
    const backupFile = createBackup();
    if (!backupFile || !fs.existsSync(backupFile)) {
      return res.status(500).json({ error: 'Failed to generate database backup snapshot.' });
    }

    const stat = fs.statSync(backupFile);
    return res.json({
      success: true,
      message: 'Instant database snapshot created successfully. All student records, exams & attempts are safely stored.',
      filename: path.basename(backupFile),
      size_kb: Math.round(stat.size / 1024),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('createManualBackup error:', err);
    return res.status(500).json({ error: 'Failed to create backup.' });
  }
}

module.exports = {
  getPublicSettings,
  getAdminSettings,
  updateAdminSettings,
  createManualBackup
};
