import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
    activeTool: string;
    onSelectTool: (tool: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const NavItem = ({ tool, label, number }: { tool: string; label: string; number?: string }) => (
        <div
            className={`tools-nav-item ${activeTool === tool ? 'active' : ''}`}
            onClick={() => onSelectTool(tool)}
        >
            {number && <span style={{ opacity: 0.45, fontSize: '0.8em', marginRight: '6px' }}>{number}.</span>}
            {label}
        </div>
    );

    return (
        <aside className="tools-sidebar">
            <div className="sidebar-header">
                <Link to="/" className="home-link-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    {t('home_page') || 'Home Page'}
                </Link>
                <button className="back-btn" onClick={() => activeTool ? navigate('/tools') : navigate('/')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    {t('back') || 'Back'}
                </button>
            </div>

            <div className="tools-nav">
                {/* Be Ready */}
                <div className="nav-group">
                    <div className="group-title">{t('p1_title') || 'Be Ready'}</div>
                    <NavItem tool="asset-overview" label={t('tag_assets') || 'Asset Overview'} number="01" />
                </div>

                {/* Family */}
                <div className="nav-group">
                    <div className="group-title">{t('sidebar_family') || '02 Family'}</div>
                    <NavItem tool="will-builder" label={t('tag_will') || 'Will Structure'} number="02" />
                </div>

                {/* Legal & After Death */}
                <div className="nav-group">
                    <div className="group-title">{t('sidebar_legal') || '03 Legal & Formalities'}</div>
                    <NavItem tool="legal-docs" label={t('tag_legal') || 'Legal Framework'} number="03" />
                    <NavItem tool="death-checklist" label={t('tag_checklist') || 'After Death Guide'} number="04" />
                    <NavItem tool="executor" label={t('auto_todo_list') || 'ToDo List'} number="05" />
                    <NavItem tool="templates" label={t('tag_templates') || 'Request Templates'} number="06" />
                </div>

                {/* Leave Behind */}
                <div className="nav-group">
                    <div className="group-title">{t('p2_title') || 'Leave Behind'}</div>
                    <NavItem tool="leave-behind" label={t('tag_legacy') || 'Digital Legacy'} />
                    <NavItem tool="ai-avatar" label={t('auto_ai_avatar') || '🤖 AI Avatar'} />
                </div>

                {/* Be Honored */}
                <div className="nav-group">
                    <div className="group-title">{t('p3_title') || 'Be Honored'}</div>
                    <div
                        className={`tools-nav-item bereavement-nav ${activeTool === 'bereavement-support' ? 'active' : ''}`}
                        onClick={() => onSelectTool('bereavement-support')}
                    >
                        {t('nav_bereavement') || 'Bereavement Path'}
                    </div>
                </div>

                {/* Utilities */}
                <div className="nav-group">
                    <div className="group-title">{t('sidebar_utilities') || 'Utilities'}</div>
                    <NavItem tool="reminders" label={t('auto_email_reminders') || '📧 Email Reminders'} />
                    <Link to="/profile" style={{ display: 'block', padding: '11px 16px', borderRadius: '8px', fontSize: '0.88rem', color: 'var(--text-muted)', transition: 'all 0.2s', marginBottom: '2px' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-gold)'; e.currentTarget.style.background = 'rgba(255,215,0,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                    >👤 {t('sidebar_profile') || 'My Profile'}</Link>
                    <Link to="/documents" style={{ display: 'block', padding: '11px 16px', borderRadius: '8px', fontSize: '0.88rem', color: 'var(--text-muted)', transition: 'all 0.2s', marginBottom: '2px' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-gold)'; e.currentTarget.style.background = 'rgba(255,215,0,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                    >📄 {t('sidebar_documents') || 'My Documents'}</Link>
                </div>
            </div>

            <style>{`
                .sidebar-header {
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid var(--glass-border);
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 10px;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background: var(--glass-bg);
                }
                .home-link-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--accent-gold);
                    padding: 10px 14px;
                    border-radius: 8px;
                    background: rgba(255,215,0,0.08);
                    transition: all 0.2s;
                }
                .home-link-btn:hover {
                    background: rgba(255,215,0,0.15);
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    background: none;
                    border: 1px solid var(--glass-border);
                    padding: 7px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    width: fit-content;
                }
                .back-btn:hover {
                    color: var(--text-color);
                    border-color: var(--text-muted);
                }
                .nav-group {
                    margin-bottom: 24px;
                }
                .group-title {
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--accent-gold);
                    margin-bottom: 12px;
                    padding-left: 16px;
                }
                .bereavement-nav {
                    margin-top: 0 !important;
                    border-top: none !important;
                    padding-top: 12px !important;
                }
                .tools-nav-item {
                    display: block;
                    width: 100%;
                }
            `}</style>
        </aside >
    );
};

export default Sidebar;
