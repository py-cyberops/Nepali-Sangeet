/**
 * Himalayan Letterpress: a quiet Nepali cultural folio, combining handmade
 * paper, inky editorial type, and a restrained, complete listening player.
 */
import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  Repeat2,
  RotateCcw,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import RadioTuner from "@/components/RadioTuner";
import TrackArtwork from "@/components/TrackArtwork";
import { countryName, useRoomPresence } from "@/hooks/useRoomPresence";
import {
  type PlaybackSnapshot,
  YoutubeMusicProvider,
} from "@/lib/musicProvider";

const HERO_ART = "/manus-storage/sangeet-ghar-vintage-radio-room_451ded6e.webp";

const initialState: PlaybackSnapshot = {
  status: "loading",
  ready: false,
  track: {
    title: "Sangeet Ghar",
    videoId: "LFR4eMQzUr4",
    thumbnail: "https://i.ytimg.com/vi/LFR4eMQzUr4/hqdefault.jpg",
  },
  currentTime: 0,
  duration: 0,
  volume: 70,
  muted: false,
  loopingCurrent: false,
  shuffle: false,
};

function stateCopy(status: PlaybackSnapshot["status"]) {
  switch (status) {
    case "playing": return "Music is playing";
    case "paused": return "Paused for a moment";
    case "blocked": return "Tap to let the room play";
    case "error": return "The room is quiet";
    case "initializing": return "Preparing the listening room";
    case "loading": return "Loading the room";
    default: return "Ready when you are";
  }
}

function formatTime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export default function Home() {
  const playerMount = useRef<HTMLDivElement>(null);
  const provider = useRef<YoutubeMusicProvider | null>(null);
  const [player, setPlayer] = useState<PlaybackSnapshot>(initialState);
  const [confirmedListening, setConfirmedListening] = useState(false);
  const [listenerEligible, setListenerEligible] = useState(false);
  const [dialActive, setDialActive] = useState(false);
  const room = useRoomPresence(confirmedListening);

  useEffect(() => {
    if (!playerMount.current) return;
    const nextProvider = new YoutubeMusicProvider({ onStateChange: setPlayer });
    provider.current = nextProvider;
    void nextProvider.initialize(playerMount.current);
    return () => nextProvider.destroy();
  }, []);

  useEffect(() => {
    if (!listenerEligible || player.status !== "playing") {
      setConfirmedListening(false);
      return;
    }
    const timer = window.setTimeout(() => setConfirmedListening(true), 4_000);
    return () => window.clearTimeout(timer);
  }, [listenerEligible, player.status]);

  const isPlaying = player.status === "playing";
  const isUnavailable = player.status === "error";
  const navigationDisabled = !player.ready || isUnavailable;
  const progressAvailable = Number.isFinite(player.duration) && player.duration > 0;

  function handlePrimaryAction() {
    if (isUnavailable) {
      window.location.reload();
      return;
    }
    if (isPlaying) provider.current?.pause();
    else {
      setListenerEligible(true);
      provider.current?.play();
    }
  }

  return (
    <div className="site-shell">
      <div className="paper-grain" aria-hidden="true" />
      <div className="hidden-player" aria-hidden="true" ref={playerMount} />

      <SiteHeader />

      <main>
        <section className="listening-folio" id="listen" aria-labelledby="hero-title">
          <div className="folio-rule folio-rule-top" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow">Nepal · World</p>
            <h1 id="hero-title">Nepali Classical Music <em>that stays with you.</em></h1>
            <p className="intro-copy">Timeless Nepali music, already playing in the background. For old memories, new discoveries, and the spaces in between.</p>
            <p className="nepali-line" lang="ne">पुराना गीत, सधैंका लागि</p>
          </div>
          <div className="hero-atmosphere" aria-hidden="true"><img src={HERO_ART} alt="" /><div className="image-wash" /></div>

          <article className={`radio-object status-${player.status} ${dialActive ? "is-tuning" : ""}`} aria-labelledby="now-playing-title">
            <div className="radio-registration" aria-hidden="true"><span /><span /><span /></div>
            <div className="radio-label-row"><p className="player-kicker">Now playing</p><span className="side-index">SG—01</span></div>

            <div className="radio-stage">
              <div className="artwork-seal"><span className="seal-caption" aria-hidden="true">SG · Radio</span><TrackArtwork track={player.track} /></div>
              <div className="track-copy">
                <p className="status-line" role="status" aria-live="polite"><span className="status-pin" aria-hidden="true" />{stateCopy(player.status)}</p>
                <h2 id="now-playing-title">{player.track.title}</h2>
                {player.track.artist ? <p>{player.track.artist}</p> : <p className="quiet-credit">Timeless Nepali Music</p>}
              </div>
            </div>

            <aside className="room-presence" aria-label="Shared listening room presence">
              <p className="presence-kicker"><span aria-hidden="true" />{room.snapshot?.count && room.snapshot.count > 0 ? "The room is alive" : "Shared listening"}</p>
              {room.presenceUnavailable ? (
                <p className="presence-count">Listening room</p>
              ) : room.snapshot?.count && room.snapshot.count > 0 ? (
                <p className="presence-count" aria-live="polite">{room.snapshot.count} {room.snapshot.count === 1 ? "listener" : "listeners"} in the room</p>
              ) : (
                <p className="presence-count">Listening now</p>
              )}
              {room.snapshot?.countries && room.snapshot.countries.length > 0 ? (
                <details className="presence-countries">
                  <summary>Listening from {room.snapshot.countries.length} {room.snapshot.countries.length === 1 ? "country" : "countries"}</summary>
                  <p>{room.snapshot.countries.map(countryName).join(" · ")}</p>
                </details>
              ) : null}
            </aside>

            <RadioTuner
              muted={player.muted}
              volume={player.volume}
              onActivityChange={setDialActive}
            />

            <div className="progress-row">
              <span aria-hidden="true">{formatTime(player.currentTime)}</span>
              <input
                type="range" min="0" max={progressAvailable ? player.duration : 1} step="1"
                value={progressAvailable ? Math.min(player.currentTime, player.duration) : 0}
                disabled={!progressAvailable || navigationDisabled}
                onChange={(event) => provider.current?.seekTo(Number(event.target.value))}
                aria-label={`Track progress: ${formatTime(player.currentTime)} of ${formatTime(player.duration)}`}
              />
              <span aria-hidden="true">{formatTime(player.duration)}</span>
            </div>

            <div className="player-controls" aria-label="Music playback controls">
              <button className="round-control" type="button" onClick={() => provider.current?.previous()} disabled={navigationDisabled} aria-label="Previous track"><SkipBack strokeWidth={1.65} aria-hidden="true" /></button>
              <button className="primary-control" type="button" onClick={handlePrimaryAction} disabled={!player.ready && !isUnavailable} aria-label={isUnavailable ? "Try loading music again" : isPlaying ? "Pause music" : "Play music"}>
                {isUnavailable ? <RotateCcw strokeWidth={1.6} aria-hidden="true" /> : isPlaying ? <Pause fill="currentColor" strokeWidth={1.6} aria-hidden="true" /> : <Play fill="currentColor" strokeWidth={1.6} aria-hidden="true" />}
                <span>{isUnavailable ? "Try again" : isPlaying ? "Pause" : "Play"}</span>
              </button>
              <button className="round-control" type="button" onClick={() => provider.current?.next()} disabled={navigationDisabled} aria-label="Next track"><SkipForward strokeWidth={1.65} aria-hidden="true" /></button>
            </div>

            <div className="listener-tools" aria-label="Listening preferences">
              <button className={`tool-button ${player.muted ? "is-active" : ""}`} type="button" onClick={() => provider.current?.toggleMute()} disabled={navigationDisabled} aria-pressed={player.muted} aria-label={player.muted ? "Unmute music" : "Mute music"}>
                {player.muted ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}<span>{player.muted ? "Muted" : "Volume"}</span>
              </button>
              <label className="volume-control"><span className="sr-only">Volume</span><input type="range" min="0" max="100" step="1" value={player.volume} disabled={navigationDisabled} onChange={(event) => provider.current?.setVolume(Number(event.target.value))} aria-label={`Volume ${player.volume}%`} /><output aria-hidden="true">{player.volume}</output></label>
              <button className={`tool-button ${player.shuffle ? "is-active" : ""}`} type="button" onClick={() => provider.current?.toggleShuffle()} disabled={navigationDisabled} aria-pressed={player.shuffle} aria-label={player.shuffle ? "Shuffle on" : "Shuffle off"}><Shuffle size={15} aria-hidden="true" /><span>Shuffle</span></button>
              <button className={`tool-button ${player.loopingCurrent ? "is-active" : ""}`} type="button" onClick={() => provider.current?.toggleLoopCurrent()} disabled={navigationDisabled} aria-pressed={player.loopingCurrent} aria-label={player.loopingCurrent ? "Loop current track" : "Loop off"}><Repeat2 size={15} aria-hidden="true" /><span>Loop</span></button>
            </div>
            <p className="player-note">{isUnavailable ? "Music could not be started right now. Try again." : player.status === "blocked" ? "Your first tap will start the music." : "A changing selection from the archive."}</p>
          </article>
          <div className="folio-rule folio-rule-bottom" aria-hidden="true" />
        </section>

        <section className="about-listening" aria-labelledby="about-title">
          <div className="about-index" aria-hidden="true">01</div>
          <div><p className="eyebrow">The collection</p><h2 id="about-title">Timeless Nepali music,<br />made for listening.</h2></div>
          <div className="about-copy"><p>Sangeet Ghar is a small, uninterrupted place for Nepali classical music, traditional Nepali songs, and the old songs that remain close across years and borders.</p><p>The selection changes quietly. There is no library to search and no queue to manage—only the next song, ready when the moment is right.</p></div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
