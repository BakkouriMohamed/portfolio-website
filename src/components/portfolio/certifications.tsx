"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { certifications, profile } from "@/lib/portfolio-data";

export function Certifications() {
  return (
    <section id="certs" className="border-t border-border">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-24 md:py-32">
        <SectionHeader
          index="06"
          label="Diplômes"
          title="Certifications"
          description="Quatre certifications officielles — Google, Meta, HubSpot — dans le marketing digital et l'analytics."
        />

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group col-span-12 sm:col-span-6 lg:col-span-3 relative p-6 md:p-8 border border-border hover:border-foreground transition-colors duration-300 flex flex-col justify-between min-h-[220px]"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-swiss-red">
                  C{String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-2xl font-bold text-swiss-red tracking-tight">
                  {cert.year}
                </span>
              </div>

              <div className="mt-8">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                  {cert.issuer}
                </div>
                <h3 className="font-display text-lg font-medium tracking-tight leading-snug">
                  {cert.name}
                </h3>
                <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  ID: {cert.credentialId}
                </div>
              </div>

              {/* Hover bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-swiss-red origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 + 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* LinkedIn verification CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-border pt-10"
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
              <span className="text-swiss-red">→</span> Vérification
            </div>
            <p className="font-display text-lg md:text-xl font-medium tracking-tight max-w-xl">
              Toutes les certifications sont vérifiables sur mon profil LinkedIn
              officiel.
            </p>
          </div>
          <a
            href={profile.linkedinCerts}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors duration-300 self-start"
          >
            <span className="font-mono text-xs uppercase tracking-wider">
              Voir sur LinkedIn
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
            >
              <path
                d="M4 12L12 4M12 4H6M12 4V10"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
