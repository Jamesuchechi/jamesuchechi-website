import '@/styles/globals.css';
import { ThemeProvider }       from '@/components/ui/ThemeProvider';
import { SiteNav }             from '@/components/layout/SiteNav';
import { SiteFooter }          from '@/components/layout/SiteFooter';
import { CursorGlow }          from '@/components/ui/CursorGlow';
import { AnimatedBackground }  from '@/components/ui/AnimatedBackground';
import { RouteTheme }          from '@/components/ui/RouteTheme';
import { ReadingListPanel }    from '@/components/ui/ReadingList';
import { PageTransition, RouteLoadingBar } from '@/components/ui/PageTransition';

export const metadata = {
  title: {
    default:  'James Uchechi — Software Engineer & Creator',
    template: '%s · James Uchechi',
  },
  description:
    'Software engineer, data scientist, and occasional writer. Building at the intersection of code, data, and design.',
  metadataBase: new URL('https://jamesuchechi.com'),
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://jamesuchechi.com',
    siteName:    'James Uchechi',
    title:       'James Uchechi — Software Engineer & Creator',
    description: 'Building things at the intersection of code, data, and design.',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    site:        '@Jamesuchechi6',
    creator:     '@Jamesuchechi6',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="grain">
        <ThemeProvider>
          {/* Route loading bar — fires on every navigation */}
          <RouteLoadingBar />

          {/* Per-route accent color shift (/garden → green, /timeline → purple) */}
          <RouteTheme />

          {/* Custom amber dot + ring cursor — hides on touch */}
          <CursorGlow />

          {/* Reactive canvas background — dot grid + ambient orbs */}
          <AnimatedBackground />

          {/* Floating reading list panel — bottom left */}
          <ReadingListPanel />

          <SiteNav />

          {/* Smooth page fade/slide transitions */}
          <PageTransition>
            <main>{children}</main>
          </PageTransition>

          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}