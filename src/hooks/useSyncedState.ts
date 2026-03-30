import { useState, useEffect, useRef, useCallback } from 'react';
import { apiFetch } from '../lib/api';

function useSyncedState<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    const [state, setState] = useState<T>(() => {
        try {
            const item = localStorage.getItem('readylegacy_' + key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            const item = localStorage.getItem('readylegacy_' + key);
            return item !== null ? (item as unknown as T) : initialValue;
        }
    });

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isAuthenticated = !!localStorage.getItem('readylegacy_token');

    // Sync to localStorage on every change
    useEffect(() => {
        localStorage.setItem('readylegacy_' + key, typeof state === 'string' ? state : JSON.stringify(state));
    }, [key, state]);

    // Fetch server value on mount if authenticated (skip in demo mode)
    useEffect(() => {
        if (!isAuthenticated || localStorage.getItem('readylegacy_demo_mode') === 'true') return;
        apiFetch<{ key: string; value: T | null }>(`/user-data?key=${encodeURIComponent(key)}`)
            .then(({ value }) => {
                if (value !== null && value !== undefined) {
                    setState(value);
                    localStorage.setItem('readylegacy_' + key, typeof value === 'string' ? value : JSON.stringify(value));
                }
            })
            .catch(() => {}); // Silently fall back to localStorage
    }, [key, isAuthenticated]);

    // Debounced write to server
    const setValueWithSync = useCallback((value: T | ((prev: T) => T)) => {
        setState(prev => {
            const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;

            if (isAuthenticated && localStorage.getItem('readylegacy_demo_mode') !== 'true') {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => {
                    apiFetch('/user-data', {
                        method: 'PUT',
                        body: JSON.stringify({ key, value: next }),
                    }).catch(() => {}); // Silently fail — localStorage is the source of truth
                }, 500);
            }

            return next;
        });
    }, [key, isAuthenticated]);

    return [state, setValueWithSync];
}

export default useSyncedState;
