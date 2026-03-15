import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import innaImg from '../assets/images/inna.png';
import olgaImg from '../assets/images/olga.png';
import viktorImg from '../assets/images/viktor.png';
import innaQr from '../assets/images/qrcodes/inna_qr.png';
import olgaQr from '../assets/images/qrcodes/olga_qr.png';
import viktorQr from '../assets/images/qrcodes/viktor_qr.png';

const Team: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="team" className="founders section-padding full-height-section">
            <div className="container">
                <h2>{t('team_title') || 'Visionaries'}</h2>
                <div className="founder-names">
                    <div className="founder">
                        <img src={innaImg} alt="Dr. Inna Praxmarer" className="founder-img" style={{ objectPosition: 'center 26%' }} />
                        <div className="founder-header">
                            <h3>Dr. Inna Praxmarer</h3>
                            <a href="https://www.linkedin.com/in/dr-inna-praxmarer/" target="_blank" rel="noopener noreferrer" className="social-link">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                            <div className="qr-wrapper">
                                <a href="https://www.linkedin.com/in/dr-inna-praxmarer/" target="_blank" rel="noopener noreferrer">
                                    <img src={innaQr} alt="LinkedIn QR" className="founder-qr" />
                                </a>
                            </div>
                        </div>
                        <span>{t('role_inna') || 'Co-Founder'}</span>
                        <p className="founder-bio">{t('bio_inna')}</p>
                    </div>
                    <div className="founder">
                        <img src={olgaImg} alt="Olga Sushchinskaya" className="founder-img" style={{ objectPosition: 'center 26%' }} />
                        <div className="founder-header">
                            <h3>Olga Sushchinskaya</h3>
                            <a href="https://www.linkedin.com/in/sushchinskaya-olga-7ba85a5a/" target="_blank" rel="noopener noreferrer" className="social-link">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                            <div className="qr-wrapper">
                                <a href="https://www.linkedin.com/in/sushchinskaya-olga-7ba85a5a/" target="_blank" rel="noopener noreferrer">
                                    <img src={olgaQr} alt="LinkedIn QR" className="founder-qr" />
                                </a>
                            </div>
                        </div>
                        <span>{t('role_olga') || 'Co-Founder'}</span>
                        <p className="founder-bio">{t('bio_olga')}</p>
                    </div>
                    <div className="founder">
                        <img src={viktorImg} alt="Viktor Ralchenko" className="founder-img" style={{ objectPosition: 'center 26%' }} />
                        <div className="founder-header">
                            <h3>Viktor Ralchenko</h3>
                            <a href="https://www.linkedin.com/in/victoralchenko/" target="_blank" rel="noopener noreferrer" className="social-link">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                            <div className="qr-wrapper">
                                <a href="https://www.linkedin.com/in/victoralchenko/" target="_blank" rel="noopener noreferrer">
                                    <img src={viktorQr} alt="LinkedIn QR" className="founder-qr" />
                                </a>
                            </div>
                        </div>
                        <span>{t('role_viktor') || 'Co-Founder'}</span>
                        <p className="founder-bio">{t('bio_viktor')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Team;
