'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, AnimationControls } from 'framer-motion';

interface ComicPanelProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'scale' | 'rotate' | 'pop';
  distance?: number;
  threshold?: number;
  delay?: number;
  duration?: number;
  zIndex?: number;
  className?: string;
}

export default function ComicPanel({
  children,
  direction = 'left',
  distance = 100,
  threshold = 0.2,
  delay = 0,
  duration = 0.5,
  zIndex = 10,
  className = '',
}: ComicPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls: AnimationControls = useAnimation();
  
  useEffect(() => {
    const element = ref.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        } else {
          controls.start('hidden');
        }
      },
      { threshold }
    );
    
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [controls, threshold]);
  
  // Define direction-based variants
  const getVariants = () => {
    // Starting positions based on direction
    const directionMap = {
      left: { x: -distance, opacity: 0 },
      right: { x: distance, opacity: 0 },
      top: { y: -distance, opacity: 0 },
      bottom: { y: distance, opacity: 0 },
      scale: { scale: 0.7, opacity: 0 },
      rotate: { rotate: -15, scale: 0.8, opacity: 0 },
      pop: { scale: 0.5, opacity: 0 },
    };
    
    return {
      hidden: directionMap[direction] || directionMap.left,
      visible: { 
        x: 0, 
        y: 0, 
        scale: 1, 
        rotate: 0, 
        opacity: 1, 
        transition: { 
          duration,
          delay,
          type: "spring",
          stiffness: 100,
          damping: 20
        } 
      }
    };
  };
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={getVariants()}
      style={{ zIndex }}
      className={`comic-panel ${className}`}
    >
      {children}
    </motion.div>
  );
}