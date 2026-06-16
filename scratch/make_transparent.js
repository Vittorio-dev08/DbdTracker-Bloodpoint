import { Jimp } from 'jimp';
import path from 'path';

async function main() {
  const iconPath = 'src-tauri/icons/icon.png';
  console.log('Reading icon from:', iconPath);
  const image = await Jimp.read(iconPath);
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // If the pixel is very dark (black background), make it fully transparent
    if (r < 25 && g < 25 && b < 25) {
      this.bitmap.data[idx + 3] = 0;
    }
  });

  await image.write(iconPath);
  console.log('Transparent icon generated successfully!');
}

main().catch((err) => {
  console.error('Error modifying icon:', err);
  process.exit(1);
});
