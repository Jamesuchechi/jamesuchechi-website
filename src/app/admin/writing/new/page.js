'use client';
import { PostForm } from '@/components/ui/PostForm';

export default function NewPostPage() {
  return (
    <div style={{ padding: 'var(--space-8)' }}>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <h1 className="heading-1" style={{ marginBottom: '4px' }}>New Post</h1>
        <p style={{ color: 'var(--ink-30)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {"What's on your mind?"}
        </p>
      </div>

      <PostForm />
    </div>
  );
}
