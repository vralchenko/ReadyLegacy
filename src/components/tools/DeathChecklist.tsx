import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import usePersistedState from '../../hooks/usePersistedState';

// ─── After Death Checklist (expanded) ─────────────────────────────────────────

interface CheckItem {
    key: string;
    label: string;
    note?: string;
    deadline?: string;
}

const PHASES: { title: string; subtitle: string; color: string; items: CheckItem[] }[] = [
    {
        title: 'Phase 1: First 24 Hours',
        subtitle: 'Immediate actions right after death',
        color: '#e8a87c',
        items: [
            { key: 'p1_doctor', label: 'Call a doctor to certify the death', deadline: 'Immediately' },
            { key: 'p1_family', label: 'Inform immediate family members', deadline: 'Immediately' },
            { key: 'p1_funeral', label: 'Contact a funeral home', deadline: 'Within 24h' },
            { key: 'p1_executor', label: 'Notify the executor of the will', deadline: 'Within 24h' },
        ]
    },
    {
        title: 'Phase 2: First Week',
        subtitle: 'Administrative and official notifications',
        color: 'var(--accent-gold)',
        items: [
            { key: 'p2_registry', label: 'Register the death at the civil registry office', deadline: 'Within 3 days', note: 'Required in most countries' },
            { key: 'p2_bank', label: 'Notify banks and financial institutions', deadline: 'Within 1 week' },
            { key: 'p2_employer', label: 'Inform the employer or pension fund', deadline: 'Within 1 week' },
            { key: 'p2_insurance', label: 'Contact life insurance companies', deadline: 'Within 1 week' },
            { key: 'p2_will', label: 'Locate and file the will with notary/court', deadline: 'Within 1 week' },
        ]
    },
    {
        title: 'Phase 3: First Month',
        subtitle: 'Legal, financial and property matters',
        color: '#a8d8ea',
        items: [
            { key: 'p3_tax', label: 'File a final tax return for the deceased', deadline: 'First month' },
            { key: 'p3_subscriptions', label: 'Cancel subscriptions and memberships', deadline: 'First month' },
            { key: 'p3_property', label: 'Manage and distribute property per the will', deadline: 'First month' },
            { key: 'p3_digital', label: 'Handle digital accounts (email, social media)', deadline: 'First month' },
            { key: 'p3_authorities', label: 'Notify relevant government authorities', deadline: 'First month', note: 'e.g. immigration, pension office' },
        ]
    },
    {
        title: 'Phase 4: Ongoing',
        subtitle: 'Long-term closure and memorialization',
        color: 'var(--text-muted)',
        items: [
            { key: 'p4_estate', label: 'Complete estate settlement', deadline: 'Within 6-12 months' },
            { key: 'p4_gravestone', label: 'Arrange gravestone or memorial', deadline: 'Within a few months' },
            { key: 'p4_anniversary', label: 'Plan annual memorial observances', deadline: 'Ongoing' },
            { key: 'p4_grief', label: 'Seek grief counseling or support group', deadline: 'As needed' },
        ]
    }
];

const DeathChecklist: React.FC = () => {
    const { t } = useLanguage();
    const [checks, setChecks] = usePersistedState<Record<string, boolean>>('death_checklist_v2', {});
    const [expanded, setExpanded] = useState<number | null>(0);

    const toggle = (key: string) => {
        setChecks({ ...checks, [key]: !checks[key] });
    };

    const allItems = PHASES.flatMap(p => p.items);
    const doneCount = allItems.filter(i => checks[i.key]).length;
    const progress = Math.round((doneCount / allItems.length) * 100);

    return (
        <div id="death-checklist" className="tool-panel active">
            <div className="tool-header" style={{ marginBottom: '32px' }}>
                <span className="step-tag">{t('tag_checklist') || 'After Death Guide'}</span>
                <h2>{t('title_checklist') || 'Step-by-Step After Death Guide'}</h2>
                <p style={{ opacity: 0.7, marginTop: '12px' }}>
                    {t('desc_checklist') || 'A comprehensive guide for what needs to happen after a loved one passes. Track each step to ensure nothing is missed.'}
                </p>
            </div>

            {/* Overall progress */}
            <div style={{ marginBottom: '32px', padding: '20px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Overall Progress</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: 700 }}>{doneCount}/{allItems.length} — {progress}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--glass-bg)', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', width: `${progress}%`,
                        background: 'linear-gradient(90deg, var(--accent-gold), #f0c040)',
                        borderRadius: '4px', transition: 'width 0.5s ease'
                    }} />
                </div>
            </div>

            {/* Phases */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {PHASES.map((phase, phaseIdx) => {
                    const phaseDone = phase.items.filter(i => checks[i.key]).length;
                    const isExpanded = expanded === phaseIdx;
                    return (
                        <div key={phaseIdx} style={{
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            overflow: 'hidden',
                            background: 'var(--glass-bg)'
                        }}>
                            {/* Phase header */}
                            <div
                                onClick={() => setExpanded(isExpanded ? null : phaseIdx)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: '18px 20px', cursor: 'pointer',
                                    borderLeft: `4px solid ${phase.color}`,
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '2px' }}>{phase.title}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{phase.subtitle}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                                    <span style={{
                                        fontSize: '0.8rem', padding: '4px 12px', borderRadius: '12px',
                                        background: phaseDone === phase.items.length ? 'rgba(100,200,100,0.15)' : 'var(--glass-bg)',
                                        color: phaseDone === phase.items.length ? '#6fcf97' : 'var(--text-muted)',
                                        border: `1px solid ${phaseDone === phase.items.length ? 'rgba(100,200,100,0.3)' : 'var(--glass-border)'}`
                                    }}>
                                        {phaseDone}/{phase.items.length}
                                    </span>
                                    <span style={{ opacity: 0.5, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▾</span>
                                </div>
                            </div>

                            {/* Phase items */}
                            {isExpanded && (
                                <div style={{ padding: '8px 20px 16px' }}>
                                    {phase.items.map(item => (
                                        <div
                                            key={item.key}
                                            onClick={() => toggle(item.key)}
                                            style={{
                                                display: 'flex', alignItems: 'flex-start', gap: '14px',
                                                padding: '12px', borderRadius: '8px', cursor: 'pointer',
                                                background: checks[item.key] ? 'rgba(100,200,100,0.05)' : 'transparent',
                                                marginBottom: '6px', transition: 'background 0.2s'
                                            }}
                                        >
                                            <div style={{
                                                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                                marginTop: '1px',
                                                border: checks[item.key] ? '2px solid #6fcf97' : '2px solid var(--text-muted)',
                                                background: checks[item.key] ? '#6fcf97' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}>
                                                {checks[item.key] && <span style={{ color: '#000', fontSize: '11px', fontWeight: 'bold' }}>✓</span>}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    textDecoration: checks[item.key] ? 'line-through' : 'none',
                                                    opacity: checks[item.key] ? 0.4 : 1,
                                                    fontSize: '0.9rem', marginBottom: item.note ? '4px' : '0'
                                                }}>
                                                    {item.label}
                                                </div>
                                                {item.note && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{item.note}</div>}
                                            </div>
                                            {item.deadline && (
                                                <span style={{
                                                    fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px',
                                                    background: 'rgba(255,215,0,0.08)', color: 'rgba(255,215,0,0.7)',
                                                    border: '1px solid rgba(255,215,0,0.15)', flexShrink: 0, whiteSpace: 'nowrap'
                                                }}>
                                                    {item.deadline}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DeathChecklist;
