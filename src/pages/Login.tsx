import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { user, login, register } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    useEffect(() => {
        if (user) navigate('/profile');
    }, [user, navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState('');

    const OAUTH_PROVIDERS = [
        { id: 'google', name: 'Google', icon: '🔵', color: '#4285f4', bg: 'rgba(66,133,244,0.08)', border: 'rgba(66,133,244,0.2)' },
        { id: 'apple', name: 'Apple', icon: '⬛', color: 'var(--text-color)', bg: 'var(--glass-bg)', border: 'var(--glass-border)' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError(t('login_error_fields') || 'Please fill in all required fields.'); return; }
        if (mode === 'signup' && password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading('email');
        setError('');
        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                await register(email, password, name || 'User');
            }
            navigate('/profile');
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '0', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px', marginTop: '-20px' }}>
            <div style={{ width: '100%', maxWidth: '380px' }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--accent-gold)', letterSpacing: '1px', textDecoration: 'none' }}>
                        Ready Legacy
                    </Link>
                    <p style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '2px' }}>Digital estate planning platform</p>
                </div>

                <div style={{
                    background: 'var(--glass-bg)', borderRadius: '20px',
                    border: '1px solid var(--glass-border)', padding: '16px 20px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <div style={{ display: 'flex', background: 'var(--glass-bg)', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
                        {(['login', 'signup'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setError(''); }}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                    background: mode === m ? 'rgba(255,215,0,0.12)' : 'transparent',
                                    color: mode === m ? 'var(--accent-gold)' : 'var(--text-muted)',
                                    fontWeight: mode === m ? 700 : 400, fontSize: '0.9rem', transition: 'all 0.2s'
                                }}
                            >
                                {m === 'login' ? (t('login_signin') || 'Sign In') : (t('login_create') || 'Create Account')}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                        {OAUTH_PROVIDERS.map(p => (
                            <button
                                key={p.id}
                                disabled={true}
                                style={{
                                    width: '100%', padding: '8px 16px', borderRadius: '10px',
                                    border: `1px solid ${p.border}`, background: p.bg,
                                    color: p.color, cursor: 'not-allowed',
                                    fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    opacity: 0.5
                                }}
                            >
                                <span>{p.icon}</span>
                                {p.name} — Coming soon
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('login_or_email') || 'or with email'}</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {mode === 'signup' && (
                            <div>
                                <label style={{ fontSize: '0.78rem', opacity: 0.8, display: 'block', marginBottom: '4px' }}>{t('login_fullname') || 'Full Name'}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder={t('auto_your_name') || 'Your name'}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box', fontSize: '0.85rem' }}
                                />
                            </div>
                        )}
                        <div>
                            <label style={{ fontSize: '0.78rem', opacity: 0.8, display: 'block', marginBottom: '4px' }}>{t('login_email') || 'Email'} *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder={t('auto_your_email_com') || 'your@email.com'}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box', fontSize: '0.85rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.78rem', opacity: 0.8, display: 'block', marginBottom: '4px' }}>{t('login_password') || 'Password'} *</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', boxSizing: 'border-box', fontSize: '0.85rem' }}
                            />
                        </div>

                        {error && (
                            <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.78rem' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading !== null}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '10px', border: 'none',
                                background: 'var(--accent-gold)', color: '#fff', fontWeight: 700,
                                fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s', opacity: loading ? 0.7 : 1, marginTop: '2px'
                            }}
                        >
                            {loading === 'email' ? (t('login_processing') || 'Processing...') : mode === 'login' ? (t('login_signin') || 'Sign In') : (t('login_create') || 'Create Account')}
                        </button>
                    </form>

                    {mode === 'login' && (
                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <a href="#" style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', opacity: 0.7 }}>{t('login_forgot') || 'Forgot password?'}</a>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '24px', opacity: 0.3, fontSize: '0.78rem' }}>
                    {t('login_security_note') || 'Your data is encrypted and stored securely.'}
                </div>

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', opacity: 0.6 }}>{t('back_home') || '← Back to Home'}</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
