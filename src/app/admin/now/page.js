'use client';
import { useState, useEffect } from 'react';
import { NowForm }             from '@/components/ui/NowForm';

export default function AdminNowPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/now');
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function del(id) {
    if (!confirm('Delete this entry?')) return;
    await fetch(`/api/now/${id}`, { method: 'DELETE' });
    load();
  }

  const sections = ['building', 'learning', 'reading', 'listening'];

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <p className="caption">Manage</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          Now Page
        </h1>
        <p style={{ marginTop: 'var(--space-4)', color: 'var(--ink-50)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
          Update what you&apos;re currently up to.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 500px) 1fr', gap: 'var(--space-12)', alignItems: 'start' }}>
        {/* Form */}
        <div>
          <h2 style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 'var(--space-6)', color: 'var(--ink-50)' }}>
            {editingId ? 'Edit Entry' : 'Add New Entry'}
          </h2>
          <NowForm 
            initial={editingId ? entries.find(e => e.id === editingId) : null}
            onSave={() => { setEditingId(null); load(); }}
          />
        </div>

        {/* List */}
        <div>
          <h2 style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 'var(--space-6)', color: 'var(--ink-50)' }}>
            Current Entries
          </h2>
          
          {loading ? <p style={{ fontSize: '12px', color: 'var(--ink-30)' }}>Loading...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              {sections.map(section => {
                const items = entries.filter(e => e.section === section);
                if (items.length === 0) return null;

                return (
                  <div key={section}>
                    <h3 style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', color: 'var(--amber)', marginBottom: 'var(--space-3)', borderBottom: '1px solid var(--border)', paddingBottom: '4px' }}>
                      {section}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                      {items.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', background: editingId === item.id ? 'var(--surface-1)' : 'transparent' }}>
                          <span style={{ fontSize: '13px', color: 'var(--ink-80)' }}>{item.content}</span>
                          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <button onClick={() => setEditingId(item.id)} style={{ background: 'none', border: 'none', color: 'var(--amber)', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>EDIT</button>
                            <button onClick={() => del(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>DEL</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
