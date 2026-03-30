import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDemoMode } from '../../context/DemoContext';
import { DEMO_WILL } from '../../lib/demoData';
import usePersistedState from '../../hooks/useSyncedState';
import { saveToDocuments } from '../../lib/saveDocument';

const WillBuilder: React.FC = () => {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);

    const [willName, setWillName] = usePersistedState('will_name', '');
    const [willOrigin, setWillOrigin] = usePersistedState('will_origin', '');
    const [willSpouseQ, setWillSpouseQ] = usePersistedState('will_spouse_q', '');
    const [willChildrenQ, setWillChildrenQ] = usePersistedState('will_children_q', '');
    const [willOthers, setWillOthers] = usePersistedState('will_others', '');
    const [willLegacies, setWillLegacies] = usePersistedState('will_legacies', '');
    const [willHandwritten, setWillHandwritten] = usePersistedState('will_handwritten', false);
    const [willDated, setWillDated] = usePersistedState('will_dated', false);
    const [docSaved, setDocSaved] = useState(false);
    const { demoMode } = useDemoMode();

    useEffect(() => {
        if (demoMode) {
            setWillName(DEMO_WILL.will_name);
            setWillOrigin(DEMO_WILL.will_origin);
            setWillSpouseQ(DEMO_WILL.will_spouse_q);
            setWillChildrenQ(DEMO_WILL.will_children_q);
            setWillOthers(DEMO_WILL.will_others);
            setWillLegacies(DEMO_WILL.will_legacies);
            setWillHandwritten(DEMO_WILL.will_handwritten);
            setWillDated(DEMO_WILL.will_dated);
        }
    }, [demoMode]);

    const handleSaveToDocuments = async () => {
        try {
            await saveToDocuments(
                willName ? `Will — ${willName}` : 'Will Outline',
                'Will',
                '\uD83D\uDCDC',
                { will_name: willName, will_origin: willOrigin, will_spouse_q: willSpouseQ, will_children_q: willChildrenQ, will_others: willOthers, will_legacies: willLegacies, will_handwritten: willHandwritten, will_dated: willDated }
            );
            setDocSaved(true);
        } catch {
            alert('Failed to save to Documents');
        }
    };

    return (
        <div id="will-builder" className="tool-panel active">
            <div className="tool-header" style={{ marginBottom: '40px' }}>
                <span className="step-tag">{t('tag_will') || 'Will Builder'}</span>
                <h2>{t('title_will') || 'Will Structure Builder'}</h2>
                <p style={{ opacity: 0.7, marginTop: '16px' }}>{t('desc_will')}</p>
            </div>

            <div className="wizard-steps">
                <div className={`wizard-step ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)}>{t('step_1') || '01. Creator'}</div>
                <div className={`wizard-step ${step === 2 ? 'active' : ''}`} onClick={() => setStep(2)}>{t('step_2') || '02. Heirs'}</div>
                <div className={`wizard-step ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}>{t('step_3') || '03. Legacies'}</div>
                <div className={`wizard-step ${step === 4 ? 'active' : ''}`} onClick={() => setStep(4)}>{t('step_4') || '04. Form'}</div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
                <div id="will-step-1" className="wizard-content-step active">
                    <div className="tool-section">
                        <h3>{t('subtitle_testator') || '5.1 Testator Information'}</h3>
                        <div className="form-group">
                            <label>{t('label_fullname') || 'Full Name'}</label>
                            <input type="text" value={willName} onChange={(e) => setWillName(e.target.value)} placeholder="..." />
                        </div>
                        <div className="form-group">
                            <label>{t('label_origin') || 'Place of Origin / Nationality'}</label>
                            <input type="text" value={willOrigin} onChange={(e) => setWillOrigin(e.target.value)} placeholder="..." />
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button className="btn" style={{ background: 'var(--accent-gold)', color: 'var(--bg-color)' }} onClick={() => setStep(2)}>Next Step</button>
                    </div>
                </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
                <div id="will-step-2" className="wizard-content-step active">
                    <div className="tool-section">
                        <h3>{t('subtitle_heirs') || '5.2 Heirs & Allocation'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>{t('label_spouse_quota') || 'Spouse / Partner Share (%)'}</label>
                                <input type="number" value={willSpouseQ} onChange={(e) => setWillSpouseQ(e.target.value)} placeholder="50" />
                            </div>
                            <div className="form-group">
                                <label>{t('label_children_quota') || 'Children Share (%)'}</label>
                                <input type="number" value={willChildrenQ} onChange={(e) => setWillChildrenQ(e.target.value)} placeholder="50" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>{t('label_other_heirs') || 'Other Heirs / Institutions'}</label>
                            <textarea value={willOthers} onChange={(e) => setWillOthers(e.target.value)} placeholder="..." style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: '8px', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn" onClick={() => setStep(1)}>Back</button>
                        <button className="btn" style={{ background: 'var(--accent-gold)', color: 'var(--bg-color)' }} onClick={() => setStep(3)}>Next Step</button>
                    </div>
                </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
                <div id="will-step-3" className="wizard-content-step active">
                    <div className="tool-section">
                        <h3>{t('subtitle_legacies') || '5.3 Specific Legacies'}</h3>
                        <div className="form-group">
                            <label>{t('label_legacy_desc') || 'Specific items or amounts to be left to individuals'}</label>
                            <textarea value={willLegacies} onChange={(e) => setWillLegacies(e.target.value)} placeholder={t('auto_e_g_my_watch_to') || 'e.g. My watch to my nephew Alex...'} style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn" onClick={() => setStep(2)}>Back</button>
                        <button className="btn" style={{ background: 'var(--accent-gold)', color: 'var(--bg-color)' }} onClick={() => setStep(4)}>Next Step</button>
                    </div>
                </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
                <div id="will-step-4" className="wizard-content-step active">
                    <div className="tool-section">
                        <h3>{t('subtitle_will_finish') || '5.4 Formality Checklist'}</h3>
                        <div className={`checklist-item ${willHandwritten ? 'checked' : ''}`} onClick={() => setWillHandwritten(!willHandwritten)}>
                            <input type="checkbox" checked={willHandwritten} readOnly style={{ display: 'none' }} />
                            <span>{t('check_handwritten') || 'I understand it must be handwritten'}</span>
                        </div>
                        <div className={`checklist-item ${willDated ? 'checked' : ''}`} onClick={() => setWillDated(!willDated)}>
                            <input type="checkbox" checked={willDated} readOnly style={{ display: 'none' }} />
                            <span>{t('check_dated') || 'I remember to date and sign'}</span>
                        </div>
                        <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '12px', borderLeft: '4px solid var(--accent-gold)' }}>
                            <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>"Your outline is ready. Please use this as a reference to write your final will by hand on physical paper."</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn" onClick={() => setStep(3)}>Back</button>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {!docSaved ? (
                                <button className="btn" style={{ background: 'transparent', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)' }} onClick={handleSaveToDocuments}>Save to Documents</button>
                            ) : (
                                <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>{'\u2713'} Saved to Documents</span>
                            )}
                            <button className="btn" style={{ background: 'var(--accent-gold)', color: 'var(--bg-color)' }} onClick={() => alert(t('auto_saved') || 'Saved!')}>Complete & Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WillBuilder;
