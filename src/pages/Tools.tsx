import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import Sidebar from '../components/tools/Sidebar';
import AssetOverview from '../components/tools/AssetOverview';
import LegalDocs from '../components/tools/LegalDocs';
import DeathChecklist from '../components/tools/DeathChecklist';
import Executor from '../components/tools/Executor';
import WillBuilder from '../components/tools/WillBuilder';
import Templates from '../components/tools/Templates';
import BereavementSupport from '../components/tools/BereavementSupport';
import LeaveBehind from '../components/tools/LeaveBehind';
import Reminders from '../components/tools/Reminders';
import AIAvatar from '../components/tools/AIAvatar';

const Tools: React.FC = () => {
    const isLoggedIn = !!localStorage.getItem('continuum_user');
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTool = searchParams.get('tool') || 'asset-overview';
    const [activeTool, setActiveTool] = useState(initialTool);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        const tool = searchParams.get('tool');
        if (tool) {
            setActiveTool(tool);
        }
    }, [searchParams]);

    const handleSelectTool = (tool: string) => {
        setActiveTool(tool);
        setSearchParams({ tool });
    };

    const renderTool = () => {
        switch (activeTool) {
            case 'asset-overview': return <AssetOverview />;
            case 'legal-docs': return <LegalDocs />;
            case 'death-checklist': return <DeathChecklist />;
            case 'executor': return <Executor />;
            case 'will-builder': return <WillBuilder />;
            case 'templates': return <Templates />;
            case 'bereavement-support': return <BereavementSupport />;
            case 'leave-behind': return <LeaveBehind />;
            case 'reminders': return <Reminders />;
            case 'ai-avatar': return <AIAvatar />;
            default: return <AssetOverview />;
        }
    };

    return (
        <div className="tools-layout">
            <Sidebar activeTool={activeTool} onSelectTool={handleSelectTool} />
            <div className="tools-content">
                {renderTool()}
            </div>
        </div>
    );
};

export default Tools;
