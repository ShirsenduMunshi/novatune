import BollywoodLoveSongs from "@/components/BollywoodLoveSongs";
import BreakupSongs from "@/components/BreakupSongs";
import Hero from "@/components/Hero";
import MusicPlayer from "@/components/MusicPlayer";
import NinetiesHits from "@/components/NinetiesHits";
import TrendingMusics from "@/components/TrendingMusics";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MusicSearch() {
  return (
    <>
      <div className="hero-background relative">
        <Hero />
        <br />
        <div className="inset-0 flex flex-col items-center justify-center text-center backdrop-blur bg-background/50 w-full p-5">
          <h1 className="text-2xl font-bold  w-full">Trending Musics</h1>
          <p className="text-lg max-w-xl mx-auto md:mx-0  w-full">
            Discover the latest hits and explore new genres.
          </p>
          <div className="flex justify-center mt-4">
            <Button asChild size="lg"><Link href={"/SearchPage"}> Search a song 🎵</Link></Button>
          </div>
        </div>
      </div>
      <div id="trending" className="container mx-auto flex flex-col items-center justify-center p-5">
        <TrendingMusics />
      </div>
      <br />
      <div className="container mx-auto flex flex-col items-center justify-center p-5">
        <BollywoodLoveSongs />
      </div>
      <div className="container mx-auto flex flex-col items-center justify-center p-5">
        <NinetiesHits />
      </div>
      <div className="container mx-auto flex flex-col items-center justify-center p-5">
        <BreakupSongs />
      </div>
      <MusicPlayer />
    </>
  );
}