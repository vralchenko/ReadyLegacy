import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Impressum: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="section-padding" style={{ minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '720px' }}>
                <h2 style={{ marginBottom: '32px' }}>{t('impressum_title') || 'Impressum'}</h2>

                <div style={{ opacity: 0.85, lineHeight: 1.8, fontSize: '1.05rem' }}>
                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        {t('impressum_operator') || 'Website Operator'}
                    </h3>
                    <p>
                        ReadyLegacy<br />
                        c/o Dr. Inna Praxmarer<br />
                        Switzerland
                    </p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        {t('impressum_contact') || 'Contact'}
                    </h3>
                    <p>
                        Email: <a href="mailto:info@readylegacy.ch" style={{ color: 'var(--accent-gold)' }}>info@readylegacy.ch</a><br />
                        Web: <a href="https://readylegacy.ch" style={{ color: 'var(--accent-gold)' }}>readylegacy.ch</a>
                    </p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        {t('impressum_purpose') || 'Purpose'}
                    </h3>
                    <p>{t('impressum_purpose_text') || 'ReadyLegacy is a digital platform for life planning, legacy preservation, and bereavement support. The platform is currently in development (MVP stage).'}</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        {t('impressum_hosting') || 'Hosting'}
                    </h3>
                    <p>
                        Cloudflare Inc.<br />
                        101 Townsend St, San Francisco, CA 94107, USA<br />
                        {t('impressum_hosting_note') || 'Data is processed on Cloudflare edge servers. For EU/Swiss users, data is primarily served from European edge locations. Database hosted on Neon PostgreSQL (EU region: Frankfurt).'}
                    </p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        {t('impressum_disclaimer') || 'Disclaimer'}
                    </h3>
                    <p>{t('impressum_disclaimer_text') || 'The content of this website is for informational purposes only. ReadyLegacy does not provide legal, financial, or medical advice. All tools and templates are intended as organizational aids and do not replace professional consultation.'}</p>
                </div>
            </div>
        </section>
    );
};

export default Impressum;
