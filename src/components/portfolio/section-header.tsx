"use client";

import { motion } from "framer-motion";

/**
 * Swiss-style section header.
 * Numbered index, big label, optional small description on the right.
 * Slides in on scroll.
 */
export function SectionHeader({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-12 gap-4 mb-16 md:mb-24 pb-6 border-b border-border"
    >
      <div className="col-span-12 md:col-span-3 flex items-start gap-3">
        <span className="font-mono text-xs text-swiss-red mt-1">[{index}]</span>
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="col-span-12 md:col-span-9">
        <h2 className="font-display font-bold uppercase tracking-tightest text-[clamp(1.75rem,5vw,3.5rem)] leading-[0.95]">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
