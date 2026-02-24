import React from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Cloud from '@/components/Cloud';

// Simple Star component for background details
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

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-400 via-sky-200 to-slate-50">
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

        {/* Clouds - Layer 1 (Back) */}
        <Cloud top="10%" left="5%" scale={0.9} delay={0} duration={45} opacity={0.8} variant={1} />
        <Cloud top="20%" left="75%" scale={1.2} delay={5} duration={50} opacity={0.7} variant={3} />
        
        {/* Clouds - Layer 2 (Mid) */}
        <Cloud top="45%" left="-5%" scale={1.4} delay={2} duration={55} opacity={0.9} variant={2} />
        <Cloud top="35%" left="60%" scale={0.8} delay={8} duration={48} opacity={0.8} variant={1} />
        
        {/* Clouds - Layer 3 (Front/Bottom) */}
        <Cloud top="75%" left="15%" scale={1.1} delay={12} duration={52} opacity={0.6} variant={3} />
        <Cloud top="85%" left="80%" scale={1.3} delay={4} duration={60} opacity={0.7} variant={2} />
        <Cloud top="15%" left="40%" scale={0.7} delay={18} duration={70} opacity={0.6} variant={1} />
        <Cloud top="65%" left="90%" scale={1.0} delay={9} duration={55} opacity={0.65} variant={3} />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <Hero />
    </div>
  );
}
