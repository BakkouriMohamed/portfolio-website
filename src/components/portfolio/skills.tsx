"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import { skills, tools, qualities } from "@/lib/portfolio-data";

export function Skills() {
  // Duplicate tools for seamless marquee
  const marqueeTools = [...tools, ...tools];

  return (
    <section id="skills" className="border-t border-border">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-24 md:py-32">
        <SectionHeader
          index="04"
          label="Savoir-faire"
          title="Compétences"
          description="Six disciplines, treize outils, une approche orientée résultats."
        />

        {/* Skills grid */}
        <div className="grid grid-cols-12 gap-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="col-span-12 sm:col-span-6 lg:col-span-4 group relative border border-border p-6 md:p-8 hover:bg-foreground hover:text-background transition-colors duration-300 overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-mono text-xs text-swiss-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider opacity-50 group-hover:opacity-100">
                  {skill.category}
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                {skill.name}
              </h3>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-swiss-red origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 + 0.2 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Qualities strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 md:mt-20 grid grid-cols-12 gap-4 border-t border-border pt-10"
        >
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="text-swiss-red">→</span> Qualités
            </div>
          </div>
          <div className="col-span-12 md:col-span-9 flex flex-wrap gap-x-6 gap-y-3">
            {qualities.map((q, i) => (
              <motion.span
                key={q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="font-display text-lg md:text-xl font-medium tracking-tight flex items-center gap-2"
              >
                {q}
                {i < qualities.length - 1 && (
                  <span className="text-swiss-red ml-2">/</span>
                )}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tools marquee — full bleed */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-t border-border py-8 overflow-hidden bg-foreground text-background"
      >
        <div className="marquee-mask">
          <div className="flex animate-marquee whitespace-nowrap will-change-transform">
            {marqueeTools.map((tool, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-4 px-6 font-display text-2xl md:text-4xl font-bold tracking-tight"
              >
                {tool}
                <span className="text-swiss-red text-xl">✦</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
