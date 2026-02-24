import React from 'react';
import Image from 'next/image';
import MainButton from './MainButton';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
      {/* Logo */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 md:mb-8 drop-shadow-sm">
        <Image
          src="/logo.png"
          alt="Serene"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Subtitle */}
      <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 text-center tracking-tight">
        Find Your Calm
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 mb-10 text-center max-w-2xl font-medium leading-relaxed px-4">
        A calm, reflective space for your thoughts. Track your mood, write freely, and receive gentle AI-powered insights.
      </p>

      {/* CTA Button */}
      <MainButton 
        href="/app" 
        variant="solid"
        className="group px-8 py-3.5 md:px-10 md:py-4 text-base md:text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <span>Start Journaling</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </MainButton>

      {/* Footer Text */}
      <div className="absolute bottom-8 left-0 w-full text-center">
        <p className="text-sm text-slate-400 font-medium tracking-wide opacity-80">
          Take a breath. You deserve this moment.
        </p>
      </div>
    </div>
  );
};

export default Hero;
