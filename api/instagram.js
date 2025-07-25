export default async function handler(req, res) {
  const { username, count } = req.query;
  const limit = parseInt(count, 10) || 6;

  if (!username) {
    res.status(400).json({ error: 'Missing username parameter' });
    return;
  }

  const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram data: ${response.status}`);
    }
    const data = await response.json();
    let edges =
      data?.graphql?.user?.edge_owner_to_timeline_media?.edges ||
      data?.data?.user?.edge_owner_to_timeline_media?.edges ||
      [];
    const posts = edges.slice(0, limit).map(({ node }) => ({
      permalink: `https://www.instagram.com/p/${node.shortcode}/`
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
