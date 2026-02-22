const fs = require('fs');

const extraKeys = {
    en: {
        "error_required": "This field is required",
        "error_fill_all": "Please fill in all required fields.",
        "success_saved_local": "All your data is saved automatically to your local storage!"
    },
    de: {
        "error_required": "Dieses Feld ist erforderlich",
        "error_fill_all": "Bitte füllen Sie alle Pflichtfelder aus.",
        "success_saved_local": "Alle Ihre Daten werden automatisch in Ihrem lokalen Speicher gespeichert!"
    },
    ru: {
        "error_required": "Это поле обязательно",
        "error_fill_all": "Пожалуйста, заполните все обязательные поля.",
        "success_saved_local": "Все ваши данные автоматически сохранены локально!"
    },
    ua: {
        "error_required": "Це поле є обов'язковим",
        "error_fill_all": "Будь ласка, заповніть усі обов'язкові поля.",
        "success_saved_local": "Усі ваші дані автоматично збережено локально!"
    }
};

const locales = ['en', 'de', 'ru', 'ua'];

locales.forEach(loc => {
    const file = `public/assets/locales/${loc}.json`;
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    Object.assign(data, extraKeys[loc]);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${loc}.json`);
});
