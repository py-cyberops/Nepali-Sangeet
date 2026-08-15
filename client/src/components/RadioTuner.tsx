import { useEffect, useRef, useState } from "react";

const TUNING_SOUND = "/manus-storage/sangeet-ghar-tuning-click_f70ab9cc.mp3";
const MIN_FREQUENCY = 88;
const MAX_FREQUENCY = 108;

const tuningMessage = (frequency: number) => {
  if (frequency < 92) return "संगीत खोज्दै... · Searching for a song...";
  if (frequency < 96) return "काठमाडौं · Kathmandu";
  if (frequency < 101) return "पुराना नेपाली गीत · Old Nepali songs";
  if (frequency < 105) return "संगीत घर · Sangeet Ghar";
  return "फेरि सुन्नुहोस् · Keep listening";
};

type RadioTunerProps = {
  muted: boolean;
  volume: number;
  onActivityChange: (active: boolean) => void;
};

export default function RadioTuner({ muted, volume, onActivityChange }: RadioTunerProps) {
  const [frequency, setFrequency] = useState(96.6);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState(tuningMessage(96.6));
  const pointerX = useRef<number | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const lastSoundAt = useRef(0);
  const settleTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    audio.current?.pause();
  }, []);

  const clampFrequency = (value: number) => Math.max(MIN_FREQUENCY, Math.min(MAX_FREQUENCY, value));

  const makeSound = () => {
    if (muted || volume === 0) return;
    const now = Date.now();
    if (now - lastSoundAt.current < 120) return;
    lastSoundAt.current = now;
    const accent = audio.current ?? new Audio(TUNING_SOUND);
    audio.current = accent;
    accent.pause();
    accent.currentTime = 0;
    accent.volume = Math.min(0.11, Math.max(0.025, volume / 100 * 0.11));
    void accent.play().catch(() => undefined);
    window.setTimeout(() => {
      accent.pause();
      accent.currentTime = 0;
    }, 1100);
  };

  const updateFrequency = (next: number, makeNoise = false) => {
    const safe = clampFrequency(next);
    setFrequency(safe);
    setMessage(tuningMessage(safe));
    if (makeNoise) makeSound();
  };

  const startInteraction = (clientX?: number) => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    pointerX.current = clientX ?? null;
    setDragging(true);
    onActivityChange(true);
    makeSound();
  };

  const settle = () => {
    pointerX.current = null;
    setDragging(false);
    setFrequency(current => {
      const snapped = Math.round(current * 5) / 5;
      setMessage(tuningMessage(snapped));
      return snapped;
    });
    settleTimer.current = window.setTimeout(() => onActivityChange(false), 900);
  };

  const angle = (frequency - 98) * 5.4;
  const needle = ((frequency - MIN_FREQUENCY) / (MAX_FREQUENCY - MIN_FREQUENCY)) * 100;

  return (
    <section className={`radio-tuner ${dragging ? "is-turning" : ""}`} aria-label="Vintage Nepali radio tuning">
      <div className="tuning-window" aria-hidden="true">
        <div className="window-topline"><span>रेडियो</span><span>FM · AM</span></div>
        <div className="frequency-scale"><span>88</span><span>92</span><span>96</span><span>100</span><span>104</span><span>108</span></div>
        <span className="tuning-needle" style={{ left: `${needle}%` }} />
        <p className="frequency-readout">FM <strong>{frequency.toFixed(1)}</strong></p>
      </div>
      <div className="dial-stage">
        <span className="dial-note">घुमाउनुहोस्</span>
        <div
          className="tuning-dial"
          role="slider"
          tabIndex={0}
          aria-label="Old radio tuning dial"
          aria-valuemin={MIN_FREQUENCY}
          aria-valuemax={MAX_FREQUENCY}
          aria-valuenow={Number(frequency.toFixed(1))}
          aria-valuetext={`FM ${frequency.toFixed(1)}. ${tuningMessage(frequency)}`}
          onPointerDown={event => {
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              // Synthetic or platform-specific pointer events may not own a capturable pointer.
            }
            startInteraction(event.clientX);
          }}
          onPointerMove={event => {
            if (pointerX.current === null) return;
            const distance = event.clientX - pointerX.current;
            if (Math.abs(distance) < 2) return;
            pointerX.current = event.clientX;
            updateFrequency(frequency + distance * 0.045, true);
          }}
          onPointerUp={settle}
          onPointerCancel={settle}
          onKeyDown={event => {
            const step = event.shiftKey ? 1 : 0.2;
            if (event.key === "ArrowRight" || event.key === "ArrowUp") {
              event.preventDefault(); startInteraction(); updateFrequency(frequency + step, true); settle();
            }
            if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
              event.preventDefault(); startInteraction(); updateFrequency(frequency - step, true); settle();
            }
            if (event.key === "Home") { event.preventDefault(); startInteraction(); updateFrequency(MIN_FREQUENCY, true); settle(); }
            if (event.key === "End") { event.preventDefault(); startInteraction(); updateFrequency(MAX_FREQUENCY, true); settle(); }
          }}
          style={{ "--dial-angle": `${angle}deg` } as React.CSSProperties}
        >
          <span className="dial-ridge dial-ridge-one" /><span className="dial-ridge dial-ridge-two" />
          <span className="dial-ridge dial-ridge-three" /><span className="dial-grip" />
        </div>
        <span className="speaker-pulse" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <p className="tuner-message" aria-live="polite">{message}</p>
    </section>
  );
}
