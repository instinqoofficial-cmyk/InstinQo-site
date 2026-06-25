const Jimp = require('jimp');

Jimp.read('C:\\Users\\spidy\\.gemini\\antigravity-ide\\brain\\346925cb-3bf9-4f1a-bf9a-a0fe2fe4e52e\\media__1782321013541.png')
  .then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        // Make white and near-white transparent
        if (r > 240 && g > 240 && b > 240) {
            this.bitmap.data[idx + 3] = 0;
        } else if (r > 220 && g > 220 && b > 220) {
            // Anti-aliasing softening for edges
            const avg = (r + g + b) / 3;
            // 220 -> alpha 255
            // 240 -> alpha 0
            const alpha = Math.max(0, Math.floor(255 - ((avg - 220) * (255 / 20))));
            this.bitmap.data[idx + 3] = alpha;
        }
    });
    
    image.write('assets/logo.png', () => {
        console.log("Successfully removed background and saved to assets/logo.png");
    });
  })
  .catch(err => {
    console.error(err);
  });
