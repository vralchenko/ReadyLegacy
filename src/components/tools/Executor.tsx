import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDemoMode } from '../../context/DemoContext';
import { DEMO_TASKS, fillDemoTasks } from '../../lib/demoData';
import usePersistedState from '../../hooks/useSyncedState';
import { saveToDocuments } from '../../lib/saveDocument';

interface Task {
    id: string;
    text: string;
    category: string;
    done: boolean;
    createdAt: string;
}

const CATEGORIES = ['Legal', 'Financial', 'Family', 'Documents', 'Other'] as const;
const CATEGORY_KEYS: Record<string, string> = {
    Legal: 'exec_cat_legal',
    Financial: 'exec_cat_financial',
    Family: 'exec_cat_family',
    Documents: 'exec_cat_documents',
    Other: 'exec_cat_other',
};

const Executor: React.FC = () => {
    const { t } = useLanguage();
    const [tasks, setTasks] = usePersistedState<Task[]>('todo_tasks', []);
    const [newText, setNewText] = useState('');
    const [newCategory, setNewCategory] = useState('Legal');
    const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
    const [docSaved, setDocSaved] = useState(false);
    const { demoMode } = useDemoMode();

    useEffect(() => {
        if (demoMode) {
            setTasks(DEMO_TASKS());
        }
    }, [demoMode]);

    const handleSaveToDocuments = async () => {
        try {
            const date = new Date().toLocaleDateString();
            await saveToDocuments(
                `Executor Tasks — ${date}`,
                'Executor Tasks',
                '\u2705',
                { tasks: tasks.map(({ text, category, done, createdAt }) => ({ text, category, done, createdAt })) }
            );
            setDocSaved(true);
        } catch {
            alert('Failed to save to Documents');
        }
    };

    const addTask = () => {
        if (!newText.trim()) return;
        const task: Task = {
            id: Date.now().toString(),
            text: newText.trim(),
            category: newCategory,
            done: false,
            createdAt: new Date().toLocaleDateString(),
        };
        setTasks([task, ...tasks]);
        setNewText('');
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const filtered = tasks.filter(t => {
        if (filter === 'open') return !t.done;
        if (filter === 'done') return t.done;
        return true;
    });

    const doneCount = tasks.filter(t => t.done).length;
    const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

    return (
        <div id="executor" className="tool-panel active">
            <div className="tool-header" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontWeight: 700 }}>{t('tag_executor') || 'Task Management'}</h2>
                <p style={{ opacity: 0.7, marginTop: '12px' }}>
                    {t('desc_executor') || 'Track all tasks that need to be completed before and after — organized, clear, and persistent.'}
                </p>
                <button onClick={() => { fillDemoTasks(); window.location.reload(); }} style={{ marginTop: '12px', padding: '6px 14px', borderRadius: '8px', border: '1px solid #10b981', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>⚡ Fill Demo Data</button>
            </div>

            {/* Progress bar */}
            {tasks.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
                        <span>{(t('exec_completed') || '{done} of {total} completed').replace('{done}', String(doneCount)).replace('{total}', String(tasks.length))}</span>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {!docSaved ? (
                                <button className="btn" style={{ background: 'transparent', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', padding: '4px 14px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, opacity: 1 }} onClick={handleSaveToDocuments}>Save to Documents</button>
                            ) : (
                                <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>{'\u2713'} Saved</span>
                            )}
                            <span>{progress}%</span>
                        </div>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', background: 'var(--glass-bg)', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, var(--accent-gold), #f0c040)',
                            borderRadius: '3px',
                            transition: 'width 0.4s ease'
                        }} />
                    </div>
                </div>
            )}

            {/* Add task */}
            <div className="step-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        value={newText}
                        onChange={e => setNewText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTask()}
                        placeholder={t('auto_add_a_new_task') || 'Add a new task...'}
                        style={{ flex: '2', minWidth: '200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)', fontSize: '0.95rem' }}
                    />
                    <select
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        style={{ flex: '1', minWidth: '120px', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-color)' }}
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{t(CATEGORY_KEYS[c]) || c}</option>)}
                    </select>
                    <button
                        className="btn"
                        onClick={addTask}
                        style={{ background: 'var(--accent-gold)', color: 'var(--bg-color)', fontWeight: 700, padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                    >
                        {t('exec_add') || '+ Add'}
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {(['all', 'open', 'done'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '6px 18px',
                            borderRadius: '20px',
                            border: '1px solid var(--glass-border)',
                            background: filter === f ? 'var(--accent-gold)' : 'transparent',
                            color: filter === f ? 'var(--bg-color)' : 'var(--text-color)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontWeight: filter === f ? 700 : 400,
                            transition: 'all 0.2s'
                        }}
                    >
                        {f === 'all' ? (t('exec_all') || 'All') : f === 'open' ? (t('exec_open') || 'Open') : (t('exec_done') || 'Done')}
                    </button>
                ))}
            </div>

            {/* Task list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        {tasks.length === 0 ? (t('exec_empty') || 'No tasks yet. Add your first task above.') : (t('exec_no_filter') || 'No tasks in this filter.')}
                    </div>
                )}
                {filtered.map(task => (
                    <div
                        key={task.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '14px 18px',
                            background: task.done ? 'var(--glass-bg)' : 'var(--glass-bg)',
                            borderRadius: '10px',
                            border: '1px solid var(--glass-border)',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                        }}
                        onClick={() => toggleTask(task.id)}
                    >
                        <div style={{
                            width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                            border: task.done ? '2px solid var(--accent-gold)' : '2px solid var(--text-muted)',
                            background: task.done ? 'var(--accent-gold)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}>
                            {task.done && <span style={{ color: '#000', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                            <span style={{
                                textDecoration: task.done ? 'line-through' : 'none',
                                opacity: task.done ? 0.4 : 1,
                                fontSize: '0.95rem'
                            }}>
                                {task.text}
                            </span>
                        </div>
                        <span style={{
                            fontSize: '0.72rem',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: 'rgba(255,215,0,0.1)',
                            color: 'var(--accent-gold)',
                            border: '1px solid rgba(255,215,0,0.2)',
                            flexShrink: 0
                        }}>
                            {t(CATEGORY_KEYS[task.category]) || task.category}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>{task.createdAt}</span>
                        <button
                            onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                            style={{ background: 'none', border: 'none', color: 'rgba(255,100,100,0.6)', fontSize: '1.1rem', cursor: 'pointer', padding: '0 4px', flexShrink: 0, transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#ff4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,100,100,0.6)')}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Executor;
