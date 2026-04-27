import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    plan: string;
    provider: string;
    picture?: string;
    mfaEnabled?: boolean;
}

interface MfaPending {
    challengeToken: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    mfaPending: MfaPending | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    verifyMfa: (challengeToken: string, code: string) => Promise<void>;
    cancelMfa: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

async function syncLocalStorageToServer() {
    if (localStorage.getItem('readylegacy_synced')) return;

    const items: { key: string; value: unknown }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i);
        if (!fullKey?.startsWith('readylegacy_')) continue;
        // Skip non-data keys
        if (['readylegacy_token', 'readylegacy_user', 'readylegacy_lang', 'readylegacy_theme', 'readylegacy_synced'].includes(fullKey)) continue;
        const key = fullKey.replace('readylegacy_', '');
        try {
            const raw = localStorage.getItem(fullKey);
            const value = raw ? JSON.parse(raw) : raw;
            items.push({ key, value });
        } catch {
            items.push({ key, value: localStorage.getItem(fullKey) });
        }
    }

    if (items.length > 0) {
        try {
            await apiFetch('/user-data/sync', {
                method: 'POST',
                body: JSON.stringify({ items }),
            });
        } catch (e) {
            console.error('Failed to sync localStorage to server:', e);
            return; // Don't mark as synced if it failed
        }
    }
    localStorage.setItem('readylegacy_synced', 'true');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [mfaPending, setMfaPending] = useState<MfaPending | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('readylegacy_token');
        if (!token) {
            setLoading(false);
            return;
        }
        apiFetch<{ user: User }>('/auth/me')
            .then(({ user: serverUser }) => {
                // Preserve picture from localStorage (set by Google OAuth callback) since DB doesn't store it
                const stored = localStorage.getItem('readylegacy_user');
                const picture = stored ? (JSON.parse(stored).picture || '') : '';
                const merged = { ...serverUser, picture };
                setUser(merged);
                localStorage.setItem('readylegacy_user', JSON.stringify(merged));
            })
            .catch(() => {
                localStorage.removeItem('readylegacy_token');
                localStorage.removeItem('readylegacy_user');
            })
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const data = await apiFetch<{ token?: string; user?: User; mfaRequired?: boolean; challengeToken?: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (data.mfaRequired && data.challengeToken) {
            setMfaPending({ challengeToken: data.challengeToken });
            return;
        }

        if (data.token && data.user) {
            localStorage.setItem('readylegacy_token', data.token);
            localStorage.setItem('readylegacy_user', JSON.stringify(data.user));
            setUser(data.user);
            syncLocalStorageToServer();
        }
    }, []);

    const verifyMfa = useCallback(async (challengeToken: string, code: string) => {
        const data = await apiFetch<{ token: string; user: User }>('/auth/mfa/verify', {
            method: 'POST',
            body: JSON.stringify({ challengeToken, code }),
        });
        localStorage.setItem('readylegacy_token', data.token);
        localStorage.setItem('readylegacy_user', JSON.stringify(data.user));
        setUser(data.user);
        setMfaPending(null);
        syncLocalStorageToServer();
    }, []);

    const cancelMfa = useCallback(() => {
        setMfaPending(null);
    }, []);

    const register = useCallback(async (email: string, password: string, name: string) => {
        const { token, user } = await apiFetch<{ token: string; user: User }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
        localStorage.setItem('readylegacy_token', token);
        localStorage.setItem('readylegacy_user', JSON.stringify(user));
        setUser(user);
        syncLocalStorageToServer();
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('readylegacy_token');
        localStorage.removeItem('readylegacy_user');
        localStorage.removeItem('readylegacy_synced');
        setUser(null);
        setMfaPending(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, mfaPending, login, register, verifyMfa, cancelMfa, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
