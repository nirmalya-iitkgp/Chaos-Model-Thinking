/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingDown, 
  TrendingUp,
  Leaf, 
  Zap, 
  Activity, 
  Share2, 
  Shield, 
  ShieldCheck, 
  Users, 
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  XCircle,
  Power,
  Flame,
  Thermometer,
  CloudAlert
} from 'lucide-react';
import ConwayLifeVisualizer from './visualizers/ConwayLifeVisualizer';
import PreferentialAttachmentVisualizer from './visualizers/PreferentialAttachmentVisualizer';
import SpatialPrisonerVisualizer from './visualizers/SpatialPrisonerVisualizer';
import SchellingSegregationVisualizer from './visualizers/SchellingSegregationVisualizer';
import BoidsFlockingVisualizer from './visualizers/BoidsFlockingVisualizer';
import ForestFireVisualizer from './visualizers/ForestFireVisualizer';
import SugarscapeVisualizer from './visualizers/SugarscapeVisualizer';
import GrayScottVisualizer from './visualizers/GrayScottVisualizer';
import SlimeMoldVisualizer from './visualizers/SlimeMoldVisualizer';
import AntColonyVisualizer from './visualizers/AntColonyVisualizer';
import WattsStrogatzVisualizer from './visualizers/WattsStrogatzVisualizer';
import KuramotoVisualizer from './visualizers/KuramotoVisualizer';

interface VisualizerProps {
  scenarioId: string;
  activeStep: number;
  state: Record<string, any>;
  controls: Record<string, number | boolean>;
  history: Record<string, any>[];
}

export default function Visualizer({ scenarioId, activeStep, state, controls, history }: VisualizerProps) {
  
  // Render different visualizer components depending on the selected scenario
  switch (scenarioId) {
    case 'gray-scott':
      return <GrayScottVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'slime-mold':
      return <SlimeMoldVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'ant-colony':
      return <AntColonyVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'watts-strogatz':
      return <WattsStrogatzVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'kuramoto-oscillators':
      return <KuramotoVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'conway-life':
      return <ConwayLifeVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'preferential-attachment':
      return <PreferentialAttachmentVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'spatial-prisoners-dilemma':
      return <SpatialPrisonerVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'schelling-segregation':
      return <SchellingSegregationVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'boids-flocking':
      return <BoidsFlockingVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'forest-fire-percolation':
      return <ForestFireVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'sugarscape':
      return <SugarscapeVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'market-panic':
      return <MarketPanicVisualizer state={state} history={history} activeStep={activeStep} controls={controls} />;
    case 'bullwhip-effect':
      return <BullwhipVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'climate-tipping':
      return <ClimateTippingVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'predator-prey':
      return <PredatorPreyVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'phantom-traffic':
      return <PhantomTrafficVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'power-grid':
      return <PowerGridVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'pandemic-outbreak':
      return <PandemicVisualizer state={state} history={history} activeStep={activeStep} controls={controls} />;
    case 'vaccination-threshold':
      return <VaccinationVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'fake-news':
      return <FakeNewsVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    case 'viral-tipping':
      return <ViralTippingVisualizer state={state} activeStep={activeStep} controls={controls} history={history} />;
    default:
      return (
        <div id="visualizer-fallback" className="h-80 bg-slate-100 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
          <p className="text-sm text-slate-500">Visualization canvas ready.</p>
        </div>
      );
  }
}

/* ============================================================================
   1. MARKET PANIC VISUALIZER
   ============================================================================ */
function MarketPanicVisualizer({ state, history, activeStep, controls }: any) {
  const isPanic = !!controls.startRumor;
  const policy = Number(controls.policyLever || 0);
  const sentiment = state.sentiment || 80;
  const qualitativeSentiment = state.qualitativeSentiment || 'Bullish';
  const marketIndex = state.marketIndex || 1000;
  
  // Hardcoded exact deterministic values for comparison
  const baselineValues = [1000, 1030, 1050, 1040, 1080, 1100];
  
  // Calculate coordinates for the player's active run line
  const activePoints = history.slice(0, activeStep + 1).map((h, idx) => {
    const x = 40 + (idx * (280 / 5));
    // map index (0 to 1600 pts) down to SVG height (220 to 40)
    const y = 220 - ((h.marketIndex - 0) * (180 / 1600));
    return `${x},${y}`;
  }).join(' ');

  // Calculate coordinates for the baseline no-rumor scenario
  const baselinePoints = baselineValues.slice(0, activeStep + 1).map((val, idx) => {
    const x = 40 + (idx * (280 / 5));
    const y = 220 - ((val - 0) * (180 / 1600));
    return `${x},${y}`;
  }).join(' ');

  // Compute sentiment needle rotation (-90 deg to +90 deg based on sentiment 0-100)
  const needleRotation = ((sentiment / 100) * 180) - 90;

  // Determine active trend line color
  // Green for high stability, amber if trading halts are active, rose if a collapse is occurring
  let strokeColor = '#10b981'; // green
  if (isPanic) {
    if (policy === 0) strokeColor = '#f43f5e'; // rose crash
    else if (policy === 1) strokeColor = '#fbbf24'; // amber halt
    else strokeColor = '#6366f1'; // indigo liquidity rescue
  }

  // Check if threshold crossed
  const isThresholdCrossed = isPanic && policy === 0 && activeStep >= 3;

  return (
    <div id="visualizer-market-panic" className="w-full bg-slate-900 text-white rounded-xl p-5 shadow-inner border border-slate-800 flex flex-col gap-5">
      
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block font-semibold">Regulator & Influencer Center</span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">Market Comparison & Divergence Desk</h3>
        </div>
        <div className="flex items-center gap-2">
          {isPanic ? (
            <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold animate-pulse ${
              policy === 0 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
              policy === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              {policy === 0 ? 'CRASH SEQUENCE ACTIVE' : 
               policy === 1 ? 'CIRCUIT BREAKERS ENGAGED' : 
               'EMERGENCY LIQUIDITY ACTIVE'}
            </span>
          ) : (
            <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              STABLE TRADING EQUILIBRIUM
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Needle Gauge / Meter */}
        <div className="lg:col-span-4 flex flex-col items-center justify-between bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Trader Sentiment Gauge</span>
            <p className="text-[11px] text-slate-500 mt-1">Reflects buyer trust and herding pressure</p>
          </div>

          <div className="relative w-40 h-24 flex items-center justify-center mt-3">
            <svg className="w-full h-full" viewBox="0 0 100 55">
              {/* Core Arc Background */}
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#27272a" strokeWidth="12" strokeLinecap="round" />
              
              {/* Segmented Sentiment Color Indicators */}
              {/* Fear segment */}
              <path d="M 10 50 A 40 40 0 0 1 36.6 25" fill="none" stroke="#f43f5e" strokeWidth="12" />
              {/* Neutral segment */}
              <path d="M 36.6 25 A 40 40 0 0 1 63.3 25" fill="none" stroke="#eab308" strokeWidth="12" />
              {/* Optimism segment */}
              <path d="M 63.3 25 A 40 40 0 0 1 90 50" fill="none" stroke="#10b981" strokeWidth="12" />

              {/* Indicator Needle */}
              <line 
                x1="50" y1="50" x2="50" y2="15" 
                className="origin-[50px_50px] transition-transform duration-700 ease-out" 
                style={{ transform: `rotate(${needleRotation}deg)` }}
                stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" 
              />
              {/* Cap */}
              <circle cx="50" cy="50" r="7" fill="#6366f1" stroke="#1e1b4b" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="mt-2">
            <span className={`text-lg font-black tracking-tight ${
              qualitativeSentiment === 'Bearish' ? 'text-rose-400' :
              qualitativeSentiment === 'Neutral' ? 'text-amber-400' :
              'text-emerald-400'
            }`}>
              {qualitativeSentiment}
            </span>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
              Confidence Index: <span className="font-bold text-slate-200">{sentiment}/100</span>
            </div>
          </div>
        </div>

        {/* Live Vector Line Chart */}
        <div className="lg:col-span-8 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block tracking-wider">Stock Index Divergence Plot</span>
              <p className="text-[11px] text-slate-500">Comparing active timeline vs. stable baseline</p>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: strokeColor }} />
                <span className="text-slate-350">Your Run</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed inline-block border-indigo-400" />
                <span className="text-slate-400">Baseline</span>
              </div>
            </div>
          </div>

          <div className="relative flex-1 min-h-[170px] mt-1">
            <svg className="w-full h-full min-h-[170px]" viewBox="0 0 350 250" preserveAspectRatio="none">
              {/* X and Y Axis helpers */}
              <line x1="40" y1="40" x2="330" y2="40" stroke="#1e293b" strokeDasharray="3" />
              {/* Panic selling threshold reference line at 800 pts (Y = 130) */}
              <line x1="40" y1="130" x2="330" y2="130" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="40" y1="220" x2="330" y2="220" stroke="#1e293b" />
              <line x1="40" y1="40" x2="40" y2="220" stroke="#334155" />

              {/* Axis labels */}
              <text x="5" y="45" className="text-[9px] fill-slate-500 font-mono">1600 pts</text>
              <text x="5" y="134" className="text-[9px] fill-rose-500 font-mono font-bold">800 pts</text>
              <text x="5" y="225" className="text-[9px] fill-slate-550 font-mono">0 pts</text>

              {/* Threshold warning description text */}
              <text x="325" y="125" className="text-[8px] fill-rose-400 font-mono font-semibold" textAnchor="end">
                Panic Trigger Boundary (800)
              </text>

              {/* Point X labels */}
              {history.map((_, i) => (
                <text key={i} x={40 + (i * 58)} y="238" className="text-[8px] fill-slate-400 font-mono text-center" textAnchor="middle">
                  Period {i}
                </text>
              ))}

              {/* Curve 1: Baseline No-Rumor Scenario (Dashed soft lines) */}
              {baselinePoints && (
                <polyline
                  fill="none"
                  stroke="#818cf8"
                  strokeOpacity="0.45"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  points={baselinePoints}
                  strokeLinecap="round"
                />
              )}

              {/* Curve 2: Player's Active Run Line (Bold interactive curves) */}
              {activePoints && (
                <polyline
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="3.5"
                  points={activePoints}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              )}

              {/* Active dots markers */}
              {history.map((h, idx) => {
                const cx = 40 + (idx * 58);
                const cy = 220 - ((h.marketIndex - 0) * (180 / 1600));
                
                // If it is the bifurcation point (Period 3 under Rumor & Policy 0), draw a larger ripple
                const isBifurcationPt = isPanic && policy === 0 && idx === 3;

                return (
                  <g key={`act-${idx}`}>
                    {isBifurcationPt && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="10"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isBifurcationPt ? "6.5" : "5.5"}
                      fill={isBifurcationPt ? "#ef4444" : "#ffffff"}
                      stroke={isBifurcationPt ? "#1e1b4b" : strokeColor}
                      strokeWidth="2.5"
                    />
                  </g>
                );
              })}

              {/* Baseline reference dots markers */}
              {baselineValues.slice(0, activeStep + 1).map((val, idx) => {
                const cx = 40 + (idx * 58);
                const cy = 220 - ((val - 0) * (180 / 1600));
                return (
                  <circle
                    key={`base-${idx}`}
                    cx={cx}
                    cy={cy}
                    r="3.5"
                    fill="#312e81"
                    stroke="#818cf8"
                    strokeWidth="1.5"
                    opacity="0.75"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-900 pt-2.5 mt-2 text-slate-400">
            <span>Active Path Index: <strong className="text-white font-bold">{marketIndex} pts</strong></span>
            <span>Divergence: <strong className={`font-mono font-bold ${marketIndex < baselineValues[activeStep] ? 'text-rose-400' : marketIndex > baselineValues[activeStep] ? 'text-emerald-400' : 'text-slate-200'}`}>
              {marketIndex - baselineValues[activeStep] > 0 ? '+' : ''}{marketIndex - baselineValues[activeStep]} pts
            </strong></span>
          </div>
        </div>
      </div>

      {/* REGIME STATUS & REAL TIME COMMENTARY BANNER */}
      <div className={`p-3.5 rounded-lg border text-xs flex gap-3 items-start transition-all duration-300 ${
        isThresholdCrossed 
          ? 'bg-rose-950/40 border-rose-900/50 text-rose-100'
          : isPanic && policy === 1
          ? 'bg-amber-950/40 border-amber-900/50 text-amber-100'
          : 'bg-slate-950 border-slate-800 text-slate-300'
      }`}>
        <div className={`p-1.5 rounded shrink-0 ${
          isThresholdCrossed 
            ? 'bg-rose-500 text-white animate-pulse'
            : isPanic && policy === 1
            ? 'bg-amber-500 text-white'
            : 'bg-indigo-500 text-white'
        }`}>
          {isThresholdCrossed ? (
            <Flame className="h-4 w-4" />
          ) : (
            <TrendingUp className="h-4 w-4" />
          )}
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            {isThresholdCrossed ? 'SYSTEMIC COLLAPSE REGIME DETERMINED' : 'REAL-TIME CHRONICLE'}
          </span>
          <p className="leading-relaxed mt-0.5 font-normal">{state.newsSummary}</p>
          {isThresholdCrossed && (
            <span className="text-[10px] text-rose-300 font-bold block mt-1 font-mono">
              ⚠️ BIFURCATION TRIGGERED: The index fell below the 800-point safety boundary, forcing automated program selling into permanent feedback cascade.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   2. SUPPLY CHAIN BULLWHIP VISUALIZER
   ============================================================================ */
function BullwhipVisualizer({ state, activeStep, controls, history = [] }: any) {
  const demandIncrease = Number(controls.demandIncrease);
  const infoSharing = !!controls.infoSharing;

  // Collect historical sequence for all tiers to draw the time-series plot
  const activeHistory = history.slice(0, activeStep + 1);

  // Math: Compute exact statistical variance of past steps for each log tier
  const getVariance = (values: number[]) => {
    if (values.length <= 1) return 0;
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const sumSqDiff = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0);
    return Math.round((sumSqDiff / values.length) * 10) / 10;
  };

  const consumerSeries = activeHistory.map(h => h.consumerSales || 100);
  const retailerSeries = activeHistory.map(h => h.retailerOrders || 100);
  const wholesalerSeries = activeHistory.map(h => h.wholesalerOrders || 100);
  const distributorSeries = activeHistory.map(h => h.distributorOrders || 100);
  const factorySeries = activeHistory.map(h => h.factoryProduction || 100);

  const vConsumer = getVariance(consumerSeries);
  const vRetailer = getVariance(retailerSeries);
  const vWholesaler = getVariance(wholesalerSeries);
  const vDistributor = getVariance(distributorSeries);
  const vFactory = getVariance(factorySeries);

  // Computes relative amplifications ratios (variance division)
  const ampRetailer = vConsumer === 0 ? 0 : Number((vRetailer / vConsumer).toFixed(1));
  const ampWholesaler = vRetailer === 0 ? 0 : Number((vWholesaler / vRetailer).toFixed(1));
  const ampDistributor = vWholesaler === 0 ? 0 : Number((vDistributor / vWholesaler).toFixed(1));
  const ampFactory = vDistributor === 0 ? 0 : Number((vFactory / vDistributor).toFixed(1));

  // Node tiers structure for live visual order columns
  const tiers = [
    { key: 'consumerSales', name: 'Consumer', value: state.consumerSales, color: '#71717a', bg: 'bg-zinc-650', border: 'border-zinc-500' },
    { key: 'retailerOrders', name: 'Retailer', value: state.retailerOrders, color: '#10b981', bg: 'bg-emerald-600', border: 'border-emerald-500' },
    { key: 'wholesalerOrders', name: 'Wholesaler', value: state.wholesalerOrders, color: '#6366f1', bg: 'bg-indigo-600', border: 'border-indigo-500' },
    { key: 'distributorOrders', name: 'Distributor', value: state.distributorOrders, color: '#f59e0b', bg: 'bg-amber-600', border: 'border-amber-500' },
    { key: 'factoryProduction', name: 'Factory/Mfg', value: state.factoryProduction, color: '#f43f5e', bg: 'bg-rose-600', border: 'border-rose-500' }
  ];

  // Map inventory statuses for each active physical node:
  const inventories = [
    { label: 'Retailer Stock', value: state.retailerInventory || 50 },
    { label: 'Wholesale Stock', value: state.wholesalerInventory || 50 },
    { label: 'Distributor Stock', value: state.distributorInventory || 50 },
    { label: 'Factory Stock', value: state.factoryInventory || 50 }
  ];

  // Helper macro coordinate generation for order line plots
  // Dimensions of SVG: Width 350, Height 150
  // X axis spreads 7 slots mapping i = 0..6: 40 + i * (285 / 6)
  // Y axis scale: 0 to 220 units mapped to Height 135 (for 0) down to 25 (for 220)
  const generateLinePoints = (series: number[]) => {
    return series.map((val, idx) => {
      const x = 38 + (idx * (285 / 6));
      const y = 135 - ((val - 0) * (110 / 220));
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div id="visualizer-bullwhip" className="w-full bg-slate-900 border border-slate-805 text-white rounded-xl p-5 shadow-inner flex flex-col gap-6">
      
      {/* WINDOW TITLE BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block font-semibold">Demand Transmission Monitor</span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">Unified Supply Pipeline Diagnostics</h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono">
          {infoSharing ? (
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ✓ COLLABORATIVE DATA IN SYNC
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
              ⚠️ SPECULATIVE BUFFERING LAGS
            </span>
          )}
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN: VISUAL ORDERS OSCILLATION CHART */}
        <div className="lg:col-span-6 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Time-Series Order Oscillations</span>
            <p className="text-[11px] text-zinc-550 mt-1">Sensing pipeline amplitude swings across periods</p>
          </div>

          {/* SVG COMPACT CHART */}
          <div className="relative flex-1 min-h-[160px] my-3">
            <svg className="w-full h-full min-h-[160px]" viewBox="0 0 350 160" preserveAspectRatio="none">
              {/* Guides */}
              <line x1="35" y1="25" x2="330" y2="25" stroke="#101827" strokeDasharray="2" />
              <line x1="35" y1="80" x2="330" y2="80" stroke="#101827" strokeDasharray="3" strokeWidth="0.5" />
              <line x1="35" y1="135" x2="330" y2="135" stroke="#1e293b" />
              <line x1="35" y1="25" x2="35" y2="135" stroke="#1e293b" />

              {/* Y coordinates helpers */}
              <text x="5" y="29" className="text-[8px] fill-slate-500 font-mono">220 U</text>
              <text x="5" y="83" className="text-[8px] fill-slate-500 font-mono">110 U</text>
              <text x="5" y="138" className="text-[8px] fill-slate-500 font-mono">0 U</text>

              {/* X coordinate period labels */}
              {Array.from({ length: 7 }).map((_, idx) => (
                <text key={idx} x={38 + (idx * (285 / 6))} y="152" className="text-[8px] fill-slate-400 font-mono text-center" textAnchor="middle">
                  P{idx}
                </text>
              ))}

              {/* Line 1: Consumer Demand */}
              {consumerSeries.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#71717a"
                  strokeWidth="2"
                  points={generateLinePoints(consumerSeries)}
                  strokeLinecap="round"
                />
              )}

              {/* Line 2: Retailer Orders */}
              {retailerSeries.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  points={generateLinePoints(retailerSeries)}
                  strokeLinecap="round"
                />
              )}

              {/* Line 3: Wholesaler Orders */}
              {wholesalerSeries.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  points={generateLinePoints(wholesalerSeries)}
                  strokeLinecap="round"
                />
              )}

              {/* Line 4: Distributor Orders */}
              {distributorSeries.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  points={generateLinePoints(distributorSeries)}
                  strokeLinecap="round"
                />
              )}

              {/* Line 5: Factory Production */}
              {factorySeries.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3.5"
                  points={generateLinePoints(factorySeries)}
                  strokeLinecap="round"
                />
              )}

              {/* Visual circles markers on active positions */}
              {tiers.map((tier) => {
                const val = state[tier.key] || 100;
                const x = 38 + (activeStep * (285 / 6));
                const y = 135 - ((val - 0) * (110 / 220));
                return (
                  <circle
                    key={`m-${tier.key}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={tier.color}
                    stroke="#020617"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>

          {/* VARIANCE STATS TABLE */}
          <div className="border-t border-slate-900 pt-2 flex flex-col gap-1 text-[10px] font-mono">
            <span className="text-slate-400 font-semibold text-[9px] uppercase tracking-wider block mb-1">Statistical Variance & Speculation Amplification:</span>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-zinc-400 font-semibold">Consumer</span>
                <span className="block font-bold text-white mt-0.5">{vConsumer}</span>
                <span className="block text-[8px] text-zinc-500 mt-0.5">Baseline</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-emerald-400 font-semibold">Retail</span>
                <span className="block font-bold text-white mt-0.5">{vRetailer}</span>
                <span className="block text-[8px] text-emerald-500 font-bold mt-0.5">
                  {ampRetailer > 1 ? `x${ampRetailer} amp` : 'Smooth'}
                </span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-indigo-400 font-semibold">Wholesale</span>
                <span className="block font-bold text-white mt-0.5">{vWholesaler}</span>
                <span className="block text-[8px] text-indigo-500 font-bold mt-0.5">
                  {ampWholesaler > 1 ? `x${ampWholesaler} amp` : 'Smooth'}
                </span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-amber-400 font-semibold">Distrib</span>
                <span className="block font-bold text-white mt-0.5">{vDistributor}</span>
                <span className="block text-[8px] text-amber-500 font-bold mt-0.5">
                  {ampDistributor > 1 ? `x${ampDistributor} amp` : 'Smooth'}
                </span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-rose-400 font-semibold">Factory</span>
                <span className="block font-bold text-white mt-0.5">{vFactory}</span>
                <span className="block text-[8px] text-rose-500 font-bold mt-0.5">
                  {ampFactory > 1 ? `x${ampFactory} amp` : 'Smooth'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: NODES AND INVENTORIES */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          
          {/* ORDERS BAR METER */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Active Order Profiles (Current Step)</span>
            <div className="grid grid-cols-5 gap-2 items-end h-32 relative pt-2">
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 border-t border-dashed border-slate-800" />
              
              {tiers.map((tier, i) => {
                const barHeight = Math.max(12, Math.min(100, (tier.value / 220) * 100));
                return (
                  <div key={tier.name} className="flex flex-col items-center justify-end h-full z-10">
                    <div 
                      className={`w-full rounded-t shadow-sm flex flex-col items-center justify-center transition-all duration-350 ${tier.bg} ${tier.border}`}
                      style={{ height: `${barHeight}%` }}
                    >
                      <span className="text-[9px] font-black leading-none">{tier.value}</span>
                    </div>
                    <div className="text-[8px] text-slate-400 font-mono mt-1 text-center truncate w-full">
                      {tier.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* INVENTORIES STATE SECTION */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Warehouse Inventory Buffer Stock</span>
            <div className="flex flex-col gap-2.5">
              {inventories.map((inv) => {
                const val = inv.value;
                const percent = Math.min(100, Math.max(0, (val / 100) * 100));
                
                // Determine buffer stock state
                let statusColor = 'text-emerald-400';
                let indicatorColor = 'bg-emerald-500';
                let statusLabel = 'Optimal';
                
                if (val < 40) {
                  statusColor = 'text-rose-400';
                  indicatorColor = 'bg-rose-500';
                  statusLabel = 'Backlog Risk';
                } else if (val > 55) {
                  statusColor = 'text-amber-400';
                  indicatorColor = 'bg-amber-500';
                  statusLabel = 'Surplus Saturated';
                }

                if (infoSharing) {
                  statusColor = 'text-emerald-400';
                  indicatorColor = 'bg-emerald-500';
                  statusLabel = 'Perfect Flow';
                }

                return (
                  <div key={inv.label} className="text-xs">
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-300">
                      <span>{inv.label}: <strong className="text-white text-xs">{val} units</strong></span>
                      <span className={`font-semibold shrink-0 ${statusColor}`}>{statusLabel}</span>
                    </div>
                    
                    {/* Meter bar */}
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full transition-all duration-350 ${indicatorColor}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER DIALOG LOGS */}
      <div className={`p-4 rounded-lg border text-xs flex gap-3 items-start transition-all duration-300 ${
        !infoSharing && Math.abs(demandIncrease) >= 5 && activeStep >= 4
          ? 'bg-rose-950/40 border-rose-905/50 text-rose-100'
          : infoSharing
          ? 'bg-emerald-950/20 border-emerald-905/30 text-emerald-100'
          : 'bg-slate-950 border-slate-800 text-slate-300'
      }`}>
        <div className={`p-1.5 rounded shrink-0 ${
          !infoSharing && Math.abs(demandIncrease) >= 5 && activeStep >= 4
            ? 'bg-rose-500 text-white animate-pulse'
            : infoSharing
            ? 'bg-emerald-500 text-white'
            : 'bg-indigo-500 text-white'
        }`}>
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">
            {!infoSharing && Math.abs(demandIncrease) >= 5 && activeStep >= 4
              ? 'CHAOS OVERREACTION MODE ACTIVE' 
              : 'REAL-TIME PIPELINE COMMENTARY'}
          </span>
          <p className="leading-relaxed mt-0.5 font-normal">{state.commentary}</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   3. CLIMATE TIPPING POINT VISUALIZER
   ============================================================================ */
function ClimateTippingVisualizer({ state, activeStep, controls, history = [] }: any) {
  const albedo = state.albedo || 30; // 0 to 30 %
  const methane = state.methane || 0; // 0 Gt and up
  const temperature = state.temperature || 1.1;
  const tippingState = state.tippingState || 'Stable';
  const emissionsRate = Number(controls.emissionsRate);

  const isTipped = tippingState === 'Breached';

  // Hardcoded safe target path for comparison (+1.7C goal)
  const baselineValues = [1.1, 1.3, 1.45, 1.55, 1.62, 1.68];

  // Dynamic values of active session history
  const activeHistory = history.slice(0, activeStep + 1);
  const activeTemps = activeHistory.map(h => h.temperature || 1.1);

  // Math mapping for temperature time-series SVG (W:350, H:160)
  // X: 40 + (idx * 56) (for decade 0..5)
  // Y: 135 - (temp - 1.0) * 35 (safe clamp)
  const generateTempPoints = (temps: number[]) => {
    return temps.map((val, idx) => {
      const x = 38 + (idx * (285 / 5));
      const y = 140 - Math.min(110, Math.max(0, (val - 1.0) * 35));
      return `${x},${y}`;
    }).join(' ');
  };

  const activePoints = generateTempPoints(activeTemps);
  const baselinePoints = generateTempPoints(baselineValues.slice(0, activeStep + 1));

  // Glacier width and ocean height calculations based on albedo
  const iceWidthPct = Math.round((albedo / 30) * 115);
  // As albedo collapses, sea levels expand representing glacier melt & thermal expansion
  const seaWaterHeight = Math.min(90, Math.max(15, Math.round(15 + (30 - albedo) * 2.2)));

  // Generate dynamic warning based on temperature proximity to tipping
  let promptWarning = 'Feedback mechanisms are stable. Carbon sinks keeping pace.';
  let promptStatusHeader = 'STABLE GEOSPHERE STATUS';
  let bannerBgColor = 'bg-slate-950 border-slate-800 text-slate-300';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-505/30';

  if (isTipped) {
    promptWarning = '⚠️ CRITICAL BREAKAWAY: Hysteresis loop locked! Polar ice melt and permafrost methane have entered self-fueling acceleration. Cutting emissions now will not reverse this runaway warming.';
    promptStatusHeader = 'RUNAWAY CASCADE ENGAGED';
    bannerBgColor = 'bg-rose-950/40 border-rose-900/50 text-rose-100';
    badgeColor = 'bg-rose-500 text-white animate-pulse';
  } else if (temperature >= 1.5) {
    promptWarning = '🚨 DANGER ZONE: Average temperature reached +1.5°C. Ice sheets are thinning critically. A further 0.2°C warming will trigger the irreversible Arctic collapse tipping point!';
    promptStatusHeader = 'CRITICAL THERMAL THREAT';
    bannerBgColor = 'bg-amber-950/40 border-amber-900/50 text-amber-100';
    badgeColor = 'bg-amber-500 text-slate-950 font-bold animate-bounce';
  } else if (temperature >= 1.3) {
    promptWarning = 'Moderate thinning observed in polar regions. Lower ice reflection is slowly magnifying thermal solar retention.';
    promptStatusHeader = 'ICE ALBEDO WEAKENING';
    badgeColor = 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
  }

  // Dynamic methane bubble coordinate array
  const tempMethaneMultiplier = Math.min(45, Math.round(methane / 4));
  const bubbles = Array.from({ length: tempMethaneMultiplier }).map((_, i) => ({
    x: 155 + (i * 77) % 170,
    y: 130 - (i * 23) % 85,
    r: 2 + (i % 3)
  }));

  // Render sky color background reflecting temperature severity
  let skyBg = 'bg-slate-950 border-slate-800';
  if (temperature >= 2.5) {
    skyBg = 'bg-stone-950 border-stone-800';
  } else if (temperature >= 1.7) {
    skyBg = 'bg-zinc-950 border-zinc-800';
  }

  return (
    <div id="visualizer-climate" className="w-full bg-slate-900 border border-slate-805 text-white rounded-xl p-5 shadow-inner flex flex-col gap-6">
      
      {/* HEADER DIAGNOSTIC PANEL */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-slate-400 block font-medium">Decadal Biosphere Lab</span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">Global Hysteresis & Feedback Analysis</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold border ${badgeColor}`}>
            {promptStatusHeader}
          </span>
        </div>
      </div>

      {/* CORE GRAPHIC SIMULATOR LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COMPARTMENT: PHYSICAL ARCTIC CROSS-SECTION */}
        <div className={`lg:col-span-6 ${skyBg} p-4 rounded-lg border flex flex-col justify-between h-72 relative overflow-hidden transition-all duration-300`}>
          
          <div className="flex items-center justify-between z-20 pointer-events-none">
            <span className="text-xs font-mono text-zinc-400">Cryological profile</span>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">Polar Albedo: <strong className="text-cyan-400 font-bold">{albedo}%</strong></span>
              <span className="text-[10px] font-mono text-slate-400 block">permafrost gas: <strong className="text-orange-400 font-bold">{methane} Gt</strong></span>
            </div>
          </div>

          {/* DYNAMIC SVG ECOSYSTEM */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 350 200" preserveAspectRatio="none">
              
              {/* Sky Heat Radiation Overlay */}
              <rect x="0" y="0" width="350" height="200" fill={isTipped ? "url(#redRadiance)" : "url(#blueRadiance)"} opacity="0.3" />

              {/* Ocean Layer (grows as glacier melts) */}
              <rect 
                x="0" 
                y={200 - seaWaterHeight} 
                width="350" 
                height={seaWaterHeight} 
                fill={isTipped ? "#7f2d1d" : "#0f172a"} 
                className="transition-all duration-500" 
                opacity="0.85"
                stroke={isTipped ? "#f43f5e" : "#38bdf8"}
                strokeWidth="1"
              />

              {/* Glacier Shell - SVG ice polygon */}
              {albedo > 5 && (
                <polygon 
                  points={`0,200 0,60 ${iceWidthPct + 15},200`} 
                  fill={isTipped ? "#cbd5e1" : "#f1f5f9"} 
                  stroke={isTipped ? "#94a3b8" : "#93c5fd"} 
                  strokeWidth="2.5" 
                  className="transition-all duration-500"
                  opacity="0.9"
                />
              )}

              {/* Subterranean feedback floor (Permafrost) */}
              <rect x="150" y="192" width="200" height="8" fill="#451a03" />

              {/* Rising Permafrost bubble tracks */}
              {bubbles.map((b, i) => (
                <g key={`bubble-${i}`}>
                  <circle 
                    cx={b.x} 
                    cy={b.y} 
                    r={b.r} 
                    fill="#fbbf24" 
                    opacity="0.75"
                    className="animate-pulse" 
                  />
                </g>
              ))}

              {/* Gradients declarations */}
              <defs>
                <linearGradient id="blueRadiance" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="redRadiance" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#7f2d1d" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Ice sheet identifier floating tags */}
          <div className="z-10 flex justify-between items-end mt-auto pointer-events-none">
            <div className="bg-slate-950/85 border border-slate-800 rounded px-2 py-1 text-[9px] font-mono inline-block">
              <span className="text-slate-300 font-bold block">
                {albedo > 15 ? '❄️ GLACIAL BULWARK' : '⚠️ COLLAPSED SHELF'}
              </span>
              <span className="text-[8px] text-slate-400">Reflective Buffer</span>
            </div>

            {methane > 15 && (
              <div className="bg-amber-950/85 border border-amber-900/40 rounded px-2 py-1 text-[9px] font-mono text-amber-300 animate-pulse">
                <span>🔥 METHANE FLUX SEEPING</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COMPARTMENT: CO2 & THERMAL PROGRESS GAUGE */}
        <div className="lg:col-span-6 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Decadal Thermal Diagnostics</span>
            <p className="text-[11px] text-slate-500 mt-1">Measuring systemic greenhouse load & atmospheric friction</p>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center my-3 relative">
            
            {/* Thermometer scale display */}
            <div className="col-span-5 flex flex-col items-center border-r border-slate-900 pr-2 text-center h-32 justify-between py-1">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Atmosphere Temp</span>
              <div className="flex items-center gap-2 h-16 w-full justify-center">
                <Thermometer className={`h-8 w-8 ${isTipped ? 'text-rose-500 animate-pulse' : 'text-sky-400'}`} />
                <div className="h-full w-2.5 bg-slate-900 rounded-full relative overflow-hidden border border-slate-800 flex flex-col justify-end">
                  <div 
                    className={`w-full transition-all duration-500 ${isTipped ? 'bg-rose-500' : 'bg-sky-400'}`} 
                    style={{ height: `${Math.min(100, Math.max(10, ((temperature - 1.0) / 2.8) * 100))}%` }}
                  />
                  {/* Gate Tipping indicator mark at +1.7C */}
                  <div className="absolute left-0 right-0 h-0.5 bg-rose-500 top-1/2" title="Tipping Threshold (+1.7C)" />
                </div>
              </div>
              <div>
                <span className={`text-sm font-black leading-none block ${isTipped ? 'text-rose-450' : 'text-slate-250'}`}>+{temperature}°C</span>
                <span className="text-[8px] text-slate-500 font-mono italic">Gate Limit: +1.7°C</span>
              </div>
            </div>

            {/* Greenhouse concentrations gas readout dials */}
            <div className="col-span-7 flex flex-col justify-between h-32 py-1">
              <div className="bg-slate-900 rounded border border-slate-850 p-2 text-xs">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>Greenhouse Density:</span>
                  <span className="font-bold text-amber-500">{state.co2} ppm</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mt-1 border border-slate-900">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((state.co2 - 400) / 450) * 100)}%` }}
                  />
                </div>
                <p className="text-[8px] text-slate-500 font-mono mt-0.5">Pre-industrial: 280ppm | Current: 415ppm+</p>
              </div>

              <div className="bg-slate-900 rounded border border-slate-850 p-2 text-xs">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>Permafrost Venting:</span>
                  <span className="font-bold text-orange-400">{methane} Gt released</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mt-1 border border-slate-900">
                  <div 
                    className="bg-orange-500 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (methane / 160) * 100)}%` }}
                  />
                </div>
                <p className="text-[8px] text-slate-500 font-mono mt-0.5">Underground methane releases increase with heat</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY CHART: TIME SERIES COMPARATIVE PLOT */}
      <div className="bg-slate-955 p-4 rounded-lg border border-slate-800 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Decadal Divergence Plot (+°C Warming)</span>
            <p className="text-[11px] text-slate-550">Comparing active path vs. Paris targets stabilization baseline (+1.7°C limit)</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-850 px-2 py-1 rounded text-[9px] font-mono">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-rose-500 inline-block" />
              <span className="text-slate-300">Your Run</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 border-t border-dashed border-cyan-400 inline-block" />
              <span className="text-slate-300">Paris Goal Baseline</span>
            </div>
          </div>
        </div>

        {/* TIME GRAPH SVG */}
        <div className="relative min-h-[140px]">
          <svg className="w-full h-full min-h-[140px]" viewBox="0 0 350 160" preserveAspectRatio="none">
            {/* Horizontal target guide lines */}
            <line x1="35" y1="140" x2="330" y2="140" stroke="#101827" />
            <line x1="35" y1="115.5" x2="330" y2="115.5" stroke="#1e293b" strokeDasharray="2" />
            {/* The tipping point boundary at +1.7C (Y = 115.5) */}
            <line x1="35" y1="115.5" x2="330" y2="115.5" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
            
            <line x1="35" y1="140" x2="35" y2="30" stroke="#1e293b" />

            {/* Labels */}
            <text x="5" y="142" className="text-[8px] fill-slate-500 font-mono">1.0°C</text>
            <text x="5" y="117.5" className="text-[8px] fill-rose-500 font-mono font-bold">1.7°C (Tipping)</text>
            <text x="5" y="32" className="text-[8px] fill-slate-500 font-mono">4.1°C</text>

            <text x="325" y="109" className="text-[8px] fill-rose-450 font-mono font-semibold" textAnchor="end">
              BIFURCATION LEVEL LIMIT (+1.7°C)
            </text>

            {/* Step coordinate labels */}
            {Array.from({ length: 6 }).map((_, i) => (
              <text key={i} x={38 + (i * 57)} y="155" className="text-[8px] fill-slate-400 font-mono text-center" textAnchor="middle">
                Decade {i}
              </text>
            ))}

            {/* Baseline scenario line plot (Safe stabilized target) */}
            {baselinePoints && (
              <polyline
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                strokeOpacity="0.65"
                points={baselinePoints}
                strokeLinecap="round"
              />
            )}

            {/* Active scenario line plot (Player decisions) */}
            {activePoints && (
              <polyline
                fill="none"
                stroke={isTipped ? "#f43f5e" : "#38bdf8"}
                strokeWidth="3.5"
                points={activePoints}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            )}

            {/* Plot Circles markers */}
            {activeTemps.map((val, idx) => {
              const x = 38 + (idx * 57);
              const y = 140 - Math.min(110, Math.max(0, (val - 1.0) * 35));
              const isPtTipped = val >= 1.70;

              return (
                <g key={`actt-${idx}`}>
                  {isPtTipped && (
                    <circle cx={x} cy={y} r="8" fill="none" stroke="#f43f5e" strokeWidth="1" className="animate-ping" />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isPtTipped ? "5" : "4"}
                    fill={isPtTipped ? "#f43f5e" : "#0284c7"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* FEEDBACK LOOP FLOW DOCUMENTATION DIAGRAM */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col gap-3">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Tipping Point Feedbacks Schematic</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-mono">
          
          {/* LOOP A: ALBEDO HOVER SHIELD */}
          <div className={`p-3 rounded border transition-all ${isTipped ? 'bg-rose-950/20 border-rose-900/40 text-rose-100' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <span className={`text-[9px] font-bold block ${isTipped ? 'text-rose-400' : 'text-slate-400'} mb-1.5`}>
              🔁 LOOP 1: ICE-ALBEDO LOCK
            </span>
            <div className="flex flex-col gap-1 text-[10px] leading-relaxed">
              <div className="flex items-center gap-1.5">
                <span className="bg-slate-950 px-1 py-0.5 rounded text-white font-bold">1</span>
                <span>Warming Melts Shiny Reflective Ice Cover</span>
              </div>
              <div className="text-[9px] text-zinc-500 pl-4">↓</div>
              <div className="flex items-center gap-1.5">
                <span className="bg-slate-950 px-1 py-0.5 rounded text-white font-bold">2</span>
                <span>Darker Ocean Exposed Below absorbs heat</span>
              </div>
              <div className="text-[9px] text-zinc-500 pl-4">↓</div>
              <div className="flex items-center gap-1.5">
                <span className="bg-slate-950 px-1 py-0.5 rounded text-white font-bold">3</span>
                <span className={isTipped ? "text-rose-450 font-bold" : ""}>{"More Warming Retained ──> Runway Collapse!"}</span>
              </div>
            </div>
          </div>

          {/* LOOP B: METHANE VENT PLUGS */}
          <div className={`p-3 rounded border transition-all ${isTipped ? 'bg-orange-950/20 border-orange-900/40 text-orange-100' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <span className={`text-[9px] font-bold block ${isTipped ? 'text-orange-400' : 'text-slate-400'} mb-1.5`}>
              🔁 LOOP 2: PERMA-METHANE VENTING
            </span>
            <div className="flex flex-col gap-1 text-[10px] leading-relaxed">
              <div className="flex items-center gap-1.5">
                <span className="bg-slate-950 px-1 py-0.5 rounded text-white font-bold">1</span>
                <span>Warming Decays Frozen Siberian Soils</span>
              </div>
              <div className="text-[9px] text-zinc-500 pl-4">↓</div>
              <div className="flex items-center gap-1.5">
                <span className="bg-slate-950 px-1 py-0.5 rounded text-white font-bold">2</span>
                <span>Subterranean Methane Gas seeps/releases</span>
              </div>
              <div className="text-[9px] text-zinc-500 pl-4">↓</div>
              <div className="flex items-center gap-1.5">
                <span className="bg-slate-950 px-1 py-0.5 rounded text-white font-bold">3</span>
                <span className={isTipped ? "text-orange-400 font-bold" : ""}>Atmospheric Greenhouse compounding heating!</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* WARN STATUS COMMENTARY BOX */}
      <div className={`p-4 rounded-lg border text-xs flex gap-3.5 items-start transition-all duration-300 ${bannerBgColor}`}>
        <div className={`p-1.5 rounded shrink-0 ${isTipped ? 'bg-rose-500 text-white animate-pulse' : 'bg-cyan-500 text-white'}`}>
          <CloudAlert className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase block font-semibold">FEEDBACK COGNITION FEED</span>
          <p className="leading-relaxed mt-0.5 font-normal">{state.warningText}</p>
        </div>
      </div>

    </div>
  );
}

/* ============================================================================
   4. PREDATOR-PREY DYNAMICS VISUALIZER
   ============================================================================ */
function PredatorPreyVisualizer({ state, activeStep, controls, history = [] }: any) {
  const prey = state.rabbits || 80;
  const predators = state.foxes || 30;
  const vegetation = state.vegetation || 90;

  const [savedPrey, setSavedPrey] = React.useState<number[] | null>(null);
  const [savedPredators, setSavedPredators] = React.useState<number[] | null>(null);
  const [savedCulling, setSavedCulling] = React.useState<number | null>(null);
  const [savedNoise, setSavedNoise] = React.useState<number | null>(null);
  const [activeTab, setActiveTab] = React.useState<'time' | 'phase'>('time');

  // Convert history array to lists of numbers
  const activeHistory = history.slice(0, activeStep + 1);
  const preyValues = activeHistory.map(h => h.rabbits ?? 80);
  const predatorValues = activeHistory.map(h => h.foxes ?? 30);

  const lockRun = () => {
    setSavedPrey(preyValues);
    setSavedPredators(predatorValues);
    setSavedCulling(Number(controls.cullingRate ?? 10));
    setSavedNoise(Number(controls.initialNoise ?? 0));
  };

  const clearSaved = () => {
    setSavedPrey(null);
    setSavedPredators(null);
    setSavedCulling(null);
    setSavedNoise(null);
  };

  // Math mapping for coordinate lines (Max Steps is 10)
  // X limits 40 to 360, Y limits 20 to 150
  const getX = (idx: number) => 40 + idx * 32;
  const getY = (val: number) => 150 - Math.min(130, Math.max(0, (val / 185) * 130));

  // Phase Space dimensions X:55..360 Y:20..150
  const getPhaseX = (r: number) => 55 + Math.min(300, Math.max(0, (r / 185) * 300));
  const getPhaseY = (f: number) => 150 - Math.min(130, Math.max(0, (f / 95) * 130));

  const activePreyPoints = preyValues.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');
  const activePredatorPoints = predatorValues.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');

  const savedPreyPoints = savedPrey ? savedPrey.map((v, i) => `${getX(i)},${getY(v)}`).join(' ') : '';
  const savedPredatorPoints = savedPredators ? savedPredators.map((v, i) => `${getX(i)},${getY(v)}`).join(' ') : '';

  // Phase Space Coordinate Strings (Plotted coordinate points R vs F)
  const activePhasePoints = preyValues.map((v, i) => `${getPhaseX(v)},${getPhaseY(predatorValues[i])}`).join(' ');
  const savedPhasePoints = savedPrey && savedPredators ? savedPrey.map((v, i) => `${getPhaseX(v)},${getPhaseY(savedPredators[i])}`).join(' ') : '';

  const culling = Number(controls.cullingRate ?? 10);
  const curNoise = Number(controls.initialNoise ?? 0);
  const isChaotic = culling < 0;

  let grassColor = 'bg-emerald-950/70 border-emerald-900/40 text-emerald-400';
  if (vegetation < 50) grassColor = 'bg-amber-955/60 border-amber-900/30 text-amber-400';
  if (vegetation < 25) grassColor = 'bg-rose-955/60 border-rose-900/45 text-rose-400';

  // Dot graphics for animal simulator card
  const rDots = Array.from({ length: Math.min(50, Math.ceil(prey / 2)) }).map((_, i) => ({
    x: 10 + (i * 37) % 180,
    y: 10 + (i * 29) % 70
  }));

  const fDots = Array.from({ length: Math.min(25, Math.ceil(predators / 2.5)) }).map((_, i) => ({
    x: 10 + (i * 43) % 180,
    y: 10 + (i * 23) % 70
  }));

  return (
    <div id="visualizer-predator-prey" className="w-full bg-slate-900 border border-slate-805 text-white rounded-xl p-5 shadow-inner flex flex-col gap-6">
      
      {/* HEADER PANEL DIAGNOSTICS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block font-semibold">Trophic Basin Simulator</span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">Lotka-Volterra Bifurcation Analyzer</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold border ${isChaotic ? 'bg-rose-500/10 text-rose-450 border-rose-505/30' : 'bg-slate-950 text-emerald-450 border-emerald-500/15'}`}>
            {isChaotic ? '🚨 STRANGE ATTRACTOR ACTIVE' : '❄️ SYSTEM ATTRACTOR STABLE'}
          </span>
        </div>
      </div>

      {/* THREE-COLUMN BENTO SYSTEM COMPARTMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COMPARTMENT: ANIMAL SPATIAL ARENA (Visual dot densities) */}
        <div className="lg:col-span-4 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Ecosystem Arena</span>
              <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border inline-block ${grassColor}`}>
                Grass Biome: {vegetation}%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">Local spatial density profile</p>
          </div>

          <div className="grid grid-rows-2 gap-3 my-4">
            {/* Rabbits Sub-arena */}
            <div className="bg-slate-900 rounded p-2.5 border border-slate-850/50 min-h-[90px] relative overflow-hidden flex flex-wrap gap-1 content-start">
              {rDots.map((d, i) => (
                <span key={`r-dot-${i}`} className="h-2 w-2 rounded-full bg-emerald-450 animate-pulse shrink-0" title="Herbivore" />
              ))}
              {rDots.length === 0 && <span className="text-[10px] text-slate-650 m-auto">Prey Starved</span>}
              <div className="absolute bottom-1 right-2 bg-slate-950/85 border border-slate-800 px-1 py-0.5 rounded text-[8px] font-mono text-emerald-400 font-bold">
                Rabbits ({prey}k)
              </div>
            </div>

            {/* Foxes Sub-arena */}
            <div className="bg-slate-900 rounded p-2.5 border border-slate-850/50 min-h-[90px] relative overflow-hidden flex flex-wrap gap-1.5 content-start">
              {fDots.map((d, i) => (
                <span key={`f-dot-${i}`} className="h-2.5 w-2.5 bg-indigo-500 rounded-sm rotate-45 animate-bounce shrink-0" title="Predator" />
              ))}
              {fDots.length === 0 && <span className="text-[10px] text-slate-650 m-auto">Predators Extinct</span>}
              <div className="absolute bottom-1 right-2 bg-slate-950/85 border border-slate-800 px-1 py-0.5 rounded text-[8px] font-mono text-indigo-400 font-bold">
                Foxes ({predators}k)
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850 text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Quota setting: <strong className="text-white">{culling}%</strong></span>
            <span>Disturbance: <strong className="text-white">+{curNoise}k</strong></span>
          </div>
        </div>

        {/* RIGHT COMPARTMENT: INTERACTIVE GRAPHING DECK */}
        <div className="lg:col-span-8 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3">
            {/* Visualizer selector tab */}
            <div className="flex gap-1 bg-slate-900 p-0.5 rounded border border-slate-800">
              <button 
                onClick={() => setActiveTab('time')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-semibold transition-all ${activeTab === 'time' ? 'bg-slate-950 text-white border border-slate-800' : 'text-slate-400 hover:text-white'}`}
              >
                🕒 Time Series (Trend Curve)
              </button>
              <button 
                onClick={() => setActiveTab('phase')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-semibold transition-all ${activeTab === 'phase' ? 'bg-slate-950 text-white border border-slate-800' : 'text-slate-400 hover:text-white'}`}
              >
                🌀 Phase Attractor (Loop Space)
              </button>
            </div>

            {/* Run lock memory controls */}
            <div className="flex items-center gap-1.5">
              {savedPrey ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-amber-500 animate-pulse">
                    Saved Reference locked ({savedCulling}% Qta, +{savedNoise}k Dist)
                  </span>
                  <button 
                    onClick={clearSaved}
                    className="p-1 px-2 text-[9px] font-mono bg-red-950 hover:bg-red-900 text-red-200 border border-red-900/50 rounded"
                    title="Clear memory overlay"
                  >
                    Clear Match
                  </button>
                </div>
              ) : (
                <button 
                  onClick={lockRun}
                  className="p-1 px-2.5 text-[10px] font-mono bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-205 rounded flex items-center gap-1"
                  title="Lock current trajectory to visualize butterfly deviations"
                >
                  💾 Save Run to Compare
                </button>
              )}
            </div>
          </div>

          <div className="relative min-h-[175px] mt-3">
            {activeTab === 'time' ? (
              /* TIME SERIES CHART */
              <svg className="w-full h-full min-h-[175px]" viewBox="0 0 380 160" preserveAspectRatio="none">
                {/* Horizontal guide lines */}
                <line x1="45" y1="150" x2="360" y2="150" stroke="#101827" />
                <line x1="45" y1="85" x2="360" y2="85" stroke="#161f30" strokeDasharray="3 3" />
                <line x1="45" y1="20" x2="360" y2="20" stroke="#1e293b" strokeDasharray="1 4" />
                
                {/* Axes lines */}
                <line x1="40" y1="150" x2="40" y2="15" stroke="#1e293b" />

                {/* Y scale labels */}
                <text x="5" y="153" className="text-[8px] fill-slate-500 font-mono">0k</text>
                <text x="5" y="88" className="text-[8px] fill-slate-500 font-mono">90k</text>
                <text x="5" y="23" className="text-[8px] fill-slate-500 font-mono">180k</text>

                {/* X labels steps */}
                {Array.from({ length: 11 }).map((_, i) => (
                  <text key={`x-lbl-${i}`} x={40 + i * 32} y="159" className="text-[8px] fill-slate-400 font-mono text-center" textAnchor="middle">
                    Y{i}
                  </text>
                ))}

                {/* Saved Run Reference Lines (Dashed behind active) */}
                {savedPreyPoints && (
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    strokeOpacity="0.45"
                    points={savedPreyPoints}
                  />
                )}
                {savedPredatorPoints && (
                  <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    strokeOpacity="0.45"
                    points={savedPredatorPoints}
                  />
                )}

                {/* Active Run Lines (Thick glowing curves) */}
                {activePreyPoints && (
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    points={activePreyPoints}
                  />
                )}
                {activePredatorPoints && (
                  <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    points={activePredatorPoints}
                  />
                )}

                {/* Tooltip coordinates of active steps */}
                {preyValues.map((val, idx) => {
                  const x = getX(idx);
                  const yPrey = getY(val);
                  const yPred = getY(predatorValues[idx]);

                  return (
                    <g key={`marker-gp-${idx}`}>
                      <circle cx={x} cy={yPrey} r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                      <circle cx={x} cy={yPred} r="3.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1" />
                    </g>
                  );
                })}
              </svg>
            ) : (
              /* ATTRACTOR PHASE-SPACE ATTRACTOR PLOT (Rabbits X vs Foxes Y) */
              <svg className="w-full h-full min-h-[175px]" viewBox="0 0 380 160" preserveAspectRatio="none">
                {/* Horizontal & Vertical grid guides of phase state */}
                <line x1="55" y1="150" x2="360" y2="150" stroke="#101827" />
                <line x1="55" y1="15" x2="55" y2="150" stroke="#101827" />

                {/* Y and X Axis limits labels */}
                <text x="5" y="20" className="text-[8px] fill-indigo-400 font-mono">Foxes: 95k (Y-max)</text>
                <text x="5" y="152" className="text-[8px] fill-slate-500 font-mono">Foxes: 0k (Y-min)</text>
                
                <text x="55" y="159" className="text-[8px] fill-emerald-400 font-mono">0k Rabbits (X-min)</text>
                <text x="360" y="159" className="text-[8px] fill-emerald-400 font-mono" textAnchor="end">180k Rabbits (X-max)</text>

                {/* Axis Labels */}
                <text x="200" y="15" className="text-[8px] fill-slate-500 font-mono uppercase font-bold text-center" textAnchor="middle">
                  Attractor Phase Space Trajectory [Rabbits vs Foxes]
                </text>

                {/* Saved Reference Phase Path (dashed grey/color) */}
                {savedPhasePoints && (
                  <path
                    d={`M ${savedPhasePoints}`}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    strokeOpacity="0.45"
                  />
                )}

                {/* Active Phase Path (Solid color ribbon with gradient effect over step sequence) */}
                {activePhasePoints && (
                  <path
                    d={`M ${activePhasePoints}`}
                    fill="none"
                    stroke="url(#phaseGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Temporal sequence node circles */}
                {preyValues.map((val, idx) => {
                  const x = getPhaseX(val);
                  const y = getPhaseY(predatorValues[idx]);
                  const isCurrent = idx === activeStep;

                  return (
                    <g key={`phase-${idx}`}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isCurrent ? "6" : "3.5"} 
                        fill={isCurrent ? "#f43f5e" : "#5b21b6"} 
                        stroke="#ffffff" 
                        strokeWidth="1.5" 
                      />
                      {isCurrent && (
                        <circle cx={x} cy={y} r="10" fill="none" stroke="#f43f5e" strokeWidth="1" className="animate-ping" />
                      )}
                      <text x={x} y={y - 8} className="text-[7px] fill-slate-300 font-mono font-bold" textAnchor="middle">
                        Y{idx}
                      </text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="phaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-900 text-[10px] font-mono text-zinc-400">
            <div className="flex gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-emerald-450 inline-block" /> Rabbits (Prey)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-indigo-505 inline-block" /> Foxes (Predators)
              </span>
              {savedPrey && (
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <span className="w-2.5 h-0.5 border-t border-dashed border-amber-500 inline-block" /> Saved Reference Trajectory
                </span>
              )}
            </div>
            
            <div className="text-[9px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded font-bold">
              {activeTab === 'time' ? 'Scale: 1 Decade (0..10 years)' : 'Temporal Coordinates: (Y0 → Y10)'}
            </div>
          </div>

        </div>
      </div>

      {/* COMMENTARY BULLETIN FEEDBACK */}
      <div className={`p-4 rounded-lg border text-xs flex gap-3.5 items-start transition-all duration-300 ${isChaotic ? 'bg-rose-950/40 border-rose-900/50 text-rose-105' : 'bg-slate-950 border-slate-850 text-slate-300'}`}>
        <div className={`p-1.5 rounded shrink-0 ${isChaotic ? 'bg-rose-650 text-white animate-pulse' : 'bg-emerald-500 text-slate-950'}`}>
          <Leaf className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Trophic System Cognition</span>
          <p className="leading-relaxed mt-1 font-normal font-sans text-[11.5px]">{state.balanceStatus}</p>
        </div>
      </div>

    </div>
  );
}

/* ============================================================================
   5. PHANTOM TRAFFIC JAMS VISUALIZER
   ============================================================================ */
function PhantomTrafficVisualizer({ state, activeStep, controls, history = [] }: any) {
  const speeds = state.visualSpeeds || Array(22).fill(75);
  const positions = state.visualPositions || Array(22).fill(0);
  const numCars = speeds.length;

  const [activeTab, setActiveTab] = React.useState<'ring' | 'lanes' | 'grid'>('ring');
  
  // Track state for comparing trajectories (butterfly / deterministic check)
  const [savedSpeeds, setSavedSpeeds] = React.useState<number[] | null>(null);
  const [savedHistory, setSavedHistory] = React.useState<any[] | null>(null);
  const [savedDensity, setSavedDensity] = React.useState<number | null>(null);
  const [savedACC, setSavedACC] = React.useState<boolean | null>(null);
  const [savedReactivity, setSavedReactivity] = React.useState<number | null>(null);

  const curDensity = Number(controls.trafficDensity ?? 65);
  const curACC = !!controls.enableACC;
  const curReactivity = Number(controls.brakingModel ?? 70);

  const handleSaveCompare = () => {
    setSavedSpeeds([...speeds]);
    setSavedHistory([...history]);
    setSavedDensity(curDensity);
    setSavedACC(curACC);
    setSavedReactivity(curReactivity);
  };

  const handleClearCompare = () => {
    setSavedSpeeds(null);
    setSavedHistory(null);
    setSavedDensity(null);
    setSavedACC(null);
    setSavedReactivity(null);
  };

  // Radial placement params for Ring Highway
  const rad = 72; // radius of circular road
  const cx = 100;
  const cy = 100;

  // Render color coding based on a vehicle's speed
  const getCarColor = (sp: number) => {
    if (sp <= 12) return '#f43f5e'; // Stall (Red-rose)
    if (sp <= 42) return '#eab308'; // Braking (Amber-yellow)
    return '#10b981'; // Flowing (Green-emerald)
  };

  return (
    <div id="visualizer-traffic" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-inner flex flex-col gap-6">
      
      {/* SECTION 1: HEADER & DETERMINISTIC CONTROLLER DECK */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block font-semibold">Decentralized Multi-Agent Flow</span>
          <h3 className="text-sm font-bold text-slate-100 mt-0.5">Phantom Traffic Shockwave Laboratory</h3>
        </div>
        <div className="flex items-center gap-2">
          {savedSpeeds ? (
            <div className="flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-900/50 p-1 px-2.5 rounded text-[10px] font-mono">
              <span className="text-amber-400 animate-pulse font-bold">● REFERENCE LOCKED:</span>
              <span className="text-slate-300">
                Density {savedDensity}%, ACC {savedACC ? 'On' : 'Off'}
              </span>
              <button 
                onClick={handleClearCompare} 
                className="ml-2 px-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[9px]"
              >
                Reset Compare
              </button>
            </div>
          ) : (
            <button
              onClick={handleSaveCompare}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 rounded text-xs font-mono font-medium transition-all shadow shadow-indigo-600/20"
              title="Save current highway state to compare with modifications"
            >
              💾 Save Trajectory to Compare
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* COMPARTMENT 1: VISUALLY POLISHED ROAD-MAP SPACE (CIRCULAR OR LINEAR TRAFFIC) */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-2">
            <div className="flex gap-1.5 bg-slate-900 p-0.5 rounded border border-slate-800">
              <button 
                onClick={() => setActiveTab('ring')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'ring' ? 'bg-slate-950 text-white border border-slate-800' : 'text-slate-400 hover:text-white'}`}
              >
                ⭕ Circular Highway
              </button>
              <button 
                onClick={() => setActiveTab('lanes')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'lanes' ? 'bg-slate-950 text-white border border-slate-800' : 'text-slate-400 hover:text-white'}`}
              >
                🛣️ Linearized Lanes
              </button>
              <button 
                onClick={() => setActiveTab('grid')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'grid' ? 'bg-slate-950 text-white border border-slate-800' : 'text-slate-400 hover:text-white'}`}
              >
                📊 Speed Matrix
              </button>
            </div>
            
            <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/40">
              Active Cars: {numCars}
            </div>
          </div>

          <div className="relative min-h-[220px] flex items-center justify-center bg-slate-900 p-2 rounded-lg border border-slate-850 overflow-hidden">
            
            {/* TAB A: CIRCULAR RING ROADWAY VIEW */}
            {activeTab === 'ring' && (
              <div className="relative flex flex-col items-center">
                <svg className="w-52 h-52" viewBox="0 0 200 200">
                  {/* The asphalt physical ring with road line details */}
                  <circle cx={cx} cy={cy} r={rad} fill="none" stroke="#1e293b" strokeWidth="22" />
                  <circle cx={cx} cy={cy} r={rad} fill="none" stroke="#334155" strokeWidth="18" />
                  <circle cx={cx} cy={cy} r={rad} fill="none" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.4" />
                  
                  {/* Highlight Car 0 Initial Perturbation Point / Trigger */}
                  {activeStep >= 1 && (
                    <g>
                      {/* Compass degrees for Car 0 starting trigger */}
                      <line x1={cx} y1={cy - rad - 18} x2={cx} y2={cy - rad + 18} stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.5" />
                      <circle cx={cx} cy={cy - rad} r="14" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" className="animate-pulse" />
                    </g>
                  )}

                  {/* Render cars as animated circular dots with speeds */}
                  {positions.map((posAngle: number, idx: number) => {
                    const sp = speeds[idx] ?? 75;
                    const cColor = getCarColor(sp);
                    const angleRad = (posAngle * Math.PI) / 180;
                    const carX = cx + rad * Math.cos(angleRad);
                    const carY = cy + rad * Math.sin(angleRad);

                    const isLeadTrigger = idx === 0;

                    return (
                      <g key={`car-${idx}`}>
                        {/* Car circular hull shadow */}
                        <circle cx={carX} cy={carY} r="7" fill={cColor} fillOpacity="0.15" />
                        
                        {/* Main Car shape */}
                        <circle
                          cx={carX}
                          cy={carY}
                          r={isLeadTrigger ? "5.5" : "4.5"}
                          fill={cColor}
                          stroke={isLeadTrigger ? "#ffffff" : "#0f172a"}
                          strokeWidth={isLeadTrigger ? "1.5" : "1"}
                          className="transition-all duration-300"
                        />

                        {/* Flashing brakelights */}
                        {sp <= 25 && (
                          <circle
                            cx={carX - 2.5 * Math.cos(angleRad)}
                            cy={carY - 2.5 * Math.sin(angleRad)}
                            r="2"
                            fill="#f43f5e"
                            className="animate-ping"
                          />
                        )}

                        {/* Leader halo badge */}
                        {isLeadTrigger && activeStep === 1 && (
                          <circle cx={carX} cy={carY} r="10" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="animate-spin" />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Spatial Annotations overlay */}
                <div className="absolute top-1 left-2 flex flex-col gap-1 text-[8px] font-mono uppercase bg-slate-950/80 border border-slate-800 p-1 rounded">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Freeflow: 75 km/h
                  </div>
                  <div className="flex items-center gap-1 text-rose-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Jammed: &le; 12 km/h
                  </div>
                </div>

                <div className="absolute inset-y-0 flex items-center justify-center pointer-events-none mt-2">
                  <div className="text-center font-mono p-2">
                    <span className="text-[10px] text-zinc-400 block tracking-widest leading-none">TRAFFIC</span>
                    <span className="text-[14px] text-white font-extrabold block uppercase tracking-tighter mt-0.5">FLOW</span>
                    <span className="text-[8px] text-indigo-400 font-bold tracking-widest block animate-pulse mt-0.5">&or; CLOCKWISE</span>
                  </div>
                </div>

                {/* Shockwave back-propagation vector arrow */}
                {!curACC && speeds.some(s => s <= 12) && (
                  <div className="absolute bottom-2 font-mono text-[9px] text-rose-450 bg-rose-950/45 border border-rose-900/40 px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                    <span>&larr; SHOCKWAVE propagates COUNTER-CLOCKWISE (Upstream)</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB B: OVERHEAD LINEAR ROADWAY VIEWPANEL */}
            {activeTab === 'lanes' && (
              <div className="w-full h-full flex flex-col justify-center gap-4 px-2 py-3">
                <div className="bg-slate-950 border border-slate-800 rounded px-3 py-4 relative">
                  {/* Asphalt Strip Lane */}
                  <div className="absolute inset-y-1/2 left-0 right-0 h-[30px] -translate-y-1/2 bg-slate-850 flex items-center border-y border-slate-700" />
                  <div className="absolute inset-y-1/2 left-0 right-0 h-0 border-t border-dashed border-zinc-500 -translate-y-1/2 opacity-50" />

                  {/* Render cars as sequential grid along lanes, based on index layout */}
                  <div className="relative z-10 flex justify-between items-center h-8">
                    {speeds.map((sp: number, idx: number) => {
                      const cColor = getCarColor(sp);
                      const isLeadTrigger = idx === 0;

                      return (
                        <div 
                          key={`lane-car-${idx}`} 
                          className="flex flex-col items-center group relative cursor-help"
                          title={`Car ${idx}: ${sp} km/h`}
                        >
                          {/* Car model pill */}
                          <div 
                            className="h-3 w-4.5 rounded-sm relative transition-all duration-300 shadow-sm flex items-center justify-center text-[7px] font-mono font-bold"
                            style={{ 
                              backgroundColor: cColor, 
                              color: '#000',
                              border: isLeadTrigger ? '1.5px solid #fff' : 'none'
                            }}
                          >
                            <span>{idx}</span>
                            {sp <= 25 && (
                              <span className="absolute -left-1 top-[3px] w-1.5 h-1 bg-red-600 rounded-l animate-pulse" />
                            )}
                          </div>
                          
                          {/* Glowing spacing metric depending on previous buffer */}
                          {idx > 0 && (
                            <span 
                              className="absolute -left-3 top-4 text-[7px] font-mono text-zinc-500 scale-90"
                            >
                              {(100 - speeds[idx-1]).toFixed(0)}m
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-between border-t border-slate-900 pt-2 px-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm" /> 0-12 km/h (Bumper Gridlock Wave)
                  </span>
                  <span className="text-[9px] text-right text-indigo-400 uppercase font-semibold">
                    Flow moves LEFT to RIGHT &rarr; (Shockwave crawls BACKWARD &larr;)
                  </span>
                </div>
              </div>
            )}

            {/* TAB C: DETAILED SPEED MATRIX HEATMAP */}
            {activeTab === 'grid' && (
              <div className="w-full flex flex-col gap-3 p-1">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">
                  Vehicle Array Vector Heatmap (Individual Speed Indicators)
                </span>
                <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
                  {speeds.map((sp: number, idx: number) => {
                    const cColor = getCarColor(sp);
                    const isLeadTrigger = idx === 0;

                    return (
                      <div 
                        key={`grid-car-${idx}`}
                        className={`p-1.5 rounded border flex flex-col items-center justify-between transition-all ${isLeadTrigger ? 'bg-slate-950 border-white shadow-md' : 'bg-slate-900/60 border-slate-800'}`}
                      >
                        <span className="text-[8px] font-mono text-zinc-500 leading-none">CAR {idx}</span>
                        <span 
                          className="text-[11px] font-mono font-bold mt-1 block px-1 rounded"
                          style={{ color: cColor }}
                        >
                          {sp}
                        </span>
                        <span className="text-[6.5px] font-mono text-slate-400 uppercase text-center mt-1 scale-90 opacity-80 leading-none">
                          {isLeadTrigger ? '🚨 BRAKER' : sp <= 12 ? 'STOPPED' : sp <= 42 ? 'TAP-ON' : 'CRUISE'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Trigger cause highlight notification */}
          <div className="mt-3.5 bg-slate-900/50 p-2.5 rounded border border-slate-850/80 text-[10px] text-indigo-200 font-mono flex items-start gap-2 leading-relaxed">
            <span className="text-amber-500 font-bold block shrink-0">📌 COGNITIVE CAUSE NOTE:</span>
            {activeStep === 0 ? (
              <span>Ready. Year 0 triggers the simulation parameters. Move to step 1 to watch Car 0 tap the brakes.</span>
            ) : (
              <span>Car 0 triggered the entire cascade. In the stable density / ACC environment, drivers behind safely absorbed the speed drop. In the high density environment, lack of spacing buffer amplified each decelerating cycle upstream, ending in a macroscopic ghost jam.</span>
            )}
          </div>
        </div>

        {/* COMPARTMENT 2: REAL-TIME BIFURCATION LINE GRAPH (DIVERGENCE CURVES) */}
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-0.5">Speed Divergence Graph</span>
            <h4 className="text-[12px] font-bold text-slate-200">Average System Speed over Time-step</h4>
            <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
              Watch how your current setting deviates from a saved run.
            </p>
          </div>

          <div className="relative min-h-[160px] my-4">
            {/* SVG Interactive Cartesian Line Chart */}
            <svg className="w-full h-full min-h-[160px]" viewBox="0 0 240 120" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="30" y1="10" x2="230" y2="10" stroke="#161f30" strokeDasharray="1 4" />
              <line x1="30" y1="55" x2="230" y2="55" stroke="#101827" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="230" y2="100" stroke="#1e293b" />
              
              <line x1="30" y1="10" x2="30" y2="100" stroke="#1e293b" />

              {/* Y Axis speed labels */}
              <text x="5" y="14" className="text-[7.5px] fill-slate-500 font-mono">75km/h</text>
              <text x="5" y="58" className="text-[7.5px] fill-slate-500 font-mono">40km/h</text>
              <text x="5" y="103" className="text-[7.5px] fill-slate-500 font-mono">0km/h</text>

              {/* Steps timeline labels on X Axis */}
              {Array.from({ length: 9 }).map((_, i) => (
                <text key={`chart-x-${i}`} x={30 + i * 25} y="112" className="text-[7px] fill-slate-400 font-mono" textAnchor="middle">
                  S{i}
                </text>
              ))}

              {/* Plot Saved Trajectory history values if locked (in dashed orange/amber) */}
              {savedHistory && (
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                  strokeOpacity="0.75"
                  points={savedHistory.map((s, idx) => {
                    const xDeg = 30 + idx * 25;
                    const spAverage = s.averageSpeed ?? 75;
                    const yDeg = 100 - (spAverage / 75) * 90;
                    return `${xDeg},${yDeg}`;
                  }).join(' ')}
                />
              )}

              {/* Plot Current Trajectory history values (solid glowing blue-green) */}
              {history.length > 0 && (
                <polyline
                  fill="none"
                  stroke={curACC ? '#10b981' : '#6366f1'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  points={history.slice(0, activeStep + 1).map((s, idx) => {
                    const xDeg = 30 + idx * 25;
                    const spAverage = s.averageSpeed ?? 75;
                    const yDeg = 100 - (spAverage / 75) * 90;
                    return `${xDeg},${yDeg}`;
                  }).join(' ')}
                />
              )}

              {/* Highlight active step marker node */}
              {history[activeStep] && (
                <circle
                  cx={30 + activeStep * 25}
                  cy={100 - ((history[activeStep].averageSpeed ?? 75) / 75) * 90}
                  r="4.5"
                  fill={history[activeStep].averageSpeed <= 45 ? '#ef4444' : '#6366f1'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>

          {/* Graph Legend metrics */}
          <div className="flex flex-col gap-2 border-t border-slate-900 pt-3 text-[10px] font-mono text-zinc-400">
            <div className="flex flex-wrap justify-between gap-2">
              <span className="flex items-center gap-1 text-slate-200">
                <span className="w-2.5 h-0.5 bg-indigo-500 inline-block" /> Active Trend avg
              </span>
              {savedHistory && (
                <span className="flex items-center gap-1 text-rose-450 font-bold">
                  <span className="w-2.5 h-0.5 border-t border-dashed border-rose-500 inline-block" /> Reference ({savedDensity}% vol)
                </span>
              )}
            </div>

            <div className="bg-slate-900 p-2 rounded text-[9.5px] leading-tight text-slate-300">
              {savedHistory ? (
                <span>
                  Notice how the active line {curACC ? 'flattens safely' : 'plunges quickly'} compared to your saved baseline!
                </span>
              ) : (
                <span>
                  Change sliders, run, then click <strong>"Save Trajectory"</strong> to plot a reference line.
                </span>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* COMPARTMENT 3: COMMENTARY BULLETIN SYSTEM */}
      <div className={`p-4 rounded-lg border text-xs flex gap-3.5 items-start transition-all duration-300 ${!curACC && speeds.some(s => s <= 12) ? 'bg-rose-950/40 border-rose-900/50 text-rose-100' : 'bg-slate-950 border-slate-850 text-slate-300'}`}>
        <div className={`p-1.5 rounded shrink-0 ${!curACC && speeds.some(s => s <= 12) ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-500 text-slate-950'}`}>
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">Tuning Insight & Highway Bulletin</span>
          <p className="leading-relaxed mt-1 font-normal font-sans text-[11.5px]">{state.clogLog}</p>
        </div>
      </div>

    </div>
  );
}

/* ============================================================================
   6. POWER GRID CASCADE VISUALIZER
   ============================================================================ */
function PowerGridVisualizer({ state, activeStep, controls, history = [] }: any) {
  const substations = state.substations || [];
  const [activeTab, setActiveTab] = React.useState<'map' | 'gauges' | 'analysis'>('map');

  // Comparison trajectory storage
  const [savedSubstations, setSavedSubstations] = React.useState<any[] | null>(null);
  const [savedIntegrity, setSavedIntegrity] = React.useState<number | null>(null);
  const [savedReserve, setSavedReserve] = React.useState<number | null>(null);
  const [savedLoadLevel, setSavedLoadLevel] = React.useState<number | null>(null);

  const curReserve = Number(controls.operatingReserve ?? 15);
  const curLoadLevel = Number(controls.initialLoad ?? 80);

  const handleSaveCompare = () => {
    setSavedSubstations([...substations]);
    setSavedIntegrity(state.gridIntegrity);
    setSavedReserve(curReserve);
    setSavedLoadLevel(curLoadLevel);
  };

  const handleClearCompare = () => {
    setSavedSubstations(null);
    setSavedIntegrity(null);
    setSavedReserve(null);
    setSavedLoadLevel(null);
  };

  // Node positions on a wide custom coordinate plane (300 x 220)
  const coords = [
    { x: 150, y: 40, name: 'Alpha' },  // Alpha (Center top generator hub)
    { x: 80, y: 110, name: 'Beta' },   // Beta (North loop)
    { x: 220, y: 110, name: 'Gamma' },  // Gamma (East silicon)
    { x: 90, y: 180, name: 'Delta' },  // Delta (South core industrial)
    { x: 210, y: 180, name: 'Epsilon' } // Epsilon (West residential loop)
  ];

  // System topological interconnects (links)
  const edges = [
    { from: 0, to: 1, label: 'Feed 1A' },
    { from: 0, to: 2, label: 'Feed 1B' },
    { from: 1, to: 3, label: 'Feed 2A' },
    { from: 1, to: 4, label: 'Feed 2B' },
    { from: 2, to: 4, label: 'Feed 2C' },
  ];

  // Dynamic Compound Stress calculations (Total Load vs Remaining Active Capacity)
  const activeSubs = substations.filter((s: any) => s.status !== 'tripped');
  const totalRemainingCapacity = activeSubs.reduce((acc: number, curr: any) => acc + (curr.threshold || 100), 0);
  const totalActiveLoad = activeSubs.reduce((acc: number, curr: any) => acc + (curr.load || 0), 0);
  const compoundStressRatio = totalRemainingCapacity > 0 
    ? Math.round((totalActiveLoad / totalRemainingCapacity) * 100) 
    : 0;

  return (
    <div id="visualizer-power-grid" className="w-full bg-slate-900 border border-slate-850 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      
      {/* SECTION 1: COMPLEMENTARY CONTROL HEADER & SNAPHOT CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block font-bold">TOPOLOGICAL INFRASTRUCTURE LAB</span>
          <h3 className="text-sm font-bold text-slate-100">Cascading Blackout Power-Grid Model</h3>
        </div>
        <div className="flex items-center gap-2">
          {savedSubstations ? (
            <div className="flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-900/50 px-2 py-1 rounded text-[10px] font-mono">
              <span className="text-amber-400 font-bold">● REFERENCE MARKED:</span>
              <span className="text-slate-300">Reserves {savedReserve}%, Load {savedLoadLevel}%</span>
              <button 
                onClick={handleClearCompare} 
                className="ml-1 px-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[9px]"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              onClick={handleSaveCompare}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10.5px] font-mono border border-indigo-500 transition-all flex items-center gap-1"
            >
              🔒 Capture Grid State Baseline
            </button>
          )}
        </div>
      </div>

      {/* COMPARTMENT 2: TWO-COLUMN DESIGN (VISUAL MAP vs REAL-TIME DYNAMIC METRICS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COMPARTMENT: INTERACTIVE MAP OR GAUGES DECK */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
            <div className="flex gap-1.5 bg-slate-900 p-0.5 rounded border border-slate-800">
              <button 
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'map' ? 'bg-slate-950 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                🕸️ Topological Mesh
              </button>
              <button 
                onClick={() => setActiveTab('gauges')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'gauges' ? 'bg-slate-950 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                ⚡ Bus Load Bars
              </button>
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'analysis' ? 'bg-slate-950 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                📝 Chaos Diagnostics
              </button>
            </div>

            <div className="text-[10px] font-mono flex items-center gap-1">
              <span className="text-zinc-500 font-medium">Grid Online:</span>
              <span className={`px-1.5 rounded font-bold ${state.gridIntegrity < 50 ? 'bg-rose-950 text-rose-400 border border-rose-900' : 'bg-emerald-950 text-emerald-400 border border-emerald-900'}`}>
                {state.gridIntegrity}%
              </span>
            </div>
          </div>

          <div className="relative min-h-[220px] bg-slate-900/40 rounded border border-slate-900 p-2 flex items-center justify-center overflow-hidden">
            
            {/* VIEW A: GRAPH TOPOLOGY */}
            {activeTab === 'map' && (
              <svg className="w-full h-full min-h-[220px]" viewBox="0 0 300 220">
                {/* Edge transmission paths links */}
                {edges.map((e, idx) => {
                  const start = coords[e.from];
                  const end = coords[e.to];
                  const startNode = substations[e.from];
                  const endNode = substations[e.to];

                  if (!startNode || !endNode) return null;

                  const isEdgeTripped = startNode.status === 'tripped' || endNode.status === 'tripped';
                  const isEdgeOverloaded = startNode.status === 'overloaded' || endNode.status === 'overloaded';

                  let stroke = '#1e293b';
                  let strokeWidth = '2';
                  let isDash = false;
                  let colorClass = '';

                  if (!isEdgeTripped) {
                    if (isEdgeOverloaded) {
                      stroke = '#ef4444';
                      strokeWidth = '3.5';
                      isDash = true;
                      colorClass = 'animate-pulse';
                    } else {
                      stroke = '#10b981';
                      strokeWidth = '2.2';
                    }
                  }

                  return (
                    <g key={`edge-${idx}`}>
                      {/* Connection wire line */}
                      <line
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        strokeDasharray={isEdgeOverloaded ? '5,3' : undefined}
                        className={`transition-all duration-300 ${colorClass}`}
                      />
                      {/* Interactive flow markers walking on active cables */}
                      {!isEdgeTripped && !isEdgeOverloaded && (
                        <circle cx={start.x} cy={start.y} r="2" fill="#34d399">
                          <animateMotion
                            path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Substation Node markers */}
                {coords.map((c, idx) => {
                  const sub = substations[idx];
                  if (!sub) return null;

                  let fill = '#10b981'; // Flow OK
                  let border = '#059669';
                  let isBlinking = false;
                  let isDrawnTripped = false;

                  if (sub.status === 'tripped') {
                    fill = '#0f172a';
                    border = '#f43f5e';
                    isDrawnTripped = true;
                  } else if (sub.status === 'overloaded') {
                    fill = '#ef4444';
                    border = '#ffffff';
                    isBlinking = true;
                  }

                  return (
                    <g key={`hub-${idx}`} className="cursor-help transition-all duration-300">
                      {/* Glowing warning halos for overloaded nodes */}
                      {isBlinking && (
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r="16"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          className="animate-ping"
                        />
                      )}

                      {/* Outer backing */}
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r="11"
                        fill={fill}
                        stroke={border}
                        strokeWidth={sub.status === 'overloaded' ? "2.5" : "1.5"}
                        className="transition-all duration-300"
                      />

                      {/* Tripped center indicator sign */}
                      {isDrawnTripped && (
                        <line
                          x1={c.x - 4}
                          y1={c.y - 4}
                          x2={c.x + 4}
                          y2={c.y + 4}
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      )}
                      {isDrawnTripped && (
                        <line
                          x1={c.x + 4}
                          y1={c.y - 4}
                          x2={c.x - 4}
                          y2={c.y + 4}
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      )}

                      {/* Substation descriptive tags */}
                      <text
                        x={c.x}
                        y={c.y - 15}
                        className="text-[9px] font-bold font-mono fill-slate-300"
                        textAnchor="middle"
                      >
                        {sub.name.split(' ')[1]}
                      </text>

                      {/* Live loading megawatts indicator */}
                      {!isDrawnTripped && (
                        <text
                          x={c.x}
                          y={c.y + 3}
                          className="text-[8px] font-extrabold font-mono fill-white"
                          textAnchor="middle"
                        >
                          {sub.load}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* VIEW B: INTEGRATED REGIONAL LOAD GAUGES */}
            {activeTab === 'gauges' && (
              <div className="w-full flex flex-col gap-3.5 p-1">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-semibold">
                  Individual Bus Megawatt Loads vs Limit Thresholds
                </span>
                
                <div className="space-y-2.5">
                  {substations.map((sub: any, idx: number) => {
                    const isTrip = sub.status === 'tripped';
                    const isOver = sub.status === 'overloaded';
                    const capRatio = isTrip ? 0 : Math.round((sub.load / sub.threshold) * 100);

                    return (
                      <div key={idx} className="bg-slate-950 p-2 rounded border border-slate-900">
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="font-bold flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isTrip ? 'bg-rose-500' : isOver ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                            {sub.name}
                          </span>
                          <span className="text-zinc-400">
                            {isTrip ? 'DISCONNECTED' : `${sub.load}MW / ${sub.threshold}MW Max (${capRatio}%)`}
                          </span>
                        </div>

                        {/* Visual load percentage bar */}
                        <div className="w-full h-2 bg-slate-900 rounded overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${isTrip ? 'bg-slate-800' : isOver ? 'bg-rose-500 animate-pulse' : capRatio >= 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: isTrip ? '0%' : `${Math.min(capRatio, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW C: MATHEMATICAL CHAOS DIAGNOSTICS */}
            {activeTab === 'analysis' && (
              <div className="w-full h-full p-2 text-xs font-mono text-zinc-300 leading-relaxed space-y-2">
                <h4 className="text-indigo-400 text-xs font-bold uppercase mb-1">Domino Criticality Equation</h4>
                <p>
                  Like sandpiles reaching their critical threshold, an electrical system near capacity enters an unstable high-energy state where localized resistance changes force an automatic reallocation.
                </p>
                <div className="bg-slate-950/80 border border-slate-900 rounded p-2 text-[10.5px] text-emerald-400 font-mono space-y-1">
                  <div>• Substation Base Loads: Alpha (90MW) | Beta (70MW) | Gamma (60MW)</div>
                  <div>• Max Capacity Formula: Base × (1 + Operating Reserve %)</div>
                  <div>• Active Cascade Trigger: Substation Alpha overload surge adds +55MW.</div>
                  <div>• Current Buffer: +{curReserve}% safety room vs {curLoadLevel}% initial demand stress.</div>
                </div>
              </div>
            )}

          </div>

          {/* Substation telemetry guidance box */}
          <div className="mt-3 bg-indigo-950/20 p-2 rounded border border-indigo-900/30 text-[10.5px] text-indigo-200 font-mono flex items-start gap-2">
            <span className="text-indigo-400 font-bold shrink-0">TOPOLOGICAL KEY:</span>
            {activeStep === 0 ? (
              <span>Ready. Move to minute step 1 to watch lightning create a focal overload. Change reserves above to alter threshold tolerances.</span>
            ) : (
              <span>Current cascading status is driven by a {curReserve}% Operating Margin. A margin &ge; 35% with standard load prevents adjacent wire trips.</span>
            )}
          </div>

        </div>

        {/* RIGHT COMPARTMENT: REAL-TIME GRAPH & COMPOUND STRESS METER */}
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">Cascade Dynamics</span>
            <h4 className="text-[12px] font-bold text-slate-200">System Capacity Overload Ratio</h4>
            <p className="text-[11px] text-zinc-500 leading-tight mt-0.5 font-normal">
              Shows load as % of active remaining grid capacity. If it climbs above 100%, cascading trips are inevitable!
            </p>
          </div>

          {/* Large dynamic readout meter */}
          <div className="my-3 p-3 bg-slate-900/60 rounded border border-slate-900 text-center relative overflow-hidden">
            <div className="absolute top-2 left-2 text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase">Load Meter</div>
            
            <div className="mt-2.5">
              <span className={`text-4xl font-extrabold font-mono tracking-tight ${compoundStressRatio === 0 ? 'text-rose-500' : compoundStressRatio >= 100 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                {compoundStressRatio === 0 ? 'BLACKOUT' : `${compoundStressRatio}%`}
              </span>
            </div>

            <p className="text-[10px] font-mono text-zinc-400 mt-2">
              {compoundStressRatio === 0 
                ? 'Total 0% Active Grid Reserves Remaining' 
                : `Load is utilizing ${compoundStressRatio}% of Remaining Online capacity (${totalActiveLoad}MW / ${totalRemainingCapacity}MW limits)`
              }
            </p>
          </div>

          {/* Cartesian SVG Cartesian Area plot showing Grid Integrity (Online hubs) over Time-steps */}
          <div className="relative min-h-[110px] my-2">
            <svg className="w-full h-full min-h-[110px]" viewBox="0 0 240 90" preserveAspectRatio="none">
              {/* Grid indicators */}
              <line x1="30" y1="10" x2="230" y2="10" stroke="#161f30" strokeDasharray="1 3" />
              <line x1="30" y1="45" x2="230" y2="45" stroke="#101827" strokeDasharray="2 2" />
              <line x1="30" y1="80" x2="230" y2="80" stroke="#1e293b" />
              
              <line x1="30" y1="10" x2="30" y2="80" stroke="#1e293b" />

              {/* Y Axis percentage markers */}
              <text x="4" y="13" className="text-[7.5px] fill-zinc-500 font-mono">100%</text>
              <text x="4" y="48" className="text-[7.5px] fill-zinc-500 font-mono">50%</text>
              <text x="4" y="83" className="text-[7.5px] fill-zinc-500 font-mono">0%</text>

              {/* Steps indicators */}
              {Array.from({ length: 7 }).map((_, i) => (
                <text key={`x-time-${i}`} x={30 + i * 33} y="88" className="text-[7.5px] fill-zinc-500 font-mono" textAnchor="middle">
                  M{i}
                </text>
              ))}

              {/* Saved comparison trajectory (in dashed orange) */}
              {savedIntegrity !== null && (
                <line x1="30" y1={80 - (savedIntegrity/100)*70} x2="230" y2={80 - (savedIntegrity/100)*70} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.8" />
              )}

              {/* Plotted line of Active Run Integrity (Solid light indigo) */}
              {history.length > 0 && (
                <polyline
                  fill="none"
                  stroke={state.gridIntegrity === 0 ? '#ef4444' : '#6366f1'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  points={history.slice(0, activeStep + 1).map((h, idx) => {
                    const x = 30 + idx * 33;
                    const y = 80 - ((h.gridIntegrity ?? 100) / 100) * 70;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              )}

              {/* Active minute marker node */}
              {history[activeStep] && (
                <circle
                  cx={30 + activeStep * 33}
                  cy={80 - ((history[activeStep].gridIntegrity ?? 100) / 100) * 70}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </div>

          {/* Graph Legend references */}
          <div className="flex justify-between items-center text-[9.5px] font-mono text-zinc-500 border-t border-slate-900 pt-2.5">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-indigo-500 inline-block" /> Active Trend line
            </span>
            {savedIntegrity !== null && (
              <span className="text-amber-500 font-bold">
                🔒 Baseline: {savedIntegrity}% integrity (Margin {savedReserve}%)
              </span>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 3: COMPREHENSIVE TEXT CRITICAL BULLETIN & LEARNING OUTCOME OVERLAY */}
      <div className={`p-4 rounded-lg border text-xs flex gap-3 items-start transition-all duration-300 ${state.gridIntegrity === 0 ? 'bg-rose-950/40 border-rose-900/50 text-rose-100' : 'bg-slate-950 border-slate-850 text-slate-300'}`}>
        <div className={`p-1.5 rounded shrink-0 ${state.gridIntegrity === 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-500 text-slate-950'}`}>
          <Power className="h-4 w-4" />
        </div>
        <div className="space-y-1 flex-1">
          <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider block font-bold">Tipping-Point Telemetry</span>
          <p className="leading-relaxed font-sans text-[11.5px]">{state.overloadWarning}</p>

          {/* If collapse has finished, show highly educational system-wide blackout details */}
          {state.gridIntegrity === 0 && (
            <div className="mt-2.5 bg-rose-950/30 p-2.5 rounded border border-rose-900/40 text-[11px] leading-relaxed text-rose-200">
              <span className="font-bold text-rose-400 block font-mono">📢 FEEDBACK & BLACKOUT REFLECTION:</span>
              Notice how the collapse of the single component <strong className="text-white">Substation Alpha (20% of equipment)</strong> triggered a cascade that knocked out <strong className="text-white">100% of the network</strong> under thin operating reserves! Since safety margins were kept razor thin, the remaining stations (Beta & Gamma, and later Delta & Epsilon) were immediately overloaded above their critical thresholds, leading to rapid domino trip-checks. This mirrors how a tiny 2% fault can disrupt 60% or more of an enginerred grid when operated on a critical tipping point line.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

/* ============================================================================
   7. PANDEMIC OUTBREAK VISUALIZER
   ============================================================================ */
function PandemicVisualizer({ state, history = [], activeStep, controls }: any) {
  const [activeTab, setActiveTab] = React.useState<'map' | 'demographics' | 'equations'>('map');

  // Comparison trajectory storage
  const [savedHistory, setSavedHistory] = React.useState<any[] | null>(null);
  const [savedPhase, setSavedPhase] = React.useState<number | null>(null);
  const [savedSeeds, setSavedSeeds] = React.useState<number | null>(null);
  const [savedDeceased, setSavedDeceased] = React.useState<number | null>(null);

  const curPhase = Number(controls.interventionPhase ?? 4);
  const curSeeds = Number(controls.superspreaderCount ?? 1);

  const handleCaptureBaseline = () => {
    setSavedHistory([...history]);
    setSavedPhase(curPhase);
    setSavedSeeds(curSeeds);
    setSavedDeceased(state.deceased);
  };

  const handleClearBaseline = () => {
    setSavedHistory(null);
    setSavedPhase(null);
    setSavedSeeds(null);
    setSavedDeceased(null);
  };

  // Geographic regional entities on our SVG map
  const regions = [
    { name: 'Metro Terminal Hub', x: 150, y: 110, capacity: 400000 },
    { name: 'North Suburbia Ring', x: 75, y: 50, capacity: 200000 },
    { name: 'East Maritime Port', x: 225, y: 55, capacity: 200000 },
    { name: 'Inland Valley Plains', x: 80, y: 165, capacity: 100000 },
    { name: 'Mountain Ridge Sector', x: 220, y: 160, capacity: 100000 }
  ];

  // System interconnects
  const transmissionLines = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 0, to: 3 },
    { from: 0, to: 4 },
    { from: 1, to: 3 },
    { from: 2, to: 4 }
  ];

  // Distribute active infected cases into regional entities based on step severity
  const getRegionInfected = (idx: number, totalInfected: number, step: number) => {
    if (totalInfected <= 0) return 0;
    if (step === 0) {
      return idx === 0 ? totalInfected : 0;
    }
    if (step === 1) {
      if (idx === 0) return Math.round(totalInfected * 0.65);
      if (idx === 1) return Math.round(totalInfected * 0.15);
      if (idx === 2) return Math.round(totalInfected * 0.20);
      return 0;
    }
    if (step === 2) {
      if (idx === 0) return Math.round(totalInfected * 0.45);
      if (idx === 1) return Math.round(totalInfected * 0.20);
      if (idx === 2) return Math.round(totalInfected * 0.20);
      if (idx === 3) return Math.round(totalInfected * 0.10);
      return Math.round(totalInfected * 0.05);
    }
    // High systemic dispersion at step >= 3
    if (idx === 0) return Math.round(totalInfected * 0.30);
    if (idx === 1) return Math.round(totalInfected * 0.20);
    if (idx === 2) return Math.round(totalInfected * 0.20);
    if (idx === 3) return Math.round(totalInfected * 0.15);
    return Math.round(totalInfected * 0.15);
  };

  // Define scale mapping for graphing curves matching 1M total pop
  // Peak unmitigated reaches around 650K cases
  const scaleY = (val: number) => {
    const maxScaleValue = 550000;
    const paddingBottom = 130;
    const graphCeiling = 10;
    const ratio = Math.min(val / maxScaleValue, 1);
    return paddingBottom - ratio * (paddingBottom - graphCeiling);
  };

  const scaleX = (stepIndex: number) => {
    return 40 + stepIndex * 46;
  };

  // Current active points coordinate string
  const activePolylinePoints = history.slice(0, activeStep + 1).map((h, i) => {
    return `${scaleX(i)},${scaleY(h.infected)}`;
  }).join(' ');

  // Saved baseline points coordinate string
  const savedPolylinePoints = savedHistory 
    ? savedHistory.map((h, i) => `${scaleX(i)},${scaleY(h.infected)}`).join(' ')
    : '';

  // Calculate global clinical occupancy percentage
  const globalCapacityLimit = 30000;
  const icuUtilizationRatio = Math.round((state.infected / globalCapacityLimit) * 100);

  return (
    <div id="visualizer-pandemic" className="w-full bg-slate-900 border border-slate-850 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      
      {/* SECTION 1: EPIDEMIC OUTBREAK HEADER CONTROL PANEL */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-rose-450 uppercase tracking-widest block font-bold">BIOLOGICAL PROPAGATION ENGINE</span>
          <h3 className="text-sm font-bold text-slate-100">Pathogen Spread & Sensitive State Response</h3>
        </div>
        <div className="flex items-center gap-2">
          {savedHistory ? (
            <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-900/50 px-2 py-1 rounded text-[10px] font-mono">
              <span className="text-amber-400 font-bold">● REFERENCE LOCKED:</span>
              <span className="text-slate-300">Phase {savedPhase}, Seeds {savedSeeds}</span>
              <button 
                onClick={handleClearBaseline} 
                className="ml-1 px-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[9px]"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              onClick={handleCaptureBaseline}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10.5px] font-mono border border-rose-500 transition-all flex items-center gap-1"
            >
              🔒 Reference Current Mitigation Curve
            </button>
          )}
        </div>
      </div>

      {/* COMPARTMENT 2: DOUBLE-PANEL EXPANSION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT PANEL DECK: GIS MAP & ANALYSIS DECK */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
            <div className="flex gap-1.5 bg-slate-900 p-0.5 rounded border border-slate-800">
              <button 
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'map' ? 'bg-slate-950 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                🗺️ Spatial Outbreak Map
              </button>
              <button 
                onClick={() => setActiveTab('demographics')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'demographics' ? 'bg-slate-950 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                📊 Demographic Breakdown
              </button>
              <button 
                onClick={() => setActiveTab('equations')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'equations' ? 'bg-slate-950 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                🧬 Path-Dependency Math
              </button>
            </div>

            <div className="text-[10px] font-mono flex items-center gap-1.5">
              <span className="text-zinc-500">Reproduction Rate:</span>
              <span className={`px-1.5 rounded font-bold ${state.r0Value >= 1.5 ? 'bg-rose-950 text-rose-450 border border-rose-900' : 'bg-emerald-950 text-emerald-405 border border-emerald-900'}`}>
                Rt = {state.r0Value}
              </span>
            </div>
          </div>

          <div className="relative min-h-[220px] bg-slate-900/40 rounded border border-slate-900 p-2 flex items-center justify-center overflow-hidden">
            
            {/* GIS MAP VIEW */}
            {activeTab === 'map' && (
              <svg className="w-full h-full min-h-[220px]" viewBox="0 0 300 220">
                {/* Vector inter-city transit highways */}
                {transmissionLines.map((line, idx) => {
                  const start = regions[line.from];
                  const end = regions[line.to];
                  const activeInfectionExits = getRegionInfected(line.from, state.infected, activeStep) > 100;
                  
                  return (
                    <g key={`trans-${idx}`}>
                      <line
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        stroke={activeInfectionExits ? '#ef4444' : '#1e293b'}
                        strokeWidth={activeInfectionExits ? '1.5' : '1.0'}
                        strokeDasharray={activeInfectionExits ? '3 3' : undefined}
                        className="transition-all duration-300"
                      />
                      {/* Interactive infectious flows traveling on active vector pathways */}
                      {activeInfectionExits && (
                        <circle cx={start.x} cy={start.y} r="1.5" fill="#f43f5e">
                          <animateMotion
                            path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                            dur="2.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Substation/GIS Node markers */}
                {regions.map((node, idx) => {
                  const localCases = getRegionInfected(idx, state.infected, activeStep);
                  const isContainmentActive = activeStep >= curPhase;
                  
                  // Radius scales in proportion to log-like local cases to keep circles readable
                  const circleRadius = localCases > 0 
                    ? Math.min(10 + Math.pow(localCases, 0.28) * 1.5, 30) 
                    : 10;

                  const isHeavilyInfected = localCases > 4000;
                  let fill = '#334155';
                  let stroke = '#1e293b';

                  if (localCases > 0) {
                    fill = isContainmentActive ? '#991b1b' : '#ef4444';
                    stroke = isHeavilyInfected ? '#ffffff' : '#f43f5e';
                  } else {
                    fill = '#0f172a';
                    stroke = isContainmentActive ? '#059669' : '#475569';
                  }

                  return (
                    <g key={`node-${idx}`} className="cursor-help transition-all duration-300">
                      {/* Active quarantine force field shield around containment zones */}
                      {isContainmentActive && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={circleRadius + 5}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="1"
                          strokeDasharray="4 2"
                          className="animate-[spin_12s_linear_infinite]"
                        />
                      )}

                      {/* Growing warning glowing halo */}
                      {isHeavilyInfected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={circleRadius + 8}
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="1.5"
                          className="animate-pulse opacity-40"
                        />
                      )}

                      {/* Node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={circleRadius}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth="1.5"
                        className="transition-all duration-300"
                      />

                      {/* Green Shield mini mark for controlled clean stations */}
                      {isContainmentActive && localCases === 0 && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={4}
                          fill="#10b981"
                        />
                      )}

                      {/* Label identification text */}
                      <text
                        x={node.x}
                        y={node.y - circleRadius - 5}
                        className="text-[8px] font-bold font-mono fill-slate-355"
                        textAnchor="middle"
                      >
                        {node.name.split(' ')[0]}
                      </text>

                      {/* Mega indicators on Node center */}
                      <text
                        x={node.x}
                        y={node.y + 3}
                        className="text-[7.5px] font-extrabold font-mono fill-zinc-100"
                        textAnchor="middle"
                      >
                        {localCases === 0 ? '✓' : localCases > 10000 ? `${Math.round(localCases/1000)}k` : localCases}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* POPULATION DEMOGRAPHICS PROGRESS BREAKDOWN */}
            {activeTab === 'demographics' && (
              <div className="w-full flex flex-col gap-4 p-1">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-semibold">
                  Global System Partition (N = 1,000,000 Individuals)
                </span>
                
                <div className="space-y-3.5">
                  {[
                    { label: '🧼 Healthy Susceptible Block', val: state.susceptible, color: 'bg-indigo-650', rawColor: '#312e81' },
                    { label: '🔥 Active Inpatient Carriers', val: state.infected, color: 'bg-rose-500 animate-pulse', rawColor: '#f43f5e' },
                    { label: '🛡️ Recovered / Immune Pool', val: state.recovered, color: 'bg-emerald-500', rawColor: '#10b981' },
                    { label: '💀 Cumulative Deceased', val: state.deceased, color: 'bg-zinc-600', rawColor: '#52525b' }
                  ].map((field, index) => {
                    const ratio = Math.round((field.val / 1000000) * 100);
                    return (
                      <div key={index} className="bg-slate-950 p-2 border border-slate-900 rounded">
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="font-bold whitespace-nowrap">{field.label}</span>
                          <span className="text-zinc-400 font-medium">
                            {field.val.toLocaleString()} ({ratio}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-900 rounded overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${field.color}`}
                            style={{ width: `${Math.max(ratio, field.val > 0 ? 0.8 : 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PATH-DEPENDENCY EQUATIONS AND MATHEMATICS */}
            {activeTab === 'equations' && (
              <div className="w-full h-full p-2 text-xs font-mono text-zinc-300 leading-relaxed space-y-2">
                <h4 className="text-rose-400 text-xs font-bold uppercase mb-1">Chaos Theory in Epidemics: Rt Calculation</h4>
                <p>
                  Infectious propagation is driven by the dynamic differential equations of the classical <strong>S&rarr;I&rarr;R Vector Model</strong>. Growth scale follows:
                </p>
                <div className="bg-slate-950/80 border border-slate-900 rounded p-2.5 text-[10.5px] text-emerald-400 font-mono space-y-1.5">
                  <div>• Initial Reproduction Scale of Pathogen: R0 = 3.20 base</div>
                  <div>• Early Airport Contacts multiplier: +{curSeeds * 0.25} R0 seeds</div>
                  <div>• Mitigated Target lockdown effect: Rt triggers directly to ~0.70</div>
                  <div>• Exponential Threshold lines: Rt &gt; 1 leads to runaway pandemics; Rt &lt; 1 leads to viral eradication.</div>
                </div>
              </div>
            )}

          </div>

          <div className="mt-2.5 bg-rose-950/20 p-2.5 rounded border border-rose-900/30 text-[10.5px] text-rose-200 font-mono flex items-start gap-2">
            <span className="text-rose-400 font-bold shrink-0">DIAGNOSTIC STATUS:</span>
            {activeStep === 0 ? (
              <span>Ready. Outbreak clusters initialized at Metro. Advance steps to watch transmission lines carry infection to coastal ports.</span>
            ) : (
              <span>Outbreak response initialized. Social mitigation measures take effect starting at Phase {curPhase}.</span>
            )}
          </div>

        </div>

        {/* RIGHT PANEL DECK: LIVE EXPONENTIAL CHART & METRIC BARS */}
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">Critical Healthcare Limits</span>
            <h4 className="text-[12px] font-bold text-slate-100">National Intensive Care Caseloads</h4>
            <p className="text-[11px] text-zinc-500 leading-tight mt-0.5 font-normal">
              ICU limit capacity is 30,000 active cases. Crowding limits causes casualties to spike exponentially!
            </p>
          </div>

          {/* Dynamic hospital load indicator */}
          <div className="my-3 p-3 bg-slate-900/65 rounded border border-slate-900 text-center relative overflow-hidden">
            <div className="absolute top-2 left-2 text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase">Hospital Overflow Meter</div>
            <div className="mt-2 text-3xl font-extrabold font-mono tracking-tight text-white">
              <span className={state.infected > globalCapacityLimit ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}>
                {icuUtilizationRatio}%
              </span>
            </div>
            <p className={`text-[10.5px] font-mono mt-1 ${state.infected > globalCapacityLimit ? 'text-rose-400 font-bold' : 'text-zinc-400 font-normal'}`}>
              {state.infected > globalCapacityLimit 
                ? `🚨 CRITICAL STORAGE CAPACITY BREACHED (+${(state.infected - globalCapacityLimit).toLocaleString()} OVERFLOW)` 
                : `${state.infected.toLocaleString()} Active Cases vs ${globalCapacityLimit.toLocaleString()} Hospital Threshold`
              }
            </p>
          </div>

          {/* SVG Infection Curve Graph */}
          <div className="relative min-h-[145px] my-2 bg-slate-950 p-1">
            <svg className="w-full h-full min-h-[145px]" viewBox="0 0 280 140" preserveAspectRatio="none">
              {/* Draw grids */}
              <line x1="40" y1="10" x2="270" y2="10" stroke="#101827" strokeDasharray="1 3" />
              <line x1="40" y1="70" x2="270" y2="70" stroke="#161f30" strokeDasharray="2 2" />
              <line x1="40" y1="130" x2="270" y2="130" stroke="#1e293b" />
              <line x1="40" y1="10" x2="40" y2="130" stroke="#1e293b" />

              {/* ICU Overflow capacity limit floor at 30,000 cases */}
              <line 
                x1="40" 
                y1={scaleY(globalCapacityLimit)} 
                x2="270" 
                y2={scaleY(globalCapacityLimit)} 
                stroke="#ef4444" 
                strokeWidth="1.5" 
                strokeDasharray="4 3" 
              />
              <text x="44" y={scaleY(globalCapacityLimit) - 4} className="text-[7.5px] font-bold fill-rose-500 font-mono">ICU CAPACITY LIMIT</text>

              {/* Y Axis population markings */}
              <text x="4" y="15" className="text-[7.5px] fill-zinc-550 font-mono">500k</text>
              <text x="4" y="73" className="text-[7.5px] fill-zinc-550 font-mono">250k</text>
              <text x="4" y="133" className="text-[7.5px] fill-zinc-550 font-mono">0</text>

              {/* X Axis Step labels */}
              {Array.from({ length: 6 }).map((_, stepIdx) => (
                <text key={`curve-x-${stepIdx}`} x={scaleX(stepIdx)} y="139" className="text-[7.5px] fill-zinc-550 font-mono" textAnchor="middle">
                  Ph{stepIdx}
                </text>
              ))}

              {/* Saved baseline comparative curve representation (dashed amber line) */}
              {savedPolylinePoints && (
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.0"
                  strokeDasharray="3 3"
                  points={savedPolylinePoints}
                  strokeLinecap="round"
                />
              )}

              {/* Active live run curves plotting */}
              {activePolylinePoints && (
                <polyline
                  fill="none"
                  stroke={state.infected > globalCapacityLimit ? '#ef4444' : '#6366f1'}
                  strokeWidth="2.5"
                  points={activePolylinePoints}
                  strokeLinecap="round"
                  className="transition-all duration-350"
                />
              )}

              {/* Marker of active step */}
              <circle
                cx={scaleX(activeStep)}
                cy={scaleY(state.infected)}
                r="4.5"
                fill="#ffffff"
                stroke={state.infected > globalCapacityLimit ? '#ef4444' : '#6366f1'}
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Graph Legend references */}
          <div className="flex justify-between items-center text-[9.5px] font-mono text-zinc-500 border-t border-slate-900 pt-2.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-indigo-500 inline-block rounded" /> Active Trend line
            </span>
            {savedHistory !== null && (
              <span className="text-amber-500 font-bold whitespace-nowrap">
                🔒 Captured Baseline: {savedDeceased?.toLocaleString()} casualties (Lock Phase: {savedPhase})
              </span>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 3: IMMERSIVE CLINICAL PHASE REPORT & CRITICAL TELEMETRY WRAPPER */}
      <div className={`p-4 rounded-lg border text-xs flex gap-3 items-start transition-all duration-300 ${state.infected > globalCapacityLimit ? 'bg-rose-950/40 border-rose-900/50 text-rose-100' : 'bg-slate-950 border-slate-850 text-slate-300'}`}>
        <div className={`p-1.5 rounded shrink-0 ${state.infected > globalCapacityLimit ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-500 text-slate-950'}`}>
          <Activity className="h-4 w-4" />
        </div>
        <div className="space-y-1 flex-1">
          <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider block font-bold font-mono">Epidemic Health Bulletin</span>
          <p className="leading-relaxed font-sans text-[11.5px]">{state.phaseReport}</p>

          {/* Educational Feedback reflection block on run completion */}
          {activeStep === 5 && (
            <div className="mt-2.5 bg-indigo-950/35 p-2.5 rounded border border-indigo-900/40 text-[11px] leading-relaxed text-indigo-200">
              <span className="font-bold text-indigo-400 block font-mono">🔍 NON-LINEAR FEEDBACK REFLECTION:</span>
              Compare your trajectories. A mitigation response delayed until <strong className="text-white">Phase {curPhase}</strong> allowed unmitigated exponential loops to expand rapidly. By then, active patients rocketed to <strong className="text-white">{state.infected.toLocaleString()}</strong>, overwhelming intensive care capacity and leading to <strong className="text-white">{state.deceased.toLocaleString()} deaths</strong>. Conversely, with a quick intervention at Phase 1 or 2, active curves flatten completely. This visualizes sensitive dependence on initial response timing inside chaotic epidemic events.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

/* ============================================================================
   8. VACCINATION THRESHOLD VISUALIZER
   ============================================================================ */
function VaccinationVisualizer({ state, activeStep, controls, history = [] }: any) {
  const coverage = Number(controls.vaccinationCoverage ?? 83);
  const infections = state.newInfections || 0;
  const isProtected = coverage >= 85;
  const [activeTab, setActiveTab] = React.useState<'grid' | 'bifurcation'>('grid');

  // Baseline storage for dual-run bifurcation compare
  const [savedHistory, setSavedHistory] = React.useState<any[] | null>(null);
  const [savedCoverage, setSavedCoverage] = React.useState<number | null>(null);
  const [savedInfections, setSavedInfections] = React.useState<number | null>(null);

  const handleCaptureBaseline = () => {
    setSavedHistory([...history]);
    setSavedCoverage(coverage);
    setSavedInfections(state.newInfections);
  };

  const handleClearBaseline = () => {
    setSavedHistory(null);
    setSavedCoverage(null);
    setSavedInfections(null);
  };

  // 8x8 scatter household generator
  const houses = Array.from({ length: 64 }).map((_, i) => {
    // Deterministic bijection to scatter shields across the neighborhood
    const scatteredIdx = (i * 37) % 64;
    const isVaccinated = scatteredIdx < Math.ceil((coverage / 100) * 64);
    
    let status = 'susceptible';
    if (isVaccinated) {
      status = 'shielded';
    } else if (activeStep > 0) {
      const column = i % 8;
      if (!isProtected) {
        // If unmitigated outbreaks occur, the virus penetrates columns step-by-step
        if (column <= activeStep + 1) {
          status = 'infected';
        }
      } else {
        // Under protected herd immunity, only index in initial column 0 gets single isolated infection
        if (column === 0 && !isVaccinated) {
          status = 'infected';
        }
      }
    }

    return { idx: i, status };
  });

  // Calculate dynamic max value for adaptive line scaling
  const maxInfectionScale = Math.max(
    ...history.map((h: any) => h.newInfections || 0),
    ...(savedHistory ? savedHistory.map((h: any) => h.newInfections || 0) : []),
    250
  );

  const scaleY = (val: number) => {
    const graphCeiling = 10;
    const graphFloor = 105;
    const ratio = Math.min((val || 0) / maxInfectionScale, 1);
    return graphFloor - ratio * (graphFloor - graphCeiling);
  };

  const scaleX = (idx: number) => {
    return 35 + idx * 42;
  };

  // Map trajectory coordinates
  const activeCurvePoints = history.slice(0, activeStep + 1).map((h, idx) => {
    return `${scaleX(idx)},${scaleY(h.newInfections)}`;
  }).join(' ');

  const savedCurvePoints = savedHistory
    ? savedHistory.map((h, idx) => `${scaleX(idx)},${scaleY(h.newInfections)}`).join(' ')
    : '';

  return (
    <div id="visualizer-vaccination" className="w-full bg-slate-900 border border-slate-850 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block font-bold">EPIDEMIOLOGICAL PHASE BOUNDARY</span>
          <h3 className="text-sm font-bold text-slate-100">Herd Immunity & Critical Percolation Limits</h3>
        </div>
        <div className="flex items-center gap-2">
          {savedHistory ? (
            <div className="flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-900/50 px-2 py-1 rounded text-[10px] font-mono">
              <span className="text-amber-400 font-bold">● BASELINE FILED:</span>
              <span className="text-slate-300">Coverage {savedCoverage}% ({savedInfections} infections)</span>
              <button 
                onClick={handleClearBaseline} 
                className="ml-1 px-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[9px]"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              onClick={handleCaptureBaseline}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10.5px] font-mono border border-indigo-500 transition-all flex items-center gap-1"
            >
              🔒 Capture Vaccination Baseline
            </button>
          )}
        </div>
      </div>

      {/* TWO COLUMN INTERACTIVE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COMARTMENT: 8x8 DISPERSION GRID */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
            <div className="flex gap-1.5 bg-slate-900 p-0.5 rounded border border-slate-800">
              <button 
                onClick={() => setActiveTab('grid')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'grid' ? 'bg-slate-955 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                🕸️ Household Transmission Mesh
              </button>
              <button 
                onClick={() => setActiveTab('bifurcation')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'bifurcation' ? 'bg-slate-955 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                🧪 Percolation Limits Analysis
              </button>
            </div>

            <div className="text-[10px] font-mono flex items-center gap-1">
              <span className="text-zinc-500 font-medium font-mono">Immunity Status:</span>
              <span className={`px-1.5 rounded font-bold ${isProtected ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-rose-950 text-rose-450 border border-rose-900'}`}>
                {isProtected ? 'SHIELDED' : 'VULNERABLE'}
              </span>
            </div>
          </div>

          <div className="relative min-h-[220px] bg-slate-900/40 rounded border border-slate-900 p-3.5 flex items-center justify-center overflow-hidden">
            
            {activeTab === 'grid' && (
              <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">
                  8x8 Scattered Community Households Map
                </span>
                <div className="grid grid-cols-8 gap-1.5">
                  {houses.map((h) => {
                    let bg = 'bg-slate-800 text-slate-600 border border-slate-700/60';
                    let ring = '';
                    let statusColor = 'Susceptible';

                    if (h.status === 'shielded') {
                      bg = 'bg-indigo-650 text-indigo-200 border border-indigo-500/50 shadow-[0_0_8px_rgba(99,102,241,0.2)]';
                      statusColor = 'Vaccinated';
                    } else if (h.status === 'infected') {
                      bg = 'bg-rose-500 text-white animate-pulse border border-white shadow-[0_0_10px_rgba(244,63,94,0.5)]';
                      statusColor = 'Infected';
                    }

                    return (
                      <div 
                        key={h.idx} 
                        className={`h-5 w-5 rounded flex items-center justify-center text-[10px] font-bold ${bg} ${ring} transition-all duration-300 cursor-help`}
                        title={`House ID ${h.idx} - ${statusColor}`}
                      >
                        {h.status === 'shielded' && <Shield className="h-2.5 w-2.5" />}
                        {h.status === 'infected' && <Flame className="h-2.5 w-2.5" />}
                      </div>
                    );
                  })}
                </div>

                {/* Micro legends */}
                <div className="flex gap-4 items-center text-[10px] font-mono text-zinc-400 mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-650 border border-indigo-500/50 block" /> Shielded
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700 block" /> Susceptible
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500 border border-white block animate-pulse" /> Infected
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bifurcation' && (
              <div className="w-full text-xs font-mono text-zinc-300 leading-relaxed space-y-2">
                <h4 className="text-zinc-100 font-bold uppercase mb-1">Non-Linear Phase Transitions</h4>
                <p>
                  Percolation theory dictates that inside random network topologies, connection clusters remain isolated until densities cross a critical limit. Once vaccination drops below <strong>85%</strong>, unvaccinated paths instantly link to form a persistent epidemic chain.
                </p>
                <div className="bg-slate-950/80 border border-slate-900 rounded p-2 text-[10.5px] text-indigo-350 space-y-1">
                  <div>• Tipping Point Boundary: Exactly 85% vaccine coverage rate</div>
                  <div>• Above 85%: Local cases dry out exponentially within Year 2.</div>
                  <div>• Below 85%: The chain flows uncontained, sparking yearly outbreaks.</div>
                  <div>• Dynamic Difference: A mere 1% difference completely alters community fate.</div>
                </div>
              </div>
            )}

          </div>

          <div className="mt-3 bg-indigo-950/20 p-2.5 rounded border border-indigo-900/30 text-[10.5px] text-indigo-200 font-mono flex items-start gap-2">
            <span className="text-indigo-400 font-bold shrink-0">VECTOR LOGS:</span>
            {activeStep === 0 ? (
              <span>Ready. Move to Year 1 to launch international travel vectors. Adjust current coverage slider to inspect the 85% bifurcation line.</span>
            ) : (
              <span>Outbreak propagation active at Year {activeStep}. Current path is driven by a {coverage}% coverage limit.</span>
            )}
          </div>

        </div>

        {/* RIGHT COMPARTMENT: COMMUNITY IMMUNITY SHIELD METER & TREND CHART */}
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">Community Immunity</span>
            <h4 className="text-[12px] font-bold text-slate-100">Herd Barrier Absorption Gauge</h4>
            <p className="text-[11px] text-zinc-500 leading-tight mt-0.5 mb-2 font-normal">
              Shows coverage against the 85% herd immunity barrier.
            </p>
          </div>

          {/* Large dynamic shield progress tracker */}
          <div className="my-2 p-3 bg-slate-900/65 rounded border border-slate-900 text-center relative overflow-hidden">
            <div className="absolute top-2 left-2 text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase">Percolation Meter</div>
            <div className="mt-2 text-3xl font-extrabold font-mono tracking-tight text-white flex items-center justify-center gap-1.5">
              <span className={isProtected ? 'text-emerald-400' : 'text-rose-450'}>
                {coverage}%
              </span>
              <span className="text-sm text-zinc-400">/ 85% Target</span>
            </div>

            {/* Horizontal target gauge bar */}
            <div className="w-full h-2.5 bg-slate-950 rounded mt-2.5 overflow-hidden relative">
              <div 
                className={`h-full transition-all duration-300 ${isProtected ? 'bg-emerald-600' : 'bg-rose-600'}`}
                style={{ width: `${Math.min((coverage / 98) * 100, 100)}%` }}
              />
              {/* Threshold indicator line at 85% */}
              <div className="absolute top-0 bottom-0 left-[86.7%] w-0.5 bg-white z-10" />
            </div>

            <p className="text-xs font-mono mt-2 text-zinc-400">
              {isProtected 
                ? 'Threshold met: community immunity barrier prevents sustained transmission.' 
                : 'Threshold deficient: transmission chains penetrate through vulnerable nodes.'
              }
            </p>
          </div>

          {/* Cartisian infection trend graph */}
          <div className="relative min-h-[110px] my-2 p-1 bg-slate-950">
            <svg className="w-full h-full min-h-[110px]" viewBox="0 0 250 115" preserveAspectRatio="none">
              <line x1="35" y1="10" x2="240" y2="10" stroke="#101827" strokeDasharray="1 3" />
              <line x1="35" y1="57" x2="240" y2="57" stroke="#161f30" strokeDasharray="2 2" />
              <line x1="35" y1="105" x2="240" y2="105" stroke="#1e293b" />
              <line x1="35" y1="10" x2="35" y2="105" stroke="#1e293b" />

              {/* Y Axis scales */}
              <text x="2" y="14" className="text-[7.5px] fill-zinc-500 font-mono">{maxInfectionScale}</text>
              <text x="2" y="61" className="text-[7.5px] fill-zinc-500 font-mono">{Math.round(maxInfectionScale / 2)}</text>
              <text x="2" y="108" className="text-[7.5px] fill-zinc-500 font-mono">0</text>

              {/* X Axis Years labels */}
              {Array.from({ length: 5 }).map((_, yIdx) => (
                <text key={`vacc-x-${yIdx}`} x={scaleX(yIdx)} y="113" className="text-[7.5px] fill-zinc-500 font-mono" textAnchor="middle">
                  Y{yIdx + 1}
                </text>
              ))}

              {/* Saved dual-run curve comparison (dashed yellow) */}
              {savedCurvePoints && (
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                  points={savedCurvePoints}
                />
              )}

              {/* Active curve plot */}
              {activeCurvePoints && (
                <polyline
                  fill="none"
                  stroke={isProtected ? '#10b981' : '#f43f5e'}
                  strokeWidth="2.2"
                  points={activeCurvePoints}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              )}

              {/* Current marker point */}
              {history[activeStep] && (
                <circle
                  cx={scaleX(activeStep)}
                  cy={scaleY(state.newInfections)}
                  r="3.5"
                  fill="#ffffff"
                  stroke={isProtected ? '#10b981' : '#f43f5e'}
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </div>

          {/* Legends */}
          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 border-t border-slate-900 pt-2.5">
            <span className="flex items-center gap-1.5">
              <span className={`w-2.5 h-0.5 inline-block rounded ${isProtected ? 'bg-emerald-500' : 'bg-rose-500'}`} /> Active Trend Line
            </span>
            {savedHistory !== null && (
              <span className="text-amber-500 font-bold whitespace-nowrap">
                🔒 Baseline: {savedCoverage}% vaccination (Max {Math.max(...savedHistory.map(h => h.newInfections || 0))} cases)
              </span>
            )}
          </div>

        </div>

      </div>

      {/* BOTTOM BULLETIN EXPLANATORY OVERLAY */}
      <div className={`p-4 rounded-lg border text-xs flex gap-3 items-start transition-all duration-300 ${isProtected ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-150' : 'bg-rose-950/20 border-rose-900/40 text-rose-100'}`}>
        <div className={`p-1.5 rounded shrink-0 ${isProtected ? 'bg-emerald-600 text-slate-950' : 'bg-rose-600 text-white animate-pulse'}`}>
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="space-y-1 flex-1">
          <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider block font-bold font-mono">Immunization Progress Summary</span>
          <p className="leading-relaxed font-sans text-[11.5px]">{state.eradicationProgress}</p>

          {/* If reached terminal year 5 (index 4), output rich phase-transition review commentary */}
          {activeStep === 4 && (
            <div className="mt-2.5 bg-indigo-950/30 p-2.5 rounded border border-indigo-900/40 text-[11px] leading-relaxed text-indigo-200">
              <span className="font-bold text-indigo-400 block font-mono">🔍 BIFURCATION REFLECTION:</span>
              Compare your runs. At <strong className="text-white">coverage &ge; 85%</strong>, the virus encountered insurmountable barriers of immunity on all transmission channels, collapsing infections to near zero immediately. Conversely, dropping only a tiny bit below target (e.g. 84%) opens massive linked clusters of vulnerable hosts, allowing the disease to replicate persistently. This underlines how threshold effects make simple linear policies behave with unpredictable qualitative leaps!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

/* ============================================================================
   9. FAKE NEWS CASCADE VISUALIZER
   ============================================================================ */
function FakeNewsVisualizer({ state, activeStep, controls, history = [] }: any) {
  const isModerated = !!controls.moderationEarly;
  const believers = state.rumorBelievers || 10;
  const [activeTab, setActiveTab] = React.useState<'network' | 'metrics'>('network');

  // Baseline comparison storage
  const [savedHistory, setSavedHistory] = React.useState<any[] | null>(null);
  const [savedModerated, setSavedModerated] = React.useState<boolean | null>(null);
  const [savedBelievers, setSavedBelievers] = React.useState<number | null>(null);

  const handleCaptureBaseline = () => {
    setSavedHistory([...history]);
    setSavedModerated(isModerated);
    setSavedBelievers(state.rumorBelievers);
  };

  const handleClearBaseline = () => {
    setSavedHistory(null);
    setSavedModerated(null);
    setSavedBelievers(null);
  };

  // Clustered 15-Node Social Network Coordinates (Fits perfectly inside 300x200 canvas)
  const positions = [
    { x: 40, y: 35, label: 'Troll Seed (Source)', cluster: 'seed' },
    { x: 105, y: 75, label: 'Alt-News Hub', cluster: 'influencer' },
    { x: 185, y: 110, label: 'Viral Anchor', cluster: 'influencer' },
    { x: 260, y: 55, label: 'Journalist Feed', cluster: 'journalist' },
    // Echo Chamber Nodes
    { x: 80, y: 115, label: 'Echo Node A1', cluster: 'echo' },
    { x: 125, y: 135, label: 'Echo Node A2', cluster: 'echo' },
    { x: 135, y: 95, label: 'Echo Node A3', cluster: 'echo' },
    // Outrage Amplifier Nodes
    { x: 175, y: 160, label: 'Amp Node B1', cluster: 'amp' },
    { x: 220, y: 155, label: 'Amp Node B2', cluster: 'amp' },
    { x: 215, y: 80, label: 'Amp Node B3', cluster: 'amp' },
    // General Citizens
    { x: 50, y: 175, label: 'Citizen Base C1', cluster: 'citizen' },
    { x: 100, y: 185, label: 'Citizen Base C2', cluster: 'citizen' },
    { x: 150, y: 180, label: 'Citizen Base C3', cluster: 'citizen' },
    { x: 265, y: 170, label: 'Citizen Base C4', cluster: 'citizen' },
    { x: 280, y: 115, label: 'Citizen Base C5', cluster: 'citizen' }
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 4 },
    { from: 1, to: 4 },
    { from: 1, to: 5 },
    { from: 1, to: 6 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 2 },
    { from: 5, to: 7 },
    { from: 2, to: 7 },
    { from: 2, to: 8 },
    { from: 2, to: 9 },
    { from: 8, to: 9 },
    { from: 9, to: 3 },
    { from: 8, to: 13 },
    { from: 3, to: 14 },
    { from: 3, to: 13 },
    { from: 4, to: 10 },
    { from: 5, to: 11 },
    { from: 7, to: 12 },
    { from: 10, to: 11 },
    { from: 11, to: 12 },
    { from: 12, to: 8 },
    { from: 13, to: 14 }
  ];

  // Logic mapping current status
  const getNodeStatus = (idx: number) => {
    if (isModerated) {
      if (idx === 0) {
        return activeStep === 0 ? 'infected' : 'neutralized';
      }
      if ((idx === 1 || idx === 4) && activeStep >= 1) {
        return 'shielded';
      }
      return 'neutral';
    } else {
      if (idx === 0) return 'infected';
      if (activeStep >= 1 && (idx === 1 || idx === 4)) return 'infected';
      if (activeStep >= 2 && (idx === 5 || idx === 6)) return 'infected';
      if (activeStep >= 3 && (idx === 2 || idx === 7 || idx === 8 || idx === 9)) return 'infected';
      if (activeStep >= 4 && (idx === 10 || idx === 11 || idx === 12 || idx === 13)) return 'infected';
      if (activeStep >= 5) return 'infected';
      return 'neutral';
    }
  };

  // Determine line highlights based on step contagion timing
  const isLineInfected = (from: number, to: number) => {
    if (isModerated) return false;
    const sFrom = getNodeStatus(from);
    const sTo = getNodeStatus(to);
    return sFrom === 'infected' && sTo === 'infected';
  };

  // Calculation of Panic level indicator
  const getPanicScore = () => {
    if (isModerated) {
      if (activeStep === 0) return 5;
      if (activeStep === 1) return 10;
      return 0;
    }
    const scores = [5, 20, 45, 72, 90, 100];
    return scores[Math.min(activeStep, 5)];
  };

  const panicMetric = getPanicScore();

  // dynamic max for adaptive line scaling
  const maxHistoryValue = Math.max(
    ...history.map((h: any) => h.rumorBelievers || 0),
    ...(savedHistory ? savedHistory.map((h: any) => h.rumorBelievers || 0) : []),
    200
  );

  const scaleY = (val: number) => {
    const minHeight = 105;
    const maxHeight = 10;
    const ratio = Math.min((val || 0) / maxHistoryValue, 1);
    return minHeight - ratio * (minHeight - maxHeight);
  };

  const scaleX = (idx: number) => {
    return 35 + idx * 42;
  };

  const activeCurvePoints = history.slice(0, activeStep + 1).map((h, idx) => {
    return `${scaleX(idx)},${scaleY(h.rumorBelievers)}`;
  }).join(' ');

  const savedCurvePoints = savedHistory
    ? savedHistory.map((h, idx) => `${scaleX(idx)},${scaleY(h.rumorBelievers)}`).join(' ')
    : '';

  return (
    <div id="visualizer-fake-news" className="w-full bg-slate-900 border border-slate-850 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-amber-500 uppercase tracking-widest block font-bold">ALGORITHMIC CASCADE MATRIX</span>
          <h3 className="text-sm font-bold text-slate-100">Contagion Networks & Social Feedback Dynamics</h3>
        </div>
        <div className="flex items-center gap-2">
          {savedHistory ? (
            <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-900/50 px-2 py-1 rounded text-[10px] font-mono">
              <span className="text-amber-400 font-bold">● REF FILED:</span>
              <span className="text-slate-350">{savedModerated ? 'Early Moderated' : 'Unchecked Run'} ({savedBelievers?.toLocaleString()} Believers)</span>
              <button 
                onClick={handleClearBaseline} 
                className="ml-1 px-1 rounded bg-rose-955 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[9px]"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              onClick={handleCaptureBaseline}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded text-[10.5px] font-mono border border-amber-505 font-bold transition-all flex items-center gap-1"
            >
              🔒 Capture Cascade Baseline
            </button>
          )}
        </div>
      </div>

      {/* DOUBLE PANEL LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COMPARTMENT: INTERACTIVE NETWORK VISUALIZER */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
            <div className="flex gap-1.5 bg-slate-900 p-0.5 rounded border border-slate-800">
              <button 
                onClick={() => setActiveTab('network')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'network' ? 'bg-slate-955 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                🌐 Information Flow Graph
              </button>
              <button 
                onClick={() => setActiveTab('metrics')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'metrics' ? 'bg-slate-955 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                🔍 Feedback Loop Logic
              </button>
            </div>

            <div className="text-[10px] font-mono flex items-center gap-1.5">
              <span className="text-zinc-500 font-mono">Platform State:</span>
              <span className={`px-1.5 rounded font-bold ${isModerated ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                {isModerated ? 'INTERVENED' : 'UNRESTRICTED'}
              </span>
            </div>
          </div>

          <div className="relative min-h-[220px] bg-slate-900/40 rounded border border-slate-900 p-2.5 flex items-center justify-center overflow-hidden">
            
            {activeTab === 'network' && (
              <svg className="w-full h-full min-h-[220px]" viewBox="0 0 310 215">
                {/* Connection lines */}
                {connections.map((c, idx) => {
                  const start = positions[c.from];
                  const end = positions[c.to];
                  const infectedLine = isLineInfected(c.from, c.to);
                  const representsLeak = (c.from === 0 && isModerated);

                  let strokeColor = '#1e293b';
                  let strokeWidth = '1.0';

                  if (infectedLine) {
                    strokeColor = '#f43f5e';
                    strokeWidth = '1.8';
                  } else if (representsLeak) {
                    strokeColor = '#06b6d4';
                    strokeWidth = '1.5';
                  }

                  return (
                    <g key={`edge-${idx}`}>
                      <line
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={representsLeak ? '3 2' : undefined}
                        className="transition-all duration-300"
                      />
                      {/* Interactive cascade pulse bubbles */}
                      {infectedLine && (
                        <circle cx={start.x} cy={start.y} r="2" fill="#f43f5e">
                          <animateMotion
                            path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Node Circles */}
                {positions.map((node, i) => {
                  const status = getNodeStatus(i);
                  let nodeColor = '#334155';
                  let strokeColor = '#1e293b';
                  let customRadius = 6.5;

                  if (status === 'infected') {
                    nodeColor = '#ef4444';
                    strokeColor = '#ff8a8a';
                  } else if (status === 'neutralized') {
                    nodeColor = '#3b82f6';
                    strokeColor = '#60a5fa';
                  } else if (status === 'shielded') {
                    nodeColor = '#10b981';
                    strokeColor = '#34d399';
                    customRadius = 7.5;
                  }

                  // Label nodes with high degree to represent influencer hubs
                  const isHub = i <= 3;
                  if (isHub) customRadius += 2.0;

                  return (
                    <g key={`node-${i}`} className="cursor-help transition-all duration-300">
                      {status === 'shielded' && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={customRadius + 4}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                          className="animate-spin"
                        />
                      )}

                      {status === 'infected' && isHub && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={customRadius + 6}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="1.2"
                          className="animate-pulse"
                        />
                      )}

                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={customRadius}
                        fill={nodeColor}
                        stroke={strokeColor}
                        strokeWidth="1.5"
                        className="transition-all duration-350"
                      />

                      {/* Icon identifiers on nodes */}
                      {isHub && (
                        <text
                          x={node.x}
                          y={node.y + 3.2}
                          className="text-[8px] font-extrabold fill-white font-mono"
                          textAnchor="middle"
                        >
                          {i === 0 ? '☠' : i === 1 ? 'A' : i === 2 ? '⚡' : '✎'}
                        </text>
                      )}

                      {/* Display Node ID labels above to emphasize network topologies */}
                      {isHub && (
                        <text
                          x={node.x}
                          y={node.y - customRadius - 4}
                          className="text-[7.5px] font-semibold fill-slate-350 font-mono"
                          textAnchor="middle"
                        >
                          {node.label.split(' ')[0]}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {activeTab === 'metrics' && (
              <div className="w-full text-xs font-mono text-zinc-300 leading-relaxed space-y-2">
                <h4 className="text-zinc-100 font-bold uppercase mb-1">Feedback Loops in Social Systems</h4>
                <p>
                  Social cascades depend completely on initial reaction timing of content safety policies. System loops proceed via:
                </p>
                <div className="bg-slate-950/80 border border-slate-900 rounded p-2 text-[10.5px] text-amber-305 space-y-1.5 leading-normal">
                  <div>1. <strong>Sensational Hook:</strong> Extreme stories get premium click-through rates.</div>
                  <div>2. <strong>Algorithmic Feed tops:</strong> Unmoderated posts get organic boost which triggers more views.</div>
                  <div>3. <strong>Runaway Contagion:</strong> Influencers repeat unverified rumors. Gaps bridge instantly.</div>
                  <div>4. <strong>Quarantine:</strong> Early labeling intercepts the vector instantly at Cycle 1.</div>
                </div>
              </div>
            )}

          </div>

          <div className="mt-2.5 bg-amber-955/20 p-2.5 rounded border border-amber-900/30 text-[10.5px] text-amber-200 font-mono flex items-start gap-2">
            <span className="text-amber-400 font-bold shrink-0">ROUTING REPORT:</span>
            {activeStep === 0 ? (
              <span>Ready. Move to Cycle 1. Choose early moderation to flag and isolate the coordinated Troll Seed.</span>
            ) : (
              <span>Cascade active at Cycle {activeStep}. Outrage feeds are currently driven by a {isModerated ? 'Flagged Quarantine policy' : 'Laissez-Faire organic flow'}.</span>
            )}
          </div>

        </div>

        {/* RIGHT COMPARTMENT: PANIC METERS & COMPARATIVE SPREAD TRENDS */}
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">System Indicators</span>
            <h4 className="text-[12px] font-bold text-slate-100">Harmful Misinformation Panic Index</h4>
            <p className="text-[11px] text-zinc-500 leading-tight mt-0.5 mb-2 font-normal">
              Measures perceived social unrest and public trust damage.
            </p>
          </div>

          {/* Social Panic Gauge */}
          <div className="my-2 p-3 bg-slate-900/65 rounded border border-slate-900 text-center relative overflow-hidden">
            <div className="absolute top-2 left-2 text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase">Panic Level</div>
            <div className="mt-2 text-3xl font-extrabold font-mono tracking-tight text-white flex items-center justify-center gap-1.5">
              <span className={panicMetric > 60 ? 'text-rose-500 animate-pulse' : panicMetric > 0 ? 'text-amber-400' : 'text-emerald-450'}>
                {panicMetric}%
              </span>
            </div>

            {/* Horizontal progress bar with exact color transitions */}
            <div className="w-full h-2 bg-slate-950 rounded-full mt-2 overflow-hidden relative border border-slate-900">
              <div 
                className={`h-full rounded-full transition-all duration-350 ${panicMetric > 60 ? 'bg-rose-550' : panicMetric > 0 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                style={{ width: `${Math.max(panicMetric, 1.5)}%` }}
              />
            </div>

            <p className="text-[10.5px] font-mono mt-2 text-zinc-400">
              {panicMetric >= 90 
                ? '💀 SYSTEM ESCALATION: Real-world civil unrest and public office protests.' 
                : panicMetric > 0 
                ? `⚠️ CHATTER ACTIVE: Rumors creeping into local feed topics.` 
                : '🟢 STABLE: Misinformation contained before key influencers shared.'
              }
            </p>
          </div>

          {/* Belief scale comparison line graph */}
          <div className="relative min-h-[110px] my-2 p-1 bg-slate-950">
            <svg className="w-full h-full min-h-[110px]" viewBox="0 0 250 115" preserveAspectRatio="none">
              <line x1="35" y1="10" x2="240" y2="10" stroke="#101827" strokeDasharray="1 3" />
              <line x1="35" y1="57" x2="240" y2="57" stroke="#161f30" strokeDasharray="2 2" />
              <line x1="35" y1="105" x2="240" y2="105" stroke="#1e293b" />
              <line x1="35" y1="10" x2="35" y2="105" stroke="#1e293b" />

              {/* Y Axis marks */}
              <text x="2" y="14" className="text-[7.5px] fill-zinc-500 font-mono">{maxHistoryValue >= 1000 ? `${Math.round(maxHistoryValue/1000)}k` : maxHistoryValue}</text>
              <text x="2" y="61" className="text-[7.5px] fill-zinc-550 font-mono">{Math.round(maxHistoryValue / 2)}</text>
              <text x="2" y="108" className="text-[7.5px] fill-zinc-550 font-mono">0</text>

              {/* X Axis Cycles */}
              {Array.from({ length: 6 }).map((_, cIdx) => (
                <text key={`fc-x-${cIdx}`} x={scaleX(cIdx)} y="113" className="text-[7.5px] fill-zinc-500 font-mono" textAnchor="middle">
                  c{cIdx}
                </text>
              ))}

              {/* Baseline trajectory line (yellow dash) */}
              {savedCurvePoints && (
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                  points={savedCurvePoints}
                />
              )}

              {/* Live trajectory line (red or green depending on moderation status) */}
              {activeCurvePoints && (
                <polyline
                  fill="none"
                  stroke={isModerated ? '#10b981' : '#f43f5e'}
                  strokeWidth="2.2"
                  points={activeCurvePoints}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              )}

              {/* Node index marker */}
              {history[activeStep] && (
                <circle
                  cx={scaleX(activeStep)}
                  cy={scaleY(state.rumorBelievers)}
                  r="3.5"
                  fill="#ffffff"
                  stroke={isModerated ? '#10b981' : '#f43f5e'}
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-550 border-t border-slate-900 pt-2.5">
            <span className="flex items-center gap-1.5 animate-pulse">
              <span className={`w-2.5 h-0.5 inline-block rounded ${isModerated ? 'bg-emerald-500' : 'bg-rose-500'}`} /> Citizens Believed
            </span>
            {savedHistory !== null && (
              <span className="text-amber-500 font-bold whitespace-nowrap">
                🔒 Baseline: {savedModerated ? 'Moderated' : 'Unrestricted'} ({savedBelievers?.toLocaleString()} people)
              </span>
            )}
          </div>

        </div>

      </div>

      {/* DETAILED LEDGER COMPARTMENT WITH INTEGRATED BULLET INSIGHT */}
      <div className={`p-4 rounded-lg border text-xs flex gap-3 items-start transition-all duration-300 ${!isModerated && activeStep >= 4 ? 'bg-rose-955/30 border-rose-900/50 text-rose-100' : 'bg-slate-950 border-slate-850 text-slate-300'}`}>
        <div className={`p-1.5 rounded shrink-0 ${!isModerated && activeStep >= 3 ? 'bg-rose-600 text-white animate-pulse' : 'bg-indigo-500 text-slate-950'}`}>
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="space-y-1 flex-1">
          <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider block font-bold font-mono">Platform Content Ledger Log</span>
          <p className="leading-relaxed font-sans text-[11.5px]">{state.cascadeUpdate}</p>

          {/* Educational Feedback reflection block on run completion */}
          {activeStep === 5 && (
            <div className="mt-2.5 bg-indigo-950/35 p-2.5 rounded border border-indigo-900/40 text-[11px] leading-relaxed text-indigo-200">
              <span className="font-bold text-indigo-400 block font-mono">🔍 NON-LINEAR CASCADE REFLECTION:</span>
              {!isModerated ? (
                <span>Lack of early fact-checking allowed the false news to go viral, affecting millions by Cycle 5. Uncontrollable positive loops caused believers to spike from a base of 10 to <strong className="text-white">{state.rumorBelievers.toLocaleString()}</strong>, dragging Platform Trust to a critical <strong className="text-white">{state.trustIndex}/100</strong>. This shows how early content routing shapes long-term system stability! Try turning on the <strong>Early Moderation toggle</strong> to watch the loop get stymied immediately.</span>
              ) : (
                <span>Excellent! Early moderation at Cycle 1 successfully stymied transmission vectors immediately. Deceived believers remained stunted at just <strong className="text-white">{state.rumorBelievers} citizens</strong> while platform credibility stayed high at <strong className="text-white">{state.trustIndex}/100</strong>. Small changes in initial moderation policy completely bifurcate global social trust outcomes!</span>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

function ViralTippingVisualizer({ state, activeStep, controls, history = [] }: any) {
  const initial = Number(controls.initialAdopters ?? 21);
  const rate = state.adoptionRate ?? 21;
  const isViral = initial >= 25;
  const [activeTab, setActiveTab] = React.useState<'stadium' | 'metrics'>('stadium');

  // Baseline comparison storage
  const [savedHistory, setSavedHistory] = React.useState<any[] | null>(null);
  const [savedInitial, setSavedInitial] = React.useState<number | null>(null);
  const [savedRate, setSavedRate] = React.useState<number | null>(null);

  const handleCaptureBaseline = () => {
    setSavedHistory([...history]);
    setSavedInitial(initial);
    setSavedRate(state.adoptionRate);
  };

  const handleClearBaseline = () => {
    setSavedHistory(null);
    setSavedInitial(null);
    setSavedRate(null);
  };

  // 80 individuals in the arena (10x8 matrix)
  // Incorporate stubborn agents determinants: e.g. 8 indices that never adopt.
  // This illustrates realistic social networks where stubborn blocks resist.
  const totalAudienceCount = 80;
  const stubbornIndices = [13, 27, 34, 45, 59, 62, 71, 78];

  const audience = Array.from({ length: totalAudienceCount }).map((_, i) => {
    const isStubborn = stubbornIndices.includes(i);
    // Is this onlooker an initial seed influencer?
    const isInitialSeed = !isStubborn && i < Math.ceil((initial / 100) * totalAudienceCount);
    
    let adopted = false;
    let classification = 'neutral'; // neutral, seed, stubborn, adopted

    if (isInitialSeed) {
      adopted = true;
      classification = 'seed';
    } else if (isStubborn) {
      adopted = false;
      classification = 'stubborn';
    } else if (activeStep > 0) {
      if (isViral) {
        // Epidemic bandwagon cascade: rate controls what % of available non-stubborn adopts
        const capacityIndex = Math.ceil((rate / 100) * totalAudienceCount);
        if (i < capacityIndex) {
          adopted = true;
          classification = 'adopted';
        }
      } else {
        // Below critical mass: fades out.
        // Some adjacent nodes might adopt in early step, but eventually collapse.
        if (activeStep <= 2) {
          const earlyLimit = Math.ceil((initial * 1.1 / 100) * totalAudienceCount);
          if (i < earlyLimit) {
            adopted = true;
            classification = 'adopted';
          }
        }
      }
    }

    return { idx: i, adopted, classification };
  });

  // Calculate dynamic max value for Cartesian line scaling
  const maxScaleValue = Math.max(
    ...history.map((h: any) => h.adoptionRate || 0),
    ...(savedHistory ? savedHistory.map((h: any) => h.adoptionRate || 0) : []),
    100
  );

  const scaleY = (val: number) => {
    const minHeight = 105;
    const maxHeight = 10;
    const ratio = Math.min((val || 0) / maxScaleValue, 1);
    return minHeight - ratio * (minHeight - maxHeight);
  };

  const scaleX = (idx: number) => {
    return 35 + idx * 34; // fits 7 step history (0 to 6)
  };

  const activeCurvePoints = history.slice(0, activeStep + 1).map((h, idx) => {
    return `${scaleX(idx)},${scaleY(h.adoptionRate)}`;
  }).join(' ');

  const savedCurvePoints = savedHistory
    ? savedHistory.map((h, idx) => `${scaleX(idx)},${scaleY(h.adoptionRate)}`).join(' ')
    : '';

  return (
    <div id="visualizer-tipping" className="w-full bg-slate-900 border border-slate-850 text-white rounded-xl p-5 shadow-inner flex flex-col gap-5">
      
      {/* HEADER COUPLING */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-indigo-405 uppercase tracking-widest block font-bold">NON-LINEAR SOCIAL TIPPING FRAME</span>
          <h3 className="text-sm font-bold text-slate-100 font-sans">Critical Mass & Overcoming Silent Majority Resistance</h3>
        </div>
        <div className="flex items-center gap-2">
          {savedHistory ? (
            <div className="flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-900/50 px-2 py-1 rounded text-[10px] font-mono">
              <span className="text-amber-400 font-bold">● REFERENCE RECORDED:</span>
              <span className="text-slate-300">Seed {savedInitial}% ({savedRate}% final rate)</span>
              <button 
                onClick={handleClearBaseline} 
                className="ml-1 px-1 rounded bg-rose-955 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[9px]"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              onClick={handleCaptureBaseline}
              className="px-2.5 py-1 bg-indigo-650 hover:bg-indigo-500 text-white rounded text-[10.5px] font-mono border border-indigo-505 transition-all flex items-center gap-1"
            >
              🔒 Guard Trend Seed Baseline
            </button>
          )}
        </div>
      </div>

      {/* DOUBLE PANEL SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COMPARTMENT: 10x8 STADIUM MATRIX GRAPH */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
            <div className="flex gap-1.5 bg-slate-900 p-0.5 rounded border border-slate-800">
              <button 
                onClick={() => setActiveTab('stadium')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'stadium' ? 'bg-slate-955 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                🏟️ Adoption Stadium Mesh
              </button>
              <button 
                onClick={() => setActiveTab('metrics')}
                className={`px-3 py-1 text-[10px] font-mono rounded font-medium transition-all ${activeTab === 'metrics' ? 'bg-slate-955 text-white border border-slate-850' : 'text-slate-400 hover:text-white'}`}
              >
                🧬 Granovetter Threshold Logic
              </button>
            </div>

            <div className="text-[10px] font-mono flex items-center gap-1">
              <span className="text-zinc-550 font-medium font-mono">Collective Mode:</span>
              <span className={`px-1.5 rounded font-bold ${isViral ? 'bg-emerald-950 text-emerald-400 border border-emerald-990 animate-pulse' : 'bg-rose-955 text-rose-405 border border-rose-990'}`}>
                {isViral ? 'CASCADING' : 'STAGNATED'}
              </span>
            </div>
          </div>

          <div className="relative min-h-[220px] bg-slate-900/40 rounded border border-slate-900 p-3.5 flex items-center justify-center overflow-hidden">
            
            {activeTab === 'stadium' && (
              <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">
                  80 Seat Group Stadium Node Distribution
                </span>
                <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
                  {audience.map((a) => {
                    let bg = 'bg-slate-800 text-slate-600 border border-slate-700/60';
                    let statusLabel = 'Onlooker';

                    if (a.classification === 'seed') {
                      bg = 'bg-indigo-500 text-indigo-100 border border-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)] animate-[pulse_1.5s_infinite]';
                      statusLabel = 'Influencer Seed';
                    } else if (a.classification === 'stubborn') {
                      bg = 'bg-zinc-700 text-zinc-500 border border-zinc-600 shrink-0';
                      statusLabel = '頑固 Stubborn Resister';
                    } else if (a.classification === 'adopted') {
                      bg = 'bg-emerald-500 text-white border border-white shadow-[0_0_8px_rgba(16,185,129,0.4)]';
                      statusLabel = 'Active Adopter';
                    }

                    return (
                      <div 
                        key={a.idx} 
                        className={`h-4.5 w-4.5 rounded-sm flex items-center justify-center text-[8px] font-bold ${bg} transition-all duration-300 cursor-help`}
                        title={`Seat ID ${a.idx} - ${statusLabel}`}
                      >
                        {a.classification === 'seed' && '★'}
                        {a.classification === 'stubborn' && 'X'}
                        {a.classification === 'adopted' && '✓'}
                      </div>
                    );
                  })}
                </div>

                {/* Micro legend */}
                <div className="flex flex-wrap gap-3 items-center justify-center text-[9px] font-mono text-zinc-500 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-indigo-500 border border-indigo-400 block" /> Seed (★)
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-slate-800 border border-slate-700 block" /> Onlooker
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-emerald-500 border border-white block" /> Adopter (✓)
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-zinc-700 border border-zinc-600 block" /> Stubborn (X)
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="w-full text-xs font-mono text-zinc-300 leading-relaxed space-y-2 p-1">
                <h4 className="text-zinc-100 font-bold uppercase mb-1">Sociological Bandwagon Mechanics</h4>
                <p>
                  Granovetter's threshold network rules formulate adoption as peer-dependent cascades. Under normal distributions:
                </p>
                <div className="bg-slate-950/80 border border-slate-900 rounded p-2.5 text-[10px] text-indigo-350 space-y-1.5 leading-normal">
                  <div>• <strong>Critical Minority (25%):</strong> Once 25% of individuals aggressively adopt, peer pressures on surrounding onlookers multiply exponentially.</div>
                  <div>• <strong>Cascade Core:</strong> At 24% or below, the effort stalls. Skeptics ignore the trend. It decays.</div>
                  <div>• <strong>Minority Power:</strong> Sociological research proves exactly 1 supportive seed difference across this tipping line completely flips state basins!</div>
                </div>
              </div>
            )}

          </div>

          <div className="mt-2.5 bg-indigo-950/20 p-2.5 rounded border border-indigo-900/30 text-[10px] text-indigo-200 font-mono flex items-start gap-2">
            <span className="text-indigo-400 font-bold shrink-0">STADIUM STATUS:</span>
            {activeStep === 0 ? (
              <span>Inactive. Adjust current initial influencer rate to cross 25% boundary. Forward to Cycle 1 to spark feedback loops.</span>
            ) : (
              <span>Adoption cascade in progress at Round {activeStep}. Outflow is driven by a {initial}% initial seeding.</span>
            )}
          </div>

        </div>

        {/* RIGHT COMPARTMENT: GAUGES & CHARTS */}
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">Societal Adopters</span>
            <h4 className="text-[12px] font-bold text-slate-100">Cumulative Social Network Adoption</h4>
            <p className="text-[11px] text-zinc-500 leading-tight mt-0.5 mb-2 font-normal whitespace-normal">
              A 25% initial support base flips the silent majority.
            </p>
          </div>

          {/* Semicircle Gauge / Population Card */}
          <div className="my-2 p-3 bg-slate-900/65 rounded border border-slate-900 text-center relative overflow-hidden">
            <span className="text-xs font-mono text-zinc-500 block text-left mb-1">Adoption level</span>
            <div className="mt-1 text-3xl font-extrabold font-mono tracking-tight text-white flex items-center justify-center gap-1">
              <span className={isViral ? 'text-emerald-400' : 'text-zinc-400'}>
                {rate}%
              </span>
              <span className="text-xs text-zinc-500 font-sans">Adopters</span>
            </div>

            {/* Population bar */}
            <div className="w-full h-2.5 bg-slate-950 rounded mt-2.5 overflow-hidden relative border border-slate-900/80">
              <div 
                className={`h-full transition-all duration-350 ${isViral ? 'bg-emerald-600' : 'bg-slate-700'}`}
                style={{ width: `${Math.min(rate, 100)}%` }}
              />
              {/* Tipping threshold locator line at 25% of width */}
              <div className="absolute top-0 bottom-0 left-[25%] w-0.5 bg-white z-10" />
            </div>

            <p className="text-xs font-mono mt-2 text-zinc-400 leading-relaxed">
              {isViral 
                ? 'Adoption threshold met (≥25%): self-reinforcing norm cascade is active.' 
                : 'Subcritical adoption (<25%): peer pressure insufficient to sustain diffusion.'
              }
            </p>
          </div>

          {/* Dynamic Cartesian Trend Line */}
          <div className="relative min-h-[110px] my-2 p-1 bg-slate-955">
            <svg className="w-full h-full min-h-[110px]" viewBox="0 0 250 115" preserveAspectRatio="none">
              <line x1="35" y1="10" x2="240" y2="10" stroke="#101827" strokeDasharray="1 3" />
              <line x1="35" y1="57" x2="240" y2="57" stroke="#161f30" strokeDasharray="2 2" />
              <line x1="35" y1="105" x2="240" y2="105" stroke="#1e293b" />
              <line x1="35" y1="10" x2="35" y2="105" stroke="#1e293b" />

              {/* Y Axis designations */}
              <text x="2" y="14" className="text-[7.5px] fill-zinc-500 font-mono">100%</text>
              <text x="2" y="61" className="text-[7.5px] fill-zinc-500 font-mono">50%</text>
              <text x="2" y="108" className="text-[7.5px] fill-zinc-500 font-mono">0%</text>

              {/* X Axis rounds */}
              {Array.from({ length: 7 }).map((_, rIdx) => (
                <text key={`trend-x-${rIdx}`} x={scaleX(rIdx)} y="113" className="text-[7.5px] fill-zinc-500 font-mono" textAnchor="middle">
                  R{rIdx}
                </text>
              ))}

              {/* Saved comparison curve (yellow dashed) */}
              {savedCurvePoints && (
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                  points={savedCurvePoints}
                />
              )}

              {/* Active curve plotting */}
              {activeCurvePoints && (
                <polyline
                  fill="none"
                  stroke={isViral ? '#10b981' : '#ef4444'}
                  strokeWidth="2.2"
                  points={activeCurvePoints}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              )}

              {/* Active marker point */}
              {history[activeStep] && (
                <circle
                  cx={scaleX(activeStep)}
                  cy={scaleY(rate)}
                  r="3.5"
                  fill="#ffffff"
                  stroke={isViral ? '#10b981' : '#ef4444'}
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 border-t border-slate-900 pt-2.5">
            <span className="flex items-center gap-1.5 font-mono">
              <span className={`w-2.5 h-0.5 inline-block rounded ${isViral ? 'bg-emerald-500' : 'bg-rose-500'}`} /> Active Trend Line
            </span>
            {savedHistory !== null && (
              <span className="text-amber-500 font-bold whitespace-nowrap">
                🔒 Baseline Saved: {savedInitial}% Seeding ({savedRate}% final)
              </span>
            )}
          </div>

        </div>

      </div>

      {/* TEXTUAL REFLECTION LESSON HIGHLIGHTER */}
      <div className={`p-4 rounded-lg border text-xs flex gap-3 items-start transition-all duration-305 ${isViral ? 'bg-emerald-955/20 border-emerald-900/40 text-emerald-150' : 'bg-rose-955/20 border-rose-900/45 text-rose-100'}`}>
        <div className={`p-1.5 rounded shrink-0 ${isViral ? 'bg-emerald-600 text-slate-950' : 'bg-rose-600 text-white animate-pulse'}`}>
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="space-y-1 flex-1">
          <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider block font-bold font-mono">Sociological Outflow Bulletin Report</span>
          <p className="leading-relaxed font-sans text-[11.5px]">{state.tippingStatus}</p>

          {/* Primary Educational Insight: "Notice how adding a single extra influencer..." */}
          {activeStep === 6 && (
            <div className="mt-2.5 bg-indigo-950/35 p-2.5 rounded border border-indigo-900/40 text-[11px] leading-relaxed text-indigo-205">
              <span className="font-bold text-indigo-400 block font-mono">🔍 NON-LINEAR TIPPING REFLECTION:</span>
              Notice how adding a single extra influencer at the start (from 24% to 25% support) completely changed the outcome – a social tipping point was crossed. Below 25%, early interest decay overcomes adoption pull, and the movement drops back to just <strong className="text-white">{rate}% adopters</strong>. But passing exactly 25% triggers social cascade loops, overcoming stubborn resisters and pushing adoption to <strong className="text-white">{rate}%</strong>! This illustrates the deep sensitivity and phase transitions of interconnected group minds.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
