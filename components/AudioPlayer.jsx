"use client";
import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function AudioPlayer({ track, image, streamUrl, source }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-zinc-900 p-4 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col items-center">
      <img
        src={image || "/utilityImages/utility.jpg"}
        alt={track.title}
        className="w-48 h-48 object-cover rounded-xl mb-4"
      />
      <h2 className="text-white text-lg font-semibold text-center">{track.title}</h2>
      <p className="text-zinc-400 text-sm text-center mb-2">{track.artist}</p>

      {streamUrl ? (
        <>
          <audio ref={audioRef} src={streamUrl} onEnded={() => setIsPlaying(false)} />
          <button
            onClick={togglePlay}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </>
      ) : (
        <p className="text-red-400 text-sm mt-3">No stream available</p>
      )}

      <span className="text-xs text-zinc-500 mt-2">{source.toUpperCase()}</span>
    </div>
  );
}
