/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight
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
    <div id="simulation-controls" className="w-full bg-[#272757] border border-[#7676AB]/60 rounded-lg p-4 space-y-4 text-[#EDEDF7]">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {controls.map((ctrl) => {
          const val = values[ctrl.id] !== undefined ? values[ctrl.id] : ctrl.defaultValue;

          if (ctrl.type === 'slider') {
            return (
              <div key={ctrl.id} className="bg-[#0F0E47]/75 p-3 rounded flex flex-col gap-1.5 border border-[#7676AB]/45">
                <div className="flex items-center justify-between">
                  <label htmlFor={`input-${ctrl.id}`} className="text-xs font-medium text-[#EDEDF7]">
                    {ctrl.label}
                  </label>
                  <span className="text-xs font-mono font-semibold tabular-nums text-[#F5B544] bg-[#2F2F66] px-2 py-0.5 rounded border border-[#7676AB]/50">
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
                  className="w-full accent-[#F5B544] cursor-pointer h-1.5 bg-[#2F2F66] rounded appearance-none"
                />
              </div>
            );
          } else {
            return (
              <div key={ctrl.id} className="bg-[#0F0E47]/75 p-3 rounded flex items-center justify-between border border-[#7676AB]/45">
                <label htmlFor={`input-${ctrl.id}`} className="text-xs font-medium text-[#EDEDF7]">
                  {ctrl.label}
                </label>
                <button
                  id={`input-${ctrl.id}`}
                  role="switch"
                  aria-checked={!!val}
                  onClick={() => onChangeControl(ctrl.id, !val)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-[#7676AB]/50 transition-colors duration-200 focus:outline-none ${
                    val ? 'bg-[#F5B544]' : 'bg-[#2F2F66]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow ring-0 transition duration-200 ${
                      val ? 'translate-x-4 bg-[#0F0E47]' : 'translate-x-0 bg-[#EDEDF7]'
                    }`}
                  />
                </button>
              </div>
            );
          }
        })}
      </div>

      {/* Action Bar & Step Tracker */}
      <div className="pt-2.5 border-t border-[#7676AB]/45 flex flex-wrap gap-2 items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            id="btn-simulation-toggle-play"
            onClick={onPlayToggle}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              isPlaying
                ? 'bg-[#2F2F66] border border-[#F5B544] text-[#F5B544] hover:bg-[#F5B544] hover:text-[#0F0E47]'
                : 'bg-[#F5B544] hover:bg-[#f7c568] text-[#0F0E47]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Run
              </>
            )}
          </button>

          <button
            id="btn-simulation-step"
            onClick={onStepForward}
            disabled={!canStepType}
            className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer flex items-center gap-1 border transition-colors whitespace-nowrap shrink-0 ${
              canStepType
                ? 'bg-[#2F2F66] text-[#EDEDF7] border-[#7676AB]/60 hover:bg-[#7676AB]/30'
                : 'bg-[#0F0E47]/40 text-[#B4B4D6]/40 border-[#7676AB]/30 cursor-not-allowed'
            }`}
          >
            <ArrowRight className="h-3.5 w-3.5" /> Next {timeLabel}
          </button>

          <button
            id="btn-simulation-reset"
            onClick={onReset}
            className="px-3 py-1.5 rounded text-xs font-medium border border-[#7676AB]/60 text-[#B4B4D6] bg-[#2F2F66] hover:bg-[#7676AB]/30 hover:text-[#EDEDF7] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>

        <div className="text-[#B4B4D6] font-mono tabular-nums text-xs">
          {activeStep === 0 ? 'Initial' : `${timeLabel} ${activeStep}/${maxSteps}`}
        </div>
      </div>
    </div>
  );
}
