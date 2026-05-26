/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { ScenarioControl } from '../types';

interface ControlsProps {
  controls: ScenarioControl[];
  values: Record<string, number | boolean>;
  onChangeControl: (id: string, value: number | boolean) => void;
  activeStep: number;
  maxSteps: number;
  timeLabel: string;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onStepForward: () => void;
  onReset: () => void;
}

export default function SimulationControls({
  controls,
  values,
  onChangeControl,
  activeStep,
  maxSteps,
  timeLabel,
  isPlaying,
  onPlayToggle,
  onStepForward,
  onReset
}: ControlsProps) {

  const canStepType = activeStep < maxSteps;

  return (
    <div id="simulation-controls" className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
      {/* SECTION 1: Player Inputs Header */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          Scenario Configuration Parameters
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Adjust the inputs to change the feedback loops. Modifying inputs will reset any Active simulation run to study the new initial state.
        </p>
      </div>

      {/* Dynamic Controls List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {controls.map((ctrl) => {
          const val = values[ctrl.id] !== undefined ? values[ctrl.id] : ctrl.defaultValue;

          if (ctrl.type === 'slider') {
            return (
              <div key={ctrl.id} className="bg-slate-55 bg-opacity-45 p-4 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={`input-${ctrl.id}`} className="text-xs font-semibold text-slate-800 tracking-tight">
                    {ctrl.label}
                  </label>
                  <span className="text-xs font-bold font-mono text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val}{ctrl.unit || ''}
                  </span>
                </div>
                <input
                  type="range"
                  id={`input-${ctrl.id}`}
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={val as number}
                  onChange={(e) => onChangeControl(ctrl.id, Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
                <p className="text-[11px] text-slate-500 font-normal leading-normal">
                  {ctrl.description}
                </p>
              </div>
            );
          } else {
            // TOGGLE / SWITCH
            return (
              <div key={ctrl.id} className="bg-slate-55 bg-opacity-45 p-4 rounded-lg flex flex-col gap-3 justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor={`input-${ctrl.id}`} className="text-xs font-semibold text-slate-800 tracking-tight block">
                      {ctrl.label}
                    </label>
                    <p className="text-[11px] text-slate-500 font-normal leading-normal mt-1">
                      {ctrl.description}
                    </p>
                  </div>
                  {/* Switch */}
                  <button
                    id={`input-${ctrl.id}`}
                    role="switch"
                    aria-checked={!!val}
                    onClick={() => onChangeControl(ctrl.id, !val)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                      val ? 'bg-slate-900' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                        val ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* SECTION 2: Timeline Progress / Stepper */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-widest font-bold">Timeline Trajectory</span>
            <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded font-bold">
              {activeStep === 0 ? 'Initial State' : `${timeLabel} ${activeStep} of ${maxSteps}`}
            </span>
          </div>

          {/* Graphical timeline markers */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
            <button
              onClick={onReset}
              className={`flex-1 min-w-[70px] text-center p-2 rounded text-[11px] font-mono font-medium border transition-all ${
                activeStep === 0
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Start
            </button>
            {Array.from({ length: maxSteps }).map((_, i) => {
              const stepNum = i + 1;
              const isCurrent = activeStep === stepNum;
              const isPast = activeStep > stepNum;

              return (
                <div
                  key={stepNum}
                  className={`flex-1 min-w-[70px] text-center p-2 rounded text-[11px] font-mono border transition-all ${
                    isCurrent
                      ? 'bg-indigo-650 border-indigo-650 text-white font-bold'
                      : isPast
                      ? 'bg-emerald-50 border-emerald-150 text-emerald-800'
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}
                >
                  {timeLabel} {stepNum}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: Player Drive Console */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            id="btn-simulation-toggle-play"
            onClick={onPlayToggle}
            className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-2 shadow-sm transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" /> Pause Run
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Run Simulation
              </>
            )}
          </button>

          <button
            id="btn-simulation-step"
            onClick={onStepForward}
            disabled={!canStepType}
            className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1.5 border transition-all ${
              canStepType
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
          >
            <ArrowRight className="h-4 w-4" /> Next {timeLabel}
          </button>
        </div>

        <button
          id="btn-simulation-reset"
          onClick={onReset}
          className="px-4 py-2 rounded-lg text-xs cursor-pointer font-medium border border-slate-200 text-slate-650 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
    </div>
  );
}
