export default async function handler(req, res) {
  const apiKey = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USER;

  if (!apiKey || !user) {
    return res.status(500).json({ isPlaying: false, track: null });
  }

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(user)}&api_key=${apiKey}&format=json&limit=1`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({ isPlaying: false, track: null });
    }

    const data = await response.json();
    const tracks = data?.recenttracks?.track;

    if (!tracks || tracks.length === 0) {
      return res.status(200).json({ isPlaying: false, track: null });
    }

    const latest = tracks[0];
    const isPlaying = latest['@attr']?.nowplaying === 'true';
    const images = latest.image || [];
    const image = images.find(img => img.size === 'medium')?.['#text'] ||
                  images.find(img => img['#text'])?.['#text'] || '';

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json({
      isPlaying,
      track: {
        name: latest.name,
        artist: latest.artist?.['#text'] || latest.artist,
        album: latest.album?.['#text'] || '',
        image,
        url: latest.url || '',
      },
    });
  } catch {
    return res.status(502).json({ isPlaying: false, track: null });
  }
}
