'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Skip motion wrapper so above-the-fold content paints immediately (LCP). */
  priority?: boolean;
}

const inViewOptions = { once: true, amount: 0.1 };

export function AnimateIn({ children, delay = 0, className = '', priority = false }: AnimateInProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, inViewOptions);

  if (priority || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, className = '' }: AnimateInProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, inViewOptions);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.3 : 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: AnimateInProps & { direction?: 'up' | 'down' | 'left' | 'right' }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, inViewOptions);

  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...(shouldReduceMotion ? {} : directionOffset[direction]),
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...(shouldReduceMotion ? {} : directionOffset[direction]) }
      }
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, inViewOptions);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, className = '' }: AnimateInProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, inViewOptions);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={
        shouldReduceMotion
          ? {}
          : { y: -4, transition: { duration: 0.2 } }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
