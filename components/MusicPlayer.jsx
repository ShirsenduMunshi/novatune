"use client"
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export function playTrack(track) {
  const event = new CustomEvent("playTrack", { detail: track });
  window.dispatchEvent(event);
}

const MusicPlayer = ({ trackList = [] }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleTrackPlay = (event) => {
      const track = event.detail;
      const trackIndex = trackList.findIndex((t) => t.id === track.id);
      if (trackIndex !== -1) {
        setCurrentTrack(trackIndex);
        setIsPlaying(true);
      }
    };

    window.addEventListener("playTrack", handleTrackPlay);
    return () => {
      window.removeEventListener("playTrack", handleTrackPlay);
    };
  }, [trackList]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % trackList.length);
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + trackList.length) % trackList.length);
  };

  const handleVolumeChange = (e) => setVolume(e.target.value);

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  return (
    <Card className="p-4 rounded-2xl shadow-lg absolute sticky bottom-0 left-0 right-0">
      <CardContent>
        {trackList.length > 0 ? (
          <h3 className="text-xl font-semibold">{trackList[currentTrack].title} - {trackList[currentTrack].artist}</h3>
        ) : (
          <h3 className="text-xl font-semibold">No track available</h3>
        )}
        <audio
          ref={audioRef}
          src={trackList[currentTrack]?.streamUrl || undefined}
          volume={volume}
          onTimeUpdate={() => setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-full my-2"
        />
        <div className="flex items-center gap-4">
          <Button onClick={handlePrevious}><SkipBack /></Button>
          <Button onClick={togglePlayPause}>{isPlaying ? <Pause /> : <Play />}</Button>
          <Button onClick={handleNext}><SkipForward /></Button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20"
          />
          <Volume2 className="ml-2" />
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-medium">Suggested Songs</h4>
          {trackList.map((track, index) => (
            <p
              key={index}
              className="text-sm cursor-pointer hover:text-blue-500"
              onClick={() => setCurrentTrack(index)}
            >
              {track.title} - {track.artist}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
