import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, login, register } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    // Handle OAuth callback (token in URL from google-callback redirect)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userJson = params.get('user');
        const oauthError = params.get('error');

        if (oauthError) {
            setError(`Login failed: ${oauthError.replace(/_/g, ' ')}`);
            window.history.replaceState({}, '', '/login');
            return;
        }

        if (token && userJson) {
            try {
                const userData = JSON.parse(userJson);
                localStorage.setItem('readylegacy_token', token);
                localStorage.setItem('readylegacy_user', JSON.stringify(userData));
                window.history.replaceState({}, '', '/login');
                window.location.href = '/profile';
            } catch (e) {
                console.error('OAuth parse error:', e);
                setError('Failed to process login');
            }
            return;
        }
    }, []);

    useEffect(() => {
        if (user) navigate('/profile');
    }, [user, navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState('');

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
                        <button
                            onClick={() => { window.location.href = '/api/auth/google'; }}
                            style={{
                                width: '100%', padding: '10px 16px', borderRadius: '10px',
                                border: '1px solid rgba(66,133,244,0.3)', background: 'rgba(66,133,244,0.08)',
                                color: '#4285f4', cursor: 'pointer',
                                fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                            {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
                        </button>
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
