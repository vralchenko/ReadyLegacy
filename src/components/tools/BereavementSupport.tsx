import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import usePersistedState from '../../hooks/usePersistedState';

// ─── Support Groups Data ──────────────────────────────────────────────────────
const SUPPORT_GROUPS = [
    { name: 'Verwaiste Eltern', region: 'Germany / Austria / CH', type: 'In-Person & Online', url: '#', desc: 'Support for parents who have lost a child.' },
    { name: 'Grief Share', region: 'International', type: 'Online', url: '#', desc: 'Grief recovery support groups and resources.' },
    { name: 'The Compassionate Friends', region: 'International', type: 'In-Person & Online', url: '#', desc: 'Supporting family members after the death of a child.' },
    { name: 'Caritas Grief Counseling', region: 'Austria / Germany', type: 'In-Person', url: '#', desc: 'Professional grief counseling services.' },
    { name: 'Online Grief Support', region: 'Global', type: 'Online', url: '#', desc: '24/7 forums and chat groups for those in grief.' },
];

// ─── AI Chat Widget ───────────────────────────────────────────────────────────
const QUICK_QUESTIONS = [
    'How do I fill in the legal forms?',
    'What happens to digital assets?',
    'How can I cope with grief?',
    'What is a Living Will?',
    'How to notify authorities?',
];

const BOT_RESPONSES: Record<string, string> = {
    'How do I fill in the legal forms?': 'Go to the **Legal Framework** section (section 02). You\'ll find Living Will and Advance Care Directive templates there. Each card walks you through what\'s needed.',
    'What happens to digital assets?': 'In the **Digital Legacy** section you can document your crypto wallets, exchange accounts, and other digital assets. It\'s important to leave access instructions securely.',
    'How can I cope with grief?': 'Grief is unique to every person. This **Bereavement Path** section has resources to help — from self-help guides to professional support groups. You\'re not alone.',
    'What is a Living Will?': 'A Living Will (Patientenverfügung) is a legal document where you specify your wishes regarding medical treatment if you become unable to make decisions yourself.',
    'How to notify authorities?': 'The **After Death Guide** (section 03) has a complete checklist. In the first week, you\'ll need to notify the civil registry, banks, insurers, and the employer.',
};

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    time: string;
}

const AIChatWidget: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: 'Hello! I\'m your Continuum assistant. I can help you navigate the platform, fill in forms, and answer questions about estate planning. What would you like to know?', time: formatTime() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    function formatTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg: ChatMessage = { sender: 'user', text, time: formatTime() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        setTimeout(() => {
            const response = BOT_RESPONSES[text] || 'Thank you for your question. This is a demonstration — in the full version, I\'ll be connected to a real AI to give you personalized guidance. For now, please explore the sections in the sidebar or choose a quick question below.';
            setMessages(prev => [...prev, { sender: 'bot', text: response, time: formatTime() }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div style={{
            position: 'fixed', bottom: '90px', right: '28px', width: '360px', maxHeight: '520px',
            background: 'rgba(18, 16, 28, 0.97)', border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            backdropFilter: 'blur(20px)'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px', background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.04))',
                borderBottom: '1px solid rgba(255,215,0,0.15)', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-gold), #c8941a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0
                }}>✦</div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Continuum Assistant</div>
                    <div style={{ fontSize: '0.72rem', color: '#6fcf97' }}>● Online</div>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end' }}>
                        {msg.sender === 'bot' && (
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-gold), #c8941a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>✦</div>
                        )}
                        <div style={{
                            maxWidth: '80%', padding: '10px 14px', borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            background: msg.sender === 'user' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.07)',
                            color: msg.sender === 'user' ? '#000' : 'var(--text-color)',
                            fontSize: '0.85rem', lineHeight: '1.5'
                        }}>
                            {msg.text}
                            <div style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '4px', textAlign: 'right' }}>{msg.time}</div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-gold), #c8941a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✦</div>
                        <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.07)', fontSize: '0.85rem' }}>
                            <span style={{ display: 'inline-flex', gap: '4px' }}>
                                {[0, 1, 2].map(i => (
                                    <span key={i} style={{
                                        width: '6px', height: '6px', borderRadius: '50%',
                                        background: 'rgba(255,215,0,0.6)',
                                        animation: `pulse-dot 1.2s ${i * 0.2}s infinite`
                                    }} />
                                ))}
                            </span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Quick questions */}
            <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {QUICK_QUESTIONS.slice(0, 3).map(q => (
                    <button key={q} onClick={() => sendMessage(q)} style={{
                        fontSize: '0.7rem', padding: '4px 10px', borderRadius: '12px',
                        border: '1px solid rgba(255,215,0,0.2)', background: 'rgba(255,215,0,0.05)',
                        color: 'rgba(255,215,0,0.8)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
                    }}>
                        {q}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px' }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                    placeholder={t('auto_ask_me_anything') || 'Ask me anything...'}
                    style={{
                        flex: 1, padding: '10px 14px', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-color)', fontSize: '0.85rem'
                    }}
                />
                <button
                    onClick={() => sendMessage(input)}
                    style={{
                        padding: '10px 16px', borderRadius: '12px', border: 'none',
                        background: 'var(--accent-gold)', color: '#000', cursor: 'pointer',
                        fontWeight: 700, fontSize: '0.85rem', transition: 'opacity 0.2s'
                    }}
                >↑</button>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const BereavementSupport: React.FC = () => {
    const { t } = useLanguage();
    const [checks, setChecks] = usePersistedState<Record<string, boolean>>('bereavement_checks', {});
    const [chatOpen, setChatOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'emotional' | 'groups'>('emotional');

    const toggle = (key: string) => setChecks({ ...checks, [key]: !checks[key] });

    const EMOTIONAL_ITEMS = [
        { key: 'ber_meaningful', label: 'Create meaningful moments together', section: 'Anticipatory Grief' },
        { key: 'ber_comm', label: 'Open heart communication', section: 'Anticipatory Grief' },
        { key: 'ber_prep', label: 'Emotional and spiritual preparation', section: 'Anticipatory Grief' },
        { key: 'ber_space', label: 'Create a dedicated space for grief and reflection', section: 'Emotional First Aid' },
        { key: 'ber_support', label: 'Reach out to a grief counselor or support group', section: 'Emotional First Aid' },
        { key: 'ber_selfcare', label: 'Prioritize self-care and basic physical needs', section: 'Emotional First Aid' },
        { key: 'ber_diary', label: 'Start a grief journal', section: 'Self-Help' },
        { key: 'ber_breath', label: 'Practice mindful breathing / meditation', section: 'Self-Help' },
        { key: 'ber_memory', label: 'Create a memory book or photo album', section: 'Self-Help' },
    ];

    const grouped = EMOTIONAL_ITEMS.reduce<Record<string, typeof EMOTIONAL_ITEMS>>((acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {});

    return (
        <div id="bereavement-support" className="tool-panel active">
            <div className="tool-header" style={{ marginBottom: '32px' }}>
                <span className="step-tag">{t('tag_bereavement') || 'Healing & Support'}</span>
                <h2>{t('title_bereavement') || 'Bereavement Path'}</h2>
                <p style={{ opacity: 0.7, marginTop: '12px' }}>
                    {t('desc_bereavement') || 'A supportive space for emotional healing, self-help resources, and connecting with others who understand.'}
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px' }}>
                {[
                    { key: 'emotional', label: '💛 Emotional Support' },
                    { key: 'groups', label: '🤝 Support Groups' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                            background: activeTab === tab.key ? 'rgba(255,215,0,0.15)' : 'transparent',
                            color: activeTab === tab.key ? 'var(--accent-gold)' : 'var(--text-muted)',
                            fontWeight: activeTab === tab.key ? 700 : 400, fontSize: '0.9rem', transition: 'all 0.2s'
                        }}
                    >{tab.label}</button>
                ))}
            </div>

            {/* Emotional Support Tab */}
            {activeTab === 'emotional' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {Object.entries(grouped).map(([section, items]) => (
                        <div key={section} className="step-card" style={{ padding: '20px' }}>
                            <h3 style={{ color: 'var(--accent-gold)', marginBottom: '16px', fontSize: '1rem' }}>{section}</h3>
                            {items.map(item => (
                                <div
                                    key={item.key}
                                    onClick={() => toggle(item.key)}
                                    style={{
                                        display: 'flex', gap: '12px', alignItems: 'center',
                                        padding: '10px', borderRadius: '8px', cursor: 'pointer',
                                        background: checks[item.key] ? 'rgba(255,215,0,0.05)' : 'transparent',
                                        marginBottom: '6px', transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                        border: checks[item.key] ? '2px solid var(--accent-gold)' : '2px solid rgba(255,255,255,0.25)',
                                        background: checks[item.key] ? 'var(--accent-gold)' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                    }}>
                                        {checks[item.key] && <span style={{ color: '#000', fontSize: '11px', fontWeight: 'bold' }}>✓</span>}
                                    </div>
                                    <span style={{ opacity: checks[item.key] ? 0.4 : 1, textDecoration: checks[item.key] ? 'line-through' : 'none', fontSize: '0.9rem' }}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Support Groups Tab */}
            {activeTab === 'groups' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '8px' }}>
                        Connecting with others who understand your experience can be profoundly healing. Here are verified support groups:
                    </p>
                    {SUPPORT_GROUPS.map((group, i) => (
                        <div key={i} style={{
                            padding: '18px 20px', borderRadius: '12px',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                            transition: 'border-color 0.2s'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>{group.name}</h4>
                                <span style={{
                                    fontSize: '0.72rem', padding: '3px 10px', borderRadius: '12px',
                                    background: group.type === 'Online' ? 'rgba(100,200,255,0.1)' : 'rgba(255,215,0,0.1)',
                                    color: group.type === 'Online' ? '#64c8ff' : 'var(--accent-gold)',
                                    border: `1px solid ${group.type === 'Online' ? 'rgba(100,200,255,0.2)' : 'rgba(255,215,0,0.2)'}`,
                                    flexShrink: 0
                                }}>
                                    {group.type}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', opacity: 0.65, margin: '0 0 10px' }}>{group.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.78rem', opacity: 0.45 }}>📍 {group.region}</span>
                                <a href={group.url} className="btn" style={{ fontSize: '0.75rem', padding: '6px 16px', borderRadius: '8px' }}>
                                    Learn More
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Connect with Specialist / AI Chat CTA */}
            <div style={{
                marginTop: '36px', padding: '28px', background: 'linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,215,0,0.02))',
                borderRadius: '16px', border: '1px solid rgba(255,215,0,0.15)', textAlign: 'center'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✦</div>
                <h3 style={{ marginBottom: '12px' }}>Connect with a Specialist</h3>
                <p style={{ marginBottom: '24px', opacity: 0.65, maxWidth: '360px', margin: '0 auto 24px' }}>
                    Our AI assistant is available 24/7 to help you navigate the platform, answer questions about estate planning, or simply listen.
                </p>
                <button
                    className="btn"
                    onClick={() => setChatOpen(true)}
                    style={{ background: 'var(--accent-gold)', color: '#000', fontWeight: 700, padding: '14px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
                >
                    💬 Open Chat Assistant
                </button>
            </div>

            {/* AI Chat Widget */}
            {chatOpen && <AIChatWidget onClose={() => setChatOpen(false)} />}

            {/* Floating chat button (always visible when chat is closed) */}
            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    style={{
                        position: 'fixed', bottom: '28px', right: '28px',
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-gold), #c8941a)',
                        border: 'none', cursor: 'pointer', fontSize: '1.4rem',
                        boxShadow: '0 6px 24px rgba(255,215,0,0.3)', zIndex: 9998,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    title={t('auto_open_ai_chat_as') || 'Open AI Chat Assistant'}
                >
                    💬
                </button>
            )}

            <style>{`
                @keyframes pulse-dot {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `}</style>
        </div>
    );
};

export default BereavementSupport;
