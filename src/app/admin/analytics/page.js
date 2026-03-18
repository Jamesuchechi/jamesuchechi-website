import { prisma } from '@/lib/prisma';
import { format, subMonths } from 'date-fns';

export const metadata = { title: 'Analytics · Admin' };

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const currentMonth = format(now, 'yyyy-MM');

  let stats = [];
  try {
    stats = await prisma.pageView.findMany({
      orderBy: { count: 'desc' },
    });
  } catch (err) {
    console.error('Analytics DB fetch error:', err);
  }

  const totalViews = stats.reduce((acc, s) => acc + s.count, 0);
  const thisMonthViews = stats.filter(s => s.month === currentMonth).reduce((acc, s) => acc + s.count, 0);

  const topPages = stats
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const sectionBreakdown = stats.reduce((acc, s) => {
    acc[s.section] = (acc[s.section] || 0) + s.count;
    return acc;
  }, {});

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <p className="caption">Insights</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: '300', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          Analytics
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
        <StatCard label="Total All-Time Views" value={totalViews.toLocaleString()} />
        <StatCard label="Views This Month" value={thisMonthViews.toLocaleString()} sub={`${currentMonth}`} />
        <StatCard label="Active Pages" value={stats.length} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-10)', alignItems: 'start' }}>
        {/* Top Pages */}
        <div>
          <h2 style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 'var(--space-6)', color: 'var(--ink-50)' }}>
            Most Viewed Content
          </h2>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-5)', background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
              {['Page / Slug', 'Section', 'Views'].map(h => (
                <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-30)' }}>{h}</span>
              ))}
            </div>
            {topPages.map((p, i) => (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', borderBottom: i < topPages.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: '13px', color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{p.slug}</span>
                <span style={{ fontSize: '11px', color: 'var(--ink-30)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.section}</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--amber)' }}>{p.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section Breakdown */}
        <div>
          <h2 style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 'var(--space-6)', color: 'var(--ink-50)' }}>
            Breakdown
          </h2>
          <div style={{ padding: 'var(--space-6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            {Object.entries(sectionBreakdown).sort((a,b) => b[1] - a[1]).map(([section, count]) => {
              const percentage = ((count / totalViews) * 100).toFixed(1);
              return (
                <div key={section} style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontSize: '12px', textTransform: 'capitalize', color: 'var(--ink)' }}>{section}</span>
                    <span style={{ fontSize: '11px', color: 'var(--ink-30)' }}>{percentage}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--surface-2)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percentage}%`, background: 'var(--amber)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{ padding: 'var(--space-6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-0)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-30)', marginBottom: 'var(--space-2)', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: '32px', fontWeight: '300', color: 'var(--ink)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ marginTop: 'var(--space-2)', fontSize: '11px', color: 'var(--ink-30)' }}>{sub}</p>}
    </div>
  );
}
