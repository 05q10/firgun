"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaPencilAlt, FaBook, FaUser } from "react-icons/fa";
import Link from "next/link";
import { Playfair_Display, Outfit } from "next/font/google";

// Font setup
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export default function Lander() {
  // State for managing video and content transitions
  const [showContent, setShowContent] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    // Show content after a timeout regardless of video status
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 6000);
    
    // Handle video events
    const handleVideoEnd = () => {
      setShowContent(true);
    };
    
    const handleVideoPlay = () => {
      console.log("Video playing");
    };
    
    const handleVideoError = (e: any) => {
      console.error("Video error:", e);
      setVideoFailed(true);
      setShowContent(true); // Show content immediately if video fails
    };
    
    // Add event listeners to video element
    if (videoRef.current) {
      videoRef.current.addEventListener("ended", handleVideoEnd);
      videoRef.current.addEventListener("play", handleVideoPlay);
      videoRef.current.addEventListener("error", handleVideoError);
      
      // Force play attempt
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Video play failed:", error);
          setVideoFailed(true);
          setShowContent(true);
        });
      }
    } else {
      // No video ref available
      setVideoFailed(true);
      setShowContent(true);
    }
    
    return () => {
      clearTimeout(timer);
      if (videoRef.current) {
        videoRef.current.removeEventListener("ended", handleVideoEnd);
        videoRef.current.removeEventListener("play", handleVideoPlay);
        videoRef.current.removeEventListener("error", handleVideoError);
      }
    };
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.8,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  const cards = [
    {
      id: 1,
      title: "Creative Writing",
      icon: <FaPencilAlt className="text-4xl text-amber-500" />,
      description: "Unleash your imagination and bring your stories to life",
      link: "/writing"
    },
    {
      id: 2,
      title: "Grammar",
      icon: <FaBook className="text-4xl text-amber-500" />,
      description: "Master the rules of language to enhance your writing",
      link: "/grammar"
    },
    {
      id: 3,
      title: "About Me",
      icon: <FaUser className="text-4xl text-amber-500" />,
      description: "Learn about the teacher behind the lessons",
      link: "/about"
    }
  ];

  return (
    <div className={`${playfair.variable} ${outfit.variable}`}>
      <div ref={containerRef} className="relative min-h-screen overflow-hidden font-sans">
        {/* Yellow radial gradient background - Always visible */}
        <motion.div
          className="fixed top-0 left-0 w-full h-full z-0"
          style={{
            opacity: backgroundOpacity,
            scale,
            background: "radial-gradient(circle, rgba(255,236,170,1) 0%, rgba(252,211,77,1) 50%, rgba(251,191,36,1) 100%)"
          }}
        />
        
        {/* Video handling with fallback */}
        {!videoFailed && (
          <div className={`fixed top-0 left-0 w-full h-full z-10 transition-opacity duration-1000 ${showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {/* Video element */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="object-cover w-full h-full scale-100"
              onError={() => setVideoFailed(true)}
            >
              <source src="/ami.mp4" type="video/mp4" />
              
              Your browser does not support the video tag.
            </video>
            
            
            
          </div>
        )}
        
        {/* Main Content */}
        <div className={`relative z-5 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {/* Hero Section */}
          <motion.div
            className="flex flex-col items-center justify-center min-h-screen px-4 text-center pt-16 md:pt-24"
            style={{ y }}
          >
            <motion.h1
              className="font-playfair text-4xl md:text-6xl font-bold mb-6 text-gray-800 pt-10"
              initial={{ y: 50, opacity: 0 }}
              animate={showContent ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Welcome to Creative Writing & Grammar
            </motion.h1>
            
            <motion.p
              className="font-outfit text-lg md:text-xl mb-10 max-w-2xl text-gray-700 leading-relaxed"
              initial={{ y: 50, opacity: 0 }}
              animate={showContent ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Explore the magic of words and language with our interactive lessons designed especially for students in grades 4-9.
            </motion.p>
            
            <motion.div
              className="w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={showContent ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {cards.map((card, i) => (
                <Link href={card.link} key={card.id}>
                  <motion.div
                    className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl p-8 cursor-pointer shadow-lg flex flex-col items-center text-center h-full border border-amber-100"
                    custom={i}
                    initial="hidden"
                    animate={showContent ? "visible" : "hidden"}
                    whileHover="hover"
                    variants={cardVariants}
                  >
                    <div className="mb-5">{card.icon}</div>
                    <h3 className="font-playfair text-2xl font-semibold mb-3 text-gray-800">{card.title}</h3>
                    <p className="font-outfit text-gray-600">{card.description}</p>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}