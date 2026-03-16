import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer>
            <div className="container footer-compact">
                <div className="footer-badges">
                    <span className="badge">🇨🇭 Swiss Made</span>
                    <span className="badge">🔒 {t('footer_compliance_gdpr') || 'GDPR'}</span>
                    <span className="badge">🛡️ {t('footer_compliance_ndsg') || 'nDSG'}</span>
                </div>
                <p style={{ marginBottom: '4px' }}>
                    <Link to="/impressum" style={{ color: 'var(--text-muted)', textDecoration: 'none', opacity: 0.6, fontSize: '0.85rem', marginRight: '16px' }}>{t('footer_impressum') || 'Impressum'}</Link>
                    <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', opacity: 0.6, fontSize: '0.85rem' }}>{t('footer_privacy') || 'Privacy Policy'}</Link>
                </p>
                <p>&copy; 2026 Ready Legacy Ecosystem. <span style={{ opacity: 0.5 }}>Be Ready. Leave Behind. Be Honored.</span></p>
            </div>
        </footer>
    );
};

export default Footer;
