import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PLANS = [
    {
        plan: 'free',
        color: '#34d399',
        border: 'rgba(52,211,153,0.3)',
        bg: 'rgba(52,211,153,0.08)',
    },
    {
        plan: 'premium',
        color: 'var(--accent-gold)',
        border: 'rgba(251,191,36,0.3)',
        bg: 'rgba(251,191,36,0.08)',
    },
    {
        plan: 'family',
        color: '#a78bfa',
        border: 'rgba(167,139,250,0.3)',
        bg: 'rgba(167,139,250,0.08)',
    },
];

const Pricing: React.FC = () => {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const returnTo = searchParams.get('returnTo') || '/tools';

    const tiers = [
        {
            plan: 'free',
            label: t('pricing_free_name') || 'Free',
            price: 'CHF 0',
            desc: t('pricing_free_desc') || 'Use all tools for free. Print documents anytime.',
            features: [
                t('pricing_free_f1') || 'All planning tools',
                t('pricing_free_f2') || 'Print & save as PDF',
                t('pricing_free_f3') || 'Checklists & guides',
                t('pricing_free_f4') || 'Local data storage',
            ],
            cta: t('pricing_free_cta') || 'Continue Free',
            ctaLink: returnTo,
        },
        {
            plan: 'premium',
            label: t('pricing_premium_name') || 'Premium',
            price: 'CHF 15/mo',
            desc: t('pricing_premium_desc') || 'Save documents to the cloud. Access from any device.',
            features: [
                t('pricing_premium_f1') || 'Unlimited document storage',
                t('pricing_premium_f2') || 'Cloud sync across devices',
                t('pricing_premium_f3') || 'Video & audio messages',
                t('pricing_premium_f4') || 'Unlimited trusted contacts',
                t('pricing_premium_f5') || 'PDF export & print',
                t('pricing_premium_f6') || 'Priority support',
            ],
            cta: t('pricing_premium_cta') || 'Get Premium',
            ctaLink: `/login?returnTo=${encodeURIComponent(returnTo)}`,
            highlight: true,
        },
        {
            plan: 'family',
            label: t('profile_family_plan') || 'Family',
            price: 'CHF 25/mo',
            desc: t('pricing_family_desc') || 'For the whole family. Shared vault and AI features.',
            features: [
                t('profile_family_f1') || 'Everything in Premium',
                t('profile_family_f2') || 'Up to 5 family members',
                t('profile_family_f3') || 'Shared Legacy Vault',
                t('profile_family_f4') || 'Priority support',
                t('profile_family_f5') || 'AI Avatar (beta)',
            ],
            cta: t('pricing_family_cta') || 'Get Family',
            ctaLink: `/login?returnTo=${encodeURIComponent(returnTo)}`,
        },
    ];

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
                    {t('pricing_title') || 'Choose Your Plan'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                    {t('pricing_subtitle') || 'All tools are free to use. Save to the cloud with Premium.'}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {tiers.map((tier, i) => {
                    const style = PLANS[i];
                    return (
                        <div key={tier.plan} style={{
                            padding: '28px', borderRadius: '16px',
                            border: tier.highlight ? `2px solid ${style.color}` : `1px solid var(--glass-border)`,
                            background: 'var(--glass-bg)',
                            display: 'flex', flexDirection: 'column',
                            position: 'relative',
                        }}>
                            {tier.highlight && (
                                <span style={{
                                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                                    padding: '4px 14px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700,
                                    background: style.color, color: '#fff',
                                }}>
                                    {t('pricing_popular') || 'Most Popular'}
                                </span>
                            )}
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: style.color, marginBottom: '4px' }}>{tier.label}</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-color)' }}>{tier.price}</div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>{tier.desc}</p>
                            <div style={{ flex: 1 }}>
                                {tier.features.map(f => (
                                    <div key={f} style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', gap: '8px' }}>
                                        <span style={{ color: style.color, flexShrink: 0 }}>✓</span>
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                to={tier.ctaLink}
                                style={{
                                    display: 'block', textAlign: 'center', marginTop: '20px',
                                    padding: '12px', borderRadius: '10px', textDecoration: 'none',
                                    border: tier.highlight ? 'none' : `1px solid ${style.border}`,
                                    background: tier.highlight ? style.color : 'transparent',
                                    color: tier.highlight ? '#fff' : style.color,
                                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                                }}
                            >
                                {tier.cta}
                            </Link>
                        </div>
                    );
                })}
            </div>

            <div style={{ textAlign: 'center' }}>
                <Link to={returnTo} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                    ← {t('pricing_back') || 'Back to tools'}
                </Link>
            </div>
        </div>
    );
};

export default Pricing;
