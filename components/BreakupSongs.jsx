"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

const BreakupSongs = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [error, setError] = useState(null);

  const fetchBreakupSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      setTracks([]);

      // Attempt to fetch from JioSaavn with breakup songs query
      const saavnRes = await fetch(`/api/saavn/search?query=arijit+singh+sad+Songs`);
      if (saavnRes.ok) {
        const saavnData = await saavnRes.json();
        if (Array.isArray(saavnData.results) && saavnData.results.length > 0) {
          const transformed = saavnData.results.map((t) => ({
            id: t.id,
            title: t.name || "Unknown Title",
            artist:
              t.artists?.primary?.map((a) => a.name).join(", ") ||
              "Unknown Artist",
            image:
              t.image?.find((img) => img.quality === "500x500")?.url ||
              t.image?.[0]?.url ||
              "/utilityImages/utility.jpg",
            streamUrl:
              t.downloadUrl?.find((d) => d.quality === "160kbps")?.url || null,
            source: "saavn",
          }));
          setTracks(transformed);
          return;
        }
      }

      // Fallback to SoundCloud with breakup songs query
      const scRes = await fetch(`/api/soundcloud?q=Breakup+Songs&limit=8`);
      if (scRes.ok) {
        const scData = await scRes.json();
        if (Array.isArray(scData.collection) && scData.collection.length > 0) {
          const fallbackTracks = scData.collection.map((track) => ({
            id: track.id,
            title: track.title,
            artist: track.user?.username || "Unknown Artist",
            image: track.artwork_url || "/utilityImages/utility.jpg",
            streamUrl: null, // will fetch on-demand
            source: "soundcloud",
          }));
          setTracks(fallbackTracks);
          return;
        }
      }

      throw new Error("No breakup songs found from JioSaavn or SoundCloud.");
    } catch (err) {
      console.error("Error fetching breakup songs:", err);
      setError("Failed to fetch breakup songs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreakupSongs();
  }, []);

  const handlePlay = (trackId) => {
    setPlayingTrack((prev) => (prev === trackId ? null : trackId));
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">💔 Breakup Songs</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
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
    </section>
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
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setAudioUrl(data.url);
          } else {
            throw new Error("No audio URL available");
          }
        } else {
          throw new Error("Failed to load audio stream");
        }
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

export default BreakupSongs;