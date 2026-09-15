"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Swiss-style fixed navigation bar.
 * - Left: MB logo + name
 * - Center: section anchors (desktop only)
 * - Right: contact CTA + clock (local time)
 * Top: thin scroll progress bar in Swiss red.
 */
export function NavBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Africa/Casablanca",
      };
      setTime(new Intl.DateTimeFormat("fr-FR", opts).format(now));
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const navItems = [
    { label: "Profil", href: "#about", index: "01" },
    { label: "Expérience", href: "#experience", index: "02" },
    { label: "Compétences", href: "#skills", index: "03" },
    { label: "Projets", href: "#projects", index: "04" },
    { label: "Certifs", href: "#certs", index: "05" },
  ];

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-swiss-red origin-left z-50"
      />

      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="flex items-center justify-between h-14">
            {/* Left: MB logo + name */}
            <a
              href="#top"
              className="font-display font-bold text-sm tracking-tightest uppercase flex items-center gap-3 group"
            >
              <div className="relative w-8 h-8 overflow-hidden group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/logo-mb.png"
                  alt="MB Logo"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <span className="hidden sm:inline">Mohamed Bakkouri</span>
            </a>

            {/* Center: nav (desktop only) */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="link-underline text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-swiss-red mr-1">{item.index}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right: clock + contact */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline font-mono text-xs text-muted-foreground tabular-nums">
                {time} <span className="text-swiss-red">CAS</span>
              </span>
              <a
                href="#contact"
                className="text-xs font-mono uppercase tracking-wider border border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
