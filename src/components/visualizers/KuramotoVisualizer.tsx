/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Sparkles, Activity, Radio } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

interface Oscillator {
  theta: number;
  omega: number; // natural frequency
}

export default function KuramotoVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const K = Number(controls.couplingStrength ?? 1.8);
  const sigma = Number(controls.frequencyVariance ?? 0.8);
  const N = Number(controls.oscillatorCount ?? 100);

  const canvasCircleRef = useRef<HTMLCanvasElement | null>(null);
  const canvasGridRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [orderParamR, setOrderParamR] = useState(0.12);

  const oscillatorsRef = useRef<Oscillator[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Initialize oscillators with Gaussian distributed natural frequencies
  const initOscillators = useCallback(() => {
    const list: Oscillator[] = [];
    for (let i = 0; i < N; i++) {
      // Box-Muller transform for Gaussian distribution with mean 1.5, std dev sigma
      const u1 = Math.max(1e-6, Math.random());
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const naturalFreq = 1.5 + z0 * sigma;

      list.push({
        theta: Math.random() * Math.PI * 2,
        omega: naturalFreq
      });
    }
    oscillatorsRef.current = list;
  }, [N, sigma]);

  useEffect(() => {
    initOscillators();
  }, [initOscillators]);

  // Main Kuramoto Differential Equation Integration (Runge-Kutta / Euler)
  useEffect(() => {
    const dt = 0.04;

    const updateOscillators = () => {
      if (!isRunning) {
        animFrameRef.current = requestAnimationFrame(updateOscillators);
        return;
      }

      const oscs = oscillatorsRef.current;
      const count = oscs.length;

      // 1. Calculate Kuramoto Order Parameter: r * exp(i * psi) = (1/N) * sum(exp(i * theta_j))
      let sumCos = 0;
      let sumSin = 0;
      for (let i = 0; i < count; i++) {
        sumCos += Math.cos(oscs[i].theta);
        sumSin += Math.sin(oscs[i].theta);
      }
      const meanCos = sumCos / count;
      const meanSin = sumSin / count;
      const r = Math.sqrt(meanCos * meanCos + meanSin * meanSin);
      const psi = Math.atan2(meanSin, meanCos);

      // 2. Update phase: d(theta_i)/dt = omega_i + K * r * sin(psi - theta_i)
      // (Exact Kuramoto mean-field equivalence, speeds calculation to O(N)!)
      for (let i = 0; i < count; i++) {
        const o = oscs[i];
        const dTheta = o.omega + K * r * Math.sin(psi - o.theta);
        o.theta = (o.theta + dTheta * dt) % (Math.PI * 2);
      }

      setOrderParamR(Math.round(r * 100) / 100);

      // Render both views
      drawCircleView(r, psi);
      drawGridView();

      animFrameRef.current = requestAnimationFrame(updateOscillators);
    };

    animFrameRef.current = requestAnimationFrame(updateOscillators);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, K]);

  // Draw Complex Unit Circle
  const drawCircleView = (r: number, psi: number) => {
    const canvas = canvasCircleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const radius = 95;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, W, H);

    // Unit circle boundary
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Center crosshair axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - radius - 10, cy);
    ctx.lineTo(cx + radius + 10, cy);
    ctx.moveTo(cx, cy - radius - 10);
    ctx.lineTo(cx, cy + radius + 10);
    ctx.stroke();

    // Draw individual oscillator phase dots on circle perimeter
    const oscs = oscillatorsRef.current;
    for (let i = 0; i < oscs.length; i++) {
      const o = oscs[i];
      const px = cx + Math.cos(o.theta) * radius;
      const py = cy + Math.sin(o.theta) * radius;

      // Color by relative phase
      const hue = ((o.theta / (Math.PI * 2)) * 360).toFixed(0);
      ctx.fillStyle = `hsl(${hue}, 85%, 60%)`;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Center Order Parameter Vector (r * exp(i * psi))
    const vecX = cx + Math.cos(psi) * (radius * r);
    const vecY = cy + Math.sin(psi) * (radius * r);

    // Vector line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(vecX, vecY);
    ctx.stroke();

    // Vector arrowhead
    ctx.fillStyle = r > 0.7 ? '#10b981' : '#f43f5e';
    ctx.beginPath();
    ctx.arc(vecX, vecY, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  // Draw Synchronized Blinking Grid (Firefly flashing array)
  const drawGridView = () => {
    const canvas = canvasGridRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, W, H);

    const oscs = oscillatorsRef.current;
    const cols = 10;
    const rows = Math.ceil(oscs.length / cols);
    const cellW = W / cols;
    const cellH = H / rows;

    for (let i = 0; i < oscs.length; i++) {
      const o = oscs[i];
      const r = Math.floor(i / cols);
      const c = i % cols;
      const x = c * cellW + cellW / 2;
      const y = r * cellH + cellH / 2;

      // Pulse brightness based on sine(theta)
      // Flash occurs when sin(theta) > 0.8
      const phaseSine = Math.sin(o.theta);
      const isFlashing = phaseSine > 0.75;

      if (isFlashing) {
        // Bright radiant flash halo
        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(x, y, 6.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const dimness = Math.max(0.1, (phaseSine + 1) / 4);
        ctx.fillStyle = `rgba(234, 179, 8, ${dimness})`;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  // Scramble phases with random noise
  const scramblePhases = () => {
    const oscs = oscillatorsRef.current;
    for (let i = 0; i < oscs.length; i++) {
      oscs[i].theta = Math.random() * Math.PI * 2;
    }
  };

  const Kc = 2 * sigma;
  const isSync = K >= Kc;

  return (
    <div id="visualizer-kuramoto" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block font-semibold">
            Yoshiki Kuramoto Coupled Non-Linear Oscillators (1975)
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            Spontaneous Order & Phase Synchronization (Coupling K = {K}, Critical Kc ≈ {Kc.toFixed(1)})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold border ${
            isSync ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
          }`}>
            Order Parameter r = {orderParamR} ({Math.round(orderParamR * 100)}% Coherence)
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {N} Oscillators
          </span>
        </div>
      </div>

      {/* Dual Screen Grid: Unit Circle (Left) & Firefly Flashing Array (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Complex Unit Circle */}
        <div className="lg:col-span-6 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-400 flex justify-between items-center mb-1">
            <span>Complex Phase Circle (r·e^(iψ))</span>
            <span>Arrow length = Order r</span>
          </div>

          <div className="relative w-full h-[260px] flex items-center justify-center">
            <canvas
              ref={canvasCircleRef}
              width={260}
              height={260}
              className="w-auto h-full select-none block"
            />
          </div>

          <div className="text-center text-[10px] font-mono text-slate-400 border-t border-slate-900 pt-2">
            Perimeter dots: individual phases θi | Center arrow: collective synchrony vector r
          </div>
        </div>

        {/* Right: Firefly Flashing Array */}
        <div className="lg:col-span-6 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-slate-400 flex justify-between items-center mb-1">
            <span>Biological Flashing Grid (Firefly Synchrony)</span>
            <span>Pulse on sin(θi) &gt; 0.75</span>
          </div>

          <div className="relative w-full h-[260px] flex items-center justify-center">
            <canvas
              ref={canvasGridRef}
              width={260}
              height={260}
              className="w-auto h-full select-none block rounded border border-slate-850"
            />
          </div>

          <div className="text-center text-[10px] font-mono text-slate-400 border-t border-slate-900 pt-2">
            When K &gt; Kc, out-of-sync blinking dots spontaneously lock into unified unison flashes!
          </div>
        </div>
      </div>

      {/* Toolbar & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-colors ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isRunning ? 'Pause Coupling' : 'Resume Coupling'}</span>
          </button>

          <button
            onClick={scramblePhases}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs flex items-center gap-1 border border-slate-700"
          >
            <Shuffle className="h-3.5 w-3.5 text-indigo-400" />
            <span>Scramble Phases (Perturb)</span>
          </button>

          <button
            onClick={initOscillators}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset Frequencies</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-400">
          K = <strong>{K}</strong> | Critical Kc = <strong>{Kc.toFixed(1)}</strong>
        </div>
      </div>

      {/* Commentary */}
      <div className={`p-3.5 rounded-lg border text-xs flex gap-3 items-start transition-all ${
        isSync ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-100' : 'bg-slate-950 border-slate-800 text-slate-300'
      }`}>
        <div className={`p-1.5 rounded shrink-0 ${isSync ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
          <Radio className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            KURAMOTO SPONTANEOUS SYNCHRONIZATION THEOREM
          </span>
          <p className="leading-relaxed mt-0.5 font-normal">
            {state.syncRegime || `Non-linear sine coupling pulls oscillators toward the mean phase. When K crosses the critical threshold Kc = 2σ, spontaneous order emerges, collapsing independent natural frequencies into lockstep coherence.`}
          </p>
        </div>
      </div>
    </div>
  );
}
