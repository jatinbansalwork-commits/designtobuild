"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "center" | "leftToRight" | "rightToLeft";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface BackgroundParticlesProps {
  colors?: string[];
  count?: number;
  baseSize?: number;
  speed?: number;
  repulsionRadius?: number;
  repulsionForce?: number;
  direction?: Direction;
  fullScreen?: boolean;
  className?: string;
}

const DEFAULT_COLORS = ["#4f46e5", "#ff7a28", "#0ea5e9"];

export function BackgroundParticles({
  colors = DEFAULT_COLORS,
  count = 50,
  baseSize = 14,
  speed = 1.2,
  repulsionRadius = 160,
  repulsionForce = 1.4,
  direction = "center",
  fullScreen = false,
  className = "",
}: BackgroundParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = fullScreen ? window.innerWidth : container.clientWidth;
      height = fullScreen ? window.innerHeight : container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticle = (scatter = false): Particle => {
      const palette = colors.length > 0 ? colors : ["#000000"];
      const color = palette[Math.floor(Math.random() * palette.length)];
      const size = baseSize * (0.6 + Math.random() * 0.6);

      let x = 0;
      let y = 0;
      let vx = 0;
      let vy = 0;

      if (direction === "leftToRight") {
        x = scatter ? Math.random() * width : -size - 20;
        y = Math.random() * height;
        vx = Math.random() * speed + speed * 0.2;
        vy = (Math.random() - 0.5) * speed * 0.5;
      } else if (direction === "rightToLeft") {
        x = scatter ? Math.random() * width : width + size + 20;
        y = Math.random() * height;
        vx = -(Math.random() * speed + speed * 0.2);
        vy = (Math.random() - 0.5) * speed * 0.5;
      } else {
        const sign = Math.random() > 0.5 ? 1 : -1;
        x = width / 2;
        y = height / 2 + (Math.random() * 20 - 10);
        vx = sign * (Math.random() * speed + speed * 0.2);
        vy = (Math.random() - 0.5) * speed * 0.8;
      }

      const particle = { x, y, vx, vy, color, size };

      if (direction === "center" && scatter) {
        const drift = fullScreen ? Math.max(width, height) * 0.45 : 300;
        particle.x += particle.vx * drift;
        particle.y += particle.vy * drift;
      }

      return particle;
    };

    const resetParticles = () => {
      particlesRef.current = Array.from({ length: count }, () => createParticle(true));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle, index) => {
        const dx = particle.x - pointerRef.current.x;
        const dy = particle.y - pointerRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius) {
          const nx = dx / distance;
          const ny = dy / distance;
          const force = (repulsionRadius - distance) / repulsionRadius;
          particle.vx += nx * force * repulsionForce;
          particle.vy += ny * force * repulsionForce;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        ctx.fillStyle = particle.color;
        ctx.fillRect(
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size,
        );

        if (
          particle.x < -100 ||
          particle.x > width + 100 ||
          particle.y < -100 ||
          particle.y > height + 100
        ) {
          particlesRef.current[index] = createParticle(false);
        }
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    resize();
    resetParticles();
    draw();

    const onResize = () => {
      resize();
      resetParticles();
    };

    window.addEventListener("resize", onResize);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [
    isVisible,
    colors,
    count,
    baseSize,
    speed,
    repulsionRadius,
    repulsionForce,
    direction,
    fullScreen,
  ]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none overflow-hidden ${
        fullScreen ? "fixed inset-0 z-0" : "absolute inset-0"
      } ${className}`}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-auto block h-full w-full"
        onMouseMove={(event) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          pointerRef.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          };
        }}
        onMouseLeave={() => {
          pointerRef.current = { x: -1000, y: -1000 };
        }}
      />
    </div>
  );
}
