"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { SectionHeader } from "./section-header";
import { projects } from "@/lib/portfolio-data";

export function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="projects" className="border-t border-border bg-secondary/30">
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
              className={`col-span-12 md:col-span-6 lg:col-span-4 group relative border border-border bg-background overflow-hidden transition-all duration-500 ${
                hovered !== null && hovered !== i ? "opacity-40" : "opacity-100"
              }`}
            >
              {/* 1. Top image — prominent aesthetic photograph */}
              {project.image && (
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground">
                  <Image
                    src={project.image}
                    alt={`${project.name} — ${project.subtitle}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay tint that lifts on hover */}
                  <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/0 transition-colors duration-500" />

                  {/* P## + Year — top-right corner, combined */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-white bg-black/50 backdrop-blur-sm px-2 py-1">
                    <span className="text-swiss-red font-medium">
                      P{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/40">/</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              )}

              {/* Content block below image */}
              <div className="p-8 md:p-10">
                {/* 2. Large bold project title */}
                <h3
                  className={`font-display font-bold uppercase tracking-tightest leading-[0.9] text-4xl md:text-5xl lg:text-6xl ${
                    project.image ? "mt-0" : "mt-12 md:mt-16"
                  }`}
                >
                  {project.name}
                </h3>

                {/* 3. Subtitle (red) + sub-category tag in smaller caps */}
                <div className="mt-3 font-display text-base font-medium text-swiss-red">
                  {project.subtitle}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {project.category}
                </div>

                {/* 4. Descriptive paragraph */}
                <p className="mt-8 text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* 5. Tags / pills at the bottom */}
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
              </div>

              {/* Hover arrow */}
              <motion.div
                animate={{
                  x: hovered === i ? 0 : -8,
                  opacity: hovered === i ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="absolute top-3 left-3 text-swiss-red z-10"
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
