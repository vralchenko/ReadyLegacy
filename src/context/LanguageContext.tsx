import React, { createContext, useContext, useEffect, useState } from 'react';

type Translations = Record<string, string>;

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<string>(() => localStorage.getItem('readylegacy_lang') || 'en');
    const [translations, setTranslations] = useState<Translations>({});

    useEffect(() => {
        localStorage.setItem('readylegacy_lang', language);
        fetch(`/assets/locales/${language}.json`)
            .then(res => res.json())
            .then(data => setTranslations(data))
            .catch(err => console.error('Failed to load translations', err));
    }, [language]);

    const setLanguage = (lang: string) => {
        setLanguageState(lang);
    };

    const t = (key: string) => translations[key] || key;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
