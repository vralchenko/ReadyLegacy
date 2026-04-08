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
                    <Link to="/impressum" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.85rem', marginLeft: '8px' }}>{t('footer_impressum') || 'Impressum'}</Link>
                    <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.85rem' }}>{t('footer_privacy') || 'Privacy Policy'}</Link>
                    <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.85rem' }}>{t('footer_terms') || 'Terms of Service'}</Link>
                </div>
                <p>&copy; 2026 Ready Legacy Ecosystem. Be Ready. Leave Behind. Be Honored.</p>
            </div>
        </footer>
    );
};

export default Footer;
