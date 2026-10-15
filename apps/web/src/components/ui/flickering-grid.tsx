"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

// the grid is a faint background effect, so a low frame rate and capped pixel
// density look the same while costing a fraction of the main-thread time
const FRAME_INTERVAL_MS = 1000 / 12;
const MAX_DEVICE_PIXEL_RATIO = 2;
const MAX_FRAME_DELTA_SECONDS = 1;

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const cellSize = squareSize + gridGap;

    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let squares = new Float32Array(0);
    let animationFrameId: number | null = null;
    let lastFrameTime = 0;
    let isInView = false;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      const size = squareSize * dpr;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          ctx.globalAlpha = squares[i * rows + j];
          ctx.fillRect(i * cellSize * dpr, j * cellSize * dpr, size, size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const nextWidth = width ?? container.clientWidth;
      const nextHeight = height ?? container.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      canvas.width = Math.floor(nextWidth * dpr);
      canvas.height = Math.floor(nextHeight * dpr);
      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;
      cols = Math.floor(nextWidth / cellSize);
      rows = Math.floor(nextHeight / cellSize);
      squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }
      draw();
    };

    const tick = (time: number) => {
      animationFrameId = requestAnimationFrame(tick);
      const elapsed = time - lastFrameTime;
      if (elapsed < FRAME_INTERVAL_MS) return;
      lastFrameTime = time;

      // clamp so returning after a pause does not re-randomise every square
      const deltaTime = Math.min(elapsed / 1000, MAX_FRAME_DELTA_SECONDS);
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
      draw();
    };

    const start = () => {
      if (prefersReducedMotion || animationFrameId !== null) return;
      if (!isInView || document.hidden) return;
      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (animationFrameId === null) return;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
      if (isInView) start();
      else stop();
    });
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [squareSize, gridGap, flickerChance, color, width, height, maxOpacity]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full z-0", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
};
