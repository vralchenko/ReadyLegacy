import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SERVICES = [
    {
        key: 'svc_ready',
        icon: '🛡️',
        tools: ['svc_ready_t1', 'svc_ready_t2', 'svc_ready_t3', 'svc_ready_t4', 'svc_ready_t5', 'svc_ready_t6'],
        link: '/tools',
    },
    {
        key: 'svc_legacy',
        icon: '✦',
        tools: ['svc_legacy_t1', 'svc_legacy_t2', 'svc_legacy_t3'],
        link: '/tools?tool=leave-behind',
    },
    {
        key: 'svc_honored',
        icon: '🕊️',
        tools: ['svc_honored_t1', 'svc_honored_t2', 'svc_honored_t3'],
        link: '/tools?tool=bereavement-support',
    },
];

const PRICING = [
    {
        key: 'free',
        price: '0',
        period: 'pricing_free_period',
        features: ['pricing_free_f1', 'pricing_free_f2', 'pricing_free_f3', 'pricing_free_f4'],
        btnKey: 'pricing_free_btn',
        popular: false,
    },
    {
        key: 'premium',
        price: '15',
        period: 'pricing_premium_period',
        features: ['pricing_premium_f1', 'pricing_premium_f2', 'pricing_premium_f3', 'pricing_premium_f4', 'pricing_premium_f5', 'pricing_premium_f6'],
        btnKey: 'pricing_premium_btn',
        popular: true,
    },
    {
        key: 'family',
        price: '25',
        period: 'pricing_family_period',
        features: ['pricing_family_f1', 'pricing_family_f2', 'pricing_family_f3', 'pricing_family_f4', 'pricing_family_f5'],
        btnKey: 'pricing_family_btn',
        popular: false,
    },
];

const Home: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="home-page">
            {/* Hero — Compact */}
            <section className="hero hero-redesigned" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <div className="container">
                    <div className="hero-content" style={{ maxWidth: '700px' }}>
                        <h1 style={{ fontSize: '2.2rem', lineHeight: 1.3, marginBottom: '12px' }}>
                            {t('hero_clear') || 'Digital platform for estate planning, legacy management, and bereavement support.'}
                        </h1>
                        <p className="hero-desc" style={{ fontSize: '1.05rem', marginBottom: '20px' }}>
                            {t('hero_sub') || 'Organize documents, preserve memories, and support loved ones — all in one secure place.'}
                        </p>
                        <div className="hero-actions">
                            <Link to="/login" className="btn hero-cta" style={{ fontSize: '0.85rem', padding: '12px 28px', marginTop: '0' }}>{t('cta_get_started') || 'Get Started Free'}</Link>
                            <a href="#services" className="btn btn-outline hero-cta" style={{ fontSize: '0.85rem', padding: '12px 28px', marginTop: '0' }}>{t('hero_learn') || 'See Services'}</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section id="services" className="services-section section-padding">
                <div className="container">
                    <h2 className="services-title">{t('svc_title') || 'What we offer'}</h2>
                    <div className="products-grid">
                        {SERVICES.map((svc, i) => (
                            <div className="product-card" key={svc.key}>
                                <div className="product-card-header">
                                    <span className="card-number">0{i + 1}</span>
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
                                <Link to={svc.link} className="btn" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
                                    {t(`${svc.key}_btn`) || 'Learn more'}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="pricing-section section-padding">
                <div className="container">
                    <h2 className="pricing-title">{t('pricing_title') || 'Choose your plan'}</h2>
                    <p className="pricing-subtitle">{t('pricing_subtitle') || 'Start free. Upgrade when you\'re ready.'}</p>
                    <div className="pricing-grid pricing-grid--three">
                        {PRICING.map(tier => (
                            <div className={`pricing-card ${tier.popular ? 'pricing-card--premium' : ''}`} key={tier.key}>
                                {tier.popular && <div className="pricing-badge">Popular</div>}
                                <div className="pricing-header">
                                    <h3>{t(`pricing_${tier.key}_name`) || tier.key}</h3>
                                    <div className="pricing-price">
                                        <span className="price-amount">{tier.price}</span>
                                        <span className="price-currency">{t('pricing_currency') || 'CHF'}</span>
                                    </div>
                                    <span className="price-period">{t(tier.period) || ''}</span>
                                </div>
                                <ul className="pricing-features">
                                    {tier.features.map(fk => (
                                        <li key={fk}>{t(fk) || fk}</li>
                                    ))}
                                </ul>
                                <Link to="/login" className={tier.popular ? 'btn' : 'btn btn-outline'}>{t(tier.btnKey) || 'Get Started'}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="cta-section section-padding">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }}>{t('cta_final_title') || 'Start your free account'}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                        {t('cta_final_desc') || 'Organize your estate, preserve your legacy, and protect your loved ones — all in one place.'}
                    </p>
                    <Link to="/login" className="btn hero-cta">{t('cta_final_btn') || 'Create Free Account'}</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
