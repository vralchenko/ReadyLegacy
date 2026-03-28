import React, { useState } from 'react';
import usePersistedState from '../../hooks/useSyncedState';

interface Reminder {
    id: string;
    title: string;
    type: 'annual_review' | 'section_incomplete' | 'custom_date' | 'birthday';
    email: string;
    date?: string;
    frequency?: 'once' | 'yearly' | 'monthly';
    enabled: boolean;
    section?: string;
    createdAt: string;
    lastTriggered?: string;
}

const REMINDER_TYPES = [
    { key: 'annual_review', icon: '📅', label: 'Annual Review', desc: 'Get reminded every year to review your estate documents' },
    { key: 'section_incomplete', icon: '⚠️', label: 'Incomplete Section', desc: 'Remind yourself to complete a specific section' },
    { key: 'custom_date', icon: '🗓️', label: 'Custom Date', desc: 'Set a specific date reminder (e.g. before a trip)' },
    { key: 'birthday', icon: '🎂', label: 'Anniversary / Birthday', desc: 'Reminder tied to an important date' },
];

const SECTIONS = [
    'Asset Overview', 'Legal Framework', 'After Death Guide',
    'ToDo List', 'Will Structure', 'Document Templates', 'Digital Legacy Vault'
];

const BUILT_IN_SUGGESTIONS = [
    { title: 'Annual Legacy Review', type: 'annual_review' as const, desc: 'Review all your estate documents once a year', icon: '🔍' },
    { title: 'Update Will after major life event', type: 'custom_date' as const, desc: 'Marriage, birth of a child, major purchase', icon: '📜' },
    { title: 'Complete your Legal Framework', type: 'section_incomplete' as const, desc: 'You have incomplete legal documents', icon: '⚖️' },
    { title: 'Digital Legacy check', type: 'annual_review' as const, desc: 'Review crypto and online accounts annually', icon: '💻' },
];

const Reminders: React.FC = () => {
    const [reminders, setReminders] = usePersistedState<Reminder[]>('email_reminders', []);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '',
        type: 'annual_review' as Reminder['type'],
        email: localStorage.getItem('readylegacy_user_profile') ? JSON.parse(localStorage.getItem('readylegacy_user_profile') || '{}').email || '' : '',
        date: '',
        frequency: 'yearly' as Reminder['frequency'],
        section: SECTIONS[0],
    });
    const [submitted, setSubmitted] = useState(false);

    const addReminder = () => {
        if (!form.email || !form.title) return;
        const reminder: Reminder = {
            id: Date.now().toString(),
            ...form,
            enabled: true,
            createdAt: new Date().toLocaleDateString(),
        };
        setReminders([reminder, ...reminders]);
        setShowForm(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setForm({ ...form, title: '', date: '' });
    };

    const toggleReminder = (id: string) => {
        setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    };

    const deleteReminder = (id: string) => {
        setReminders(reminders.filter(r => r.id !== id));
    };

    const addSuggestion = (s: typeof BUILT_IN_SUGGESTIONS[0]) => {
        const reminder: Reminder = {
            id: Date.now().toString(),
            title: s.title,
            type: s.type,
            email: form.email || 'your@email.com',
            frequency: 'yearly',
            enabled: true,
            createdAt: new Date().toLocaleDateString(),
        };
        setReminders(
            reminders.find(r => r.title === s.title) ? reminders : [reminder, ...reminders]
        );
    };

    const TYPE_CONFIG: Record<string, { color: string; bg: string }> = {
        annual_review: { color: '#38bdf8', bg: 'rgba(56,189,248,0.08)' },
        section_incomplete: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
        custom_date: { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
        birthday: { color: '#fb923c', bg: 'rgba(251,146,60,0.08)' },
    };

    return (
        <div id="reminders" className="tool-panel active">
            <div className="tool-header" style={{ marginBottom: '32px' }}>
                <span className="step-tag">Notifications</span>
                <h2>Email Reminders</h2>
                <p style={{ opacity: 0.7, marginTop: '12px' }}>
                    Stay on top of your estate planning with smart reminders. Set annual reviews, incomplete section alerts, or custom date reminders.
                </p>
            </div>

            {/* Success message */}
            {submitted && (
                <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#6fcf97', marginBottom: '20px', fontSize: '0.9rem' }}>
                    ✓ Reminder saved! You'll receive email notifications as configured.
                    <span style={{ opacity: 0.6, fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>
                        Note: Email sending requires backend integration — this is a demo preview.
                    </span>
                </div>
            )}

            {/* Suggestions strip */}
            {reminders.length === 0 && (
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>💡 Recommended Reminders</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                        {BUILT_IN_SUGGESTIONS.map((s, i) => (
                            <div
                                key={i}
                                onClick={() => addSuggestion(s)}
                                style={{
                                    padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                                    border: '1px dashed var(--glass-border)',
                                    background: 'var(--glass-bg)', transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'; e.currentTarget.style.background = 'rgba(255,215,0,0.04)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.background = 'var(--glass-bg)'; }}
                            >
                                <div style={{ fontSize: '1.3rem', marginBottom: '6px' }}>{s.icon}</div>
                                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>{s.title}</div>
                                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                                <div style={{ marginTop: '8px', fontSize: '0.72rem', color: 'var(--accent-gold)', opacity: 0.7 }}>+ Add this reminder</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add reminder button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{reminders.length} reminder{reminders.length !== 1 ? 's' : ''} configured</div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        padding: '8px 20px', borderRadius: '20px',
                        border: '1px solid var(--accent-gold)', background: showForm ? 'rgba(255,215,0,0.1)' : 'transparent',
                        color: 'var(--accent-gold)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700
                    }}
                >
                    {showForm ? '× Cancel' : '+ Add Reminder'}
                </button>
            </div>

            {/* Add form */}
            {showForm && (
                <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,215,0,0.03)', border: '1px solid rgba(255,215,0,0.15)', marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '20px', color: 'var(--accent-gold)', fontSize: '0.95rem' }}>New Reminder</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Title *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Annual estate review"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Reminder Type</label>
                            <select
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value as any })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--secondary-bg)', color: 'var(--text-color)' }}
                            >
                                {REMINDER_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Frequency</label>
                            <select
                                value={form.frequency}
                                onChange={e => setForm({ ...form, frequency: e.target.value as any })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--secondary-bg)', color: 'var(--text-color)' }}
                            >
                                <option value="once">Once</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="your@email.com"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                            />
                        </div>
                        {(form.type === 'custom_date' || form.type === 'birthday') && (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                                />
                            </div>
                        )}
                        {form.type === 'section_incomplete' && (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Section</label>
                                <select
                                    value={form.section}
                                    onChange={e => setForm({ ...form, section: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--secondary-bg)', color: 'var(--text-color)' }}
                                >
                                    {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem' }}>Cancel</button>
                        <button
                            onClick={addReminder}
                            disabled={!form.email || !form.title}
                            style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: form.email && form.title ? 'var(--accent-gold)' : 'var(--glass-border)', color: form.email && form.title ? '#fff' : 'var(--text-muted)', cursor: form.email && form.title ? 'pointer' : 'not-allowed', fontSize: '0.82rem', fontWeight: 700 }}
                        >
                            Save Reminder
                        </button>
                    </div>
                </div>
            )}

            {/* Reminders list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {reminders.length === 0 && !showForm && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No reminders yet. Add one above or choose from the suggestions.
                    </div>
                )}
                {reminders.map(r => {
                    const typeInfo = REMINDER_TYPES.find(t => t.key === r.type);
                    const cfg = TYPE_CONFIG[r.type];
                    return (
                        <div key={r.id} style={{
                            display: 'flex', gap: '14px', alignItems: 'center',
                            padding: '16px 18px', borderRadius: '12px',
                            background: r.enabled ? 'var(--glass-bg)' : 'var(--glass-bg)',
                            border: `1px solid ${r.enabled ? 'var(--glass-border)' : 'var(--glass-bg)'}`,
                            opacity: r.enabled ? 1 : 0.4, transition: 'all 0.2s'
                        }}>
                            <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{typeInfo?.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px' }}>{r.title}</div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', background: cfg.bg, color: cfg.color }}>{typeInfo?.label}</span>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📧 {r.email}</span>
                                    {r.frequency && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>🔄 {r.frequency}</span>}
                                    {r.date && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📅 {r.date}</span>}
                                </div>
                            </div>
                            {/* Toggle */}
                            <div
                                onClick={() => toggleReminder(r.id)}
                                style={{
                                    width: '42px', height: '24px', borderRadius: '12px', cursor: 'pointer',
                                    background: r.enabled ? 'var(--accent-gold)' : 'var(--glass-border)',
                                    position: 'relative', flexShrink: 0, transition: 'background 0.3s'
                                }}
                            >
                                <div style={{
                                    width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                                    position: 'absolute', top: '3px',
                                    left: r.enabled ? '21px' : '3px', transition: 'left 0.3s'
                                }} />
                            </div>
                            <button onClick={() => deleteReminder(r.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,100,100,0.5)', fontSize: '1.1rem', cursor: 'pointer', flexShrink: 0, padding: '0 4px' }}>×</button>
                        </div>
                    );
                })}
            </div>

            {/* Email preview note */}
            {reminders.length > 0 && (
                <div style={{ marginTop: '24px', padding: '16px 18px', borderRadius: '12px', background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)', fontSize: '0.82rem', opacity: 0.75 }}>
                    📬 <strong>How it works:</strong> Reminders will be sent to the specified email addresses according to the schedule. Email delivery requires backend configuration — this is a preview of the reminder management interface.
                </div>
            )}
        </div>
    );
};

export default Reminders;
