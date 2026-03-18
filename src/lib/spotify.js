const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_URL =
  'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1';

async function getAccessToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const res = await fetch(TOKEN_URL, {
    method:  'POST',
    headers: {
      Authorization:  `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  });

  return res.json();
}

export async function getNowPlaying() {
  try {
    const { access_token } = await getAccessToken();

    const res = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
      next:    { revalidate: 60 }, // cache 60s
    });

    // 204 = nothing playing
    if (res.status === 204 || res.status > 400) {
      return { isPlaying: false };
    }

    const data = await res.json();

    if (!data.item || data.item.type !== 'track') {
      return { isPlaying: false };
    }

    return {
      isPlaying:  data.is_playing,
      title:      data.item.name,
      artist:     data.item.artists.map((a) => a.name).join(', '),
      album:      data.item.album.name,
      albumArt:   data.item.album.images[0]?.url,
      songUrl:    data.item.external_urls.spotify,
      previewUrl: data.item.preview_url,
    };
  } catch (err) {
    console.error('Spotify error:', err);
    return { isPlaying: false };
  }
}

export async function getRecentlyPlayed() {
  try {
    const { access_token } = await getAccessToken();

    const res = await fetch(RECENTLY_PLAYED_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
      next:    { revalidate: 300 },
    });

    if (!res.ok) return null;

    const { items } = await res.json();
    if (!items?.length) return null;

    const track = items[0].track;
    return {
      isPlaying:  false,
      title:      track.name,
      artist:     track.artists.map((a) => a.name).join(', '),
      album:      track.album.name,
      albumArt:   track.album.images[0]?.url,
      songUrl:    track.external_urls.spotify,
      previewUrl: track.preview_url,
    };
  } catch {
    return null;
  }
}
