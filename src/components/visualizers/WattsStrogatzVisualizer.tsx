/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Share2, RotateCcw, Shuffle, Sparkles, Activity } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

interface Edge {
  u: number;
  v: number;
  isRewired: boolean;
}

export default function WattsStrogatzVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const p = Number(controls.rewiringProb ?? 0.05);
  const N = Number(controls.networkNodes ?? 36);
  const k = Number(controls.initialNeighbors ?? 4);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [pathDistances, setPathDistances] = useState<number[]>([]);
  const [meanPathLength, setMeanPathLength] = useState<number>(4.8);
  const [clusteringCoeff, setClusteringCoeff] = useState<number>(0.67);

  const W = 420;
  const H = 340;
  const radius = 135;
  const cx = W / 2;
  const cy = H / 2;

  // Build and rewire Watts-Strogatz network
  const buildNetwork = useCallback(() => {
    const rawEdges: { u: number; v: number; isRewired: boolean }[] = [];
    const adj = Array.from({ length: N }, () => new Set<number>());

    // 1. Regular ring lattice: connect each node to k/2 neighbors on each side
    const halfK = Math.floor(k / 2);
    for (let i = 0; i < N; i++) {
      for (let j = 1; j <= halfK; j++) {
        const neighbor = (i + j) % N;
        rawEdges.push({ u: i, v: neighbor, isRewired: false });
        adj[i].add(neighbor);
        adj[neighbor].add(i);
      }
    }

    // 2. Random rewiring with probability p
    for (let e = 0; e < rawEdges.length; e++) {
      if (Math.random() < p) {
        const edge = rawEdges[e];
        const oldTarget = edge.v;
        adj[edge.u].delete(oldTarget);
        adj[oldTarget].delete(edge.u);

        // Find new random target not equal to u and not already connected
        let newTarget = Math.floor(Math.random() * N);
        let attempts = 0;
        while ((newTarget === edge.u || adj[edge.u].has(newTarget)) && attempts < 100) {
          newTarget = Math.floor(Math.random() * N);
          attempts++;
        }

        edge.v = newTarget;
        edge.isRewired = true;
        adj[edge.u].add(newTarget);
        adj[newTarget].add(edge.u);
      }
    }

    setEdges(rawEdges);

    // 3. Compute Clustering Coefficient C
    let sumC = 0;
    for (let i = 0; i < N; i++) {
      const neighbors = Array.from(adj[i]);
      const deg = neighbors.length;
      if (deg < 2) {
        sumC += 0;
        continue;
      }
      let triangles = 0;
      for (let a = 0; a < deg; a++) {
        for (let b = a + 1; b < deg; b++) {
          if (adj[neighbors[a]].has(neighbors[b])) {
            triangles++;
          }
        }
      }
      const possible = (deg * (deg - 1)) / 2;
      sumC += triangles / possible;
    }
    const computedC = Math.round((sumC / N) * 100) / 100;
    setClusteringCoeff(computedC);

    // 4. Compute Average Path Length L (all-pairs BFS)
    let totalPathLength = 0;
    let pathCount = 0;
    for (let start = 0; start < N; start++) {
      const dist = Array(N).fill(-1);
      const queue = [start];
      dist[start] = 0;

      while (queue.length > 0) {
        const curr = queue.shift()!;
        adj[curr].forEach(nxt => {
          if (dist[nxt] === -1) {
            dist[nxt] = dist[curr] + 1;
            queue.push(nxt);
          }
        });
      }

      for (let target = 0; target < N; target++) {
        if (target !== start && dist[target] !== -1) {
          totalPathLength += dist[target];
          pathCount++;
        }
      }
    }
    const computedL = pathCount > 0 ? Math.round((totalPathLength / pathCount) * 10) / 10 : 1;
    setMeanPathLength(computedL);
  }, [p, N, k]);

  useEffect(() => {
    buildNetwork();
  }, [buildNetwork]);

  // Compute node positions on ring
  const getNodePos = (idx: number) => {
    const angle = (idx / N) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius
    };
  };

  // Draw ring on canvas
  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Edges
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const p1 = getNodePos(e.u);
      const p2 = getNodePos(e.v);

      if (e.isRewired) {
        // Radiant Rose / Amber for rewired small-world shortcuts!
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.2;
      } else {
        // Regular ring edge
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.45)';
        ctx.lineWidth = 1.0;
      }

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Draw Nodes
    for (let i = 0; i < N; i++) {
      const pos = getNodePos(i);
      const isHovered = hoveredNode === i;

      let fill = '#38bdf8';
      let nodeRadius = 5.5;

      if (isHovered) {
        fill = '#ffffff';
        nodeRadius = 8;
        // Ring glow
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawNetwork();
  }, [edges, hoveredNode]);

  const rewiredCount = edges.filter(e => e.isRewired).length;

  return (
    <div id="visualizer-watts-strogatz" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block font-semibold">
            Duncan Watts & Steven Strogatz Small-World Model (1998)
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            Lattice to Random Graph Rewiring (Rewiring Probability p = {p})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {rewiredCount} Shortcuts Rewired
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            L = {meanPathLength} hops | C = {clusteringCoeff}
          </span>
        </div>
      </div>

      {/* Main Grid: Circular Ring (Left) & Watts-Strogatz Phase Transition Curve (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Interactive Circular Lattice */}
        <div className="lg:col-span-7 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="relative w-full h-[320px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="w-full h-full cursor-pointer select-none"
              onMouseMove={(e) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                let hitNode: number | null = null;
                for (let i = 0; i < N; i++) {
                  const pos = getNodePos(i);
                  if (Math.hypot(pos.x - x, pos.y - y) < 14) {
                    hitNode = i;
                    break;
                  }
                }
                setHoveredNode(hitNode);
              }}
              onMouseLeave={() => setHoveredNode(null)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-900 pt-2.5 mt-1">
            <button
              onClick={buildNetwork}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs flex items-center gap-1.5 border border-slate-700"
            >
              <Shuffle className="h-3.5 w-3.5 text-indigo-400" />
              <span>Resample Rewiring</span>
            </button>

            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-600 inline-block" />
                <span>Regular Ring Lattice</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-500 inline-block" />
                <span>Small-World Shortcut</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: The Watts-Strogatz L(p) and C(p) Phase Transition Curve */}
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Watts-Strogatz Phase Transition Diagram
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Path Length L(p)/L(0) vs. Clustering Coefficient C(p)/C(0)
            </p>
          </div>

          {/* Theoretical Watts-Strogatz Normalized Curve SVG */}
          <div className="h-44 border-b border-l border-slate-800 p-2 my-2 relative">
            <svg className="w-full h-full" viewBox="0 0 240 120" preserveAspectRatio="none">
              {/* Golden Small-World Window highlight zone (log p between 0.01 and 0.1) */}
              <rect x="75" y="0" width="60" height="120" fill="rgba(99, 102, 241, 0.12)" />
              <text x="105" y="15" className="text-[8px] fill-indigo-300 font-mono font-bold" textAnchor="middle">
                Small-World Zone
              </text>

              {/* Curve 1: C(p)/C(0) stays high until p > 0.1, then collapses */}
              <path
                d="M 10 20 Q 80 20 120 30 T 180 85 Q 210 110 230 114"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />

              {/* Curve 2: L(p)/L(0) plummets exponentially with small p */}
              <path
                d="M 10 20 Q 40 25 80 80 T 130 110 L 230 114"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />

              {/* Current operating p point marker */}
              {(() => {
                // Map p logarithmically onto width 10 to 230
                const logP = p <= 0.001 ? 10 : Math.min(230, Math.max(10, 10 + (Math.log10(p) + 3) * 73));
                return (
                  <line x1={logP} y1="0" x2={logP} y2="120" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3" />
                );
              })()}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-2 right-2 flex flex-col gap-1 text-[9px] font-mono bg-slate-900/90 p-1.5 rounded border border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-0.5 bg-emerald-500 inline-block" />
                <span>C(p) Clustering</span>
              </div>
              <div className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2.5 h-0.5 bg-sky-400 inline-block" />
                <span>L(p) Path Length</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Regular Ring (p=0)</span>
            <span>Random Graph (p=1.0)</span>
          </div>

          <div className="border-t border-slate-900 pt-2 text-xs flex flex-col gap-1 font-mono">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Average Degrees of Separation:</span>
              <strong className="text-white">{meanPathLength} hops</strong>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Local Clustering Coefficient:</span>
              <strong className="text-emerald-400">{clusteringCoeff}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Commentary */}
      <div className={`p-3.5 rounded-lg border text-xs flex gap-3 items-start transition-all ${
        p >= 0.01 && p <= 0.15 ? 'bg-indigo-950/40 border-indigo-900/50 text-indigo-100' : 'bg-slate-950 border-slate-800 text-slate-300'
      }`}>
        <div className={`p-1.5 rounded shrink-0 ${p >= 0.01 && p <= 0.15 ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
          <Share2 className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            WATTS-STROGATZ REWIRING THEOREM
          </span>
          <p className="leading-relaxed mt-0.5 font-normal">
            {state.networkPhase || `Rewiring a tiny fraction of edges creates global shortcuts without destroying local communities. This produces the small-world effect (high clustering with short separation).`}
          </p>
        </div>
      </div>
    </div>
  );
}
