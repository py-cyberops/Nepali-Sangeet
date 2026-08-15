/**
 * Himalayan Letterpress playback boundary: the interface speaks in listening
 * states; this provider owns only permitted YouTube IFrame Player API behavior.
 */

export type PlaybackStatus =
  | "loading"
  | "initializing"
  | "ready"
  | "playing"
  | "paused"
  | "blocked"
  | "error";

export type NowPlaying = {
  title: string;
  artist?: string;
  videoId?: string;
  thumbnail?: string;
  playlistIndex?: number;
};

export type PlaybackSnapshot = {
  status: PlaybackStatus;
  ready: boolean;
  track: NowPlaying;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  loopingCurrent: boolean;
  shuffle: boolean;
};

export type MusicProviderEvents = {
  onStateChange: (snapshot: PlaybackSnapshot) => void;
};

export interface MusicProvider {
  initialize(container: HTMLElement): Promise<void>;
  play(): void;
  pause(): void;
  previous(): void;
  next(): void;
  setVolume(volume: number): void;
  toggleMute(): void;
  toggleLoopCurrent(): void;
  toggleShuffle(): void;
  seekTo(seconds: number): void;
  destroy(): void;
}

type YoutubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  previousVideo: () => void;
  nextVideo: () => void;
  playVideoAt: (index: number) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlaylist: () => string[];
  getPlaylistIndex: () => number;
  destroy: () => void;
  getVideoData: () => { title?: string; author?: string; video_id?: string };
};

type YoutubeNamespace = {
  Player: new (
    element: HTMLElement,
    config: {
      height: string;
      width: string;
      host: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: Record<string, (event?: { data?: number }) => void>;
    },
  ) => YoutubePlayer;
};

declare global {
  interface Window {
    YT?: YoutubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const INITIAL_VIDEO_ID = "LFR4eMQzUr4";
const PLAYLIST_ID = "PLAlwzcwDUjBA";

function thumbnailFor(videoId?: string) {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined;
}

const initialTrack: NowPlaying = {
  title: "Sangeet Ghar",
  videoId: INITIAL_VIDEO_ID,
  thumbnail: thumbnailFor(INITIAL_VIDEO_ID),
};

let iframeApiPromise: Promise<YoutubeNamespace> | undefined;

function loadYoutubeIframeApi(): Promise<YoutubeNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);

  if (!iframeApiPromise) {
    iframeApiPromise = new Promise((resolve, reject) => {
      const priorCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        priorCallback?.();
        if (window.YT?.Player) resolve(window.YT);
        else reject(new Error("YouTube player failed to initialise."));
      };

      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      );
      if (existingScript) return;

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => reject(new Error("Unable to load the music service."));
      document.head.appendChild(script);
    });
  }

  return iframeApiPromise;
}

/**
 * The playlist stays hidden. The provider offers only curated navigation and
 * never exposes a selectable track list to the visual interface.
 */
export class YoutubeMusicProvider implements MusicProvider {
  private player: YoutubePlayer | undefined;
  private autoplayTimer: number | undefined;
  private playbackGuard: "autoplay" | "manual" | undefined;
  private progressTimer: number | undefined;
  private lastPlaybackAttempt: "autoplay" | "manual" = "autoplay";
  private shuffleSequence: number[] = [];
  private shufflePointer = 0;
  private snapshot: PlaybackSnapshot = {
    status: "loading",
    ready: false,
    track: initialTrack,
    currentTime: 0,
    duration: 0,
    volume: 70,
    muted: false,
    loopingCurrent: false,
    shuffle: false,
  };

  constructor(private events: MusicProviderEvents) {}

  async initialize(container: HTMLElement): Promise<void> {
    this.emit({ status: "initializing" });

    try {
      const youtube = await loadYoutubeIframeApi();

      this.player = new youtube.Player(container, {
        // YouTube documents a 200px minimum player viewport. The mount stays
        // off-screen so the visible product remains the custom listening room.
        height: "200",
        width: "200",
        host: "https://www.youtube-nocookie.com",
        videoId: INITIAL_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          list: PLAYLIST_ID,
          listType: "playlist",
          modestbranding: 1,
          origin: window.location.origin,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => this.handleReady(),
          onStateChange: (event) => this.handleStateChange(event?.data),
          onAutoplayBlocked: () => this.handleAutoplayBlocked(),
          onError: () => this.handleError(),
        },
      });
    } catch {
      this.handleError();
    }
  }

  play() {
    this.clearAutoplayTimer();
    if (this.snapshot.muted) this.player?.unMute();
    this.player?.playVideo();
    this.emit({ muted: false, status: "loading" });
    this.startPlaybackGuard("manual");
  }

  pause() {
    this.clearAutoplayTimer();
    this.player?.pauseVideo();
  }

  previous() {
    if (this.snapshot.shuffle && this.shuffleSequence.length > 0) {
      const previousPointer = Math.max(0, this.shufflePointer - 1);
      this.shufflePointer = previousPointer;
      this.player?.playVideoAt(this.shuffleSequence[previousPointer]);
      return;
    }
    this.player?.previousVideo();
  }

  next() {
    if (this.snapshot.shuffle && this.shuffleSequence.length > 0) {
      if (this.shufflePointer >= this.shuffleSequence.length - 1) {
        this.buildShuffleSequence();
      } else {
        this.shufflePointer += 1;
      }
      this.player?.playVideoAt(this.shuffleSequence[this.shufflePointer]);
      return;
    }
    this.player?.nextVideo();
  }

  setVolume(volume: number) {
    const nextVolume = Math.max(0, Math.min(100, Math.round(volume)));
    this.player?.setVolume(nextVolume);
    if (nextVolume > 0 && this.player?.isMuted()) this.player.unMute();
    this.emit({ volume: nextVolume, muted: nextVolume === 0 ? true : this.safeMuted() });
  }

  toggleMute() {
    if (this.safeMuted()) {
      this.player?.unMute();
      this.emit({ muted: false });
    } else {
      this.player?.mute();
      this.emit({ muted: true });
    }
  }

  toggleLoopCurrent() {
    this.emit({ loopingCurrent: !this.snapshot.loopingCurrent });
  }

  toggleShuffle() {
    if (this.snapshot.shuffle) {
      this.shuffleSequence = [];
      this.shufflePointer = 0;
      this.emit({ shuffle: false });
      return;
    }

    if (this.buildShuffleSequence()) this.emit({ shuffle: true });
  }

  seekTo(seconds: number) {
    const duration = this.snapshot.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    const safeTime = Math.max(0, Math.min(duration, seconds));
    this.player?.seekTo(safeTime, true);
    this.emit({ currentTime: safeTime });
  }

  destroy() {
    this.clearAutoplayTimer();
    this.stopProgressTracking();
    this.player?.destroy();
    this.player = undefined;
  }

  private handleReady() {
    this.player?.setVolume(this.snapshot.volume);
    this.emit({ ready: true, status: "ready", muted: this.safeMuted() });
    this.refreshPlaybackDetails();
    this.attemptAutoplay();
  }

  private attemptAutoplay() {
    this.player?.playVideo();
    this.startPlaybackGuard("autoplay");
  }

  private handleAutoplayBlocked() {
    this.clearAutoplayTimer();
    this.playbackGuard = undefined;
    this.emit({ status: "blocked" });
  }

  private handleError() {
    this.clearAutoplayTimer();
    this.stopProgressTracking();
    this.emit({ status: "error" });
  }

  private handleStateChange(state: number | undefined) {
    if (state === undefined) return;

    if (state === 1) {
      this.clearAutoplayTimer();
      this.playbackGuard = undefined;
      this.emit({ status: "playing", ready: true });
      this.refreshPlaybackDetails();
      this.startProgressTracking();
      return;
    }

    if (state === 2) {
      this.stopProgressTracking();
      this.refreshPlaybackDetails();
      this.emit({ status: "paused" });
      return;
    }

    if (state === 0) {
      this.clearAutoplayTimer();
      this.stopProgressTracking();
      if (this.snapshot.loopingCurrent) {
        this.player?.seekTo(0, true);
        this.player?.playVideo();
      } else {
        this.next();
      }
      return;
    }

    if (state === 3 || state === -1) {
      this.emit({ status: "loading" });
      this.refreshPlaybackDetails();
      if (this.autoplayTimer === undefined && this.safeCurrentTime() < 0.5) {
        this.startPlaybackGuard(this.lastPlaybackAttempt);
      }
      return;
    }

    if (state === 5) {
      this.emit({ status: "ready", ready: true });
      this.refreshPlaybackDetails();
    }
  }

  private refreshPlaybackDetails() {
    if (!this.player) return;
    try {
      const data = this.player.getVideoData();
      const videoId = data.video_id || this.snapshot.track.videoId;
      const playlistIndex = this.safePlaylistIndex();
      const title = data.title?.trim() || "Sangeet Ghar";
      const artist = data.author?.trim() || undefined;
      const currentTime = this.safeCurrentTime();
      const duration = this.safeDuration();

      this.syncShufflePosition(playlistIndex);
      this.emit({
        track: {
          title,
          artist,
          videoId,
          thumbnail: thumbnailFor(videoId),
          playlistIndex,
        },
        currentTime,
        duration,
        volume: this.safeVolume(),
        muted: this.safeMuted(),
      });
    } catch {
      // Metadata can be withheld without harming the fallback listening state.
    }
  }

  private startProgressTracking() {
    this.stopProgressTracking();
    this.progressTimer = window.setInterval(() => {
      this.emit({
        currentTime: this.safeCurrentTime(),
        duration: this.safeDuration(),
        volume: this.safeVolume(),
        muted: this.safeMuted(),
      });
    }, 850);
  }

  private stopProgressTracking() {
    if (this.progressTimer !== undefined) {
      window.clearInterval(this.progressTimer);
      this.progressTimer = undefined;
    }
  }

  private buildShuffleSequence() {
    const playlist = this.safePlaylist();
    const currentIndex = this.safePlaylistIndex();
    if (playlist.length < 2 || currentIndex === undefined) return false;

    const remaining = playlist.map((_, index) => index).filter((index) => index !== currentIndex);
    for (let index = remaining.length - 1; index > 0; index -= 1) {
      const replacement = Math.floor(Math.random() * (index + 1));
      [remaining[index], remaining[replacement]] = [remaining[replacement], remaining[index]];
    }

    this.shuffleSequence = [currentIndex, ...remaining];
    this.shufflePointer = 0;
    return true;
  }

  private syncShufflePosition(index?: number) {
    if (!this.snapshot.shuffle || index === undefined) return;
    const matchedPointer = this.shuffleSequence.indexOf(index);
    if (matchedPointer >= 0) this.shufflePointer = matchedPointer;
  }

  private emit(patch: Partial<PlaybackSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    this.events.onStateChange(this.snapshot);
  }

  private safePlaylist() {
    try { return this.player?.getPlaylist() || []; } catch { return []; }
  }
  private safePlaylistIndex() {
    try { return this.player?.getPlaylistIndex(); } catch { return undefined; }
  }
  private safeCurrentTime() {
    try { return this.player?.getCurrentTime() || 0; } catch { return 0; }
  }
  private safeDuration() {
    try { return this.player?.getDuration() || 0; } catch { return 0; }
  }
  private safeVolume() {
    try { return this.player?.getVolume() ?? this.snapshot.volume; } catch { return this.snapshot.volume; }
  }
  private safeMuted() {
    try { return this.player?.isMuted() || false; } catch { return this.snapshot.muted; }
  }
  private clearAutoplayTimer() {
    if (this.autoplayTimer !== undefined) {
      window.clearTimeout(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  private startPlaybackGuard(mode: "autoplay" | "manual") {
    this.clearAutoplayTimer();
    this.lastPlaybackAttempt = mode;
    this.playbackGuard = mode;
    this.autoplayTimer = window.setTimeout(() => {
      if (this.snapshot.status !== "playing") {
        this.emit({ status: mode === "autoplay" ? "blocked" : "error" });
      }
      this.playbackGuard = undefined;
    }, mode === "autoplay" ? 1800 : 2400);
  }
}
