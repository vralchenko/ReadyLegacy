import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import usePersistedState from '../../hooks/useSyncedState';

interface DocRecord {
    id: string;
    docType: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'filed';
    notes: string;
    lastUpdated: string;
    location?: string;
}

const DOCUMENTS = [
    {
        key: 'living_will',
        title: 'Living Will',
        subtitle: 'Patientenverfügung',
        icon: '🏥',
        desc: 'Specifies your wishes regarding medical treatment in case you become incapacitated and unable to make decisions yourself.',
        importance: 'Critical',
        tips: ['Must be signed in front of witnesses', 'Review every 5 years', 'Provide copy to your doctor'],
    },
    {
        key: 'advance_care',
        title: 'Advance Care Directive',
        subtitle: 'Vorsorgeauftrag',
        icon: '📋',
        desc: 'Designates a trusted person to make decisions about your personal care, healthcare, and finances if you lose capacity.',
        importance: 'Critical',
        tips: ['Must be notarized in most countries', 'Discuss with your designated person', 'Register with relevant authority'],
    },
    {
        key: 'power_of_attorney',
        title: 'Power of Attorney',
        subtitle: 'Vollmacht',
        icon: '⚖️',
        desc: 'Grants someone the legal authority to act on your behalf for financial or legal matters.',
        importance: 'High',
        tips: ['Specify scope of powers clearly', 'Consider time limitations', 'Can be revoked at any time'],
    },
    {
        key: 'will',
        title: 'Last Will & Testament',
        subtitle: 'Testament',
        icon: '📜',
        desc: 'A legal document specifying how your estate should be distributed after your death.',
        importance: 'Critical',
        tips: ['Must be entirely handwritten (in many countries)', 'Include date and full signature', 'Store in a safe, known location'],
    },
    {
        key: 'organ_donation',
        title: 'Organ Donation Declaration',
        subtitle: 'Organspendeerklärung',
        icon: '💗',
        desc: 'Documents your wishes regarding organ and tissue donation.',
        importance: 'Personal',
        tips: ['Register with your country\'s donor registry', 'Inform family of your decision', 'Carry donor card if applicable'],
    },
    {
        key: 'burial_directive',
        title: 'Burial & Funeral Directive',
        subtitle: 'Bestattungsverfügung',
        icon: '🕊️',
        desc: 'Written instructions for your burial, funeral ceremony, and memorial wishes.',
        importance: 'High',
        tips: ['Keep with your will or in a known location', 'Pre-arrange with a funeral home if desired', 'Include ceremony music & readings'],
    },
    {
        key: 'insurance_policies',
        title: 'Insurance Policy Register',
        subtitle: 'Versicherungsregister',
        icon: '🛡️',
        desc: 'A central record of all life, health, and property insurance policies for easy access by your heirs.',
        importance: 'High',
        tips: ['List insurer, policy number, and contact', 'Include beneficiary info', 'Note annual review dates'],
    },
    {
        key: 'digital_testament',
        title: 'Digital Testament',
        subtitle: 'Digitales Erbe',
        icon: '💻',
        desc: 'Instructions for handling your digital accounts, social media, and online assets after death.',
        importance: 'Modern',
        tips: ['List platforms and your wishes (delete/memorialize)', 'Do NOT include passwords here', 'Store access instructions securely'],
    },
];

const STATUS_CONFIG = {
    not_started: { label: 'Not Started', color: 'var(--glass-border)', bg: 'var(--glass-bg)' },
    in_progress: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    completed: { label: 'Completed', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    filed: { label: 'Filed & Stored', color: '#6fcf97', bg: 'rgba(111,207,151,0.12)' },
};

const IMPORTANCE_COLORS: Record<string, string> = {
    Critical: '#ef4444',
    High: '#f59e0b',
    Personal: '#a78bfa',
    Modern: '#38bdf8',
};

const LegalDocs: React.FC = () => {
    const { t } = useLanguage();
    const [records, setRecords] = usePersistedState<Record<string, DocRecord>>('legal_docs_v2', {});
    const [expanded, setExpanded] = useState<string | null>(null);
    const [editingNotes, setEditingNotes] = useState<string | null>(null);
    const [notesDraft, setNotesDraft] = useState('');

    const getRecord = (key: string): DocRecord => records[key] || {
        id: key, docType: key, status: 'not_started', notes: '', lastUpdated: '', location: ''
    };

    const updateStatus = (key: string, status: DocRecord['status']) => {
        const current = getRecord(key);
        setRecords({
            ...records,
            [key]: { ...current, status, lastUpdated: new Date().toLocaleDateString() }
        });
    };

    const saveNotes = (key: string) => {
        const current = getRecord(key);
        setRecords({
            ...records,
            [key]: { ...current, notes: notesDraft, lastUpdated: new Date().toLocaleDateString() }
        });
        setEditingNotes(null);
    };

    const updateLocation = (key: string, location: string) => {
        const current = getRecord(key);
        setRecords({ ...records, [key]: { ...current, location } });
    };

    const completedCount = DOCUMENTS.filter(d => {
        const r = getRecord(d.key);
        return r.status === 'completed' || r.status === 'filed';
    }).length;

    return (
        <div id="legal-docs" className="tool-panel active">
            <div className="tool-header" style={{ marginBottom: '32px' }}>
                <span className="step-tag">{t('tag_legal') || 'Legal Framework'}</span>
                <h2>{t('title_legal') || 'Legal Framework'}</h2>
                <p style={{ opacity: 0.7, marginTop: '12px' }}>
                    All your essential legal documents in one place. Track their status and store location information for your heirs.
                </p>
            </div>

            {/* Progress summary */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
                {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
                    const count = DOCUMENTS.filter(d => getRecord(d.key).status === status).length;
                    return (
                        <div key={status} style={{
                            padding: '10px 16px', borderRadius: '10px',
                            background: cfg.bg, border: `1px solid ${cfg.color}30`,
                            flex: '1', minWidth: '120px', textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: cfg.color }}>{count}</div>
                            <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: '2px' }}>{cfg.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.6, marginBottom: '6px' }}>
                    <span>Overall completion</span>
                    <span>{completedCount} / {DOCUMENTS.length}</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'var(--glass-bg)' }}>
                    <div style={{
                        height: '100%', borderRadius: '3px',
                        width: `${(completedCount / DOCUMENTS.length) * 100}%`,
                        background: 'linear-gradient(90deg, #10b981, #6fcf97)',
                        transition: 'width 0.5s ease'
                    }} />
                </div>
            </div>

            {/* Documents list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {DOCUMENTS.map(doc => {
                    const record = getRecord(doc.key);
                    const statusCfg = STATUS_CONFIG[record.status];
                    const isExpanded = expanded === doc.key;

                    return (
                        <div key={doc.key} style={{
                            borderRadius: '14px', overflow: 'hidden',
                            border: `1px solid ${isExpanded ? 'rgba(255,215,0,0.2)' : 'var(--glass-border)'}`,
                            background: isExpanded ? 'rgba(255,215,0,0.02)' : 'var(--glass-bg)',
                            transition: 'all 0.3s ease'
                        }}>
                            {/* Doc header */}
                            <div
                                onClick={() => setExpanded(isExpanded ? null : doc.key)}
                                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', cursor: 'pointer' }}
                            >
                                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{doc.icon}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{doc.title}</span>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{doc.subtitle}</span>
                                        <span style={{
                                            fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px',
                                            background: `${IMPORTANCE_COLORS[doc.importance]}15`,
                                            color: IMPORTANCE_COLORS[doc.importance],
                                            border: `1px solid ${IMPORTANCE_COLORS[doc.importance]}30`
                                        }}>{doc.importance}</span>
                                    </div>
                                    {!isExpanded && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {doc.desc}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                                    <span style={{
                                        fontSize: '0.75rem', padding: '4px 12px', borderRadius: '20px', whiteSpace: 'nowrap',
                                        background: statusCfg.bg, color: statusCfg.color,
                                        border: `1px solid ${statusCfg.color}40`
                                    }}>{statusCfg.label}</span>
                                    <span style={{ opacity: 0.4, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
                                </div>
                            </div>

                            {/* Expanded content */}
                            {isExpanded && (
                                <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--glass-border)' }}>
                                    <p style={{ fontSize: '0.87rem', opacity: 0.7, margin: '16px 0' }}>{doc.desc}</p>

                                    {/* Tips */}
                                    <div style={{ marginBottom: '18px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>💡 Key Points</div>
                                        {doc.tips.map((tip, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.83rem', opacity: 0.75, marginBottom: '6px' }}>
                                                <span style={{ color: 'var(--accent-gold)', flexShrink: 0 }}>→</span>
                                                <span>{tip}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Status selector */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {(Object.entries(STATUS_CONFIG) as [DocRecord['status'], typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([s, cfg]) => (
                                                <button
                                                    key={s}
                                                    onClick={() => updateStatus(doc.key, s)}
                                                    style={{
                                                        padding: '6px 14px', borderRadius: '20px', border: `1px solid ${cfg.color}50`,
                                                        background: record.status === s ? cfg.bg : 'transparent',
                                                        color: record.status === s ? cfg.color : 'var(--text-muted)',
                                                        fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s',
                                                        fontWeight: record.status === s ? 700 : 400
                                                    }}
                                                >{cfg.label}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Storage location */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📁 Where is it stored?</div>
                                        <input
                                            type="text"
                                            value={record.location || ''}
                                            onChange={e => updateLocation(doc.key, e.target.value)}
                                            placeholder={t('auto_e_g_home_safe_n') || 'e.g. Home safe, notary office, bank vault...'}
                                            style={{
                                                width: '100%', padding: '10px 14px', borderRadius: '8px', boxSizing: 'border-box',
                                                border: '1px solid var(--glass-border)', background: 'var(--glass-bg)',
                                                color: 'var(--text-color)', fontSize: '0.85rem'
                                            }}
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📝 Notes</div>
                                        {editingNotes === doc.key ? (
                                            <div>
                                                <textarea
                                                    value={notesDraft}
                                                    onChange={e => setNotesDraft(e.target.value)}
                                                    rows={3}
                                                    style={{
                                                        width: '100%', padding: '10px 14px', borderRadius: '8px', marginBottom: '8px', boxSizing: 'border-box',
                                                        border: '1px solid rgba(255,215,0,0.3)', background: 'var(--glass-bg)',
                                                        color: 'var(--text-color)', fontSize: '0.85rem', resize: 'vertical'
                                                    }}
                                                />
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => saveNotes(doc.key)} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: 'var(--accent-gold)', color: '#000', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>Save</button>
                                                    <button onClick={() => setEditingNotes(null)} style={{ padding: '6px 16px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-color)', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => { setEditingNotes(doc.key); setNotesDraft(record.notes); }}
                                                style={{
                                                    padding: '10px 14px', borderRadius: '8px', cursor: 'text', minHeight: '44px',
                                                    border: '1px dashed var(--glass-border)', background: 'var(--glass-bg)',
                                                    fontSize: '0.85rem', opacity: record.notes ? 0.8 : 0.35,
                                                    fontStyle: record.notes ? 'normal' : 'italic'
                                                }}
                                            >
                                                {record.notes || 'Click to add notes...'}
                                            </div>
                                        )}
                                    </div>

                                    {record.lastUpdated && (
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '12px' }}>Last updated: {record.lastUpdated}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LegalDocs;
