'use client';
import { useRef, useState } from 'react';

export function SingleImageUploader({ value, onChange, folder = 'jamesuchechi-projects' }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleFile(file) {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      // 1. Get signature
      const sigRes = await fetch('/api/gallery/upload-signature', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ folder }),
      });
      
      if (!sigRes.ok) throw new Error('Failed to get upload signature');
      const { signature, timestamp, apiKey, cloudName, uploadUrl } = await sigRes.json();

      // 2. Upload to Cloudinary
      const fd = new FormData();
      fd.append('file',      file);
      fd.append('folder',    folder);
      fd.append('timestamp', timestamp);
      fd.append('api_key',   apiKey);
      fd.append('signature', signature);

      const upRes = await fetch(uploadUrl, { method: 'POST', body: fd });
      if (!upRes.ok) throw new Error('Cloudinary upload failed');
      
      const data = await upRes.json();
      onChange(data.secure_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {value ? (
        <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              position: 'absolute', top: '8px', right: '8px',
              background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none',
              borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            height: '160px', border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', background: 'var(--surface-1)', transition: 'border-color 0.2s',
          }}
        >
          <span style={{ fontSize: '24px', marginBottom: '8px' }}>🖼️</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)' }}>
            {loading ? 'Uploading…' : 'Click to upload cover image'}
          </span>
          {error && <p style={{ color: '#ef4444', fontSize: '10px', marginTop: '8px' }}>{error}</p>}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
