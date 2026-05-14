import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Achievement {
  id: number;
  title: string;
  location: string;
  lat: number;
  lon: number;
  year: string;
  description: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 1, title: 'Data Science Bootcamp Graduate', location: 'Jakarta, ID', lat: -6.2088, lon: 106.8456, year: '2022', description: 'Intensive 3-month data science program' },
  { id: 2, title: 'Kaggle Competition Top 10%', location: 'Online', lat: 37.7749, lon: -122.4194, year: '2023', description: 'Global machine learning competition' },
  { id: 3, title: 'Published Research Paper', location: 'Singapore, SG', lat: 1.3521, lon: 103.8198, year: '2023', description: 'AI/ML research in academic journal' },
  { id: 4, title: 'Apple Developer Academy', location: 'Jakarta, ID', lat: -6.2088, lon: 106.8456, year: '2025', description: 'iOS development & design program' },
  { id: 5, title: 'Hackathon Winner', location: 'Bandung, ID', lat: -6.9175, lon: 107.6191, year: '2024', description: '48-hour coding competition champion' },
  { id: 6, title: 'ML Certification', location: 'Stanford, US', lat: 37.4275, lon: -122.1697, year: '2023', description: 'Stanford Online ML specialization' },
  { id: 7, title: 'Open Source Contributor', location: 'Global', lat: 51.5074, lon: -0.1278, year: '2024', description: '500+ contributions to ML libraries' },
  { id: 8, title: 'Data Viz Competition', location: 'Tokyo, JP', lat: 35.6762, lon: 139.6503, year: '2024', description: 'Creative data visualization award' },
  { id: 9, title: 'TensorFlow Developer', location: 'Online', lat: 40.7128, lon: -74.006, year: '2023', description: 'Google TensorFlow certification' },
  { id: 10, title: 'Community Leader', location: 'Jakarta, ID', lat: -6.2088, lon: 106.8456, year: '2024', description: 'Led 200+ member data science community' },
  { id: 11, title: 'Research Internship', location: 'Berlin, DE', lat: 52.52, lon: 13.405, year: '2025', description: 'AI research lab summer program' },
  { id: 12, title: 'Conference Speaker', location: 'Bangkok, TH', lat: 13.7563, lon: 100.5018, year: '2025', description: 'Presented at regional tech conference' },
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

export default function AchievementSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pinsRef = useRef<THREE.Group | null>(null);
  const glowsRef = useRef<THREE.Group | null>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const initThree = useCallback(() => {
    if (!canvasContainerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#040810');
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      canvasContainerRef.current.clientWidth / canvasContainerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 3.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      canvasContainerRef.current.clientWidth,
      canvasContainerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    canvasContainerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 6;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Globe
    const textureLoader = new THREE.TextureLoader();
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      shininess: 10,
      specular: new THREE.Color(0x111111),
      transparent: true,
    });

    textureLoader.load(
      '/earth-texture.jpg',
      (texture) => {
        globeMaterial.map = texture;
        globeMaterial.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback color if texture fails
        globeMaterial.color = new THREE.Color(0x0a1a2a);
      }
    );

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Achievement pins
    const pinsGroup = new THREE.Group();
    const glowsGroup = new THREE.Group();
    scene.add(pinsGroup);
    scene.add(glowsGroup);
    pinsRef.current = pinsGroup;
    glowsRef.current = glowsGroup;

    ACHIEVEMENTS.forEach((ach) => {
      const pos = latLonToVector3(ach.lat, ach.lon, 1.02);

      // Main pin
      const pinGeometry = new THREE.SphereGeometry(0.025, 16, 16);
      const pinMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
      const pin = new THREE.Mesh(pinGeometry, pinMaterial);
      pin.position.copy(pos);
      pin.userData = { achievementId: ach.id };
      pinsGroup.add(pin);

      // Glow sphere
      const glowGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.3,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(pos);
      glowsGroup.add(glow);
    });

    // Animation loop
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      timeRef.current += 0.016;

      controls.update();

      // Pin pulse
      glowsGroup.children.forEach((glow, i) => {
        const scale = 1 + Math.sin(timeRef.current * 2 + i * 0.5) * 0.5;
        glow.scale.setScalar(scale);
        (glow as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: 0x00ffcc,
          transparent: true,
          opacity: 0.2 + Math.sin(timeRef.current * 2 + i * 0.5) * 0.15,
        });
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasContainerRef.current || !camera || !renderer) return;
      const w = canvasContainerRef.current.clientWidth;
      const h = canvasContainerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      controls.dispose();
      if (canvasContainerRef.current && renderer.domElement.parentNode === canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = initThree();
    return cleanup;
  }, [initThree]);

  const flyToAchievement = useCallback((achievement: Achievement) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const targetPos = latLonToVector3(achievement.lat, achievement.lon, 3.5);

    // Pause auto-rotate
    controlsRef.current.autoRotate = false;

    // Animate camera
    const startPos = cameraRef.current.position.clone();
    const startTime = Date.now();
    const duration = 1500;

    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic

      cameraRef.current!.position.lerpVectors(startPos, targetPos, eased * 0.05);
      controlsRef.current!.target.lerp(targetPos.clone().normalize().multiplyScalar(0.1), 0.05);

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        setTimeout(() => {
          if (controlsRef.current) {
            controlsRef.current.autoRotate = true;
          }
        }, 3000);
      }
    };

    animateCamera();
    setSelectedAchievement(achievement);
  }, []);

  return (
    <section id="achievements" className="section-base" style={{ minHeight: '100vh' }}>
      <div className="section-content">
        {/* Section Header */}
        <div className="mb-12">
          <div
            className="text-[10px] uppercase tracking-[0.25em] mb-4"
            style={{ color: 'rgba(0, 255, 204, 0.5)', fontFamily: 'var(--font-mono)' }}
          >
            03 — Achievements
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#e8edf5',
            }}
          >
            HALL OF SATURN
          </h2>
          <p
            className="mt-4"
            style={{
              fontSize: 14,
              color: 'rgba(232, 237, 245, 0.4)',
              maxWidth: 500,
              lineHeight: 1.6,
            }}
          >
            Interactive 3D globe — drag to rotate, click achievements to explore.
            Each glowing pin marks a milestone in the journey.
          </p>
        </div>

        {/* Globe + Sidebar */}
        <div ref={containerRef} className="flex flex-col lg:flex-row gap-8">
          {/* Globe */}
          <div
            ref={canvasContainerRef}
            className="flex-1 rounded-lg overflow-hidden"
            style={{
              minHeight: 400,
              maxHeight: 500,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          />

          {/* Achievement List */}
          <div
            className="lg:w-80 max-h-[500px] overflow-y-auto rounded-lg p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-4"
              style={{ color: 'rgba(0, 255, 204, 0.5)', fontFamily: 'var(--font-mono)' }}
            >
              {ACHIEVEMENTS.length} ACHIEVEMENTS
            </div>

            <div className="space-y-2">
              {ACHIEVEMENTS.map((ach) => (
                <button
                  key={ach.id}
                  onClick={() => flyToAchievement(ach)}
                  onMouseEnter={() => setHoveredId(ach.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="w-full text-left p-3 rounded-lg transition-all duration-200"
                  style={{
                    background:
                      selectedAchievement?.id === ach.id
                        ? 'rgba(0, 255, 204, 0.1)'
                        : hoveredId === ach.id
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'transparent',
                    border:
                      selectedAchievement?.id === ach.id
                        ? '1px solid rgba(0, 255, 204, 0.3)'
                        : '1px solid transparent',
                    cursor: 'none',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{
                        background:
                          selectedAchievement?.id === ach.id ? '#00ffcc' : 'rgba(0, 255, 204, 0.4)',
                        boxShadow:
                          selectedAchievement?.id === ach.id
                            ? '0 0 6px rgba(0, 255, 204, 0.6)'
                            : 'none',
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: 'var(--starlight)',
                        }}
                      >
                        {ach.title}
                      </div>
                      <div
                        className="flex items-center gap-2 mt-1"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        <span style={{ fontSize: 10, color: 'rgba(0, 255, 204, 0.5)' }}>
                          {ach.year}
                        </span>
                        <span style={{ fontSize: 10, color: 'rgba(232, 237, 245, 0.3)' }}>
                          {ach.location}
                        </span>
                      </div>
                      {selectedAchievement?.id === ach.id && (
                        <div
                          className="mt-2 text-xs"
                          style={{ color: 'rgba(232, 237, 245, 0.5)', lineHeight: 1.5 }}
                        >
                          {ach.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
