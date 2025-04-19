// comic/ComicCloud.tsx
import { useEffect, useRef, ReactNode } from 'react';
import Image from 'next/image';

interface ComicCloudProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'small' | 'medium' | 'large';
  zIndex?: number;
  scrollSpeed?: number;
}

export const ComicCloud: React.FC<ComicCloudProps> = ({ 
  position, 
  size = 'medium', 
  zIndex = 10,
  scrollSpeed = 1.5
}) => {
  // Define size values
  const sizeValues = {
    small: { width: 128, height: 128 },
    medium: { width: 192, height: 192 },
    large: { width: 256, height: 256 }
  };
  
  // Define position values
  const positionStyles: {[key: string]: React.CSSProperties} = {
    'top-left': { top: '-2rem', left: '-2rem' },
    'top-right': { top: '-2rem', right: '-2rem' },
    'bottom-left': { bottom: '-2rem', left: '-2rem' },
    'bottom-right': { bottom: '-2rem', right: '-2rem' }
  };
  
  return (
    <div 
      className="absolute comic-cloud"
      style={{ 
        ...positionStyles[position], 
        zIndex, 
        transform: 'translate(0, 0)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
      }}
      data-scroll-speed={scrollSpeed}
      data-position={position}
    >
      <Image 
        src="/3.png" 
        alt="Cloud" 
        width={sizeValues[size].width} 
        height={sizeValues[size].height}
        className="pointer-events-none"
      />
    </div>
  );
};

interface CloudFrameLayoutProps {
  children: ReactNode;
}

export const CloudFrameLayout: React.FC<CloudFrameLayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const clouds = containerRef.current.querySelectorAll('.comic-cloud');
      const scrollPosition = window.scrollY;
      
      clouds.forEach((cloud) => {
        const scrollSpeed = cloud.getAttribute('data-scroll-speed') || '1';
        const position = cloud.getAttribute('data-position') || '';
        
        // Calculate the direction for the cloud to move based on its position
        let translateX = 0;
        let translateY = 0;
        
        if (position.includes('left')) {
          translateX = -scrollPosition * parseFloat(scrollSpeed) * 0.5;
        } else if (position.includes('right')) {
          translateX = scrollPosition * parseFloat(scrollSpeed) * 0.5;
        }
        
        if (position.includes('top')) {
          translateY = -scrollPosition * parseFloat(scrollSpeed) * 0.5;
        } else if (position.includes('bottom')) {
          translateY = scrollPosition * parseFloat(scrollSpeed) * 0.5;
        }
        
        // Calculate opacity - clouds become more transparent as you scroll
        const opacity = Math.max(0, 1 - (scrollPosition / 500));
        
        // Apply the transform and opacity
        cloud.setAttribute('style', `
          position: absolute;
          z-index: 10;
          transform: translate(${translateX}px, ${translateY}px);
          opacity: ${opacity};
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        `);
      });
    };
    
    // Initial run
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="comic-parallax-container relative min-h-screen">
      <ComicCloud position="top-left" size="large" scrollSpeed={1.8} />
      <ComicCloud position="top-right" size="medium" scrollSpeed={1.2} />
      <ComicCloud position="bottom-left" size="medium" scrollSpeed={1.5} />
      <ComicCloud position="bottom-right" size="large" scrollSpeed={1.3} />
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};