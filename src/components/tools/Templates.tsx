import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// ─── Template definitions ─────────────────────────────────────────────────────
interface TemplateField {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'date';
    placeholder?: string;
    options?: string[];
    required?: boolean;
}

interface Template {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    desc: string;
    steps: { title: string; fields: TemplateField[] }[];
}

const TEMPLATES: Template[] = [
    {
        id: 'poa',
        icon: '⚖️',
        title: 'Power of Attorney',
        subtitle: 'Vollmacht',
        desc: 'Grant someone the authority to act on your behalf for legal or financial matters.',
        steps: [
            {
                title: 'Your Information',
                fields: [
                    { key: 'grantor_name', label: 'Your Full Name', type: 'text', placeholder: 'e.g. John Michael Doe', required: true },
                    { key: 'grantor_dob', label: 'Date of Birth', type: 'date', required: true },
                    { key: 'grantor_address', label: 'Your Address', type: 'textarea', placeholder: 'Street, City, Country' },
                ]
            },
            {
                title: 'Attorney Details',
                fields: [
                    { key: 'attorney_name', label: 'Attorney Full Name', type: 'text', placeholder: 'Person you are authorizing', required: true },
                    { key: 'attorney_relation', label: 'Relationship to You', type: 'select', options: ['Spouse / Partner', 'Child', 'Sibling', 'Parent', 'Close Friend', 'Lawyer / Notary', 'Other'] },
                    { key: 'attorney_address', label: 'Attorney\'s Address', type: 'textarea', placeholder: 'Street, City, Country' },
                ]
            },
            {
                title: 'Scope of Authority',
                fields: [
                    { key: 'scope', label: 'Scope of Power', type: 'select', options: ['General (all matters)', 'Financial only', 'Healthcare only', 'Real estate only', 'Specific task (describe below)'] },
                    { key: 'scope_details', label: 'Additional Details / Restrictions', type: 'textarea', placeholder: 'Describe any limitations or specific powers...' },
                    { key: 'valid_from', label: 'Valid From', type: 'date' },
                    { key: 'valid_until', label: 'Valid Until (leave blank for indefinite)', type: 'date' },
                ]
            },
        ]
    },
    {
        id: 'funeral',
        icon: '🕊️',
        title: 'Funeral Directive',
        subtitle: 'Bestattungsanordnung',
        desc: 'A formal document outlining your burial and funeral wishes.',
        steps: [
            {
                title: 'Personal Details',
                fields: [
                    { key: 'name', label: 'Your Full Name', type: 'text', required: true },
                    { key: 'dob', label: 'Date of Birth', type: 'date' },
                ]
            },
            {
                title: 'Funeral Wishes',
                fields: [
                    { key: 'burial_type', label: 'Type of Burial', type: 'select', options: ['Traditional Burial', 'Cremation', 'Natural / Green Burial', 'Sea Burial', 'No Preference'] },
                    { key: 'ceremony', label: 'Ceremony Type', type: 'select', options: ['Religious ceremony', 'Civil / Secular ceremony', 'Private family only', 'No ceremony'] },
                    { key: 'location', label: 'Preferred Location', type: 'text', placeholder: 'e.g. hometown, specific cemetery...' },
                ]
            },
            {
                title: 'Final Wishes',
                fields: [
                    { key: 'music', label: 'Music / Hymns', type: 'textarea', placeholder: 'Songs or pieces to be played...' },
                    { key: 'readings', label: 'Readings or Prayers', type: 'textarea', placeholder: 'Poems, scriptures, or readings...' },
                    { key: 'other_wishes', label: 'Any Other Wishes', type: 'textarea', placeholder: 'Flowers, donations, dress code...' },
                ]
            }
        ]
    },
    {
        id: 'waiver',
        icon: '📄',
        title: 'Inheritance Waiver',
        subtitle: 'Erbverzichtserklärung',
        desc: 'A document stating that you voluntarily waive your right to an inheritance.',
        steps: [
            {
                title: 'Declarant Details',
                fields: [
                    { key: 'name', label: 'Your Full Name', type: 'text', required: true },
                    { key: 'dob', label: 'Date of Birth', type: 'date' },
                    { key: 'address', label: 'Address', type: 'textarea' },
                ]
            },
            {
                title: 'Deceased Details',
                fields: [
                    { key: 'deceased_name', label: 'Name of Deceased', type: 'text', required: true },
                    { key: 'relationship', label: 'Your Relationship', type: 'select', options: ['Child', 'Spouse / Partner', 'Sibling', 'Parent', 'Other relative'] },
                ]
            },
            {
                title: 'Waiver Declaration',
                fields: [
                    { key: 'reason', label: 'Reason (optional)', type: 'textarea', placeholder: 'Briefly explain why you are waiving...' },
                    { key: 'declaration_date', label: 'Declaration Date', type: 'date' },
                ]
            }
        ]
    },
    {
        id: 'gift',
        icon: '🎁',
        title: 'Gift Declaration',
        subtitle: 'Schenkungserklärung',
        desc: 'Formally documents a gift of assets or money to another person.',
        steps: [
            {
                title: 'Donor Information',
                fields: [
                    { key: 'donor_name', label: 'Donor Full Name', type: 'text', required: true },
                    { key: 'donor_address', label: 'Donor Address', type: 'textarea' },
                ]
            },
            {
                title: 'Recipient & Gift',
                fields: [
                    { key: 'recipient_name', label: 'Recipient Full Name', type: 'text', required: true },
                    { key: 'relationship', label: 'Relationship', type: 'select', options: ['Child', 'Grandchild', 'Sibling', 'Friend', 'Charity', 'Other'] },
                    { key: 'gift_description', label: 'Description of Gift', type: 'textarea', placeholder: 'e.g. €50,000 cash / apartment at...', required: true },
                    { key: 'gift_value', label: 'Estimated Value', type: 'text', placeholder: 'e.g. €50,000' },
                ]
            },
            {
                title: 'Declaration',
                fields: [
                    { key: 'conditions', label: 'Any Conditions', type: 'textarea', placeholder: 'e.g. to be used for education only...' },
                    { key: 'gift_date', label: 'Date of Gift', type: 'date' },
                ]
            }
        ]
    },
    {
        id: 'advance',
        icon: '📋',
        title: 'Advance Care Directive',
        subtitle: 'Vorsorgeauftrag',
        desc: 'Designates a trusted person to act on your behalf if you lose mental capacity.',
        steps: [
            {
                title: 'Principal (You)',
                fields: [
                    { key: 'name', label: 'Your Full Name', type: 'text', required: true },
                    { key: 'dob', label: 'Date of Birth', type: 'date' },
                    { key: 'address', label: 'Address', type: 'textarea' },
                ]
            },
            {
                title: 'Appointed Person',
                fields: [
                    { key: 'agent_name', label: 'Agent Full Name', type: 'text', required: true },
                    { key: 'agent_relation', label: 'Relationship', type: 'select', options: ['Spouse / Partner', 'Child', 'Sibling', 'Parent', 'Close Friend', 'Lawyer'] },
                    { key: 'agent_contact', label: 'Contact Details', type: 'text', placeholder: 'Phone / email' },
                ]
            },
            {
                title: 'Powers & Wishes',
                fields: [
                    { key: 'personal_care', label: 'Personal Care Powers', type: 'select', options: ['Full authority', 'Healthcare decisions only', 'Limited to specified matters'] },
                    { key: 'financial', label: 'Financial Powers', type: 'select', options: ['Full authority', 'Day-to-day finances only', 'None'] },
                    { key: 'special_wishes', label: 'Special Wishes or Instructions', type: 'textarea', placeholder: 'Any specific wishes to be respected...' },
                ]
            }
        ]
    },
];

// ─── Wizard Component ─────────────────────────────────────────────────────────
const TemplateWizard: React.FC<{ template: Template; onClose: () => void; onComplete: (data: Record<string, string>) => void }> = ({ template, onClose, onComplete }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, string>>({});

    const currentStep = template.steps[step];
    const isLastStep = step === template.steps.length - 1;

    const updateField = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const canProceed = () => {
        return currentStep.fields
            .filter(f => f.required)
            .every(f => formData[f.key]?.trim());
    };

    const progress = ((step) / template.steps.length) * 100;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            backdropFilter: 'blur(8px)'
        }}>
            <div style={{
                width: '100%', maxWidth: '600px', background: '#0d1117',
                borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{template.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700 }}>{template.title}</div>
                            <div style={{ fontSize: '0.78rem', opacity: 0.5 }}>{currentStep.title} — Step {step + 1} of {template.steps.length}</div>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                    </div>
                    {/* Progress */}
                    <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)' }}>
                        <div style={{ height: '100%', borderRadius: '2px', width: `${progress}%`, background: 'var(--accent-gold)', transition: 'width 0.3s ease' }} />
                    </div>
                    {/* Step indicators */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        {template.steps.map((s, i) => (
                            <div key={i} style={{
                                flex: 1, fontSize: '0.7rem', textAlign: 'center',
                                color: i === step ? 'var(--accent-gold)' : i < step ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.25)',
                                opacity: i === step ? 1 : 0.7
                            }}>
                                {i < step ? '✓' : i + 1}. {s.title}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fields */}
                <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {currentStep.fields.map(field => (
                            <div key={field.key}>
                                <label style={{ fontSize: '0.82rem', opacity: 0.65, display: 'block', marginBottom: '6px' }}>
                                    {field.label} {field.required && <span style={{ color: 'var(--accent-gold)' }}>*</span>}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.key] || ''}
                                        onChange={e => updateField(field.key, e.target.value)}
                                        placeholder={field.placeholder}
                                        rows={3}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${formData[field.key] ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.12)'}`, background: 'rgba(255,255,255,0.04)', color: '#fff', resize: 'vertical', boxSizing: 'border-box' }}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        value={formData[field.key] || ''}
                                        onChange={e => updateField(field.key, e.target.value)}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${formData[field.key] ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.12)'}`, background: '#0d1117', color: '#fff', boxSizing: 'border-box' }}
                                    >
                                        <option value="">{t('tmpl_select') || '— Select —'}</option>
                                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        value={formData[field.key] || ''}
                                        onChange={e => updateField(field.key, e.target.value)}
                                        placeholder={field.placeholder}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${formData[field.key] ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.12)'}`, background: 'rgba(255,255,255,0.04)', color: '#fff', boxSizing: 'border-box' }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
                    <button
                        onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}
                        style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                        {step === 0 ? (t('profile_cancel') || 'Cancel') : (t('lb_back') || '← Back')}
                    </button>
                    <button
                        onClick={() => isLastStep ? onComplete(formData) : setStep(s => s + 1)}
                        disabled={!canProceed()}
                        style={{
                            padding: '10px 24px', borderRadius: '8px', border: 'none',
                            background: canProceed() ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)',
                            color: canProceed() ? '#000' : 'rgba(255,255,255,0.3)',
                            cursor: canProceed() ? 'pointer' : 'not-allowed',
                            fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s'
                        }}
                    >
                        {isLastStep ? (t('tmpl_generate') || '✓ Generate Preview') : (t('lb_next') || 'Next →')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Completed template preview ───────────────────────────────────────────────
const TemplatePreview: React.FC<{ template: Template; data: Record<string, string>; onClose: () => void }> = ({ template, data, onClose }) => {
    const { t } = useLanguage();
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9001,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            backdropFilter: 'blur(8px)'
        }}>
            <div style={{
                width: '100%', maxWidth: '600px', background: '#0d1117',
                borderRadius: '20px', border: '1px solid rgba(255,215,0,0.2)',
                overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>{template.icon}</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{template.title} — {t('tmpl_preview') || 'Preview'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#10b981' }}>{t('tmpl_completed') || '✓ Template completed'}</div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>
                <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                    {template.steps.map((step, i) => (
                        <div key={i} style={{ marginBottom: '24px' }}>
                            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '12px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{step.title}</h4>
                            {step.fields.map(field => data[field.key] && (
                                <div key={field.key} style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '0.88rem' }}>
                                    <span style={{ opacity: 0.5, minWidth: '160px', flexShrink: 0 }}>{field.label}:</span>
                                    <span>{data[field.key]}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)', fontSize: '0.83rem', opacity: 0.7, fontStyle: 'italic', marginTop: '8px' }}>
                        ⚠️ {t('tmpl_disclaimer') || 'This is a draft for reference only. Please consult a qualified notary or lawyer in your jurisdiction before using any legal document.'}
                    </div>
                </div>
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => window.print()} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}>
                        🖨 {t('tmpl_print') || 'Print / Save PDF'}
                    </button>
                    <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--accent-gold)', color: '#000', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
                        {t('tmpl_done') || 'Done'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Templates Component ─────────────────────────────────────────────────
const Templates: React.FC = () => {
    const { t } = useLanguage();
    const [activeWizard, setActiveWizard] = useState<Template | null>(null);
    const [previewData, setPreviewData] = useState<{ template: Template; data: Record<string, string> } | null>(null);

    return (
        <div id="templates" className="tool-panel active">
            <div className="tool-header" style={{ marginBottom: '32px' }}>
                <span className="step-tag">{t('tag_templates') || 'Request Templates'}</span>
                <h2>{t('title_templates') || 'Document Templates'}</h2>
                <p style={{ opacity: 0.7, marginTop: '12px' }}>
                    {t('tmpl_desc') || 'Fill in templates step-by-step. Each wizard guides you through the required information to generate a draft document for legal review.'}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {TEMPLATES.map(tmpl => (
                    <div
                        key={tmpl.id}
                        style={{
                            padding: '24px', borderRadius: '16px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            transition: 'all 0.25s', display: 'flex', flexDirection: 'column'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,215,0,0.25)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <span style={{ fontSize: '1.8rem' }}>{tmpl.icon}</span>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#fff' }}>{tmpl.title}</h3>
                                <div style={{ fontSize: '0.75rem', opacity: 0.45, marginTop: '2px' }}>{tmpl.subtitle}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', opacity: 0.6, flex: 1, marginBottom: '20px', lineHeight: '1.5' }}>{tmpl.desc}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', opacity: 0.4 }}>{(t('tmpl_steps') || '{count} steps').replace('{count}', String(tmpl.steps.length))}</span>
                            <button
                                className="btn"
                                onClick={() => setActiveWizard(tmpl)}
                                style={{ fontSize: '0.75rem', padding: '8px 18px', borderRadius: '8px' }}
                            >
                                {t('tmpl_start') || 'Start Wizard →'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {activeWizard && (
                <TemplateWizard
                    template={activeWizard}
                    onClose={() => setActiveWizard(null)}
                    onComplete={(data) => {
                        setPreviewData({ template: activeWizard, data });
                        setActiveWizard(null);
                    }}
                />
            )}

            {previewData && (
                <TemplatePreview
                    template={previewData.template}
                    data={previewData.data}
                    onClose={() => setPreviewData(null)}
                />
            )}
        </div>
    );
};

export default Templates;
