import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        closeMenu();
        navigate('/');
    };

    return (
        <header className={isMenuOpen ? 'menu-open' : ''}>
            <div className="container">
                <nav>
                    <div className="logo"><Link to="/" onClick={closeMenu}>{t('logo') || 'Ready Legacy'}</Link></div>

                    <div className="mobile-toggle" onClick={toggleMenu}>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>

                    <div className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
                        <div className="lang-switcher">
                            <button className={`lang-btn ${language === 'en' ? 'active' : ''}`} onClick={() => { setLanguage('en'); closeMenu(); }}>EN</button>
                            <button className={`lang-btn ${language === 'de' ? 'active' : ''}`} onClick={() => { setLanguage('de'); closeMenu(); }}>DE</button>
                        </div>

                        <div className="nav-links">
                            <NavLink to="/mission" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_mission') || 'Mission'}</NavLink>
                            <NavLink to="/tools" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_tools') || 'Tools'}</NavLink>
                            <NavLink to="/documents" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_docs') || 'Documents'}</NavLink>
                        </div>

                        <div className="header-right">
                            {user && (
                                <Link to="/profile" onClick={closeMenu} style={{ marginRight: '4px', display: 'flex', alignItems: 'center' }}>
                                    {user.picture ? (
                                        <img src={user.picture} alt="" referrerPolicy="no-referrer" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{'\uD83D\uDC64'}</span>
                                    )}
                                </Link>
                            )}
                            {user ? (
                                <a href="/" onClick={handleLogout} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '8px', cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap' }}>{t('nav_logout') || 'Sign Out'}</a>
                            ) : (
                                <Link to="/login" onClick={closeMenu} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '8px', whiteSpace: 'nowrap' }}>{t('nav_login') || 'Sign In'}</Link>
                            )}
                            <Link to="/contact" onClick={closeMenu} className="btn header-btn" style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', padding: '8px 16px' }}>{t('nav_contact') || 'Get in Touch'}</Link>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
