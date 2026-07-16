export const YOUTUBE_LOOP_BUFFER_SEC = 0.35;

export interface YoutubePlayerInstance {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  mute(): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

interface YoutubePlayerConstructor {
  new (
    element: HTMLElement | string,
    options: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YoutubePlayerInstance }) => void;
        onStateChange?: (event: { data: number; target: YoutubePlayerInstance }) => void;
      };
    }
  ): YoutubePlayerInstance;
}

interface YoutubeIframeApi {
  Player: YoutubePlayerConstructor;
  PlayerState: {
    ENDED: number;
  };
}

type WindowWithYoutube = Window & {
  YT?: YoutubeIframeApi;
  onYouTubeIframeAPIReady?: () => void;
};

let apiPromise: Promise<YoutubeIframeApi> | null = null;

export function loadYoutubeIframeApi(): Promise<YoutubeIframeApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube API is only available in the browser'));
  }

  const win = window as WindowWithYoutube;
  if (win.YT?.Player) {
    return Promise.resolve(win.YT);
  }

  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const previousReady = win.onYouTubeIframeAPIReady;
      win.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        if (win.YT?.Player) {
          resolve(win.YT);
          return;
        }
        reject(new Error('YouTube iframe API loaded without Player constructor'));
      };

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => reject(new Error('Failed to load YouTube iframe API'));
      document.head.appendChild(script);
    });
  }

  return apiPromise;
}

export function createSeamlessLoopHandlers(YT: YoutubeIframeApi) {
  let loopTimer: ReturnType<typeof setInterval> | null = null;

  const clearLoopTimer = () => {
    if (loopTimer) {
      clearInterval(loopTimer);
      loopTimer = null;
    }
  };

  return {
    onReady: (event: { target: YoutubePlayerInstance }) => {
      event.target.mute();
      clearLoopTimer();
      loopTimer = setInterval(() => {
        const duration = event.target.getDuration();
        if (!duration || duration <= YOUTUBE_LOOP_BUFFER_SEC) return;

        const current = event.target.getCurrentTime();
        if (current >= duration - YOUTUBE_LOOP_BUFFER_SEC) {
          event.target.seekTo(0, true);
        }
      }, 100);
    },
    onStateChange: (event: { data: number; target: YoutubePlayerInstance }) => {
      if (event.data === YT.PlayerState.ENDED) {
        event.target.seekTo(0, true);
        event.target.playVideo();
      }
    },
    destroy: clearLoopTimer,
  };
}
