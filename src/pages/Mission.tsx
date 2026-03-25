import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Mission: React.FC = () => {
    const { t } = useLanguage();

    const STATS = [
        { num: '72,000', text: t('mission_stat_1') || 'families face loss each year in Switzerland' },
        { num: '60%', text: t('mission_stat_2') || 'of adults have no organized estate plan' },
        { num: '5.5M', text: t('mission_stat_3') || 'people in our Swiss target group (35-75)' },
    ];

    const PILLARS = [
        {
            num: '01',
            title: t('p1_title') || 'Be Ready',
            icon: '🛡️',
            desc: t('mission_pillar_1') || 'Organize your documents, assets, and wishes before they are needed. Digital vault, will builder, and legal framework tools.',
            color: '#38bdf8',
        },
        {
            num: '02',
            title: t('p2_title') || 'Leave Behind',
            icon: '✦',
            desc: t('mission_pillar_2') || 'Create lasting memories — messages, photos, videos, and voice recordings for your loved ones.',
            color: '#a78bfa',
        },
        {
            num: '03',
            title: t('p3_title') || 'Be Honored',
            icon: '🕊️',
            desc: t('mission_pillar_3') || 'Support for families during bereavement — grief guidance, executor dashboards, and memorial spaces.',
            color: '#f0c040',
        },
    ];

    return (
        <div style={{ minHeight: '100vh', padding: '0 0 60px' }}>
            {/* Hero */}
            <section style={{ padding: '80px 0 60px', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '3px' }}>
                        {t('mission_label') || 'Our Mission'}
                    </span>
                    <h1 style={{
                        fontSize: '3rem', marginTop: '16px', marginBottom: '24px',
                        color: 'var(--text-color)'
                    }}>
                        {t('why_title') || 'Why Now?'}
                    </h1>
                    <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '650px', margin: '0 auto' }}>
                        {t('why_p')}
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section style={{ padding: '40px 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' }}>
                        {STATS.map((stat, i) => (
                            <div key={i} style={{
                                padding: '32px 20px', borderRadius: '16px',
                                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'
                            }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '8px' }}>
                                    {stat.num}
                                </div>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{stat.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Three Pillars */}
            <section style={{ padding: '60px 0' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px' }}>
                        {t('mission_pillars_title') || 'Three Pillars of Legacy'}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {PILLARS.map(p => (
                            <div key={p.num} style={{
                                padding: '32px 24px', borderRadius: '16px',
                                background: 'var(--glass-bg)',
                                border: `1px solid ${p.color}20`,
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: p.color }} />
                                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{p.icon}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{p.num}</div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: p.color }}>{p.title}</h3>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Swiss Focus */}
            <section style={{ padding: '60px 0' }}>
                <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🇨🇭</div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>
                        {t('mission_swiss_title') || 'Built in Switzerland'}
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px' }}>
                        {t('mission_swiss_desc') || 'ReadyLegacy is designed with Swiss privacy standards at its core. Your data stays secure, compliant with nDSG and GDPR, and hosted on European infrastructure.'}
                    </p>
                    <Link to="/tools" className="btn" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                        {t('cta_start') || 'Start Now'}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Mission;
