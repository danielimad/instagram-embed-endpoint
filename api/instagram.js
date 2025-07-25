// pages/api/instagram.js

export default async function handler(req, res) {
  const { username, count } = req.query;
  const limit = parseInt(count, 10) || 6;

  if (!username) {
    return res.status(400).json({ error: "Missing username parameter" });
  }

  // New endpoint that still works with public profiles
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "*/*",
        // This App‑ID is used by Instagram’s web interface and helps avoid 4xx responses
        "X-IG-App-ID": "936619743392459",
        // Referer set to the user’s profile page
        Referer: `https://www.instagram.com/${username}/`,
      },
    });

    if (!response.ok) {
      throw new Error(`Instagram returned status ${response.status}`);
    }

    const data = await response.json();
    // Extract posts from the new JSON structure
    const edges =
      data?.data?.user?.edge_owner_to_timeline_media?.edges || [];

    const posts = edges.slice(0, limit).map(({ node }) => ({
      permalink: `https://www.instagram.com/p/${node.shortcode}/`,
    }));

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ posts });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Failed to fetch Instagram data: ${err.message}` });
  }
}
