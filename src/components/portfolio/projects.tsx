"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { SectionHeader } from "./section-header";
import { projects } from "@/lib/portfolio-data";

export function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="projects"
      className="border-t border-border bg-secondary/30"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-24 md:py-32">
        <SectionHeader
          index="05"
          label="Travaux"
          title="Projets"
          description="Trois études de cas — branding, événementiel et SEO. Chacune avec une approche et un livrable propre."
        />

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {projects.map((project, i) => (
            <motion.article
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`col-span-12 md:col-span-6 lg:col-span-4 group relative border border-border bg-background p-8 md:p-10 overflow-hidden transition-all duration-500 ${
                hovered !== null && hovered !== i ? "opacity-40" : "opacity-100"
              }`}
            >
              {/* Index + year */}
              <div className="flex items-start justify-between mb-12 md:mb-16">
                <span className="font-mono text-xs text-swiss-red">
                  P{String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {project.year}
                </span>
              </div>

              {/* Project name */}
              <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-[0.9] uppercase">
                {project.name}
              </h3>

              {/* Subtitle */}
              <div className="mt-3 font-display text-base font-medium text-swiss-red">
                {project.subtitle}
              </div>

              {/* Category */}
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {project.category}
              </div>

              {/* Description */}
              <p className="mt-8 text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] uppercase tracking-wider border border-border px-2 py-1 group-hover:border-swiss-red group-hover:text-swiss-red transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover arrow */}
              <motion.div
                animate={{
                  x: hovered === i ? 0 : -8,
                  opacity: hovered === i ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="absolute top-8 right-8 text-swiss-red"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 15L15 5M15 5H7M15 5V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </motion.div>

              {/* Bottom accent bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-[3px] bg-swiss-red"
                initial={{ width: 0 }}
                animate={{ width: hovered === i ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
