import React from 'react';

interface CloudProps {
  top: string;
  left: string;
  scale?: number;
  opacity?: number;
  delay?: number;
  duration?: number;
  className?: string;
  variant?: 1 | 2 | 3;
}

const Cloud: React.FC<CloudProps> = ({ 
  top, 
  left, 
  scale = 1, 
  opacity = 0.6,
  delay = 0,
  duration = 10,
  className = "",
  variant = 1
}) => {
  // Style for positioning and scaling
  const containerStyle = {
    top,
    left,
    transform: `scale(${scale})`,
    opacity,
  };

  // Style for floating animation
  const floatStyle = {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };

  const driftStyle = {
    animationDelay: `-${Math.abs(delay * 3)}s`, // Negative delay to start mid-animation
    animationDuration: `${duration + 40}s`, // Much slower, continuous drift
  };

  return (
    <div 
      className={`absolute pointer-events-none ${className}`}
      style={containerStyle}
      aria-hidden="true"
    >
      <div className="animate-drift" style={driftStyle}>
        <div 
          className="animate-float"
          style={floatStyle}
        >
          {variant === 1 && (
            <div className="relative w-48 h-16 bg-white/90 rounded-full blur-xl">
              <div className="absolute -top-10 left-6 w-24 h-24 bg-white/80 rounded-full blur-xl" />
              <div className="absolute -top-14 left-20 w-32 h-32 bg-white/90 rounded-full blur-xl" />
              <div className="absolute -top-8 right-6 w-20 h-20 bg-white/80 rounded-full blur-xl" />
            </div>
          )}

          {variant === 2 && (
            <div className="relative w-40 h-14 bg-white/80 rounded-full blur-xl">
              <div className="absolute -top-6 left-4 w-20 h-20 bg-white/80 rounded-full blur-xl" />
              <div className="absolute -top-10 left-16 w-24 h-24 bg-white/90 rounded-full blur-xl" />
              <div className="absolute -top-4 right-2 w-16 h-16 bg-white/80 rounded-full blur-xl" />
              <div className="absolute -bottom-2 left-10 w-24 h-10 bg-white/80 rounded-full blur-xl" />
            </div>
          )}

          {variant === 3 && (
            <div className="relative w-56 h-20 bg-white/70 rounded-full blur-2xl">
              <div className="absolute -top-12 left-8 w-28 h-28 bg-white/80 rounded-full blur-2xl" />
              <div className="absolute -top-16 left-28 w-36 h-36 bg-white/90 rounded-full blur-2xl" />
              <div className="absolute -top-8 right-4 w-24 h-24 bg-white/80 rounded-full blur-2xl" />
              <div className="absolute top-4 left-12 w-32 h-12 bg-white/70 rounded-full blur-2xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cloud;
