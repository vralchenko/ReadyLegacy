import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiFetch } from '../lib/api';

type MfaStep = 'idle' | 'loading' | 'scan' | 'verify' | 'done' | 'disable';

const MfaSetup: React.FC = () => {
    const { t } = useLanguage();
    const [step, setStep] = useState<MfaStep>('loading');
    const [enabled, setEnabled] = useState(false);
    const [backupCodesRemaining, setBackupCodesRemaining] = useState(0);
    const [uri, setUri] = useState('');
    const [secret, setSecret] = useState('');
    const [code, setCode] = useState('');
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState('');

    // Load MFA status on mount
    useEffect(() => {
        apiFetch<{ enabled: boolean; backupCodesRemaining: number }>('/auth/mfa/status')
            .then(data => {
                setEnabled(data.enabled);
                setBackupCodesRemaining(data.backupCodesRemaining);
                setStep('idle');
            })
            .catch(() => setStep('idle'));
    }, []);

    const startSetup = async () => {
        setError('');
        setStep('loading');
        try {
            const data = await apiFetch<{ uri: string; secret: string }>('/auth/mfa/setup', { method: 'POST' });
            setUri(data.uri);
            setSecret(data.secret);
            // Generate QR code client-side
            const QRCode = await import('qrcode');
            const dataUrl = await QRCode.toDataURL(data.uri, { width: 200, margin: 2 });
            setQrDataUrl(dataUrl);
            setStep('scan');
        } catch (err: any) {
            setError(err.message);
            setStep('idle');
        }
    };

    const verifySetup = async () => {
        if (code.length !== 6) { setError(t('mfa_enter_6_digit') || 'Enter the 6-digit code from your authenticator app'); return; }
        setError('');
        try {
            const data = await apiFetch<{ ok: boolean; backupCodes: string[] }>('/auth/mfa/verify-setup', {
                method: 'POST',
                body: JSON.stringify({ code }),
            });
            setBackupCodes(data.backupCodes);
            setEnabled(true);
            setBackupCodesRemaining(data.backupCodes.length);
            setStep('done');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const disableMfa = async () => {
        if (code.length !== 6) { setError(t('mfa_enter_6_digit') || 'Enter the 6-digit code from your authenticator app'); return; }
        setError('');
        try {
            await apiFetch('/auth/mfa/disable', {
                method: 'POST',
                body: JSON.stringify({ code }),
            });
            setEnabled(false);
            setBackupCodesRemaining(0);
            setCode('');
            setStep('idle');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const regenerateBackupCodes = async () => {
        if (code.length !== 6) { setError(t('mfa_enter_6_digit') || 'Enter code first'); return; }
        setError('');
        try {
            const data = await apiFetch<{ backupCodes: string[] }>('/auth/mfa/backup-codes', {
                method: 'POST',
                body: JSON.stringify({ code }),
            });
            setBackupCodes(data.backupCodes);
            setBackupCodesRemaining(data.backupCodes.length);
            setCode('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box' as const, fontSize: '1.1rem', textAlign: 'center' as const, letterSpacing: '4px', fontWeight: 700 };
    const btnPrimary = { padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--accent-gold)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' };
    const btnSecondary = { padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' };

    if (step === 'loading') {
        return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>{t('mfa_loading') || 'Loading...'}</div>;
    }

    // Idle state — show enable/disable
    if (step === 'idle') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t('mfa_title') || 'Two-Factor Authentication'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {enabled
                                ? `${t('mfa_enabled_desc') || 'MFA is enabled.'} ${backupCodesRemaining} ${t('mfa_backup_remaining') || 'backup codes remaining.'}`
                                : (t('mfa_disabled_desc') || 'Add an extra layer of security to your account.')}
                        </div>
                    </div>
                    <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700,
                        background: enabled ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
                        color: enabled ? '#10b981' : '#ef4444',
                        border: `1px solid ${enabled ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)'}`,
                    }}>
                        {enabled ? (t('mfa_on') || 'ON') : (t('mfa_off') || 'OFF')}
                    </span>
                </div>
                {enabled ? (
                    <button onClick={() => { setCode(''); setStep('disable'); }} style={{ ...btnSecondary, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                        {t('mfa_disable') || 'Disable MFA'}
                    </button>
                ) : (
                    <button onClick={startSetup} style={btnPrimary}>
                        {t('mfa_enable') || 'Enable MFA'}
                    </button>
                )}
            </div>
        );
    }

    // QR Scan step
    if (step === 'scan') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t('mfa_scan_title') || 'Scan QR Code'}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    {t('mfa_scan_desc') || 'Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code.'}
                </p>
                <div style={{ textAlign: 'center', padding: '16px', background: '#fff', borderRadius: '12px', width: 'fit-content', margin: '0 auto' }}>
                    {qrDataUrl && <img src={qrDataUrl} alt="MFA QR Code" style={{ width: '200px', height: '200px' }} />}
                </div>
                <details style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <summary style={{ cursor: 'pointer' }}>{t('mfa_manual_entry') || 'Can\'t scan? Enter manually'}</summary>
                    <code style={{ display: 'block', marginTop: '8px', padding: '8px', background: 'var(--glass-bg)', borderRadius: '6px', wordBreak: 'break-all', fontSize: '0.75rem' }}>
                        {secret}
                    </code>
                </details>
                <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                        {t('mfa_enter_code') || 'Enter the 6-digit code from your app'}
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={code}
                        onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        style={inputStyle}
                        autoFocus
                    />
                </div>
                {error && <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.78rem' }}>{error}</div>}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setStep('idle'); setCode(''); setError(''); }} style={btnSecondary}>{t('profile_cancel') || 'Cancel'}</button>
                    <button onClick={verifySetup} style={btnPrimary}>{t('mfa_verify') || 'Verify & Enable'}</button>
                </div>
            </div>
        );
    }

    // Done — show backup codes
    if (step === 'done') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#10b981' }}>{t('mfa_success') || 'MFA Enabled Successfully!'}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    {t('mfa_backup_save') || 'Save these backup codes in a safe place. Each code can only be used once.'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', padding: '12px', background: 'var(--glass-bg)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                    {backupCodes.map((c, i) => (
                        <code key={i} style={{ padding: '6px 10px', background: 'var(--secondary-bg)', borderRadius: '6px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px' }}>
                            {c}
                        </code>
                    ))}
                </div>
                <button onClick={() => { setStep('idle'); setCode(''); setBackupCodes([]); }} style={btnPrimary}>{t('mfa_done') || 'Done'}</button>
            </div>
        );
    }

    // Disable step
    if (step === 'disable') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t('mfa_disable_title') || 'Disable MFA'}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    {t('mfa_disable_desc') || 'Enter a code from your authenticator app to disable MFA.'}
                </p>
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    style={inputStyle}
                    autoFocus
                />
                {error && <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.78rem' }}>{error}</div>}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setStep('idle'); setCode(''); setError(''); }} style={btnSecondary}>{t('profile_cancel') || 'Cancel'}</button>
                    <button onClick={disableMfa} style={{ ...btnPrimary, background: '#ef4444' }}>{t('mfa_disable_confirm') || 'Disable MFA'}</button>
                </div>
            </div>
        );
    }

    return null;
};

export default MfaSetup;
