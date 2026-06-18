'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollProgressBarProps {
  type?: 'bar' | 'circle';
  color?: string;
  strokeSize?: number;
  className?: string;
}

export function ScrollProgressBar({
  type = 'bar',
  color = 'hsl(var(--primary))',
  strokeSize = 3,
  className = '',
}: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (type === 'circle') {
    return null; // Add circle behavior in future if needed
  }

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-[100] origin-left ${className}`}
      style={{
        scaleX,
        height: strokeSize,
        backgroundColor: color,
      }}
    />
  );
}
