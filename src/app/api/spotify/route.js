import { NextResponse }     from 'next/server';
import { getNowPlaying, getRecentlyPlayed } from '@/lib/spotify';

// Revalidate every 60 seconds via Next.js cache
export const revalidate = 60;

export async function GET() {
  // If Spotify credentials not configured, return graceful null
  if (!process.env.SPOTIFY_CLIENT_ID) {
    return NextResponse.json({ configured: false });
  }

  const nowPlaying = await getNowPlaying();

  if (nowPlaying.isPlaying) {
    return NextResponse.json({ ...nowPlaying, configured: true });
  }

  // Fall back to recently played
  const recent = await getRecentlyPlayed();
  return NextResponse.json({
    ...(recent ?? { isPlaying: false }),
    configured: true,
  });
}
