import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Contact: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="contact" className="cta section-padding full-height-section">
            <div className="container">
                <h2>{t('cta_h2')}</h2>
                <p>{t('cta_p')}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', marginTop: '2rem' }}>
                    <a href="mailto:info@readylegacy.ch" style={{ fontSize: '1.8rem', color: 'var(--accent-gold)', textDecoration: 'none' }}>info@readylegacy.ch</a>
                </div>
            </div>
        </section>
    );
};

export default Contact;
