import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import usePersistedState from '../../hooks/usePersistedState';

interface Task {
    id: string;
    text: string;
    category: string;
    done: boolean;
    createdAt: string;
}

const CATEGORIES = ['Legal', 'Financial', 'Family', 'Documents', 'Other'];

const Executor: React.FC = () => {
    const { t } = useLanguage();
    const [tasks, setTasks] = usePersistedState<Task[]>('todo_tasks', []);
    const [newText, setNewText] = useState('');
    const [newCategory, setNewCategory] = useState('Legal');
    const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');

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
                <span className="step-tag">{t('tag_executor') || 'Task Management'}</span>
                <h2>{t('title_executor') || 'ToDo List'}</h2>
                <p style={{ opacity: 0.7, marginTop: '12px' }}>
                    {t('desc_executor') || 'Track all tasks that need to be completed before and after — organized, clear, and persistent.'}
                </p>
            </div>

            {/* Progress bar */}
            {tasks.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
                        <span>{doneCount} of {tasks.length} completed</span>
                        <span>{progress}%</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
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
                        style={{ flex: '2', minWidth: '200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-color)', fontSize: '0.95rem' }}
                    />
                    <select
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        style={{ flex: '1', minWidth: '120px', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-color)' }}
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button
                        className="btn"
                        onClick={addTask}
                        style={{ background: 'var(--accent-gold)', color: 'var(--bg-color)', fontWeight: 700, padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                    >
                        + Add
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
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: filter === f ? 'var(--accent-gold)' : 'transparent',
                            color: filter === f ? 'var(--bg-color)' : 'var(--text-color)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontWeight: filter === f ? 700 : 400,
                            transition: 'all 0.2s'
                        }}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Task list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', opacity: 0.4, fontStyle: 'italic' }}>
                        {tasks.length === 0 ? 'No tasks yet. Add your first task above.' : 'No tasks in this filter.'}
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
                            background: task.done ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                        }}
                        onClick={() => toggleTask(task.id)}
                    >
                        <div style={{
                            width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                            border: task.done ? '2px solid var(--accent-gold)' : '2px solid rgba(255,255,255,0.3)',
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
                            {task.category}
                        </span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.4, flexShrink: 0 }}>{task.createdAt}</span>
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
