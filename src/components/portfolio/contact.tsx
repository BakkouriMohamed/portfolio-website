"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/portfolio-data";

export function Contact() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="border-t border-border bg-foreground text-background overflow-hidden"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-24 md:py-32">
        {/* Big CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-12 gap-4"
        >
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-swiss-red mb-2">
              [07] — Contact
            </div>
            <div className="font-mono text-xs uppercase tracking-wider text-background/50">
              Échangeons
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <p className="font-display text-2xl md:text-4xl lg:text-5xl font-bold tracking-tightest leading-tight">
              Travaillons ensemble sur votre prochaine stratégie.
            </p>
          </div>
        </motion.div>

        {/* Email — big */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-24 border-t border-background/20 pt-12"
        >
          <div className="font-mono text-[10px] uppercase tracking-wider text-background/50 mb-4">
            Email
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-baseline gap-3 font-display text-3xl md:text-5xl lg:text-7xl font-bold tracking-tightest leading-none hover:text-swiss-red transition-colors break-all"
          >
            {profile.email}
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-swiss-red inline-block"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                className="md:w-12 md:h-12 lg:w-16 lg:h-16"
              >
                <path
                  d="M7 25L25 7M25 7H11M25 7V21"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </motion.span>
          </a>
        </motion.div>

        {/* Meta grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 grid grid-cols-12 gap-4 border-t border-background/20 pt-12"
        >
          <div className="col-span-6 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-background/50 mb-2">
              Localisation
            </div>
            <div className="font-display text-base font-medium">
              {profile.location}
            </div>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-background/50 mb-2">
              Statut
            </div>
            <div className="font-display text-base font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-swiss-red rounded-full animate-pulse" />
              Disponible
            </div>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-background/50 mb-2">
              Langues
            </div>
            <div className="font-display text-base font-medium">
              FR · AR · EN
            </div>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-background/50 mb-2">
              LinkedIn
            </div>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-mono text-sm hover:text-swiss-red transition-colors"
            >
              /in/mohamedbakkouri
            </a>
          </div>
        </motion.div>

        {/* Footer bottom */}
        <div className="mt-24 flex flex-col md:flex-row md:items-end justify-between gap-4 border-t border-background/20 pt-8">
          <div className="font-mono text-xs uppercase tracking-wider text-background/50">
            © {year} Mohamed Bakkouri — Tous droits réservés
          </div>
          <div className="font-mono text-xs uppercase tracking-wider text-background/50 flex items-center gap-2">
            <span className="w-2 h-2 bg-swiss-red inline-block" />
            Conçu & développé avec rigueur
          </div>
        </div>
      </div>
    </footer>
  );
}
