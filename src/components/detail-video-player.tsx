"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

interface DetailVideoPlayerProps {
  src: string;
  title: string;
}

export function DetailVideoPlayer({ src, title }: DetailVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    video.loop = loop;
  }, [speed, loop]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function cycleSpeed() {
    setSpeed((current) => (current === 1 ? 1.5 : current === 1.5 ? 2 : 1));
  }

  return (
    <div className="group relative w-full overflow-hidden bg-black" style={{ maxHeight: "80vh" }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop={loop}
        muted={muted}
        playsInline
        className="relative z-10 mx-auto h-auto w-full"
        aria-label={title}
      />

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="font-mono text-xs text-white/80">00:00</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={cycleSpeed}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-white/10 px-2 text-xs text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Toggle playback speed"
          >
            {speed}×
          </button>
          <button
            type="button"
            onClick={() => setLoop((value) => !value)}
            className="inline-flex h-8 items-center justify-center rounded-full bg-white/10 px-3 text-xs text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label={loop ? "Disable loop" : "Enable loop"}
          >
            {loop ? "Loop on" : "Loop off"}
          </button>
        </div>
        <div className="font-mono text-xs text-white/80">00:00</div>
      </div>
    </div>
  );
}
