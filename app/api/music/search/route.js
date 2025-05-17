export async function GET(request) {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "top music";
    const limit = url.searchParams.get("limit") || 8;
  
    try {
      // Try JioSaavn first
      const saavnRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/saavn?q=${query}&limit=${limit}`);
      const saavnData = await saavnRes.json();
  
      if (saavnData?.results?.length > 0) {
        return Response.json({ source: "saavn", results: saavnData.results });
      }
  
      // Fallback to SoundCloud
      const scRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/soundcloud?q=${query}&limit=${limit}`);
      const scData = await scRes.json();
  
      return Response.json({ source: "soundcloud", results: scData.collection || [] });
  
    } catch (err) {
      return Response.json({ error: err.message || "Search failed" }, { status: 500 });
    }
  }
  