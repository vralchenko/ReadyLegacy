import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDemoMode } from '../../context/DemoContext';
import { fillDemoAssets } from '../../lib/demoData';
import { useSaveToDocuments } from '../../hooks/useSaveToDocuments';

// ─── Persistent input hook ────────────────────────────────────────────────────
const useInput = (key: string, resetSignal?: boolean) => {
    const [value, setValue] = useState(() => localStorage.getItem(`readylegacy_${key}`) || '');

    useEffect(() => {
        setValue(localStorage.getItem(`readylegacy_${key}`) || '');
    }, [resetSignal, key]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        localStorage.setItem(`readylegacy_${key}`, newValue);
    };
    return { value, onChange };
};

// ─── Dynamic list hook ────────────────────────────────────────────────────────
const useAssetList = (key: string, resetSignal?: boolean) => {
    const [items, setItems] = useState<any[]>(() => {
        try {
            const stored = localStorage.getItem(`readylegacy_list_${key}`);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try {
            const stored = localStorage.getItem(`readylegacy_list_${key}`);
            setItems(stored ? JSON.parse(stored) : []);
        } catch { setItems([]); }
    }, [resetSignal, key]);

    const addItem = (item: any) => {
        const newItems = [...items, { ...item, id: Date.now().toString() }];
        setItems(newItems);
        localStorage.setItem(`readylegacy_list_${key}`, JSON.stringify(newItems));
    };

    const removeItem = (id: string) => {
        const newItems = items.filter(i => i.id !== id);
        setItems(newItems);
        localStorage.setItem(`readylegacy_list_${key}`, JSON.stringify(newItems));
    };

    return { items, addItem, removeItem };
};

// ─── Dynamic Asset List Component ─────────────────────────────────────────────
const DynamicAssetList = ({ title, itemKey, fields, demoMode }: {
    title: string;
    itemKey: string;
    fields?: { key: string; label: string; placeholder?: string; type?: string }[];
    demoMode?: boolean;
}) => {
    const { items, addItem, removeItem } = useAssetList(itemKey, demoMode);
    const [isAdding, setIsAdding] = useState(false);
    const [viewingItem, setViewingItem] = useState<any>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});

    const defaultFields = fields || [
        { key: 'name', label: 'Description', placeholder: 'e.g. UBS Savings' },
        { key: 'value', label: 'Amount / Value', placeholder: 'e.g. 50,000 CHF' },
    ];

    const handleAdd = () => {
        if (!formData['name'] && !formData[defaultFields[0].key]) return;
        addItem(formData);
        setFormData({});
        setIsAdding(false);
    };

    const handleUpdate = () => {
        if (!viewingItem) return;
        removeItem(viewingItem.id);
        addItem(viewingItem);
        setViewingItem(null);
    };

    const updateField = (key: string, val: string) => {
        setFormData(prev => ({ ...prev, [key]: val }));
    };

    const updateViewingField = (key: string, val: string) => {
        setViewingItem((prev: any) => ({ ...prev, [key]: val }));
    };

    return (
        <div style={{ padding: '20px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--accent-gold)', opacity: 0.9 }}>{title}</h4>
                <button
                    className="btn"
                    style={{ padding: '6px 14px', fontSize: '0.8rem', background: isAdding ? 'rgba(255,107,107,0.1)' : 'var(--accent-gold)', color: isAdding ? '#ff6b6b' : '#fff', border: isAdding ? '1px solid currentColor' : 'none', borderRadius: '6px', fontWeight: 600 }}
                    onClick={() => setIsAdding(!isAdding)}
                >
                    {isAdding ? 'Cancel' : '+ Add Item'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {items.map(item => (
                    <div
                        key={item.id}
                        onClick={() => setViewingItem(item)}
                        style={{
                            padding: '14px', background: 'var(--glass-bg)', borderRadius: '10px',
                            border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.2s',
                            position: 'relative', overflow: 'hidden'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.3)'; e.currentTarget.style.background = 'var(--glass-border)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.background = 'var(--glass-bg)'; }}
                    >
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item[defaultFields[0].key] || 'Untitiled'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {defaultFields[1] && item[defaultFields[1].key] ? item[defaultFields[1].key] : 'Click for details'}
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                            style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: 'rgba(255,100,100,0.4)', fontSize: '1rem', cursor: 'pointer', padding: '4px' }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {isAdding && (
                <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', marginTop: '16px', border: '1px solid rgba(251,191,36,0.2)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                        {defaultFields.map(f => (
                            <div key={f.key} style={{ flex: '1', minWidth: '180px' }}>
                                <label style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '6px', display: 'block' }}>{f.label}</label>
                                <input
                                    type="text"
                                    value={formData[f.key] || ''}
                                    onChange={e => updateField(f.key, e.target.value)}
                                    placeholder={f.placeholder}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box', fontSize: '0.85rem' }}
                                />
                            </div>
                        ))}
                    </div>
                    <button className="btn" style={{ background: 'var(--accent-gold)', color: '#fff', padding: '8px 20px', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }} onClick={handleAdd}>Save Item</button>
                </div>
            )}

            {/* Drill-down Modal */}
            {viewingItem && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setViewingItem(null)}>
                    <div style={{ width: '100%', maxWidth: '500px', background: 'var(--secondary-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)', padding: '28px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent-gold)' }}>Item Details</h3>
                            <button onClick={() => setViewingItem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.8rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            {defaultFields.map(f => (
                                <div key={f.key}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                                    <input
                                        type="text"
                                        value={viewingItem[f.key] || ''}
                                        onChange={e => updateViewingField(f.key, e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box', fontSize: '0.9rem' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setViewingItem(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>Close</button>
                            <button onClick={handleUpdate} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'var(--accent-gold)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Validation helper ────────────────────────────────────────────────────────
const validate = (value: string, required = true) => required && !value.trim() ? 'This field is required' : null;

// ─── Main Component ───────────────────────────────────────────────────────────
const AssetOverview: React.FC = () => {
    const { t } = useLanguage();
    const { demoMode } = useDemoMode();
    const saveToDocuments = useSaveToDocuments();
    const [step, setStep] = useState(2);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const assetBrought = useInput('asset_brought', demoMode);
    const assetMortgages = useInput('asset_mortgages', demoMode);
    const assetDebts = useInput('asset_debts', demoMode);
    const funeralType = useInput('funeral_type', demoMode);
    const funeralLocation = useInput('funeral_location', demoMode);
    const funeralNotes = useInput('funeral_notes', demoMode);
    const othersNotes = useInput('others_notes', demoMode);
    const [docSaved, setDocSaved] = useState(false);

    const getAllAssetListData = () => {
        const lists: Record<string, unknown[]> = {};
        const keys = ['bank', 'securities', 'bvg', 'insurance', 'real_estate', 'crypto_wallets', 'crypto_exchanges', 'hardware_wallets', 'online_accounts', 'online_banking', 'funeral_music', 'funeral_people', 'funeral_flowers', 'sentimental_items', 'pets'];
        for (const k of keys) {
            try {
                const stored = localStorage.getItem(`readylegacy_list_${k}`);
                if (stored) lists[k] = JSON.parse(stored);
            } catch { /* skip */ }
        }
        return lists;
    };

    const handleSaveToDocuments = async () => {
        try {
            const date = new Date().toLocaleDateString();
            const saved = await saveToDocuments(
                `Asset Overview — ${date}`,
                'Asset Overview',
                '\uD83D\uDCB0',
                {
                    asset_brought: assetBrought.value,
                    asset_mortgages: assetMortgages.value,
                    asset_debts: assetDebts.value,
                    funeral_type: funeralType.value,
                    funeral_location: funeralLocation.value,
                    funeral_notes: funeralNotes.value,
                    others_notes: othersNotes.value,
                    ...getAllAssetListData(),
                }
            );
            if (saved) setDocSaved(true);
        } catch {
            alert('Failed to save to Documents');
        }
    };

    const validateStep = (s: number): boolean => {
        const newErrors: Record<string, string> = {};
        if (s === 1) {
            const e = validate(assetBrought.value, false);
            if (e) newErrors['brought'] = e;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const goNext = (nextStep: number) => {
        if (validateStep(step)) setStep(nextStep);
    };

    const STEPS = [
        { num: 2, label: '01. Assets' },
        { num: 3, label: '02. Liabilities' },
        { num: 4, label: '03. Digital Legacy' },
        { num: 5, label: '04. Funeral Wishes' },
        { num: 6, label: '05. Others' },
    ];

    return (
        <div id="asset-overview" className="tool-panel active">
            <div className="tool-header" style={{ marginBottom: '40px' }}>
                <h2 style={{ fontWeight: 700 }}>{t('tag_assets') || 'Asset Overview'}</h2>
                <p style={{ opacity: 0.7, marginTop: '16px' }}>{t('desc_assets') || 'A comprehensive overview of your personal assets, wishes, and digital legacy.'}</p>
                <button onClick={() => { fillDemoAssets(); window.location.reload(); }} style={{ marginTop: '12px', padding: '6px 14px', borderRadius: '8px', border: '1px solid #10b981', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>⚡ Fill Demo Data</button>
            </div>

            {/* Step indicator */}
            <div className="wizard-steps" style={{ flexWrap: 'wrap', gap: '8px' }}>
                {STEPS.map(s => (
                    <div key={s.num} className={`wizard-step ${step === s.num ? 'active' : ''}`} onClick={() => setStep(s.num)}>
                        {s.label}
                    </div>
                ))}
            </div>

            {/* Step 2: Assets */}
            {step === 2 && (
                <div className="wizard-content-step active">
                    <div className="tool-section">
                        <h3>1.2 Financial Assets</h3>
                        <p style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '6px', background: 'rgba(251,191,36,0.1)', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '16px' }}>
                            {t('assets_indicative') || 'All values are indicative estimates — not a legal valuation'}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <DynamicAssetList title={t('label_bank') || 'Bank & Savings'} itemKey="bank" demoMode={demoMode} fields={[
                                { key: 'name', label: 'Account', placeholder: 'e.g. UBS Savings Account' },
                            ]} />
                            <DynamicAssetList title={t('label_securities') || 'Securities & Stocks'} itemKey="securities" demoMode={demoMode} />
                            <DynamicAssetList title={t('label_bvg') || 'Pension Fund'} itemKey="bvg" demoMode={demoMode} />
                            <DynamicAssetList title={t('label_insurance') || 'Insurance'} itemKey="insurance" demoMode={demoMode} />
                            <DynamicAssetList title={t('auto_real_estate') || 'Real Estate'} itemKey="real_estate" demoMode={demoMode} fields={[
                                { key: 'name', label: 'Property', placeholder: 'e.g. Vienna apartment' },
                                { key: 'value', label: 'Estimated Value', placeholder: 'e.g. 350,000 EUR' },
                                { key: 'address', label: 'Address', placeholder: 'Street, City' },
                                { key: 'ownership', label: 'Ownership', placeholder: 'Personal or Shared (e.g. 50% with spouse)' },
                                { key: 'co_owners', label: 'Co-owners', placeholder: 'e.g. Spouse name, share %' },
                            ]} />
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button className="btn" onClick={() => goNext(3)}>Next →</button>
                    </div>
                </div>
            )}

            {/* Step 3: Liabilities */}
            {step === 3 && (
                <div className="wizard-content-step active">
                    <div className="tool-section">
                        <h3>1.3 Liabilities</h3>
                        <div className="form-group">
                            <label>{t('label_mortgages') || 'Mortgages'}</label>
                            <input type="text" placeholder={t('auto_e_g_200_000_eur') || 'e.g. 200,000 EUR — Raiffeisen Bank'} {...assetMortgages} />
                        </div>
                        <div className="form-group">
                            <label>{t('label_debts') || 'Other Debts & Liabilities'}</label>
                            <input type="text" placeholder={t('auto_e_g_car_loan_cr') || 'e.g. Car loan, credit card...'} {...assetDebts} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn" onClick={() => setStep(2)}>← Back</button>
                        <button className="btn" onClick={() => goNext(4)}>Next →</button>
                    </div>
                </div>
            )}

            {/* Step 4: Digital Legacy */}
            {step === 4 && (
                <div className="wizard-content-step active">
                    <div className="tool-section">
                        <h3>Digital Legacy Inventory</h3>
                        <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '20px' }}>
                            Document your digital assets so that your heirs can access or properly close these accounts. ⚠️ Never store actual passwords here — use a secure password manager.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <DynamicAssetList
                                title={t('auto_crypto_wallets') || '🔐 Crypto Wallets'}
                                itemKey="crypto_wallets"
                                demoMode={demoMode}
                                fields={[
                                    { key: 'name', label: 'Wallet / Coin', placeholder: 'e.g. Bitcoin — Ledger Nano X' },
                                    { key: 'location', label: 'Where stored', placeholder: 'e.g. Hardware wallet, paper wallet...' },
                                    { key: 'instructions', label: 'Access instructions', placeholder: 'e.g. Seed phrase is in safe deposit box...' },
                                ]}
                            />
                            <DynamicAssetList
                                title={t('auto_crypto_exchange') || '📈 Crypto Exchanges'}
                                itemKey="crypto_exchanges"
                                demoMode={demoMode}
                                fields={[
                                    { key: 'name', label: 'Exchange', placeholder: 'e.g. Binance, Coinbase, Kraken...' },
                                    { key: 'email', label: 'Registered email', placeholder: 'e.g. john@email.com' },
                                    { key: 'instructions', label: 'Access instructions', placeholder: 'e.g. 2FA device is in...' },
                                ]}
                            />
                            <DynamicAssetList
                                title={t('auto_hardware_device') || '💳 Hardware Device (Ledger, Trezor, etc.)'}
                                itemKey="hardware_wallets"
                                demoMode={demoMode}
                                fields={[
                                    { key: 'name', label: 'Device', placeholder: 'e.g. Ledger Nano X' },
                                    { key: 'location', label: 'Physical location', placeholder: 'e.g. Home safe, bank vault...' },
                                    { key: 'instructions', label: 'Recovery instructions', placeholder: 'e.g. PIN and seed phrase are...' },
                                ]}
                            />
                            <DynamicAssetList
                                title={t('auto_online_accounts') || '🌐 Online Accounts (Email, Social Media, etc.)'}
                                itemKey="online_accounts"
                                demoMode={demoMode}
                                fields={[
                                    { key: 'name', label: 'Platform / Service', placeholder: 'e.g. Gmail, Facebook, iCloud...' },
                                    { key: 'wish', label: 'Your wish for this account', placeholder: 'e.g. Delete, memorialize, pass to...' },
                                ]}
                            />
                            <DynamicAssetList
                                title={t('auto_online_banking_') || '💰 Online Banking & Fintech'}
                                itemKey="online_banking"
                                demoMode={demoMode}
                                fields={[
                                    { key: 'name', label: 'Bank / App', placeholder: 'e.g. N26, Revolut, PayPal...' },
                                    { key: 'instructions', label: 'Instructions', placeholder: 'e.g. Contact bank to close account...' },
                                ]}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button className="btn" onClick={() => setStep(3)}>← Back</button>
                        <button className="btn" onClick={() => goNext(5)}>Next →</button>
                    </div>
                </div>
            )}

            {/* Step 5: Funeral Wishes */}
            {step === 5 && (
                <div className="wizard-content-step active">
                    <div className="tool-section">
                        <h3>1.5 Funeral Wishes</h3>
                        <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '20px' }}>
                            Share your personal wishes for your funeral and burial. These preferences help your loved ones make decisions aligned with your values.
                        </p>
                        <div className="form-group">
                            <label>Type of Funeral</label>
                            <select {...funeralType} style={{ width: '100%', padding: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-color)', borderRadius: '8px' }}>
                                <option value="">— Select preference —</option>
                                <option value="burial">Traditional Burial</option>
                                <option value="cremation">Cremation</option>
                                <option value="natural">Natural / Green Burial</option>
                                <option value="sea">Sea / Water Burial</option>
                                <option value="no_preference">No preference</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Preferred Location / Cemetery</label>
                            <input type="text" placeholder={t('auto_e_g_vienna_cent') || 'e.g. Vienna Central Cemetery, hometown...'} {...funeralLocation} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                            <DynamicAssetList
                                title={t('auto_music_ceremony_') || '🎵 Music & Ceremony Wishes'}
                                itemKey="funeral_music"
                                demoMode={demoMode}
                                fields={[
                                    { key: 'name', label: 'Song / Piece', placeholder: 'e.g. Ave Maria, Beethoven 7th...' },
                                    { key: 'note', label: 'Note', placeholder: 'e.g. For the opening of the ceremony...' },
                                ]}
                            />
                            <DynamicAssetList
                                title={t('auto_people_to_notif') || '👥 People to Notify / Invite'}
                                itemKey="funeral_people"
                                demoMode={demoMode}
                                fields={[
                                    { key: 'name', label: 'Name', placeholder: 'e.g. Old school friends' },
                                    { key: 'contact', label: 'Contact', placeholder: 'e.g. email or phone' },
                                ]}
                            />
                            <DynamicAssetList
                                title={t('auto_flowers_donatio') || '🌸 Flowers & Donations'}
                                itemKey="funeral_flowers"
                                demoMode={demoMode}
                                fields={[
                                    { key: 'name', label: 'Preference', placeholder: 'e.g. White roses, or donations to charity X' },
                                ]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Additional Wishes & Notes</label>
                            <textarea
                                rows={4}
                                placeholder={t('auto_any_other_perso') || 'Any other personal wishes for your funeral, tribute, or memorial...'}
                                value={funeralNotes.value}
                                onChange={funeralNotes.onChange as any}
                                style={{ width: '100%', padding: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-color)', borderRadius: '8px', resize: 'vertical', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn" onClick={() => setStep(4)}>← Back</button>
                        <button className="btn" onClick={() => goNext(6)}>Next →</button>
                    </div>
                </div>
            )}

            {/* Step 6: Others */}
            {step === 6 && (
                <div className="wizard-content-step active">
                    <div className="tool-section">
                        <h3>1.6 Others</h3>
                        <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '20px' }}>
                            Anything that doesn't fit the other categories — personal notes, special wishes, sentimental items, or messages to loved ones.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                            <DynamicAssetList
                                title={t('auto_sentimental_ite') || '💎 Sentimental Items & Heirlooms'}
                                itemKey="sentimental_items"
                                demoMode={demoMode}
                                fields={[
                                    { key: 'name', label: 'Item', placeholder: 'e.g. Grandmother\'s ring, old watch...' },
                                    { key: 'recipient', label: 'Intended for', placeholder: 'e.g. My daughter Sofia' },
                                    { key: 'note', label: 'Story / Note', placeholder: 'Why it is meaningful...' },
                                ]}
                            />
                            <DynamicAssetList
                                title={t('auto_pets') || '🐾 Pets'}
                                itemKey="pets"
                                demoMode={demoMode}
                                fields={[
                                    { key: 'name', label: 'Pet name', placeholder: 'e.g. Max the golden retriever' },
                                    { key: 'caretaker', label: 'Intended caretaker', placeholder: 'e.g. My sister Maria' },
                                ]}
                            />
                        </div>
                        <div className="form-group">
                            <label>General Notes & Other Wishes</label>
                            <textarea
                                rows={5}
                                placeholder={t('auto_any_other_thoug') || 'Any other thoughts, wishes, or notes you\'d like to document...'}
                                value={othersNotes.value}
                                onChange={othersNotes.onChange as any}
                                style={{ width: '100%', padding: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-color)', borderRadius: '8px', resize: 'vertical', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>
                    <p style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '6px', background: 'rgba(251,191,36,0.1)', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 600, marginTop: '16px', marginBottom: '4px' }}>
                        {t('assets_indicative') || 'All values are indicative estimates — not a legal valuation'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn" onClick={() => setStep(5)}>← Back</button>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {!docSaved ? (
                                <button className="btn" style={{ background: 'transparent', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)' }} onClick={handleSaveToDocuments}>Save to Documents</button>
                            ) : (
                                <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>{'\u2713'} Saved to Documents</span>
                            )}
                            <button className="btn" style={{ background: 'var(--accent-gold)', color: 'var(--bg-color)', fontWeight: 700 }} onClick={() => alert(t('auto_all_your_data_i') || '\u2705 All your data is saved automatically to your local storage!')}>
                                {'\u2713'} Complete & Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetOverview;
