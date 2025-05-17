export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "top music";
  const limit = searchParams.get("limit") || 8;

  try {
    const res = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (!res.ok) throw new Error("JioSaavn API failed");

    const data = await res.json();
    return Response.json({ source: "saavn", results: data.data.results });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
