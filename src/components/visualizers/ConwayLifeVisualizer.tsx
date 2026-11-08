/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Sparkles, Grid, MousePointer, FastForward } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

const COLS = 48;
const ROWS = 28;

export default function ConwayLifeVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const mode = Number(controls.simulationMode ?? 0); // 0: Conway, 1: HighLife, 2: Langton Ant
  const density = Number(controls.gridDensity ?? 25);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState<number>(60); // ms per tick
  const [activeCellsCount, setActiveCellsCount] = useState(0);

  // Grid state: 2D array of 0 or 1
  const gridRef = useRef<number[][]>(createEmptyGrid());
  // Langton ant state: { x, y, dir } 0: North, 1: East, 2: South, 3: West
  const antRef = useRef({ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2), dir: 0 });
  const isMouseDownRef = useRef(false);

  function createEmptyGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  function randomizeGrid(fillPct = 25) {
    const newGrid = createEmptyGrid();
    let count = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() * 100 < fillPct) {
          newGrid[r][c] = 1;
          count++;
        }
      }
    }
    gridRef.current = newGrid;
    setActiveCellsCount(count);
    setGeneration(0);
    antRef.current = { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2), dir: 0 };
    renderCanvas();
  }

  // Load Presets
  const loadPreset = useCallback((preset: 'gliderGun' | 'pulsar' | 'spaceship' | 'acorn' | 'langton') => {
    const g = createEmptyGrid();
    if (preset === 'gliderGun') {
      // Gosper Glider Gun coords offset by r=2, c=2
      const coords = [
        [5,1],[5,2],[6,1],[6,2],
        [5,11],[6,11],[7,11],[4,12],[8,12],[3,13],[9,13],[3,14],[9,14],[6,15],[4,16],[8,16],[5,17],[6,17],[7,17],[6,18],
        [3,21],[4,21],[5,21],[3,22],[4,22],[5,22],[2,23],[6,23],[1,25],[2,25],[6,25],[7,25],
        [3,35],[4,35],[3,36],[4,36]
      ];
      coords.forEach(([r, c]) => {
        if (r < ROWS && c < COLS) g[r][c] = 1;
      });
    } else if (preset === 'pulsar') {
      // Pulsar centered
      const midR = Math.floor(ROWS / 2);
      const midC = Math.floor(COLS / 2);
      const deltas = [-6, -1, 1, 6];
      const bars = [-4, -3, -2, 2, 3, 4];
      deltas.forEach(dr => {
        bars.forEach(bc => {
          if (midR + dr >= 0 && midR + dr < ROWS && midC + bc >= 0 && midC + bc < COLS) g[midR + dr][midC + bc] = 1;
          if (midR + bc >= 0 && midR + bc < ROWS && midC + dr >= 0 && midC + dr < COLS) g[midR + bc][midC + dr] = 1;
        });
      });
    } else if (preset === 'spaceship') {
      // Lightweight spaceship (LWSS)
      const r = 10, c = 5;
      const lwss = [[0,1],[0,4],[1,0],[2,0],[2,4],[3,0],[3,1],[3,2],[3,3]];
      lwss.forEach(([dr, dc]) => { if (r + dr < ROWS && c + dc < COLS) g[r + dr][c + dc] = 1; });
    } else if (preset === 'acorn') {
      // Acorn (Methuselah)
      const r = 14, c = 20;
      const acorn = [[0,1],[1,3],[2,0],[2,1],[2,4],[2,5],[2,6]];
      acorn.forEach(([dr, dc]) => { if (r + dr < ROWS && c + dc < COLS) g[r + dr][c + dc] = 1; });
    } else if (preset === 'langton') {
      antRef.current = { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2), dir: 0 };
    }
    gridRef.current = g;
    let count = 0;
    g.forEach(row => row.forEach(v => { if (v) count++; }));
    setActiveCellsCount(count);
    setGeneration(0);
    renderCanvas();
  }, []);

  // Sync with scenario changes or step
  useEffect(() => {
    if (mode === 2) {
      loadPreset('langton');
    } else {
      randomizeGrid(density);
    }
  }, [mode, density]);

  // Canvas drawing
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellW = width / COLS;
    const cellH = height / ROWS;

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#151d2f';
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellW, 0);
      ctx.lineTo(c * cellW, height);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellH);
      ctx.lineTo(width, r * cellH);
      ctx.stroke();
    }

    // Cells
    const g = gridRef.current;
    let liveCount = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (g[r][c] === 1) {
          liveCount++;
          if (mode === 1) {
            ctx.fillStyle = '#a855f7'; // Purple for HighLife
          } else if (mode === 2) {
            ctx.fillStyle = '#e2e8f0'; // White for Langton black/white flipped
          } else {
            ctx.fillStyle = '#10b981'; // Emerald for Conway
          }
          ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
        }
      }
    }
    setActiveCellsCount(liveCount);

    // If Langton's Ant mode, draw the Ant
    if (mode === 2) {
      const ant = antRef.current;
      const ax = ant.x * cellW + cellW / 2;
      const ay = ant.y * cellH + cellH / 2;
      ctx.fillStyle = '#f43f5e'; // Red ant
      ctx.beginPath();
      ctx.arc(ax, ay, cellW * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Heading indicator
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]; // N, E, S, W
      const angle = angles[ant.dir];
      ctx.lineTo(ax + Math.cos(angle) * cellW * 0.6, ay + Math.sin(angle) * cellH * 0.6);
      ctx.stroke();
    }
  }, [mode]);

  // Simulation tick step
  const tick = useCallback(() => {
    const g = gridRef.current;
    if (mode === 2) {
      // Langton's Ant step
      const ant = { ...antRef.current };
      const currentCell = g[ant.y][ant.x];
      // Turn rule: If on white (1), turn 90° right; if on black (0), turn 90° left
      if (currentCell === 1) {
        ant.dir = (ant.dir + 1) % 4; // Turn right
        g[ant.y][ant.x] = 0; // Flip to black
      } else {
        ant.dir = (ant.dir + 3) % 4; // Turn left
        g[ant.y][ant.x] = 1; // Flip to white
      }
      // Step forward
      if (ant.dir === 0) ant.y = (ant.y - 1 + ROWS) % ROWS;
      else if (ant.dir === 1) ant.x = (ant.x + 1) % COLS;
      else if (ant.dir === 2) ant.y = (ant.y + 1) % ROWS;
      else if (ant.dir === 3) ant.x = (ant.x - 1 + COLS) % COLS;

      antRef.current = ant;
    } else {
      // Cellular Automaton: Conway (B3/S23) or HighLife (B36/S23)
      const nextG = createEmptyGrid();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          let neighbors = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = (r + dr + ROWS) % ROWS;
              const nc = (c + dc + COLS) % COLS;
              if (g[nr][nc] === 1) neighbors++;
            }
          }
          const isAlive = g[r][c] === 1;
          if (mode === 1) {
            // HighLife: B36/S23 (born on 3 or 6)
            if (isAlive && (neighbors === 2 || neighbors === 3)) nextG[r][c] = 1;
            else if (!isAlive && (neighbors === 3 || neighbors === 6)) nextG[r][c] = 1;
          } else {
            // Conway: B3/S23
            if (isAlive && (neighbors === 2 || neighbors === 3)) nextG[r][c] = 1;
            else if (!isAlive && neighbors === 3) nextG[r][c] = 1;
          }
        }
      }
      gridRef.current = nextG;
    }

    setGeneration(prev => prev + 1);
    renderCanvas();
  }, [mode, renderCanvas]);

  // Animation Loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(tick, speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, tick, speed]);

  // Click & Paint cells
  const handleCanvasAction = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
      if (mode === 2) {
        antRef.current = { x: c, y: r, dir: 0 };
      } else {
        gridRef.current[r][c] = gridRef.current[r][c] === 1 ? 0 : 1;
      }
      renderCanvas();
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <div id="visualizer-conway-life" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
            {mode === 2 ? "Langton's Ant Turing Automaton" : mode === 1 ? 'HighLife Cellular Automaton (B36/S23)' : 'Conway’s Game of Life (B3/S23)'}
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            {mode === 2 ? 'Emergence of the 104-Step Highway' : 'Self-Replication & Universal Computation Grid'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Gen {generation} | {activeCellsCount} Active Cells
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {Math.round((activeCellsCount / (COLS * ROWS)) * 100)}% Density
          </span>
        </div>
      </div>

      {/* Canvas Interactive Screen */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={COLS * 16}
          height={ROWS * 16}
          className="w-full h-auto max-h-[360px] cursor-crosshair select-none block"
          onClick={handleCanvasAction}
          onMouseDown={() => { isMouseDownRef.current = true; }}
          onMouseUp={() => { isMouseDownRef.current = false; }}
          onMouseMove={(e) => { if (isMouseDownRef.current && mode !== 2) handleCanvasAction(e); }}
        />

        {/* Floating helper overlay */}
        <div className="absolute top-2 left-2 pointer-events-none bg-slate-900/80 backdrop-blur-sm border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <MousePointer className="h-3 w-3 text-emerald-400" />
          <span>Click/Drag canvas to toggle cells</span>
        </div>
      </div>

      {/* Preset Toolbar & Speed Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
        {/* Playback Controls */}
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
            <span>{isRunning ? 'Pause' : 'Run Auto'}</span>
          </button>

          <button
            onClick={tick}
            disabled={isRunning}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 flex items-center gap-1 border border-slate-700"
            title="Advance 1 Generation"
          >
            <FastForward className="h-3.5 w-3.5 text-indigo-400" />
            <span>Step</span>
          </button>

          <button
            onClick={() => {
              gridRef.current = createEmptyGrid();
              setGeneration(0);
              setActiveCellsCount(0);
              renderCanvas();
            }}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 border border-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Clear</span>
          </button>

          <button
            onClick={() => randomizeGrid(density)}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 border border-slate-700"
          >
            <Shuffle className="h-3.5 w-3.5 text-purple-400" />
            <span>Random Soup</span>
          </button>
        </div>

        {/* Pattern Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Presets:</span>
          {mode !== 2 ? (
            <>
              <button
                onClick={() => loadPreset('gliderGun')}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-[11px]"
              >
                Glider Gun
              </button>
              <button
                onClick={() => loadPreset('pulsar')}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px]"
              >
                Pulsar Oscillator
              </button>
              <button
                onClick={() => loadPreset('spaceship')}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px]"
              >
                Spaceship (LWSS)
              </button>
              <button
                onClick={() => loadPreset('acorn')}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[11px]"
              >
                Acorn Methuselah
              </button>
            </>
          ) : (
            <button
              onClick={() => loadPreset('langton')}
              className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 border border-rose-800 text-[11px] font-mono"
            >
              Reset Ant Position
            </button>
          )}
        </div>
      </div>

      {/* Commentary & Emergence status */}
      <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950 text-xs flex gap-3 items-start">
        <div className="p-1.5 rounded shrink-0 bg-emerald-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            {mode === 2 ? 'ANT TRAJECTORY PHASE' : 'CELLULAR EMERGENCE REPORT'}
          </span>
          <p className="leading-relaxed mt-0.5 text-slate-300">
            {mode === 2
              ? generation > 8000 
                ? 'HIGHWAY FORMED: The ant has escaped chaos and builds a repeating 104-step diagonal highway indefinitely across the infinite plane.'
                : `Active wandering: Step ${generation}. In the first ~10,000 steps, Langton’s Ant generates pseudo-symmetric fractal chaos before self-organizing into an emergent highway.`
              : state.phaseDescription || 'Deterministic cellular automaton running. Local neighbor count determines survival (2-3) and birth (3).'}
          </p>
        </div>
      </div>
    </div>
  );
}
