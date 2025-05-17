export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source"); // 'saavn' or 'soundcloud'
    const id = searchParams.get("id");
  
    if (!source || !id) {
      return Response.json({ error: "Missing source or track ID" }, { status: 400 });
    }
  
    const base = process.env.NEXT_PUBLIC_BASE_URL;
  
    try {
      const streamRes = await fetch(`${base}/api/${source}/stream?id=${id}`);
      const data = await streamRes.json();
      return Response.json(data);
    } catch (error) {
      return Response.json({ error: error.message || "Stream resolution failed" }, { status: 500 });
    }
  }
  