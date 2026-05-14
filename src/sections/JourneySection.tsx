import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const JOURNEY_DATA = [
  { year: 2019, value: 1, label: 'Started' },
  { year: 2020, value: 2.5, label: 'Learned' },
  { year: 2021, value: 4, label: 'Built' },
  { year: 2022, value: 5.5, label: 'Data' },
  { year: 2023, value: 7, label: 'AI/ML' },
  { year: 2025, value: 8.5, label: 'Academy' },
  { year: 2026, value: 10, label: 'Launch' },
];

export default function JourneySection() {
  const svgRef = useRef<SVGSVGElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!svgRef.current || !chartContainerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = chartContainerRef.current;
    const width = container.clientWidth;
    const height = 350;
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([2019, 2026])
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear().domain([0, 11]).range([chartHeight, 0]);

    // Grid lines (horizontal)
    const yTicks = [0, 2, 4, 6, 8, 10];
    yTicks.forEach((tick) => {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', yScale(tick))
        .attr('y2', yScale(tick))
        .attr('stroke', 'rgba(0, 255, 204, 0.06)')
        .attr('stroke-width', 0.5);
    });

    // Gradient definition
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
        .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#00ffcc')
      .attr('stop-opacity', 0.15);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#00ffcc')
      .attr('stop-opacity', 0);

    // Area generator
    const areaGen = d3
      .area<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y0(chartHeight)
      .y1((d) => yScale(d.value))
      .curve(d3.curveCardinal.tension(0.4));

    // Line generator
    const lineGen = d3
      .line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(d3.curveCardinal.tension(0.4));

    // Area path (initially hidden)
    const areaPath = g
      .append('path')
      .datum(JOURNEY_DATA)
      .attr('d', areaGen)
      .attr('fill', 'url(#area-gradient)')
      .attr('opacity', 0);

    // Line path
    const linePath = g
      .append('path')
      .datum(JOURNEY_DATA)
      .attr('d', lineGen)
      .attr('fill', 'none')
      .attr('stroke', '#00ffcc')
      .attr('stroke-width', 2);

    // Get total length for stroke animation
    const totalLength = (linePath.node() as SVGPathElement).getTotalLength();

    // Set initial stroke dash
    linePath
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength);

    // Axis labels (X)
    const xAxisG = g.append('g').attr('transform', `translate(0,${chartHeight})`);
    JOURNEY_DATA.forEach((d) => {
      xAxisG
        .append('text')
        .attr('x', xScale(d.year))
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .style('font-family', 'var(--font-mono)')
        .style('font-size', '11px')
        .style('fill', 'rgba(0, 255, 204, 0.5)')
        .style('letter-spacing', '0.1em')
        .text(d.year);
    });

    // Y axis labels
    const yAxisG = g.append('g');
    const yLabels = ['BEGINNER', '', 'BUILDING', '', 'ADVANCED', '', 'UNSTOPPABLE'];
    yTicks.forEach((tick, i) => {
      if (yLabels[i]) {
        yAxisG
          .append('text')
          .attr('x', -12)
          .attr('y', yScale(tick) + 4)
          .attr('text-anchor', 'end')
          .style('font-family', 'var(--font-mono)')
          .style('font-size', '9px')
          .style('fill', 'rgba(232, 237, 245, 0.3)')
          .style('letter-spacing', '0.08em')
          .text(yLabels[i]);
      }
    });

    // Milestone markers (circles)
    const markers = g
      .selectAll('.milestone')
      .data(JOURNEY_DATA)
      .enter()
      .append('g')
      .attr('class', 'milestone')
      .attr('transform', (d) => `translate(${xScale(d.year)},${yScale(d.value)})`);

    // Outer glow
    markers
      .append('circle')
      .attr('r', 12)
      .attr('fill', 'rgba(0, 255, 204, 0.15)')
      .attr('opacity', 0);

    // Main dot
    markers
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#00ffcc')
      .attr('stroke', '#040810')
      .attr('stroke-width', 2)
      .attr('opacity', 0)
      .attr('scale', 0);

    // Label above
    markers
      .append('text')
      .attr('y', -18)
      .attr('text-anchor', 'middle')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '10px')
      .style('fill', 'rgba(232, 237, 245, 0.6)')
      .style('letter-spacing', '0.05em')
      .style('opacity', 0)
      .text((d) => d.label);

    // ScrollTrigger animation
    ScrollTrigger.create({
      trigger: chartContainerRef.current,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        // Animate line drawing
        gsap.to(linePath.node(), {
          attr: { 'stroke-dashoffset': 0 },
          duration: 2,
          ease: 'power2.inOut',
        });

        // Fade in area
        gsap.to(areaPath.node(), {
          attr: { opacity: 1 },
          duration: 0.5,
          delay: 1.5,
        });

        // Animate markers with stagger
        markers.each(function (_d, i) {
          const marker = d3.select(this);
          gsap.to(marker.selectAll('circle').nodes(), {
            attr: { opacity: 1 },
            scale: 1,
            duration: 0.4,
            delay: 0.3 + i * 0.15,
            ease: 'back.out(2)',
          });
          gsap.to(marker.select('text').node(), {
            style: { opacity: 1 },
            duration: 0.3,
            delay: 0.5 + i * 0.15,
          });
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === chartContainerRef.current) t.kill();
      });
    };
  }, []);

  return (
    <section id="journey" className="section-base" style={{ minHeight: '100vh' }}>
      <div className="section-content">
        {/* Section Header */}
        <div className="mb-16">
          <div
            className="text-[10px] uppercase tracking-[0.25em] mb-4"
            style={{ color: 'rgba(0, 255, 204, 0.5)', fontFamily: 'var(--font-mono)' }}
          >
            02 — Journey
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
            THE BULL RUN
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
            A visual chronicle of growth — from first code to data science mastery.
            Each milestone represents a leap forward in the journey.
          </p>
        </div>

        {/* Chart */}
        <div ref={chartContainerRef} className="w-full">
          <svg ref={svgRef} className="w-full" style={{ maxWidth: '100%' }} />
        </div>

        {/* Milestone cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-12">
          {JOURNEY_DATA.map((m) => (
            <div
              key={m.year}
              className="p-3 rounded-lg transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 18,
                  color: '#00ffcc',
                  fontWeight: 700,
                }}
              >
                {m.year}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(232, 237, 245, 0.5)',
                  marginTop: 4,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {m.label}
              </div>
              <div
                className="mt-2 h-[2px] rounded-full"
                style={{
                  width: `${(m.value / 10) * 100}%`,
                  background: 'rgba(0, 255, 204, 0.4)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
