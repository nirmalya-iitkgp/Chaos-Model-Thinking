/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { SCENARIO_LIST } from './data/scenarios';
import HeroCatalog from './components/HeroCatalog';
import SimulationControls from './components/SimulationControls';
import MetricCards from './components/MetricCards';
import Visualizer from './components/Visualizer';

export default function App() {
  // View mode: 'catalog' shows the rich Hero page with all models; 'simulation' runs the model in full width
  const [viewMode, setViewMode] = useState<'catalog' | 'simulation'>('catalog');
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('conway-life');

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

  // Helper to select and launch a scenario
  const launchScenario = useCallback((id: string) => {
    const nextScenario = SCENARIO_LIST.find((s) => s.id === id) || SCENARIO_LIST[0];
    setCurrentScenarioId(id);
    setIsPlaying(false);
    setViewMode('simulation');

    // Bootstrap defaults
    const defaults: Record<string, number | boolean> = {};
    nextScenario.controls.forEach((c) => {
      defaults[c.id] = c.defaultValue;
    });
    setControlValues(defaults);

    // Reset trajectory
    setActiveStep(0);
    setHistory([nextScenario.initialState]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Quick switch between next and previous scenarios
  const currentIdx = SCENARIO_LIST.findIndex(s => s.id === currentScenarioId);
  const prevScenario = currentIdx > 0 ? SCENARIO_LIST[currentIdx - 1] : SCENARIO_LIST[SCENARIO_LIST.length - 1];
  const nextScenario = currentIdx < SCENARIO_LIST.length - 1 ? SCENARIO_LIST[currentIdx + 1] : SCENARIO_LIST[0];

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

  // If in catalog mode, render the rich Hero catalog
  if (viewMode === 'catalog') {
    return (
      <HeroCatalog
        scenarios={SCENARIO_LIST}
        onSelectModel={launchScenario}
        activeModelId={currentScenarioId}
      />
    );
  }

  // Active step state & analysis report
  const currentState = history[activeStep] || scenario.initialState;
  const analysisReport = scenario.analysis(currentState, controlValues);

  return (
    <div id="systems-chaos-dashboard" className="min-h-screen w-full bg-[#0F0E47] font-sans text-[#EDEDF7] antialiased flex flex-col">
      
      {/* SIMULATION TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#0F0E47]/95 backdrop-blur border-b border-[#7676AB]/45 px-4 md:px-8 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('catalog')}
            className="px-3 py-1.5 rounded bg-[#272757] hover:bg-[#2F2F66] text-[#EDEDF7] text-xs font-medium flex items-center gap-1.5 border border-[#7676AB]/60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">All Models</span>
            <span className="sm:hidden">All</span>
          </button>

          <div className="h-4 w-px bg-[#7676AB]/50 hidden sm:block" />

          <div className="flex items-center gap-2">
            <img 
              src="./logo.png" 
              alt="Chaos model Thinking" 
              className="h-6 w-6 object-contain rounded" 
              referrerPolicy="no-referrer"
            />
            <span className="font-display font-bold text-sm tracking-tight text-[#EDEDF7] hidden md:inline whitespace-nowrap shrink-0">
              Chaos model Thinking
            </span>
          </div>
        </div>

        {/* Center: Quick Switcher Dropdown & Next/Prev */}
        <div className="flex items-center gap-1.5 max-w-[50vw]">
          <button
            onClick={() => launchScenario(prevScenario.id)}
            title={`Previous: ${prevScenario.name}`}
            className="p-1.5 rounded bg-[#272757] hover:bg-[#2F2F66] text-[#EDEDF7] border border-[#7676AB]/60 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <select
            value={currentScenarioId}
            onChange={(e) => launchScenario(e.target.value)}
            className="bg-[#272757] border border-[#7676AB]/60 text-[#EDEDF7] text-xs rounded px-2.5 py-1.5 font-medium truncate focus:outline-none focus:border-[#F5B544] cursor-pointer max-w-[200px] sm:max-w-[280px]"
          >
            {SCENARIO_LIST.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#272757] text-[#EDEDF7]">
                {s.name} ({s.domain})
              </option>
            ))}
          </select>

          <button
            onClick={() => launchScenario(nextScenario.id)}
            title={`Next: ${nextScenario.name}`}
            className="p-1.5 rounded bg-[#272757] hover:bg-[#2F2F66] text-[#EDEDF7] border border-[#7676AB]/60 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Right: Domain Label */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs font-mono text-[#B4B4D6] whitespace-nowrap shrink-0">
            {scenario.domain}
          </span>
        </div>
      </header>

      {/* FULL-WIDTH SIMULATION VIEWPORT */}
      <main id="simulation-viewport" className="flex-1 overflow-y-auto flex flex-col p-4 md:p-6 space-y-4 max-w-6xl mx-auto w-full">
        
        {/* Compact Scenario Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#7676AB]/45 pb-2.5">
          <h1 className="font-display text-lg font-bold tracking-tight text-[#EDEDF7]">
            {scenario.name}
          </h1>
          <div className="text-xs text-[#B4B4D6] font-mono flex items-center gap-2">
            <span>{scenario.domain}</span>
            <span aria-hidden="true">·</span>
            <span>{scenario.chaosConcept}</span>
          </div>
        </div>

        {/* CONTROLS */}
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

        {/* METRICS */}
        <section id="outflow-parameter-cards">
          <MetricCards
            metrics={scenario.metrics}
            state={currentState}
          />
        </section>

        {/* VISUALIZER */}
        <section id="visualization-canvas-platform">
          <Visualizer
            scenarioId={currentScenarioId}
            activeStep={activeStep}
            state={currentState}
            controls={controlValues}
            history={history}
          />
        </section>

        {/* STATUS BAR */}
        <section id="real-time-feedback-box">
          <div className={`px-3.5 py-2.5 rounded-lg border text-xs flex items-center gap-2.5 ${
            analysisReport.isCritical
              ? 'bg-[#2F2F66] border-[#F5B544] text-[#EDEDF7]'
              : 'bg-[#272757] border-[#7676AB]/60 text-[#B4B4D6]'
          }`}>
            <span className={`font-semibold shrink-0 ${analysisReport.isCritical ? 'text-[#F5B544]' : 'text-[#EDEDF7]'}`}>{analysisReport.title}:</span>
            <span className="truncate">{analysisReport.text}</span>
          </div>
        </section>

      </main>
    </div>
  );
}
