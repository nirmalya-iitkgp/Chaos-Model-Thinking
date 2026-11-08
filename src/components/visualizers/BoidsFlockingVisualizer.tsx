/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Crosshair, Sparkles, ShieldAlert, Wind } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Attractor {
  x: number;
  y: number;
}

export default function BoidsFlockingVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const cohesionWeight = Number(controls.cohesionWeight ?? 1.0);
  const alignmentWeight = Number(controls.alignmentWeight ?? 1.2);
  const separationWeight = Number(controls.separationWeight ?? 1.5);
  const predatorToggle = !!controls.predatorPresent;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [polarization, setPolarization] = useState(35);
  const [cohesionIndex, setCohesionIndex] = useState(45);
  const [hasPredator, setHasPredator] = useState(predatorToggle);
  const [attractor, setAttractor] = useState<Attractor | null>(null);

  const boidsRef = useRef<Boid[]>([]);
  const predatorRef = useRef<{ x: number; y: number; vx: number; vy: number }>({ x: 100, y: 100, vx: 2, vy: 1 });
  const animFrameRef = useRef<number | null>(null);

  const BOID_COUNT = 120;
  const W = 620;
  const H = 340;
  const MAX_SPEED = 3.6;
  const PERCEPTION_RADIUS = 50;
  const SEPARATION_RADIUS = 22;

  // Initialize boids
  const initBoids = useCallback(() => {
    const list: Boid[] = [];
    for (let i = 0; i < BOID_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      list.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(angle) * 2,
        vy: Math.sin(angle) * 2
      });
    }
    boidsRef.current = list;
    predatorRef.current = { x: 50, y: 50, vx: 2.2, vy: 1.5 };
  }, []);

  useEffect(() => {
    initBoids();
  }, [initBoids]);

  useEffect(() => {
    setHasPredator(predatorToggle);
  }, [predatorToggle]);

  // Main flocking physics simulation step
  useEffect(() => {
    const updatePhysics = () => {
      if (!isRunning) {
        animFrameRef.current = requestAnimationFrame(updatePhysics);
        return;
      }

      const boids = boidsRef.current;
      const predator = predatorRef.current;

      let sumVx = 0;
      let sumVy = 0;
      let sumDist = 0;

      // Center of mass calculation
      let comX = 0;
      let comY = 0;
      for (let i = 0; i < boids.length; i++) {
        comX += boids[i].x;
        comY += boids[i].y;
      }
      comX /= boids.length;
      comY /= boids.length;

      // Update each boid
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        let sepX = 0, sepY = 0;
        let aliX = 0, aliY = 0;
        let cohX = 0, cohY = 0;
        let neighbors = 0;

        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue;
          const other = boids[j];
          const dx = other.x - b.x;
          const dy = other.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < PERCEPTION_RADIUS) {
            // Alignment
            aliX += other.vx;
            aliY += other.vy;
            // Cohesion
            cohX += other.x;
            cohY += other.y;
            neighbors++;

            // Separation
            if (dist < SEPARATION_RADIUS && dist > 0) {
              sepX -= (dx / dist) * (SEPARATION_RADIUS - dist);
              sepY -= (dy / dist) * (SEPARATION_RADIUS - dist);
            }
          }
        }

        if (neighbors > 0) {
          // Average alignment
          aliX /= neighbors;
          aliY /= neighbors;
          aliX -= b.vx;
          aliY -= b.vy;

          // Average cohesion
          cohX /= neighbors;
          cohY /= neighbors;
          cohX = (cohX - b.x) * 0.05;
          cohY = (cohY - b.y) * 0.05;
        }

        // Predator evasion
        let predX = 0, predY = 0;
        if (hasPredator) {
          const pdx = predator.x - b.x;
          const pdy = predator.y - b.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pdist < 90 && pdist > 0) {
            predX = -(pdx / pdist) * 8.0;
            predY = -(pdy / pdist) * 8.0;
          }
        }

        // Attractor attraction
        let attX = 0, attY = 0;
        if (attractor) {
          const adx = attractor.x - b.x;
          const ady = attractor.y - b.y;
          const adist = Math.sqrt(adx * adx + ady * ady);
          if (adist > 10) {
            attX = (adx / adist) * 1.5;
            attY = (ady / adist) * 1.5;
          }
        }

        // Apply weighted forces
        b.vx += sepX * (separationWeight * 0.12) 
              + aliX * (alignmentWeight * 0.08) 
              + cohX * (cohesionWeight * 0.06) 
              + predX 
              + attX;
        b.vy += sepY * (separationWeight * 0.12) 
              + aliY * (alignmentWeight * 0.08) 
              + cohY * (cohesionWeight * 0.06) 
              + predY 
              + attY;

        // Speed limit clamp
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > MAX_SPEED) {
          b.vx = (b.vx / speed) * MAX_SPEED;
          b.vy = (b.vy / speed) * MAX_SPEED;
        } else if (speed < 1.0) {
          b.vx = (b.vx / (speed || 1)) * 1.0;
          b.vy = (b.vy / (speed || 1)) * 1.0;
        }

        // Update position with toroidal wrap
        b.x = (b.x + b.vx + W) % W;
        b.y = (b.y + b.vy + H) % H;

        sumVx += b.vx;
        sumVy += b.vy;
        const dFromCom = Math.sqrt(Math.pow(b.x - comX, 2) + Math.pow(b.y - comY, 2));
        sumDist += dFromCom;
      }

      // Predator AI: Chases the nearest boid
      if (hasPredator) {
        let nearestDist = Infinity;
        let targetX = W / 2;
        let targetY = H / 2;
        for (let i = 0; i < boids.length; i++) {
          const dx = boids[i].x - predator.x;
          const dy = boids[i].y - predator.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < nearestDist) {
            nearestDist = d;
            targetX = boids[i].x;
            targetY = boids[i].y;
          }
        }
        const chaseAngle = Math.atan2(targetY - predator.y, targetX - predator.x);
        predator.vx = Math.cos(chaseAngle) * 3.8;
        predator.vy = Math.sin(chaseAngle) * 3.8;
        predator.x = (predator.x + predator.vx + W) % W;
        predator.y = (predator.y + predator.vy + H) % H;
      }

      // Compute polarization metric (0 to 100%)
      const meanVx = sumVx / boids.length;
      const meanVy = sumVy / boids.length;
      const netAlignment = Math.min(100, Math.round((Math.sqrt(meanVx * meanVx + meanVy * meanVy) / MAX_SPEED) * 100));
      const meanCloseness = Math.max(10, Math.min(100, Math.round(100 - (sumDist / boids.length) * 0.4)));

      setPolarization(netAlignment);
      setCohesionIndex(meanCloseness);

      // Render canvas
      drawCanvas();
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, cohesionWeight, alignmentWeight, separationWeight, hasPredator, attractor]);

  // Canvas drawing
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Attractor if active
    if (attractor) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.beginPath();
      ctx.arc(attractor.x, attractor.y, 25, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(attractor.x, attractor.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Boids as sleek directional triangles
    const boids = boidsRef.current;
    for (let i = 0; i < boids.length; i++) {
      const b = boids[i];
      const angle = Math.atan2(b.vy, b.vx);
      const size = 6.5;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);

      ctx.fillStyle = '#38bdf8'; // Cyan boid
      ctx.beginPath();
      ctx.moveTo(size * 1.5, 0);
      ctx.lineTo(-size, -size * 0.7);
      ctx.lineTo(-size * 0.5, 0);
      ctx.lineTo(-size, size * 0.7);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // Draw Predator as a menacing red raptor
    if (hasPredator) {
      const p = predatorRef.current;
      const angle = Math.atan2(p.vy, p.vx);
      const size = 12;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(angle);

      // Threat ring
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(size * 1.8, 0);
      ctx.lineTo(-size, -size * 0.9);
      ctx.lineTo(-size * 0.5, 0);
      ctx.lineTo(-size, size * 0.9);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  };

  // Canvas click to drop attractor or move predator
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (hasPredator) {
      predatorRef.current.x = x;
      predatorRef.current.y = y;
    } else {
      setAttractor(prev => (prev ? null : { x, y }));
    }
  };

  return (
    <div id="visualizer-boids-flocking" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block font-semibold">
            Craig Reynolds Boids (1986) Swarm Intelligence
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            Murmuration & Decentralized Self-Organization
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {polarization}% Polarization
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {cohesionIndex}% Cohesion
          </span>
          {hasPredator && (
            <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
              Predator Active
            </span>
          )}
        </div>
      </div>

      {/* Canvas Screen */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full h-auto cursor-crosshair select-none block"
          onClick={handleCanvasClick}
        />

        <div className="absolute top-2 left-2 pointer-events-none bg-slate-900/80 backdrop-blur-sm border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-slate-400">
          Click canvas to place {hasPredator ? 'Predator (Hawk)' : 'Food Attractor'}
        </div>
      </div>

      {/* Toolbar & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-colors ${
              isRunning 
                ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isRunning ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={() => setHasPredator(!hasPredator)}
            className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 border transition-colors ${
              hasPredator 
                ? 'bg-rose-950/80 border-rose-700 text-rose-300' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{hasPredator ? 'Remove Predator' : 'Spawn Predator'}</span>
          </button>

          <button
            onClick={() => setAttractor(null)}
            disabled={!attractor}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 border border-slate-700"
          >
            Clear Food
          </button>

          <button
            onClick={initBoids}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset Swarm</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span>Sep: <strong>{separationWeight}</strong></span>
          <span>Ali: <strong>{alignmentWeight}</strong></span>
          <span>Coh: <strong>{cohesionWeight}</strong></span>
        </div>
      </div>

      {/* Commentary */}
      <div className={`p-3.5 rounded-lg border text-xs flex gap-3 items-start transition-all ${
        hasPredator ? 'bg-rose-950/40 border-rose-900/50 text-rose-100' : 'bg-slate-950 border-slate-800 text-slate-300'
      }`}>
        <div className={`p-1.5 rounded shrink-0 ${hasPredator ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white'}`}>
          <Wind className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            SWARM INTELLIGENCE CHRONICLE
          </span>
          <p className="leading-relaxed mt-0.5 font-normal">
            {hasPredator 
              ? 'PREDATOR INTRUSION: Boids scatter in panic (flash expansion), then dynamically fold behind the predator in synchronized evasion.'
              : state.flightBehavior || 'Emergent murmuration: No boid is in charge. By following separation, alignment, and cohesion, the entire flock functions as an integrated super-organism.'}
          </p>
        </div>
      </div>
    </div>
  );
}
