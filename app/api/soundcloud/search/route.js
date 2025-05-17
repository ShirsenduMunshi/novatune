export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'top music';
    const limit = searchParams.get('limit') || 8;
    const CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;

    console.log("CLIENT_ID: ", CLIENT_ID);
  
    try {
      const response = await fetch(
        `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${CLIENT_ID}&limit=${limit}`
      );
  
      if (!response.ok) {
        throw new Error(`SoundCloud API error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('SoundCloud search data:', data);
      return Response.json(data);
    } catch (error) {
      console.error('SoundCloud search error:', error);
      return Response.json(
        { error: error.message || 'Failed to fetch from SoundCloud' },
        { status: 500 }
      );
    }
  }