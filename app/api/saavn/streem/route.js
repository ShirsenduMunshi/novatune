export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
  
    if (!id) {
      return Response.json({ error: "Missing song ID" }, { status: 400 });
    }
  
    try {
      const res = await fetch(`https://saavn.dev/api/songs?id=${id}`);
  
      if (!res.ok) {
        throw new Error("Failed to fetch song details from JioSaavn");
      }
  
      const data = await res.json();
      const song = data.data[0];
  
      // You can select based on preference
      const streamUrl = song.downloadUrl.find((item) => item.quality === "320kbps")?.link || song.downloadUrl[0]?.link;
  
      if (!streamUrl) {
        throw new Error("Stream URL not found for this song");
      }
  
      return Response.json({ url: streamUrl });
    } catch (error) {
      console.error("JioSaavn stream error:", error);
      return Response.json({ error: error.message || "Failed to fetch JioSaavn stream" }, { status: 500 });
    }
  }
  