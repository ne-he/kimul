import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;

    gsap.to(barRef.current, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === document.body) t.kill();
      });
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[1px]"
      style={{ width: '100%', background: 'rgba(0, 255, 204, 0.1)' }}
    >
      <div
        ref={barRef}
        className="h-full"
        style={{
          width: '0%',
          background: 'var(--cyan)',
          boxShadow: '0 0 8px rgba(0, 255, 204, 0.5)',
        }}
      />
    </div>
  );
}
