// pages/api/instagram.js
export default async function handler(req, res) {
  const { username = "instagram", count = 6 } = req.query;
  const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;

  let json;
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });
    json = await r.json();
  } catch (e) {
    return res
      .status(500)
      .send("Failed to fetch Instagram JSON: " + e.message);
  }

  // Grab the first `count` posts
  const edges = json.graphql.user.edge_owner_to_timeline_media.edges || [];
  const posts = edges.slice(0, count).map(e => ({
    permalink: `https://www.instagram.com/p/${e.node.shortcode}/`
  }));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({ posts });
}
