/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Shuffle, MousePointer } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

const W = 100;
const H = 60;

export default function GrayScottVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const F = Number(controls.feedRate ?? 0.037);
  const K = Number(controls.killRate ?? 0.060);
  const diffRatio = Number(controls.diffusionRatio ?? 2.0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [activeSpotsCount, setActiveSpotsCount] = useState(24);
  const [simEpoch, setSimEpoch] = useState(0);

  // Chemical grids: U and V
  const uRef = useRef<Float32Array>(new Float32Array(W * H));
  const vRef = useRef<Float32Array>(new Float32Array(W * H));
  const nextURef = useRef<Float32Array>(new Float32Array(W * H));
  const nextVRef = useRef<Float32Array>(new Float32Array(W * H));
  const isMouseDownRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  // Initialize chemical fields
  const initFields = useCallback((presetPattern: 'mitosis' | 'spots' | 'coral' | 'spiral' | 'random' = 'mitosis') => {
    const u = uRef.current;
    const v = vRef.current;

    // Default: U = 1.0 everywhere, V = 0.0
    u.fill(1.0);
    v.fill(0.0);

    const seedRadius = 4;
    const addSeed = (cx: number, cy: number) => {
      for (let y = Math.max(0, cy - seedRadius); y <= Math.min(H - 1, cy + seedRadius); y++) {
        for (let x = Math.max(0, cx - seedRadius); x <= Math.min(W - 1, cx + seedRadius); x++) {
          if (Math.hypot(x - cx, y - cy) <= seedRadius) {
            const idx = y * W + x;
            u[idx] = 0.5 + (Math.random() - 0.5) * 0.1;
            v[idx] = 0.25 + (Math.random() - 0.5) * 0.1;
          }
        }
      }
    };

    if (presetPattern === 'mitosis') {
      // Few central seeds that grow and divide
      addSeed(Math.floor(W / 2), Math.floor(H / 2));
      addSeed(Math.floor(W / 2) - 15, Math.floor(H / 2));
      addSeed(Math.floor(W / 2) + 15, Math.floor(H / 2));
    } else if (presetPattern === 'spots') {
      for (let i = 0; i < 8; i++) {
        addSeed(Math.floor(15 + Math.random() * (W - 30)), Math.floor(10 + Math.random() * (H - 20)));
      }
    } else if (presetPattern === 'coral') {
      for (let x = 20; x < W - 20; x += 15) {
        for (let y = 15; y < H - 15; y += 15) {
          addSeed(x, y);
        }
      }
    } else {
      for (let i = 0; i < 12; i++) {
        addSeed(Math.floor(Math.random() * W), Math.floor(Math.random() * H));
      }
    }

    setSimEpoch(0);
    renderCanvas();
  }, []);

  useEffect(() => {
    initFields('mitosis');
  }, [initFields]);

  // Gray-Scott Reaction-Diffusion Simulation Step
  // Laplacian 5-point stencil with periodic wrapping
  const stepSimulation = useCallback(() => {
    const u = uRef.current;
    const v = vRef.current;
    const nextU = nextURef.current;
    const nextV = nextVRef.current;

    const Du = 0.20 * (diffRatio / 2.0);
    const Dv = 0.10;
    const dt = 1.0;

    let vConcentrationSum = 0;
    let highVCount = 0;

    // Perform 8 substeps per frame for smooth real-time evolution
    for (let iter = 0; iter < 8; iter++) {
      for (let y = 0; y < H; y++) {
        const yW = y * W;
        const yUpW = ((y - 1 + H) % H) * W;
        const yDownW = ((y + 1) % H) * W;

        for (let x = 0; x < W; x++) {
          const idx = yW + x;
          const leftIdx = yW + ((x - 1 + W) % W);
          const rightIdx = yW + ((x + 1) % W);
          const upIdx = yUpW + x;
          const downIdx = yDownW + x;

          const uVal = u[idx];
          const vVal = v[idx];

          // 5-point discrete Laplacian: L(C) = C_left + C_right + C_up + C_down - 4*C
          const lapU = u[leftIdx] + u[rightIdx] + u[upIdx] + u[downIdx] - 4 * uVal;
          const lapV = v[leftIdx] + v[rightIdx] + v[upIdx] + v[downIdx] - 4 * vVal;

          const uvv = uVal * vVal * vVal;

          // Reaction-Diffusion differential equations
          const du = Du * lapU - uvv + F * (1.0 - uVal);
          const dv = Dv * lapV + uvv - (F + K) * vVal;

          nextU[idx] = Math.max(0, Math.min(1.0, uVal + du * dt));
          nextV[idx] = Math.max(0, Math.min(1.0, vVal + dv * dt));

          if (iter === 7) {
            vConcentrationSum += nextV[idx];
            if (nextV[idx] > 0.25) highVCount++;
          }
        }
      }

      // Swap buffers
      u.set(nextU);
      v.set(nextV);
    }

    setActiveSpotsCount(Math.round(highVCount / 8));
    setSimEpoch(prev => prev + 1);
    renderCanvas();
  }, [F, K, diffRatio]);

  // Main animation loop
  useEffect(() => {
    const loop = () => {
      if (isRunning) {
        stepSimulation();
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, stepSimulation]);

  // Render to canvas
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(W, H);
    const data = imgData.data;
    const v = vRef.current;
    const u = uRef.current;

    for (let i = 0; i < W * H; i++) {
      const vVal = v[i];
      const uVal = u[i];
      const pIdx = i * 4;

      if (vVal < 0.05) {
        // Deep indigo / dark slate background
        data[pIdx] = 9;
        data[pIdx + 1] = 13;
        data[pIdx + 2] = 22;
        data[pIdx + 3] = 255;
      } else if (vVal < 0.25) {
        // Cyan / teal transition
        const t = (vVal - 0.05) / 0.20;
        data[pIdx] = Math.floor(16 + t * 40);
        data[pIdx + 1] = Math.floor(40 + t * 145);
        data[pIdx + 2] = Math.floor(120 + t * 120);
        data[pIdx + 3] = 255;
      } else if (vVal < 0.45) {
        // Lime emerald active boundary
        const t = (vVal - 0.25) / 0.20;
        data[pIdx] = Math.floor(56 + t * 150);
        data[pIdx + 1] = Math.floor(185 + t * 50);
        data[pIdx + 2] = Math.floor(240 - t * 140);
        data[pIdx + 3] = 255;
      } else {
        // Radiant amber / warm gold spot core
        const t = Math.min(1.0, (vVal - 0.45) / 0.35);
        data[pIdx] = Math.floor(206 + t * 49);
        data[pIdx + 1] = Math.floor(235 - t * 45);
        data[pIdx + 2] = Math.floor(100 - t * 80);
        data[pIdx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  // Click / drag to inject chemical V
  const injectChemical = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = Math.floor(((e.clientX - rect.left) / rect.width) * W);
    const cy = Math.floor(((e.clientY - rect.top) / rect.height) * H);

    const radius = 4;
    const u = uRef.current;
    const v = vRef.current;

    for (let y = Math.max(0, cy - radius); y <= Math.min(H - 1, cy + radius); y++) {
      for (let x = Math.max(0, cx - radius); x <= Math.min(W - 1, cx + radius); x++) {
        if (Math.hypot(x - cx, y - cy) <= radius) {
          const idx = y * W + x;
          u[idx] = 0.5;
          v[idx] = 0.65;
        }
      }
    }
    renderCanvas();
  };

  return (
    <div id="visualizer-gray-scott" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block font-semibold">
            Alan Turing Reaction-Diffusion Morphogenesis (Gray-Scott)
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            Self-Organizing Chemical Patterns (F = {F.toFixed(3)}, K = {K.toFixed(3)})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Epoch {simEpoch}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {activeSpotsCount} Active Morphogen Spots
          </span>
        </div>
      </div>

      {/* Screen Canvas */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full h-auto max-h-[380px] cursor-crosshair select-none block image-render-pixelated"
          style={{ imageRendering: 'pixelated' }}
          onClick={injectChemical}
          onMouseDown={() => { isMouseDownRef.current = true; }}
          onMouseUp={() => { isMouseDownRef.current = false; }}
          onMouseMove={(e) => { if (isMouseDownRef.current) injectChemical(e); }}
        />

        <div className="absolute top-2 left-2 pointer-events-none bg-slate-900/80 backdrop-blur-sm border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <MousePointer className="h-3 w-3 text-cyan-400" />
          <span>Click/Drag canvas to inject chemical V catalyst</span>
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
            <span>{isRunning ? 'Pause Reaction' : 'Run Reaction'}</span>
          </button>

          <button
            onClick={() => initFields('mitosis')}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 border border-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>

        {/* Pattern Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Morphology Presets:</span>
          <button
            onClick={() => initFields('mitosis')}
            className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px]"
          >
            Cell Mitosis
          </button>
          <button
            onClick={() => initFields('spots')}
            className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[11px]"
          >
            Leopard Spots
          </button>
          <button
            onClick={() => initFields('coral')}
            className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-slate-700 text-[11px]"
          >
            Coral Mazes
          </button>
          <button
            onClick={() => initFields('random')}
            className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px]"
          >
            <Shuffle className="h-3 w-3 inline mr-1" />
            Multi-Seed
          </button>
        </div>
      </div>

      {/* Commentary */}
      <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950 text-xs flex gap-3 items-start">
        <div className="p-1.5 rounded shrink-0 bg-cyan-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            TURING MORPHOGENESIS OBSERVATION
          </span>
          <p className="leading-relaxed mt-0.5 text-slate-300">
            {state.phaseNarrative || 'Reaction-diffusion differential equations running. Autocatalytic reaction between U and V produces spontaneous symmetry breaking and biological pigmentation patterns.'}
          </p>
        </div>
      </div>
    </div>
  );
}
