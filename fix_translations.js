const fs = require('fs');

const baseDir = 'public/assets/locales';
const files = {
  'en.json': { nav_docs: 'Documents', nav_login: 'Sign In' },
  'de.json': { nav_docs: 'Dokumente', nav_login: 'Anmelden' },
  'ru.json': { nav_docs: 'Документы', nav_login: 'Войти' },
  'ua.json': { nav_docs: 'Документи', nav_login: 'Увійти' }
};

for (const [filename, newKeys] of Object.entries(files)) {
  const filePath = `${baseDir}/${filename}`;
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    Object.assign(data, newKeys);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${filename}`);
  } else {
    console.error(`File not found: ${filePath}`);
  }
}
