'use client';
import { useState }  from 'react';
import { useRouter } from 'next/navigation';

const inputStyle = {
  padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)', background: 'var(--surface-1)',
  color: 'var(--ink)', fontSize: 'var(--text-sm)', outline: 'none', width: '100%',
};

function Field({ label, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-50)' }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)' }}>{hint}</p>}
    </div>
  );
}

export function UsesForm({ initial, onSave }) {
  const router  = useRouter();
  const editing = !!initial?.id;

  const [form, setForm] = useState({
    name:        initial?.name        ?? '',
    description: initial?.description ?? '',
    category:    initial?.category    ?? 'hardware',
    url:         initial?.url         ?? '',
    imageUrl:    initial?.imageUrl    ?? '',
    featured:    initial?.featured    ?? false,
    order:       initial?.order       ?? 0,
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url    = editing ? `/api/uses/${initial.id}` : '/api/uses';
      const method = editing ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, order: parseInt(form.order) || 0 }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed'); return; }
      if (onSave) onSave();
      else router.push('/admin/uses');
      router.refresh();
    } catch { setError('Network error.'); }
    finally  { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '600px' }}>
      <Field label="Name *">
        <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} required />
      </Field>

      <Field label="Description">
        <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <Field label="Category *">
          <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="hardware">Hardware</option>
            <option value="terminal">Terminal & Editor</option>
            <option value="stack">Stack</option>
            <option value="apps">Apps</option>
            <option value="reading">Reading</option>
          </select>
        </Field>
        <Field label="Order" hint="Lower = first">
          <input style={inputStyle} type="number" min="0" value={form.order} onChange={e => set('order', e.target.value)} />
        </Field>
      </div>

      <Field label="URL (optional)">
        <input style={inputStyle} type="url" value={form.url} onChange={e => set('url', e.target.value)} />
      </Field>

      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-50)' }}>Featured</span>
      </label>

      {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#ef4444' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
        <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving…' : editing ? 'Save changes' : 'Create item'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => router.push('/admin/uses')}>Cancel</button>
      </div>
    </form>
  );
}
