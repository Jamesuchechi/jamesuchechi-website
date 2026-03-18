'use client';
import { useState } from 'react';

const INITIAL = { name: '', email: '', message: '' };

function validate(data) {
  const errors = {};
  if (!data.name.trim())    errors.name    = 'Required';
  if (!data.email.trim())   errors.email   = 'Required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                            errors.email   = 'Invalid email';
  if (!data.message.trim()) errors.message = 'Required';
  else if (data.message.trim().length < 10)
                            errors.message = 'Too short';
  return errors;
}

export function ContactForm({ compact = false }) {
  const [form,    setForm]    = useState(INITIAL);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [status,  setStatus]  = useState('idle'); // idle | sending | success | error

  const set = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    if (touched[field]) {
      const e = validate({ ...form, [field]: value });
      setErrors(p => ({ ...p, [field]: e[field] }));
    }
  };

  const blur = (field) => {
    setTouched(p => ({ ...p, [field]: true }));
    const e = validate(form);
    setErrors(p => ({ ...p, [field]: e[field] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const inputStyle = (field) => ({
    width:        '100%',
    background:   'var(--surface-1)',
    border:       `1px solid ${errors[field] && touched[field] ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-md)',
    padding:      'var(--space-3) var(--space-4)',
    fontSize:     'var(--text-sm)',
    color:        'var(--ink)',
    outline:      'none',
    transition:   'border-color var(--duration-fast)',
    fontFamily:   'var(--font-body)',
    resize:       'none',
  });

  if (status === 'success') {
    return (
      <div style={{
        padding:   compact ? 'var(--space-6)' : 'var(--space-10)',
        textAlign: 'center',
        border:    '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface-1)',
      }}>
        <div style={{ fontSize: '32px', marginBottom: 'var(--space-4)' }}>✦</div>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)',
          fontWeight: '400', color: 'var(--ink)', marginBottom: 'var(--space-2)',
        }}>
          Message sent
        </p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-50)' }}>
          I'll get back to you within 24–48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate style={{
      display: 'flex', flexDirection: 'column',
      gap: 'var(--space-4)',
    }}>
      {/* Name */}
      <div>
        <input
          type="text"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          onBlur={() => blur('name')}
          placeholder="Your name"
          style={inputStyle('name')}
        />
        {errors.name && touched.name && (
          <p style={{
            fontSize: '11px', color: 'rgba(239,68,68,0.8)',
            fontFamily: 'var(--font-mono)', marginTop: '4px',
          }}>{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          onBlur={() => blur('email')}
          placeholder="your@email.com"
          style={inputStyle('email')}
        />
        {errors.email && touched.email && (
          <p style={{
            fontSize: '11px', color: 'rgba(239,68,68,0.8)',
            fontFamily: 'var(--font-mono)', marginTop: '4px',
          }}>{errors.email}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <textarea
          value={form.message}
          onChange={e => set('message', e.target.value)}
          onBlur={() => blur('message')}
          placeholder="What's on your mind?"
          rows={compact ? 4 : 6}
          maxLength={2000}
          style={inputStyle('message')}
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: '4px',
        }}>
          {errors.message && touched.message ? (
            <p style={{
              fontSize: '11px', color: 'rgba(239,68,68,0.8)',
              fontFamily: 'var(--font-mono)',
            }}>{errors.message}</p>
          ) : <span />}
          <p style={{
            fontSize: '11px', color: 'var(--ink-30)',
            fontFamily: 'var(--font-mono)',
          }}>
            {form.message.length}/2000
          </p>
        </div>
      </div>

      {/* Error */}
      {status === 'error' && (
        <p style={{
          fontSize: 'var(--text-sm)', color: 'rgba(239,68,68,0.8)',
          fontFamily: 'var(--font-mono)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 'var(--radius-md)',
        }}>
          Something went wrong. Email me directly at okparajamesuchechi@gmail.com
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary"
        style={{
          justifyContent: 'center',
          opacity: status === 'sending' ? 0.7 : 1,
          cursor:  status === 'sending' ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
