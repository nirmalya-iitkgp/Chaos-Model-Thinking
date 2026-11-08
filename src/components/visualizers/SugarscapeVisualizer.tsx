/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, TrendingUp, Users, Award, ShieldAlert, Sparkles } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

interface Agent {
  x: number;
  y: number;
  sugar: number;
  metabolism: number;
  vision: number;
}

const COLS = 40;
const ROWS = 26;
const AGENT_COUNT = 85;

export default function SugarscapeVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const regrowthRate = Number(controls.sugarRegrowth ?? 1);
  const maxVision = Number(controls.visionRange ?? 4);
  const baseMetabolism = Number(controls.metabolicPressure ?? 2);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [gini, setGini] = useState(0.28);
  const [top10Share, setTop10Share] = useState(26);
  const [starvationCount, setStarvationCount] = useState(0);

  // Sugar grid: maxCapacity[r][c] and currentSugar[r][c]
  const capacityGridRef = useRef<number[][]>(createGrid());
  const sugarGridRef = useRef<number[][]>(createGrid());
  const agentsRef = useRef<Agent[]>([]);

  function createGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  // Generate the two Epstein & Axtell Sugar Mountains
  const initSugarscape = useCallback(() => {
    const maxCap = createGrid();
    const currSugar = createGrid();

    // Mountain 1 peak at (r=7, c=10), Mountain 2 peak at (r=18, c=30)
    const m1 = { r: 7, c: 10 };
    const m2 = { r: 18, c: 30 };

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const d1 = Math.sqrt(Math.pow(r - m1.r, 2) + Math.pow(c - m1.c, 2));
        const d2 = Math.sqrt(Math.pow(r - m2.r, 2) + Math.pow(c - m2.c, 2));
        const val1 = Math.max(0, 4 - Math.floor(d1 / 2.5));
        const val2 = Math.max(0, 4 - Math.floor(d2 / 2.5));
        const cap = Math.min(4, Math.max(val1, val2));
        maxCap[r][c] = cap;
        currSugar[r][c] = cap;
      }
    }

    // Spawn agents
    const initialAgents: Agent[] = [];
    for (let i = 0; i < AGENT_COUNT; i++) {
      initialAgents.push({
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
        sugar: Math.floor(10 + Math.random() * 15),
        metabolism: Math.max(1, Math.round(baseMetabolism + (Math.random() - 0.5) * 1.5)),
        vision: Math.max(1, Math.floor(1 + Math.random() * maxVision))
      });
    }

    capacityGridRef.current = maxCap;
    sugarGridRef.current = currSugar;
    agentsRef.current = initialAgents;
    setCycle(0);
    setStarvationCount(0);
    evaluateWealth(initialAgents);
  }, [baseMetabolism, maxVision]);

  useEffect(() => {
    initSugarscape();
  }, [initSugarscape]);

  // Calculate Gini coefficient and wealth distribution
  const evaluateWealth = (agents: Agent[]) => {
    if (agents.length === 0) return;
    const sorted = [...agents].map(a => a.sugar).sort((a, b) => a - b);
    const n = sorted.length;
    const totalWealth = sorted.reduce((sum, w) => sum + w, 0);

    // Gini Formula: G = (2 * sum(i * y_i)) / (n * sum(y_i)) - (n + 1) / n
    let numerator = 0;
    for (let i = 0; i < n; i++) {
      numerator += (i + 1) * sorted[i];
    }
    const calculatedGini = totalWealth > 0 
      ? Math.max(0, Math.min(0.99, (2 * numerator) / (n * totalWealth) - (n + 1) / n))
      : 0;

    // Top 10% share
    const topCount = Math.max(1, Math.floor(n * 0.1));
    const topSum = sorted.slice(n - topCount).reduce((sum, w) => sum + w, 0);
    const calculatedTop10 = totalWealth > 0 ? Math.round((topSum / totalWealth) * 100) : 10;

    setGini(Math.round(calculatedGini * 100) / 100);
    setTop10Share(calculatedTop10);
    renderCanvas();
  };

  // Simulation tick step
  const stepCycle = useCallback(() => {
    const maxCap = capacityGridRef.current;
    const sugar = sugarGridRef.current.map(row => [...row]);
    const agents = [...agentsRef.current];
    let starvations = 0;

    // 1. Regrow sugar terrain
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        sugar[r][c] = Math.min(maxCap[r][c], sugar[r][c] + regrowthRate);
      }
    }

    // 2. Agents move and forage
    // Shuffle agent execution order for fairness
    agents.sort(() => Math.random() - 0.5);

    const occupied = new Set<string>();
    agents.forEach(a => occupied.add(`${a.x},${a.y}`));

    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];
      occupied.delete(`${a.x},${a.y}`);

      // Scan in 4 cardinal directions within vision range
      let bestX = a.x;
      let bestY = a.y;
      let maxSugarFound = sugar[a.y][a.x];

      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      dirs.forEach(([dx, dy]) => {
        for (let d = 1; d <= a.vision; d++) {
          const nx = (a.x + dx * d + COLS) % COLS;
          const ny = (a.y + dy * d + ROWS) % ROWS;
          if (!occupied.has(`${nx},${ny}`) && sugar[ny][nx] > maxSugarFound) {
            maxSugarFound = sugar[ny][nx];
            bestX = nx;
            bestY = ny;
          }
        }
      });

      // Move to best cell
      a.x = bestX;
      a.y = bestY;
      occupied.add(`${bestX},${bestY}`);

      // Harvest sugar and burn metabolism
      a.sugar += sugar[bestY][bestX];
      sugar[bestY][bestX] = 0; // Harvested
      a.sugar -= a.metabolism;

      // Check starvation
      if (a.sugar <= 0) {
        starvations++;
        // Replaced by newborn agent with random endowments
        a.x = Math.floor(Math.random() * COLS);
        a.y = Math.floor(Math.random() * ROWS);
        a.sugar = Math.floor(10 + Math.random() * 15);
        a.metabolism = Math.max(1, Math.round(baseMetabolism + (Math.random() - 0.5) * 1.5));
        a.vision = Math.max(1, Math.floor(1 + Math.random() * maxVision));
      }
    }

    sugarGridRef.current = sugar;
    agentsRef.current = agents;
    setCycle(prev => prev + 1);
    setStarvationCount(prev => prev + starvations);
    evaluateWealth(agents);
  }, [regrowthRate, baseMetabolism, maxVision]);

  // Auto-run loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(stepCycle, 180);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, stepCycle]);

  // Render canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellW = canvas.width / COLS;
    const cellH = canvas.height / ROWS;

    // Sugar terrain background
    const sugar = sugarGridRef.current;
    const sugarColors = ['#090d16', '#1e293b', '#3b2f15', '#604212', '#92570b'];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const amt = sugar[r][c];
        ctx.fillStyle = sugarColors[Math.min(4, amt)] || '#090d16';
        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
      }
    }

    // Draw agents colored by wealth (pale yellow to glowing gold/amber)
    const agents = agentsRef.current;
    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];
      const x = a.x * cellW + cellW / 2;
      const y = a.y * cellH + cellH / 2;

      let color = '#fef08a'; // Pale yellow (poor)
      let radius = 3.5;
      if (a.sugar > 80) {
        color = '#f59e0b'; // Deep Amber gold (ultra rich)
        radius = 5.5;
      } else if (a.sugar > 35) {
        color = '#fbbf24'; // Warm Gold
        radius = 4.5;
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, []);

  // Compute Wealth Distribution Histogram
  const agents = agentsRef.current;
  const wealthBuckets = [0, 0, 0, 0, 0, 0]; // 0-20, 20-40, 40-60, 60-80, 80-120, 120+
  agents.forEach(a => {
    if (a.sugar < 20) wealthBuckets[0]++;
    else if (a.sugar < 40) wealthBuckets[1]++;
    else if (a.sugar < 60) wealthBuckets[2]++;
    else if (a.sugar < 80) wealthBuckets[3]++;
    else if (a.sugar < 120) wealthBuckets[4]++;
    else wealthBuckets[5]++;
  });
  const maxBucket = Math.max(1, ...wealthBuckets);

  return (
    <div id="visualizer-sugarscape" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block font-semibold">
            Epstein & Axtell Sugarscape Artificial Society (1996)
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            Emergent Pareto Inequality & Gini Distribution (Gini = {gini})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Cycle {cycle}
          </span>
          <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold border ${
            gini >= 0.60 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse' 
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            Top 10% Own {top10Share}% of Capital
          </span>
        </div>
      </div>

      {/* Main Grid: Terrain Canvas & Wealth Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Spatial Sugar Terrain Canvas */}
        <div className="lg:col-span-8 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="relative rounded overflow-hidden border border-slate-800">
            <canvas
              ref={canvasRef}
              width={COLS * 14}
              height={ROWS * 14}
              className="w-full h-auto select-none block"
            />
          </div>

          {/* Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-900 pt-3 mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-3 py-1.5 rounded font-medium text-xs flex items-center gap-1.5 transition-colors ${
                  isRunning 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isRunning ? 'Pause Harvest' : 'Auto-Forage'}</span>
              </button>

              <button
                onClick={stepCycle}
                disabled={isRunning}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs border border-slate-700"
              >
                Step Cycle
              </button>

              <button
                onClick={initSugarscape}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                <span>Reset Sugarscape</span>
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-400">
              Gold dots = Wealthy agents on peaks
            </div>
          </div>
        </div>

        {/* Right: Wealth Inequality Histogram */}
        <div className="lg:col-span-4 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Wealth Inequality Histogram
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Emergent Pareto Power-Law Distribution
            </p>
          </div>

          {/* Histogram Bars */}
          <div className="h-36 flex items-end gap-2 border-b border-l border-slate-800 p-2 my-2 relative">
            {wealthBuckets.map((count, idx) => {
              const labels = ['<20', '20-40', '40-60', '60-80', '80-120', '120+'];
              const heightPct = Math.max(6, Math.min(100, (count / maxBucket) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-[8px] font-mono text-slate-400 mb-0.5">{count}</span>
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      idx >= 4 ? 'bg-amber-400' : idx >= 2 ? 'bg-indigo-400' : 'bg-slate-600'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[8px] font-mono text-slate-500 mt-1">{labels[idx]}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Sugar Wealth Bracket</span>
            <span>Agent Count</span>
          </div>

          {/* Gini & Pareto Metrics */}
          <div className="border-t border-slate-900 pt-2 text-xs flex flex-col gap-1 font-mono">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Gini Coefficient:</span>
              <strong className={gini >= 0.60 ? 'text-rose-400' : 'text-amber-400'}>{gini}</strong>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Starvations Logged:</span>
              <span className="text-slate-300">{starvationCount} replaced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Commentary */}
      <div className={`p-3.5 rounded-lg border text-xs flex gap-3 items-start transition-all ${
        gini >= 0.60 ? 'bg-amber-950/40 border-amber-900/50 text-amber-100' : 'bg-slate-950 border-slate-800 text-slate-300'
      }`}>
        <div className={`p-1.5 rounded shrink-0 ${gini >= 0.60 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-indigo-500 text-white'}`}>
          <TrendingUp className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            EPSTEIN & AXTELL EMERGENCE THEOREM
          </span>
          <p className="leading-relaxed mt-0.5 font-normal">
            {state.economicStatus || `Simple differences in biological vision and metabolism inevitably compound into extreme Pareto wealth inequality (Gini ${gini}), even under decentralized and equal initial rules.`}
          </p>
        </div>
      </div>
    </div>
  );
}
