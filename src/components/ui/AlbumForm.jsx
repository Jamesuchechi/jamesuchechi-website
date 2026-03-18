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

function slugify(s) { return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'); }

export function AlbumForm({ initial, onSave }) {
  const router  = useRouter();
  const editing = !!initial?.id;

  const [form, setForm] = useState({
    title:       initial?.title       ?? '',
    slug:        initial?.slug        ?? '',
    description: initial?.description ?? '',
    coverUrl:    initial?.coverUrl    ?? '',
    emoji:       initial?.emoji       ?? '',
    order:       initial?.order       ?? 0,
    published:   initial?.published   ?? true,
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }));
    if (k === 'title' && !editing) setForm(f => ({ ...f, title: v, slug: slugify(v) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url    = editing ? `/api/gallery/albums/${initial.id}` : '/api/gallery/albums';
      const method = editing ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, order: parseInt(form.order) || 0 }) });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed'); return; }
      if (onSave) onSave();
      else router.push('/admin/gallery');
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
        <Field label="Slug *" hint="URL: /gallery/[slug]">
          <input style={inputStyle} value={form.slug} onChange={e => set('slug', e.target.value)} required />
        </Field>
      </div>

      <Field label="Description">
        <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', gap: 'var(--space-6)' }}>
        <Field label="Cover URL (optional)">
          <input style={inputStyle} type="url" value={form.coverUrl} onChange={e => set('coverUrl', e.target.value)} />
        </Field>
        <Field label="Emoji" hint="e.g. 🌍">
          <input style={{ ...inputStyle, textAlign: 'center', fontSize: '20px' }} value={form.emoji} onChange={e => set('emoji', e.target.value)} maxLength={4} />
        </Field>
        <Field label="Order">
          <input style={inputStyle} type="number" min="0" value={form.order} onChange={e => set('order', e.target.value)} />
        </Field>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
        <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-50)' }}>Published</span>
      </label>

      {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#ef4444' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
        <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving…' : editing ? 'Save changes' : 'Create album'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => router.push('/admin/gallery')}>Cancel</button>
      </div>
    </form>
  );
}
