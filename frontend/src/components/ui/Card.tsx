'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  const baseClasses = 'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6';
  const hoverClasses = hover ? 'hover:bg-white/20 transition-all duration-300' : '';
  
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
}

