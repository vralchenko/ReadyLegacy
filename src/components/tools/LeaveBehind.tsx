import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDemoMode } from '../../context/DemoContext';
import { DEMO_LEGACY_ITEMS } from '../../lib/demoData';
import usePersistedState from '../../hooks/useSyncedState';
import { saveToDocuments } from '../../lib/saveDocument';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MemoryItem {
    id: string;
    type: 'text' | 'photo' | 'video' | 'audio' | 'link';
    title: string;
    content: string;
    recipient?: string;
    createdAt: string;
    tags: string[];
}

// ─── Main Component ───────────────────────────────────────────────────────────
const LeaveBehind: React.FC = () => {
    const { t } = useLanguage();

    // ─── Template wizard steps (translated) ──────────────────────────────────
    const WIZARD_STEPS = [
        t('lb_step_type') || 'Type',
        t('lb_step_details') || 'Details',
        t('lb_step_recipient') || 'Recipient',
        t('lb_step_review') || 'Review',
    ];

    const TYPE_OPTIONS = [
        { key: 'text', icon: '✍️', label: t('lb_type_text') || 'Written Message', desc: t('lb_type_text_desc') || 'A personal letter or note' },
        { key: 'photo', icon: '📸', label: t('lb_type_photo') || 'Photo / Gallery', desc: t('lb_type_photo_desc') || 'A photo or collection of images' },
        { key: 'video', icon: '🎥', label: t('lb_type_video') || 'Video Message', desc: t('lb_type_video_desc') || 'A video recording or memory' },
        { key: 'audio', icon: '🎙️', label: t('lb_type_audio') || 'Voice Message', desc: t('lb_type_audio_desc') || 'An audio recording or voice note' },
        { key: 'link', icon: '🔗', label: t('lb_type_link') || 'Digital Link', desc: t('lb_type_link_desc') || 'A URL, playlist, or online resource' },
    ];
    const [items, setItems] = usePersistedState<MemoryItem[]>('legacy_vault_v2', []);

    // Wizard state
    const [wizardOpen, setWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(0);
    const [selectedType, setSelectedType] = useState<MemoryItem['type']>('text');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [recipient, setRecipient] = useState('');
    const [tagsInput, setTagsInput] = useState('');

    // View/filter state
    const [filter, setFilter] = useState<'all' | MemoryItem['type']>('all');
    const [viewing, setViewing] = useState<MemoryItem | null>(null);
    const [docSaved, setDocSaved] = useState(false);
    const { demoMode } = useDemoMode();
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editRecipient, setEditRecipient] = useState('');
    const [editTags, setEditTags] = useState('');

    const startEditing = () => {
        if (!viewing) return;
        setEditTitle(viewing.title);
        setEditContent(viewing.content);
        setEditRecipient(viewing.recipient || '');
        setEditTags(viewing.tags.join(', '));
        setEditing(true);
    };

    const saveEditing = () => {
        if (!viewing) return;
        const updated: MemoryItem = {
            ...viewing,
            title: editTitle.trim(),
            content: editContent.trim(),
            recipient: editRecipient.trim(),
            tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
        };
        setItems(items.map(i => i.id === viewing.id ? updated : i));
        setViewing(updated);
        setEditing(false);
        setDocSaved(false);
    };

    useEffect(() => {
        if (demoMode) {
            setItems(DEMO_LEGACY_ITEMS());
        }
    }, [demoMode]);

    const handleSaveToDocuments = async () => {
        try {
            await saveToDocuments(
                'Digital Legacy Vault',
                'Legacy Vault',
                '\uD83D\uDC8C',
                { memories: items.map(({ type, title, content, recipient, tags }) => ({ type, title, content, recipient, tags })) }
            );
            setDocSaved(true);
        } catch {
            alert('Failed to save to Documents');
        }
    };

    // ─── Wizard logic ──────────────────────────────────────────────────────────
    const resetWizard = () => {
        setWizardStep(0);
        setSelectedType('text');
        setTitle('');
        setContent('');
        setRecipient('');
        setTagsInput('');
        setWizardOpen(false);
    };

    const canProceed = () => {
        if (wizardStep === 0) return true;
        if (wizardStep === 1) return title.trim().length > 0 && content.trim().length > 0;
        return true;
    };

    const submitItem = () => {
        const newItem: MemoryItem = {
            id: Date.now().toString(),
            type: selectedType,
            title: title.trim(),
            content: content.trim(),
            recipient: recipient.trim(),
            createdAt: new Date().toLocaleDateString(),
            tags: tagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
        };
        setItems([newItem, ...items]);
        resetWizard();
    };

    // ─── Filtered items ───────────────────────────────────────────────────────
    const filteredItems = filter === 'all' ? items : items.filter(i => i.type === filter);

    const TYPE_COLORS: Record<string, string> = {
        text: '#a78bfa',
        photo: '#38bdf8',
        video: '#f472b6',
        audio: '#34d399',
        link: '#fb923c',
    };

    const getTypeIcon = (type: string) => TYPE_OPTIONS.find(o => o.key === type)?.icon || '📄';

    return (
        <div id="leave-behind" className="tool-panel active">
            <div className="tool-header" style={{ marginBottom: '32px' }}>
                <span className="step-tag">{t('p2_title') || 'Leave Behind'}</span>
                <h2>{t('lb_title') || 'Digital Legacy Vault'}</h2>
                <p style={{ opacity: 0.7, marginTop: '12px' }}>
                    {t('lb_desc') || 'Create personal messages, photos, videos, and memories to be shared with your loved ones — a living archive of your story.'}
                </p>
            </div>

            {/* Stats bar */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {[{ key: 'all', label: t('lb_filter_all') || 'All', count: items.length }, ...TYPE_OPTIONS.map(opt => ({ key: opt.key, label: opt.label, count: items.filter(i => i.type === opt.key).length }))].map(f => (
                    f.count > 0 || f.key === 'all' ? (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key as any)}
                            style={{
                                padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--glass-border)',
                                background: filter === f.key ? 'rgba(255,215,0,0.1)' : 'transparent',
                                color: filter === f.key ? 'var(--accent-gold)' : 'var(--text-muted)',
                                fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                                fontWeight: filter === f.key ? 700 : 400
                            }}
                        >
                            {getTypeIcon(f.key)} {f.label} {f.count > 0 && <span style={{ color: 'var(--text-muted)' }}>({f.count})</span>}
                        </button>
                    ) : null
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {items.length > 0 && (
                        !docSaved ? (
                            <button
                                onClick={handleSaveToDocuments}
                                style={{
                                    padding: '6px 16px', borderRadius: '20px',
                                    border: '1px solid var(--accent-gold)', background: 'transparent',
                                    color: 'var(--accent-gold)', fontSize: '0.8rem', cursor: 'pointer',
                                    fontWeight: 600, transition: 'all 0.2s'
                                }}
                            >
                                Save to Documents
                            </button>
                        ) : (
                            <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>{'\u2713'} Saved</span>
                        )
                    )}
                    <button
                        onClick={() => setWizardOpen(true)}
                        style={{
                            padding: '6px 20px', borderRadius: '20px',
                            border: '1px solid var(--accent-gold)', background: 'rgba(255,215,0,0.1)',
                            color: 'var(--accent-gold)', fontSize: '0.8rem', cursor: 'pointer',
                            fontWeight: 700, transition: 'all 0.2s'
                        }}
                    >
                        {t('lb_add') || '+ Add Memory'}
                    </button>
                </div>
            </div>

            {/* Empty state */}
            {filteredItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✦</div>
                    <p style={{ fontStyle: 'italic' }}>
                        {items.length === 0 ? (t('lb_empty') || 'Your vault is empty. Start creating memories for your loved ones.') : (t('lb_no_items') || 'No items in this category.')}
                    </p>
                </div>
            )}

            {/* Memory Grid */}
            {filteredItems.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setViewing(item)}
                            style={{
                                padding: '20px', borderRadius: '14px', cursor: 'pointer',
                                background: 'var(--glass-bg)',
                                border: `1px solid ${TYPE_COLORS[item.type]}25`,
                                transition: 'all 0.25s', position: 'relative', overflow: 'hidden'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: TYPE_COLORS[item.type] }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <span style={{ fontSize: '1.5rem' }}>{getTypeIcon(item.type)}</span>
                                <span style={{
                                    fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px',
                                    background: `${TYPE_COLORS[item.type]}15`, color: TYPE_COLORS[item.type]
                                }}>
                                    {TYPE_OPTIONS.find(o => o.key === item.type)?.label}
                                </span>
                            </div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--text-color)' }}>{item.title}</h4>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {item.content}
                            </p>
                            {item.recipient && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {t('lb_for') || 'For:'} <span style={{ color: 'var(--accent-gold)' }}>{item.recipient}</span>
                                </div>
                            )}
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>{item.createdAt}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── ADD WIZARD MODAL ─────────────────────────────────────── */}
            {wizardOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
                    backdropFilter: 'blur(6px)'
                }}>
                    <div style={{
                        width: '100%', maxWidth: '560px', background: 'var(--secondary-bg)',
                        borderRadius: '20px', border: '1px solid var(--glass-border)',
                        overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'
                    }}>
                        {/* Modal header */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{t('lb_add_title') || 'Add to Legacy Vault'}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Step {wizardStep + 1} of {WIZARD_STEPS.length}: {WIZARD_STEPS[wizardStep]}</div>
                            </div>
                            <button onClick={resetWizard} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
                        </div>

                        {/* Step indicator */}
                        <div style={{ display: 'flex', padding: '16px 24px', gap: '8px' }}>
                            {WIZARD_STEPS.map((s, i) => (
                                <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                                    <div style={{
                                        height: '4px', width: '100%', borderRadius: '2px',
                                        background: i <= wizardStep ? 'var(--accent-gold)' : 'var(--glass-border)',
                                        transition: 'background 0.3s'
                                    }} />
                                    <div style={{ fontSize: '0.65rem', opacity: i === wizardStep ? 0.8 : 0.3 }}>{s}</div>
                                </div>
                            ))}
                        </div>

                        {/* Step 0: Type selection */}
                        <div style={{ padding: '8px 24px 24px' }}>
                            {wizardStep === 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {TYPE_OPTIONS.map(opt => (
                                        <div
                                            key={opt.key}
                                            onClick={() => setSelectedType(opt.key as MemoryItem['type'])}
                                            style={{
                                                display: 'flex', gap: '14px', alignItems: 'center',
                                                padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                                                border: `1px solid ${selectedType === opt.key ? 'rgba(255,215,0,0.3)' : 'var(--glass-border)'}`,
                                                background: selectedType === opt.key ? 'rgba(255,215,0,0.06)' : 'var(--glass-bg)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{opt.label}</div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                                            </div>
                                            {selectedType === opt.key && <span style={{ marginLeft: 'auto', color: 'var(--accent-gold)' }}>✓</span>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Step 1: Content */}
                            {wizardStep === 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.82rem', opacity: 0.6, display: 'block', marginBottom: '6px' }}>{t('lb_field_title') || 'Title *'}</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder={t('auto_give_this_memor') || 'Give this memory a name...'}
                                            autoFocus
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.82rem', opacity: 0.6, display: 'block', marginBottom: '6px' }}>
                                            {selectedType === 'text' ? (t('lb_field_message') || 'Your Message *') :
                                                selectedType === 'link' ? (t('lb_field_url') || 'URL / Link *') :
                                                    (t('lb_field_description') || 'Description / Instructions *')}
                                        </label>
                                        <textarea
                                            value={content}
                                            onChange={e => setContent(e.target.value)}
                                            rows={selectedType === 'text' ? 6 : 3}
                                            placeholder={
                                                selectedType === 'text' ? (t('lb_ph_text') || 'Write your message here...') :
                                                    selectedType === 'link' ? (t('lb_ph_link') || 'https://...') :
                                                        selectedType === 'photo' ? (t('lb_ph_photo') || 'Describe the photos, where to find them...') :
                                                            selectedType === 'video' ? (t('lb_ph_video') || 'Describe the video or where to find it...') :
                                                                (t('lb_ph_audio') || 'Describe the audio recording...')
                                            }
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box', resize: 'vertical' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.82rem', opacity: 0.6, display: 'block', marginBottom: '6px' }}>{t('lb_tags') || 'Tags (comma separated)'}</label>
                                        <input
                                            type="text"
                                            value={tagsInput}
                                            onChange={e => setTagsInput(e.target.value)}
                                            placeholder={t('auto_e_g_family_chil') || 'e.g. family, childhood, love...'}
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Recipient */}
                            {wizardStep === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <p style={{ opacity: 0.6, fontSize: '0.88rem' }}>{t('lb_recipient_question') || 'Who is this memory intended for? (optional)'}</p>
                                    <input
                                        type="text"
                                        value={recipient}
                                        onChange={e => setRecipient(e.target.value)}
                                        placeholder={t('auto_e_g_my_daughter') || 'e.g. My daughter Sofia, or \'Everyone\'...'}
                                        autoFocus
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                                    />
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {wizardStep === 3 && (
                                <div style={{ background: 'var(--glass-bg)', borderRadius: '12px', padding: '20px', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '2rem' }}>{getTypeIcon(selectedType)}</span>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{TYPE_OPTIONS.find(o => o.key === selectedType)?.label}</div>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.88rem', opacity: 0.7, marginBottom: '12px', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>{content}</p>
                                    {recipient && <div style={{ fontSize: '0.82rem', opacity: 0.6 }}>{t('lb_for') || 'For:'} <strong>{recipient}</strong></div>}
                                    {tagsInput && (
                                        <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {tagsInput.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
                                                <span key={tag} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(255,215,0,0.1)', color: 'var(--accent-gold)' }}>#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Navigation */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                                <button
                                    onClick={() => wizardStep === 0 ? resetWizard() : setWizardStep(s => s - 1)}
                                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-color)', cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                    {wizardStep === 0 ? (t('profile_cancel') || 'Cancel') : (t('lb_back') || '\u2190 Back')}
                                </button>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    {wizardStep === 0 && (
                                        <button
                                            onClick={() => {
                                                setSelectedType('text');
                                                setTitle('Letter to Sofia');
                                                setContent('My dearest Sofia, if you are reading this, I want you to know that you have been the greatest joy of my life. Always follow your heart, be kind, and never stop learning. With all my love, Papa.');
                                                setRecipient('Daughter Sofia');
                                                setTagsInput('family, love, personal');
                                                setWizardStep(3);
                                            }}
                                            style={{
                                                padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
                                                border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer',
                                                background: 'rgba(16,185,129,0.05)', color: '#10b981', transition: 'all 0.2s',
                                            }}
                                        >
                                            {'\u26A1'} Fill Demo
                                        </button>
                                    )}
                                    <button
                                        onClick={() => wizardStep === WIZARD_STEPS.length - 1 ? submitItem() : setWizardStep(s => s + 1)}
                                        disabled={!canProceed()}
                                        style={{
                                            padding: '10px 24px', borderRadius: '8px', border: 'none',
                                            background: canProceed() ? 'var(--accent-gold)' : 'var(--glass-border)',
                                            color: canProceed() ? '#fff' : 'var(--text-muted)',
                                            cursor: canProceed() ? 'pointer' : 'not-allowed',
                                            fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s'
                                        }}
                                    >
                                        {wizardStep === WIZARD_STEPS.length - 1 ? (t('lb_submit') || '\u2713 Add to Vault') : (t('lb_next') || 'Next \u2192')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── VIEW / EDIT MODAL ─────────────────────────────────────── */}
            {viewing && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
                    backdropFilter: 'blur(8px)'
                }} onClick={() => { setViewing(null); setEditing(false); }}>
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: '100%', maxWidth: '560px', background: 'var(--secondary-bg)',
                            borderRadius: '20px', border: '1px solid var(--glass-border)',
                            overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'
                        }}
                    >
                        <div style={{ height: '4px', background: TYPE_COLORS[viewing.type] }} />
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                    <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{getTypeIcon(viewing.type)}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {editing ? (
                                            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', fontSize: '1.1rem', fontWeight: 700, boxSizing: 'border-box' }} />
                                        ) : (
                                            <h3 style={{ margin: 0 }}>{viewing.title}</h3>
                                        )}
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{viewing.createdAt}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setViewing(null); setEditing(false); }}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', flexShrink: 0 }}
                                >{'\u00D7'}</button>
                            </div>

                            {editing ? (
                                <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={6} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', fontSize: '0.95rem', lineHeight: '1.7', boxSizing: 'border-box', resize: 'vertical', marginBottom: '16px' }} />
                            ) : (
                                <div style={{ fontSize: '0.95rem', lineHeight: '1.7', opacity: 0.85, marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
                                    {viewing.content}
                                </div>
                            )}

                            {editing ? (
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Recipient</label>
                                    <input type="text" value={editRecipient} onChange={e => setEditRecipient(e.target.value)} placeholder="e.g. Daughter Sofia" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                                </div>
                            ) : viewing.recipient ? (
                                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)', fontSize: '0.85rem' }}>
                                    {'\uD83D\uDC8C'} {t('lb_intended_for') || 'Intended for:'} <strong style={{ color: 'var(--accent-gold)' }}>{viewing.recipient}</strong>
                                </div>
                            ) : null}

                            {editing ? (
                                <div style={{ marginTop: '14px' }}>
                                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tags (comma separated)</label>
                                    <input type="text" value={editTags} onChange={e => setEditTags(e.target.value)} placeholder="e.g. family, love" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                                </div>
                            ) : viewing.tags.length > 0 ? (
                                <div style={{ marginTop: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {viewing.tags.map(tag => (
                                        <span key={tag} style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '12px', background: 'rgba(255,215,0,0.08)', color: 'rgba(255,215,0,0.7)' }}>#{tag}</span>
                                    ))}
                                </div>
                            ) : null}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                <button
                                    onClick={() => { setItems(items.filter(i => i.id !== viewing.id)); setViewing(null); setEditing(false); }}
                                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,100,100,0.3)', background: 'transparent', color: 'rgba(255,100,100,0.7)', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    {t('lb_delete') || 'Delete'}
                                </button>
                                {editing ? (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => setEditing(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-color)', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                                        <button onClick={saveEditing} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'var(--accent-gold)', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>Save</button>
                                    </div>
                                ) : (
                                    <button onClick={startEditing} style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--accent-gold)', background: 'transparent', color: 'var(--accent-gold)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Social Accounts */}
            <SocialAccounts />
        </div>
    );
};

// ─── Social Accounts Sub-Component ───────────────────────────────────────────
interface SocialAccount { id: string; platform: string; username: string; wish: string; }

const PLATFORM_PRESETS = [
    { name: 'Facebook', icon: '📘' },
    { name: 'Instagram', icon: '📷' },
    { name: 'LinkedIn', icon: '💼' },
    { name: 'X / Twitter', icon: '🐦' },
    { name: 'TikTok', icon: '🎵' },
    { name: 'YouTube', icon: '🎬' },
    { name: 'Other', icon: '🌐' },
];

const SocialAccounts: React.FC = () => {
    const { t } = useLanguage();
    const [accounts, setAccounts] = usePersistedState<SocialAccount[]>('social_accounts', []);
    const [adding, setAdding] = useState(false);
    const [draft, setDraft] = useState({ platform: '', username: '', wish: '' });

    const addAccount = () => {
        if (!draft.platform) return;
        setAccounts([...accounts, { ...draft, id: Date.now().toString() }]);
        setDraft({ platform: '', username: '', wish: '' });
        setAdding(false);
    };

    return (
        <div style={{ marginTop: '40px', padding: '24px', borderRadius: '16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{t('lb_social_title') || 'Social Media Accounts'}</h3>
                <button onClick={() => setAdding(!adding)} style={{
                    padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                    border: '1px solid var(--accent-gold)', color: adding ? '#ff6b6b' : 'var(--accent-gold)',
                    background: adding ? 'rgba(255,107,107,0.1)' : 'rgba(251,191,36,0.08)',
                }}>
                    {adding ? 'Cancel' : '+ Add Account'}
                </button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                {t('lb_social_desc') || 'Document your social media accounts and what you want to happen with them.'}
            </p>

            {adding && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', padding: '16px', borderRadius: '12px', background: 'var(--secondary-bg)', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {PLATFORM_PRESETS.map(p => (
                            <button key={p.name} onClick={() => setDraft({ ...draft, platform: p.name })} style={{
                                padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer',
                                border: `1px solid ${draft.platform === p.name ? 'var(--accent-gold)' : 'var(--glass-border)'}`,
                                background: draft.platform === p.name ? 'rgba(251,191,36,0.1)' : 'transparent',
                                color: draft.platform === p.name ? 'var(--accent-gold)' : 'var(--text-muted)',
                            }}>
                                {p.icon} {p.name}
                            </button>
                        ))}
                    </div>
                    <input placeholder="Username or profile URL" value={draft.username} onChange={e => setDraft({ ...draft, username: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', fontSize: '0.85rem' }} />
                    <select value={draft.wish} onChange={e => setDraft({ ...draft, wish: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', fontSize: '0.85rem' }}>
                        <option value="">What should happen?</option>
                        <option value="Delete">Delete the account</option>
                        <option value="Memorialize">Memorialize</option>
                        <option value="Transfer">Transfer to someone</option>
                        <option value="Keep">Keep as is</option>
                    </select>
                    <div style={{ textAlign: 'right' }}>
                        <button onClick={addAccount} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'var(--accent-gold)', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>Add</button>
                    </div>
                </div>
            )}

            {accounts.length === 0 && !adding && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                    No social accounts added yet.
                </div>
            )}

            {accounts.map(acc => (
                <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '10px', marginBottom: '8px', background: 'var(--secondary-bg)', border: '1px solid var(--glass-border)' }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {PLATFORM_PRESETS.find(p => p.name === acc.platform)?.icon || '🌐'} {acc.platform}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {[acc.username, acc.wish].filter(Boolean).join(' · ')}
                        </div>
                    </div>
                    <button onClick={() => setAccounts(accounts.filter(a => a.id !== acc.id))} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                </div>
            ))}
        </div>
    );
};

export default LeaveBehind;
