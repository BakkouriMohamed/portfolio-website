"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader } from "./section-header";
import { experiences } from "@/lib/portfolio-data";

export function Experience() {
  return (
    <section
      id="experience"
      className="border-t border-border bg-secondary/30"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-24 md:py-32">
        <SectionHeader
          index="03"
          label="Parcours"
          title="Expérience"
          description="Trois missions récentes, chacune avec un objectif mesurable."
        />

        <div className="space-y-0">
          {experiences.map((exp, i) => (
            <motion.article
              key={exp.company + exp.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group grid grid-cols-12 gap-4 md:gap-8 py-10 md:py-12 border-b border-border hover:bg-background transition-colors duration-300 -mx-4 px-4 md:-mx-8 md:px-8 rounded-sm"
            >
              {/* Period + index */}
              <div className="col-span-12 md:col-span-2 flex md:flex-col md:items-start items-center gap-3 md:gap-1">
                <div className="font-mono text-[10px] uppercase tracking-wider text-swiss-red">
                  {String(experiences.length - i).padStart(2, "0")}
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  {exp.period}
                </div>
              </div>

              {/* Logo + Role + company */}
              <div className="col-span-12 md:col-span-5 flex items-start gap-4 md:gap-6">
                {/* Logo */}
                {exp.logo ? (
                  <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border border-border bg-background p-2 overflow-hidden group-hover:border-swiss-red transition-colors duration-300">
                    <Image
                      src={exp.logo}
                      alt={`Logo ${exp.company}`}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  /* Placeholder when no logo: monogram block */
                  <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border border-border bg-foreground text-background flex items-center justify-center group-hover:bg-swiss-red group-hover:border-swiss-red transition-colors duration-300">
                    <span className="font-display text-2xl md:text-3xl font-bold tracking-tightest">
                      {exp.company.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                    {exp.role}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-3 flex-wrap">
                    <span className="font-display text-lg font-medium">
                      {exp.company}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {exp.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description + tags */}
              <div className="col-span-12 md:col-span-5">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] uppercase tracking-wider border border-border px-2 py-1 group-hover:border-swiss-red group-hover:text-swiss-red transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Metric callout */}
                {exp.metric && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-6 inline-flex items-baseline gap-2"
                  >
                    <span className="text-swiss-red text-2xl">↗</span>
                    <span className="font-display text-2xl md:text-3xl font-bold text-swiss-red tracking-tight">
                      {exp.metric}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
