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
                        {t('privacy_last_updated') || 'Last updated: April 2026'}
                    </p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        1. {t('privacy_overview_title') || 'Overview'}
                    </h3>
                    <p>{t('privacy_overview') || 'ReadyLegacy ("we", "us") is committed to protecting your personal data. This privacy policy explains what data we collect, how we use it, and your rights under the Swiss Federal Act on Data Protection (nDSG) and the EU General Data Protection Regulation (GDPR).'}</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        2. {t('privacy_data_title') || 'Data We Collect'}
                    </h3>
                    <p>{t('privacy_data_text') || 'ReadyLegacy collects and processes the following categories of data:'}</p>
                    <ul style={{ paddingLeft: '20px', margin: '12px 0' }}>
                        <li>{t('privacy_data_local') || 'Tool data (documents, assets, settings): stored locally in your browser and, when logged in, synchronized to our cloud database'}</li>
                        <li>{t('privacy_data_auth') || 'Authentication data: email address, name, and hashed password (or Google account link)'}</li>
                        <li>{t('privacy_data_lang') || 'Language and theme preferences: stored locally in your browser'}</li>
                        <li>{t('privacy_data_sensitive') || 'Sensitive data you choose to enter: estate planning information, medical directives, financial assets, personal messages, and beneficiary contact details'}</li>
                        <li>{t('privacy_data_ai') || 'AI chat interactions: your messages are sent to our AI provider (Anthropic) for processing and are not stored permanently by us'}</li>
                    </ul>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        3. {t('privacy_legal_basis_title') || 'Legal Basis'}
                    </h3>
                    <p>{t('privacy_legal_basis_text') || 'We process your data on the following legal bases: (a) your consent when creating an account and using our tools; (b) performance of a contract (providing our services); (c) our legitimate interest in improving our platform and ensuring security.'}</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        4. {t('privacy_storage_title') || 'Where Is Your Data Stored?'}
                    </h3>
                    <p>{t('privacy_storage_text') || 'Your data is stored in two locations: (1) locally in your browser\'s localStorage for offline access, and (2) on our cloud database (Neon PostgreSQL, hosted in the EU — Frankfurt) when you are logged in. Data is protected by HTTPS/TLS encryption in transit. Application-level encryption at rest is planned but not yet implemented.'}</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        5. {t('privacy_subprocessors_title') || 'Sub-processors'}
                    </h3>
                    <p>{t('privacy_subprocessors_text') || 'We use the following third-party service providers to operate ReadyLegacy:'}</p>
                    <ul style={{ paddingLeft: '20px', margin: '12px 0' }}>
                        <li>{t('privacy_sub_cloudflare') || 'Cloudflare (USA) — hosting, CDN, and edge computing. EU edge servers for EU/Swiss users.'}</li>
                        <li>{t('privacy_sub_neon') || 'Neon (USA, DB region: EU Frankfurt) — database hosting (PostgreSQL).'}</li>
                        <li>{t('privacy_sub_google') || 'Google (USA) — OAuth 2.0 authentication (only if you choose Google sign-in).'}</li>
                        <li>{t('privacy_sub_anthropic') || 'Anthropic (USA) — AI chat assistant processing.'}</li>
                    </ul>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        6. {t('privacy_cookies_title') || 'Cookies'}
                    </h3>
                    <p>{t('privacy_cookies_text') || 'ReadyLegacy does not use tracking cookies or third-party analytics. We use essential browser storage (localStorage) for application functionality and a JWT token for authentication.'}</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        7. {t('privacy_rights_title') || 'Your Rights'}
                    </h3>
                    <p>{t('privacy_rights_text') || 'Under nDSG and GDPR, you have the right to:'}</p>
                    <ul style={{ paddingLeft: '20px', margin: '12px 0' }}>
                        <li>{t('privacy_right_access') || 'Access your personal data'}</li>
                        <li>{t('privacy_right_correct') || 'Request correction of inaccurate data'}</li>
                        <li>{t('privacy_right_delete') || 'Request deletion of your data'}</li>
                        <li>{t('privacy_right_export') || 'Export your data in a portable format'}</li>
                        <li>{t('privacy_right_withdraw') || 'Withdraw consent at any time'}</li>
                    </ul>
                    <p>{t('privacy_rights_local') || 'To exercise these rights, contact us at info@readylegacy.ch. We will respond within 30 days. You can also delete locally stored data at any time by clearing your browser data.'}</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        8. {t('privacy_retention_title') || 'Data Retention'}
                    </h3>
                    <p>{t('privacy_retention_text') || 'We retain your data for as long as your account is active. Upon account deletion, all personal data is permanently removed from our database. Backup copies may persist for up to 30 days after deletion.'}</p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        9. {t('privacy_contact_title') || 'Contact'}
                    </h3>
                    <p>
                        {t('privacy_contact_text') || 'For privacy-related inquiries:'}<br />
                        Email: <a href="mailto:info@readylegacy.ch" style={{ color: 'var(--accent-gold)' }}>info@readylegacy.ch</a>
                    </p>

                    <h3 style={{ marginTop: '24px', marginBottom: '12px', color: 'var(--accent-gold)' }}>
                        10. {t('privacy_jurisdiction_title') || 'Applicable Law'}
                    </h3>
                    <p>{t('privacy_jurisdiction_text') || 'This privacy policy is governed by Swiss law. The competent supervisory authority is the Federal Data Protection and Information Commissioner (FDPIC).'}</p>
                </div>
            </div>
        </section>
    );
};

export default Privacy;
