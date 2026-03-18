'use client';
import { useRef, useState } from 'react';

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime';

export function MediaUploader({ albumId, onUploaded }) {
  const inputRef          = useRef(null);
  const [uploads, setUploads] = useState([]); // { name, progress, status, error }
  const [dragging, setDragging] = useState(false);

  async function uploadFile(file) {
    const name = file.name;

    // Get signed params from our API
    const sigRes = await fetch('/api/gallery/upload-signature', { method: 'POST' });
    if (!sigRes.ok) {
      const { error } = await sigRes.json();
      throw new Error(error || 'Failed to get upload signature');
    }
    const { signature, timestamp, apiKey, cloudName, folder, uploadUrl } = await sigRes.json();

    // Build form data for Cloudinary
    const fd = new FormData();
    fd.append('file',      file);
    fd.append('folder',    folder);
    fd.append('timestamp', timestamp);
    fd.append('api_key',   apiKey);
    fd.append('signature', signature);

    // XHR for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);

      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setUploads(prev => prev.map(u => u.name === name ? { ...u, progress: pct } : u));
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          // Save to DB
          const isVideo   = file.type.startsWith('video/');
          const mediaType = isVideo ? 'video' : 'image';
          const dbRes = await fetch('/api/gallery/media', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              albumId,
              type:        mediaType,
              url:         data.secure_url,
              thumbnailUrl: isVideo
                ? data.secure_url.replace('/upload/', '/upload/so_0,f_jpg,q_80/').replace(/\.[^.]+$/, '.jpg')
                : data.secure_url.replace('/upload/', '/upload/w_400,q_60/'),
              publicId:    data.public_id,
              width:       data.width  || null,
              height:      data.height || null,
            }),
          });
          if (dbRes.ok) {
            const saved = await dbRes.json();
            resolve(saved);
          } else {
            reject(new Error('Failed to save to database'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
      xhr.send(fd);
    });
  }

  async function handleFiles(files) {
    const fileArr = Array.from(files);
    setUploads(fileArr.map(f => ({ name: f.name, progress: 0, status: 'uploading', error: null })));

    for (const file of fileArr) {
      try {
        const saved = await uploadFile(file);
        setUploads(prev => prev.map(u => u.name === file.name ? { ...u, progress: 100, status: 'done' } : u));
        onUploaded?.(saved);
      } catch (err) {
        setUploads(prev => prev.map(u => u.name === file.name ? { ...u, status: 'error', error: err.message } : u));
      }
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        className={`media-uploader${dragging ? ' media-uploader--active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
        <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
          <p style={{ fontSize: '28px', marginBottom: 'var(--space-2)' }}>📎</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-50)', marginBottom: 'var(--space-1)' }}>
            Drag &amp; drop images or videos here
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', letterSpacing: '0.06em' }}>
            JPG · PNG · WebP · GIF · MP4 · WebM · MOV
          </p>
        </div>
      </div>

      {/* Upload progress list */}
      {uploads.length > 0 && (
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {uploads.map(u => (
            <div key={u.name} style={{
              background: 'var(--surface-2)', borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-50)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                  {u.name}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: u.status === 'done' ? '#22c55e' : u.status === 'error' ? '#ef4444' : 'var(--amber)' }}>
                  {u.status === 'done' ? '✓ Done' : u.status === 'error' ? `✕ ${u.error || 'Failed'}` : `${u.progress}%`}
                </span>
              </div>
              {u.status === 'uploading' && (
                <div style={{ height: '2px', background: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${u.progress}%`, background: 'var(--amber)', transition: 'width 0.3s var(--ease-out)' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
