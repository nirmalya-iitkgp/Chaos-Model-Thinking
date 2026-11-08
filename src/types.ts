/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Domain = 'Emergence & Complexity' | 'Economics' | 'Environment' | 'Urban' | 'Public Health' | 'Social';

export interface ScenarioControl {
  id: string;
  label: string;
  type: 'slider' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean;
  unit?: string;
  description: string;
}

export interface ScenarioDefinition {
  id: string;
  domain: Domain;
  name: string;
  chaosConcept: string;
  learningObjective: string;
  timeLabel: string; // e.g., "Year", "Quarter", "Decade", "Seasonal Cycle", "Time-step", "Interval", "Phase", "Social Media Round"
  maxSteps: number; // e.g., 5 or 6 as per the Table
  controls: ScenarioControl[];
  initialState: Record<string, any>;
  calculateStep: (
    currentStep: number,
    previousState: Record<string, any>,
    controls: Record<string, number | boolean>
  ) => Record<string, any>;
  metrics: {
    key: string;
    label: string;
    unit?: string;
    formatter?: (val: any) => string;
    color: string;
  }[];
  analysis: (state: Record<string, any>, controls: Record<string, number | boolean>) => {
    title: string;
    text: string;
    isCritical: boolean;
  };
}

export interface SimulationState {
  currentScenarioId: string;
  activeStep: number;
  isPlaying: boolean;
  controlValues: Record<string, number | boolean>;
  history: Record<string, any>[]; // array of math states index by step
}
