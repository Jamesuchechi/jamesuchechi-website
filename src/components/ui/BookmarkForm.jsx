'use client';
import { useState, useEffect } from 'react';
import { useRouter }           from 'next/navigation';

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

export function BookmarkForm({ initial, onSave }) {
  const router  = useRouter();
  const editing = !!initial?.id;

  const [form, setForm] = useState({
    url:         initial?.url         ?? '',
    title:       initial?.title       ?? '',
    description: initial?.description ?? '',
    note:        initial?.note        ?? '',
    tags:        initial?.tags?.join(', ') ?? '',
    via:         initial?.via         ?? '',
    published:   initial?.published   ?? true,
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingOg, setFetchingOg] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function fetchOg() {
    if (!form.url || editing) return;
    setFetchingOg(true);
    try {
      const res = await fetch('/api/bookmarks/og-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.url }),
      });
      if (res.ok) {
        const data = await res.json();
        setForm(f => ({
          ...f,
          title:       f.title || data.title || '',
          description: f.description || data.description || '',
        }));
      }
    } catch (err) {
      console.error('OG Fetch failed', err);
    } finally {
      setFetchingOg(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url    = editing ? `/api/bookmarks/${initial.id}` : '/api/bookmarks';
      const method = editing ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed'); return; }
      if (onSave) onSave();
      else router.push('/admin/bookmarks');
      router.refresh();
    } catch { setError('Network error.'); }
    finally  { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '600px' }}>
      <Field label="URL *" hint="Paste a link to auto-fetch title/description">
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <input style={inputStyle} type="url" value={form.url} onChange={e => set('url', e.target.value)} onBlur={fetchOg} required />
          {!editing && (
            <button type="button" onClick={fetchOg} disabled={fetchingOg} className="btn-ghost" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
              {fetchingOg ? 'Fetching…' : 'Refetch OG'}
            </button>
          )}
        </div>
      </Field>

      <Field label="Title *">
        <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} required />
      </Field>

      <Field label="Description">
        <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
      </Field>

      <Field label="My Note" hint="Personal take on why this is interesting">
        <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.note} onChange={e => set('note', e.target.value)} />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <Field label="Tags" hint="Comma separated (e.g. Next.js, Design, AI)">
          <input style={inputStyle} value={form.tags} onChange={e => set('tags', e.target.value)} />
        </Field>
        <Field label="Via" hint="Source/Author">
          <input style={inputStyle} value={form.via} onChange={e => set('via', e.target.value)} />
        </Field>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
        <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-50)' }}>Published</span>
      </label>

      {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#ef4444' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
        <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving…' : editing ? 'Save changes' : 'Add bookmark'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => router.push('/admin/bookmarks')}>Cancel</button>
      </div>
    </form>
  );
}
