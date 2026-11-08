/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Users, CheckCircle2, AlertTriangle, Home } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

const COLS = 40;
const ROWS = 26;

// 0: Empty, 1: Red (Group A), 2: Blue (Group B)
export default function SchellingSegregationVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const threshold = Number(controls.similarityPreference ?? 35);
  const vacancyRate = Number(controls.vacancyRate ?? 15);
  const demographicSplit = Number(controls.demographicSplit ?? 50);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [unhappyCount, setUnhappyCount] = useState(0);
  const [segregationIndex, setSegregationIndex] = useState(45);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number; type: number; similarPct: number } | null>(null);

  const gridRef = useRef<number[][]>(createEmptyGrid());

  function createEmptyGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  // Populate grid based on controls
  const initGrid = useCallback(() => {
    const g = createEmptyGrid();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // Vacancy check
        if (Math.random() * 100 < vacancyRate) {
          g[r][c] = 0; // Empty
        } else {
          // Red vs Blue
          g[r][c] = (Math.random() * 100 < demographicSplit) ? 1 : 2;
        }
      }
    }
    gridRef.current = g;
    setRound(0);
    evaluateNeighborhoods(g);
  }, [vacancyRate, demographicSplit]);

  // Compute happiness & segregation metrics
  const evaluateNeighborhoods = useCallback((g: number[][]) => {
    let unhappy = 0;
    let totalAgents = 0;
    let sumSimilarPct = 0;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const type = g[r][c];
        if (type === 0) continue; // Empty
        totalAgents++;

        let same = 0;
        let neighbors = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
              const nType = g[nr][nc];
              if (nType !== 0) {
                neighbors++;
                if (nType === type) same++;
              }
            }
          }
        }

        const simPct = neighbors === 0 ? 100 : (same / neighbors) * 100;
        sumSimilarPct += simPct;

        if (simPct < threshold) {
          unhappy++;
        }
      }
    }

    setUnhappyCount(unhappy);
    const meanSeg = totalAgents === 0 ? 50 : Math.round(sumSimilarPct / totalAgents);
    setSegregationIndex(meanSeg);
    renderCanvas();
    return { unhappy, meanSeg };
  }, [threshold]);

  // Initial populate
  useEffect(() => {
    initGrid();
  }, [initGrid]);

  // Draw on canvas
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
        const type = g[r][c];
        const x = c * cellW;
        const y = r * cellH;

        if (type === 1) {
          ctx.fillStyle = '#f43f5e'; // Red
          ctx.beginPath();
          ctx.arc(x + cellW / 2, y + cellH / 2, Math.min(cellW, cellH) * 0.42, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 2) {
          ctx.fillStyle = '#38bdf8'; // Blue
          ctx.beginPath();
          ctx.arc(x + cellW / 2, y + cellH / 2, Math.min(cellW, cellH) * 0.42, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Vacant lot marker
          ctx.strokeStyle = '#1e293b';
          ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4);
        }
      }
    }

    // Highlight selected cell
    if (selectedCell) {
      const sx = selectedCell.c * cellW;
      const sy = selectedCell.r * cellH;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, cellW, cellH);
    }
  }, [selectedCell]);

  // Relocation round: move unhappy agents to vacant spots
  const relocateStep = useCallback(() => {
    const g = gridRef.current.map(row => [...row]);
    const emptySpots: [number, number][] = [];
    const unhappyAgents: { r: number; c: number; type: number }[] = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const type = g[r][c];
        if (type === 0) {
          emptySpots.push([r, c]);
        } else {
          let same = 0;
          let neighbors = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                const nType = g[nr][nc];
                if (nType !== 0) {
                  neighbors++;
                  if (nType === type) same++;
                }
              }
            }
          }
          const simPct = neighbors === 0 ? 100 : (same / neighbors) * 100;
          if (simPct < threshold) {
            unhappyAgents.push({ r, c, type });
          }
        }
      }
    }

    if (unhappyAgents.length === 0 || emptySpots.length === 0) {
      setIsRunning(false);
      return;
    }

    // Shuffle unhappy agents
    unhappyAgents.sort(() => Math.random() - 0.5);

    // Relocate up to 40 agents per step
    const moves = Math.min(45, unhappyAgents.length);
    for (let i = 0; i < moves; i++) {
      if (emptySpots.length === 0) break;
      const agent = unhappyAgents[i];
      const spotIdx = Math.floor(Math.random() * emptySpots.length);
      const [newR, newC] = emptySpots.splice(spotIdx, 1)[0];

      g[agent.r][agent.c] = 0; // Empty old spot
      g[newR][newC] = agent.type; // Move into new spot
      emptySpots.push([agent.r, agent.c]); // Old spot is now vacant
    }

    gridRef.current = g;
    setRound(prev => prev + 1);
    evaluateNeighborhoods(g);
  }, [threshold, evaluateNeighborhoods]);

  // Auto-run loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(relocateStep, 150);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, relocateStep]);

  // Inspect cell on click
  const handleInspect = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
      const type = gridRef.current[r][c];
      let same = 0;
      let neighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            const nType = gridRef.current[nr][nc];
            if (nType !== 0) {
              neighbors++;
              if (nType === type) same++;
            }
          }
        }
      }
      const simPct = neighbors === 0 ? 100 : Math.round((same / neighbors) * 100);
      setSelectedCell({ r, c, type, similarPct: simPct });
      renderCanvas();
    }
  };

  return (
    <div id="visualizer-schelling-segregation" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-rose-400 uppercase tracking-wider block font-semibold">
            Thomas Schelling Segregation Dynamics (Nobel Prize 2005)
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            Micro-Motives & Macro-Behavior: {threshold}% Preference → {segregationIndex}% Segregation
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Round {round}
          </span>
          <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold border ${
            unhappyCount === 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
          }`}>
            {unhappyCount === 0 ? 'Equilibrium Reached' : `${unhappyCount} Seeking Relocation`}
          </span>
        </div>
      </div>

      {/* Grid Canvas & Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Canvas Matrix */}
        <div className="lg:col-span-8 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="relative rounded overflow-hidden border border-slate-800">
            <canvas
              ref={canvasRef}
              width={COLS * 14}
              height={ROWS * 14}
              className="w-full h-auto cursor-pointer select-none block"
              onClick={handleInspect}
            />
          </div>

          {/* Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-900 pt-3 mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={unhappyCount === 0}
                className={`px-3 py-1.5 rounded font-medium text-xs flex items-center gap-1.5 transition-colors ${
                  isRunning 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white'
                }`}
              >
                {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isRunning ? 'Pause Sorting' : 'Auto-Relocate'}</span>
              </button>

              <button
                onClick={relocateStep}
                disabled={isRunning || unhappyCount === 0}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs border border-slate-700"
              >
                Step Relocate
              </button>

              <button
                onClick={initGrid}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
              >
                <Shuffle className="h-3.5 w-3.5 text-indigo-400" />
                <span>Shuffle / Reset</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>Group A</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                <span>Group B</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 border border-slate-600 inline-block" />
                <span>Vacant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Segregation Dial & Inspector */}
        <div className="lg:col-span-4 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Macro Segregation Meter
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Average % of same-group neighbors across all homes
            </p>
          </div>

          {/* Big Segregation Index Display */}
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center my-3">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Resulting Segregation Index</span>
            <span className={`text-4xl font-black block mt-1 ${
              segregationIndex >= 75 ? 'text-rose-400' : segregationIndex >= 60 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {segregationIndex}%
            </span>
            <span className="text-[10px] font-mono text-slate-500 block mt-1">
              Individual Preference: <strong className="text-slate-300 font-bold">{threshold}%</strong>
            </span>
          </div>

          {/* Cell Inspection Detail */}
          <div className="bg-slate-900 p-3 rounded border border-slate-850 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Resident Inspection Desk
            </span>
            {selectedCell ? (
              <div className="flex flex-col gap-1 text-[11px] font-mono">
                <div>Type: <strong className={selectedCell.type === 1 ? 'text-rose-400' : selectedCell.type === 2 ? 'text-sky-400' : 'text-slate-400'}>
                  {selectedCell.type === 1 ? 'Group A (Red)' : selectedCell.type === 2 ? 'Group B (Blue)' : 'Vacant House'}
                </strong></div>
                {selectedCell.type !== 0 && (
                  <>
                    <div>Same-Group Neighbors: <strong className="text-white">{selectedCell.similarPct}%</strong></div>
                    <div>Status: <span className={selectedCell.similarPct >= threshold ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {selectedCell.similarPct >= threshold ? '✓ Happy (Stays)' : '⚠️ Unhappy (Wants to Move)'}
                    </span></div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-[11px]">Click any house on the grid to inspect neighbor satisfaction.</p>
            )}
          </div>
        </div>
      </div>

      {/* Paradox Commentary */}
      <div className={`p-3.5 rounded-lg border text-xs flex gap-3 items-start transition-all ${
        segregationIndex >= 75 ? 'bg-rose-950/40 border-rose-900/50 text-rose-100' : 'bg-slate-950 border-slate-800 text-slate-300'
      }`}>
        <div className={`p-1.5 rounded shrink-0 ${segregationIndex >= 75 ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white'}`}>
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            THE SCHELLING TIPPING PARADOX
          </span>
          <p className="leading-relaxed mt-0.5 font-normal">
            {state.cascadeStatus || `With an individual preference of ${threshold}%, residents are happy even when in the minority. Yet uncoordinated relocations trigger threshold cascades, resulting in an extreme macro segregation of ${segregationIndex}%.`}
          </p>
        </div>
      </div>
    </div>
  );
}
