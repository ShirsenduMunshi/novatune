"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("query");

  const [query, setQuery] = useState(searchTerm || "");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setQuery(searchTerm);
      performSearch(searchTerm);
    }
  }, [searchTerm]);

  const performSearch = async (q) => {
    if (!q.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setTracks([]);
      setPlayingTrack(null);
      setSearchPerformed(false);

      const saavnRes = await fetch(`/api/saavn/search?query=${encodeURIComponent(q)}`);
      const saavnData = await saavnRes.json();

      if (!saavnRes.ok || !Array.isArray(saavnData.results) || saavnData.results.length === 0) {
        throw new Error("JioSaavn returned no valid results.");
      }

      const transformed = saavnData.results.map((t) => ({
        id: t.id,
        title: t.name || "Unknown Title",
        artist: t.artists?.primary?.map((a) => a.name).join(", ") || "Unknown Artist",
        image: t.image?.find((img) => img.quality === "500x500")?.url || t.image?.[0]?.url || "/utilityImages/utility.jpg",
        streamUrl: t.downloadUrl?.find((d) => d.quality === "160kbps")?.url || null,
        source: "saavn",
      }));

      setTracks(transformed);
    } catch (err) {
      console.error("Saavn failed, trying SoundCloud...", err.message);
      try {
        const scRes = await fetch(`/api/soundcloud?q=${encodeURIComponent(q)}&limit=20`);
        const scData = await scRes.json();

        if (!scRes.ok || !Array.isArray(scData.collection)) {
          throw new Error("SoundCloud fallback failed");
        }

        const fallbackTracks = scData.collection.map((track) => ({
          id: track.id,
          title: track.title,
          artist: track.user?.username || "Unknown Artist",
          image: track.artwork_url || "/utilityImages/utility.jpg",
          streamUrl: null, // Add this!
          source: "soundcloud",
        }));

        setTracks(fallbackTracks);
      } catch (scErr) {
        console.error("SoundCloud fallback also failed:", scErr.message);
        setError("No results found.");
        setTracks([]);
      }
    } finally {
      setLoading(false);
      setSearchPerformed(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const handlePlay = (trackId) => {
    setPlayingTrack((prev) => (prev === trackId ? null : trackId));
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Search Music</h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs or artists..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {searchPerformed && !loading && tracks.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg">No results found for "{query}"</p>
          <p className="text-sm text-muted-foreground">Try different keywords</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-6 w-3/4" />
            </Card>
          ))
          : tracks.map((track) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden relative group transition-all h-full">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <p className="font-semibold line-clamp-2">{track.title}</p>
                  <p className="text-sm opacity-70 mt-1 line-clamp-1">
                    {track.artist}
                  </p>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlay(track.id)}
                      className="flex items-center gap-2 w-full"
                    >
                      <PlayCircle size={18} />
                      {playingTrack === track.id ? "Stop" : "Play"}
                    </Button>
                  </div>
                  {playingTrack === track.id && (
                    <div className="mt-4">
                      <AudioPlayer track={track} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

const AudioPlayer = ({ track }) => {
  const [audioUrl, setAudioUrl] = useState(track.streamUrl || null);
  const [loading, setLoading] = useState(!track.streamUrl);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStream = async () => {
      if (track.source !== "soundcloud" || audioUrl) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/soundcloud/stream?trackId=${track.id}`);
        const data = await res.json();
        if (!res.ok || !data.url) throw new Error("No audio stream found");
        setAudioUrl(data.url);
      } catch (err) {
        console.error(err);
        setError("Failed to load audio stream");
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [track]);

  if (loading) return <div className="text-sm text-gray-500">Loading audio...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!audioUrl) return null;

  return (
    <audio
      controls
      autoPlay
      src={audioUrl}
      onError={() => setError("Failed to play audio")}
      className="w-full mt-2"
    />
  );
};

export default SearchPage;