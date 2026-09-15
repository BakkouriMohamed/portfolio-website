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

        {/* Email + Phone — big */}
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
            className="group inline-flex items-baseline gap-3 font-display text-2xl md:text-4xl lg:text-6xl font-bold tracking-tightest leading-none hover:text-swiss-red transition-colors break-all"
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
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                className="md:w-10 md:h-10 lg:w-14 lg:h-14"
              >
                <path
                  d="M7 25L25 7M25 7H11M25 7V21"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </motion.span>
          </a>

          {/* Phone */}
          <div className="font-mono text-[10px] uppercase tracking-wider text-background/50 mb-4 mt-12">
            Téléphone
          </div>
          <a
            href={`tel:${profile.phone}`}
            className="group inline-flex items-baseline gap-3 font-display text-2xl md:text-4xl lg:text-6xl font-bold tracking-tightest leading-none hover:text-swiss-red transition-colors"
          >
            {profile.phoneDisplay}
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-swiss-red inline-block"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="md:w-10 md:h-10 lg:w-14 lg:h-14"
              >
                <path
                  d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
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
