/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Lightbulb,
  AlertTriangle,
  Menu,
  X,
  Layers,
  Sparkles,
  HelpCircle,
  Play
} from 'lucide-react';
import { SCENARIO_LIST } from './data/scenarios';
import ScenarioSidebar from './components/ScenarioSidebar';
import SimulationControls from './components/SimulationControls';
import MetricCards from './components/MetricCards';
import Visualizer from './components/Visualizer';

export default function App() {
  // Scenario selection
  const [currentScenarioId, setCurrentScenarioId] = useState('market-panic');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Find active definition
  const scenario = SCENARIO_LIST.find((s) => s.id === currentScenarioId) || SCENARIO_LIST[0];

  // Control inputs: stores values for the slider/toggle controls of the active scenario
  const [controlValues, setControlValues] = useState<Record<string, number | boolean>>(() => {
    const defaults: Record<string, number | boolean> = {};
    scenario.controls.forEach((c) => {
      defaults[c.id] = c.defaultValue;
    });
    return defaults;
  });

  // Track state history: history[k] is the mathematical model state at step k
  const [activeStep, setActiveStep] = useState<number>(0);
  const [history, setHistory] = useState<Record<string, any>[]>([scenario.initialState]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Track the timer ref for auto-play
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to align defaults when switching scenarios
  const selectScenario = useCallback((id: string) => {
    const nextScenario = SCENARIO_LIST.find((s) => s.id === id) || SCENARIO_LIST[0];
    setCurrentScenarioId(id);
    setIsMobileMenuOpen(false);
    setIsPlaying(false);

    // Bootstrap defaults
    const defaults: Record<string, number | boolean> = {};
    nextScenario.controls.forEach((c) => {
      defaults[c.id] = c.defaultValue;
    });
    setControlValues(defaults);

    // Reset trajectory
    setActiveStep(0);
    setHistory([nextScenario.initialState]);
  }, []);

  // Set control inputs dynamically
  const changeControl = useCallback((controlId: string, value: number | boolean) => {
    setControlValues((prev) => ({
      ...prev,
      [controlId]: value,
    }));

    // Reset run on change to keep inputs synchronized
    setIsPlaying(false);
    setActiveStep(0);
    setHistory([scenario.initialState]);
  }, [scenario]);

  // Reset helper
  const resetSimulation = useCallback(() => {
    setIsPlaying(false);
    setActiveStep(0);
    setHistory([scenario.initialState]);
  }, [scenario]);

  // Core single step forwards multiplier calculation
  const stepForward = useCallback(() => {
    if (activeStep >= scenario.maxSteps) {
      setIsPlaying(false);
      return;
    }

    const nextStep = activeStep + 1;
    const previousState = history[activeStep];
    
    // Evaluate the new mathematical state based on step, previous, and current sliders
    const nextState = scenario.calculateStep(nextStep, previousState, controlValues);

    setHistory((prevHistory) => {
      const nextHistory = [...prevHistory];
      nextHistory[nextStep] = nextState;
      return nextHistory;
    });
    setActiveStep(nextStep);
  }, [activeStep, history, scenario, controlValues]);

  // Setup loop for auto-pacing simulation
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setActiveStep((currStep) => {
          if (currStep >= scenario.maxSteps) {
            setIsPlaying(false);
            if (playTimerRef.current) clearInterval(playTimerRef.current);
            return currStep;
          }
          
          const nextStep = currStep + 1;
          setHistory((prevHistory) => {
            const previousState = prevHistory[currStep];
            const nextState = scenario.calculateStep(nextStep, previousState, controlValues);
            const nextHistory = [...prevHistory];
            nextHistory[nextStep] = nextState;
            return nextHistory;
          });
          
          return nextStep;
        });
      }, 1500);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, scenario, controlValues]);

  const togglePlay = () => {
    if (activeStep >= scenario.maxSteps) {
      // Auto wrap around to start if played fully
      setActiveStep(0);
      setHistory([scenario.initialState]);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Get active step results
  const currentState = history[activeStep] || scenario.initialState;
  const analysisReport = scenario.analysis(currentState, controlValues);

  return (
    <div id="systems-chaos-dashboard" className="flex flex-col lg:flex-row h-screen w-screen bg-slate-50 overflow-hidden font-sans text-slate-800 antialiased">
      
      {/* MOBILE CONTROL BAR (Hidden on large screens) */}
      <div id="mobile-control-bar" className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white z-40 border-b border-slate-800 shadow-md shrink-0">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Chaos model Thinking Logo" 
            className="h-6 w-6 object-contain rounded-md" 
            referrerPolicy="no-referrer"
          />
          <span className="font-semibold text-sm tracking-tight">Chaos model Thinking</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 rounded hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-700 cursor-pointer"
          aria-label="Toggle navigation drawer"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* OVERLAY NAVIGATION DRAWER FOR MOBILE */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/45 z-30 transition-opacity duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-72 max-w-[80vw] h-full bg-white shadow-2xl relative z-40 overflow-y-auto"
          >
            <ScenarioSidebar
              scenarios={SCENARIO_LIST}
              currentId={currentScenarioId}
              onSelect={selectScenario}
            />
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR MENU (Permanent) */}
      <div className="hidden lg:block shrink-0 h-full">
        <ScenarioSidebar
          scenarios={SCENARIO_LIST}
          currentId={currentScenarioId}
          onSelect={selectScenario}
        />
      </div>

      {/* MAIN MAIN VIEWPORT AREA */}
      <main id="simulation-viewport" className="flex-1 overflow-y-auto flex flex-col p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* SCENARIO HEADER SUMMARY CARD */}
        <section id="scenario-explanation-card" className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-3 relative overflow-hidden">
          {/* Subtle category tag top-left decoration */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-700 uppercase bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
              {scenario.domain} Domain
            </span>
            <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-slate-150">
              <Sparkles className="h-3 w-3 text-amber-500" />
              Focus: {scenario.chaosConcept}
            </span>
          </div>

          <div className="mt-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              {scenario.name}
            </h2>
            <div className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal flex gap-2">
              <HelpCircle className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-800 font-semibold font-mono">Learning Objective:</strong> {scenario.learningObjective}
              </p>
            </div>
          </div>

          {/* Graphic corner flair */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full opacity-60 pointer-events-none" />
        </section>

        {/* INPUTS PANEL AND TIMELINE ACTION CONTROLS */}
        <section id="interaction-controls-panel">
          <SimulationControls
            controls={scenario.controls}
            values={controlValues}
            onChangeControl={changeControl}
            activeStep={activeStep}
            maxSteps={scenario.maxSteps}
            timeLabel={scenario.timeLabel}
            isPlaying={isPlaying}
            onPlayToggle={togglePlay}
            onStepForward={stepForward}
            onReset={resetSimulation}
          />
        </section>

        {/* METRICS DASHBOARD VIEW */}
        <section id="outflow-parameter-cards" className="space-y-2">
          <div className="text-[10px] font-mono text-slate-400 tracking-widest font-bold uppercase ml-1">
            Dynamic State Metrics ({scenario.timeLabel} {activeStep})
          </div>
          <MetricCards
            metrics={scenario.metrics}
            state={currentState}
          />
        </section>

        {/* THE VISUAL CANVAS PLATFORM */}
        <section id="visualization-canvas-platform" className="space-y-2">
          <div className="text-[10px] font-mono text-slate-400 tracking-widest font-bold uppercase ml-1">
            Structural System Visualizer
          </div>
          <Visualizer
            scenarioId={currentScenarioId}
            activeStep={activeStep}
            state={currentState}
            controls={controlValues}
            history={history}
          />
        </section>

        {/* REAL-TIME SIMULATION RUN CHAOS ANALYSIS BOX */}
        <section id="real-time-feedback-box">
          <div className={`p-5 rounded-xl border flex flex-col md:flex-row gap-4 items-start transition-all duration-300 ${
            analysisReport.isCritical
              ? 'bg-rose-50/70 border-rose-150 text-rose-950'
              : 'bg-indigo-50/50 border-indigo-100 text-indigo-950'
          }`}>
            <div className={`p-2 rounded-lg shrink-0 ${
              analysisReport.isCritical
                ? 'bg-rose-100 text-rose-700'
                : 'bg-indigo-100 text-indigo-700'
            }`}>
              {analysisReport.isCritical ? (
                <AlertTriangle className="h-5 w-5 shrink-0" />
              ) : (
                <Lightbulb className="h-5 w-5 shrink-0" />
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold tracking-tight">
                {analysisReport.title}
              </h4>
              <p className="text-xs leading-relaxed font-normal opacity-90">
                {analysisReport.text}
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
