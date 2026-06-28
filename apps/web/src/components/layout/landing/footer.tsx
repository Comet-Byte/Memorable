"use client";

import { animate, motion, useMotionValue, useSpring } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

// Animated brand wordmark: the word "Memorable" with a roaming RGB spotlight
// that brightens the letters it passes over. The spotlight follows the cursor
// on hover and gently auto-roams otherwise.
const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const svgViewBox = { width: 1000, height: 220 };

  const x = useMotionValue(svgViewBox.width / 2);
  const y = useMotionValue(svgViewBox.height / 2);

  const springConfig = { damping: 200, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const loopingAnimX = useRef<ReturnType<typeof animate> | null>(null);
  const loopingAnimY = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    let initialAnimX: ReturnType<typeof animate> | undefined;
    let initialAnimY: ReturnType<typeof animate> | undefined;

    if (!isHovered) {
      const fromX = x.get();
      const toX = svgViewBox.width;
      const fullDurationX = 10;
      const durationX = fullDurationX * (Math.abs(toX - fromX) / svgViewBox.width);

      initialAnimX = animate(x, toX, {
        duration: durationX,
        ease: "linear",
        onComplete: () => {
          loopingAnimX.current = animate(x, [toX, 0], {
            duration: fullDurationX,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          });
        },
      });

      const fromY = y.get();
      const toY = svgViewBox.height * 0.8;
      const waypointA = svgViewBox.height * 0.8;
      const waypointB = svgViewBox.height * 0.2;
      const fullDurationY = 8;
      const durationY = fullDurationY * (Math.abs(toY - fromY) / Math.abs(waypointA - waypointB));

      initialAnimY = animate(y, toY, {
        duration: durationY,
        ease: "linear",
        onComplete: () => {
          loopingAnimY.current = animate(y, [toY, waypointB], {
            duration: fullDurationY,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          });
        },
      });
    }

    return () => {
      initialAnimX?.stop();
      initialAnimY?.stop();
      loopingAnimX.current?.stop();
      loopingAnimX.current = null;
      loopingAnimY.current?.stop();
      loopingAnimY.current = null;
    };
  }, [isHovered, x, y, svgViewBox.width, svgViewBox.height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const svgX = (mouseX / rect.width) * svgViewBox.width;
      const svgY = (mouseY / rect.height) * svgViewBox.height;

      x.set(svgX);
      y.set(svgY);
    }
  };

  const handleMouseOver = () => setIsHovered(true);
  const handleMouseOut = () => setIsHovered(false);

  const wordmarkStyle: React.CSSProperties = {
    fontFamily: "var(--font-instrument-serif)",
    fontSize: 168,
    fontWeight: 600,
    letterSpacing: "-0.02em",
  };

  return (
    <div
      ref={containerRef}
      className="flex h-[140px] items-center overflow-hidden px-4 sm:h-auto sm:px-0"
      onMouseMove={handleMouseMove}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <svg
        width="100%"
        height="220"
        viewBox={`0 0 ${svgViewBox.width} ${svgViewBox.height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base (dim) wordmark */}
        <text
          x="50%"
          y="58%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#text-gradient)"
          style={wordmarkStyle}
        >
          Memorable
        </text>

        {/* RGB spotlight, masked to the wordmark shape */}
        <g mask="url(#stroke-mask)">
          <motion.circle
            animate={{ rotate: 360 }}
            transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" } }}
            cx={smoothX}
            cy={smoothY}
            r="100"
            fill="url(#circle-rgb-gradient)"
            filter="url(#blur-filter)"
            overflow="visible"
          />
        </g>

        <defs>
          <filter id="blur-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
          </filter>
          <mask id="stroke-mask">
            <text
              x="50%"
              y="58%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="white"
              opacity="0.85"
              style={wordmarkStyle}
            >
              Memorable
            </text>
          </mask>
          <linearGradient id="text-gradient" x1="500" y1="0" x2="500" y2="220" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--foreground)" stopOpacity="0.05" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="circle-rgb-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0.125" stopColor="#FF0000" />
            <stop offset="0.26" stopColor="#FFA500" />
            <stop offset="0.39" stopColor="#FFFF00" />
            <stop offset="0.52" stopColor="#008000" />
            <stop offset="0.65" stopColor="#0000FF" />
            <stop offset="0.78" stopColor="#4B0082" />
            <stop offset="0.91" stopColor="#EE82EE" />
            <stop offset="1" stopColor="#FF0000" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Footer;
