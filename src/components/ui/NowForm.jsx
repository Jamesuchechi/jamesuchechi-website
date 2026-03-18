'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const inputStyle = { padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 'var(--text-sm)', outline: 'none', width: '100%' };

export function NowForm({ initial, onSave }) {
  const router  = useRouter();
  const editing = !!initial?.id;

  const [form, setForm] = useState({
    section: initial?.section ?? 'building',
    content: initial?.content ?? '',
    order:   initial?.order   ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url    = editing ? `/api/now/${initial.id}` : '/api/now';
      const method = editing ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to save');
        return;
      }

      if (onSave) onSave();
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '500px' }}>
      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-50)', display: 'block', marginBottom: 'var(--space-2)' }}>Section</label>
          <select style={inputStyle} value={form.section} onChange={e => set('section', e.target.value)}>
            <option value="building">Building</option>
            <option value="learning">Learning</option>
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
          </select>
        </div>
        <div style={{ width: '80px' }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-50)', display: 'block', marginBottom: 'var(--space-2)' }}>Order</label>
          <input type="number" style={inputStyle} value={form.order} onChange={e => set('order', parseInt(e.target.value) || 0)} />
        </div>
      </div>

      <div>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-50)', display: 'block', marginBottom: 'var(--space-2)' }}>Content</label>
        <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.content} onChange={e => set('content', e.target.value)} required />
      </div>

      {error && <p style={{ color: '#ef4444', fontSize: '12px' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : editing ? 'Update' : 'Add Entry'}
        </button>
        {editing && <button type="button" onClick={() => onSave()} className="btn-ghost" style={{ fontSize: '12px' }}>Cancel</button>}
      </div>
    </form>
  );
}
