"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// SSR-safe "is client" check without setState-in-effect
const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/**
 * PhysicsDot — a small Swiss-red dot that becomes a physics object on click.
 *
 * Behavior:
 *  - Idle: sits inline at its natural position (next to "Bakkouri")
 *  - Click 1: enters "play mode" — a fixed-position floating dot with physics
 *    (gravity, momentum, wall bounces), draggable via pointer / touch
 *  - Click 2 (without drag): smoothly springs back to the inline position
 *  - Drag: dot follows pointer, releases with momentum & bounces
 *
 * Easter egg: visually consistent with the design — same color, same size,
 * same shape. Only `cursor: pointer` hints at interactivity.
 */
export function PhysicsDot() {
  const mounted = useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);

  const inlineRef = useRef<HTMLSpanElement>(null);
  const [playMode, setPlayMode] = useState(false);
  const [size, setSize] = useState(0);

  // Floating dot's top-left position in viewport coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Physics state
  const rafRef = useRef<number | null>(null);
  const velRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0, t: 0 });
  const downPosRef = useRef({ x: 0, y: 0 });
  const isDragRef = useRef(false);
  const exitingRef = useRef(false);
  const exitTimeoutRef = useRef<number | null>(null);

  const enterPlayMode = useCallback(() => {
    if (!inlineRef.current || playMode || exitingRef.current) return;
    const rect = inlineRef.current.getBoundingClientRect();
    const sz = rect.width;
    setSize(sz);
    x.set(rect.left);
    y.set(rect.top);
    velRef.current = { x: 0, y: 0 };
    setPlayMode(true);
  }, [playMode, x, y]);

  const exitPlayMode = useCallback(() => {
    if (!playMode || exitingRef.current || !inlineRef.current) return;
    exitingRef.current = true;

    // Use the *current* inline position as target (page may have scrolled)
    const rect = inlineRef.current.getBoundingClientRect();

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    velRef.current = { x: 0, y: 0 };
    draggingRef.current = false;

    // Smooth spring back to the inline position
    animate(x, rect.left, {
      type: "spring",
      stiffness: 120,
      damping: 18,
      mass: 0.8,
    });
    animate(y, rect.top, {
      type: "spring",
      stiffness: 120,
      damping: 18,
      mass: 0.8,
    });

    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    exitTimeoutRef.current = window.setTimeout(() => {
      setPlayMode(false);
      exitingRef.current = false;
      exitTimeoutRef.current = null;
    }, 1200);
  }, [playMode, x, y]);

  // Physics simulation loop — only runs in play mode
  useEffect(() => {
    if (!playMode) return;

    const GRAVITY = 0.5; // px / frame²
    const FRICTION = 0.992; // air resistance
    const BOUNCE_DAMP = 0.68; // energy retained on bounce
    const MIN_VEL = 0.04; // threshold to stop drift
    const TOP_MARGIN = 8; // px from top to avoid nav overlap
    const FLOOR_FRICTION = 0.92; // extra friction when on floor

    const tick = () => {
      if (!draggingRef.current && !exitingRef.current) {
        velRef.current.y += GRAVITY;
        velRef.current.x *= FRICTION;
        velRef.current.y *= FRICTION;

        let newX = x.get() + velRef.current.x;
        let newY = y.get() + velRef.current.y;

        const sz = size;

        // Wall bounces
        if (newX < 0) {
          newX = 0;
          velRef.current.x = -velRef.current.x * BOUNCE_DAMP;
        } else if (newX > window.innerWidth - sz) {
          newX = window.innerWidth - sz;
          velRef.current.x = -velRef.current.x * BOUNCE_DAMP;
        }
        if (newY < TOP_MARGIN) {
          newY = TOP_MARGIN;
          velRef.current.y = -velRef.current.y * BOUNCE_DAMP;
        } else if (newY > window.innerHeight - sz) {
          newY = window.innerHeight - sz;
          velRef.current.y = -velRef.current.y * BOUNCE_DAMP;
          velRef.current.x *= FLOOR_FRICTION;
          if (Math.abs(velRef.current.y) < 1) velRef.current.y = 0;
        }

        // Settle tiny drift
        if (Math.abs(velRef.current.x) < MIN_VEL) velRef.current.x = 0;
        if (
          Math.abs(velRef.current.y) < MIN_VEL &&
          newY >= window.innerHeight - sz - 0.5
        )
          velRef.current.y = 0;

        x.set(newX);
        y.set(newY);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playMode, x, y, size]);

  // Clamp position on resize
  useEffect(() => {
    if (!playMode) return;
    const onResize = () => {
      const sz = size;
      x.set(Math.max(0, Math.min(window.innerWidth - sz, x.get())));
      y.set(Math.max(8, Math.min(window.innerHeight - sz, y.get())));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [playMode, x, y, size]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  // Pointer handlers (shared by inline and floating dots)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (exitingRef.current) return;
    e.stopPropagation();
    e.preventDefault();
    downPosRef.current = { x: e.clientX, y: e.clientY };
    isDragRef.current = false;

    if (playMode) {
      draggingRef.current = true;
      lastPointerRef.current = {
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
      };
      try {
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!playMode) return;

    const dx = e.clientX - downPosRef.current.x;
    const dy = e.clientY - downPosRef.current.y;
    if (!isDragRef.current && Math.hypot(dx, dy) > 5) {
      isDragRef.current = true;
    }

    if (!draggingRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.t);
    const mdx = e.clientX - lastPointerRef.current.x;
    const mdy = e.clientY - lastPointerRef.current.y;

    x.set(x.get() + mdx);
    y.set(y.get() + mdy);

    // Track velocity with smoothing (px per ~16ms frame)
    const newVx = (mdx / dt) * 16;
    const newVy = (mdy / dt) * 16;
    velRef.current.x = velRef.current.x * 0.4 + newVx * 0.6;
    velRef.current.y = velRef.current.y * 0.4 + newVy * 0.6;

    lastPointerRef.current = { x: e.clientX, y: e.clientY, t: now };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingRef.current) {
      draggingRef.current = false;
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch {}
    }

    if (!playMode) {
      // Was idle — enter play mode
      enterPlayMode();
    } else if (!isDragRef.current) {
      // Was in play mode, no drag happened — exit play mode
      exitPlayMode();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!playMode) enterPlayMode();
      else exitPlayMode();
    }
  };

  return (
    <>
      {/* Inline dot — visible when idle, invisible when in play mode */}
      <span
        ref={inlineRef}
        className={`inline-block ml-2 md:ml-4 align-middle w-[0.4em] h-[0.4em] bg-swiss-red rounded-full cursor-pointer select-none transition-opacity duration-150 ${
          playMode ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ touchAction: "none" }}
        role="button"
        aria-label="Point interactif — cliquez pour activer le mode physique, cliquez à nouveau pour réinitialiser"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      />

      {/* Floating dot — rendered via portal to body, escapes hero overflow */}
      {mounted && playMode && size > 0
        ? createPortal(
            <motion.div
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                x,
                y,
                width: size,
                height: size,
                zIndex: 60,
                touchAction: "none",
              }}
              className="block bg-swiss-red rounded-full cursor-grab active:cursor-grabbing select-none"
              role="button"
              aria-label="Point interactif en mode physique — cliquez pour réinitialiser"
              tabIndex={0}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onKeyDown={handleKeyDown}
            />,
            document.body
          )
        : null}
    </>
  );
}
