import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Sidebar from '../components/tools/Sidebar';
import AssetOverview from '../components/tools/AssetOverview';
import LegalDocs from '../components/tools/LegalDocs';
import DeathChecklist from '../components/tools/DeathChecklist';
import Executor from '../components/tools/Executor';
import WillBuilder from '../components/tools/WillBuilder';
import Templates from '../components/tools/Templates';
import BereavementSupport from '../components/tools/BereavementSupport';
import LeaveBehind from '../components/tools/LeaveBehind';
import Reminders from '../components/tools/Reminders';
import AIAvatar from '../components/tools/AIAvatar';

const TOOL_CARDS = [
    { section: 'be_ready', tools: [
        { key: 'asset-overview', icon: '📊', color: '#38bdf8' },
        { key: 'will-builder', icon: '📝', color: '#a78bfa' },
        { key: 'legal-docs', icon: '⚖️', color: '#34d399' },
        { key: 'death-checklist', icon: '📋', color: '#f472b6' },
        { key: 'executor', icon: '✅', color: '#fb923c' },
        { key: 'templates', icon: '📄', color: '#6fcf97' },
    ]},
    { section: 'leave_behind', tools: [
        { key: 'leave-behind', icon: '✦', color: '#a78bfa' },
        { key: 'ai-avatar', icon: '🤖', color: '#38bdf8' },
    ]},
    { section: 'be_honored', tools: [
        { key: 'bereavement-support', icon: '🕊️', color: '#f0c040' },
    ]},
];

const TOOL_LABELS: Record<string, { nameKey: string; descKey: string }> = {
    'asset-overview': { nameKey: 'tag_assets', descKey: 'tools_desc_assets' },
    'will-builder': { nameKey: 'tag_will', descKey: 'tools_desc_will' },
    'legal-docs': { nameKey: 'tag_legal', descKey: 'tools_desc_legal' },
    'death-checklist': { nameKey: 'tag_checklist', descKey: 'tools_desc_checklist' },
    'executor': { nameKey: 'auto_todo_list', descKey: 'tools_desc_executor' },
    'templates': { nameKey: 'tag_templates', descKey: 'tools_desc_templates' },
    'leave-behind': { nameKey: 'tag_legacy', descKey: 'tools_desc_legacy' },
    'ai-avatar': { nameKey: 'auto_ai_avatar', descKey: 'tools_desc_avatar' },
    'bereavement-support': { nameKey: 'nav_bereavement', descKey: 'tools_desc_bereavement' },
};

const SECTION_LABELS: Record<string, string> = {
    be_ready: 'p1_title',
    leave_behind: 'p2_title',
    be_honored: 'p3_title',
};

const SECTION_TIER: Record<string, 'free' | 'paid'> = {
    be_ready: 'free',
    leave_behind: 'paid',
    be_honored: 'free',
};

const Tools: React.FC = () => {
    const { t } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTool = searchParams.get('tool') || '';
    const [activeTool, setActiveTool] = useState(initialTool);
    const [tierModal, setTierModal] = useState<'free' | 'paid' | null>(null);

    const location = useLocation();

    useEffect(() => {
        const tool = searchParams.get('tool') || '';
        setActiveTool(tool);
    }, [searchParams]);

    // Scroll to section if hash is present (e.g. /tools#leave_behind)
    useEffect(() => {
        if (!location.hash) return;
        const id = location.hash.replace('#', '');
        const tryScroll = (attempts: number) => {
            const el = document.getElementById(id);
            if (el) {
                // body.demo-mode uses <main> as scroll container, not window
                const scrollContainer = document.querySelector('main') || window;
                if (scrollContainer instanceof HTMLElement) {
                    const y = el.offsetTop - 80;
                    scrollContainer.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
                } else {
                    const y = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
                }
            } else if (attempts > 0) {
                setTimeout(() => tryScroll(attempts - 1), 200);
            }
        };
        setTimeout(() => tryScroll(5), 300);
    }, [location.hash]);

    const handleSelectTool = (tool: string) => {
        setActiveTool(tool);
        setSearchParams({ tool });
    };

    // Flat ordered list of tools for Back/Next navigation
    const TOOL_ORDER = TOOL_CARDS.flatMap(s => s.tools.map(t => t.key));

    const currentIndex = TOOL_ORDER.indexOf(activeTool);
    const prevTool = currentIndex > 0 ? TOOL_ORDER[currentIndex - 1] : null;
    const nextTool = currentIndex < TOOL_ORDER.length - 1 ? TOOL_ORDER[currentIndex + 1] : null;

    const getToolName = (key: string) => {
        const labels = TOOL_LABELS[key];
        return labels ? (t(labels.nameKey) || key) : key;
    };

    const renderTool = () => {
        switch (activeTool) {
            case 'asset-overview': return <AssetOverview />;
            case 'legal-docs': return <LegalDocs />;
            case 'death-checklist': return <DeathChecklist />;
            case 'executor': return <Executor />;
            case 'will-builder': return <WillBuilder />;
            case 'templates': return <Templates />;
            case 'bereavement-support': return <BereavementSupport />;
            case 'leave-behind': return <LeaveBehind />;
            case 'reminders': return <Reminders />;
            case 'ai-avatar': return <AIAvatar />;
            default: return null;
        }
    };

    // Show dashboard when no tool selected
    if (!activeTool) {
        return (
            <div className="tools-layout">
                <Sidebar activeTool={activeTool} onSelectTool={handleSelectTool} />
                <div className="tools-content">
                    <div style={{ padding: '8px 0' }}>
                        {TOOL_CARDS.map(section => (
                            <div key={section.section} id={section.section} style={{ marginBottom: '40px', scrollMarginTop: '80px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-color)', margin: 0 }}>
                                        {t(SECTION_LABELS[section.section]) || section.section}
                                    </h2>
                                    <span
                                        onClick={() => setTierModal(SECTION_TIER[section.section])}
                                        style={{
                                        padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                                        background: SECTION_TIER[section.section] === 'free' ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)',
                                        color: SECTION_TIER[section.section] === 'free' ? '#34d399' : 'var(--accent-gold)',
                                        border: `1px solid ${SECTION_TIER[section.section] === 'free' ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
                                    }}>
                                        {SECTION_TIER[section.section] === 'free' ? (t('tier_free') || 'Free') : (t('tier_paid') || '15 CHF/mo')} ℹ️
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                                    {section.tools.map(tool => {
                                        const labels = TOOL_LABELS[tool.key];
                                        return (
                                            <div
                                                key={tool.key}
                                                onClick={() => handleSelectTool(tool.key)}
                                                style={{
                                                    padding: '20px', borderRadius: '14px', cursor: 'pointer',
                                                    background: 'var(--glass-bg)',
                                                    border: `1px solid ${tool.color}20`,
                                                    transition: 'all 0.25s', position: 'relative', overflow: 'hidden'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${tool.color}40`; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${tool.color}20`; }}
                                            >
                                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: tool.color }} />
                                                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{tool.icon}</div>
                                                <h4 style={{ fontSize: '0.95rem', marginBottom: '6px', color: 'var(--text-color)' }}>
                                                    {t(labels.nameKey) || tool.key}
                                                </h4>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                                    {t(labels.descKey) || ''}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Tier info modal */}
                    {tierModal && (
                        <div onClick={() => setTierModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                            <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-color)', borderRadius: '16px', border: '1px solid var(--glass-border)', padding: '28px', maxWidth: '420px', width: '90%' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: tierModal === 'free' ? '#34d399' : 'var(--accent-gold)' }}>
                                    {tierModal === 'free' ? (t('tier_free_title') || 'Free Tier') : (t('tier_paid_title') || 'Premium — 15 CHF / month')}
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                                    {tierModal === 'free'
                                        ? (t('tier_free_desc') || 'All essential estate planning tools are free to use. Your data is saved locally in your browser. Create an account to save your documents to the cloud.')
                                        : (t('tier_paid_desc') || 'Premium features include the Digital Legacy Vault and AI Avatar. Store memories, messages, and media for your loved ones. Secure cloud storage with end-to-end encryption.')
                                    }
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                                    {(tierModal === 'free'
                                        ? ['Asset Overview', 'Will Builder', 'Legal Documents', 'Death Checklist', 'Executor Tasks', 'Templates']
                                        : ['Digital Legacy Vault', 'AI Avatar', 'Unlimited cloud storage', 'Priority support']
                                    ).map((item, i) => (
                                        <li key={i} style={{ padding: '4px 0', fontSize: '0.9rem', color: 'var(--text-color)' }}>
                                            <span style={{ color: tierModal === 'free' ? '#34d399' : 'var(--accent-gold)', marginRight: '8px' }}>✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => setTierModal(null)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: tierModal === 'free' ? '#34d399' : 'var(--accent-gold)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                                    {t('tier_close') || 'Got it'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="tools-layout">
            <Sidebar activeTool={activeTool} onSelectTool={handleSelectTool} />
            <div className="tools-content">
                {renderTool()}
                {/* Back / Next navigation */}
                {activeTool && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                        {prevTool ? (
                            <button onClick={() => handleSelectTool(prevTool)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                                ← {getToolName(prevTool)}
                            </button>
                        ) : <div />}
                        <button onClick={() => handleSelectTool('')} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
                            {t('tools_all') || 'All Tools'}
                        </button>
                        {nextTool ? (
                            <button onClick={() => handleSelectTool(nextTool)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--accent-gold)', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
                                {getToolName(nextTool)} →
                            </button>
                        ) : <div />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tools;
