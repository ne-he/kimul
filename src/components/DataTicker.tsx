const TICKER_ITEMS = [
  'CURRENT MOOD: BUILDING',
  'GPA: 3.85',
  'NEXT GOAL: INTERNSHIP 2026',
  'STREAK: 47 DAYS',
  'STATUS: ONLINE',
  'LOCATION: SATURN ORBIT',
  'PARTICLES: 12,847 ACTIVE',
  'BUILD: #847',
  'LAST COMMIT: 2H AGO',
];

export default function DataTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]; // Double for seamless loop

  return (
    <div
      className="fixed top-[1px] left-0 z-[55] w-full overflow-hidden"
      style={{
        height: 22,
        background: 'rgba(4, 8, 16, 0.8)',
        borderBottom: '1px solid rgba(0, 255, 204, 0.05)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div className="ticker-animate flex items-center h-full whitespace-nowrap">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center mx-4"
            style={{
              fontSize: 10,
              color: 'rgba(0, 255, 204, 0.5)',
              letterSpacing: '0.1em',
            }}
          >
            <span
              className="inline-block w-1 h-1 rounded-full mr-2"
              style={{ background: 'var(--cyan)' }}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
