// compress-images.js — chạy: node compress-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR  = path.join(__dirname, 'public/images');
const OUTPUT_DIR = path.join(__dirname, 'public/images');
const MAX_WIDTH  = 1600;
const QUALITY    = 80;

function getAllImages(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(getAllImages(fullPath));
        } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
            results.push(fullPath);
        }
    });
    return results;
}

async function compress(filePath) {
    const sizeBefore = fs.statSync(filePath).size;
    const tmpPath = filePath + '.tmp.jpg';

    try {
        await sharp(filePath)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .jpeg({ quality: QUALITY, progressive: true })
            .toFile(tmpPath);

        // Replace original with compressed jpg
        const newPath = filePath.replace(/\.(png|jpeg)$/i, '.jpg');
        fs.renameSync(tmpPath, newPath);
        if (newPath !== filePath) fs.unlinkSync(filePath);

        const sizeAfter = fs.statSync(newPath).size;
        const pct = Math.round((1 - sizeAfter / sizeBefore) * 100);
        console.log(`✅ ${path.basename(filePath)} : ${(sizeBefore/1e6).toFixed(1)}MB → ${(sizeAfter/1e6).toFixed(1)}MB (-${pct}%)`);
    } catch (e) {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        console.error(`❌ ${filePath}: ${e.message}`);
    }
}

(async () => {
    const images = getAllImages(INPUT_DIR);
    console.log(`\n🔍 Tìm thấy ${images.length} ảnh...\n`);
    for (const img of images) {
        await compress(img);
    }
    console.log('\n🎉 Nén xong tất cả ảnh!');
})();
