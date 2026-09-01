const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imagesDir = path.resolve(__dirname, '../../uploads/images');
const audioDir = path.resolve(__dirname, '../../uploads/audio');

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'audio' || file.mimetype.startsWith('audio/')) {
      cb(null, audioDir);
    } else {
      cb(null, imagesDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audio') {
    const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/x-m4a', 'audio/aac', 'audio/x-wav'];
    if (allowedAudioTypes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files (MP3, WAV, OGG, M4A) are allowed for audio field!'), false);
    }
  } else if (file.fieldname === 'image') {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (allowedImageTypes.includes(file.mimetype) || file.originalname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed for image field!'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  }
});

module.exports = upload;
