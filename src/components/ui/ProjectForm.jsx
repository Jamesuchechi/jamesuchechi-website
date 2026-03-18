'use client';
import { useState }  from 'react';
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

export function ProjectForm({ initial, onSave }) {
  const router  = useRouter();
  const editing = !!initial?.id;

  const [form, setForm] = useState({
    title:       initial?.title       ?? '',
    slug:        initial?.slug        ?? '',
    summary:     initial?.summary     ?? '',
    description: initial?.description ?? '',
    coverUrl:    initial?.coverUrl    ?? '',
    liveUrl:     initial?.liveUrl     ?? '',
    githubUrl:   initial?.githubUrl   ?? '',
    techStack:   (initial?.techStack  ?? []).join(', '),
    category:    initial?.category    ?? 'web',
    featured:    initial?.featured    ?? false,
    order:       initial?.order       ?? 0,
    published:   initial?.published   ?? true,
    builtAt:     initial?.builtAt     ? new Date(initial.builtAt).toISOString().slice(0, 7) : '',
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
      const url    = editing ? `/api/projects/${initial.id}` : '/api/projects';
      const method = editing ? 'PUT' : 'POST';

      const body = {
        ...form,
        order:     parseInt(form.order) || 0,
        builtAt:   form.builtAt ? `${form.builtAt}-01` : null,
        techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
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
      else router.push('/admin/projects');
      router.refresh();
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '700px' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <Field label="Title *">
          <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} required />
        </Field>
        <Field label="Slug *" hint="Auto-generated from title">
          <input style={inputStyle} value={form.slug} onChange={e => set('slug', e.target.value)} required />
        </Field>
      </div>

      <Field label="Summary * (shown on card)">
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          value={form.summary} onChange={e => set('summary', e.target.value)} required
        />
      </Field>

      <Field label="Description (full, optional)">
        <textarea
          style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
          value={form.description} onChange={e => set('description', e.target.value)}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <Field label="Cover URL (image)">
          <input style={inputStyle} type="url" value={form.coverUrl} onChange={e => set('coverUrl', e.target.value)} />
        </Field>
        <Field label="Tech Stack" hint="Comma-separated: Next.js, Python, Prisma">
          <input style={inputStyle} value={form.techStack} onChange={e => set('techStack', e.target.value)} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <Field label="Live URL">
          <input style={inputStyle} type="url" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} />
        </Field>
        <Field label="GitHub URL">
          <input style={inputStyle} type="url" value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
        <Field label="Category">
          <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="web">Web</option>
            <option value="data">Data / ML</option>
            <option value="oss">Open Source</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Built (month)">
          <input style={inputStyle} type="month" value={form.builtAt} onChange={e => set('builtAt', e.target.value)} />
        </Field>
        <Field label="Order">
          <input style={inputStyle} type="number" min="0" value={form.order} onChange={e => set('order', e.target.value)} />
        </Field>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-50)' }}>Featured</span>
        </label>
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
          {loading ? 'Saving…' : editing ? 'Save changes' : 'Create project'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => router.push('/admin/projects')}>
          Cancel
        </button>
      </div>
    </form>
  );
}
