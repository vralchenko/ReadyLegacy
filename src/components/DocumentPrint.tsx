import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

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
    grantor_name: 'Full Name (Grantor)', grantor_dob: 'Date of Birth', grantor_address: 'Address',
    attorney_name: 'Attorney Full Name', attorney_relation: 'Relationship', attorney_address: "Attorney's Address",
    scope: 'Scope of Authority', scope_details: 'Additional Details / Restrictions',
    valid_from: 'Valid From', valid_until: 'Valid Until',
    name: 'Full Name', dob: 'Date of Birth',
    burial_type: 'Type of Burial', ceremony: 'Ceremony Type', location: 'Preferred Location',
    music: 'Music / Hymns', readings: 'Readings or Prayers', other_wishes: 'Other Wishes',
    address: 'Address', deceased_name: 'Name of Deceased', relationship: 'Relationship',
    reason: 'Reason', declaration_date: 'Declaration Date',
    donor_name: 'Donor Full Name', donor_address: 'Donor Address',
    recipient_name: 'Recipient Full Name', gift_description: 'Description of Gift',
    gift_value: 'Estimated Value', conditions: 'Conditions', gift_date: 'Date of Gift',
    agent_name: 'Appointed Agent', agent_relation: 'Relationship to Principal',
    agent_contact: 'Agent Contact', personal_care: 'Personal Care Powers',
    financial: 'Financial Powers', special_wishes: 'Special Wishes / Instructions',
    note: 'Notes',
};

function formatValue(val: unknown): string {
    if (!val) return '';
    const s = String(val);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        const d = new Date(s + 'T00:00:00');
        return d.toLocaleDateString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    return s;
}

function getOrCreatePortalRoot(): HTMLElement {
    let el = document.getElementById('document-print-root');
    if (!el) {
        el = document.createElement('div');
        el.id = 'document-print-root';
        document.body.appendChild(el);
    }
    return el;
}

const DocumentPrint: React.FC<DocumentPrintProps> = ({ title, type, date, status, data, onClose }) => {
    const portalRoot = useRef(getOrCreatePortalRoot());

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const entries = Object.entries(data).filter(([, v]) => v && String(v).trim());

    const handlePrint = () => window.print();

    const content = (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 99999, background: '#fff',
            overflow: 'auto', color: '#1a1a1a', fontFamily: "'Georgia', 'Times New Roman', serif",
        }}>
            {/* Toolbar */}
            <div className="no-print" style={{
                position: 'sticky', top: 0, zIndex: 100000, background: '#f8f8f8',
                borderBottom: '1px solid #e0e0e0', padding: '12px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <button onClick={onClose} style={{
                    padding: '8px 20px', borderRadius: '8px', border: '1px solid #ddd',
                    background: '#fff', cursor: 'pointer', fontSize: '0.85rem', color: '#333',
                }}>
                    ← Back to Documents
                </button>
                <button onClick={handlePrint} style={{
                    padding: '8px 24px', borderRadius: '8px', border: 'none',
                    background: '#1a1b6b', color: '#fff', cursor: 'pointer',
                    fontSize: '0.85rem', fontWeight: 700,
                }}>
                    🖨 Print / Save PDF
                </button>
            </div>

            <div style={{
                maxWidth: '700px', margin: '0 auto', padding: '40px 50px 60px',
                lineHeight: 1.7, fontSize: '11pt',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #1a1a1a', paddingBottom: '24px' }}>
                    <div style={{ fontSize: '10pt', letterSpacing: '3px', textTransform: 'uppercase', color: '#666', marginBottom: '8px' }}>
                        Ready Legacy — Document Archive
                    </div>
                    <h1 style={{ fontSize: '22pt', margin: '0 0 8px 0', fontWeight: 700, fontFamily: "'Georgia', serif" }}>{title}</h1>
                    <div style={{ fontSize: '10pt', color: '#666' }}>
                        {type} &nbsp;·&nbsp; {date} &nbsp;·&nbsp; {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                </div>

                {/* Fields */}
                <div style={{ marginBottom: '40px' }}>
                    {entries.map(([key, value]) => {
                        const label = FIELD_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                        const val = formatValue(value);
                        const isLong = val.length > 80;
                        return (
                            <div key={key} style={{ marginBottom: '16px', ...(isLong ? {} : { display: 'flex', gap: '12px' }) }}>
                                <div style={{
                                    fontWeight: 700, fontSize: '9pt', textTransform: 'uppercase',
                                    letterSpacing: '0.5px', color: '#444', minWidth: '200px',
                                    ...(isLong ? { marginBottom: '4px' } : {}),
                                }}>
                                    {label}
                                </div>
                                <div style={{ flex: 1, borderBottom: '1px solid #ddd', paddingBottom: '4px', whiteSpace: isLong ? 'pre-wrap' : 'normal' }}>
                                    {val}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Signature */}
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

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '8pt', color: '#aaa' }}>
                    readylegacy.ch &nbsp;·&nbsp; Swiss Made &nbsp;·&nbsp; GDPR &amp; nDSG Compliant
                </div>
            </div>
        </div>
    );

    return createPortal(content, portalRoot.current);
};

export default DocumentPrint;
