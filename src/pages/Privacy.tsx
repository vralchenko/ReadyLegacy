import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Privacy: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="section-padding" style={{ minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '720px' }}>
                <h2 style={{ marginBottom: '32px' }}>{t('privacy_title') || 'Privacy Policy'}</h2>

                <div style={{ opacity: 0.85, lineHeight: 1.8, fontSize: '1.05rem' }}>
                    <p style={{ marginBottom: '20px', fontStyle: 'italic', opacity: 0.7 }}>
                        {t('privacy_last_updated') || 'Last updated: March 2026'}
                    </p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        1. {t('privacy_overview_title') || 'Overview'}
                    </h3>
                    <p>{t('privacy_overview') || 'ReadyLegacy ("we", "us") is committed to protecting your personal data. This privacy policy explains what data we collect, how we use it, and your rights under the Swiss Federal Act on Data Protection (nDSG) and the EU General Data Protection Regulation (GDPR).'}</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        2. {t('privacy_data_title') || 'Data We Collect'}
                    </h3>
                    <p>{t('privacy_data_text') || 'Currently, ReadyLegacy stores all user data locally in your browser (localStorage). No personal data is transmitted to or stored on external servers. When you use the AI chat assistant, your messages are processed by our AI provider (Anthropic) but are not stored permanently.'}</p>
                    <ul style={{ paddingLeft: '20px', margin: '12px 0' }}>
                        <li>{t('privacy_data_local') || 'Tool data (documents, assets, settings): stored locally in your browser'}</li>
                        <li>{t('privacy_data_auth') || 'Authentication: demo mode only (no real credentials stored)'}</li>
                        <li>{t('privacy_data_lang') || 'Language and theme preferences: stored locally in your browser'}</li>
                    </ul>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        3. {t('privacy_storage_title') || 'Where Is Your Data Stored?'}
                    </h3>
                    <p>{t('privacy_storage_text') || 'In the current MVP version, all data remains on your device in the browser\'s local storage. No data is uploaded to cloud servers. When we launch the full platform, data will be stored in encrypted form on European servers with end-to-end encryption. You will always have the option to export or delete your data.'}</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        4. {t('privacy_cookies_title') || 'Cookies'}
                    </h3>
                    <p>{t('privacy_cookies_text') || 'ReadyLegacy does not use tracking cookies or third-party analytics. We only use essential browser storage (localStorage) for application functionality.'}</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        5. {t('privacy_rights_title') || 'Your Rights'}
                    </h3>
                    <p>{t('privacy_rights_text') || 'Under nDSG and GDPR, you have the right to:'}</p>
                    <ul style={{ paddingLeft: '20px', margin: '12px 0' }}>
                        <li>{t('privacy_right_access') || 'Access your personal data'}</li>
                        <li>{t('privacy_right_correct') || 'Request correction of inaccurate data'}</li>
                        <li>{t('privacy_right_delete') || 'Request deletion of your data'}</li>
                        <li>{t('privacy_right_export') || 'Export your data in a portable format'}</li>
                        <li>{t('privacy_right_withdraw') || 'Withdraw consent at any time'}</li>
                    </ul>
                    <p>{t('privacy_rights_local') || 'Since all data is currently stored locally, you can delete it at any time by clearing your browser data.'}</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        6. {t('privacy_contact_title') || 'Contact'}
                    </h3>
                    <p>
                        {t('privacy_contact_text') || 'For privacy-related inquiries:'}<br />
                        Email: <a href="mailto:info@readylegacy.ch" style={{ color: 'var(--accent-gold)' }}>info@readylegacy.ch</a>
                    </p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        7. {t('privacy_jurisdiction_title') || 'Applicable Law'}
                    </h3>
                    <p>{t('privacy_jurisdiction_text') || 'This privacy policy is governed by Swiss law. The competent supervisory authority is the Federal Data Protection and Information Commissioner (FDPIC).'}</p>
                </div>
            </div>
        </section>
    );
};

export default Privacy;
