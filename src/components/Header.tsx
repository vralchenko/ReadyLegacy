import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Header: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('continuum_user');

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('continuum_user');
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
                            <button className={`lang-btn ${language === 'ru' ? 'active' : ''}`} onClick={() => { setLanguage('ru'); closeMenu(); }}>RU</button>
                            <button className={`lang-btn ${language === 'ua' ? 'active' : ''}`} onClick={() => { setLanguage('ua'); closeMenu(); }}>UA</button>
                        </div>

                        <div className="nav-links">
                            <NavLink to="/mission" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_mission') || 'Mission'}</NavLink>
                            <NavLink to="/tools" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_tools') || 'Tools'}</NavLink>
                            <NavLink to="/documents" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_docs') || 'Documents'}</NavLink>
                            <NavLink to="/team" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>{t('nav_team') || 'Team'}</NavLink>
                        </div>

                        <div className="header-right">
                            {isLoggedIn && (
                                <Link to="/profile" onClick={closeMenu} style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginRight: '8px' }}>👤</Link>
                            )}
                            {isLoggedIn ? (
                                <a href="/" onClick={handleLogout} style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginRight: '16px', cursor: 'pointer', textDecoration: 'none' }}>{t('nav_logout') || 'Sign Out'}</a>
                            ) : (
                                <Link to="/login" onClick={closeMenu} style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginRight: '16px' }}>{t('nav_login') || 'Sign In'}</Link>
                            )}
                            <Link to="/contact" onClick={closeMenu} className="btn header-btn">{t('nav_contact') || 'Get in Touch'}</Link>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
