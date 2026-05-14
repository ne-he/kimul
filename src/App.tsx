import { useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BootSequence from '@/components/BootSequence';
import CustomCursor from '@/components/CustomCursor';
import LevelBar from '@/components/LevelBar';
import ProgressBar from '@/components/ProgressBar';
import DataTicker from '@/components/DataTicker';
import HeroSection from '@/sections/HeroSection';
import JourneySection from '@/sections/JourneySection';
import AchievementSection from '@/sections/AchievementSection';
import ProjectsSection from '@/sections/ProjectsSection';
import ContactSection from '@/sections/ContactSection';
import EasterEggs from '@/components/EasterEggs';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = ['home', 'journey', 'achievements', 'projects', 'contact'];

function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [showBoot, setShowBoot] = useState(false);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem('bootCompleted');
    if (!hasBooted) {
      setShowBoot(true);
    } else {
      setBootComplete(true);
    }
  }, []);

  useEffect(() => {
    if (!bootComplete) return;

    // Create ScrollTrigger for each section
    SECTIONS.forEach((section, index) => {
      const el = document.getElementById(section);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(index),
        onEnterBack: () => setActiveSection(index),
      });

      // Section reveal animation
      gsap.fromTo(
        el.querySelector('.section-content'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [bootComplete]);

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem('bootCompleted', 'true');
    setShowBoot(false);
    // Small delay before showing content
    setTimeout(() => {
      setBootComplete(true);
    }, 100);
  }, []);

  const scrollToSection = useCallback((index: number) => {
    const el = document.getElementById(SECTIONS[index]);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative">
      {/* Boot Sequence */}
      {showBoot && <BootSequence onComplete={handleBootComplete} />}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Progress Bar */}
      {bootComplete && <ProgressBar />}

      {/* Data Ticker */}
      {bootComplete && <DataTicker />}

      {/* Level Bar Navigation */}
      {bootComplete && (
        <LevelBar
          activeIndex={activeSection}
          onNavigate={scrollToSection}
        />
      )}

      {/* Main Content */}
      {bootComplete && (
        <main>
          <HeroSection />
          <JourneySection />
          <AchievementSection />
          <ProjectsSection />
          <ContactSection />
        </main>
      )}

      {/* Easter Eggs */}
      <EasterEggs />
    </div>
  );
}

export default App;
