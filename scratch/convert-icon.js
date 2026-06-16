import sharp from 'sharp';

const sourcePath = 'C:/Users/Vitto/Desktop/CharackterIcon/BPIcon.webp';
const destPath = 'C:/Users/Vitto/DBDTracker/src-tauri/icons/icon.png';

async function convert() {
  try {
    await sharp(sourcePath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFormat('png')
      .toFile(destPath);
    console.log(`Successfully converted and resized to square. Saved to ${destPath}`);
  } catch (err) {
    console.error('Error during conversion:', err);
  }
}

convert();
