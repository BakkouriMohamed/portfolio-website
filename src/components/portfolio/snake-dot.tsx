"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { createPortal } from "react-dom";

/**
 * EasterDot — combined physics ball + Snake game easter egg.
 *
 * Flow:
 *  - Mode "idle":     small pulsing dot + "Cliquer pour jouer" hint
 *  - Mode "physics":  dot inflates into a floating ball — draggable, gravity, bounces
 *  - Mode "snake":    click the ball again → it inflates further and morphs into the Snake game
 *  - Close snake / Esc → back to idle (small dot)
 *
 * The "inflation" is the visual transition from ball to game canvas.
 */

// ===== Snake game constants =====
const GRID_SIZE = 15;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE; // 300px
const TICK_MS = 130;

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

const INITIAL_SNAKE: Point[] = [
  { x: 7, y: 7 },
  { x: 6, y: 7 },
  { x: 5, y: 7 },
];
const INITIAL_DIRECTION: Direction = "right";

function randomFood(snake: Point[]): Point {
  let pos: Point;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

// ===== Physics constants =====
const GRAVITY = 0.5;
const FRICTION = 0.992;
const BOUNCE_DAMP = 0.68;
const MIN_VEL = 0.04;
const TOP_MARGIN = 8;
const FLOOR_FRICTION = 0.92;
const BALL_SIZE = 36; // px, in physics mode

type Mode = "idle" | "physics" | "snake";

// SSR-safe mount check
const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function EasterDot() {
  const mounted = useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);

  const [mode, setMode] = useState<Mode>("idle");

  // Snake state
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 10, y: 7 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Physics state
  const inlineRef = useRef<HTMLSpanElement>(null);
  const ballX = useMotionValue(0);
  const ballY = useMotionValue(0);

  // Refs for game loops & input
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const physicsRafRef = useRef<number | null>(null);
  const velRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0, t: 0 });
  const downPosRef = useRef({ x: 0, y: 0 });
  const isDragRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ===== Mode transitions =====
  const enterPhysicsMode = useCallback(() => {
    if (!inlineRef.current || mode !== "idle") return;
    const rect = inlineRef.current.getBoundingClientRect();
    // Place ball center at the dot's center
    ballX.set(rect.left + rect.width / 2 - BALL_SIZE / 2);
    ballY.set(rect.top + rect.height / 2 - BALL_SIZE / 2);
    velRef.current = { x: 0, y: 0 };
    setMode("physics");
  }, [mode, ballX, ballY]);

  const enterSnakeMode = useCallback(() => {
    if (physicsRafRef.current) cancelAnimationFrame(physicsRafRef.current);
    physicsRafRef.current = null;
    velRef.current = { x: 0, y: 0 };
    draggingRef.current = false;
    // Reset snake state
    setSnake(INITIAL_SNAKE);
    setFood(randomFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setMode("snake");
  }, []);

  const closeToIdle = useCallback(() => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = null;
    setMode("idle");
  }, []);

  // ===== Idle click handler =====
  const handleIdleClick = useCallback(() => {
    if (mode === "idle") enterPhysicsMode();
    // In other modes, the floating ball handles its own clicks
  }, [mode, enterPhysicsMode]);

  // ===== Physics simulation loop =====
  useEffect(() => {
    if (mode !== "physics") return;

    const tick = () => {
      if (!draggingRef.current) {
        velRef.current.y += GRAVITY;
        velRef.current.x *= FRICTION;
        velRef.current.y *= FRICTION;

        let newX = ballX.get() + velRef.current.x;
        let newY = ballY.get() + velRef.current.y;

        if (newX < 0) {
          newX = 0;
          velRef.current.x = -velRef.current.x * BOUNCE_DAMP;
        } else if (newX > window.innerWidth - BALL_SIZE) {
          newX = window.innerWidth - BALL_SIZE;
          velRef.current.x = -velRef.current.x * BOUNCE_DAMP;
        }
        if (newY < TOP_MARGIN) {
          newY = TOP_MARGIN;
          velRef.current.y = -velRef.current.y * BOUNCE_DAMP;
        } else if (newY > window.innerHeight - BALL_SIZE) {
          newY = window.innerHeight - BALL_SIZE;
          velRef.current.y = -velRef.current.y * BOUNCE_DAMP;
          velRef.current.x *= FLOOR_FRICTION;
          if (Math.abs(velRef.current.y) < 1) velRef.current.y = 0;
        }
        if (Math.abs(velRef.current.x) < MIN_VEL) velRef.current.x = 0;
        if (
          Math.abs(velRef.current.y) < MIN_VEL &&
          newY >= window.innerHeight - BALL_SIZE - 0.5
        )
          velRef.current.y = 0;

        ballX.set(newX);
        ballY.set(newY);
      }
      physicsRafRef.current = requestAnimationFrame(tick);
    };

    physicsRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (physicsRafRef.current) cancelAnimationFrame(physicsRafRef.current);
      physicsRafRef.current = null;
    };
  }, [mode, ballX, ballY]);

  // ===== Snake keyboard controls =====
  useEffect(() => {
    if (mode !== "snake") return;

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const current = directionRef.current;
      const turns: Record<string, { dir: Direction; forbidden: Direction }> = {
        arrowup: { dir: "up", forbidden: "down" },
        w: { dir: "up", forbidden: "down" },
        arrowdown: { dir: "down", forbidden: "up" },
        s: { dir: "down", forbidden: "up" },
        arrowleft: { dir: "left", forbidden: "right" },
        a: { dir: "left", forbidden: "right" },
        arrowright: { dir: "right", forbidden: "left" },
        d: { dir: "right", forbidden: "left" },
      };

      if (turns[key] && current !== turns[key].forbidden) {
        directionRef.current = turns[key].dir;
        setDirection(turns[key].dir);
        e.preventDefault();
      } else if (key === "enter" && gameOver) {
        setSnake(INITIAL_SNAKE);
        setFood(randomFood(INITIAL_SNAKE));
        setDirection(INITIAL_DIRECTION);
        directionRef.current = INITIAL_DIRECTION;
        setScore(0);
        setGameOver(false);
        e.preventDefault();
      } else if (key === "escape") {
        closeToIdle();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode, gameOver, closeToIdle]);

  // ===== Snake game loop =====
  useEffect(() => {
    if (mode !== "snake" || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        switch (directionRef.current) {
          case "up":
            head.y -= 1;
            break;
          case "down":
            head.y += 1;
            break;
          case "left":
            head.x -= 1;
            break;
          case "right":
            head.x += 1;
            break;
        }

        // Wrap around walls
        head.x = (head.x + GRID_SIZE) % GRID_SIZE;
        head.y = (head.y + GRID_SIZE) % GRID_SIZE;

        // Self collision only
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1);
          setFood(randomFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, TICK_MS);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [mode, gameOver, food]);

  // ===== Close snake on outside click =====
  useEffect(() => {
    if (mode !== "snake") return;

    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeToIdle();
      }
    };

    const t = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 100);

    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [mode, closeToIdle]);

  // ===== Cleanup on unmount =====
  useEffect(() => {
    return () => {
      if (physicsRafRef.current) cancelAnimationFrame(physicsRafRef.current);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  // ===== Ball pointer handlers (physics mode) =====
  const handleBallPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    downPosRef.current = { x: e.clientX, y: e.clientY };
    isDragRef.current = false;
    draggingRef.current = true;
    lastPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      t: performance.now(),
    };
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleBallPointerMove = (e: React.PointerEvent) => {
    if (mode !== "physics") return;

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

    ballX.set(ballX.get() + mdx);
    ballY.set(ballY.get() + mdy);

    const newVx = (mdx / dt) * 16;
    const newVy = (mdy / dt) * 16;
    velRef.current.x = velRef.current.x * 0.4 + newVx * 0.6;
    velRef.current.y = velRef.current.y * 0.4 + newVy * 0.6;

    lastPointerRef.current = { x: e.clientX, y: e.clientY, t: now };
  };

  const handleBallPointerUp = (e: React.PointerEvent) => {
    if (mode !== "physics") return;
    draggingRef.current = false;
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {}

    // If it was a click (no drag), enter snake mode (the ball "inflates" into the game)
    if (!isDragRef.current) {
      enterSnakeMode();
    }
  };

  return (
    <>
      {/* ===== Idle mode: small dot + hint ===== */}
      <motion.span
        ref={inlineRef}
        onClick={handleIdleClick}
        role="button"
        aria-label="Easter egg — cliquez pour activer la balle"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleIdleClick();
          }
        }}
        animate={{
          opacity: mode === "idle" ? 1 : 0,
          scale: mode === "idle" ? 1 : 0.5,
        }}
        transition={{ duration: 0.25 }}
        className={`inline-flex items-center gap-2 align-middle ml-2 md:ml-4 cursor-pointer select-none group ${
          mode === "idle" ? "" : "pointer-events-none"
        }`}
        style={{ touchAction: "none" }}
      >
        {/* Pulsing aura + dot core */}
        <span className="relative inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
          <span className="absolute inset-0 rounded-full bg-swiss-red/30 animate-ping" />
          <span className="relative w-3 h-3 md:w-4 md:h-4 bg-swiss-red rounded-full transition-transform duration-300 group-hover:scale-125" />
        </span>
        {/* Hint label */}
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground group-hover:text-swiss-red transition-colors duration-300 flex items-center gap-1.5">
          <span>Cliquer pour jouer</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300"
          >
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </motion.span>

      {/* ===== Physics mode: floating ball ===== */}
      {mounted && mode === "physics" &&
        createPortal(
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              x: ballX,
              y: ballY,
              width: BALL_SIZE,
              height: BALL_SIZE,
              zIndex: 60,
              touchAction: "none",
            }}
            className="flex items-center justify-center cursor-grab active:cursor-grabbing select-none group"
            role="button"
            aria-label="Balle physique — cliquez pour ouvrir le Snake, ou glissez pour jouer avec"
            tabIndex={0}
            onPointerDown={handleBallPointerDown}
            onPointerMove={handleBallPointerMove}
            onPointerUp={handleBallPointerUp}
          >
            {/* Pulsing aura */}
            <span className="absolute inset-0 rounded-full bg-swiss-red/30 animate-ping" />
            {/* Ball core — gradient for depth */}
            <span className="relative w-full h-full rounded-full bg-swiss-red shadow-[0_4px_20px_rgba(230,57,70,0.4)] group-hover:shadow-[0_4px_30px_rgba(230,57,70,0.6)] transition-shadow duration-300" />
            {/* Hint label below ball */}
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Cliquer pour le Snake
            </span>
          </motion.div>,
          document.body
        )}

      {/* ===== Snake mode: game canvas ===== */}
      <AnimatePresence>
        {mode === "snake" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto relative bg-background border border-border p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              style={{ width: `${CANVAS_SIZE + 40}px` }}
            >
              {/* Header: score + close */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Score
                  </span>
                  <motion.span
                    key={score}
                    initial={{ scale: 1.3, color: "var(--swiss-red)" }}
                    animate={{ scale: 1, color: "var(--foreground)" }}
                    transition={{ duration: 0.3 }}
                    className="font-display text-xl font-bold tabular-nums"
                  >
                    {score}
                  </motion.span>
                </div>
                <button
                  onClick={closeToIdle}
                  className="text-muted-foreground hover:text-swiss-red transition-colors p-1"
                  aria-label="Fermer le jeu"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 3L13 13M13 3L3 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>

              {/* Game canvas */}
              <div
                className="relative bg-secondary/40 border border-border overflow-hidden"
                style={{
                  width: `${CANVAS_SIZE}px`,
                  height: `${CANVAS_SIZE}px`,
                }}
              >
                {/* Grid lines */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, var(--border) 1px, transparent 1px),
                      linear-gradient(to bottom, var(--border) 1px, transparent 1px)
                    `,
                    backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
                    opacity: 0.4,
                  }}
                />

                {/* Snake segments */}
                {snake.map((seg, i) => (
                  <motion.div
                    key={`${seg.x}-${seg.y}-${i}`}
                    initial={false}
                    className="absolute"
                    style={{
                      left: `${seg.x * CELL_SIZE}px`,
                      top: `${seg.y * CELL_SIZE}px`,
                      width: `${CELL_SIZE - 2}px`,
                      height: `${CELL_SIZE - 2}px`,
                      margin: "1px",
                      backgroundColor:
                        i === 0 ? "var(--swiss-red)" : "var(--foreground)",
                      borderRadius: i === 0 ? "4px" : "2px",
                    }}
                  />
                ))}

                {/* Food */}
                <motion.div
                  key={`${food.x}-${food.y}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute"
                  style={{
                    left: `${food.x * CELL_SIZE + 5}px`,
                    top: `${food.y * CELL_SIZE + 5}px`,
                    width: `${CELL_SIZE - 10}px`,
                    height: `${CELL_SIZE - 10}px`,
                    backgroundColor: "var(--swiss-red)",
                    borderRadius: "2px",
                  }}
                />

                {/* Game over overlay */}
                <AnimatePresence>
                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center gap-2"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Game Over
                      </div>
                      <div className="font-display text-4xl font-bold text-swiss-red tabular-nums">
                        {score}
                      </div>
                      <button
                        onClick={() => {
                          setSnake(INITIAL_SNAKE);
                          setFood(randomFood(INITIAL_SNAKE));
                          setDirection(INITIAL_DIRECTION);
                          directionRef.current = INITIAL_DIRECTION;
                          setScore(0);
                          setGameOver(false);
                        }}
                        className="mt-2 font-mono text-[10px] uppercase tracking-wider border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors duration-300"
                      >
                        Rejouer
                      </button>
                      <div className="font-mono text-[9px] text-muted-foreground mt-1">
                        ou appuie sur Entrée
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer: controls hint */}
              <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>← ↑ ↓ →</span>
                  <span className="ml-2">bouger</span>
                </div>
                <div>Murs traversables · Échap pour fermer</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
