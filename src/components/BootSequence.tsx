import { useState, useEffect, useRef, useCallback } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: 'SATURN PROTOCOL v21.04.26 initializing...', delay: 0 },
  { text: 'Loading neural mesh...', delay: 400 },
  { text: 'Calibrating particle field...', delay: 800 },
  { text: 'Establishing uplink...', delay: 1200 },
  { text: 'Rendering identity matrix...', delay: 1600 },
  { text: 'Compiling achievement data...', delay: 2000 },
  { text: 'System ready.', delay: 2400, isSuccess: true },
];

const WELCOME_LINE = { text: 'WELCOME, TRAVELER.', delay: 2800, isWelcome: true };

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [typedTexts, setTypedTexts] = useState<string[]>(new Array(BOOT_LINES.length + 1).fill(''));
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeTyped, setWelcomeTyped] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const typeText = useCallback((text: string, index: number, isWelcome = false) => {
    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      if (isWelcome) {
        setWelcomeTyped(text.slice(0, charIndex));
      } else {
        setTypedTexts((prev) => {
          const next = [...prev];
          next[index] = text.slice(0, charIndex);
          return next;
        });
      }
      if (charIndex >= text.length) {
        clearInterval(interval);
      }
    }, 40);
    return interval;
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    // Show each boot line
    BOOT_LINES.forEach((line, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, index]);
          intervals.push(typeText(line.text, index));
        }, line.delay)
      );
    });

    // Show welcome line
    timers.push(
      setTimeout(() => {
        setShowWelcome(true);
        intervals.push(typeText(WELCOME_LINE.text, BOOT_LINES.length, true));
      }, WELCOME_LINE.delay)
    );

    // Fade out
    timers.push(
      setTimeout(() => {
        setFadeOut(true);
      }, 4000)
    );

    // Complete
    timers.push(
      setTimeout(() => {
        onComplete();
      }, 4800)
    );

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [onComplete, typeText]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[1000] flex items-center justify-center transition-opacity duration-800 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: '#040810' }}
    >
      <div className="font-mono text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
        {BOOT_LINES.map((line, index) => (
          <div
            key={index}
            className={`transition-opacity duration-300 ${
              visibleLines.includes(index) ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ color: line.isSuccess ? '#00ffcc' : '#4a9' }}
          >
            <span>{'>'}</span>{' '}
            {typedTexts[index]}
            {visibleLines.includes(index) &&
              typedTexts[index].length < line.text.length && (
                <span className="boot-cursor">_</span>
              )}
          </div>
        ))}

        {/* Welcome line */}
        <div
          className={`mt-4 transition-opacity duration-300 ${
            showWelcome ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ color: '#00ffcc' }}
        >
          <span className="text-lg tracking-wider">{welcomeTyped}</span>
          {showWelcome && welcomeTyped.length < WELCOME_LINE.text.length && (
            <span className="boot-cursor" style={{ color: '#00ffcc' }}>
              _
            </span>
          )}
          {welcomeTyped.length >= WELCOME_LINE.text.length && (
            <span className="boot-cursor" style={{ color: '#00ffcc' }}>
              _
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
