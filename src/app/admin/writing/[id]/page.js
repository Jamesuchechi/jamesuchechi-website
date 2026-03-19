'use client';
import { useEffect, useState, use } from 'react';
import { PostForm } from '@/components/ui/PostForm';

export default function EditPostPage({ params }) {
  const { id } = use(params);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) return (
    <div style={{ padding: 'var(--space-8)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-30)' }}>Loading post data...</p>
    </div>
  );

  if (!post) return (
    <div style={{ padding: 'var(--space-8)' }}>
      <p style={{ color: '#ef4444' }}>Post not found.</p>
    </div>
  );

  return (
    <div style={{ padding: 'var(--space-8)' }}>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <h1 className="heading-1" style={{ marginBottom: '4px' }}>Edit Post</h1>
        <p style={{ color: 'var(--ink-30)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Refining thoughts
        </p>
      </div>

      <PostForm initial={post} />
    </div>
  );
}
