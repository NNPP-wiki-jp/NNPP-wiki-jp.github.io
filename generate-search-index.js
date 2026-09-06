const fs = require('fs');
const path = require('path');

const excludeDirs = ['.git', '.github', 'node_modules'];
const excludeFiles = ['search.json'];

function scanDir(dir, baseDir = dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                results = results.concat(scanDir(filePath, baseDir));
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext) && !excludeFiles.includes(relativePath)) {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    let title = relativePath;
                    let textContent = content;

                    if (ext === '.html') {
                        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
                        if (titleMatch) title = titleMatch[1];

                        textContent = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                             .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                                             .replace(/<[^>]+>/g, ' ')
                                             .replace(/\s+/g, ' ')
                                             .trim();
                    }

                    results.push({
                        url: relativePath,
                        title: title,
                        content: textContent
                    });
                } catch (e) {}
            }
        }
    });

    return results;
}

const searchData = scanDir('.');
fs.writeFileSync('search.json', JSON.stringify(searchData, null, 2));
console.log('search.json generated successfully!');
