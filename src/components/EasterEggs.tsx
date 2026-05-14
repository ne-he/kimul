import { useEffect, useState, useRef } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const ASCII_ART = `
    .-''''-.
   /        \
  |  O    O  |
  |    __    |
   \
  '-......-'
   SATURN PROTOCOL
   v21.04.26
`;

export default function EasterEggs() {
  const [devMode, setDevMode] = useState(false);
  const [showHobbies, setShowHobbies] = useState(false);
  const konamiIndex = useRef(0);
  const keyBuffer = useRef<string[]>([]);

  useEffect(() => {
    // Console ASCII art
    console.log(
      '%c' + ASCII_ART,
      'color: #00ffcc; font-family: monospace; font-size: 10px;'
    );
    console.log(
      '%cAh, a fellow developer. Check the source — it\'s clean, I promise.',
      'color: #00ffcc; font-style: italic;'
    );
    console.log(
      '%cUPLINK ESTABLISHED. NEHEMIAH_CORP SECURITY PROTOCOL ACTIVE.',
      'color: #ff6644; font-weight: bold;'
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      keyBuffer.current.push(e.key.toLowerCase());
      if (keyBuffer.current.length > 20) keyBuffer.current.shift();

      // Konami code
      if (e.key === KONAMI_CODE[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === KONAMI_CODE.length) {
          setDevMode(true);
          konamiIndex.current = 0;
          setTimeout(() => setDevMode(false), 5000);
        }
      } else {
        konamiIndex.current = 0;
      }

      // SATURN code
      const lastKeys = keyBuffer.current.slice(-6).join('');
      if (lastKeys === 'saturn') {
        setShowHobbies(true);
        setTimeout(() => setShowHobbies(false), 8000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tab title scramble
  useEffect(() => {
    const originalTitle = 'Nehemiah — Saturn Protocol';
    const scrambleVariants = [
      'N3H3M1AH — S4TURN',
      'N€H€M1AH — PR0T0C0L',
      'N--H--M--A--H — S4TURN',
      'N3H3M14H — C0M3 B4CK',
    ];

    let interval: ReturnType<typeof setInterval>;

    const handleVisibility = () => {
      if (document.hidden) {
        let i = 0;
        interval = setInterval(() => {
          document.title = scrambleVariants[i % scrambleVariants.length];
          i++;
        }, 800);
      } else {
        clearInterval(interval);
        document.title = originalTitle;
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, []);

  if (devMode) {
    return (
      <div className="dev-mode">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ color: '#00ffcc' }}>
            DEV MODE ACTIVATED
          </div>
          <div className="text-sm space-y-2">
            <div>FPS: {Math.round(58 + Math.random() * 4)}</div>
            <div>Memory: {(Math.random() * 50 + 100).toFixed(1)} MB</div>
            <div>Neural Mesh Integrity: 98%</div>
            <div>Particle Count: 12,847</div>
            <div>Planet Coordinates: 6.2088°N, 106.8456°E</div>
          </div>
        </div>
      </div>
    );
  }

  if (showHobbies) {
    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: 'rgba(4, 8, 16, 0.95)' }}
      >
        <div
          className="max-w-lg w-full mx-4 p-8 rounded-lg"
          style={{
            background: 'rgba(0, 255, 204, 0.05)',
            border: '1px solid rgba(0, 255, 204, 0.2)',
          }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: '#00ffcc', fontFamily: 'var(--font-mono)' }}
          >
            LEVEL 06: LIFE OUTSIDE THE VOID
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span style={{ color: '#00ffcc' }}>♪</span>
              <div>
                <div style={{ color: 'var(--starlight)' }}>Music</div>
                <div style={{ color: 'var(--stardust)', fontSize: 13 }}>
                  Lo-fi hip hop while coding, jazz for deep focus
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span style={{ color: '#00ffcc' }}>⚽</span>
              <div>
                <div style={{ color: 'var(--starlight)' }}>Sports</div>
                <div style={{ color: 'var(--stardust)', fontSize: 13 }}>
                  Futsal weekly, running for mental clarity
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span style={{ color: '#00ffcc' }}>📚</span>
              <div>
                <div style={{ color: 'var(--starlight)' }}>Reading</div>
                <div style={{ color: 'var(--stardust)', fontSize: 13 }}>
                  Sci-fi, tech biographies, AI research papers
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span style={{ color: '#00ffcc' }}>🎮</span>
              <div>
                <div style={{ color: 'var(--starlight)' }}>Gaming</div>
                <div style={{ color: 'var(--stardust)', fontSize: 13 }}>
                  Strategy games, puzzle solving, space exploration sims
                </div>
              </div>
            </div>
          </div>
          <div
            className="mt-6 text-xs"
            style={{ color: 'rgba(0, 255, 204, 0.4)', fontFamily: 'var(--font-mono)' }}
          >
            This hidden level unlocks by typing &quot;SATURN&quot; anywhere on the page.
          </div>
        </div>
      </div>
    );
  }

  return null;
}
