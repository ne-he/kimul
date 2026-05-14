import { useState, useRef, useEffect } from 'react';

const PURPOSES = [
  { id: 'internship', label: 'INTERNSHIP', desc: 'Joining the team', icon: '◈' },
  { id: 'collab', label: 'COLLABORATION', desc: 'Working together', icon: '◉' },
  { id: 'connect', label: 'CONNECT', desc: 'Just saying hi', icon: '◆' },
  { id: 'other', label: 'OTHER', desc: 'Something else', icon: '◇' },
];

export default function ContactSection() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Calculate signal strength
    let strength = 0;
    if (name.length > 0) strength += 25;
    if (purpose) strength += 25;
    if (message.length >= 10) strength += 25;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) strength += 25;
    setSignalStrength(strength);
  }, [name, purpose, message, email]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return name.length > 0;
      case 1: return purpose !== '';
      case 2: return message.length >= 10;
      case 3: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      default: return false;
    }
  };

  if (submitted) {
    return (
      <section id="contact" className="section-base flex items-center" style={{ minHeight: '80vh' }}>
        <div className="section-content text-center">
          <div
            className="mb-6"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              color: '#00ffcc',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ●
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: '#00ffcc',
              letterSpacing: '0.1em',
            }}
          >
            SIGNAL TRANSMITTED
          </h2>
          <p
            className="mt-4"
            style={{ color: 'rgba(232, 237, 245, 0.5)', fontSize: 14 }}
          >
            Your transmission has been received. Nehemiah will respond within 24 hours.
          </p>
          <div
            className="mt-8"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'rgba(0, 255, 204, 0.4)',
              letterSpacing: '0.1em',
            }}
          >
            TRANSMISSION ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-base" style={{ minHeight: '100vh' }}>
      <div className="section-content">
        {/* Section Header */}
        <div className="mb-12">
          <div
            className="text-[10px] uppercase tracking-[0.25em] mb-4"
            style={{ color: 'rgba(0, 255, 204, 0.5)', fontFamily: 'var(--font-mono)' }}
          >
            05 — Contact
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
            TRANSMIT SIGNAL
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
            Send a transmission through the void. All fields required for successful uplink.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="flex-1 max-w-xl">
            {/* Progress steps */}
            <div className="flex gap-2 mb-8">
              {[0, 1, 2, 3].map((s) => (
                <div
                  key={s}
                  className="flex-1 h-1 rounded-full transition-all duration-300"
                  style={{
                    background:
                      s <= step
                        ? 'rgba(0, 255, 204, 0.6)'
                        : 'rgba(255, 255, 255, 0.06)',
                  }}
                />
              ))}
            </div>

            {/* Step 0: Name */}
            {step === 0 && (
              <div>
                <div
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'rgba(0, 255, 204, 0.6)',
                    letterSpacing: '0.15em',
                  }}
                >
                  {'>'} IDENTIFY YOURSELF
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && canProceed() && setStep(1)}
                  placeholder="Enter your callsign..."
                  className="terminal-input"
                  style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
                />
                <div
                  className="mt-4"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'rgba(0, 255, 204, 0.3)',
                  }}
                >
                  Press ENTER to continue
                </div>
              </div>
            )}

            {/* Step 1: Purpose */}
            {step === 1 && (
              <div>
                <div
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'rgba(0, 255, 204, 0.6)',
                    letterSpacing: '0.15em',
                  }}
                >
                  {'>'} SELECT TRANSMISSION TYPE
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {PURPOSES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPurpose(p.id)}
                      className="p-4 rounded-lg text-left transition-all duration-200"
                      style={{
                        background:
                          purpose === p.id
                            ? 'rgba(0, 255, 204, 0.1)'
                            : 'rgba(255, 255, 255, 0.03)',
                        border:
                          purpose === p.id
                            ? '1px solid rgba(0, 255, 204, 0.4)'
                            : '1px solid rgba(255, 255, 255, 0.06)',
                        cursor: 'none',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 18,
                          color: purpose === p.id ? '#00ffcc' : 'rgba(0, 255, 204, 0.3)',
                          marginBottom: 4,
                        }}
                      >
                        {p.icon}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          color: purpose === p.id ? '#00ffcc' : 'rgba(232, 237, 245, 0.5)',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {p.label}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'rgba(232, 237, 245, 0.3)',
                          marginTop: 2,
                        }}
                      >
                        {p.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Message */}
            {step === 2 && (
              <div>
                <div
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'rgba(0, 255, 204, 0.6)',
                    letterSpacing: '0.15em',
                  }}
                >
                  {'>'} YOUR MESSAGE
                </div>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your transmission..."
                  rows={6}
                  className="terminal-input"
                  style={{
                    resize: 'none',
                    border: '1px solid rgba(0, 255, 204, 0.2)',
                    padding: 12,
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: message.length >= 10 ? '#00ffcc' : 'rgba(0, 255, 204, 0.3)',
                    }}
                  >
                    {message.length} characters
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'rgba(0, 255, 204, 0.3)',
                    }}
                  >
                    Min 10 chars
                  </span>
                </div>
              </div>
            )}

            {/* Step 3: Email */}
            {step === 3 && (
              <div>
                <div
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'rgba(0, 255, 204, 0.6)',
                    letterSpacing: '0.15em',
                  }}
                >
                  {'>'} RETURN FREQUENCY (EMAIL)
                </div>
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleSubmit()}
                  placeholder="your@frequency.com"
                  className="terminal-input"
                  style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
                />
                <div className="flex items-center gap-2 mt-4">
                  <span
                    style={{
                      color: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '#00ffcc' : '#ff4444',
                      fontSize: 14,
                    }}
                  >
                    {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '✓' : email.length > 0 ? '✗' : ''}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'rgba(0, 255, 204, 0.3)',
                    }}
                  >
                    {email.length > 0
                      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                        ? 'Valid frequency'
                        : 'Invalid format'
                      : 'Enter email for response'}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 rounded-lg transition-all duration-200"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'rgba(0, 255, 204, 0.5)',
                    border: '1px solid rgba(0, 255, 204, 0.2)',
                    background: 'transparent',
                    cursor: 'none',
                  }}
                >
                  ← BACK
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => canProceed() && setStep(step + 1)}
                  className="px-6 py-2 rounded-lg transition-all duration-200 ml-auto"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: canProceed() ? '#040810' : 'rgba(0, 255, 204, 0.3)',
                    background: canProceed() ? '#00ffcc' : 'rgba(0, 255, 204, 0.1)',
                    border: '1px solid rgba(0, 255, 204, 0.3)',
                    cursor: canProceed() ? 'none' : 'not-allowed',
                    letterSpacing: '0.1em',
                  }}
                >
                  NEXT →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-lg transition-all duration-200 ml-auto"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: canProceed() ? '#040810' : 'rgba(0, 255, 204, 0.3)',
                    background: canProceed() ? '#00ffcc' : 'rgba(0, 255, 204, 0.1)',
                    border: '1px solid rgba(0, 255, 204, 0.3)',
                    cursor: canProceed() ? 'none' : 'not-allowed',
                    letterSpacing: '0.1em',
                  }}
                >
                  INITIATE UPLINK
                </button>
              )}
            </div>
          </div>

          {/* Signal Strength Meter */}
          <div
            className="hidden lg:flex flex-col items-center"
            style={{ width: 60 }}
          >
            <div
              className="text-[9px] uppercase tracking-[0.15em] mb-4 text-center"
              style={{ color: 'rgba(0, 255, 204, 0.4)', fontFamily: 'var(--font-mono)' }}
            >
              {signalStrength === 100 ? 'UPLINK ESTABLISHED' : 'SIGNAL STRENGTH'}
            </div>
            <div
              className="relative flex-1 w-3 rounded-full overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(0, 255, 204, 0.1)',
                minHeight: 200,
              }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500"
                style={{
                  height: `${signalStrength}%`,
                  background:
                    signalStrength === 100
                      ? '#00ffcc'
                      : `linear-gradient(to top, rgba(0,255,204,0.3), rgba(0,255,204,${signalStrength / 100}))`,
                  boxShadow:
                    signalStrength > 50
                      ? '0 0 12px rgba(0, 255, 204, 0.4)'
                      : 'none',
                }}
              />
            </div>
            <div
              className="mt-4 text-center"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                color: signalStrength === 100 ? '#00ffcc' : 'rgba(0, 255, 204, 0.4)',
                fontWeight: 700,
              }}
            >
              {signalStrength}%
            </div>
          </div>

          {/* Social Links */}
          <div className="lg:w-48">
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-6"
              style={{ color: 'rgba(0, 255, 204, 0.4)', fontFamily: 'var(--font-mono)' }}
            >
              FREQUENCIES
            </div>
            <div className="space-y-4">
              {[
                { name: 'LinkedIn', freq: '432', bar: 85 },
                { name: 'GitHub', freq: '369', bar: 70 },
                { name: 'Email', freq: '528', bar: 60 },
              ].map((social) => (
                <div key={social.name}>
                  <div className="flex justify-between mb-1">
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'rgba(232, 237, 245, 0.5)',
                      }}
                    >
                      {social.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'rgba(0, 255, 204, 0.4)',
                      }}
                    >
                      {social.freq} Hz
                    </span>
                  </div>
                  <div
                    className="h-1 rounded-full"
                    style={{ background: 'rgba(255, 255, 255, 0.04)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${social.bar}%`,
                        background: 'rgba(0, 255, 204, 0.3)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div
              className="mt-12 text-[9px]"
              style={{
                color: 'rgba(232, 237, 245, 0.2)',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1.8,
              }}
            >
              <div>END OF TRANSMISSION</div>
              <div style={{ color: 'rgba(0, 255, 204, 0.2)' }}>
                Saturn Protocol v21.04.26
              </div>
              <div className="mt-2">
                Console: open DevTools for a surprise
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
