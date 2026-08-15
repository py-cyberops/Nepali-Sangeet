/** Himalayan Letterpress: a physical-feeling 1:1 artwork frame with a branded no-image state. */
import { useEffect, useState } from "react";
import type { NowPlaying } from "@/lib/musicProvider";

type TrackArtworkProps = {
  track: NowPlaying;
};

export default function TrackArtwork({ track }: TrackArtworkProps) {
  const [failed, setFailed] = useState(!track.thumbnail);

  useEffect(() => {
    setFailed(!track.thumbnail);
  }, [track.thumbnail, track.videoId]);

  const alt = track.title !== "Sangeet Ghar" ? `Now playing: ${track.title}` : "Sangeet Ghar listening room artwork";

  return (
    <div className="track-artwork" aria-live="polite">
      {!failed && track.thumbnail ? (
        <img src={track.thumbnail} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <div className="artwork-fallback" role="img" aria-label="Sangeet Ghar listening room artwork">
          <span className="fallback-heritage" lang="ne" aria-hidden="true">संगीत घर</span>
          <span className="fallback-nepali">नेपाली संगीत</span>
          <span className="fallback-mark">SG</span>
          <span className="fallback-english">Timeless Nepali music</span>
        </div>
      )}
    </div>
  );
}
