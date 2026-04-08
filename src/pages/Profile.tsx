import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useDemoMode } from '../context/DemoContext';
import useSyncedState from '../hooks/useSyncedState';

interface Beneficiary {
    id: string;
    name: string;
    email: string;
    phone: string;
    relationship: string;
}

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    dob: string;
    nationality: string;
    city: string;
    bio: string;
    plan: 'free' | 'premium' | 'family';
}

const COMPLETION_SECTIONS = [
    { key: 'asset-overview', label: 'Asset Overview', tool: 'asset-overview' },
    { key: 'legal-docs', label: 'Legal Framework', tool: 'legal-docs' },
    { key: 'death-checklist', label: 'After Death Guide', tool: 'death-checklist' },
    { key: 'executor', label: 'ToDo List', tool: 'executor' },
    { key: 'will-builder', label: 'Will Structure', tool: 'will-builder' },
    { key: 'templates', label: 'Document Templates', tool: 'templates' },
    { key: 'leave-behind', label: 'Digital Legacy Vault', tool: 'leave-behind' },
    { key: 'bereavement-support', label: 'Bereavement Path', tool: 'bereavement-support' },
];

const PLAN_STYLES = {
    free: { labelKey: 'profile_plan_free', fallback: 'Free Plan', color: 'var(--text-muted)', bg: 'var(--glass-bg)', border: 'var(--glass-border)' },
    premium: { labelKey: 'profile_plan_premium', fallback: 'Premium', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
    family: { labelKey: 'profile_plan_family', fallback: 'Family Plan', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
};

const Profile: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const { demoMode, setDemoMode } = useDemoMode();
    const navigate = useNavigate();

    const getInitialProfile = (): ProfileData => {
        const defaultData: ProfileData = {
            name: '', email: '', phone: '', dob: '', nationality: '', city: '', bio: '', plan: 'free'
        };
        if (user) {
            return { ...defaultData, name: user.name, email: user.email, plan: (user.plan as ProfileData['plan']) || 'free' };
        }
        return defaultData;
    };

    const [profile, setProfile] = useSyncedState<ProfileData>('user_profile', getInitialProfile());

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState<ProfileData>(profile);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'plan'>('overview');

    // Beneficiaries
    const [beneficiaries, setBeneficiaries] = useSyncedState<Beneficiary[]>('beneficiaries', []);
    const [addingBeneficiary, setAddingBeneficiary] = useState(false);
    const [benDraft, setBenDraft] = useState<Omit<Beneficiary, 'id'>>({ name: '', email: '', phone: '', relationship: '' });

    const addBeneficiary = () => {
        if (!benDraft.name) return;
        setBeneficiaries([...beneficiaries, { ...benDraft, id: Date.now().toString() }]);
        setBenDraft({ name: '', email: '', phone: '', relationship: '' });
        setAddingBeneficiary(false);
    };
    const removeBeneficiary = (id: string) => setBeneficiaries(beneficiaries.filter(b => b.id !== id));
    const location = useLocation();

    useEffect(() => {
        if (location.hash === '#plan') {
            setActiveTab('plan');
        }
    }, [location.hash]);

    // Compute overall completion score
    const legacyItems = JSON.parse(localStorage.getItem('readylegacy_legacy_vault_v2') || '[]');
    const todoTasks = JSON.parse(localStorage.getItem('readylegacy_todo_tasks') || '[]');
    const legalDocs = JSON.parse(localStorage.getItem('readylegacy_legal_docs_v2') || '{}');
    const completedLegal = Object.values(legalDocs).filter((d: any) => d.status === 'completed' || d.status === 'filed').length;

    const scoreItems = [
        { label: t('score_profile') || 'Profile filled', done: !!(profile.name && profile.email) },
        { label: t('score_assets') || 'Assets documented', done: !!(localStorage.getItem('readylegacy_list_bank') || localStorage.getItem('readylegacy_asset_brought')) },
        { label: t('score_legal') || 'Legal docs tracked', done: completedLegal > 0 },
        { label: t('score_legacy') || 'Digital legacy started', done: legacyItems.length > 0 },
        { label: t('score_todo') || 'ToDo tasks added', done: todoTasks.length > 0 },
        { label: t('score_crypto') || 'Crypto wallets documented', done: !!(localStorage.getItem('readylegacy_list_crypto_wallets')) },
        { label: t('score_funeral') || 'Funeral wishes recorded', done: !!(localStorage.getItem('readylegacy_funeral_type')) },
    ];
    const score = Math.round((scoreItems.filter(s => s.done).length / scoreItems.length) * 100);

    const saveProfile = () => {
        setProfile(draft);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const initials = profile.name
        ? profile.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
        : '?';

    const planStyleRaw = PLAN_STYLES[profile.plan];
    const planLabel = t(planStyleRaw.labelKey) || planStyleRaw.fallback;
    const planStyle = { ...planStyleRaw, label: planLabel };

    return (
        <div style={{ minHeight: '100vh', padding: '20px 0 60px', marginTop: '-60px' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Header bar */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <Link to="/" style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        ← {t('back_home') || 'Home'}
                    </Link>
                    <span style={{ color: 'var(--text-muted)' }}>/</span>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{t('profile_title') || 'Your Profile'}</span>
                    {saved && (
                        <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: '0.82rem', animation: 'fadeIn 0.3s ease' }}>
                            ✓ {t('profile_saved') || 'Saved successfully'}
                        </span>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 300px) 1fr', gap: '30px', flex: 1, alignItems: 'start' }}>

                    {/* ─── LEFT COLUMN ──────────────────────────────────── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                        {/* Avatar card */}
                        <div style={{
                            padding: '20px', borderRadius: '20px', textAlign: 'center',
                            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'
                        }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 16px',
                                background: 'var(--accent-gold)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.8rem', fontFamily: 'var(--font-heading)', fontWeight: 700,
                                color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}>
                                {initials}
                            </div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{profile.name || (t('auto_your_name') || 'Your Name')}</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '18px' }}>{profile.email || (t('auto_your_email_com') || 'your@email.com')}</p>
                            <span style={{
                                display: 'inline-block', fontSize: '0.9rem', padding: '6px 14px', borderRadius: '12px',
                                background: planStyle.bg, color: planStyle.color, border: `1px solid ${planStyle.border}`
                            }}>
                                {planStyle.label}
                            </span>
                        </div>

                        {/* Readiness score */}
                        <div style={{
                            padding: '22px', borderRadius: '20px',
                            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'
                        }}>
                            <div style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '12px' }}>{t('profile_readiness') || 'Legacy Readiness'}</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '18px' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 700, color: score >= 70 ? '#10b981' : score >= 40 ? 'var(--accent-gold)' : '#ef4444' }}>
                                    {score}%
                                </span>
                                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{t('profile_complete') || 'complete'}</span>
                            </div>
                            <div style={{ height: '8px', borderRadius: '4px', background: 'var(--glass-bg)', marginBottom: '20px' }}>
                                <div style={{
                                    height: '100%', borderRadius: '4px', transition: 'width 0.5s ease',
                                    width: `${score}%`,
                                    background: score >= 70 ? 'linear-gradient(90deg, #10b981, #6fcf97)' :
                                        score >= 40 ? 'linear-gradient(90deg, var(--accent-gold), #f0c040)' :
                                            'linear-gradient(90deg, #ef4444, #f87171)'
                                }} />
                            </div>
                            {scoreItems.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', fontSize: '1rem' }}>
                                    <span style={{ color: item.done ? '#10b981' : 'var(--text-muted)', flexShrink: 0 }}>{item.done ? '✓' : '○'}</span>
                                    <span style={{ color: item.done ? 'var(--text-color)' : 'var(--text-muted)' }}>{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quick nav */}
                        <div style={{ padding: '20px', borderRadius: '20px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '16px' }}>{t('profile_quicklinks') || 'Quick Links'}</div>
                            {[
                                { to: '/tools', icon: '🛠', labelKey: 'profile_quicklink_tools', fallback: 'Tools Dashboard' },
                                { to: '/documents', icon: '📄', labelKey: 'profile_quicklink_docs', fallback: 'My Documents' },
                                { to: '/tools?tool=templates', icon: '📋', labelKey: 'profile_quicklink_templates', fallback: 'Request Templates' },
                                { to: '/tools?tool=leave-behind', icon: '✦', labelKey: 'profile_quicklink_legacy', fallback: 'Digital Legacy' },
                            ].map(link => (
                                <Link key={link.to} to={link.to} style={{
                                    display: 'block', padding: '10px 12px', borderRadius: '8px', marginBottom: '8px',
                                    fontSize: '1.1rem', transition: 'all 0.2s',
                                    color: 'var(--text-muted)'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-gold)'; e.currentTarget.style.background = 'var(--secondary-bg)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                                >
                                    {link.icon} {t(link.labelKey) || link.fallback}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ─── RIGHT COLUMN ─────────────────────────────────── */}
                    <div>
                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--glass-bg)', borderRadius: '14px', padding: '4px' }}>
                            {[
                                { key: 'overview', label: `👤 ${t('profile_tab_info') || 'Personal Info'}` },
                                { key: 'settings', label: `⚙️ ${t('profile_tab_settings') || 'Settings'}` },
                                { key: 'plan', label: `✦ ${t('profile_tab_plan') || 'Plan & Subscription'}` },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    style={{
                                        flex: 1, padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                        background: activeTab === tab.key ? 'var(--secondary-bg)' : 'transparent',
                                        color: activeTab === tab.key ? 'var(--accent-gold)' : 'var(--text-muted)',
                                        fontWeight: activeTab === tab.key ? 700 : 400, fontSize: '1.2rem', transition: 'all 0.2s'
                                    }}
                                >{tab.label}</button>
                            ))}
                        </div>

                        {/* ─── PERSONAL INFO TAB ─── */}
                        {activeTab === 'overview' && (
                            <div style={{ background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)', padding: '28px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '1.6rem', margin: 0 }}>{t('profile_personal_info') || 'Personal Information'}</h3>
                                    {!editing ? (
                                        <button onClick={() => { setDraft(profile); setEditing(true); }} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-color)', cursor: 'pointer', fontSize: '1.1rem' }}>
                                            ✏️ {t('profile_edit') || 'Edit'}
                                        </button>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => setEditing(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>{t('profile_cancel') || 'Cancel'}</button>
                                            <button onClick={saveProfile} style={{ padding: '10px 20px', borderRadius: '24px', border: 'none', background: 'var(--accent-gold)', color: '#fff', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}>{t('profile_save') || 'Save Changes'}</button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {[
                                        { key: 'name', labelKey: 'profile_full_name', fallback: 'Full Name', placeholder: 'John Doe', type: 'text' },
                                        { key: 'email', labelKey: 'profile_email_address', fallback: 'Email Address', placeholder: 'your@email.com', type: 'email' },
                                        { key: 'phone', labelKey: 'profile_phone_number', fallback: 'Phone Number', placeholder: '+41 79 000 0000', type: 'tel' },
                                        { key: 'dob', labelKey: 'profile_date_of_birth', fallback: 'Date of Birth', placeholder: '', type: 'date' },
                                        { key: 'nationality', labelKey: 'profile_nationality', fallback: 'Nationality', placeholder: 'e.g. Swiss', type: 'text' },
                                        { key: 'city', labelKey: 'profile_city_country', fallback: 'City / Country', placeholder: 'Zürich, Switzerland', type: 'text' },
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{t(field.labelKey) || field.fallback}</label>
                                            {editing ? (
                                                <input
                                                    type={field.type}
                                                    value={(draft as any)[field.key]}
                                                    onChange={e => setDraft({ ...draft, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--accent-gold)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box', fontSize: '1.2rem' }}
                                                />
                                            ) : (
                                                <div style={{ padding: '12px 0', fontSize: '1.2rem', color: (profile as any)[field.key] ? 'var(--text-color)' : 'var(--text-muted)', fontStyle: (profile as any)[field.key] ? 'normal' : 'italic' }}>
                                                    {(profile as any)[field.key] || (t('profile_not_set') || 'Not set')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Bio */}
                                <div style={{ marginTop: '24px' }}>
                                    <label style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{t('profile_bio') || 'Personal Note / Bio'}</label>
                                    {editing ? (
                                        <textarea
                                            value={draft.bio}
                                            onChange={e => setDraft({ ...draft, bio: e.target.value })}
                                            rows={3}
                                            placeholder={t('auto_a_short_persona') || 'A short personal note or message to your heirs...'}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--accent-gold)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box', resize: 'vertical', fontSize: '1.2rem' }}
                                        />
                                    ) : (
                                        <div style={{ padding: '12px 0', fontSize: '1.2rem', color: profile.bio ? 'var(--text-color)' : 'var(--text-muted)', fontStyle: profile.bio ? 'normal' : 'italic' }}>
                                            {profile.bio || (t('profile_not_set') || 'Not set')}
                                        </div>
                                    )}
                                </div>

                                {/* My Beneficiaries */}
                                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{t('profile_beneficiaries') || 'My Beneficiaries'}</h3>
                                        <button onClick={() => setAddingBeneficiary(!addingBeneficiary)} style={{
                                            padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                                            border: '1px solid var(--accent-gold)', color: addingBeneficiary ? '#ff6b6b' : 'var(--accent-gold)',
                                            background: addingBeneficiary ? 'rgba(255,107,107,0.1)' : 'rgba(251,191,36,0.08)',
                                        }}>
                                            {addingBeneficiary ? (t('profile_cancel') || 'Cancel') : (t('profile_add_beneficiary') || '+ Add Beneficiary')}
                                        </button>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                        {t('profile_beneficiaries_desc') || 'People who will be notified and receive access when the heartbeat protocol is activated.'}
                                    </p>

                                    {addingBeneficiary && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px', padding: '16px', borderRadius: '12px', background: 'var(--secondary-bg)', border: '1px solid var(--glass-border)' }}>
                                            <input placeholder={t('profile_beneficiary_name') || 'Full Name *'} value={benDraft.name} onChange={e => setBenDraft({ ...benDraft, name: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', fontSize: '0.9rem' }} />
                                            <input placeholder={t('profile_beneficiary_email') || 'Email'} value={benDraft.email} onChange={e => setBenDraft({ ...benDraft, email: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', fontSize: '0.9rem' }} />
                                            <input placeholder={t('profile_beneficiary_phone') || 'Phone'} value={benDraft.phone} onChange={e => setBenDraft({ ...benDraft, phone: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', fontSize: '0.9rem' }} />
                                            <input placeholder={t('profile_beneficiary_relationship') || 'Relationship (e.g. Spouse, Child)'} value={benDraft.relationship} onChange={e => setBenDraft({ ...benDraft, relationship: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', fontSize: '0.9rem' }} />
                                            <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
                                                <button onClick={addBeneficiary} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'var(--accent-gold)', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>{t('profile_add_btn') || 'Add'}</button>
                                            </div>
                                        </div>
                                    )}

                                    {beneficiaries.length === 0 && !addingBeneficiary && (
                                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                                            {t('profile_no_beneficiaries') || 'No beneficiaries added yet. Click "+ Add Beneficiary" to get started.'}
                                        </div>
                                    )}

                                    {beneficiaries.map(b => (
                                        <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '10px', marginBottom: '8px', background: 'var(--secondary-bg)', border: '1px solid var(--glass-border)' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{b.name}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                    {[b.relationship, b.email, b.phone].filter(Boolean).join(' · ')}
                                                </div>
                                            </div>
                                            <button onClick={() => removeBeneficiary(b.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.8rem' }}>{t('profile_remove') || 'Remove'}</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ─── SETTINGS TAB ─── */}
                        {activeTab === 'settings' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Language */}
                                <div style={{ background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)', padding: '24px' }}>
                                    <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>{t('profile_language') || 'Language'}</h4>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {(['en', 'de'] as const).map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => setLanguage(lang)}
                                                style={{
                                                    padding: '10px 20px', borderRadius: '10px', border: `1px solid ${language === lang ? 'var(--accent-gold)' : 'var(--glass-border)'}`,
                                                    background: language === lang ? 'var(--secondary-bg)' : 'transparent',
                                                    color: language === lang ? 'var(--accent-gold)' : 'var(--text-muted)',
                                                    cursor: 'pointer', fontWeight: language === lang ? 700 : 400, fontSize: '0.9rem', transition: 'all 0.2s',
                                                    textTransform: 'uppercase'
                                                }}
                                            >{lang}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Theme */}
                                <div style={{ background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)', padding: '24px' }}>
                                    <h4 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>{t('profile_theme') || 'Theme'}</h4>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {[{ key: 'dark', labelKey: 'profile_dark_mode', icon: '🌙', fallback: 'Dark Mode' }, { key: 'light', labelKey: 'profile_light_mode', icon: '☀️', fallback: 'Light Mode' }].map(th => (
                                            <button
                                                key={th.key}
                                                onClick={() => { if ((th.key === 'light') !== (theme === 'light')) toggleTheme(); }}
                                                style={{
                                                    flex: 1, padding: '14px', borderRadius: '12px',
                                                    border: `1px solid ${theme === th.key ? 'var(--accent-gold)' : 'var(--glass-border)'}`,
                                                    background: theme === th.key ? 'var(--secondary-bg)' : 'transparent',
                                                    color: theme === th.key ? 'var(--accent-gold)' : 'var(--text-muted)',
                                                    cursor: 'pointer', fontSize: '1.1rem', fontWeight: theme === th.key ? 700 : 400, transition: 'all 0.2s'
                                                }}
                                            >{th.icon} {t(th.labelKey) || th.fallback}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Demo Mode */}
                                <div style={{ background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)', padding: '24px' }}>
                                    <h4 style={{ marginBottom: '8px', fontSize: '1.4rem' }}>{t('profile_demo_mode') || 'Demo Mode'}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                        {t('profile_demo_desc') || 'Pre-fill all tools with sample data for demonstration purposes.'}
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {([false, true] as const).map(on => (
                                            <button
                                                key={String(on)}
                                                onClick={() => setDemoMode(on)}
                                                style={{
                                                    padding: '10px 20px', borderRadius: '10px',
                                                    border: `1px solid ${demoMode === on ? (on ? '#10b981' : 'var(--accent-gold)') : 'var(--glass-border)'}`,
                                                    background: demoMode === on ? 'var(--secondary-bg)' : 'transparent',
                                                    color: demoMode === on ? (on ? '#10b981' : 'var(--accent-gold)') : 'var(--text-muted)',
                                                    cursor: 'pointer', fontWeight: demoMode === on ? 700 : 400,
                                                    fontSize: '0.9rem', transition: 'all 0.2s', textTransform: 'uppercase'
                                                }}
                                            >{on ? (t('profile_demo_on') || 'ON') : (t('profile_demo_off') || 'OFF')}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Notifications */}
                                <div style={{ background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)', padding: '24px' }}>
                                    <h4 style={{ marginBottom: '12px', fontSize: '1.4rem' }}>{t('auto_email_reminders') || 'Email Reminders'}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px' }}>{t('profile_reminders_desc') || 'Get reminded to keep your estate documents up to date.'}</p>
                                    <Link to="/tools?tool=reminders" style={{
                                        display: 'inline-block', padding: '12px 24px', borderRadius: '10px',
                                        border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)',
                                        fontSize: '1.1rem', fontWeight: 600, transition: 'all 0.2s'
                                    }}>
                                        📧 {t('profile_manage_reminders') || 'Manage Reminders →'}
                                    </Link>
                                </div>

                                {/* Security */}
                                <div style={{ background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)', padding: '28px' }}>
                                    <h4 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>{t('profile_security') || 'Security'}</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {[
                                            { labelKey: 'profile_change_password', fallback: 'Change Password', icon: '🔑' },
                                            { labelKey: 'profile_2fa', fallback: 'Enable Two-Factor Auth', icon: '🛡️' },
                                            { labelKey: 'profile_connected_accounts', fallback: 'Connected Accounts (OAuth)', icon: '🔗' },
                                        ].map(item => (
                                            <button key={item.labelKey} style={{
                                                display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px',
                                                borderRadius: '10px', border: '1px solid var(--glass-border)',
                                                background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
                                                textAlign: 'left', fontSize: '1.1rem', transition: 'all 0.2s'
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
                                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                            >
                                                <span>{item.icon}</span> {t(item.labelKey) || item.fallback}
                                                <span style={{ marginLeft: 'auto', opacity: 0.3 }}>→</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── PLAN TAB ─── */}
                        {activeTab === 'plan' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)', padding: '28px' }}>
                                    <h3 style={{ marginBottom: '12px', fontSize: '1.6rem' }}>{t('profile_current_plan') || 'Current Plan'}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                        <span style={{
                                            display: 'inline-block', fontSize: '1.1rem', padding: '8px 20px', borderRadius: '20px',
                                            background: planStyle.bg, color: planStyle.color, border: `1px solid ${planStyle.border}`, fontWeight: 700
                                        }}>
                                            {planStyle.label}
                                        </span>
                                        {profile.plan === 'free' && <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{t('profile_upgrade_hint') || 'Upgrade to unlock all features'}</span>}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                        {[
                                            { plan: 'free' as const, label: t('pricing_free_name') || 'Free', price: 'CHF 0', features: [t('pricing_free_f1') || 'Basic document vault (5 files)', t('pricing_free_f2') || 'Readiness score', t('pricing_free_f3') || 'Checklists & guides', t('pricing_free_f4') || '1 trusted contact'] },
                                            { plan: 'premium' as const, label: t('pricing_premium_name') || 'Premium', price: 'CHF 15/mo', features: [t('pricing_premium_f1') || 'Unlimited document storage', t('pricing_premium_f2') || 'AI assistant & suggestions', t('pricing_premium_f3') || 'Video & audio messages', t('pricing_premium_f4') || 'Unlimited trusted contacts', t('pricing_premium_f5') || 'PDF export & print', t('pricing_premium_f6') || 'Priority support'] },
                                            { plan: 'family' as const, label: t('profile_family_plan') || 'Family', price: 'CHF 25/mo', features: [t('profile_family_f1') || 'Everything in Premium', t('profile_family_f2') || 'Up to 5 family members', t('profile_family_f3') || 'Shared Legacy Vault', t('profile_family_f4') || 'Priority support', t('profile_family_f5') || 'AI Avatar (beta)'] },
                                        ].map(tier => {
                                            const ts = PLAN_STYLES[tier.plan];
                                            return (
                                                <div key={tier.plan} style={{
                                                    padding: '24px', borderRadius: '14px',
                                                    border: `1px solid ${profile.plan === tier.plan ? ts.border : 'var(--glass-border)'}`,
                                                    background: profile.plan === tier.plan ? ts.bg : 'var(--glass-bg)',
                                                    display: 'flex', flexDirection: 'column'
                                                }}>
                                                    <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1.2rem', color: ts.color }}>{tier.label}</div>
                                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '18px' }}>{tier.price}</div>
                                                    {tier.features.map(f => (
                                                        <div key={f} style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'start' }}>
                                                            <span style={{ color: ts.color, flexShrink: 0 }}>✓</span> <span>{f}</span>
                                                        </div>
                                                    ))}
                                                    <button
                                                        style={{
                                                            marginTop: 'auto', paddingTop: '14px', padding: '12px', borderRadius: '8px', border: `1px solid ${ts.border}`,
                                                            background: profile.plan === tier.plan ? ts.bg : 'transparent',
                                                            color: ts.color, cursor: profile.plan === tier.plan ? 'default' : 'pointer', fontSize: '1rem',
                                                            fontWeight: profile.plan === tier.plan ? 700 : 400, transition: 'all 0.2s'
                                                        }}
                                                        onClick={() => {
                                                            if (profile.plan === tier.plan) return;
                                                            if (tier.plan === 'free') {
                                                                setProfile({ ...profile, plan: 'free' });
                                                            } else {
                                                                navigate('/pricing');
                                                            }
                                                        }}
                                                    >
                                                        {profile.plan === tier.plan ? (t('profile_current_plan') || 'Current Plan') : `${t('profile_select_plan') || 'Select'} ${tier.label}`}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
