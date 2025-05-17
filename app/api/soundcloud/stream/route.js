export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get("trackId");
  const CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;

  if (!trackId) {
    return Response.json({ error: "Track ID is required" }, { status: 400 });
  }

  try {
    // First get track details
    const trackRes = await fetch(
      `https://api-v2.soundcloud.com/tracks/${trackId}?client_id=${CLIENT_ID}`
    );

    if (!trackRes.ok) {
      throw new Error(`Failed to fetch track: ${trackRes.status}`);
    }

    const track = await trackRes.json();
    // console.log('Track details:', track);

    // Find best available stream (progressive first, then HLS)
    const progressiveStream = track.media?.transcodings?.find(
      (t) => t.format.protocol === "progressive"
    );
    const hlsStream = track.media?.transcodings?.find(
      (t) => t.format.protocol === "hls"
    );

    const streamToUse = progressiveStream || hlsStream;
    if (!streamToUse) {
      throw new Error("No playable stream available");
    }
    // Resolve the stream URL
    // Construct the URL with the client_id query parameter
let streamUrl = streamToUse.url;
// console.log('Row Stream URL:', streamUrl);  // Log the URL to inspect if it's correct

if (!streamUrl.startsWith('https://')) {
  streamUrl = `https://api-v2.soundcloud.com${streamUrl.replace('/media', '')}?client_id=${CLIENT_ID}`;
} else {
  // If the URL already includes the protocol, append the client_id as a query param
  if (!streamUrl.includes('client_id')) {
    streamUrl = `${streamUrl}?&client_id=${CLIENT_ID}`;
  }
}

// console.log("Constricted url: ",streamUrl);  // Log the URL to inspect if it's correct

const streamRes = await fetch(streamUrl);

if (!streamRes.ok) {
  throw new Error(`Failed to resolve stream: ${streamRes.status}`);
}


    const streamData = await streamRes.json();
    return Response.json({ url: streamData.url });
  } catch (error) {
    console.error("Stream resolution error:", error);
    return Response.json(
      { error: error.message || "Failed to resolve stream" },
      { status: 500 }
    );
  }
}
