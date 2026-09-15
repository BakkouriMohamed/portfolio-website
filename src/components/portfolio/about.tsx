"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { profile, languages, education } from "@/lib/portfolio-data";

export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1600px] px-6 lg:px-10 py-24 md:py-32"
    >
      <SectionHeader
        index="02"
        label="Profil"
        title="À propos"
        description="Une double culture — académique et terrain — au service de la visibilité des marques."
      />

      <div className="grid grid-cols-12 gap-4 md:gap-8">
        {/* Big bio — left, dominant */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 md:col-span-8"
        >
          <p className="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.2] tracking-tight font-medium">
            {profile.intro.split(".").slice(0, 2).join(".")}.
          </p>
          <p className="mt-8 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {profile.intro.split(".").slice(2).join(".").trim()}.
          </p>
        </motion.div>

        {/* Quick facts — right */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 md:col-span-4 md:pl-8 md:border-l md:border-border"
        >
          <div className="space-y-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Basé à
              </div>
              <div className="font-display text-lg font-medium">
                {profile.location}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Email
              </div>
              <a
                href={`mailto:${profile.email}`}
                className="link-underline font-mono text-sm hover:text-swiss-red transition-colors break-all"
              >
                {profile.email}
              </a>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Téléphone
              </div>
              <a
                href={`tel:${profile.phone}`}
                className="link-underline font-mono text-sm hover:text-swiss-red transition-colors"
              >
                {profile.phoneDisplay}
              </a>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
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
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Statut
              </div>
              <div className="flex items-center gap-2 font-display text-lg font-medium">
                <span className="w-2 h-2 bg-swiss-red rounded-full animate-pulse" />
                Disponible
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Languages + Education row */}
      <div className="grid grid-cols-12 gap-4 md:gap-8 mt-20 md:mt-32">
        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 md:col-span-6"
        >
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
            <span className="text-swiss-red">→</span> Langues
          </div>
          <div className="space-y-4">
            {languages.map((lang, i) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="grid grid-cols-12 gap-4 items-baseline border-b border-border pb-4"
              >
                <span className="col-span-1 font-mono text-xs text-swiss-red">
                  {lang.code}
                </span>
                <span className="col-span-7 font-display text-xl md:text-2xl font-medium tracking-tight">
                  {lang.name}
                </span>
                <span className="col-span-4 text-right font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {lang.level}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 md:col-span-6 md:pl-8 md:border-l md:border-border"
        >
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
            <span className="text-swiss-red">→</span> Formation
          </div>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="grid grid-cols-12 gap-4 items-baseline border-b border-border pb-4"
              >
                <span className="col-span-12 font-mono text-xs text-muted-foreground">
                  {edu.period}
                </span>
                <span className="col-span-8 -mt-2 font-display text-lg md:text-xl font-medium tracking-tight leading-snug">
                  {edu.degree}
                </span>
                <span className="col-span-4 -mt-2 text-right font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {edu.school}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
