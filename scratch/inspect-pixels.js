import sharp from 'sharp';

const sourcePath = 'C:/Users/Vitto/Desktop/CharackterIcon/BPIcon.webp';

async function inspect() {
  try {
    const { data, info } = await sharp(sourcePath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Check corners
    const getPixel = (x, y) => {
      const idx = (y * info.width + x) * info.channels;
      return {
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2],
        a: info.channels === 4 ? data[idx + 3] : 255
      };
    };

    console.log('Top-Left:', getPixel(0, 0));
    console.log('Top-Right:', getPixel(info.width - 1, 0));
    console.log('Bottom-Left:', getPixel(0, info.height - 1));
    console.log('Bottom-Right:', getPixel(info.width - 1, info.height - 1));
    console.log('Center:', getPixel(Math.floor(info.width / 2), Math.floor(info.height / 2)));
  } catch (err) {
    console.error(err);
  }
}

inspect();
