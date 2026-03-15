import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer>
            <div className="container footer-compact">
                <div className="footer-badges">
                    <span className="badge">🔒 {t('footer_compliance_hipaa') || 'HIPAA'}</span>
                    <span className="badge">🛡️ {t('footer_compliance_soc') || 'SOC 2'}</span>
                    <span className="badge">🇪🇺 {t('footer_compliance_gdpr') || 'GDPR'}</span>
                    <span className="badge">🇨🇭 {t('footer_compliance_ndsg') || 'nDSG'}</span>
                </div>
                <p>&copy; 2026 Ready Legacy Ecosystem. <span style={{ opacity: 0.5 }}>Be Ready. Leave Behind. Be Honored.</span></p>
            </div>
        </footer>
    );
};

export default Footer;
