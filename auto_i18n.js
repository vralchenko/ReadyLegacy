const fs = require('fs');
const glob = require('glob');

const EN_FILE = 'public/assets/locales/en.json';
let enDict = {}
try {
    enDict = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
} catch (e) { }

let newKeys = {};

function generateKey(text) {
    const clean = text.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    let key = 'auto_' + clean.substring(0, 15);
    if (!enDict[key] && !newKeys[key]) return key;
    let i = 1;
    while (enDict[`${key}_${i}`] || newKeys[`${key}_${i}`]) i++;
    return `${key}_${i}`;
}

const files = glob.sync('src/**/*.{tsx,jsx}');
let modFiles = 0;

files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Safety check: only modify if the file already defines `t` via useLanguage
    if (!content.includes('const { t }') && !content.includes('const { language, setLanguage, t }') && !content.includes('const { language, t }')) {
        return; // Skip this file to avoid breaking compilation
    }

    let modified = false;

    // 1. placeholder="Text"
    content = content.replace(/placeholder="([^"{}]*[a-zA-Z][^"{}]*)"/g, (match, text) => {
        if (text.includes('t(')) return match;
        const key = generateKey(text);
        newKeys[key] = text;
        modified = true;
        const safeText = text.replace(/'/g, "\\'");
        return `placeholder={t('${key}') || '${safeText}'}`;
    });

    // 2. alert('Text')
    content = content.replace(/alert\(['"]([^'"{]+[a-zA-Z][^'"{]*)['"]\)/g, (match, text) => {
        if (text.includes('t(')) return match;
        const key = generateKey(text);
        newKeys[key] = text;
        modified = true;
        const safeText = text.replace(/'/g, "\\'");
        return `alert(t('${key}') || '${safeText}')`;
    });

    // 3. label="Text" (only if NOT inside a tsx prop value or class logic)
    content = content.replace(/label="([^"{}]*[a-zA-Z][^"{}]*)"/g, (match, text) => {
        if (text.includes('t(') || text === "stylesheet") return match;
        const key = generateKey(text);
        newKeys[key] = text;
        modified = true;
        const safeText = text.replace(/'/g, "\\'");
        return `label={t('${key}') || '${safeText}'}`;
    });

    // 4. title="Text"
    content = content.replace(/title="([^"{}]*[a-zA-Z][^"{}]*)"/g, (match, text) => {
        if (text.includes('t(')) return match;
        const key = generateKey(text);
        newKeys[key] = text;
        modified = true;
        const safeText = text.replace(/'/g, "\\'");
        return `title={t('${key}') || '${safeText}'}`;
    });

    // 5. title="Text" single quotes
    content = content.replace(/title='([^'{}]*[a-zA-Z][^'{}]*)'/g, (match, text) => {
        if (text.includes('t(')) return match;
        const key = generateKey(text);
        newKeys[key] = text;
        modified = true;
        const safeText = text.replace(/'/g, "\\'");
        return `title={t('${key}') || '${safeText}'}`;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        modFiles++;
        console.log(`Modified ${filePath}`);
    }
});

fs.writeFileSync('new_keys.json', JSON.stringify(newKeys, null, 2), 'utf8');
console.log(`\nDone! Modified ${modFiles} files. Extracted ${Object.keys(newKeys).length} new keys to new_keys.json`);

// Automatically add English to en.json
const locales = ['en', 'de', 'ru', 'ua'];
locales.forEach(loc => {
    const file = `public/assets/locales/${loc}.json`;
    let dict = {};
    try { dict = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { }
    for (let key in newKeys) {
        if (!dict[key]) {
            dict[key] = newKeys[key]; // Fill with EN for now
        }
    }
    fs.writeFileSync(file, JSON.stringify(dict, null, 2), 'utf8');
});

