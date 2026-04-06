import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import usePersistedState from '../../hooks/useSyncedState';

// ─── After Death Checklist — Swiss-specific (Pro Senectute) ─────────────────

interface CheckItem {
    key: string;
    label: string;
    note?: string;
    deadline?: string;
}

interface Phase {
    title: string;
    subtitle: string;
    color: string;
    items: CheckItem[];
}

const usePhases = (): Phase[] => {
    const { t } = useLanguage();
    return [
        {
            title: t('dc_phase1_title') || 'Phase 1: First Hours',
            subtitle: t('dc_phase1_sub') || 'Immediate actions right after death',
            color: '#e8a87c',
            items: [
                { key: 'p1_doctor_ch', label: t('dc_p1_doctor') || 'Call a doctor for the death certificate (Todesbescheinigung)', deadline: t('dc_immediately') || 'Immediately' },
                { key: 'p1_nursing', label: t('dc_p1_nursing') || 'Notify nursing home administration (if applicable)', deadline: t('dc_immediately') || 'Immediately' },
                { key: 'p1_police', label: t('dc_p1_police') || 'Call police if accident or suicide is suspected', deadline: t('dc_immediately') || 'Immediately' },
                { key: 'p1_family_ch', label: t('dc_p1_family') || 'Inform relatives and close friends', deadline: t('dc_immediately') || 'Immediately' },
                { key: 'p1_directives', label: t('dc_p1_directives') || 'Locate death-related directives (Verfügungen)', deadline: t('dc_immediately') || 'Immediately' },
                { key: 'p1_employer', label: t('dc_p1_employer') || 'Notify employer of the deceased + your own (bereavement leave)', deadline: t('dc_same_day') || 'Same day' },
            ]
        },
        {
            title: t('dc_phase2_title') || 'Phase 2: Within 2 Days',
            subtitle: t('dc_phase2_sub') || 'Civil registration and official documents',
            color: 'var(--accent-gold)',
            items: [
                {
                    key: 'p2_zivilstandsamt', label: t('dc_p2_zivilstandsamt') || 'Register the death at Zivilstandsamt (civil registry)',
                    note: t('dc_p2_zivilstandsamt_note') || 'Bring: medical death certificate, Familienbüchlein, ID of deceased, residence permit (if foreign national)',
                    deadline: t('dc_2_days') || 'Within 2 days'
                },
                { key: 'p2_funeral_coord', label: t('dc_p2_funeral_coord') || 'Coordinate with registry: funeral date/place, burial type, publication', deadline: t('dc_2_days') || 'Within 2 days' },
                { key: 'p2_todesschein', label: t('dc_p2_todesschein') || 'Obtain official death certificate (Todesschein)', deadline: t('dc_2_days') || 'Within 2 days' },
            ]
        },
        {
            title: t('dc_phase3_title') || 'Phase 3: Funeral Arrangements',
            subtitle: t('dc_phase3_sub') || 'Organizing the farewell',
            color: '#a8d8ea',
            items: [
                { key: 'p3_parish', label: t('dc_p3_parish') || 'Contact parish / spiritual advisor / funeral home', deadline: t('dc_first_week') || 'First week' },
                { key: 'p3_todesanzeige', label: t('dc_p3_todesanzeige') || 'Publish death notice (Todesanzeige) in press', deadline: t('dc_first_week') || 'First week' },
                { key: 'p3_trauerbriefe', label: t('dc_p3_trauerbriefe') || 'Prepare and send condolence letters (Trauerbriefe)', deadline: t('dc_first_week') || 'First week' },
                { key: 'p3_aufbahrung', label: t('dc_p3_aufbahrung') || 'Arrange viewing of the body (Aufbahrung)', deadline: t('dc_first_week') || 'First week' },
            ]
        },
        {
            title: t('dc_phase4_title') || 'Phase 4: After the Funeral',
            subtitle: t('dc_phase4_sub') || 'Notifications to authorities and organizations',
            color: '#c3aed6',
            items: [
                { key: 'p4_ahv', label: t('dc_p4_ahv') || 'AHV/IV — state pension insurance', deadline: t('dc_first_month') || 'First month' },
                { key: 'p4_pensionskasse', label: t('dc_p4_pensionskasse') || 'Pensionskasse — occupational pension fund (2nd pillar)', deadline: t('dc_first_month') || 'First month' },
                { key: 'p4_krankenkasse', label: t('dc_p4_krankenkasse') || 'Krankenkasse — cancel health insurance', deadline: t('dc_first_month') || 'First month' },
                { key: 'p4_strassenverkehrsamt', label: t('dc_p4_strassenverkehrsamt') || 'Strassenverkehrsamt — road traffic office', deadline: t('dc_first_month') || 'First month' },
                { key: 'p4_steuern', label: t('dc_p4_steuern') || 'Steuerbehörde — notify tax authority', deadline: t('dc_first_month') || 'First month' },
                { key: 'p4_banks', label: t('dc_p4_banks') || 'Banks — freeze or transfer accounts', deadline: t('dc_first_month') || 'First month' },
                { key: 'p4_post', label: t('dc_p4_post') || 'Post — redirect or cancel mail', deadline: t('dc_first_month') || 'First month' },
                { key: 'p4_subscriptions', label: t('dc_p4_subscriptions') || 'Cancel subscriptions: magazines, GA/Halbtax, phone, radio/TV', deadline: t('dc_first_month') || 'First month' },
                { key: 'p4_memberships', label: t('dc_p4_memberships') || 'Cancel memberships in organizations', deadline: t('dc_first_month') || 'First month' },
                { key: 'p4_rental', label: t('dc_p4_rental') || 'Terminate or transfer rental agreement', deadline: t('dc_first_month') || 'First month' },
                { key: 'p4_online', label: t('dc_p4_online') || 'Handle online accounts (social media, email, cloud storage)', deadline: t('dc_first_month') || 'First month' },
            ]
        },
        {
            title: t('dc_phase5_title') || 'Phase 5: Estate & Finances',
            subtitle: t('dc_phase5_sub') || 'Inheritance, pensions and long-term settlement',
            color: 'var(--text-muted)',
            items: [
                { key: 'p5_will_submit', label: t('dc_p5_will_submit') || 'Submit the will to the competent authority', deadline: t('dc_after_funeral') || 'After funeral' },
                { key: 'p5_testament_opening', label: t('dc_p5_testament_opening') || 'Attend official will opening (Testamentseröffnung)', deadline: t('dc_as_scheduled') || 'As scheduled' },
                { key: 'p5_erbteilung', label: t('dc_p5_erbteilung') || 'Distribute the estate (Erbteilung) among heirs', deadline: t('dc_months') || 'Within months' },
                { key: 'p5_wohnung', label: t('dc_p5_wohnung') || 'Organize apartment clearing (Wohnungsräumung)', deadline: t('dc_months') || 'Within months' },
                { key: 'p5_witwen', label: t('dc_p5_witwen') || 'Check entitlement to widow/widower pension (Witwen-/Witwerrente AHV)', deadline: t('dc_first_month') || 'First month' },
                { key: 'p5_waisen', label: t('dc_p5_waisen') || 'Check entitlement to orphan pension (Waisenrente AHV)', deadline: t('dc_first_month') || 'First month' },
                { key: 'p5_bvg', label: t('dc_p5_bvg') || 'Check entitlement to BVG pension from occupational fund', deadline: t('dc_first_month') || 'First month' },
                { key: 'p5_ergaenzung', label: t('dc_p5_ergaenzung') || 'Check Ergänzungsleistungen (supplementary benefits)', deadline: t('dc_months') || 'Within months' },
                { key: 'p5_lebensversicherung', label: t('dc_p5_lebensversicherung') || 'Check life insurance payouts (Lebensversicherung)', deadline: t('dc_first_month') || 'First month' },
            ]
        }
    ];
};

const DeathChecklist: React.FC = () => {
    const { t } = useLanguage();
    const PHASES = usePhases();
    const [checks, setChecks] = usePersistedState<Record<string, boolean>>('death_checklist_v3', {});
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
                <h2 style={{ fontWeight: 700 }}>{t('tag_checklist') || 'After Death Guide'}</h2>
                <p style={{ opacity: 0.7, marginTop: '12px' }}>
                    {t('desc_checklist') || 'A comprehensive guide for what needs to happen after a loved one passes. Track each step to ensure nothing is missed.'}
                </p>
                <p style={{ opacity: 0.5, marginTop: '6px', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    {t('dc_source') || 'Based on the Pro Senectute guide for Switzerland'}
                </p>
            </div>

            {/* Overall progress */}
            <div style={{ marginBottom: '32px', padding: '20px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('dc_progress') || 'Overall Progress'}</span>
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
