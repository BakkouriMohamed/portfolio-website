"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SnakeDot — small dot next to the name that opens a minimalist Snake game.
 *
 * Behavior:
 *  - Idle: 8px gray dot, cursor pointer, subtle hover scale
 *  - Click: opens a 300x300px Snake game inline (fade + scale transition)
 *  - Snake controlled with arrow keys (or WASD)
 *  - Food appears randomly, eating grows the snake
 *  - Wall/self collision = game over with "Rejouer" button or Enter key
 *  - Score displayed during play
 *  - Close on outside click, Esc key, or close button
 *
 * Visual: Swiss-minimal — monochrome snake, Swiss-red food, subtle grid.
 */

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

export function SnakeDot() {
  const [gameOpen, setGameOpen] = useState(false);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 10, y: 7 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const closeGame = useCallback(() => {
    setGameOpen(false);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(randomFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
  }, []);

  const openGame = useCallback(() => {
    resetGame();
    setGameOpen(true);
  }, [resetGame]);

  // Keyboard controls
  useEffect(() => {
    if (!gameOpen) return;

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
        resetGame();
        e.preventDefault();
      } else if (key === "escape") {
        closeGame();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOpen, gameOver, resetGame, closeGame]);

  // Game loop
  useEffect(() => {
    if (!gameOpen || gameOver) return;

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

        // Wrap around walls — the snake comes out the other side
        head.x = (head.x + GRID_SIZE) % GRID_SIZE;
        head.y = (head.y + GRID_SIZE) % GRID_SIZE;

        // Self collision (only — walls no longer kill)
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        // Eat food
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
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameOpen, gameOver, food]);

  // Close on outside click
  useEffect(() => {
    if (!gameOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeGame();
      }
    };

    // Delay to avoid the opening click itself
    const t = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 100);

    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [gameOpen, closeGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  return (
    <>
      {/* Dot + hint — visible when game is closed */}
      <motion.span
        onClick={openGame}
        role="button"
        aria-label="Easter egg — cliquez pour jouer au Snake"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openGame();
          }
        }}
        animate={{ opacity: gameOpen ? 0 : 1, scale: gameOpen ? 0.5 : 1 }}
        transition={{ duration: 0.2 }}
        className="inline-flex items-center gap-2 align-middle ml-2 md:ml-4 cursor-pointer select-none group"
        style={{ touchAction: "none" }}
      >
        {/* Pulsing dot — bigger, Swiss red, draws attention */}
        <span className="relative inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
          {/* Pulsing aura */}
          <span className="absolute inset-0 rounded-full bg-swiss-red/30 animate-ping" />
          {/* Dot core */}
          <span className="relative w-3 h-3 md:w-4 md:h-4 bg-swiss-red rounded-full transition-transform duration-300 group-hover:scale-125" />
        </span>

        {/* Hint label */}
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground group-hover:text-swiss-red transition-colors duration-300 flex items-center gap-1.5">
          <span>Cliquer pour jouer</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </motion.span>

      {/* Game canvas — centered, fades in when game is open */}
      <AnimatePresence>
        {gameOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
                  onClick={closeGame}
                  className="text-muted-foreground hover:text-swiss-red transition-colors p-1"
                  aria-label="Fermer le jeu"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
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
                {/* Subtle grid lines */}
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
                  transition={{
                    duration: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
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
                        onClick={resetGame}
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
                <div>Murs traversables · auto-collision = game over</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
