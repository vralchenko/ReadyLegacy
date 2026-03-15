import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Login: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    useEffect(() => {
        if (localStorage.getItem('continuum_user')) {
            navigate('/profile');
        }
    }, [navigate]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleOAuth = (provider: string) => {
        setLoading(provider);
        setError('');
        // Demo: simulate successful OAuth redirect
        setTimeout(() => {
            setLoading(null);
            localStorage.setItem('continuum_user', JSON.stringify({
                name: provider === 'apple' ? 'Apple User' : 'Google User',
                email: `demo_${provider}@example.com`,
                provider
            }));
            window.location.href = '/profile';
        }, 1500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError('Please fill in all required fields.'); return; }
        setLoading('email');
        setError('');
        // Demo: simulate successful email login
        setTimeout(() => {
            setLoading(null);
            localStorage.setItem('continuum_user', JSON.stringify({
                name: name || 'User',
                email: email,
                provider: 'email'
            }));
            window.location.href = '/profile';
        }, 1200);
    };

    const OAUTH_PROVIDERS = [
        { id: 'google', name: 'Google', icon: '🔵', color: '#4285f4', bg: 'rgba(66,133,244,0.08)', border: 'rgba(66,133,244,0.2)' },
        { id: 'facebook', name: 'Facebook', icon: '🔷', color: '#1877f2', bg: 'rgba(24,119,242,0.08)', border: 'rgba(24,119,242,0.2)' },
        { id: 'apple', name: 'Apple', icon: '⬛', color: '#ffffff', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.15)' },
    ];

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '0', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px', marginTop: '-20px' }}>
            <div style={{ width: '100%', maxWidth: '380px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--accent-gold)', letterSpacing: '1px', textDecoration: 'none' }}>
                        Ready Legacy
                    </Link>
                    <p style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '2px' }}>The Future of Legacy</p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px',
                    backdropFilter: 'blur(20px)'
                }}>
                    {/* Mode toggle */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', marginBottom: '16px' }}>
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
                                {m === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        ))}
                    </div>

                    {/* OAuth Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                        {OAUTH_PROVIDERS.map(p => (
                            <button
                                key={p.id}
                                onClick={() => handleOAuth(p.id)}
                                disabled={loading !== null}
                                style={{
                                    width: '100%', padding: '8px 16px', borderRadius: '10px',
                                    border: `1px solid ${p.border}`, background: p.bg,
                                    color: p.color, cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    opacity: loading && loading !== p.id ? 0.4 : 1
                                }}
                            >
                                {loading === p.id ? (
                                    <span style={{ opacity: 0.7 }}>Connecting...</span>
                                ) : (
                                    <>
                                        <span>{p.icon}</span>
                                        {mode === 'login' ? 'Continue with' : 'Sign up with'} {p.name}
                                    </>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                        <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>or with email</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                    </div>

                    {/* Email form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {mode === 'signup' && (
                            <div>
                                <label style={{ fontSize: '0.78rem', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder={t('auto_your_name') || 'Your name'}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', boxSizing: 'border-box', fontSize: '0.85rem' }}
                                />
                            </div>
                        )}
                        <div>
                            <label style={{ fontSize: '0.78rem', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Email *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder={t('auto_your_email_com') || 'your@email.com'}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', boxSizing: 'border-box', fontSize: '0.85rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.78rem', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Password *</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#fff', boxSizing: 'border-box', fontSize: '0.85rem' }}
                            />
                        </div>

                        {error && (
                            <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '0.78rem' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading !== null}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '10px', border: 'none',
                                background: 'var(--accent-gold)', color: '#000', fontWeight: 700,
                                fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s', opacity: loading ? 0.7 : 1, marginTop: '2px'
                            }}
                        >
                            {loading === 'email' ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    {mode === 'login' && (
                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <a href="#" style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', opacity: 0.7 }}>Forgot password?</a>
                        </div>
                    )}
                </div>

                {/* Security note */}
                <div style={{ textAlign: 'center', marginTop: '24px', opacity: 0.3, fontSize: '0.78rem' }}>
                    🔒 Your data is encrypted and stored securely.
                </div>

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', opacity: 0.6 }}>← Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
