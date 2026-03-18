export default function WritingPostLoading() {
  return (
    <div style={{
      maxWidth: 'var(--max-w-text)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
      animation: 'fade-in 200ms ease',
    }}>
      {/* Back link skeleton */}
      <div style={{
        width: '80px', height: '14px',
        background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--space-10)',
      }} />

      {/* Meta skeletons */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div style={{ width: '60px', height: '22px', background: 'var(--surface-2)', borderRadius: 'var(--radius-full)' }} />
        <div style={{ width: '90px', height: '22px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }} />
      </div>

      {/* Title skeleton */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ width: '85%', height: '48px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)' }} />
        <div style={{ width: '60%', height: '48px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)' }} />
      </div>

      {/* Description skeleton */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <div style={{ width: '100%', height: '18px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)' }} />
        <div style={{ width: '75%',  height: '18px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }} />
      </div>

      {/* Content line skeletons */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(to right, var(--amber), transparent)',
        marginBottom: 'var(--space-10)',
        opacity: 0.4,
      }} />

      {[100, 90, 100, 80, 95, 70, 100, 85, 60].map((w, i) => (
        <div
          key={i}
          style={{
            width:        `${w}%`,
            height:       '16px',
            background:   'var(--surface-2)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: i % 4 === 3 ? 'var(--space-6)' : 'var(--space-2)',
            opacity:      1 - i * 0.04,
          }}
        />
      ))}

      <style>{`
        @keyframes shimmer {
          0%   { opacity: 0.5; }
          50%  { opacity: 1; }
          100% { opacity: 0.5; }
        }
        /* All skeleton divs pulse */
        [style*="var(--surface-2)"] {
          animation: shimmer 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
