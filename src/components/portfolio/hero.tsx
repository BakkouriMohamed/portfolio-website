"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { profile } from "@/lib/portfolio-data";
import { EasterDot } from "./snake-dot";

/**
 * Hero — Swiss + Motion with portrait
 *
 * Layout (desktop):
 *  - Left 7/12: top meta row, kinetic name, bottom strip with intro + scroll
 *  - Right 5/12: vertical portrait, grayscale-on-hover-color, red vertical accent
 *
 * Motion:
 *  - Word-by-word slide-up reveal
 *  - Interactive physics dot on the name (click to play, click to reset)
 *  - Scroll indicator bounce
 *  - Photo: grayscale → color on hover, subtle parallax via cursor
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 150, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 150, damping: 20, mass: 0.5 });

  // Subtle parallax on the photo
  const imgX = useTransform(sx, [-0.5, 0.5], [8, -8]);
  const imgY = useTransform(sy, [-0.5, 0.5], [12, -12]);

  const [hovered, setHovered] = useState(false);

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
      className="relative min-h-screen flex flex-col pt-28 overflow-hidden grain"
    >
      {/* Top meta row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto max-w-[1600px] w-full px-6 lg:px-10 grid grid-cols-12 gap-4 mb-8 md:mb-12"
      >
        <div className="col-span-6 md:col-span-3 flex items-start gap-3">
          <span className="font-mono text-xs text-swiss-red mt-1">[01]</span>
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground leading-relaxed">
            <div>Portfolio</div>
            <div>2020 — 2026</div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-4">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            {profile.role}. Basé à {profile.location}. Disponible pour missions
            SEO, social media & stratégies de marque.
          </p>
        </div>
        <div className="col-span-6 md:col-span-3 md:text-right">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <div className="flex md:justify-end items-center gap-2">
              <span className="w-2 h-2 bg-swiss-red rounded-full animate-pulse" />
              Disponible
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main grid: name + photo */}
      <div className="mx-auto max-w-[1600px] w-full px-6 lg:px-10 grid grid-cols-12 gap-4 flex-1 items-end">
        {/* Left: big kinetic name */}
        <div className="col-span-12 md:col-span-7 lg:col-span-8 pb-8 md:pb-10">
          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            className="font-display font-bold uppercase tracking-tightest leading-[0.85] text-[clamp(3rem,11vw,11rem)]"
          >
            <span className="block overflow-hidden">
              <motion.span variants={wordVariant} className="block">
                Mohamed
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={wordVariant} className="block">
                Bakkouri
                <EasterDot />
              </motion.span>
            </span>
          </motion.h1>
        </div>

        {/* Right: portrait with Swiss framing */}
        <motion.div
          initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 md:col-span-5 lg:col-span-4 relative h-[280px] sm:h-[380px] md:h-[460px] lg:h-[540px]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Vertical red accent line — left edge */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-swiss-red origin-top hidden md:block"
          />

          {/* Photo container */}
          <div className="relative w-full h-full overflow-hidden md:ml-4">
            <motion.div
              style={{ x: imgX, y: imgY }}
              className="absolute inset-0 -m-4"
            >
              <Image
                src="/mohamed-portrait.jpeg"
                alt="Mohamed Bakkouri — portrait professionnel"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
                className="object-cover object-center transition-[filter,transform] duration-700"
                style={{
                  filter: hovered
                    ? "grayscale(0%) contrast(1.05)"
                    : "grayscale(85%) contrast(1.1) brightness(0.95)",
                }}
              />
            </motion.div>

            {/* Bottom-left caption block */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            >
              <div className="font-mono text-[9px] uppercase tracking-wider text-white/70 mb-1">
                [PORTRAIT]
              </div>
              <div className="font-display text-xs font-medium text-white">
                {profile.name}
              </div>
              <div className="font-mono text-[10px] text-white/60 uppercase tracking-wider">
                {profile.location}
              </div>
            </motion.div>

            {/* Top-right index marker */}
            <div className="absolute top-2 right-2 font-mono text-[9px] uppercase tracking-wider text-white/80 bg-black/40 px-1.5 py-0.5">
              M.B / 2026
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="mx-auto max-w-[1600px] w-full px-6 lg:px-10 mt-8 md:mt-12 grid grid-cols-12 gap-4 border-t border-border pt-6"
      >
        <div className="col-span-12 md:col-span-5">
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
