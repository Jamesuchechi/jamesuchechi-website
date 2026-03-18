import { ContactForm } from '@/components/ui/ContactForm';

export const metadata = {
  title:       'Contact',
  description: 'Get in touch with James Uchechi.',
};

export default function ContactPage() {
  return (
    <div style={{
      maxWidth: 'var(--max-w-text)',
      margin:   '0 auto',
      padding:  'clamp(100px, 14vh, 160px) var(--space-6) var(--space-24)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 'var(--space-20)',
        alignItems: 'start',
      }}>
        {/* Left — copy */}
        <div>
          <p className="caption" style={{ marginBottom: 'var(--space-3)' }}>Contact</p>
          <h1 className="display-2" style={{ marginBottom: 'var(--space-6)' }}>
            Say hello
          </h1>
          <p className="body" style={{ color: 'var(--ink-50)', marginBottom: 'var(--space-8)' }}>
            I'm open to interesting projects, contract work, collaborations,
            or just a good conversation about software and ideas.
          </p>

          {/* Direct links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <p className="caption" style={{ marginBottom: 'var(--space-2)' }}>Email</p>
              <a
                href="mailto:okparajamesuchechi@gmail.com"
                className="amber-link"
                style={{ fontSize: 'var(--text-sm)' }}
              >
                okparajamesuchechi@gmail.com
              </a>
            </div>
            <div>
              <p className="caption" style={{ marginBottom: 'var(--space-2)' }}>Twitter / X</p>
              <a
                href="https://x.com/Jamesuchechi6"
                target="_blank"
                rel="noopener noreferrer"
                className="amber-link"
                style={{ fontSize: 'var(--text-sm)' }}
              >
                @Jamesuchechi6
              </a>
            </div>
            <div>
              <p className="caption" style={{ marginBottom: 'var(--space-2)' }}>GitHub</p>
              <a
                href="https://github.com/jamesuchechi"
                target="_blank"
                rel="noopener noreferrer"
                className="amber-link"
                style={{ fontSize: 'var(--text-sm)' }}
              >
                github.com/jamesuchechi
              </a>
            </div>
          </div>

          {/* Response time note */}
          <div style={{
            marginTop:    'var(--space-10)',
            padding:      'var(--space-4) var(--space-5)',
            background:   'var(--surface-1)',
            border:       '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            borderLeft:   '2px solid var(--amber)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: 'var(--ink-50)', letterSpacing: '0.06em', lineHeight: 1.6,
            }}>
              I typically respond within 24–48 hours. If your message is urgent,
              email directly.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
