'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function Field({ label, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <label style={{
        fontFamily: 'var(--font-mono)', fontSize: '11px',
        letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-50)',
      }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)' }}>{hint}</p>}
    </div>
  );
}

const inputStyle = {
  padding:      'var(--space-3) var(--space-4)',
  border:       '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  background:   'var(--surface-1)',
  color:        'var(--ink)',
  fontSize:     'var(--text-sm)',
  outline:      'none',
  width:        '100%',
  transition:   'border-color var(--duration-fast)',
};

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

export function PostForm({ initial, onSave }) {
  const router  = useRouter();
  const editing = !!initial?.id;

  const [form, setForm] = useState({
    title:       initial?.title       ?? '',
    slug:        initial?.slug        ?? '',
    description: initial?.description ?? '',
    content:     initial?.content     ?? '',
    type:        initial?.type        ?? 'writing',
    category:    initial?.category    ?? 'essay',
    stage:       initial?.stage       ?? 'seedling',
    tags:        (initial?.tags       ?? []).join(', '),
    published:   initial?.published   ?? true,
    date:        initial?.date        ? new Date(initial.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
  });

  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    if (key === 'title' && !editing) {
      setForm(f => ({ ...f, title: val, slug: slugify(val) }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
 
    try {
      const url    = editing ? `/api/posts/${initial.id}` : '/api/posts';
      const method = editing ? 'PUT' : 'POST';

      const body = {
        ...form,
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        date: new Date(form.date).toISOString(),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save');
        return;
      }

      if (onSave) onSave();
      else router.push('/admin/writing');
      router.refresh();
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '900px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <Field label="Title *">
          <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} required />
        </Field>
        <Field label="Slug *" hint="Auto-generated from title">
          <input style={inputStyle} value={form.slug} onChange={e => set('slug', e.target.value)} required />
        </Field>
      </div>

      <Field label="Description (excerpt)">
        <textarea
          style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
          value={form.description} onChange={e => set('description', e.target.value)}
        />
      </Field>

      <Field label="Content (MDX Supported) *">
        <textarea
          style={{ 
            ...inputStyle, 
            minHeight: '400px', 
            resize: 'vertical', 
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: '1.6'
          }}
          value={form.content} onChange={e => set('content', e.target.value)} required
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        <Field label="Type">
          <select style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="writing">Writing</option>
            <option value="garden">Digital Garden</option>
          </select>
        </Field>

        {form.type === 'writing' ? (
          <Field label="Category">
            <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="essay">Essay</option>
              <option value="tutorial">Tutorial</option>
              <option value="til">TIL (Today I Learned)</option>
            </select>
          </Field>
        ) : (
          <Field label="Garden Stage">
            <select style={inputStyle} value={form.stage} onChange={e => set('stage', e.target.value)}>
              <option value="seedling">🌱 Seedling</option>
              <option value="budding">🌿 Budding</option>
              <option value="evergreen">🌳 Evergreen</option>
            </select>
          </Field>
        )}

        <Field label="Date">
          <input style={inputStyle} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </Field>
      </div>

      <Field label="Tags" hint="Comma-separated: react, design, thoughts">
        <input style={inputStyle} value={form.tags} onChange={e => set('tags', e.target.value)} />
      </Field>

      <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-50)' }}>Published</span>
        </label>
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#ef4444', padding: 'var(--space-3)', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
        <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving…' : editing ? 'Save changes' : 'Create post'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => router.push('/admin/writing')}>
          Cancel
        </button>
      </div>
    </form>
  );
}
