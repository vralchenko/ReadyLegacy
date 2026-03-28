import React, { useEffect } from 'react';

interface DocumentPrintProps {
    title: string;
    type: string;
    icon: string;
    date: string;
    status: string;
    data: Record<string, unknown>;
    onClose: () => void;
}

const FIELD_LABELS: Record<string, string> = {
    // Power of Attorney
    grantor_name: 'Full Name (Grantor)',
    grantor_dob: 'Date of Birth',
    grantor_address: 'Address',
    attorney_name: 'Attorney Full Name',
    attorney_relation: 'Relationship',
    attorney_address: "Attorney's Address",
    scope: 'Scope of Authority',
    scope_details: 'Additional Details / Restrictions',
    valid_from: 'Valid From',
    valid_until: 'Valid Until',
    // Funeral Directive
    name: 'Full Name',
    dob: 'Date of Birth',
    burial_type: 'Type of Burial',
    ceremony: 'Ceremony Type',
    location: 'Preferred Location',
    music: 'Music / Hymns',
    readings: 'Readings or Prayers',
    other_wishes: 'Other Wishes',
    // Inheritance Waiver
    address: 'Address',
    deceased_name: 'Name of Deceased',
    relationship: 'Relationship',
    reason: 'Reason',
    declaration_date: 'Declaration Date',
    // Gift Declaration
    donor_name: 'Donor Full Name',
    donor_address: 'Donor Address',
    recipient_name: 'Recipient Full Name',
    gift_description: 'Description of Gift',
    gift_value: 'Estimated Value',
    conditions: 'Conditions',
    gift_date: 'Date of Gift',
    // Advance Care Directive
    agent_name: 'Appointed Agent',
    agent_relation: 'Relationship to Principal',
    agent_contact: 'Agent Contact',
    personal_care: 'Personal Care Powers',
    financial: 'Financial Powers',
    special_wishes: 'Special Wishes / Instructions',
    // Generic
    note: 'Notes',
};

function formatValue(val: unknown): string {
    if (!val) return '';
    const s = String(val);
    // Format ISO dates
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        const d = new Date(s + 'T00:00:00');
        return d.toLocaleDateString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    return s;
}

const DocumentPrint: React.FC<DocumentPrintProps> = ({ title, type, date, status, data, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => window.print(), 200);
        const afterPrint = () => onClose();
        window.addEventListener('afterprint', afterPrint);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('afterprint', afterPrint);
        };
    }, [onClose]);

    const entries = Object.entries(data).filter(([, v]) => v && String(v).trim());

    return (
        <div id="document-print-overlay" style={{
            position: 'fixed', inset: 0, zIndex: 99999, background: '#fff',
            overflow: 'auto', color: '#1a1a1a', fontFamily: "'Georgia', 'Times New Roman', serif",
        }}>
            {/* Close button (hidden in print) */}
            <button
                onClick={onClose}
                className="no-print"
                style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 100000,
                    padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd',
                    background: '#f5f5f5', cursor: 'pointer', fontSize: '0.9rem',
                }}
            >
                ← Close Preview
            </button>

            <div style={{
                maxWidth: '700px', margin: '0 auto', padding: '60px 50px',
                lineHeight: 1.7, fontSize: '11pt',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #1a1a1a', paddingBottom: '24px' }}>
                    <div style={{ fontSize: '10pt', letterSpacing: '3px', textTransform: 'uppercase', color: '#666', marginBottom: '8px' }}>
                        Ready Legacy — Document Archive
                    </div>
                    <h1 style={{ fontSize: '22pt', margin: '0 0 8px 0', fontWeight: 700 }}>{title}</h1>
                    <div style={{ fontSize: '10pt', color: '#666' }}>
                        {type} &nbsp;·&nbsp; Created {date} &nbsp;·&nbsp; Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                </div>

                {/* Document body */}
                <div style={{ marginBottom: '40px' }}>
                    {entries.map(([key, value]) => {
                        const label = FIELD_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                        const val = formatValue(value);
                        const isLong = val.length > 80;

                        return (
                            <div key={key} style={{
                                marginBottom: '16px',
                                ...(isLong ? {} : { display: 'flex', gap: '12px' }),
                            }}>
                                <div style={{
                                    fontWeight: 700, fontSize: '9pt', textTransform: 'uppercase',
                                    letterSpacing: '0.5px', color: '#444', minWidth: '200px',
                                    ...(isLong ? { marginBottom: '4px' } : {}),
                                }}>
                                    {label}
                                </div>
                                <div style={{
                                    flex: 1, borderBottom: '1px solid #ddd', paddingBottom: '4px',
                                    whiteSpace: isLong ? 'pre-wrap' : 'normal',
                                }}>
                                    {val}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Signature block */}
                <div style={{ marginTop: '60px', borderTop: '1px solid #ccc', paddingTop: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ borderBottom: '1px solid #1a1a1a', height: '60px' }} />
                            <div style={{ fontSize: '9pt', color: '#666', marginTop: '6px' }}>Place, Date</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ borderBottom: '1px solid #1a1a1a', height: '60px' }} />
                            <div style={{ fontSize: '9pt', color: '#666', marginTop: '6px' }}>Signature</div>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div style={{
                    marginTop: '40px', padding: '16px', borderRadius: '4px',
                    border: '1px solid #ddd', fontSize: '8pt', color: '#888', lineHeight: 1.5,
                }}>
                    This document was generated by Ready Legacy (readylegacy.ch) and is intended as a draft
                    for organizational purposes only. It does not constitute legal advice. Please consult a
                    qualified notary or lawyer in your jurisdiction before using this document for any legal purpose.
                    In Switzerland, certain documents (e.g., wills) must be handwritten to be legally valid.
                </div>

                {/* Footer */}
                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '8pt', color: '#aaa' }}>
                    readylegacy.ch &nbsp;·&nbsp; Swiss Made &nbsp;·&nbsp; GDPR &amp; nDSG Compliant
                </div>
            </div>
        </div>
    );
};

export default DocumentPrint;
