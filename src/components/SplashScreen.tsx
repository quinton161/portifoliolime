import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<'loading' | 'welcome' | 'exit'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    // Phase transitions
    const welcomeTimer = setTimeout(() => {
      setPhase('welcome');
    }, 2200);

    const exitTimer = setTimeout(() => {
      setPhase('exit');
      setIsVisible(false);
      setTimeout(onComplete, 1200);
    }, 4200);

    return () => {
      clearInterval(interval);
      clearTimeout(welcomeTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000] transition-all duration-1000 ease-[cubic-bezier(0.8,0,0.1,1)] ${
        isVisible ? 'opacity-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="relative w-full max-w-md px-10">
        {/* Loading Phase */}
        <div className={`transition-all duration-1000 ease-in-out flex flex-col items-center ${
          phase === 'loading' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95'
        }`}>
          <div className="mb-12 relative">
            <div className="w-20 h-20 border-2 border-white/10 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/40 tracking-widest">
              {progress}%
            </div>
          </div>
          
          <h1 className="text-white text-3xl md:text-4xl font-medium tracking-[0.2em] uppercase">
            Loading <span className="font-black text-white ml-2">Quinton</span>
          </h1>
          <p className="mt-4 text-white/30 text-[10px] uppercase tracking-[0.5em] font-bold animate-pulse">
            Establishing digital presence
          </p>
        </div>

        {/* Welcome Phase */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          phase === 'welcome' ? 'opacity-100 translate-y-0 scale-100' : 
          phase === 'loading' ? 'opacity-0 translate-y-10 scale-110' : 'opacity-0 -translate-y-10 scale-90'
        }`}>
          <div className="overflow-hidden">
            <h1 className="text-white text-7xl md:text-9xl font-black tracking-tighter leading-none animate-reveal-text">
              WELCOME
            </h1>
          </div>
          <div className="h-[1px] w-0 bg-gradient-to-r from-transparent via-white/50 to-transparent mt-6 animate-line-expand"></div>
          <p className="mt-6 text-white/40 text-sm font-medium tracking-[0.3em] uppercase animate-fade-in-delayed">
            To the Portfolio of Quinton Ndlovu
          </p>
        </div>
      </div>

      {/* Ultra-minimal bottom progress line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes reveal-text {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-reveal-text {
          animation: reveal-text 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes line-expand {
          0% { width: 0%; opacity: 0; }
          100% { width: 60%; opacity: 1; }
        }
        .animate-line-expand {
          animation: line-expand 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
        }

        @keyframes fade-in-delayed {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-delayed {
          opacity: 0;
          animation: fade-in-delayed 1s cubic-bezier(0.16, 1, 0.3, 1) 1s forwards;
        }
      `}} />
    </div>
  );
};

export default SplashScreen;
