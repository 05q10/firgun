'use client';

import React from 'react';
import Image from 'next/image';
import ComicPanel from './ComicPanel';

// Comic Speech Bubble Component
interface ComicSpeechBubbleProps {
  text: string;
  fontSize?: string;
  position?: string;
  width?: string;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ComicSpeechBubble({ 
  text, 
  fontSize = "text-xl", 
  position = "top-0 left-0", 
  width = "w-64",
  delay = 0.2,
  duration = 0.5,
  className = ""
}: ComicSpeechBubbleProps) {
  return (
    <ComicPanel
      direction="pop"
      delay={delay}
      duration={duration}
      zIndex={20}
    >
      <div className={`comic-speech-bubble ${width} ${position} ${className}`}>
        <div className="bg-white rounded-lg p-4 border-4 border-black shadow-comic relative">
          <p className={`text-center font-comic ${fontSize} text-black`}>{text}</p>
          <div className="speech-pointer"></div>
        </div>
      </div>
    </ComicPanel>
  );
}

// Comic Explosion Effect
interface ComicExplosionProps {
  position?: string;
  size?: string;
  delay?: number;
  zIndex?: number;
  variant?: 'boom' | 'pow' | 'bam';
}

export function ComicExplosion({
  position = "top-0 left-0",
  size = "w-40 h-40",
  delay = 0.3,
  zIndex = 30,
  variant = "boom"
}: ComicExplosionProps) {
  // Different explosion styles
  const explosionTypes = {
    boom: "/images/boom-explosion.png",
    pow: "/images/pow-explosion.png",
    bam: "/images/bam-explosion.png",
  };
  
  return (
    <ComicPanel
      direction="scale"
      delay={delay}
      zIndex={zIndex}
    >
      <div className={`absolute ${position} ${size}`}>
        <Image
          src={explosionTypes[variant]}
          alt={`Comic ${variant} explosion`}
          fill
          className="object-contain"
        />
      </div>
    </ComicPanel>
  );
}

// Comic Character Component with animations
interface ComicCharacterProps {
  imageUrl: string;
  alt: string;
  position?: string;
  size?: string;
  zIndex?: number;
  className?: string;
  animationDelay?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom';
}

export function ComicCharacter({
  imageUrl,
  alt,
  position = "top-1/4 left-1/4",
  size = "w-64 h-64",
  zIndex = 15,
  className = "",
  animationDelay = 0,
  direction = "left"
}: ComicCharacterProps) {
  return (
    <ComicPanel
      direction={direction}
      delay={animationDelay}
      zIndex={zIndex}
    >
      <div className={`absolute ${position} ${size} ${className}`}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-contain"
        />
      </div>
    </ComicPanel>
  );
}