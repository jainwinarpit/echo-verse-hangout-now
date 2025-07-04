import { useEffect, useState } from 'react';

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cosmic">
      {/* Animated particles background */}
      <div className="particles">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Logo with holographic effect */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-display font-bold text-holographic mb-4">
            VIBE
          </h1>
          <p className="text-lg text-muted-foreground">Hang out together, anywhere</p>
        </div>

        {/* Music wave loader */}
        <div className="flex items-end justify-center mb-8 h-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="wave" />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="glass-card p-1">
            <div
              className="h-2 bg-neon rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;