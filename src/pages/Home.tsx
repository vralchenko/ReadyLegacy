import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const TIERS = [
    {
        tier: 'free',
        services: [
            {
                key: 'svc_ready',
                icon: '🛡️',
                tools: ['svc_ready_t1', 'svc_ready_t2', 'svc_ready_t3', 'svc_ready_t4', 'svc_ready_t5', 'svc_ready_t6'],
                link: '/tools',
            },
            {
                key: 'svc_honored',
                icon: '🕊️',
                tools: ['svc_honored_t1', 'svc_honored_t2', 'svc_honored_t3'],
                link: '/tools?tool=bereavement-support',
            },
        ],
    },
    {
        tier: 'paid',
        services: [
            {
                key: 'svc_legacy',
                icon: '✦',
                tools: ['svc_legacy_t1', 'svc_legacy_t2', 'svc_legacy_t3'],
                link: '/tools?tool=leave-behind',
            },
        ],
    },
];

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

            {/* Services — split by tier */}
            <section id="services" className="services-section section-padding">
                <div className="container">
                    <h2 className="services-title">{t('svc_title') || 'What we offer'}</h2>

                    {TIERS.map(({ tier, services }) => (
                        <div key={tier} style={{ marginBottom: '48px' }}>
                            <div style={{
                                display: 'inline-block',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                marginBottom: '20px',
                                background: tier === 'free' ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)',
                                color: tier === 'free' ? '#34d399' : 'var(--accent-gold)',
                                border: `1px solid ${tier === 'free' ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
                            }}>
                                {tier === 'free' ? (t('tier_free') || 'Free') : (t('tier_paid') || '15 CHF / month')}
                            </div>
                            <div className="products-grid">
                                {services.map((svc, i) => (
                                    <Link to={svc.link} className="product-card product-card-clickable" key={svc.key} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                                        <div className="product-card-header">
                                            <span className="card-number">{svc.icon}</span>
                                            <h3>{t(`${svc.key}_title`) || svc.key}</h3>
                                            <div className="product-tag">{t(`${svc.key}_tag`) || ''}</div>
                                        </div>
                                        <p>{t(`${svc.key}_desc`) || ''}</p>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                                            {svc.tools.map(tk => (
                                                <li key={tk} style={{ padding: '4px 0', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                                                    <span style={{ color: 'var(--accent-gold)', marginRight: '8px' }}>✓</span>
                                                    {t(tk) || tk}
                                                </li>
                                            ))}
                                        </ul>
                                        <span className="btn" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
                                            {t(`${svc.key}_btn`) || 'Learn more'}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Home;
