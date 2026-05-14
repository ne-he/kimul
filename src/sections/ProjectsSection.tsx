import { useCallback } from 'react';

interface Project {
  title: string;
  description: string;
  tech: string[];
  year: string;
  color: string;
  featured?: boolean;
  metrics?: string[];
}

const PROJECTS: Project[] = [
  {
    title: 'Family Tasks AI',
    description: 'Smart task management app with AI-powered scheduling and natural language task creation. Built for families to coordinate daily activities.',
    tech: ['React', 'TypeScript', 'TensorFlow.js', 'Node.js'],
    year: '2026',
    color: '#00ffcc',
    featured: true,
    metrics: ['200% faster scheduling', '12K users', '4.8 star rating'],
  },
  {
    title: 'Neural Style Transfer',
    description: 'Real-time artistic style transfer using deep neural networks. Transform photos into artwork with customizable styles.',
    tech: ['Python', 'PyTorch', 'OpenCV', 'FastAPI'],
    year: '2025',
    color: '#4488ff',
    metrics: ['50+ art styles', 'Real-time processing'],
  },
  {
    title: 'Saturn Analytics Dashboard',
    description: 'Interactive data visualization dashboard for real-time analytics. Features custom charts, filters, and export capabilities.',
    tech: ['D3.js', 'React', 'PostgreSQL', 'GraphQL'],
    year: '2025',
    color: '#ff6644',
    metrics: ['1M+ data points', 'Sub-second queries'],
  },
  {
    title: 'Sentiment Analyzer',
    description: 'NLP-powered sentiment analysis tool for social media monitoring. Classifies emotions and generates insight reports.',
    tech: ['Python', 'NLTK', 'scikit-learn', 'Flask'],
    year: '2024',
    color: '#cc44ff',
    metrics: ['94% accuracy', 'Multi-language support'],
  },
];

export default function ProjectsSection() {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    const angle = Math.atan2(y, x) * (180 / Math.PI);
    card.style.setProperty('--holo-angle', `${angle}deg`);
    card.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-2px)`;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  }, []);

  return (
    <section id="projects" className="section-base" style={{ minHeight: '100vh' }}>
      <div className="section-content">
        {/* Section Header */}
        <div className="mb-16">
          <div
            className="text-[10px] uppercase tracking-[0.25em] mb-4"
            style={{ color: 'rgba(0, 255, 204, 0.5)', fontFamily: 'var(--font-mono)' }}
          >
            04 — Projects
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
            THE FORGE
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
            Selected works at the intersection of data science, AI, and creative technology.
            Each project represents a unique challenge solved.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          {PROJECTS.map((project) => (
            <div
              key={project.title}
              className={`holo-card ${project.featured ? 'md:col-span-2 md:row-span-1' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                cursor: 'none',
                transition: 'transform 0.3s ease-out',
                borderTop: `3px solid ${project.color}`,
              }}
            >
              {/* Year badge */}
              <div className="flex justify-between items-start mb-4">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: project.color,
                    letterSpacing: '0.1em',
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: `${project.color}15`,
                  }}
                >
                  {project.year}
                </span>
                {project.featured && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: '#00ffcc',
                      letterSpacing: '0.1em',
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'rgba(0, 255, 204, 0.1)',
                    }}
                  >
                    FEATURED
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: project.featured ? 24 : 20,
                  fontWeight: 400,
                  color: '#e8edf5',
                  marginBottom: 8,
                  lineHeight: 1.2,
                }}
              >
                {project.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: 13,
                  color: 'rgba(232, 237, 245, 0.5)',
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                {project.description}
              </p>

              {/* Metrics */}
              {project.metrics && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.metrics.map((metric) => (
                    <span
                      key={metric}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: project.color,
                        padding: '4px 8px',
                        borderRadius: 4,
                        background: `${project.color}10`,
                      }}
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              )}

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'rgba(232, 237, 245, 0.4)',
                      padding: '2px 6px',
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 link-hover"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'rgba(0, 255, 204, 0.6)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            <span>View all projects on GitHub</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
