'use client';

import React from 'react';
import Image from 'next/image';
import ComicPanel from './ComicPanel';
import { ComicSpeechBubble, ComicExplosion } from './ComicElements';

export default function ComicStrip() {
  return (
    <div className="relative min-h-screen bg-gray-100 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-comic text-center text-red-600 mb-16">THE STORY UNFOLDS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {/* First Comic Panel */}
          <ComicPanel direction="left" threshold={0.3}>
            <div className="bg-white border-8 border-black p-6 aspect-square relative shadow-comic">
              <Image 
                src="/images/panel1.png" // Replace with your panel image
                alt="Comic Panel 1" 
                fill
                className="object-contain"
              />
              <ComicSpeechBubble
                text="The city needs a hero!"
                position="absolute top-4 right-4"
                delay={0.5}
              />
            </div>
          </ComicPanel>
          
          {/* Second Comic Panel */}
          <ComicPanel direction="bottom" threshold={0.3} delay={0.2}>
            <div className="bg-white border-8 border-black p-6 aspect-square relative shadow-comic">
              <Image 
                src="/images/panel2.png" // Replace with your panel image
                alt="Comic Panel 2" 
                fill
                className="object-contain"
              />
              <ComicExplosion
                position="absolute bottom-4 left-4"
                variant="pow"
                delay={0.7}
              />
            </div>
          </ComicPanel>
          
          {/* Third Comic Panel */}
          <ComicPanel direction="right" threshold={0.3} delay={0.4}>
            <div className="bg-white border-8 border-black p-6 aspect-square relative shadow-comic">
              <Image 
                src="/images/panel3.png" // Replace with your panel image
                alt="Comic Panel 3" 
                fill
                className="object-contain"
              />
              <ComicSpeechBubble
                text="Together we can save the day!"
                position="absolute top-4 left-4"
                delay={0.9}
              />
            </div>
          </ComicPanel>
        </div>
        
        {/* Second row of panels */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {/* Large Comic Panel */}
          <ComicPanel direction="left" threshold={0.3} delay={0.2}>
            <div className="bg-white border-8 border-black p-6 aspect-square relative shadow-comic">
              <Image 
                src="/images/panel4.png" // Replace with your panel image
                alt="Comic Panel 4" 
                fill
                className="object-contain"
              />
              <ComicSpeechBubble
                text="We need to find the source of power!"
                position="absolute top-4 right-4"
                delay={0.5}
                width="w-72"
              />
            </div>
          </ComicPanel>
          
          {/* Large Comic Panel */}
          <ComicPanel direction="right" threshold={0.3} delay={0.4}>
            <div className="bg-white border-8 border-black p-6 aspect-square relative shadow-comic">
              <Image 
                src="/images/panel5.png" // Replace with your panel image
                alt="Comic Panel 5" 
                fill
                className="object-contain"
              />
              <ComicExplosion
                position="absolute bottom-4 right-4"
                variant="bam"
                delay={0.6}
              />
            </div>
          </ComicPanel>
        </div>
      </div>
    </div>
  );
}