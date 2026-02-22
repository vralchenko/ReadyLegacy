import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import productsBg from '../assets/images/products-bg.png';

const Home: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="home-page">
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>{t('hero_h1')}</h1>
                        <p>{t('hero_p')}</p>
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
                </div>
            </section>
        </div>
    );
};

export default Home;
