import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SERVICES = [
    {
        key: 'svc_ready',
        icon: '🛡️',
        tier: 'free' as const,
        tools: ['svc_ready_t1', 'svc_ready_t2', 'svc_ready_t3', 'svc_ready_t4', 'svc_ready_t5', 'svc_ready_t6'],
        link: '/tools',
    },
    {
        key: 'svc_legacy',
        icon: '✦',
        tier: 'paid' as const,
        tools: ['svc_legacy_t1', 'svc_legacy_t2', 'svc_legacy_t3'],
        link: '/tools?tool=leave-behind',
    },
    {
        key: 'svc_honored',
        icon: '🕊️',
        tier: 'free' as const,
        tools: ['svc_honored_t1', 'svc_honored_t2', 'svc_honored_t3'],
        link: '/tools?tool=bereavement-support',
    },
];

const TIER_STYLE = {
    free: { label: 'tier_free', fallback: 'Free', color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    paid: { label: 'tier_paid', fallback: '15 CHF / month', color: 'var(--accent-gold)', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)' },
};

const Home: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="home-page">
            {/* Hero — Compact */}
            <section className="hero hero-redesigned" style={{ paddingTop: '10px', paddingBottom: '20px' }}>
                <div className="container">
                    <div className="hero-content" style={{ maxWidth: '700px' }}>
                        <h1 style={{ fontSize: '2.2rem', lineHeight: 1.3, marginBottom: '8px' }}>
                            {t('hero_clear') || 'Digital platform for estate planning, legacy management, and bereavement support.'}
                        </h1>
                        <p className="hero-desc" style={{ fontSize: '1.05rem', marginBottom: '10px' }}>
                            {t('hero_sub') || 'Organize documents, preserve memories, and support loved ones — all in one secure place.'}
                        </p>
                        <div className="hero-actions">
                            <Link to="/login" className="btn hero-cta" style={{ fontSize: '0.85rem', padding: '12px 28px', marginTop: '0' }}>{t('cta_create_profile') || 'Create Your Profile'}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services — 3 cards in a row */}
            <section id="services" className="services-section section-padding">
                <div className="container">
                    <h2 className="services-title">{t('svc_title') || 'What we offer'}</h2>
                    <div className="products-grid">
                        {SERVICES.map((svc, i) => {
                            const ts = TIER_STYLE[svc.tier];
                            return (
                                <Link to={svc.link} className="product-card product-card-clickable" key={svc.key} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                                    <div className="product-card-header">
                                        <span className="card-number">0{i + 1}</span>
                                        <h3>{t(`${svc.key}_title`) || svc.key}</h3>
                                        <div className="product-tag">{t(`${svc.key}_tag`) || ''}</div>
                                    </div>
                                    <p>{t(`${svc.key}_desc`) || ''}</p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', textAlign: 'left' }}>
                                        {svc.tools.map(tk => (
                                            <li key={tk} style={{ padding: '4px 0', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                                                <span style={{ color: 'var(--accent-gold)', marginRight: '8px' }}>✓</span>
                                                {t(tk) || tk}
                                            </li>
                                        ))}
                                    </ul>
                                    <span className="btn" style={{ fontSize: '0.85rem', padding: '10px 20px', marginTop: 'auto' }}>
                                        {t(`${svc.key}_btn`) || 'Learn more'}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
