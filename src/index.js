const path = require('path');
const getPixels = require("get-pixels");

const ROOT_PATH = path.resolve(__dirname, '..')
const relativePath = (target) => path.resolve(ROOT_PATH, target);

function getCharMap() {
  const chars = [].slice.call(arguments);
  const grayScaleRange = 256;
  let grayScaleBlockCount = ~~(grayScaleRange / chars.length);
  if (grayScaleRange % chars.length !== 0) {
    grayScaleBlockCount += 1;
  }
  const map = {};
  for (let i = 0; i < grayScaleRange; i++) {
    map[i] = chars[~~(i / grayScaleBlockCount)];
  }
  return map;
}
const CHAR_MAP = getCharMap('@', 'w', '#', '$', 'k', 'd', 't', 'j', 'i', '~', '.', ' ');
// '@','#','$','=','*','!',';',':','~','-',',','.','&nbsp;'
const MATRIX_BLOCK_PRECISION = 10;

function getGrayScale(r, g, b) {
  return ~~(0.3 * r + 0.59 * g + 0.11 * b);
}

function getMatrixAverageGrayScale(x, y, width, height, pixels) {
  let grayScaleAmount = 0;
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      let [r, g, b] = [0, 1, 2].map(index => pixels.get(x + w, y + h, index));
      grayScaleAmount += getGrayScale(r, g, b);
    }
  }
  return ~~(grayScaleAmount / (width * height));
}

getPixels(relativePath('test/test2.jpeg'), (err, pixels) => {
  if (err) {
    return console.log('Bad image path');
  }

  const [width, height] = pixels.shape;
  const asciiMatrix = [];
  for (let y = 0; y < height; y += MATRIX_BLOCK_PRECISION) {
    asciiMatrix.push([]);
    let remainderHeight = height - y;
    if (remainderHeight >= MATRIX_BLOCK_PRECISION) {
      remainderHeight = MATRIX_BLOCK_PRECISION;
    }
    for (let x = 0; x < width; x += MATRIX_BLOCK_PRECISION) {
      let remainderWidth = width - x;
      if (remainderWidth >= MATRIX_BLOCK_PRECISION) {
        remainderWidth = MATRIX_BLOCK_PRECISION;
      }
      const grayScale = getMatrixAverageGrayScale(x, y, remainderWidth, remainderHeight, pixels);
      asciiMatrix[asciiMatrix.length - 1].push(CHAR_MAP[grayScale]);
    }
  }

  let ascii = asciiMatrix.map(item => `${item.join('')}\r\n`).join('');
  console.log(ascii);
});