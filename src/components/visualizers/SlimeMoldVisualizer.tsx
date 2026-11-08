/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, MapPin, Sparkles } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

interface Particle {
  x: number;
  y: number;
  angle: number;
}

interface FoodNode {
  id: number;
  x: number;
  y: number;
  name?: string;
}

const W = 520;
const H = 320;
const TRAIL_W = 130;
const TRAIL_H = 80;

export default function SlimeMoldVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const decayRate = Number(controls.decayRate ?? 5);
  const sensorAngleDeg = Number(controls.sensorAngle ?? 35);
  const particleCount = Number(controls.particleDensity ?? 1000);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [foodNodes, setFoodNodes] = useState<FoodNode[]>([]);
  const [efficiency, setEfficiency] = useState(42);

  const particlesRef = useRef<Particle[]>([]);
  const trailMapRef = useRef<Float32Array>(new Float32Array(TRAIL_W * TRAIL_H));
  const tempTrailMapRef = useRef<Float32Array>(new Float32Array(TRAIL_W * TRAIL_H));
  const foodNodesRef = useRef<FoodNode[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Load Tokyo railway nodes preset
  const loadTokyoPreset = useCallback(() => {
    const nodes: FoodNode[] = [
      { id: 1, x: W * 0.48, y: H * 0.48, name: 'Tokyo Central' },
      { id: 2, x: W * 0.42, y: H * 0.70, name: 'Yokohama' },
      { id: 3, x: W * 0.68, y: H * 0.52, name: 'Chiba' },
      { id: 4, x: W * 0.46, y: H * 0.28, name: 'Omiya / Saitama' },
      { id: 5, x: W * 0.28, y: H * 0.46, name: 'Hachioji' },
      { id: 6, x: W * 0.38, y: H * 0.40, name: 'Shinjuku' }
    ];
    setFoodNodes(nodes);
    foodNodesRef.current = nodes;
    initParticles(nodes);
  }, []);

  // Initialize particles around food nodes
  const initParticles = (nodes: FoodNode[]) => {
    const pList: Particle[] = [];
    const sourceNode = nodes.length > 0 ? nodes[0] : { x: W / 2, y: H / 2 };

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 35;
      pList.push({
        x: (sourceNode.x + Math.cos(angle) * r + W) % W,
        y: (sourceNode.y + Math.sin(angle) * r + H) % H,
        angle: Math.random() * Math.PI * 2
      });
    }

    particlesRef.current = pList;
    trailMapRef.current.fill(0);
    tempTrailMapRef.current.fill(0);
  };

  useEffect(() => {
    loadTokyoPreset();
  }, [loadTokyoPreset]);

  // Physarum sensory and movement update step
  useEffect(() => {
    const sensorAngle = (sensorAngleDeg * Math.PI) / 180;
    const sensorDist = 9;
    const stepSize = 1.6;
    const decayFactor = 1.0 - (decayRate / 100);

    const updateSimulation = () => {
      if (!isRunning) {
        animFrameRef.current = requestAnimationFrame(updateSimulation);
        return;
      }

      const particles = particlesRef.current;
      const trail = trailMapRef.current;
      const tempTrail = tempTrailMapRef.current;
      const foods = foodNodesRef.current;

      const scaleX = TRAIL_W / W;
      const scaleY = TRAIL_H / H;

      // Sample trail map helper
      const sampleTrail = (x: number, y: number) => {
        const tx = Math.floor(Math.max(0, Math.min(W - 1, x)) * scaleX);
        const ty = Math.floor(Math.max(0, Math.min(H - 1, y)) * scaleY);
        return trail[ty * TRAIL_W + tx];
      };

      // 1. Move and orient particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Three sensors: Front-Center, Front-Left, Front-Right
        const fX = p.x + Math.cos(p.angle) * sensorDist;
        const fY = p.y + Math.sin(p.angle) * sensorDist;

        const flX = p.x + Math.cos(p.angle - sensorAngle) * sensorDist;
        const flY = p.y + Math.sin(p.angle - sensorAngle) * sensorDist;

        const frX = p.x + Math.cos(p.angle + sensorAngle) * sensorDist;
        const frY = p.y + Math.sin(p.angle + sensorAngle) * sensorDist;

        const fVal = sampleTrail(fX, fY);
        const flVal = sampleTrail(flX, flY);
        const frVal = sampleTrail(frX, frY);

        // Steer towards highest chemoattractant concentration
        if (fVal > flVal && fVal > frVal) {
          // Keep straight
        } else if (fVal < flVal && fVal < frVal) {
          // Random turn
          p.angle += (Math.random() - 0.5) * sensorAngle;
        } else if (flVal > frVal) {
          p.angle -= sensorAngle * 0.5;
        } else if (frVal > flVal) {
          p.angle += sensorAngle * 0.5;
        }

        // Slight random Brownian drift
        p.angle += (Math.random() - 0.5) * 0.25;

        // Step forward
        p.x = (p.x + Math.cos(p.angle) * stepSize + W) % W;
        p.y = (p.y + Math.sin(p.angle) * stepSize + H) % H;

        // Deposit pheromone trail
        const tx = Math.floor(p.x * scaleX);
        const ty = Math.floor(p.y * scaleY);
        if (tx >= 0 && tx < TRAIL_W && ty >= 0 && ty < TRAIL_H) {
          trail[ty * TRAIL_W + tx] = Math.min(10.0, trail[ty * TRAIL_W + tx] + 1.2);
        }
      }

      // Reinforce food nutrient nodes with high attractant
      for (let f = 0; f < foods.length; f++) {
        const food = foods[f];
        const ftx = Math.floor(food.x * scaleX);
        const fty = Math.floor(food.y * scaleY);
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const nx = ftx + dx;
            const ny = fty + dy;
            if (nx >= 0 && nx < TRAIL_W && ny >= 0 && ny < TRAIL_H) {
              trail[ny * TRAIL_W + nx] = 12.0;
            }
          }
        }
      }

      // 2. Diffuse (3x3 box blur) & Evaporate trail map
      for (let ty = 0; ty < TRAIL_H; ty++) {
        const tyW = ty * TRAIL_W;
        for (let tx = 0; tx < TRAIL_W; tx++) {
          let sum = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = (tx + dx + TRAIL_W) % TRAIL_W;
              const ny = (ty + dy + TRAIL_H) % TRAIL_H;
              sum += trail[ny * TRAIL_W + nx];
            }
          }
          // Average and decay
          tempTrail[tyW + tx] = (sum / 9.0) * decayFactor;
        }
      }
      trail.set(tempTrail);

      // Render canvas
      drawCanvas();
      animFrameRef.current = requestAnimationFrame(updateSimulation);
    };

    animFrameRef.current = requestAnimationFrame(updateSimulation);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, decayRate, sensorAngleDeg]);

  // Render to canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render pheromone veins
    const trail = trailMapRef.current;
    const cellW = W / TRAIL_W;
    const cellH = H / TRAIL_H;

    for (let ty = 0; ty < TRAIL_H; ty++) {
      for (let tx = 0; tx < TRAIL_W; tx++) {
        const val = trail[ty * TRAIL_W + tx];
        if (val > 0.4) {
          const alpha = Math.min(1.0, val / 4.0);
          // Glowing amber / yellow-green Physarum slime color
          ctx.fillStyle = `rgba(234, 179, 8, ${alpha})`;
          ctx.fillRect(tx * cellW, ty * cellH, cellW + 1, cellH + 1);
        }
      }
    }

    // Draw Food Nutrient Nodes (Oat Flakes)
    const foods = foodNodesRef.current;
    for (let i = 0; i < foods.length; i++) {
      const f = foods[i];
      // Golden nutrient circle
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(f.x, f.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node Label
      if (f.name) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(f.name, f.x, f.y - 12);
      }
    }
  };

  // Click canvas to drop food node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const newNode: FoodNode = {
      id: Date.now(),
      x,
      y,
      name: `Node ${foodNodes.length + 1}`
    };
    const updated = [...foodNodes, newNode];
    setFoodNodes(updated);
    foodNodesRef.current = updated;
  };

  return (
    <div id="visualizer-slime-mold" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block font-semibold">
            Physarum Polycephalum Slime Mold Network Optimization
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            Decentralized Bio-Computing & Shortest-Path Steiner Trees
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {foodNodes.length} Nutrient Nodes
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {particleCount} Amoeboid Particles
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
          onClick={handleCanvasClick}
        />

        <div className="absolute top-2 left-2 pointer-events-none bg-slate-900/80 backdrop-blur-sm border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-emerald-400" />
          <span>Click canvas to place new Food Nutrient Nodes (Oat Flakes)</span>
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
            <span>{isRunning ? 'Pause Slime' : 'Resume Slime'}</span>
          </button>

          <button
            onClick={loadTokyoPreset}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[11px]"
          >
            Tokyo Rail Preset
          </button>

          <button
            onClick={() => {
              setFoodNodes([]);
              foodNodesRef.current = [];
              trailMapRef.current.fill(0);
            }}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-[11px] flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Food</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-400">
          Decay: <strong>{decayRate}%</strong> | Sensor Angle: <strong>{sensorAngleDeg}°</strong>
        </div>
      </div>

      {/* Commentary */}
      <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950 text-xs flex gap-3 items-start">
        <div className="p-1.5 rounded shrink-0 bg-amber-600 text-slate-950 font-bold">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            BIOLOGICAL STEINER ROUTING THEOREM
          </span>
          <p className="leading-relaxed mt-0.5 text-slate-300">
            {state.foragingStatus || 'Physarum Polycephalum particles deposit chemoattractants and steer towards gradients. As high-flux tubes expand and redundant trails evaporate, the colony naturally finds the optimal shortest-path network.'}
          </p>
        </div>
      </div>
    </div>
  );
}
