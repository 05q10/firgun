// app/page.tsx
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { CloudFrameLayout } from '../comic/ComicCloud';
import { ComicSpeechBubble } from '../comic/ComicElements';

export default function MarvelLanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });
  
  // Animation values based on scroll
  const titleOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.1, 0.3], [30, 0]);
  const heroScale = useTransform(scrollYProgress, [0.3, 0.5], [1, 0.8]);
  const heroX = useTransform(scrollYProgress, [0.3, 0.5], [0, -100]);
  const villainX = useTransform(scrollYProgress, [0.4, 0.6], [100, 0]);
  const villainOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  
  // Smooth values
  const smoothTitleOpacity = useSpring(titleOpacity, { damping: 20, stiffness: 100 });
  const smoothTitleY = useSpring(titleY, { damping: 20, stiffness: 100 });
  const smoothHeroScale = useSpring(heroScale, { damping: 15, stiffness: 80 });
  const smoothHeroX = useSpring(heroX, { damping: 20, stiffness: 80 });
  const smoothVillainX = useSpring(villainX, { damping: 20, stiffness: 80 });
  const smoothVillainOpacity = useSpring(villainOpacity, { damping: 15, stiffness: 80 });
  
  return (
    <CloudFrameLayout>
      <div 
        ref={heroRef}
        className="relative min-h-screen w-full flex items-center justify-center"
      >
        {/* Main title */}
        <motion.div
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center z-30"
          style={{ 
            opacity: smoothTitleOpacity,
            y: smoothTitleY
          }}
        >
          <h1 className="text-7xl font-comic font-extrabold text-yellow-400 stroke-black mb-4">
            MARVEL UNIVERSE
          </h1>
          <p className="text-3xl font-comic text-white">ADVENTURE AWAITS</p>
        </motion.div>
        
        {/* Hero character */}
        <motion.div
          className="absolute top-1/2 left-1/3 transform -translate-y-1/2 w-80 h-80 z-20"
          style={{ 
            scale: smoothHeroScale,
            x: smoothHeroX
          }}
        >
          <Image
            src="/assets/3.png" // Replace with your Marvel character
            alt="Marvel Hero"
            fill
            className="object-contain"
          />
          
          <ComicSpeechBubble
            text="The city needs us!"
            position="absolute top-0 right-0"
            delay={0.5}
          />
        </motion.div>
        
        {/* Villain character */}
        <motion.div
          className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-80 h-80 z-20"
          style={{ 
            x: smoothVillainX,
            opacity: smoothVillainOpacity
          }}
        >
          <Image
            src="/assets/3.png" // Replace with your Marvel villain
            alt="Marvel Villain"
            fill
            className="object-contain"
          />
        </motion.div>
        
        {/* Call to action */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40"
          style={{
            opacity: useTransform(scrollYProgress, [0.6, 0.8], [0, 1]),
            y: useTransform(scrollYProgress, [0.6, 0.8], [20, 0])
          }}
        >
          <button className="bg-red-600 text-white font-comic py-3 px-8 text-2xl rounded-lg transform hover:scale-105 transition-transform border-4 border-yellow-400 shadow-lg">
            BEGIN YOUR JOURNEY
          </button>
        </motion.div>
      </div>
    </CloudFrameLayout>
  );
}