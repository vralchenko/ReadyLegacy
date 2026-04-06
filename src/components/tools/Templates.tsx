import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { DEMO_TEMPLATES } from '../../lib/demoData';

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
    {
        id: 'registry_notification',
        icon: '🏛️',
        title: 'Death Registration (Zivilstandsamt)',
        subtitle: 'Meldung an das Zivilstandsamt',
        desc: 'Notification form to register a death at the Swiss civil registry office.',
        steps: [
            {
                title: 'Reporter Information',
                fields: [
                    { key: 'reporter_name', label: 'Your Full Name', type: 'text', required: true },
                    { key: 'reporter_relation', label: 'Relationship to Deceased', type: 'select', options: ['Spouse / Partner', 'Child', 'Sibling', 'Parent', 'Other relative', 'Hospital / Nursing home', 'Executor'] },
                    { key: 'reporter_address', label: 'Your Address', type: 'textarea', placeholder: 'Street, City, Canton' },
                    { key: 'reporter_phone', label: 'Phone Number', type: 'text', placeholder: '+41 ...' },
                ]
            },
            {
                title: 'Deceased Information',
                fields: [
                    { key: 'deceased_name', label: 'Full Name of Deceased', type: 'text', required: true },
                    { key: 'deceased_dob', label: 'Date of Birth', type: 'date', required: true },
                    { key: 'deceased_dod', label: 'Date of Death', type: 'date', required: true },
                    { key: 'deceased_place', label: 'Place of Death', type: 'text', placeholder: 'City, Canton', required: true },
                    { key: 'deceased_nationality', label: 'Nationality', type: 'text', placeholder: 'e.g. Swiss, German...' },
                    { key: 'deceased_marital', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Widowed', 'Divorced', 'Registered partnership'] },
                ]
            },
            {
                title: 'Documents & Burial',
                fields: [
                    { key: 'has_death_cert', label: 'Medical Death Certificate Available?', type: 'select', options: ['Yes', 'Not yet'] },
                    { key: 'has_family_book', label: 'Familienbüchlein Available?', type: 'select', options: ['Yes', 'No', 'Not applicable'] },
                    { key: 'burial_type', label: 'Burial Type', type: 'select', options: ['Erdbestattung (burial)', 'Kremation (cremation)', 'Not yet decided'] },
                    { key: 'burial_location', label: 'Preferred Cemetery / Location', type: 'text', placeholder: 'e.g. Friedental, Luzern' },
                ]
            },
        ]
    },
    {
        id: 'termination_letter',
        icon: '✉️',
        title: 'Contract Termination Letter',
        subtitle: 'Kündigungsschreiben',
        desc: 'A letter to terminate contracts, subscriptions, or rental agreements after a death.',
        steps: [
            {
                title: 'Sender Information',
                fields: [
                    { key: 'sender_name', label: 'Your Full Name', type: 'text', required: true },
                    { key: 'sender_address', label: 'Your Address', type: 'textarea', placeholder: 'Street, City, Postal Code' },
                    { key: 'sender_role', label: 'Your Role', type: 'select', options: ['Heir', 'Executor', 'Spouse / Partner', 'Legal representative'] },
                ]
            },
            {
                title: 'Contract Details',
                fields: [
                    { key: 'company_name', label: 'Company / Organization Name', type: 'text', required: true },
                    { key: 'company_address', label: 'Company Address', type: 'textarea' },
                    { key: 'contract_type', label: 'Type of Contract', type: 'select', options: ['Rental agreement', 'Health insurance', 'Phone / Mobile', 'Internet / TV', 'Magazine / Newspaper', 'GA / Halbtax / SBB', 'Gym / Club membership', 'Other subscription'], required: true },
                    { key: 'contract_number', label: 'Contract / Customer Number', type: 'text', placeholder: 'If known' },
                ]
            },
            {
                title: 'Termination Details',
                fields: [
                    { key: 'deceased_name', label: 'Name of Deceased Contract Holder', type: 'text', required: true },
                    { key: 'termination_date', label: 'Requested Termination Date', type: 'date' },
                    { key: 'additional_notes', label: 'Additional Notes', type: 'textarea', placeholder: 'e.g. Please send final invoice to my address...' },
                ]
            },
        ]
    },
    {
        id: 'death_notice',
        icon: '📰',
        title: 'Death Notice',
        subtitle: 'Todesanzeige',
        desc: 'A formal death announcement for publication in newspapers or online portals.',
        steps: [
            {
                title: 'Deceased Information',
                fields: [
                    { key: 'deceased_name', label: 'Full Name of Deceased', type: 'text', required: true },
                    { key: 'deceased_dob', label: 'Date of Birth', type: 'date' },
                    { key: 'deceased_dod', label: 'Date of Death', type: 'date', required: true },
                    { key: 'deceased_place', label: 'Place of Residence', type: 'text', placeholder: 'e.g. Luzern' },
                ]
            },
            {
                title: 'Notice Content',
                fields: [
                    { key: 'opening_text', label: 'Opening Text', type: 'textarea', placeholder: 'e.g. In loving memory...\nWith deep sadness we announce...', required: true },
                    { key: 'family_names', label: 'Surviving Family Members', type: 'textarea', placeholder: 'e.g. Wife Anna, daughter Sofia, son Lukas...' },
                    { key: 'funeral_info', label: 'Funeral Information', type: 'textarea', placeholder: 'Date, time, and place of the ceremony...' },
                ]
            },
            {
                title: 'Publication',
                fields: [
                    { key: 'instead_of_flowers', label: 'Instead of Flowers', type: 'textarea', placeholder: 'e.g. Donations to Swiss Red Cross...' },
                    { key: 'publication_target', label: 'Where to Publish', type: 'select', options: ['Local newspaper', 'Regional newspaper', 'Online portal (e.g. todesanzeigen.ch)', 'Multiple outlets'] },
                ]
            },
        ]
    },
    {
        id: 'condolence_letter',
        icon: '🕊️✉️',
        title: 'Condolence Letter',
        subtitle: 'Trauerbrief',
        desc: 'A personal condolence letter to be sent to friends, colleagues, and extended family.',
        steps: [
            {
                title: 'Sender Information',
                fields: [
                    { key: 'sender_name', label: 'Family / Sender Name', type: 'text', required: true },
                    { key: 'sender_address', label: 'Return Address', type: 'textarea' },
                ]
            },
            {
                title: 'About the Deceased',
                fields: [
                    { key: 'deceased_name', label: 'Full Name of Deceased', type: 'text', required: true },
                    { key: 'deceased_dob', label: 'Date of Birth', type: 'date' },
                    { key: 'deceased_dod', label: 'Date of Death', type: 'date', required: true },
                ]
            },
            {
                title: 'Letter Content',
                fields: [
                    { key: 'personal_message', label: 'Personal Message', type: 'textarea', placeholder: 'A personal tribute or message about the deceased...', required: true },
                    { key: 'funeral_details', label: 'Funeral Details (optional)', type: 'textarea', placeholder: 'Date, time, location of the ceremony...' },
                    { key: 'instead_of_flowers', label: 'Instead of Flowers (optional)', type: 'textarea', placeholder: 'e.g. Donations to a specific charity...' },
                ]
            },
        ]
    },
    {
        id: 'widow_pension',
        icon: '📋🏦',
        title: 'Widow/Widower Pension Application',
        subtitle: 'Antrag auf Witwen-/Witwerrente',
        desc: 'Application for the AHV widow/widower pension after the death of a spouse.',
        steps: [
            {
                title: 'Applicant Information',
                fields: [
                    { key: 'applicant_name', label: 'Your Full Name', type: 'text', required: true },
                    { key: 'applicant_dob', label: 'Your Date of Birth', type: 'date', required: true },
                    { key: 'applicant_ahv', label: 'Your AHV Number (756.xxxx.xxxx.xx)', type: 'text', placeholder: '756.1234.5678.90', required: true },
                    { key: 'applicant_address', label: 'Your Address', type: 'textarea' },
                ]
            },
            {
                title: 'Deceased Spouse Information',
                fields: [
                    { key: 'spouse_name', label: 'Name of Deceased Spouse', type: 'text', required: true },
                    { key: 'spouse_dob', label: 'Date of Birth', type: 'date' },
                    { key: 'spouse_dod', label: 'Date of Death', type: 'date', required: true },
                    { key: 'spouse_ahv', label: 'AHV Number of Deceased', type: 'text', placeholder: '756.1234.5678.90' },
                    { key: 'marriage_date', label: 'Date of Marriage', type: 'date' },
                ]
            },
            {
                title: 'Pension Details',
                fields: [
                    { key: 'has_children', label: 'Do you have children under 18?', type: 'select', options: ['Yes', 'No'], required: true },
                    { key: 'children_count', label: 'Number of Children', type: 'text', placeholder: 'e.g. 2' },
                    { key: 'current_income', label: 'Your Current Annual Income (CHF)', type: 'text', placeholder: 'e.g. 60,000' },
                    { key: 'ahv_office', label: 'Relevant AHV Office / Ausgleichskasse', type: 'text', placeholder: 'e.g. SVA Luzern' },
                ]
            },
        ]
    },
    {
        id: 'pro_senectute_checklist',
        icon: '📋🇨🇭',
        title: 'After Death Checklist (Pro Senectute)',
        subtitle: 'Checkliste Todesfall — Pro Senectute',
        desc: 'A comprehensive Swiss checklist for everything that needs to happen after a loved one passes away, organized in 5 phases.',
        steps: [
            {
                title: 'Phase 1: First Hours',
                fields: [
                    { key: 'p1_doctor', label: 'Call a doctor for the death certificate (Todesbescheinigung)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p1_nursing', label: 'Notify nursing home administration (if applicable)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p1_police', label: 'Call police if accident/suicide suspected', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p1_family', label: 'Inform relatives and close friends', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p1_directives', label: 'Locate death-related directives (Verfügungen)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p1_employer', label: 'Notify employer of deceased + your own', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                ]
            },
            {
                title: 'Phase 2: Within 2 Days',
                fields: [
                    { key: 'p2_zivilstandsamt', label: 'Register death at Zivilstandsamt (civil registry)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p2_docs_note', label: 'Documents brought: medical cert, Familienbüchlein, ID, residence permit', type: 'textarea', placeholder: 'Note which documents were submitted...' },
                    { key: 'p2_funeral_coord', label: 'Coordinate funeral date/place/type with registry', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p2_todesschein', label: 'Obtain official death certificate (Todesschein)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                ]
            },
            {
                title: 'Phase 3: Funeral Arrangements',
                fields: [
                    { key: 'p3_parish', label: 'Contact parish / spiritual advisor / funeral home', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p3_todesanzeige', label: 'Publish death notice (Todesanzeige) in press', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p3_trauerbriefe', label: 'Prepare condolence letters (Trauerbriefe)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p3_aufbahrung', label: 'Arrange viewing (Aufbahrung)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                ]
            },
            {
                title: 'Phase 4: After the Funeral',
                fields: [
                    { key: 'p4_ahv', label: 'AHV/IV — state pension insurance', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p4_pensionskasse', label: 'Pensionskasse — occupational pension (2nd pillar)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p4_krankenkasse', label: 'Krankenkasse — cancel health insurance', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p4_banks', label: 'Banks — freeze or transfer accounts', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p4_steuern', label: 'Steuerbehörde — notify tax authority', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p4_post', label: 'Post — redirect or cancel mail', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p4_subscriptions', label: 'Cancel subscriptions (GA/Halbtax, phone, TV)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p4_rental', label: 'Terminate or transfer rental agreement', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p4_online', label: 'Handle online accounts (social media, email)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                ]
            },
            {
                title: 'Phase 5: Estate & Finances',
                fields: [
                    { key: 'p5_will', label: 'Submit the will to competent authority', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p5_testament', label: 'Attend will opening (Testamentseröffnung)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p5_erbteilung', label: 'Distribute estate (Erbteilung)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p5_wohnung', label: 'Organize apartment clearing (Wohnungsräumung)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p5_witwen', label: 'Widow/widower pension (Witwen-/Witwerrente AHV)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p5_waisen', label: 'Orphan pension (Waisenrente AHV)', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p5_bvg', label: 'BVG pension from occupational fund', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p5_lebensversicherung', label: 'Life insurance payouts', type: 'select', options: ['Done', 'Pending', 'N/A'] },
                    { key: 'p5_notes', label: 'Additional Notes', type: 'textarea', placeholder: 'Any additional items or notes...' },
                ]
            },
        ]
    },
];

// ─── Wizard Component ─────────────────────────────────────────────────────────
const TemplateWizard: React.FC<{ template: Template; initialData?: Record<string, string>; demoData?: Record<string, string>; onClose: () => void; onComplete: (data: Record<string, string>) => void }> = ({ template, initialData, demoData, onClose, onComplete }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, string>>(initialData || {});

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
                width: '100%', maxWidth: '600px', background: 'var(--secondary-bg)',
                borderRadius: '20px', border: '1px solid var(--glass-border)',
                overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{template.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700 }}>{template.title}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentStep.title} — Step {step + 1} of {template.steps.length}</div>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                    </div>
                    {/* Progress */}
                    <div style={{ height: '4px', borderRadius: '2px', background: 'var(--glass-border)' }}>
                        <div style={{ height: '100%', borderRadius: '2px', width: `${progress}%`, background: 'var(--accent-gold)', transition: 'width 0.3s ease' }} />
                    </div>
                    {/* Step indicators — clickable */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        {template.steps.map((s, i) => (
                            <div
                                key={i}
                                onClick={() => setStep(i)}
                                style={{
                                    flex: 1, fontSize: '0.7rem', textAlign: 'center', cursor: 'pointer',
                                    color: i === step ? 'var(--accent-gold)' : i < step ? 'rgba(255,215,0,0.4)' : 'var(--text-muted)',
                                    opacity: i === step ? 1 : 0.7,
                                    padding: '4px 0', borderRadius: '4px', transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = i === step ? '1' : '0.7'; }}
                            >
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
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${formData[field.key] ? 'rgba(255,215,0,0.2)' : 'var(--glass-border)'}`, background: 'var(--glass-bg)', color: 'var(--text-color)', resize: 'vertical', boxSizing: 'border-box' }}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        value={formData[field.key] || ''}
                                        onChange={e => updateField(field.key, e.target.value)}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${formData[field.key] ? 'rgba(255,215,0,0.2)' : 'var(--glass-border)'}`, background: 'var(--secondary-bg)', color: 'var(--text-color)', boxSizing: 'border-box' }}
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
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${formData[field.key] ? 'rgba(255,215,0,0.2)' : 'var(--glass-border)'}`, background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <button
                        onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}
                        style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-color)', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                        {step === 0 ? (t('profile_cancel') || 'Cancel') : (t('lb_back') || '\u2190 Back')}
                    </button>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {demoData && step === 0 && (
                            <button
                                onClick={() => { setFormData(demoData); setStep(template.steps.length - 1); }}
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
                            onClick={() => isLastStep ? onComplete(formData) : setStep(s => s + 1)}
                            disabled={!canProceed()}
                            style={{
                                padding: '10px 24px', borderRadius: '8px', border: 'none',
                                background: canProceed() ? 'var(--accent-gold)' : 'var(--glass-border)',
                                color: canProceed() ? '#fff' : 'var(--text-muted)',
                                cursor: canProceed() ? 'pointer' : 'not-allowed',
                                fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s'
                            }}
                        >
                            {isLastStep ? (t('tmpl_generate') || '\u2713 Generate Preview') : (t('lb_next') || 'Next \u2192')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Completed template preview ───────────────────────────────────────────────
const TemplatePreview: React.FC<{ template: Template; data: Record<string, string>; onClose: () => void; saved: boolean; onSave: () => void }> = ({ template, data, onClose, saved, onSave }) => {
    const { t } = useLanguage();
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9001,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            backdropFilter: 'blur(8px)'
        }}>
            <div style={{
                width: '100%', maxWidth: '600px', background: 'var(--secondary-bg)',
                borderRadius: '20px', border: '1px solid rgba(255,215,0,0.2)',
                overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>{template.icon}</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{template.title} — {t('tmpl_preview') || 'Preview'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#10b981' }}>{t('tmpl_completed') || '✓ Template completed'}</div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>
                <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                    {template.steps.map((step, i) => (
                        <div key={i} style={{ marginBottom: '24px' }}>
                            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '12px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{step.title}</h4>
                            {step.fields.map(field => data[field.key] && (
                                <div key={field.key} style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '0.88rem' }}>
                                    <span style={{ color: 'var(--text-muted)', minWidth: '160px', flexShrink: 0 }}>{field.label}:</span>
                                    <span>{data[field.key]}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)', fontSize: '0.83rem', opacity: 0.7, fontStyle: 'italic', marginTop: '8px' }}>
                        ⚠️ {t('tmpl_disclaimer') || 'This is a draft for reference only. Please consult a qualified notary or lawyer in your jurisdiction before using any legal document.'}
                    </div>
                </div>
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {saved && <span style={{ color: '#10b981', fontSize: '0.85rem', marginRight: 'auto' }}>✓ Saved to Documents</span>}
                    <button onClick={() => window.print()} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-color)', cursor: 'pointer', fontSize: '0.85rem' }}>
                        🖨 {t('tmpl_print') || 'Print / Save PDF'}
                    </button>
                    {!saved ? (
                        <button onClick={onSave} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--accent-gold)', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
                            Save to Documents
                        </button>
                    ) : (
                        <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--accent-gold)', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
                            {t('tmpl_done') || 'Done'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main Templates Component ─────────────────────────────────────────────────
const Templates: React.FC = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [activeWizard, setActiveWizard] = useState<Template | null>(null);
    const [editInitialData, setEditInitialData] = useState<Record<string, string> | undefined>(undefined);
    const [editDocId, setEditDocId] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<{ template: Template; data: Record<string, string> } | null>(null);
    const [docSaved, setDocSaved] = useState(false);

    // Auto-open wizard when navigated from Documents with editDoc state
    useEffect(() => {
        const state = location.state as { editDoc?: { id: string; title: string; type: string; data: Record<string, string> } } | null;
        if (!state?.editDoc) return;
        const doc = state.editDoc;
        // Match template by title
        const tmpl = TEMPLATES.find(t => t.title === doc.title) || TEMPLATES.find(t => t.subtitle === doc.type);
        if (tmpl) {
            setActiveWizard(tmpl);
            setEditInitialData(doc.data as Record<string, string>);
            setEditDocId(doc.id);
        }
        // Clear state so it doesn't re-trigger
        window.history.replaceState({}, '');
    }, [location.state]);


    const saveDocument = async () => {
        if (!previewData) return;
        if (!user) {
            const tool = searchParams.get('tool') || 'templates';
            navigate(`/pricing?returnTo=${encodeURIComponent(`/tools?tool=${tool}`)}`);
            return;
        }
        try {
            if (editDocId) {
                // Update existing document
                await apiFetch(`/documents?id=${editDocId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ data: previewData.data }),
                });
            } else {
                // Create new document
                await apiFetch('/documents', {
                    method: 'POST',
                    body: JSON.stringify({
                        title: previewData.template.title,
                        type: previewData.template.subtitle || previewData.template.title,
                        icon: previewData.template.icon,
                        data: previewData.data,
                    }),
                });
            }
            setDocSaved(true);
            setEditDocId(null);
        } catch (e) {
            console.error('Failed to save document:', e);
        }
    };

    return (
        <div id="templates" className="tool-panel active">
            <div className="tool-header" style={{ marginBottom: '16px' }}>
                <div>
                    <h2 style={{ fontWeight: 700 }}>{t('tag_templates') || 'Request Templates'}</h2>
                    <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: '0' }}>
                        {t('tmpl_desc') || 'Fill in templates step-by-step. Each wizard guides you through the required information to generate a draft document for legal review.'}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {TEMPLATES.map(tmpl => (
                    <div
                        key={tmpl.id}
                        style={{
                            padding: '16px 20px', borderRadius: '14px',
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            transition: 'all 0.25s', display: 'flex', flexDirection: 'column'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,215,0,0.25)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <span style={{ fontSize: '1.8rem' }}>{tmpl.icon}</span>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-color)' }}>{tmpl.title}</h3>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{tmpl.subtitle}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', flex: 1, marginBottom: '12px', lineHeight: '1.4' }}>{tmpl.desc}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{(t('tmpl_steps') || '{count} steps').replace('{count}', String(tmpl.steps.length))}</span>
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
                    initialData={editInitialData}
                    demoData={DEMO_TEMPLATES[activeWizard.id]}
                    onClose={() => { setActiveWizard(null); setEditInitialData(undefined); setEditDocId(null); }}
                    onComplete={(data) => {
                        setPreviewData({ template: activeWizard, data });
                        setActiveWizard(null);
                        setEditInitialData(undefined);
                    }}
                />
            )}

            {previewData && (
                <TemplatePreview
                    template={previewData.template}
                    data={previewData.data}
                    saved={docSaved}
                    onSave={saveDocument}
                    onClose={() => { setPreviewData(null); setDocSaved(false); }}
                />
            )}
        </div>
    );
};

export default Templates;
