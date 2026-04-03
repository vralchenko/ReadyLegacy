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

    const location = useLocation();

    useEffect(() => {
        const tool = searchParams.get('tool') || '';
        setActiveTool(tool);
    }, [searchParams]);

    // Scroll to section if hash is present (e.g. /tools#leave_behind)
    useEffect(() => {
        if (location.hash && !activeTool) {
            const id = location.hash.replace('#', '');
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [location.hash, activeTool]);

    const handleSelectTool = (tool: string) => {
        setActiveTool(tool);
        setSearchParams({ tool });
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
                            <div key={section.section} id={section.section} style={{ marginBottom: '40px', scrollMarginTop: '120px' }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '4px' }}>
                                    {t(SECTION_LABELS[section.section]) || section.section}
                                </h2>
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
                </div>
            </div>
        );
    }

    return (
        <div className="tools-layout">
            <Sidebar activeTool={activeTool} onSelectTool={handleSelectTool} />
            <div className="tools-content">
                {renderTool()}
            </div>
        </div>
    );
};

export default Tools;
