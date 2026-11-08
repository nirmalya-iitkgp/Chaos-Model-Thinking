/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Flame, Zap, Play, Pause, RotateCcw, Shuffle, ShieldCheck, AlertTriangle } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

const COLS = 50;
const ROWS = 30;

// Cell states: 0: Empty, 1: Tree (Green), 2: Burning (Fire), 3: Ash (Burned)
export default function ForestFireVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const density = Number(controls.treeDensity ?? 59);
  const wind = Number(controls.windIntensity ?? 0.5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [activeFiresCount, setActiveFiresCount] = useState(0);
  const [burnedCount, setBurnedCount] = useState(0);
  const [hasPercolated, setHasPercolated] = useState(false);

  const gridRef = useRef<number[][]>(createGrid());

  function createGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  // Populate forest based on density
  const initForest = useCallback(() => {
    const g = createGrid();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() * 100 < density) {
          g[r][c] = 1; // Living Tree
        }
      }
    }
    gridRef.current = g;
    setGeneration(0);
    setActiveFiresCount(0);
    setBurnedCount(0);
    setHasPercolated(false);
    renderCanvas();
  }, [density]);

  useEffect(() => {
    initForest();
  }, [initForest]);

  // Ignite fire on western boundary (lightning strike)
  const strikeLightning = useCallback(() => {
    const g = gridRef.current;
    let sparks = 0;
    // Ignite 3 to 6 trees on the western edge
    for (let r = 0; r < ROWS; r++) {
      if (g[r][1] === 1 || g[r][0] === 1) {
        if (Math.random() < 0.6) {
          if (g[r][0] === 1) g[r][0] = 2;
          else g[r][1] = 2;
          sparks++;
        }
      }
    }
    // If no trees on edge, strike middle
    if (sparks === 0) {
      const midR = Math.floor(ROWS / 2);
      for (let c = 0; c < 5; c++) {
        if (g[midR][c] === 1) { g[midR][c] = 2; sparks++; }
      }
    }

    setActiveFiresCount(sparks);
    setIsRunning(true);
    renderCanvas();
  }, []);

  // Fire propagation simulation step
  const stepFire = useCallback(() => {
    const g = gridRef.current;
    const nextG = g.map(row => [...row]);
    let fires = 0;
    let newlyBurned = 0;
    let reachedEastBorder = false;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (g[r][c] === 2) {
          // Current burning cell turns to Ash
          nextG[r][c] = 3;
          newlyBurned++;

          // Check if reached east boundary (Spanning Cluster Percolation!)
          if (c >= COLS - 2) {
            reachedEastBorder = true;
          }

          // Spread to 4 cardinal + 4 diagonal neighbors
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                if (g[nr][nc] === 1 && nextG[nr][nc] === 1) {
                  // Wind bias: Eastward wind increases chance of catching to the right
                  let spreadProb = 0.88;
                  if (wind > 0 && dc > 0) spreadProb += 0.12 * wind;
                  if (Math.random() < spreadProb) {
                    nextG[nr][nc] = 2; // Catches fire!
                    fires++;
                  }
                }
              }
            }
          }
        }
      }
    }

    gridRef.current = nextG;
    setActiveFiresCount(fires);
    setBurnedCount(prev => prev + newlyBurned);
    if (reachedEastBorder) setHasPercolated(true);
    setGeneration(prev => prev + 1);

    if (fires === 0) {
      setIsRunning(false); // Fire burned out
    }
    renderCanvas();
  }, [wind]);

  // Auto-run loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(stepFire, 120);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, stepFire]);

  // Canvas drawing
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellW = canvas.width / COLS;
    const cellH = canvas.height / ROWS;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const g = gridRef.current;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const state = g[r][c];
        const x = c * cellW;
        const y = r * cellH;

        if (state === 1) {
          // Living Tree
          ctx.fillStyle = '#10b981';
          ctx.fillRect(x + 0.5, y + 0.5, cellW - 1, cellH - 1);
        } else if (state === 2) {
          // Burning Fire
          ctx.fillStyle = Math.random() < 0.5 ? '#f97316' : '#ef4444';
          ctx.fillRect(x, y, cellW, cellH);
        } else if (state === 3) {
          // Ash
          ctx.fillStyle = '#27272a';
          ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
        }
      }
    }
  }, []);

  // Click on tree to ignite
  const handleIgniteClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellW = rect.width / COLS;
    const cellH = rect.height / ROWS;
    const c = Math.floor(x / cellW);
    const r = Math.floor(y / cellH);

    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      if (gridRef.current[r][c] === 1) {
        gridRef.current[r][c] = 2; // Ignite
        setActiveFiresCount(prev => prev + 1);
        setIsRunning(true);
        renderCanvas();
      }
    }
  };

  const totalTrees = Math.round(ROWS * COLS * (density / 100));
  const burnedPct = totalTrees > 0 ? Math.min(100, Math.round((burnedCount / totalTrees) * 100)) : 0;

  return (
    <div id="visualizer-forest-fire" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
            Percolation Threshold & Critical Phase Transitions
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            Lattice Occupancy Density p = {density}% (Theoretical Critical pc ≈ 59.3%)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {activeFiresCount} Active Flames
          </span>
          <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold border ${
            hasPercolated 
              ? 'bg-rose-500 text-white animate-pulse' 
              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
          }`}>
            {hasPercolated ? '⚡ SPANNING CLUSTER PERCOLATED' : 'Subcritical / Localized'}
          </span>
        </div>
      </div>

      {/* Main Grid: Forest Canvas & Percolation Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Canvas Lattice */}
        <div className="lg:col-span-8 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="relative rounded overflow-hidden border border-slate-800">
            <canvas
              ref={canvasRef}
              width={COLS * 12}
              height={ROWS * 12}
              className="w-full h-auto cursor-pointer select-none block"
              onClick={handleIgniteClick}
            />
          </div>

          {/* Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-900 pt-3 mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={strikeLightning}
                className="px-3 py-1.5 rounded font-medium text-xs flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white transition-colors"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Strike Lightning</span>
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={activeFiresCount === 0}
                className={`px-3 py-1.5 rounded font-medium text-xs flex items-center gap-1.5 transition-colors ${
                  isRunning 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                    : 'bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200'
                }`}
              >
                {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isRunning ? 'Pause' : 'Resume Spread'}</span>
              </button>

              <button
                onClick={stepFire}
                disabled={isRunning || activeFiresCount === 0}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs border border-slate-700"
              >
                Step Tick
              </button>

              <button
                onClick={initForest}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                <span>Regrow Forest</span>
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-400">
              Click any green tree to spark manually
            </div>
          </div>
        </div>

        {/* Right: Phase Transition Curve & Metrics */}
        <div className="lg:col-span-4 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Phase Transition Monitor
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Percolation probability vs. canopy density p
            </p>
          </div>

          {/* Percolation Curve Illustration SVG */}
          <div className="h-32 border-b border-l border-slate-800 p-2 my-2 relative">
            <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              {/* Critical threshold line at pc = 59.3% (X = 118) */}
              <line x1="118" y1="0" x2="118" y2="100" stroke="#f43f5e" strokeDasharray="3" strokeWidth="1.5" />
              <text x="122" y="15" className="text-[8px] fill-rose-400 font-mono font-bold">pc ≈ 59.3%</text>

              {/* Sigmoidal phase transition curve */}
              <path
                d="M 10 95 Q 80 94 110 85 T 125 15 Q 150 8 190 6"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />

              {/* Current density marker */}
              <circle
                cx={Math.round((density / 100) * 200)}
                cy={density >= 59.3 ? 15 : 90}
                r="5"
                fill="#f43f5e"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="animate-ping"
              />
              <circle
                cx={Math.round((density / 100) * 200)}
                cy={density >= 59.3 ? 15 : 90}
                r="4.5"
                fill={density >= 59.3 ? '#f43f5e' : '#10b981'}
                stroke="#ffffff"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Metrics summary */}
          <div className="flex flex-col gap-2 border-t border-slate-900 pt-2 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-400">Forest Consumed:</span>
              <span className="font-bold text-rose-400">{burnedPct}% ({burnedCount} trees)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-400">Threshold Regime:</span>
              <span className={density >= 59.3 ? 'font-bold text-rose-400' : 'font-bold text-emerald-400'}>
                {density >= 59.3 ? 'SUPERCRITICAL (Runs away)' : 'SUBCRITICAL (Self-limiting)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Commentary */}
      <div className={`p-3.5 rounded-lg border text-xs flex gap-3 items-start transition-all ${
        density >= 59.3 && hasPercolated ? 'bg-rose-950/40 border-rose-900/50 text-rose-100' : 'bg-slate-950 border-slate-800 text-slate-300'
      }`}>
        <div className={`p-1.5 rounded shrink-0 ${density >= 59.3 && hasPercolated ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
          <Flame className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            PERCOLATION THRESHOLD THEOREM
          </span>
          <p className="leading-relaxed mt-0.5 font-normal">
            {density >= 59.3 
              ? `PHASE TRANSITION BREACHED (p = ${density}% >= 59.3%): An unbroken chain of trees spans the entire lattice. Fire inevitably percolates and consumes the whole forest.`
              : `SUBCRITICAL CONTAINMENT (p = ${density}% < 59.3%): Trees exist in disconnected geometric clusters. Fire halts at natural gaps without reaching the opposite border.`}
          </p>
        </div>
      </div>
    </div>
  );
}
