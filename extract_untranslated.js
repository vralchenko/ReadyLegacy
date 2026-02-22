const fs = require('fs');
const glob = require('glob');

try {
    const files = glob.sync('src/**/*.{ts,tsx}');
    let untranslated = [];

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        // Check for common hardcoded texts
        const matches1 = content.match(/>([^<>{]+)</g) || [];
        const matches2 = content.match(/placeholder="([^"{]+)"/g) || [];
        const matches3 = content.match(/alert\(['"]([^'"]+)['"]\)/g) || [];

        matches1.forEach(m => {
            const text = m.replace(/[><]/g, '').trim();
            if (text && /[a-zA-Z]/.test(text) && !text.includes('t(\'') && !text.includes('t(')) {
                untranslated.push({ file, text, type: 'jsx text' });
            }
        });

        matches2.forEach(m => {
            const text = m.replace(/placeholder="/, '').replace(/"$/, '').trim();
            if (text && /[a-zA-Z]/.test(text) && !text.includes('t(')) {
                untranslated.push({ file, text, type: 'placeholder' });
            }
        });

        matches3.forEach(m => {
            untranslated.push({ file, text: m, type: 'alert' });
        });
    });

    console.log(`Found ${untranslated.length} potentially untranslated strings.`);
    // Group by file
    const byFile = untranslated.reduce((acc, curr) => {
        if (!acc[curr.file]) acc[curr.file] = [];
        acc[curr.file].push(curr.text);
        return acc;
    }, {});

    for (const [file, texts] of Object.entries(byFile)) {
        console.log(`\n--- ${file} ---`);
        texts.slice(0, 10).forEach(t => console.log('  ', t));
        if (texts.length > 10) console.log(`   ...and ${texts.length - 10} more`);
    }

} catch (e) {
    console.error(e);
}
