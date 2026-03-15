import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import productsBg from '../assets/images/products-bg.png';

const FEATURES = [
    { key: 'feat_1', icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M6 18h36" stroke="currentColor" strokeWidth="2"/><path d="M16 26h16M16 32h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    )},
    { key: 'feat_2', icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="18" cy="20" r="6" stroke="currentColor" strokeWidth="2"/><circle cx="30" cy="20" r="6" stroke="currentColor" strokeWidth="2"/><path d="M8 38c0-5.523 4.477-10 10-10h12c5.523 0 10 4.477 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    )},
    { key: 'feat_3', icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2"/><circle cx="24" cy="22" r="6" stroke="currentColor" strokeWidth="2"/><path d="M20 28l4-3 4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 36h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    )},
    { key: 'feat_4', icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 6C14.059 6 6 14.059 6 24s8.059 18 18 18c2.28 0 4.47-.426 6.48-1.2L42 44l-3.2-11.52A17.9 17.9 0 0042 24c0-9.941-8.059-18-18-18z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M16 22h16M16 28h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    )},
    { key: 'feat_5', icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 42s-16-8.4-16-20a10 10 0 0116-8 10 10 0 0116 8c0 11.6-16 20-16 20z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
    )},
];

const QUIZ_KEYS = ['quiz_q1', 'quiz_q2', 'quiz_q3', 'quiz_q4', 'quiz_q5'];

const LOGOS = [
    { name: 'HSLU', text: 'HSLU Smart-Up' },
    { name: 'Vercel', text: 'Vercel' },
    { name: 'Swiss Made', text: 'Swiss Made Software' },
    { name: 'React', text: 'React' },
    { name: 'TypeScript', text: 'TypeScript' },
    { name: 'AI Powered', text: 'AI Powered' },
];

const Home: React.FC = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    // Quiz state
    const [quizStep, setQuizStep] = useState(-1); // -1 = not started
    const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
        }
    };

    const handleQuizAnswer = (yes: boolean) => {
        const newAnswers = [...quizAnswers, yes];
        setQuizAnswers(newAnswers);
        setQuizStep(quizStep + 1);
    };

    const quizScore = quizAnswers.filter(Boolean).length;
    const quizDone = quizAnswers.length === QUIZ_KEYS.length;

    const getQuizResult = () => {
        if (quizScore <= 1) return t('quiz_result_low');
        if (quizScore <= 3) return t('quiz_result_mid');
        return t('quiz_result_high');
    };

    const resetQuiz = () => {
        setQuizStep(-1);
        setQuizAnswers([]);
    };

    return (
        <div className="home-page">
            {/* Hero — Redesigned */}
            <section className="hero hero-redesigned">
                <div className="container">
                    <div className="hero-content">
                        <span className="hero-tagline">{t('hero_tagline') || 'The Future of Legacy'}</span>
                        <h1>{t('hero_h1_new') || t('hero_h1')}</h1>
                        <p className="hero-desc">{t('hero_p_new') || t('hero_p')}</p>
                        <div className="hero-actions">
                            <Link to="/tools" className="btn hero-cta">{t('cta_start') || 'Start Now'}</Link>
                            <a href="#products" className="btn btn-outline hero-cta">{t('hero_btn') || 'Explore the Ecosystem'}</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Logos Slider */}
            <section className="logos-section">
                <div className="container">
                    <p className="logos-label">{t('logos_title') || 'Supported by'}</p>
                    <div className="logos-track">
                        <div className="logos-slide">
                            {[...LOGOS, ...LOGOS].map((logo, i) => (
                                <span className="logo-item" key={i}>{logo.text}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="tech-stack section-padding">
                <div className="container">
                    <div className="tech-grid">
                        <div className="tech-item">
                            <h4>{t('tech_1') || 'Secure Cloud Storage'}</h4>
                            <p>{t('tech_1_sub') || 'Privacy & Data Protection'}</p>
                        </div>
                        <div className="tech-item">
                            <h4>{t('tech_2') || 'AI-Powered Content'}</h4>
                            <p>{t('tech_2_sub') || 'Voice, Text & Personalization'}</p>
                        </div>
                        <div className="tech-item">
                            <h4>{t('tech_3') || 'Immersive Web'}</h4>
                            <p>{t('tech_3_sub') || '3D Environments & Experience'}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section section-padding">
                <div className="container">
                    <h2 className="features-title">{t('features_title') || 'Ready Legacy simplifies your life'}</h2>
                    <p className="features-subtitle">{t('features_subtitle')}</p>
                    <div className="features-grid">
                        {FEATURES.map(f => (
                            <div className="feature-card" key={f.key}>
                                <div className="feature-icon">{f.icon}</div>
                                <h4>{t(`${f.key}_title`)}</h4>
                                <p>{t(`${f.key}_desc`)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="section-cta">
                        <Link to="/tools" className="btn">{t('cta_start') || 'Start Now'}</Link>
                    </div>
                </div>
            </section>

            {/* Ecosystem / 3 Pillars */}
            <section id="products" className="products section-padding">
                <img src={productsBg} alt="Abstract Geometry" className="products-bg" />
                <div className="container">
                    <div className="heading-block" style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '3rem', margin: 0 }}>{t('eco_title') || 'Our Ecosystem'}</h2>
                        <p style={{ fontSize: '1.2rem', margin: '12px 0 0 0' }}>{t('eco_subtitle') || 'A complete digital platform for every stage.'}</p>
                    </div>

                    <div className="products-grid">
                        <div className="product-card">
                            <div className="product-card-header">
                                <span className="card-number">01</span>
                                <h3>{t('p1_title') || 'Be Ready'}</h3>
                                <div className="product-tag">{t('p1_tag') || 'Preparation & Structure'}</div>
                            </div>
                            <p>{t('p1_desc')}</p>
                            <Link to="/tools" className="btn" style={{ fontSize: '1rem', padding: '12px 24px' }}>
                                {t('p1_btn') || 'Launch Tools'}
                            </Link>
                        </div>

                        <div className="product-card">
                            <div className="product-card-header">
                                <span className="card-number">02</span>
                                <h3>{t('p2_title') || 'Leave Behind'}</h3>
                                <div className="product-tag">{t('p2_tag') || 'Conscious Legacy'}</div>
                            </div>
                            <p>{t('p2_desc')}</p>
                            <Link to="/tools?tool=leave-behind" className="btn" style={{ fontSize: '1rem', padding: '12px 24px' }}>
                                {t('p2_btn') || 'Create Legacy'}
                            </Link>
                        </div>

                        <div className="product-card">
                            <div className="product-card-header">
                                <span className="card-number">03</span>
                                <h3>{t('p3_title') || 'Be Honored'}</h3>
                                <div className="product-tag">{t('p3_tag') || 'Dignified Remembrance'}</div>
                            </div>
                            <p>{t('p3_desc')}</p>
                            <Link to="/tools?tool=bereavement-support" className="btn" style={{ fontSize: '1rem', padding: '12px 24px' }}>
                                {t('nav_bereavement') || 'Bereavement Support'}
                            </Link>
                        </div>
                    </div>

                    <div className="section-cta">
                        <Link to="/tools" className="btn">{t('cta_start') || 'Start Now'}</Link>
                    </div>
                </div>
            </section>

            {/* Quiz */}
            <section className="quiz-section section-padding">
                <div className="container">
                    <div className="quiz-box">
                        {quizStep === -1 && !quizDone && (
                            <>
                                <h2>{t('quiz_title') || 'How prepared are you?'}</h2>
                                <p>{t('quiz_subtitle')}</p>
                                <button className="btn" onClick={() => setQuizStep(0)}>
                                    {t('cta_start') || 'Start Now'}
                                </button>
                            </>
                        )}

                        {quizStep >= 0 && !quizDone && (
                            <>
                                <div className="quiz-progress">
                                    {QUIZ_KEYS.map((_, i) => (
                                        <div key={i} className={`quiz-dot ${i < quizAnswers.length ? 'done' : ''} ${i === quizAnswers.length ? 'active' : ''}`} />
                                    ))}
                                </div>
                                <h3 className="quiz-question">{t(QUIZ_KEYS[quizAnswers.length])}</h3>
                                <div className="quiz-buttons">
                                    <button className="btn" onClick={() => handleQuizAnswer(true)}>
                                        {t('quiz_yes') || 'Yes'}
                                    </button>
                                    <button className="btn btn-outline" onClick={() => handleQuizAnswer(false)}>
                                        {t('quiz_no') || 'Not yet'}
                                    </button>
                                </div>
                            </>
                        )}

                        {quizDone && (
                            <div className="quiz-result">
                                <h3>{t('quiz_result_title') || 'Your Readiness Score'}</h3>
                                <div className="quiz-score">
                                    <span className="quiz-score-number">{quizScore}</span>
                                    <span className="quiz-score-total">/ {QUIZ_KEYS.length}</span>
                                </div>
                                <div className="quiz-score-bar">
                                    <div className="quiz-score-fill" style={{ width: `${(quizScore / QUIZ_KEYS.length) * 100}%` }} />
                                </div>
                                <p className="quiz-result-text">{getQuizResult()}</p>
                                <div className="quiz-result-actions">
                                    <Link to="/tools" className="btn">{t('quiz_cta') || 'Start Your Plan'}</Link>
                                    <button className="btn btn-outline" onClick={resetQuiz}>{t('quiz_subtitle') ? '↻' : '↻'} Retry</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="stats-section section-padding">
                <div className="container">
                    <h2 className="stats-title">{t('stats_title') || 'Your peace of mind matters'}</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">{t('stat_1_num')}</span>
                            <p className="stat-text">{t('stat_1_text')}</p>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{t('stat_2_num')}</span>
                            <p className="stat-text">{t('stat_2_text')}</p>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{t('stat_3_num')}</span>
                            <p className="stat-text">{t('stat_3_text')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="pricing-section section-padding">
                <div className="container">
                    <h2 className="pricing-title">{t('pricing_title') || 'Choose your plan'}</h2>
                    <p className="pricing-subtitle">{t('pricing_subtitle')}</p>
                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3>{t('pricing_free_name') || 'Free'}</h3>
                                <div className="pricing-price">
                                    <span className="price-amount">{t('pricing_free_price') || '0'}</span>
                                    <span className="price-currency">{t('pricing_currency') || 'CHF'}</span>
                                </div>
                                <span className="price-period">{t('pricing_free_period') || 'forever'}</span>
                            </div>
                            <ul className="pricing-features">
                                <li>{t('pricing_free_f1')}</li>
                                <li>{t('pricing_free_f2')}</li>
                                <li>{t('pricing_free_f3')}</li>
                                <li>{t('pricing_free_f4')}</li>
                            </ul>
                            <Link to="/login" className="btn btn-outline">{t('pricing_free_btn') || 'Get Started'}</Link>
                        </div>

                        <div className="pricing-card pricing-card--premium">
                            <div className="pricing-badge">Popular</div>
                            <div className="pricing-header">
                                <h3>{t('pricing_premium_name') || 'Premium'}</h3>
                                <div className="pricing-price">
                                    <span className="price-amount">{t('pricing_premium_price') || '15'}</span>
                                    <span className="price-currency">{t('pricing_currency') || 'CHF'}</span>
                                </div>
                                <span className="price-period">{t('pricing_premium_period') || '/month'}</span>
                            </div>
                            <ul className="pricing-features">
                                <li>{t('pricing_premium_f1')}</li>
                                <li>{t('pricing_premium_f2')}</li>
                                <li>{t('pricing_premium_f3')}</li>
                                <li>{t('pricing_premium_f4')}</li>
                                <li>{t('pricing_premium_f5')}</li>
                                <li>{t('pricing_premium_f6')}</li>
                            </ul>
                            <Link to="/login" className="btn">{t('pricing_premium_btn') || 'Start Premium'}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="newsletter-section section-padding">
                <div className="container">
                    <div className="newsletter-box">
                        <h2>{t('newsletter_title') || 'Stay informed'}</h2>
                        <p>{t('newsletter_desc')}</p>
                        {subscribed ? (
                            <p className="newsletter-success">{t('newsletter_success') || 'Thank you for subscribing!'}</p>
                        ) : (
                            <form className="newsletter-form" onSubmit={handleNewsletter}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder={t('newsletter_placeholder') || 'Enter your email'}
                                    required
                                />
                                <button type="submit" className="btn">{t('newsletter_btn') || 'Subscribe'}</button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
