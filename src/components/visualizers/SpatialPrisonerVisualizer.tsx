/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Shuffle, ShieldCheck, ShieldAlert, Sparkles, Users, Award } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

const COLS = 40;
const ROWS = 24;

// Strategy IDs
// 0: Tit-for-Tat, 1: Always Defect, 2: Always Cooperate, 3: Grudger, 4: Pavlov
const STRATEGIES = [
  { id: 0, name: 'Tit-for-Tat', color: '#38bdf8', hex: 'bg-sky-500', desc: 'Starts cooperating, copies neighbor’s previous move' },
  { id: 1, name: 'Always Defect', color: '#f43f5e', hex: 'bg-rose-500', desc: 'Unconditionally exploits naive cooperators' },
  { id: 2, name: 'Always Cooperate', color: '#10b981', hex: 'bg-emerald-500', desc: 'Unconditionally benevolent altruist' },
  { id: 3, name: 'Grudger (Grim)', color: '#fbbf24', hex: 'bg-amber-500', desc: 'Cooperates until betrayed once, then permanent defection' },
  { id: 4, name: 'Pavlov (WSLS)', color: '#c084fc', hex: 'bg-purple-500', desc: 'Repeats choice if rewarded, switches if exploited' }
];

export default function SpatialPrisonerVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const T = Number(controls.temptationPayoff ?? 1.6);
  const noise = Number(controls.noiseRate ?? 2);
  const mutation = Number(controls.mutationRate ?? 1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [activeBrush, setActiveBrush] = useState<number>(0); // which strategy to paint

  // 2D grid storing strategy ID for each cell
  const gridRef = useRef<number[][]>(createGrid());
  // Memory grid for Tit-for-Tat / Grudger tracking
  const memoryRef = useRef<boolean[][]>(createBoolGrid());
  const isMouseDownRef = useRef(false);

  function createGrid(defaultStrat = 0) {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(defaultStrat));
  }
  function createBoolGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  }

  // Populate presets
  const loadPreset = useCallback((preset: 'island' | 'mixed' | 'invasion') => {
    const g = createGrid();
    if (preset === 'island') {
      // Sea of Defectors (1) with a compact island of Tit-for-Tat (0) in center
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          g[r][c] = 1; // Defector sea
        }
      }
      const midR = Math.floor(ROWS / 2);
      const midC = Math.floor(COLS / 2);
      for (let dr = -4; dr <= 4; dr++) {
        for (let dc = -6; dc <= 6; dc++) {
          g[midR + dr][midC + dc] = 0; // Tit-for-Tat island
        }
      }
    } else if (preset === 'invasion') {
      // Sea of Naive Cooperators (2) with a small cluster of Defectors (1) invading
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          g[r][c] = 2; // Always Cooperate
        }
      }
      const midR = Math.floor(ROWS / 2);
      const midC = Math.floor(COLS / 2);
      // Place a few defectors
      g[midR][midC] = 1;
      g[midR + 1][midC] = 1;
      g[midR][midC + 1] = 1;
      // Surrounding buffer of Tit-for-Tat to act as immune system
      for (let dr = -4; dr <= 4; dr++) {
        g[midR + dr][midC - 6] = 0;
        g[midR + dr][midC + 6] = 0;
      }
    } else {
      // Mixed random soup
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          g[r][c] = Math.floor(Math.random() * STRATEGIES.length);
        }
      }
    }

    gridRef.current = g;
    memoryRef.current = createBoolGrid();
    setGeneration(0);
    renderCanvas();
  }, []);

  // Sync initial setup
  useEffect(() => {
    loadPreset('island');
  }, [loadPreset]);

  // Render canvas
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
        const strat = g[r][c];
        ctx.fillStyle = STRATEGIES[strat]?.color || '#ffffff';
        ctx.fillRect(c * cellW + 0.5, r * cellH + 0.5, cellW - 1, cellH - 1);
      }
    }
  }, []);

  // Simulation generation step (Evolutionary Replicator Dynamics)
  const stepGeneration = useCallback(() => {
    const g = gridRef.current;
    const R = 1.0; // Reward for mutual cooperation
    const P = 0.1; // Punishment for mutual defection
    const S = 0.0; // Sucker's payoff

    // Helper: Determine action (true = Cooperate, false = Defect)
    const getAction = (strat: number, myMemory: boolean, opponentStrat: number) => {
      let coop = true;
      if (strat === 1) coop = false; // Always Defect
      else if (strat === 2) coop = true; // Always Cooperate
      else if (strat === 0) {
        // Tit-for-Tat: Cooperate unless betrayed in memory
        coop = !myMemory;
      } else if (strat === 3) {
        // Grudger: Once betrayed, forever defect
        coop = !myMemory;
      } else if (strat === 4) {
        // Pavlov: Cooperate if win-stay, lose-shift
        coop = !myMemory;
      }

      // Noise mistake check
      if (coop && Math.random() * 100 < noise) {
        coop = false;
      }
      return coop;
    };

    // Calculate payoffs for each cell across 8 Moore neighbors
    const payoffs = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const myStrat = g[r][c];
        const myMem = memoryRef.current[r][c];
        let totalScore = 0;

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = (r + dr + ROWS) % ROWS;
            const nc = (c + dc + COLS) % COLS;
            const oppStrat = g[nr][nc];
            const oppMem = memoryRef.current[nr][nc];

            const myMove = getAction(myStrat, myMem, oppStrat);
            const oppMove = getAction(oppStrat, oppMem, myStrat);

            if (myMove && oppMove) totalScore += R;
            else if (!myMove && oppMove) totalScore += T; // Temptation
            else if (myMove && !oppMove) totalScore += S; // Sucker
            else totalScore += P; // Mutual defection
          }
        }
        payoffs[r][c] = totalScore;
      }
    }

    // Next generation: adopt the strategy of the highest-scoring neighbor
    const nextG = createGrid();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let bestScore = payoffs[r][c];
        let bestStrat = g[r][c];

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = (r + dr + ROWS) % ROWS;
            const nc = (c + dc + COLS) % COLS;
            if (payoffs[nr][nc] > bestScore) {
              bestScore = payoffs[nr][nc];
              bestStrat = g[nr][nc];
            }
          }
        }

        // Mutation check
        if (Math.random() * 100 < mutation) {
          bestStrat = Math.floor(Math.random() * STRATEGIES.length);
        }

        nextG[r][c] = bestStrat;
      }
    }

    gridRef.current = nextG;
    setGeneration(prev => prev + 1);
    renderCanvas();
  }, [T, noise, mutation, renderCanvas]);

  // Animation Loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(stepGeneration, 200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, stepGeneration]);

  // Click & Paint
  const paintCell = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
      gridRef.current[r][c] = activeBrush;
      renderCanvas();
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Strategy population counts
  const strategyCounts = Array(STRATEGIES.length).fill(0);
  gridRef.current.forEach(row => row.forEach(strat => {
    if (strat >= 0 && strat < strategyCounts.length) strategyCounts[strat]++;
  }));
  const totalCells = ROWS * COLS;

  return (
    <div id="visualizer-spatial-prisoner" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
            Spatial Reciprocity & Evolutionary Game Theory (Nowak & May)
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            Spatial Prisoner’s Dilemma & Trust Dynamics (Temptation T = {T})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Gen {generation}
          </span>
          <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold border ${
            strategyCounts[0] + strategyCounts[2] > strategyCounts[1]
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
          }`}>
            {Math.round(((strategyCounts[0] + strategyCounts[2]) / totalCells) * 100)}% Cooperation
          </span>
        </div>
      </div>

      {/* Main Grid & Strategy Population Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: 2D Spatial Matrix Canvas */}
        <div className="lg:col-span-8 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="relative rounded overflow-hidden border border-slate-800">
            <canvas
              ref={canvasRef}
              width={COLS * 14}
              height={ROWS * 14}
              className="w-full h-auto cursor-crosshair select-none block"
              onClick={paintCell}
              onMouseDown={() => { isMouseDownRef.current = true; }}
              onMouseUp={() => { isMouseDownRef.current = false; }}
              onMouseMove={(e) => { if (isMouseDownRef.current) paintCell(e); }}
            />
          </div>

          {/* Interactive Toolbar */}
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
                <span>{isRunning ? 'Pause' : 'Evolve'}</span>
              </button>

              <button
                onClick={stepGeneration}
                disabled={isRunning}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs border border-slate-700"
              >
                Step Gen
              </button>

              <button
                onClick={() => loadPreset('island')}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs border border-slate-700"
              >
                Cooperator Island
              </button>

              <button
                onClick={() => loadPreset('invasion')}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs border border-slate-700"
              >
                Defector Invasion
              </button>

              <button
                onClick={() => loadPreset('mixed')}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs border border-slate-700"
              >
                <Shuffle className="h-3.5 w-3.5 inline mr-1" />
                Random
              </button>
            </div>
          </div>
        </div>

        {/* Right: Strategy Palette & Census */}
        <div className="lg:col-span-4 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Strategy Census & Paint Tool
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Select a strategy to brush directly onto the spatial grid
            </p>
          </div>

          {/* Strategy List with census bars */}
          <div className="flex flex-col gap-2 my-3">
            {STRATEGIES.map((strat) => {
              const count = strategyCounts[strat.id] || 0;
              const pct = Math.round((count / totalCells) * 100);
              const isSelected = activeBrush === strat.id;

              return (
                <button
                  key={strat.id}
                  onClick={() => setActiveBrush(strat.id)}
                  className={`p-2 rounded border text-left transition-all ${
                    isSelected 
                      ? 'border-white bg-slate-800/80 ring-1 ring-white/50' 
                      : 'border-slate-800 bg-slate-900 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: strat.color }} />
                      <span className="font-semibold text-slate-200">{strat.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-300 font-bold">{pct}%</span>
                  </div>
                  {/* Share progress bar */}
                  <div className="w-full bg-slate-950 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: strat.color }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-900 pt-2 text-[10px] font-mono text-slate-400">
            <span>Payoffs: </span>
            <span className="text-slate-300">T={T} | R=1.0 | P=0.1 | S=0.0</span>
          </div>
        </div>
      </div>

      {/* Commentary */}
      <div className={`p-3.5 rounded-lg border text-xs flex gap-3 items-start transition-all ${
        T >= 1.85 
          ? 'bg-rose-950/40 border-rose-900/50 text-rose-100'
          : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-100'
      }`}>
        <div className={`p-1.5 rounded shrink-0 ${T >= 1.85 ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {T >= 1.85 ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            SPATIAL RECIPROCITY THEOREM REPORT
          </span>
          <p className="leading-relaxed mt-0.5 font-normal">
            {state.statusComment || 'Spatial reciprocity protects cooperators: cells interact locally with 8 neighbors, enabling cooperative clusters to out-earn defectors at boundaries.'}
          </p>
        </div>
      </div>
    </div>
  );
}
