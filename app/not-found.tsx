import Link from 'next/link';
import Cloud from '@/components/Cloud';

// Simple Star component for background details (duplicated from page.tsx for consistency without heavy refactor)
const Star = ({ top, left, delay, opacity = 0.4, scale = 1 }: { top: string; left: string; delay?: number; opacity?: number; scale?: number }) => (
  <div 
    className="absolute bg-white rounded-full animate-pulse"
    style={{ 
      top, 
      left, 
      width: `${3 * scale}px`, 
      height: `${3 * scale}px`, 
      opacity,
      animationDelay: `${delay || 0}s`,
      animationDuration: '4s'
    }}
  />
);

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-400 via-sky-200 to-slate-50 flex flex-col items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Stars */}
        <Star top="15%" left="10%" delay={1} opacity={0.6} />
        <Star top="25%" left="85%" delay={2} opacity={0.5} scale={1.2} />
        <Star top="10%" left="60%" delay={0} opacity={0.4} />
        <Star top="45%" left="20%" delay={3} opacity={0.3} scale={0.8} />
        <Star top="35%" left="90%" delay={1.5} opacity={0.5} />
        <Star top="60%" left="15%" delay={2.5} opacity={0.3} />
        <Star top="80%" left="75%" delay={0.5} opacity={0.4} scale={1.1} />

        {/* Clouds - Simplified for 404 to be less busy than home but still atmospheric */}
        <Cloud top="10%" left="5%" scale={0.9} delay={0} duration={45} opacity={0.8} variant={1} />
        <Cloud top="20%" left="75%" scale={1.2} delay={5} duration={50} opacity={0.7} variant={3} />
        <Cloud top="65%" left="10%" scale={1.1} delay={2} duration={55} opacity={0.6} variant={2} />
        <Cloud top="75%" left="80%" scale={1.3} delay={4} duration={60} opacity={0.7} variant={3} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 glass-card-solid max-w-md w-full p-8 text-center shadow-xl animate-float">
        <h1 className="text-8xl font-bold text-sky-900/80 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Lost in the clouds?</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          The page you're looking for seems to have drifted away. Let's get you back to solid ground.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-all bg-sky-500 rounded-lg hover:bg-sky-600 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
        >
          Return Home
        </Link>
      </div>
      
      {/* Footer copyright or small text if needed, strictly minimal */}
      <div className="absolute bottom-4 text-slate-400 text-sm">
        Serene Journal
      </div>
    </div>
  );
}
