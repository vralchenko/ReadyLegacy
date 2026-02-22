const fs = require('fs');
const glob = require('glob');

try {
    const files = glob.sync('src/**/*.{ts,tsx,js,jsx}');
    const keys = new Set();
    // \bt\( matches 't(' strictly as a function name
    const regex = /\bt\(['"]([^'"]+)['"]\)/g;

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        let match;
        while ((match = regex.exec(content)) !== null) {
            keys.add(match[1]);
        }
    });

    const usedKeys = Array.from(keys);
    console.log(`Found ${usedKeys.length} keys in source code.`);

    const locales = ['en', 'de', 'ru', 'ua'];
    const missingKeys = {};

    locales.forEach(locale => {
        try {
            const data = JSON.parse(fs.readFileSync(`public/assets/locales/${locale}.json`, 'utf8'));
            const localeKeys = Object.keys(data);
            const missing = usedKeys.filter(key => !localeKeys.includes(key));
            missingKeys[locale] = missing;
            console.log(`Locale ${locale}: ${missing.length} missing keys`);
        } catch (e) {
            console.error(`Error reading ${locale}.json: ${e.message}`);
        }
    });

    console.log('\nMissing keys details:');
    locales.forEach(locale => {
        if (missingKeys[locale] && missingKeys[locale].length > 0) {
            console.log(`\n--- ${locale.toUpperCase()} ---`);
            missingKeys[locale].forEach(k => console.log(k));
        }
    });

    // Let's also find all hardcoded text that should be translated.
    // However, finding hardcoded text reliably is very complex without AST parsing.

} catch (e) {
    console.error(e);
}
