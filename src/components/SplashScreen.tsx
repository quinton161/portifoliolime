import React, { useCallback, useEffect, useRef, useState } from 'react';

/** Matches this repo: Create React App (react-scripts), npm start, port 3000. */
const BOOT_LINES = [
  { text: 'quinton@portfoliolime:~$ npm start', className: 'text-[#58a6ff]' },
  { text: '', className: '' },
  { text: '> portfoliolime@0.1.0 start', className: 'text-zinc-500' },
  { text: '> react-scripts start', className: 'text-zinc-500' },
  { text: '', className: '' },
  { text: 'Compiled successfully!', className: 'text-emerald-400/90' },
  { text: '  Local: http://localhost:3000', className: 'text-zinc-400' },
  { text: '  Stack: React · TypeScript · Tailwind · react-scripts (CRA)', className: 'text-emerald-400/80' },
];

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [phase, setPhase] = useState<'boot' | 'interactive'>('boot');
  const [lineCount, setLineCount] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);
  const skipRef = useRef(false);

  const finish = useCallback(() => {
    if (skipRef.current) return;
    skipRef.current = true;
    setExiting(true);
    window.setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 700);
  }, [onComplete]);

  // Boot: reveal terminal lines
  useEffect(() => {
    if (phase !== 'boot') return;
    if (lineCount >= BOOT_LINES.length) {
      const t = window.setTimeout(() => setPhase('interactive'), 400);
      return () => clearTimeout(t);
    }
    const delay = BOOT_LINES[lineCount].text === '' ? 120 : 280;
    const t = window.setTimeout(() => setLineCount((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [phase, lineCount]);

  // Blink cursor
  useEffect(() => {
    const id = window.setInterval(() => setCursorOn((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  // Enter / Return dismisses splash anytime (developer shortcut)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d1117] font-mono text-sm transition-all duration-700 ease-out ${
        exiting ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100'
      }`}
      role="dialog"
      aria-label="Portfolio loading"
      aria-modal="true"
    >
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <button
        type="button"
        onClick={finish}
        className="absolute right-4 top-4 z-10 rounded-lg border border-zinc-700/80 bg-zinc-900/80 px-3 py-1.5 text-[11px] font-medium text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
      >
        Skip →
      </button>

      <div className="relative w-full max-w-2xl px-4 sm:px-8">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-600">Developer preview</p>

        <div className="rounded-xl border border-zinc-800 bg-[#010409]/90 shadow-2xl shadow-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-[11px] text-zinc-500">bash — portfoliolime</span>
          </div>
          <div className="min-h-[200px] space-y-1.5 px-4 py-4 text-[13px] leading-relaxed sm:text-sm">
            {BOOT_LINES.slice(0, lineCount).map((line, i) => (
              <div key={i} className={line.className || 'text-zinc-300'}>
                {line.text || '\u00a0'}
              </div>
            ))}
            {phase === 'boot' && lineCount < BOOT_LINES.length && (
              <span className={`inline-block h-4 w-2 translate-y-0.5 bg-emerald-400 ${cursorOn ? 'opacity-100' : 'opacity-0'}`} />
            )}
          </div>
        </div>

        {phase === 'interactive' && (
          <div className="mt-8 flex flex-col items-center gap-4 text-center opacity-0 motion-safe:animate-[splashFadeIn_0.55s_ease-out_forwards]">
            <p className="text-base font-semibold text-zinc-200 sm:text-lg">
              Quinton Ndlovu <span className="text-zinc-500">—</span> Full Stack Developer
            </p>
            <p className="max-w-md text-xs text-zinc-500">
              Explore projects, stack, and contact — or tap the assistant in the corner.
            </p>
            <button
              type="button"
              onClick={finish}
              className="group relative overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-8 py-3 text-sm font-semibold text-emerald-400 transition hover:border-emerald-400/60 hover:bg-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <span className="relative z-10">$ ./enter-portfolio.sh</span>
              <span
                className="absolute inset-0 -translate-x-full bg-emerald-500/10 transition group-hover:translate-x-0"
                aria-hidden
              />
            </button>
            <p className="text-[11px] text-zinc-600">
              <kbd className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-mono text-zinc-400">Enter</kbd> anytime to skip
            </p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes splashFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
