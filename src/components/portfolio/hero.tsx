"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { profile } from "@/lib/portfolio-data";

/**
 * Hero — Swiss + Motion
 * Huge name with kinetic reveal, cursor-following accent dot, intro paragraph.
 * Strict grid: name breaks across lines, accent red on selected glyph.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Smoothed cursor position relative to hero
  const sx = useSpring(mx, { stiffness: 150, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 150, damping: 20, mass: 0.5 });

  // Magnetic accent dot — slight offset based on cursor
  const dotX = useTransform(sx, [-0.5, 0.5], [-15, 15]);
  const dotY = useTransform(sy, [-0.5, 0.5], [-15, 15]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mx.set(x);
      my.set(y);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  // Word-by-word reveal config
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };
  const wordVariant = {
    hidden: { y: "110%" },
    show: {
      y: "0%",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-end pt-24 pb-10 overflow-hidden grain"
    >
      {/* Top meta row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto max-w-[1600px] w-full px-6 lg:px-10 grid grid-cols-12 gap-4 mb-12"
      >
        <div className="col-span-12 md:col-span-3 flex items-start gap-3">
          <span className="font-mono text-xs text-swiss-red mt-1">[01]</span>
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground leading-relaxed">
            <div>Portfolio</div>
            <div>2020 — 2026</div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            {profile.role}. Basé à {profile.location}. Disponible pour missions
            SEO, social media & stratégies de marque.
          </p>
        </div>
        <div className="col-span-12 md:col-span-3 md:text-right">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <div className="flex md:justify-end items-center gap-2">
              <span className="w-2 h-2 bg-swiss-red rounded-full animate-pulse" />
              Disponible
            </div>
          </div>
        </div>
      </motion.div>

      {/* Big name */}
      <div className="mx-auto max-w-[1600px] w-full px-6 lg:px-10">
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="font-display font-bold uppercase tracking-tightest leading-[0.85] text-[clamp(3rem,13vw,12rem)]"
        >
          <span className="block overflow-hidden">
            <motion.span variants={wordVariant} className="block">
              Mohamed
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span variants={wordVariant} className="block">
              Bakkouri
              <motion.span
                style={{ x: dotX, y: dotY }}
                className="inline-block ml-4 align-middle w-[0.4em] h-[0.4em] bg-swiss-red rounded-full"
              />
            </motion.span>
          </span>
        </motion.h1>
      </div>

      {/* Bottom strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mx-auto max-w-[1600px] w-full px-6 lg:px-10 mt-12 grid grid-cols-12 gap-4 border-t border-border pt-6"
      >
        <div className="col-span-12 md:col-span-4">
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            {profile.intro.split(".")[0]}.
          </p>
        </div>
        <div className="col-span-6 md:col-span-3 md:col-start-9">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Spécialité
          </div>
          <div className="font-display font-medium text-sm">
            {profile.tagline}
          </div>
        </div>
        <div className="col-span-6 md:col-span-1 md:text-right">
          <a
            href="#about"
            className="inline-flex flex-col items-center gap-1 group"
            aria-label="Scroll"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-swiss-red transition-colors">
              Scroll
            </span>
            <motion.svg
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              width="12"
              height="20"
              viewBox="0 0 12 20"
              fill="none"
              className="text-swiss-red"
            >
              <path
                d="M6 1V18M6 18L1 13M6 18L11 13"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </motion.svg>
          </a>
        </div>
      </motion.div>

      {/* Decorative grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 swiss-grid opacity-[0.04]"
      />
    </section>
  );
}
