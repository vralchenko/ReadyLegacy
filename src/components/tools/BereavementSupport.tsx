import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import usePersistedState from '../../hooks/usePersistedState';

// ─── Support Groups Data ──────────────────────────────────────────────────────
const SUPPORT_GROUPS = [
    { name: 'Verwaiste Eltern', region: 'Germany / Austria / CH', type: 'In-Person & Online', url: '#', desc: 'Support for parents who have lost a child.' },
    { name: 'Grief Share', region: 'International', type: 'Online', url: '#', desc: 'Grief recovery support groups and resources.' },
    { name: 'The Compassionate Friends', region: 'International', type: 'In-Person & Online', url: '#', desc: 'Supporting family members after the death of a child.' },
    { name: 'Caritas Grief Counseling', region: 'Austria / Germany', type: 'In-Person', url: '#', desc: 'Professional grief counseling services.' },
    { name: 'Online Grief Support', region: 'Global', type: 'Online', url: '#', desc: '24/7 forums and chat groups for those in grief.' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const BereavementSupport: React.FC = () => {
    const { t } = useLanguage();
    const [checks, setChecks] = usePersistedState<Record<string, boolean>>('bereavement_checks', {});
    const [activeTab, setActiveTab] = useState<'emotional' | 'groups'>('emotional');

    const toggle = (key: string) => setChecks({ ...checks, [key]: !checks[key] });

    const EMOTIONAL_ITEMS = [
        { key: 'ber_meaningful', label: t('check_meaningful') || 'Create meaningful moments together', section: t('ber_section_anticipatory') || 'Anticipatory Grief' },
        { key: 'ber_comm', label: t('check_open_comm') || 'Open heart communication', section: t('ber_section_anticipatory') || 'Anticipatory Grief' },
        { key: 'ber_prep', label: t('check_emotional_prep') || 'Emotional and spiritual preparation', section: t('ber_section_anticipatory') || 'Anticipatory Grief' },
        { key: 'ber_space', label: t('check_ber_space') || 'Create a dedicated space for grief and reflection', section: t('ber_section_firstaid') || 'Emotional First Aid' },
        { key: 'ber_support', label: t('check_ber_support') || 'Reach out to a grief counselor or support group', section: t('ber_section_firstaid') || 'Emotional First Aid' },
        { key: 'ber_selfcare', label: t('check_ber_selfcare') || 'Prioritize self-care and basic physical needs', section: t('ber_section_firstaid') || 'Emotional First Aid' },
        { key: 'ber_diary', label: t('check_ber_diary') || 'Start a grief journal', section: t('ber_section_selfhelp') || 'Self-Help' },
        { key: 'ber_breath', label: t('check_ber_breath') || 'Practice mindful breathing / meditation', section: t('ber_section_selfhelp') || 'Self-Help' },
        { key: 'ber_memory', label: t('check_ber_memory') || 'Create a memory book or photo album', section: t('ber_section_selfhelp') || 'Self-Help' },
    ];

    const grouped = EMOTIONAL_ITEMS.reduce<Record<string, typeof EMOTIONAL_ITEMS>>((acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {});

    return (
        <div id="bereavement-support" className="tool-panel active">
            <div className="tool-header" style={{ marginBottom: '32px' }}>
                <span className="step-tag">{t('tag_bereavement') || 'Healing & Support'}</span>
                <h2>{t('title_bereavement') || 'Bereavement Path'}</h2>
                <p style={{ opacity: 0.7, marginTop: '12px' }}>
                    {t('desc_bereavement') || 'A supportive space for emotional healing, self-help resources, and connecting with others who understand.'}
                </p>
            </div>

            {/* What this section offers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {[
                    { icon: '💛', title: t('ber_card_1_title') || 'Emotional Guidance', desc: t('ber_card_1_desc') || 'Structured steps for processing grief — from the first moments to long-term healing.' },
                    { icon: '🤝', title: t('ber_card_2_title') || 'Support Networks', desc: t('ber_card_2_desc') || 'Connect with verified grief counselors, support groups, and communities who understand.' },
                    { icon: '📋', title: t('ber_card_3_title') || 'Practical Checklists', desc: t('ber_card_3_desc') || 'Step-by-step guides for administrative tasks, notifications, and formalities after loss.' },
                ].map((card, i) => (
                    <div key={i} style={{
                        padding: '20px', borderRadius: '14px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{card.icon}</div>
                        <h4 style={{ fontSize: '0.95rem', marginBottom: '8px', color: 'var(--accent-gold)' }}>{card.title}</h4>
                        <p style={{ fontSize: '0.82rem', opacity: 0.6, lineHeight: 1.5 }}>{card.desc}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px' }}>
                {[
                    { key: 'emotional', label: '💛 Emotional Support' },
                    { key: 'groups', label: '🤝 Support Groups' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                            background: activeTab === tab.key ? 'rgba(255,215,0,0.15)' : 'transparent',
                            color: activeTab === tab.key ? 'var(--accent-gold)' : 'var(--text-muted)',
                            fontWeight: activeTab === tab.key ? 700 : 400, fontSize: '0.9rem', transition: 'all 0.2s'
                        }}
                    >{tab.label}</button>
                ))}
            </div>

            {/* Emotional Support Tab */}
            {activeTab === 'emotional' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {Object.entries(grouped).map(([section, items]) => (
                        <div key={section} className="step-card" style={{ padding: '20px' }}>
                            <h3 style={{ color: 'var(--accent-gold)', marginBottom: '16px', fontSize: '1rem' }}>{section}</h3>
                            {items.map(item => (
                                <div
                                    key={item.key}
                                    onClick={() => toggle(item.key)}
                                    style={{
                                        display: 'flex', gap: '12px', alignItems: 'center',
                                        padding: '10px', borderRadius: '8px', cursor: 'pointer',
                                        background: checks[item.key] ? 'rgba(255,215,0,0.05)' : 'transparent',
                                        marginBottom: '6px', transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                        border: checks[item.key] ? '2px solid var(--accent-gold)' : '2px solid rgba(255,255,255,0.25)',
                                        background: checks[item.key] ? 'var(--accent-gold)' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                    }}>
                                        {checks[item.key] && <span style={{ color: '#000', fontSize: '11px', fontWeight: 'bold' }}>✓</span>}
                                    </div>
                                    <span style={{ opacity: checks[item.key] ? 0.4 : 1, textDecoration: checks[item.key] ? 'line-through' : 'none', fontSize: '0.9rem' }}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Support Groups Tab */}
            {activeTab === 'groups' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '8px' }}>
                        {t('ber_groups_intro') || 'Connecting with others who understand your experience can be profoundly healing. Here are verified support groups:'}
                    </p>
                    {SUPPORT_GROUPS.map((group, i) => (
                        <div key={i} style={{
                            padding: '18px 20px', borderRadius: '12px',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            transition: 'border-color 0.2s'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>{group.name}</h4>
                                <span style={{
                                    fontSize: '0.72rem', padding: '3px 10px', borderRadius: '12px',
                                    background: group.type === 'Online' ? 'rgba(100,200,255,0.1)' : 'rgba(255,215,0,0.1)',
                                    color: group.type === 'Online' ? '#64c8ff' : 'var(--accent-gold)',
                                    border: `1px solid ${group.type === 'Online' ? 'rgba(100,200,255,0.2)' : 'rgba(255,215,0,0.2)'}`,
                                    flexShrink: 0
                                }}>
                                    {group.type}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', opacity: 0.65, margin: '0 0 10px' }}>{group.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.78rem', opacity: 0.45 }}>📍 {group.region}</span>
                                <a href={group.url} className="btn" style={{ fontSize: '0.75rem', padding: '6px 16px', borderRadius: '8px' }}>
                                    Learn More
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default BereavementSupport;
