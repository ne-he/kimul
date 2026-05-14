import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'HOME', section: 'home' },
  { label: 'JOURNEY', section: 'journey' },
  { label: 'ACHIEVE', section: 'achievements' },
  { label: 'PROJECTS', section: 'projects' },
  { label: 'CONTACT', section: 'contact' },
];

interface LevelBarProps {
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export default function LevelBar({ activeIndex, onNavigate }: LevelBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {NAV_ITEMS.map((item, index) => {
        const isActive = index === activeIndex;
        const isHovered = index === hoveredIndex;
        const isVisited = index < activeIndex;

        return (
          <button
            key={item.section}
            onClick={() => onNavigate(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative flex flex-col items-center gap-1 group"
            style={{ cursor: 'none' }}
          >
            {/* Circle */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={{
                background: isActive
                  ? 'rgba(0, 255, 204, 0.9)'
                  : isVisited
                  ? 'rgba(0, 255, 204, 0.4)'
                  : 'transparent',
                border:
                  isActive
                    ? '2px solid rgba(0, 255, 204, 0.9)'
                    : isHovered
                    ? '2px solid rgba(0, 255, 204, 0.6)'
                    : '2px solid rgba(0, 255, 204, 0.25)',
                color: isActive ? '#040810' : 'rgba(0, 255, 204, 0.6)',
                boxShadow: isActive
                  ? '0 0 12px rgba(0, 255, 204, 0.4)'
                  : isHovered
                  ? '0 0 8px rgba(0, 255, 204, 0.2)'
                  : 'none',
              }}
            >
              {String(index).padStart(2, '0')}
            </div>

            {/* Label */}
            <span
              className="text-[9px] tracking-widest transition-all duration-300 absolute -bottom-4 whitespace-nowrap"
              style={{
                color: isActive
                  ? 'rgba(0, 255, 204, 0.8)'
                  : isHovered
                  ? 'rgba(0, 255, 204, 0.5)'
                  : 'rgba(0, 255, 204, 0.25)',
                opacity: isActive || isHovered ? 1 : 0.6,
              }}
            >
              {item.label}
            </span>

            {/* Connector line */}
            {index < NAV_ITEMS.length - 1 && (
              <div
                className="absolute top-4 left-8 w-3 h-[1px] transition-all duration-500"
                style={{
                  background:
                    isVisited || (isActive && index === activeIndex)
                      ? 'rgba(0, 255, 204, 0.4)'
                      : 'rgba(0, 255, 204, 0.1)',
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
