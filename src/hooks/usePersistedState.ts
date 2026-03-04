import { useState, useEffect } from 'react';

function usePersistedState<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    const [state, setState] = useState<T>(() => {
        try {
            const item = localStorage.getItem('continuum_' + key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // Fallback for non-JSON values (legacy string support)
            const item = localStorage.getItem('continuum_' + key);
            return item !== null ? (item as unknown as T) : initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem('continuum_' + key, typeof state === 'string' ? state : JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}

export default usePersistedState;
