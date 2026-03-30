import React, { createContext, useContext, useState, useCallback } from 'react';
import { fillAllDemoData, clearAllToolData } from '../lib/demoData';

interface DemoContextType {
    demoMode: boolean;
    setDemoMode: (on: boolean) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemoMode = () => {
    const context = useContext(DemoContext);
    if (!context) throw new Error('useDemoMode must be used within a DemoProvider');
    return context;
};

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [demoMode, setDemoModeState] = useState<boolean>(() => {
        return localStorage.getItem('readylegacy_demo_mode') === 'true';
    });

    const setDemoMode = useCallback((on: boolean) => {
        if (on) {
            fillAllDemoData();
        } else {
            clearAllToolData();
        }
        localStorage.setItem('readylegacy_demo_mode', String(on));
        setDemoModeState(on);
    }, []);

    return (
        <DemoContext.Provider value={{ demoMode, setDemoMode }}>
            {children}
        </DemoContext.Provider>
    );
};
