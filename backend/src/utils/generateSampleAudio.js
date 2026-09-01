const fs = require('fs');
const path = require('path');

function createSampleWav(filename, frequency = 440, durationSeconds = 3) {
  const sampleRate = 44100;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = sampleRate * durationSeconds * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size
  buffer.writeUInt16LE(1, 20);  // audio format (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate pleasant chime / tones
  let offset = 44;
  for (let i = 0; i < sampleRate * durationSeconds; i++) {
    const t = i / sampleRate;
    // Chime chords: 523Hz (C5), 659Hz (E5), 783Hz (G5) with gentle decay
    const val = (
      Math.sin(2 * Math.PI * frequency * t) * 0.5 +
      Math.sin(2 * Math.PI * (frequency * 1.25) * t) * 0.3 +
      Math.sin(2 * Math.PI * (frequency * 1.5) * t) * 0.2
    ) * Math.exp(-1.2 * (t % 1.5));

    const sample = Math.max(-1, Math.min(1, val)) * 32767;
    buffer.writeInt16LE(Math.round(sample), offset);
    offset += 2;
  }

  const outDir = path.resolve(__dirname, '../../uploads/audio');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log('Created audio sample at:', filePath);
}

createSampleWav('sample_jft_audio_1.mp3', 523.25, 4);
createSampleWav('sample_jft_audio_2.mp3', 659.25, 4);
