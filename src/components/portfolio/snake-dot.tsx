"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * EasterDot — Snake game easter egg.
 *
 * Flow (simplified):
 *  - Mode "idle":   pulsing dot + "Cliquer pour jouer" hint
 *  - Mode "snake":  click opens the Snake game directly
 *  - Close (Esc / outside click / X button) → back to idle
 *
 * Mobile-friendly:
 *  - Swipe gestures on the canvas to change direction
 *  - On-screen arrow buttons below the canvas
 *  - Touch-friendly close button
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

// SSR-safe mount check
const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function EasterDot() {
  const mounted = useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);

  const [mode, setMode] = useState<"idle" | "snake">("idle");

  // Snake state
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 10, y: 7 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Refs
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // ===== Mode transitions =====
  const enterSnakeMode = useCallback(() => {
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

  // ===== Direction change helper =====
  const changeDirection = useCallback((newDir: Direction) => {
    const current = directionRef.current;
    const forbidden: Record<Direction, Direction> = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };
    if (current !== forbidden[newDir]) {
      directionRef.current = newDir;
      setDirection(newDir);
    }
  }, []);

  // ===== Reset game (after game over) =====
  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(randomFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
  }, []);

  // ===== Idle click handler =====
  const handleIdleClick = useCallback(() => {
    if (mode === "idle") enterSnakeMode();
  }, [mode, enterSnakeMode]);

  // ===== Keyboard controls =====
  useEffect(() => {
    if (mode !== "snake") return;

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const turns: Record<string, Direction> = {
        arrowup: "up",
        w: "up",
        arrowdown: "down",
        s: "down",
        arrowleft: "left",
        a: "left",
        arrowright: "right",
        d: "right",
      };

      if (turns[key]) {
        changeDirection(turns[key]);
        e.preventDefault();
      } else if (key === "enter" && gameOver) {
        resetGame();
        e.preventDefault();
      } else if (key === "escape") {
        closeToIdle();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode, gameOver, changeDirection, resetGame, closeToIdle]);

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

  // ===== Touch swipe controls on canvas =====
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Minimum swipe distance to register
      const minSwipe = 20;

      if (absDx < minSwipe && absDy < minSwipe) return;

      if (absDx > absDy) {
        // Horizontal swipe
        changeDirection(dx > 0 ? "right" : "left");
      } else {
        // Vertical swipe
        changeDirection(dy > 0 ? "down" : "up");
      }
      touchStartRef.current = null;
    },
    [changeDirection]
  );

  // ===== Cleanup on unmount =====
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  // ===== On-screen arrow button handler =====
  const handleArrowButton = (dir: Direction) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    changeDirection(dir);
  };

  return (
    <>
      {/* ===== Idle mode: pulsing dot + hint ===== */}
      <motion.span
        onClick={handleIdleClick}
        role="button"
        aria-label="Easter egg — cliquez pour jouer au Snake"
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

      {/* ===== Snake mode: game canvas ===== */}
      <AnimatePresence>
        {mode === "snake" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto relative bg-background border border-border p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] w-full max-w-[340px]"
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
                  className="text-muted-foreground hover:text-swiss-red transition-colors p-2 -mr-1 touch-manipulation"
                  aria-label="Fermer le jeu"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
                ref={canvasRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative bg-secondary/40 border border-border overflow-hidden mx-auto touch-none"
                style={{
                  width: `${CANVAS_SIZE}px`,
                  height: `${CANVAS_SIZE}px`,
                  maxWidth: "100%",
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
                      left: `${(seg.x * CANVAS_SIZE) / GRID_SIZE}px`,
                      top: `${(seg.y * CANVAS_SIZE) / GRID_SIZE}px`,
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
                    left: `${(food.x * CANVAS_SIZE) / GRID_SIZE + 5}px`,
                    top: `${(food.y * CANVAS_SIZE) / GRID_SIZE + 5}px`,
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
                      className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center gap-2 p-4 text-center"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Game Over
                      </div>
                      <div className="font-display text-4xl font-bold text-swiss-red tabular-nums">
                        {score}
                      </div>
                      <button
                        onClick={resetGame}
                        className="mt-2 font-mono text-[10px] uppercase tracking-wider border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors duration-300 touch-manipulation"
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

              {/* Mobile controls: on-screen arrow pad */}
              <div className="mt-4 flex justify-center md:hidden">
                <div className="grid grid-cols-3 gap-2 w-[180px]">
                  <div />
                  <button
                    onClick={handleArrowButton("up")}
                    onTouchStart={handleArrowButton("up")}
                    className="aspect-square flex items-center justify-center border border-border bg-secondary hover:bg-swiss-red hover:text-white active:scale-95 transition-all touch-manipulation"
                    aria-label="Haut"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4L4 14H16L10 4Z" fill="currentColor" />
                    </svg>
                  </button>
                  <div />
                  <button
                    onClick={handleArrowButton("left")}
                    onTouchStart={handleArrowButton("left")}
                    className="aspect-square flex items-center justify-center border border-border bg-secondary hover:bg-swiss-red hover:text-white active:scale-95 transition-all touch-manipulation"
                    aria-label="Gauche"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10L14 4V16L4 10Z" fill="currentColor" />
                    </svg>
                  </button>
                  <button
                    onClick={handleArrowButton("down")}
                    onTouchStart={handleArrowButton("down")}
                    className="aspect-square flex items-center justify-center border border-border bg-secondary hover:bg-swiss-red hover:text-white active:scale-95 transition-all touch-manipulation"
                    aria-label="Bas"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 16L16 6H4L10 16Z" fill="currentColor" />
                    </svg>
                  </button>
                  <button
                    onClick={handleArrowButton("right")}
                    onTouchStart={handleArrowButton("right")}
                    className="aspect-square flex items-center justify-center border border-border bg-secondary hover:bg-swiss-red hover:text-white active:scale-95 transition-all touch-manipulation"
                    aria-label="Droite"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16 10L6 4V16L16 10Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Footer: controls hint */}
              <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="hidden md:inline">← ↑ ↓ →</span>
                  <span className="md:hidden">Swipe / boutons</span>
                </div>
                <div>Murs traversables · Échap ferme</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
