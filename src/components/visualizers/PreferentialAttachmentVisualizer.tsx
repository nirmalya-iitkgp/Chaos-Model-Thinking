/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Share2, Plus, Play, Pause, RotateCcw, Activity, ShieldAlert, Sparkles } from 'lucide-react';

interface VisualizerProps {
  state: Record<string, any>;
  activeStep: number;
  controls: Record<string, number | boolean>;
  history?: Record<string, any>[];
}

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  degree: number;
}

interface Edge {
  source: number;
  target: number;
}

export default function PreferentialAttachmentVisualizer({ state, activeStep, controls }: VisualizerProps) {
  const alpha = Number(controls.attachmentBias ?? 1.0);
  const m = Number(controls.edgesPerNode ?? 2);
  const initialSeed = Number(controls.initialSeedSize ?? 4);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isAutoGrowing, setIsAutoGrowing] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Initialize seed network
  const resetNetwork = useCallback(() => {
    const W = 460;
    const H = 340;
    const seedNodes: Node[] = [];
    const seedEdges: Edge[] = [];

    // Create fully connected clique of seed nodes in a circle
    const cx = W / 2;
    const cy = H / 2;
    const radius = 50;

    for (let i = 0; i < initialSeed; i++) {
      const angle = (i / initialSeed) * Math.PI * 2;
      seedNodes.push({
        id: i,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        degree: initialSeed - 1
      });
    }

    for (let i = 0; i < initialSeed; i++) {
      for (let j = i + 1; j < initialSeed; j++) {
        seedEdges.push({ source: i, target: j });
      }
    }

    nodesRef.current = seedNodes;
    edgesRef.current = seedEdges;
    setNodes([...seedNodes]);
    setEdges([...seedEdges]);
  }, [initialSeed]);

  // Reset when seed size or activeStep resets to 0
  useEffect(() => {
    resetNetwork();
  }, [resetNetwork]);

  // Add a single node using Barabási–Albert preferential attachment
  const addNode = useCallback(() => {
    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;
    if (currentNodes.length >= 100) return; // Prevent excessive lag

    const W = 460;
    const H = 340;
    const newNodeId = currentNodes.length;

    // Pick target nodes based on degree^alpha
    const weights = currentNodes.map(n => Math.pow(Math.max(1, n.degree), alpha));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    const chosenTargets = new Set<number>();
    const neededEdges = Math.min(m, currentNodes.length);

    // Roulette wheel selection
    let attempts = 0;
    while (chosenTargets.size < neededEdges && attempts < 100) {
      attempts++;
      let r = Math.random() * totalWeight;
      for (let i = 0; i < currentNodes.length; i++) {
        r -= weights[i];
        if (r <= 0) {
          chosenTargets.add(i);
          break;
        }
      }
    }

    // New node starting location near center with slight noise
    const angle = Math.random() * Math.PI * 2;
    const dist = 70 + Math.random() * 80;
    const newNode: Node = {
      id: newNodeId,
      x: W / 2 + Math.cos(angle) * dist,
      y: H / 2 + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      degree: chosenTargets.size
    };

    const newEdgesList: Edge[] = [];
    chosenTargets.forEach(targetId => {
      newEdgesList.push({ source: newNodeId, target: targetId });
      currentNodes[targetId].degree++;
    });

    const updatedNodes = [...currentNodes, newNode];
    const updatedEdges = [...currentEdges, ...newEdgesList];

    nodesRef.current = updatedNodes;
    edgesRef.current = updatedEdges;
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [alpha, m]);

  // Force-directed physics loop
  useEffect(() => {
    const W = 460;
    const H = 340;
    const kRepel = 2200;
    const kSpring = 0.04;
    const damping = 0.88;

    const updatePhysics = () => {
      const nList = nodesRef.current;
      const eList = edgesRef.current;

      // 1. Repulsion between all node pairs
      for (let i = 0; i < nList.length; i++) {
        for (let j = i + 1; j < nList.length; j++) {
          const dx = nList[j].x - nList[i].x;
          const dy = nList[j].y - nList[i].y;
          const distSq = dx * dx + dy * dy + 100;
          const dist = Math.sqrt(distSq);
          const force = kRepel / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          nList[i].vx -= fx;
          nList[i].vy -= fy;
          nList[j].vx += fx;
          nList[j].vy += fy;
        }
      }

      // 2. Spring attraction along edges
      for (let i = 0; i < eList.length; i++) {
        const edge = eList[i];
        const s = nList[edge.source];
        const t = nList[edge.target];
        if (!s || !t) continue;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = (dist - 65) * kSpring;
        const fx = (dx / (dist || 1)) * force;
        const fy = (dy / (dist || 1)) * force;
        s.vx += fx;
        s.vy += fy;
        t.vx -= fx;
        t.vy -= fy;
      }

      // 3. Center gravity & boundary dampening
      for (let i = 0; i < nList.length; i++) {
        const n = nList[i];
        n.vx += (W / 2 - n.x) * 0.008;
        n.vy += (H / 2 - n.y) * 0.008;

        n.vx *= damping;
        n.vy *= damping;

        n.x += n.vx;
        n.y += n.vy;

        // Boundaries
        n.x = Math.max(25, Math.min(W - 25, n.x));
        n.y = Math.max(25, Math.min(H - 25, n.y));
      }

      // Render to canvas
      drawCanvas();
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Draw network onto HTML5 Canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nList = nodesRef.current;
    const eList = edgesRef.current;

    // Draw Edges
    for (let i = 0; i < eList.length; i++) {
      const e = eList[i];
      const s = nList[e.source];
      const t = nList[e.target];
      if (!s || !t) continue;

      const isConnectedToHover = hoveredNodeId !== null && (e.source === hoveredNodeId || e.target === hoveredNodeId);
      ctx.strokeStyle = isConnectedToHover ? '#818cf8' : 'rgba(51, 65, 85, 0.45)';
      ctx.lineWidth = isConnectedToHover ? 2.5 : 1;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();
    }

    // Draw Nodes
    const maxDeg = Math.max(1, ...nList.map(n => n.degree));
    for (let i = 0; i < nList.length; i++) {
      const n = nList[i];
      const radius = Math.min(22, Math.max(4, 3.5 + Math.sqrt(n.degree) * 2.8));
      const isHovered = hoveredNodeId === n.id;

      // Color based on degree centrality
      const ratio = n.degree / maxDeg;
      let fill = '#38bdf8'; // Blue for ordinary
      if (ratio > 0.6) fill = '#f43f5e'; // Radiant Rose for superhubs
      else if (ratio > 0.3) fill = '#fbbf24'; // Amber for mid-hubs
      else if (ratio > 0.15) fill = '#818cf8'; // Indigo

      // Glow halo for top hubs
      if (ratio > 0.6 || isHovered) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius + 4, 0, Math.PI * 2);
        ctx.globalAlpha = 0.25;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isHovered ? '#ffffff' : '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label degree on larger nodes
      if (n.degree >= 4 || isHovered) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${n.degree}`, n.x, n.y);
      }
    }
  };

  // Auto-grow ticker
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoGrowing) {
      timer = setInterval(() => {
        addNode();
      }, 350);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoGrowing, addNode]);

  // Compute Degree Distribution for Histogram
  const degreeCounts: Record<number, number> = {};
  nodes.forEach(n => {
    degreeCounts[n.degree] = (degreeCounts[n.degree] || 0) + 1;
  });
  const maxDegreeFound = Math.max(1, ...nodes.map(n => n.degree));
  const histogramDegrees = Array.from({ length: Math.min(16, maxDegreeFound) }, (_, i) => i + 1);

  return (
    <div id="visualizer-preferential-attachment" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block font-semibold">
            Scale-Free Network Topology (Barabási–Albert)
          </span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">
            Rich-Get-Richer Preferential Attachment (α = {alpha})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {nodes.length} Nodes | {edges.length} Edges
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Max Degree: {maxDegreeFound} links
          </span>
        </div>
      </div>

      {/* Main Grid: Force Graph (Left) & Degree Distribution (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Canvas Graph */}
        <div className="lg:col-span-8 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between z-10 text-[10px] font-mono text-slate-400">
            <span>Force-Directed Spring Graph</span>
            <span>Hover to inspect node connections</span>
          </div>

          <div className="relative w-full h-[320px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={460}
              height={320}
              className="w-full h-full cursor-pointer select-none"
              onMouseMove={(e) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                const hit = nodesRef.current.find(n => {
                  const dx = n.x - x;
                  const dy = n.y - y;
                  return Math.sqrt(dx * dx + dy * dy) < 18;
                });
                setHoveredNodeId(hit ? hit.id : null);
              }}
              onMouseLeave={() => setHoveredNodeId(null)}
            />
          </div>

          {/* Graph Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-900 pt-2.5 mt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoGrowing(!isAutoGrowing)}
                className={`px-3 py-1.5 rounded font-medium text-xs flex items-center gap-1.5 transition-colors ${
                  isAutoGrowing 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isAutoGrowing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isAutoGrowing ? 'Pause Growth' : 'Auto-Grow'}</span>
              </button>

              <button
                onClick={addNode}
                disabled={isAutoGrowing || nodes.length >= 100}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs flex items-center gap-1 border border-slate-700"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-400" />
                <span>Add Node</span>
              </button>

              <button
                onClick={() => {
                  for (let i = 0; i < 5; i++) addNode();
                }}
                disabled={isAutoGrowing || nodes.length >= 95}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs flex items-center gap-1 border border-slate-700"
              >
                <span>+5</span>
              </button>

              <button
                onClick={resetNetwork}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                <span>Reset</span>
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-400">
              Capacity: <strong className="text-white">{nodes.length}/100</strong>
            </div>
          </div>
        </div>

        {/* Right: Power-Law Degree Distribution Histogram */}
        <div className="lg:col-span-4 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Degree Distribution P(k)
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              {alpha === 0 
                ? 'Gaussian Poisson: Bell curve around mean degree' 
                : alpha > 1.2
                ? 'Winner-Takes-All: Extreme star monopoly'
                : 'Power Law: P(k) ~ k⁻³ heavy tail (Scale-Free)'}
            </p>
          </div>

          {/* Histogram Bars */}
          <div className="h-44 flex items-end gap-1.5 border-b border-l border-slate-800 p-2 my-2 relative">
            {histogramDegrees.map((deg) => {
              const count = degreeCounts[deg] || 0;
              const maxCount = Math.max(1, ...Object.values(degreeCounts));
              const heightPct = Math.max(6, Math.min(100, (count / maxCount) * 100));

              let barColor = 'bg-sky-500';
              if (deg > 10) barColor = 'bg-rose-500';
              else if (deg > 5) barColor = 'bg-amber-500';

              return (
                <div key={deg} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-7 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[8px] font-mono pointer-events-none transition-opacity z-20">
                    k={deg}: {count}
                  </div>
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${barColor}`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[8px] font-mono text-slate-500 mt-1">{deg}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Link Degree (k)</span>
            <span>Frequency Count</span>
          </div>

          {/* Network Metrics Snapshot */}
          <div className="border-t border-slate-900 pt-2.5 mt-2 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-400">Hub Degree Dominance:</span>
              <span className="font-bold text-rose-400">{Math.round((maxDegreeFound / Math.max(1, edges.length)) * 100)}% of edges</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-400">Attachment Exponent:</span>
              <span className="font-bold text-indigo-400">α = {alpha}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regimes Commentary Banner */}
      <div className={`p-3.5 rounded-lg border text-xs flex gap-3 items-start transition-all ${
        alpha > 1.2
          ? 'bg-rose-950/40 border-rose-900/50 text-rose-100'
          : alpha === 0
          ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-100'
          : 'bg-indigo-950/30 border-indigo-900/40 text-indigo-100'
      }`}>
        <div className={`p-1.5 rounded shrink-0 ${
          alpha > 1.2 ? 'bg-rose-500 text-white' : alpha === 0 ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'
        }`}>
          {alpha > 1.2 ? <ShieldAlert className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            NETWORK TOPOLOGY REGIME DIAGNOSTIC
          </span>
          <p className="leading-relaxed mt-0.5 font-normal">
            {state.networkRegime || 'Scale-free network growing. Higher degree nodes attract links with probability proportional to degree.'}
          </p>
        </div>
      </div>
    </div>
  );
}
