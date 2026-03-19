'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { formatDate } from '@/lib/dates';

export default function WritingAdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  }

  return (
    <div style={{ padding: 'var(--space-8)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-10)' }}>
        <div>
          <h1 className="heading-1" style={{ marginBottom: '4px' }}>Writing & Garden</h1>
          <p style={{ color: 'var(--ink-30)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Manage your thoughts and seedlings
          </p>
        </div>
        <Link href="/admin/writing/new" className="btn-primary">
          Write New Post +
        </Link>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>Loading posts...</p>
      ) : posts.length === 0 ? (
        <div style={{ padding: 'var(--space-12)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-30)', marginBottom: 'var(--space-6)' }}>No posts found in the database.</p>
          <Link href="/admin/writing/new" className="btn-ghost">Create your first post</Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)', textTransform: 'uppercase' }}>Title / Slug</th>
                <th style={{ padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-30)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="admin-table-row">
                  <td style={{ padding: 'var(--space-5) var(--space-4)' }}>
                    <p style={{ fontWeight: '500', color: 'var(--ink)', fontSize: '14px' }}>{post.title}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-30)', marginTop: '2px' }}>/{post.slug}</p>
                  </td>
                  <td style={{ padding: 'var(--space-5) var(--space-4)' }}>
                    <span style={{ 
                      fontSize: '10px', textTransform: 'uppercase', 
                      background: post.type === 'garden' ? 'var(--surface-2)' : 'var(--amber-subtle)',
                      color: post.type === 'garden' ? 'var(--ink-50)' : 'var(--amber)',
                      padding: '2px 8px', borderRadius: '4px', fontWeight: '500'
                    }}>
                      {post.type} {post.category || post.stage ? `· ${post.category || post.stage}` : ''}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-5) var(--space-4)' }}>
                    <span style={{ 
                      fontSize: '11px', color: post.published ? '#10b981' : 'var(--ink-30)',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: post.published ? '#10b981' : 'var(--ink-10)' }} />
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-5) var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>
                    {formatDate(post.date)}
                  </td>
                  <td style={{ padding: 'var(--space-5) var(--space-4)', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/writing/${post.id}`} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '12px' }}>Edit</Link>
                      <button onClick={() => deletePost(post.id)} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '12px', color: '#ef4444' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .admin-table-row:hover { background: var(--surface-1); }
      `}</style>
    </div>
  );
}
