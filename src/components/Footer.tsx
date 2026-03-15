import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer>
            <div className="container">
                <div className="footer-badges">
                    <span className="badge">🔒 {t('footer_compliance_hipaa') || 'HIPAA'}</span>
                    <span className="badge">🛡️ {t('footer_compliance_soc') || 'SOC 2'}</span>
                    <span className="badge">🇪🇺 {t('footer_compliance_gdpr') || 'GDPR'}</span>
                    <span className="badge">🇨🇭 {t('footer_compliance_ndsg') || 'nDSG'}</span>
                </div>
                <p className="footer-security">{t('footer_security') || 'Your data is encrypted and stored securely'}</p>
                <p>&copy; 2026 Ready Legacy Ecosystem. All Rights Reserved. <br />
                    <small style={{ opacity: 0.6 }}>Be Ready. Leave Behind. Be Honored.</small>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
