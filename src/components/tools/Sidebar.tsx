import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
    activeTool: string;
    onSelectTool: (tool: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool }) => {
    const { t } = useLanguage();

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
                <Link to="/" className="back-home-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    {t('back_home') || 'Back Home'}
                </Link>
            </div>

            <div className="tools-nav">
                {/* Be Ready */}
                <div className="nav-group">
                    <div className="group-title">{t('p1_title') || 'Be Ready'}</div>
                    <NavItem tool="asset-overview" label={t('tag_assets') || 'Asset Overview'} number="01" />
                </div>

                {/* Family */}
                <div className="nav-group">
                    <div className="group-title">02 Family</div>
                    <NavItem tool="will-builder" label={t('tag_will') || 'Will Structure'} number="02" />
                </div>

                {/* Legal & After Death */}
                <div className="nav-group">
                    <div className="group-title">03 Legal & Formalities</div>
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
                    <div className="group-title">Utilities</div>
                    <NavItem tool="reminders" label={t('auto_email_reminders') || '📧 Email Reminders'} />
                    <Link to="/profile" style={{ display: 'block', padding: '11px 16px', borderRadius: '8px', fontSize: '0.88rem', color: 'var(--text-muted)', transition: 'all 0.2s', marginBottom: '2px' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-gold)'; e.currentTarget.style.background = 'rgba(255,215,0,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                    >👤 My Profile</Link>
                    <Link to="/documents" style={{ display: 'block', padding: '11px 16px', borderRadius: '8px', fontSize: '0.88rem', color: 'var(--text-muted)', transition: 'all 0.2s', marginBottom: '2px' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-gold)'; e.currentTarget.style.background = 'rgba(255,215,0,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                    >📄 My Documents</Link>
                </div>
            </div>

            <style>{`
                .sidebar-header {
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid var(--glass-border);
                }
                .back-home-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.8rem;
                    color: var(--accent-gold);
                    opacity: 0.8;
                    transition: opacity 0.3s;
                }
                .back-home-link:hover {
                    opacity: 1;
                }
                .nav-group {
                    margin-bottom: 24px;
                }
                .group-title {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--text-muted);
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
