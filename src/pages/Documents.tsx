import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiFetch } from '../lib/api';

interface Document {
    id: string;
    title: string;
    type: string;
    icon: string;
    createdAt: string;
    status: 'draft' | 'ready' | 'filed';
    data: Record<string, string>;
}

const STATUS_STYLES = {
    draft: { label: 'Draft', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    ready: { label: 'Ready', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    filed: { label: 'Filed', color: '#6fcf97', bg: 'rgba(111,207,151,0.12)' },
};

function formatDate(dateStr: string): string {
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

const Documents: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [docs, setDocs] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | Document['status']>('all');
    const [viewing, setViewing] = useState<Document | null>(null);

    const fetchDocs = useCallback(async () => {
        try {
            const rows = await apiFetch<any[]>('/documents');
            setDocs(rows.map(r => ({
                id: r.id,
                title: r.title,
                type: r.type || '',
                icon: r.icon || '📄',
                createdAt: formatDate(r.createdAt || r.created_at),
                status: (r.status || 'draft') as Document['status'],
                data: r.data || {},
            })));
        } catch {
            setDocs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDocs(); }, [fetchDocs]);

    const handleDelete = async (id: string) => {
        try {
            await apiFetch(`/documents?id=${id}`, { method: 'DELETE' });
            setDocs(prev => prev.filter(d => d.id !== id));
            setViewing(null);
        } catch {}
    };

    const handleStatusChange = async (id: string, status: Document['status']) => {
        try {
            await apiFetch(`/documents?id=${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status }),
            });
            setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
            setViewing(v => v && v.id === id ? { ...v, status } : v);
        } catch {}
    };

    const filtered = filter === 'all' ? docs : docs.filter(d => d.status === filter);

    const counts = {
        all: docs.length,
        draft: docs.filter(d => d.status === 'draft').length,
        ready: docs.filter(d => d.status === 'ready').length,
        filed: docs.filter(d => d.status === 'filed').length,
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px 0 60px', marginTop: '-40px' }}>
            <div className="container">
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <span style={{ fontSize: '1rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>{t('docs_archive') || 'Document Archive'}</span>
                    <h1 style={{ fontSize: '3rem', marginTop: '8px', marginBottom: '16px', color: 'var(--text-color)' }}>
                        {t('docs_title') || 'Your Documents'}
                    </h1>
                    <p style={{ opacity: 0.8, maxWidth: '600px', fontSize: '1.4rem', lineHeight: 1.6 }}>
                        {t('docs_desc') || 'All your completed templates, legal documents, and saved forms in one place. Download, print, or update them at any time.'}
                    </p>
                </div>

                {/* Stats + filters */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
                    {(['all', 'draft', 'ready', 'filed'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '10px 22px', borderRadius: '24px', border: '1px solid var(--glass-border)',
                                background: filter === f ? 'rgba(255,215,0,0.1)' : 'transparent',
                                color: filter === f ? 'var(--accent-gold)' : 'var(--text-muted)',
                                fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: filter === f ? 700 : 500
                            }}
                        >
                            {t(`docs_filter_${f}`) || (f === 'all' ? 'All' : STATUS_STYLES[f]?.label)} ({counts[f]})
                        </button>
                    ))}
                    <button
                        onClick={() => navigate('/tools?tool=templates')}
                        style={{
                            marginLeft: 'auto', padding: '10px 24px', borderRadius: '24px',
                            border: '1px solid var(--accent-gold)', background: 'rgba(255,215,0,0.08)',
                            color: 'var(--accent-gold)', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 700
                        }}
                    >
                        {t('docs_btn_create') || '+ Create New Document'}
                    </button>
                </div>

                {/* Documents grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>Loading...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
                        <p style={{ fontStyle: 'italic' }}>{t('docs_empty_state') || 'No documents yet. Use the Templates wizard to create your first document.'}</p>
                        <button
                            onClick={() => navigate('/tools?tool=templates')}
                            className="btn"
                            style={{ marginTop: '20px' }}
                        >
                            {t('docs_btn_templates') || 'Open Templates'} →
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {filtered.map(doc => {
                            const statusStyle = STATUS_STYLES[doc.status];
                            return (
                                <div
                                    key={doc.id}
                                    onClick={() => setViewing(doc)}
                                    style={{
                                        padding: '24px', borderRadius: '16px', cursor: 'pointer',
                                        background: 'var(--glass-bg)',
                                        border: '1px solid var(--glass-border)',
                                        transition: 'all 0.25s', display: 'flex', flexDirection: 'column'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '2rem' }}>{doc.icon}</span>
                                        <span style={{
                                            fontSize: '0.95rem', padding: '4px 14px', borderRadius: '12px',
                                            background: statusStyle.bg, color: statusStyle.color,
                                            border: `1px solid ${statusStyle.color}30`
                                        }}>
                                            {t(`docs_filter_${doc.status}`) || statusStyle.label}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.6rem', marginBottom: '6px', color: 'var(--text-color)' }}>{doc.title}</h3>
                                    <p style={{ fontSize: '1.1rem', opacity: 0.6, marginBottom: '24px', flex: 1 }}>{doc.type}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{doc.createdAt}</span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={e => { e.stopPropagation(); window.print(); }}
                                                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '1rem', cursor: 'pointer' }}
                                            >
                                                🖨 {t('docs_btn_print') || 'Print'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Quick links */}
                <div style={{ marginTop: '20px', padding: '32px', borderRadius: '16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ marginBottom: '8px', fontSize: '1.4rem' }}>{t('docs_need_create') || 'Need to create a document?'}</h3>
                        <p style={{ opacity: 0.6, fontSize: '1rem' }}>{t('docs_need_create_desc') || 'Use our step-by-step wizards to generate legal document drafts.'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/tools?tool=templates')} className="btn" style={{ fontSize: '1rem', padding: '10px 20px' }}>{t('docs_btn_templates') || 'Open Templates'}</button>
                        <button onClick={() => navigate('/tools?tool=legal-docs')} className="btn" style={{ fontSize: '1rem', padding: '10px 20px' }}>{t('docs_btn_legal') || 'Legal Framework'}</button>
                        <button onClick={() => navigate('/tools?tool=will-builder')} className="btn" style={{ fontSize: '1rem', padding: '10px 20px' }}>{t('docs_btn_will') || 'Will Builder'}</button>
                    </div>
                </div>
            </div>

            {/* View modal */}
            {viewing && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}
                    onClick={() => setViewing(null)}
                >
                    <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '520px', background: 'var(--secondary-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.8rem' }}>{viewing.icon}</span>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{viewing.title}</h3>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{viewing.type} · {viewing.createdAt}</div>
                            </div>
                            <button onClick={() => setViewing(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ opacity: 0.65, fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                                {viewing.data?.note || 'This document has been saved to your archive.'}
                            </div>

                            {/* Status change */}
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                                {(['draft', 'ready', 'filed'] as const).map(s => {
                                    const ss = STATUS_STYLES[s];
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => handleStatusChange(viewing.id, s)}
                                            style={{
                                                padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer',
                                                border: `1px solid ${viewing.status === s ? ss.color : 'var(--glass-border)'}`,
                                                background: viewing.status === s ? ss.bg : 'transparent',
                                                color: viewing.status === s ? ss.color : 'var(--text-muted)',
                                                fontWeight: viewing.status === s ? 700 : 400,
                                            }}
                                        >
                                            {ss.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button onClick={() => window.print()} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-color)', cursor: 'pointer', fontSize: '0.85rem' }}>🖨 {t('docs_btn_print') || 'Print'}</button>
                                <button onClick={() => { navigate('/tools?tool=templates'); setViewing(null); }} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--accent-gold)', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>Edit in Wizard</button>
                                <button onClick={() => handleDelete(viewing.id)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', marginLeft: 'auto' }}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documents;
