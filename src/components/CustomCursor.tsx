import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      /* Ring follows pointer immediately — lag was only intended for particle spring-back, not UI */
      ring.style.left = `${mouseX}px`;
      ring.style.top = `${mouseY}px`;
    };

    const handleMouseEnterLink = () => {
      ring.style.width = '42px';
      ring.style.height = '42px';
      ring.style.borderColor = 'rgba(0, 255, 204, 0.6)';
    };

    const handleMouseLeaveLink = () => {
      ring.style.width = '30px';
      ring.style.height = '30px';
      ring.style.borderColor = 'rgba(0, 255, 204, 0.35)';
    };

    window.addEventListener('mousemove', handleMouseMove);

    const links = document.querySelectorAll('a, button, [role="button"]');
    links.forEach((link) => {
      link.addEventListener('mouseenter', handleMouseEnterLink);
      link.addEventListener('mouseleave', handleMouseLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      links.forEach((link) => {
        link.removeEventListener('mouseenter', handleMouseEnterLink);
        link.removeEventListener('mouseleave', handleMouseLeaveLink);
      });
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[100]"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'rgba(0, 255, 204, 0.9)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 12px rgba(0, 255, 204, 0.6), 0 0 24px rgba(0, 255, 204, 0.2)',
          transition: 'transform 0.05s',
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[99]"
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: '1px solid rgba(0, 255, 204, 0.35)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
        }}
      />
    </>
  );
}
