import { MotionValue } from 'framer-motion';

// Animation utility functions

// Create a sequence of animation delays
export function createSequence(baseDelay: number, step: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => baseDelay + i * step);
}

// Map scroll progress to specific animations
export function mapScrollToAnimation(
  scrollProgress: MotionValue<number>,
  inputRange: number[],
  outputRange: number[]
) {
  const mappedValue = scrollProgress.get();
  
  // Find the appropriate segment
  let i = 1;
  while (i < inputRange.length && mappedValue > inputRange[i]) {
    i++;
  }
  
  const inputMin = inputRange[i - 1];
  const inputMax = inputRange[i];
  const outputMin = outputRange[i - 1];
  const outputMax = outputRange[i];
  
  // Linear interpolation
  const progress = (mappedValue - inputMin) / (inputMax - inputMin);
  return outputMin + progress * (outputMax - outputMin);
}

// Comic-themed easing functions
export const comicEasings = {
  // Bouncy effect for comic elements
  bounce: [0.175, 0.885, 0.32, 1.275],
  
  // Elastic effect for stretchy movements
  elastic: [0.68, -0.55, 0.265, 1.55],
  
  // Quick entrance
  quickIn: [0.25, 0.1, 0.25, 1],
  
  // Slow exit
  slowOut: [0.5, 0, 0.75, 0.5],
  
  // Dramatic pause
  dramaticPause: [0.5, 0, 0.1, 1]
};

// Animation presets for comic elements
export const comicAnimations = {
  pop: {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 15 
      } 
    }
  },
  
  swooshLeft: {
    hidden: { x: -100, opacity: 0, rotate: -10 },
    visible: { 
      x: 0, 
      opacity: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10 
      } 
    }
  },
  
  swooshRight: {
    hidden: { x: 100, opacity: 0, rotate: 10 },
    visible: { 
      x: 0, 
      opacity: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10 
      } 
    }
  },
  
  fadeUp: {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      } 
    }
  }
};