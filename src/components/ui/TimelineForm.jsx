'use client';
import { useState }  from 'react';
import { useRouter } from 'next/navigation';

const inputStyle = { padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface-1)', color: 'var(--ink)', fontSize: 'var(--text-sm)', outline: 'none', width: '100%' };

function Field({ label, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-50)' }}>{label}</label>
      {children}
      {hint && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)' }}>{hint}</p>}
    </div>
  );
}

export function TimelineForm({ initial, onSave }) {
  const router  = useRouter();
  const editing = !!initial?.id;

  const [form, setForm] = useState({
    title:       initial?.title       ?? '',
    description: initial?.description ?? '',
    category:    initial?.category    ?? 'career',
    date:        initial?.date ? new Date(initial.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    icon:        initial?.icon        ?? '',
    linkUrl:     initial?.linkUrl     ?? '',
    linkLabel:   initial?.linkLabel   ?? '',
    published:   initial?.published   ?? true,
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url    = editing ? `/api/timeline/${initial.id}` : '/api/timeline';
      const method = editing ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed'); return; }
      if (onSave) onSave();
      else router.push('/admin/timeline');
      router.refresh();
    } catch { setError('Network error.'); }
    finally  { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '600px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <Field label="Title *">
          <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} required />
        </Field>
        <Field label="Category *">
          <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)} required>
            <option value="career">Career</option>
            <option value="life">Life</option>
            <option value="travel">Travel</option>
            <option value="education">Education</option>
            <option value="project">Project</option>
          </select>
        </Field>
      </div>

      <Field label="Description *">
        <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} required />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 'var(--space-6)' }}>
        <Field label="Date *">
          <input style={inputStyle} type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
        </Field>
        <Field label="Icon" hint="Emoji">
          <input style={{ ...inputStyle, textAlign: 'center', fontSize: '20px' }} value={form.icon} onChange={e => set('icon', e.target.value)} maxLength={4} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <Field label="Link URL (optional)">
          <input style={inputStyle} type="url" value={form.linkUrl} onChange={e => set('linkUrl', e.target.value)} />
        </Field>
        <Field label="Link Label">
          <input style={inputStyle} value={form.linkLabel} onChange={e => set('linkLabel', e.target.value)} placeholder="Learn more" />
        </Field>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
        <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-50)' }}>Published</span>
      </label>

      {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#ef4444' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
        <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving…' : editing ? 'Save changes' : 'Add milestone'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => router.push('/admin/timeline')}>Cancel</button>
      </div>
    </form>
  );
}
