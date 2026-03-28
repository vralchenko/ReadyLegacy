import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePersistedState from '../../hooks/useSyncedState';

interface AvatarState {
    status: 'none' | 'processing' | 'ready';
    progress: number;
    lastUpdated: string;
    features: string[];
}

const AIAvatar: React.FC = () => {
    const [avatar, setAvatar] = usePersistedState<AvatarState>('ai_avatar_state', {
        status: 'none',
        progress: 0,
        lastUpdated: '',
        features: []
    });

    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationLog, setSimulationLog] = useState<string[]>([]);

    const startSimulation = () => {
        setIsSimulating(true);
        setAvatar({ ...avatar, status: 'processing', progress: 0 });
        setSimulationLog(['Starting neural network initialization...', 'Analyzing personal profile data...']);
    };

    useEffect(() => {
        let timer: any;
        if (isSimulating && avatar.progress < 100) {
            timer = setTimeout(() => {
                const nextProgress = avatar.progress + Math.floor(Math.random() * 15) + 5;
                const logs = [
                    'Extracting voice patterns from Digital Legacy audio...',
                    'Mapping facial features from uploaded photos...',
                    'Calibrating linguistic style from personal notes...',
                    'Generating semantic knowledge graph...',
                    'Synthesizing emotional response model...',
                    'Finalizing digital twin structure...',
                ];

                const currentLog = logs[Math.floor((avatar.progress / 100) * logs.length)];
                if (currentLog && !simulationLog.includes(currentLog)) {
                    setSimulationLog(prev => [currentLog, ...prev].slice(0, 5));
                }

                if (nextProgress >= 100) {
                    setAvatar({
                        status: 'ready',
                        progress: 100,
                        lastUpdated: new Date().toLocaleString(),
                        features: ['Voice Synthesis', 'Facial Animation', 'Knowledge Retrieval', 'Emotional Intelligence']
                    });
                    setIsSimulating(false);
                } else {
                    setAvatar({ ...avatar, progress: nextProgress });
                }
            }, 800);
        }
        return () => clearTimeout(timer);
    }, [isSimulating, avatar.progress]);

    return (
        <div id="ai-avatar" className="tool-panel active" style={{ maxWidth: '900px' }}>
            <div className="tool-header" style={{ marginBottom: '32px' }}>
                <span className="step-tag">Future Legacy</span>
                <h2>AI Avatar (Digital Twin)</h2>
                <p style={{ opacity: 0.7, marginTop: '12px', lineHeight: '1.6' }}>
                    Create a conscious digital version of yourself. Your AI Avatar uses your messages, voice recordings, and values to interact with future generations, preserving your essence and wisdom forever.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>

                {/* Main Interaction Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Visual Preview */}
                    <div style={{
                        height: '340px', background: 'rgba(0,0,0,0.3)', borderRadius: '20px',
                        border: '1px solid var(--glass-border)', position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', backdropFilter: 'blur(5px)'
                    }}>
                        {avatar.status === 'none' && (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.2 }}>👤</div>
                                <h3 style={{ marginBottom: '10px' }}>No Avatar Generated</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Provide your data in the Legacy sections to start training your digital twin.</p>
                                <button className="btn" onClick={startSimulation} style={{ background: 'var(--accent-gold)', color: '#000', fontWeight: 700 }}>
                                    Begin Training (Beta)
                                </button>
                            </div>
                        )}

                        {avatar.status === 'processing' && (
                            <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>
                                <div style={{
                                    width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 24px',
                                    border: '4px solid rgba(251,191,36,0.1)', borderTopColor: 'var(--accent-gold)',
                                    animation: 'spin 2s linear infinite', position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute', inset: '10px', borderRadius: '50%',
                                        border: '4px solid rgba(167,139,250,0.1)', borderBottomColor: '#a78bfa',
                                        animation: 'spin 3s linear infinite reverse'
                                    }} />
                                </div>
                                <h3 style={{ marginBottom: '8px' }}>Training Artificial Consciousness...</h3>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '16px' }}>{avatar.progress}%</div>
                                <div style={{ height: '4px', width: '200px', background: 'var(--glass-bg)', margin: '0 auto', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${avatar.progress}%`, background: 'var(--accent-gold)', transition: 'width 0.3s ease' }} />
                                </div>
                            </div>
                        )}

                        {avatar.status === 'ready' && (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{
                                    width: '160px', height: '160px', borderRadius: '50%', marginBottom: '20px',
                                    background: 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)',
                                    border: '1px solid rgba(251,191,36,0.3)', position: 'relative',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.3))' }}>🤖</div>
                                    <div style={{
                                        position: 'absolute', bottom: '-5px', right: '10px',
                                        background: '#10b981', width: '24px', height: '24px',
                                        borderRadius: '50%', border: '4px solid #06090e'
                                    }} />
                                </div>
                                <h3 style={{ color: 'var(--accent-gold)' }}>Your Digital Twin is Reactive</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Synchronized: {avatar.lastUpdated}</p>
                                <button className="btn" style={{ marginTop: '20px', border: '1px solid var(--glass-border)', background: 'transparent' }}>
                                    💬 Talk to My Avatar
                                </button>
                            </div>
                        )}

                        <style>{`
                            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                        `}</style>
                    </div>

                    {/* Simulation Log */}
                    {isSimulating && (
                        <div style={{
                            padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px',
                            border: '1px solid var(--glass-bg)', fontFamily: 'monospace', fontSize: '0.8rem'
                        }}>
                            {simulationLog.map((log, i) => (
                                <div key={i} style={{ color: i === 0 ? 'var(--accent-gold)' : 'var(--text-muted)', lineHeight: '1.8' }}>
                                    {i === 0 ? '►' : '  '} {log}
                                </div>
                            ))}
                        </div>
                    )}

                    {avatar.status === 'ready' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ padding: '20px', background: 'rgba(255,215,0,0.03)', border: '1px solid rgba(251,191,36,0.1)', borderRadius: '16px' }}>
                                <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--accent-gold)' }}>Core Personality</h4>
                                <ul style={{ fontSize: '0.8rem', opacity: 0.7, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <li>Linguistic style analysis complete</li>
                                    <li>Key life philosophies mapped</li>
                                    <li>Humor & Tone calibration active</li>
                                </ul>
                            </div>
                            <div style={{ padding: '20px', background: 'rgba(167,139,250,0.03)', border: '1px solid rgba(167,139,250,0.1)', borderRadius: '16px' }}>
                                <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: '#a78bfa' }}>Interaction Hub</h4>
                                <ul style={{ fontSize: '0.8rem', opacity: 0.7, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <li>Voice synthesis (98% match)</li>
                                    <li>Visual presence sync</li>
                                    <li>Legacy document queries active</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '24px', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                        <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>How it works</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <span style={{ fontSize: '1.2rem' }}>📝</span>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Data Source</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uses your "Digital Legacy" texts and "Personal Notes".</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <span style={{ fontSize: '1.2rem' }}>🎙️</span>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Voice Print</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simulated from uploaded audio memories.</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <span style={{ fontSize: '1.2rem' }}>🧠</span>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Knowledge Base</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your answers in "Asset Overview" and "Will Structure".</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '24px', background: 'rgba(255,215,0,0.05)', borderRadius: '20px', border: '1px dashed rgba(251,191,36,0.2)' }}>
                        <h4 style={{ marginBottom: '8px', fontSize: '1rem', color: 'var(--accent-gold)' }}>Beta Access</h4>
                        <p style={{ fontSize: '0.75rem', opacity: 0.7, lineHeight: '1.5', marginBottom: '16px' }}>
                            Avatar creation is currently in private beta. High-fidelity rendering requires Premium Plan.
                        </p>
                        <Link to="/profile#plan" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--accent-gold)', background: 'transparent', color: 'var(--accent-gold)', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'none' }}>
                            Upgrade Plan →
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AIAvatar;
