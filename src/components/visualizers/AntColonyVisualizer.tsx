/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

interface Ant {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hasFood: boolean;
}

interface Point {
  x: number;
  y: number;
}

const W = 520;
const H = 320;
const GRID_SCALE = 4;
const GW = W / GRID_SCALE; // 130
const GH = H / GRID_SCALE; // 80

export default function AntColonyVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const evaporationRate = Number(controls.evaporationRate ?? 3);
  const alpha = Number(controls.pheromoneSensitivity ?? 2.0);
  const antCount = Number(controls.antPopulation ?? 120);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [foodHarvested, setFoodHarvested] = useState(0);

  const nestRef = useRef<Point>({ x: 80, y: H / 2 });
  const foodRef = useRef<Point>({ x: W - 80, y: H / 2 });
  const antsRef = useRef<Ant[]>([]);
  const pheromoneGridRef = useRef<Float32Array>(new Float32Array(GW * GH));
  const wallsGridRef = useRef<Uint8Array>(new Uint8Array(GW * GH));
  const isMouseDownRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  // Initialize ants and default obstacles
  const initColony = useCallback((preset: 'dilemma' | 'maze' | 'clear' = 'dilemma') => {
    const nest = { x: 80, y: H / 2 };
    const food = { x: W - 80, y: H / 2 };
    nestRef.current = nest;
    foodRef.current = food;

    // Ants array
    const ants: Ant[] = [];
    for (let i = 0; i < antCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      ants.push({
        x: nest.x + (Math.random() - 0.5) * 10,
        y: nest.y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * 1.8,
        vy: Math.sin(angle) * 1.8,
        hasFood: false
      });
    }
    antsRef.current = ants;
    pheromoneGridRef.current.fill(0);

    // Setup obstacle walls
    const walls = new Uint8Array(GW * GH);
    if (preset === 'dilemma') {
      // Central vertical wall with asymmetrical top and bottom openings
      // Top path is short (20px gap), bottom path is a long detour!
      const wallX = Math.floor(GW / 2);
      for (let gy = 15; gy < GH - 8; gy++) {
        // Leave a gap near top (gy 15-22)
        if (gy >= 25 && gy <= GH - 15) {
          walls[gy * GW + wallX] = 1;
          walls[gy * GW + wallX + 1] = 1;
        }
      }
    } else if (preset === 'maze') {
      const w1 = Math.floor(GW * 0.35);
      const w2 = Math.floor(GW * 0.65);
      for (let gy = 0; gy < GH - 25; gy++) {
        walls[gy * GW + w1] = 1;
      }
      for (let gy = 25; gy < GH; gy++) {
        walls[gy * GW + w2] = 1;
      }
    }
    wallsGridRef.current = walls;
    setFoodHarvested(0);
  }, [antCount]);

  useEffect(() => {
    initColony('dilemma');
  }, [initColony]);

  // Main ACO Simulation Step
  useEffect(() => {
    const decay = 1.0 - (evaporationRate / 100);
    const speed = 2.0;

    const updateSimulation = () => {
      if (!isRunning) {
        animFrameRef.current = requestAnimationFrame(updateSimulation);
        return;
      }

      const ants = antsRef.current;
      const nest = nestRef.current;
      const food = foodRef.current;
      const phero = pheromoneGridRef.current;
      const walls = wallsGridRef.current;

      let retrievedCrumb = 0;

      for (let i = 0; i < ants.length; i++) {
        const a = ants[i];

        // Check if reached food
        const distToFood = Math.hypot(a.x - food.x, a.y - food.y);
        if (!a.hasFood && distToFood < 16) {
          a.hasFood = true;
          // Reverse direction towards nest
          a.vx = -a.vx;
          a.vy = -a.vy;
        }

        // Check if returned to nest with food
        const distToNest = Math.hypot(a.x - nest.x, a.y - nest.y);
        if (a.hasFood && distToNest < 16) {
          a.hasFood = false;
          retrievedCrumb++;
          // Turn back out to food
          a.vx = -a.vx;
          a.vy = -a.vy;
        }

        // Target orientation
        let targetAngle = Math.atan2(a.vy, a.vx);

        if (a.hasFood) {
          // Returning: Strong bias towards Nest + deposit pheromone
          const nestAngle = Math.atan2(nest.y - a.y, nest.x - a.x);
          targetAngle = nestAngle + (Math.random() - 0.5) * 0.4;

          // Deposit pheromone
          const gx = Math.floor(a.x / GRID_SCALE);
          const gy = Math.floor(a.y / GRID_SCALE);
          if (gx >= 0 && gx < GW && gy >= 0 && gy < GH) {
            phero[gy * GW + gx] = Math.min(10.0, phero[gy * GW + gx] + 1.5);
          }
        } else {
          // Foraging: Sense pheromone ahead in 3 directions (Left, Center, Right)
          const angle = Math.atan2(a.vy, a.vx);
          const senseDist = 8;
          const senseAngle = 0.5;

          const sense = (rot: number) => {
            const sx = a.x + Math.cos(angle + rot) * senseDist;
            const sy = a.y + Math.sin(angle + rot) * senseDist;
            const gx = Math.floor(sx / GRID_SCALE);
            const gy = Math.floor(sy / GRID_SCALE);
            if (gx >= 0 && gx < GW && gy >= 0 && gy < GH) {
              if (walls[gy * GW + gx] === 1) return -1;
              return Math.pow(phero[gy * GW + gx], alpha);
            }
            return 0;
          };

          const sCenter = sense(0);
          const sLeft = sense(-senseAngle);
          const sRight = sense(senseAngle);

          if (sCenter > sLeft && sCenter > sRight) {
            targetAngle = angle;
          } else if (sLeft > sRight) {
            targetAngle = angle - senseAngle;
          } else if (sRight > sLeft) {
            targetAngle = angle + senseAngle;
          } else {
            // General drift toward food side
            targetAngle = angle + (Math.random() - 0.5) * 0.5;
          }
        }

        // Steer velocity
        a.vx = Math.cos(targetAngle) * speed;
        a.vy = Math.sin(targetAngle) * speed;

        // Move candidate
        let nextX = a.x + a.vx;
        let nextY = a.y + a.vy;

        // Wall collision check
        const ngx = Math.floor(nextX / GRID_SCALE);
        const ngy = Math.floor(nextY / GRID_SCALE);
        if (ngx >= 0 && ngx < GW && ngy >= 0 && ngy < GH && walls[ngy * GW + ngx] === 1) {
          // Bounce
          a.vx = -a.vx + (Math.random() - 0.5);
          a.vy = -a.vy + (Math.random() - 0.5);
          nextX = a.x + a.vx;
          nextY = a.y + a.vy;
        }

        // Boundary clamp
        a.x = Math.max(5, Math.min(W - 5, nextX));
        a.y = Math.max(5, Math.min(H - 5, nextY));
      }

      if (retrievedCrumb > 0) {
        setFoodHarvested(prev => prev + retrievedCrumb);
      }

      // Evaporate pheromones
      for (let i = 0; i < phero.length; i++) {
        phero[i] *= decay;
      }

      // Render
      drawCanvas();
      animFrameRef.current = requestAnimationFrame(updateSimulation);
    };

    animFrameRef.current = requestAnimationFrame(updateSimulation);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, evaporationRate, alpha]);

  // Render to canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Pheromone trails
    const phero = pheromoneGridRef.current;
    for (let gy = 0; gy < GH; gy++) {
      for (let gx = 0; gx < GW; gx++) {
        const val = phero[gy * GW + gx];
        if (val > 0.1) {
          const intensity = Math.min(1.0, val / 4.0);
          ctx.fillStyle = `rgba(16, 185, 129, ${intensity * 0.75})`;
          ctx.fillRect(gx * GRID_SCALE, gy * GRID_SCALE, GRID_SCALE, GRID_SCALE);
        }
      }
    }

    // Draw Obstacle walls
    const walls = wallsGridRef.current;
    ctx.fillStyle = '#475569';
    for (let gy = 0; gy < GH; gy++) {
      for (let gx = 0; gx < GW; gx++) {
        if (walls[gy * GW + gx] === 1) {
          ctx.fillRect(gx * GRID_SCALE, gy * GRID_SCALE, GRID_SCALE, GRID_SCALE);
        }
      }
    }

    // Draw Nest
    const nest = nestRef.current;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(nest.x, nest.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NEST', nest.x, nest.y + 3);

    // Draw Food Source
    const food = foodRef.current;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(food.x, food.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#020617';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FOOD', food.x, food.y + 3);

    // Draw Ants
    const ants = antsRef.current;
    for (let i = 0; i < ants.length; i++) {
      const a = ants[i];
      ctx.fillStyle = a.hasFood ? '#fbbf24' : '#ffffff';
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.hasFood ? 2.8 : 2.0, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Draw obstacle on canvas click/drag
  const handleDrawObstacle = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;

    const gx = Math.floor(x / GRID_SCALE);
    const gy = Math.floor(y / GRID_SCALE);
    const radius = 3;
    const walls = wallsGridRef.current;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = gx + dx;
        const ny = gy + dy;
        if (nx >= 0 && nx < GW && ny >= 0 && ny < GH) {
          walls[ny * GW + nx] = 1;
        }
      }
    }
  };

  return (
    <div id="visualizer-ant-colony" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
            Marco Dorigo Ant Colony Optimization (ACO)
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            Stigmergic Shortest-Path Discovery around Obstacles
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {foodHarvested} Crumbs Harvested
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {antCount} Foraging Ants
          </span>
        </div>
      </div>

      {/* Screen Canvas */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full h-auto cursor-crosshair select-none block"
          onClick={handleDrawObstacle}
          onMouseDown={() => { isMouseDownRef.current = true; }}
          onMouseUp={() => { isMouseDownRef.current = false; }}
          onMouseMove={(e) => { if (isMouseDownRef.current) handleDrawObstacle(e); }}
        />

        <div className="absolute top-2 left-2 pointer-events-none bg-slate-900/80 backdrop-blur-sm border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <Navigation className="h-3 w-3 text-emerald-400" />
          <span>Click & Drag canvas to draw obstacle walls</span>
        </div>
      </div>

      {/* Toolbar & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-colors ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isRunning ? 'Pause Colony' : 'Resume Foraging'}</span>
          </button>

          <button
            onClick={() => initColony('dilemma')}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[11px]"
          >
            Short vs Long Path Dilemma
          </button>

          <button
            onClick={() => initColony('maze')}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px]"
          >
            Maze Barrier
          </button>

          <button
            onClick={() => {
              wallsGridRef.current.fill(0);
              pheromoneGridRef.current.fill(0);
            }}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-[11px]"
          >
            Clear Walls
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-400">
          Evap: <strong>{evaporationRate}%</strong> | Phero Sensitivity α: <strong>{alpha}</strong>
        </div>
      </div>

      {/* Commentary */}
      <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950 text-xs flex gap-3 items-start">
        <div className="p-1.5 rounded shrink-0 bg-emerald-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            ACO POSITIVE FEEDBACK ROUTE THEOREM
          </span>
          <p className="leading-relaxed mt-0.5 text-slate-300">
            {state.colonyStatus || 'Ants taking the shorter path complete round trips faster, refreshing pheromones before evaporation can degrade the trail. Shorter paths naturally achieve exponential amplification.'}
          </p>
        </div>
      </div>
    </div>
  );
}
