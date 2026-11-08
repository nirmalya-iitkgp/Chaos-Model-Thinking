/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { SCENARIO_LIST } from '../data/scenarios';

describe('Chaos model Thinking - Scenario Integrity & Math Tests', () => {
  it('should include all 22 complex systems scenarios with complete configurations', () => {
    expect(SCENARIO_LIST.length).toBe(22);

    const requiredScenarios = [
      'market-panic',
      'bullwhip-effect',
      'climate-tipping',
      'predator-prey',
      'phantom-traffic',
      'power-grid',
      'pandemic-outbreak',
      'vaccination-threshold',
      'fake-news',
      'viral-tipping',
      'conway-life',
      'preferential-attachment',
      'spatial-prisoners-dilemma',
      'schelling-segregation',
      'boids-flocking',
      'forest-fire-percolation',
      'sugarscape',
      'gray-scott',
      'slime-mold',
      'ant-colony',
      'watts-strogatz',
      'kuramoto-oscillators'
    ];

    const ids = SCENARIO_LIST.map(s => s.id);
    requiredScenarios.forEach(reqId => {
      expect(ids).toContain(reqId);
    });

    SCENARIO_LIST.forEach(scenario => {
      expect(scenario.name).toBeTruthy();
      expect(scenario.domain).toBeTruthy();
      expect(scenario.chaosConcept).toBeTruthy();
      expect(scenario.learningObjective).toBeTruthy();
      expect(scenario.maxSteps).toBeGreaterThanOrEqual(4);
      expect(scenario.controls.length).toBeGreaterThan(0);
      expect(scenario.initialState).toBeDefined();
      expect(typeof scenario.calculateStep).toBe('function');
      expect(typeof scenario.analysis).toBe('function');
      expect(scenario.metrics.length).toBeGreaterThan(0);
    });
  });

  describe('Gray-Scott Reaction-Diffusion', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'gray-scott')!;

    it('should compute spot mitosis and Turing patterns based on feed/kill rates', () => {
      const controls = { feedRate: 0.037, killRate: 0.060, diffusionRatio: 2.0 };
      const step1 = sc.calculateStep(1, sc.initialState, controls);
      expect(step1.activeSpots).toBeGreaterThan(0);
      expect(step1.patternType).toContain('Mitosis');

      const analysis = sc.analysis(step1, controls);
      expect(analysis.title).toContain('Turing Morphogenesis');
    });

    it('should transition to coral stripes with high feed rate', () => {
      const controls = { feedRate: 0.062, killRate: 0.061, diffusionRatio: 2.0 };
      const step2 = sc.calculateStep(2, sc.initialState, controls);
      expect(step2.patternType).toContain('Coral Reef');
    });
  });

  describe('Slime Mold Network Optimization (Physarum)', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'slime-mold')!;

    it('should optimize transport routing efficiency over foraging waves', () => {
      const controls = { decayRate: 5, sensorAngle: 35, particleDensity: 1000 };
      let curr = sc.initialState;
      for (let s = 1; s <= 5; s++) {
        curr = sc.calculateStep(s, curr, controls);
      }
      expect(curr.transportEfficiency).toBeGreaterThanOrEqual(70);
      expect(curr.foragingStatus).toContain('STEINER');
    });
  });

  describe('Ant Colony Optimization (ACO)', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'ant-colony')!;

    it('should discover optimal path via stigmergic positive feedback', () => {
      const controls = { evaporationRate: 3, pheromoneSensitivity: 2.0, antPopulation: 120 };
      let curr = sc.initialState;
      for (let s = 1; s <= 5; s++) {
        curr = sc.calculateStep(s, curr, controls);
      }
      expect(curr.routeOptimality).toBeGreaterThanOrEqual(80);
      expect(curr.foodHarvested).toBeGreaterThan(0);
    });
  });

  describe('Watts–Strogatz Small-World Rewiring', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'watts-strogatz')!;

    it('should exhibit small-world effect (high C, low L) with small rewiring probability', () => {
      const controls = { rewiringProb: 0.05, networkNodes: 36, initialNeighbors: 4 };
      const step = sc.calculateStep(3, sc.initialState, controls);
      expect(step.averagePathLength).toBeLessThan(4.5);
      expect(step.clusteringCoefficient).toBeGreaterThan(0.35);
      expect(step.smallWorldRatio).toBeGreaterThan(1.0);
      expect(step.networkPhase).toContain('SMALL-WORLD');
    });
  });

  describe('Kuramoto Synchronized Oscillators', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'kuramoto-oscillators')!;

    it('should spontaneously synchronize when K >= Kc', () => {
      const controls = { couplingStrength: 3.0, frequencyVariance: 0.8, oscillatorCount: 100 };
      let curr = sc.initialState;
      for (let s = 1; s <= 5; s++) {
        curr = sc.calculateStep(s, curr, controls);
      }
      expect(curr.orderParameter).toBeGreaterThanOrEqual(0.60);
      expect(curr.phaseCoherence).toBeGreaterThanOrEqual(60);
      expect(curr.syncRegime).toContain('PHASE LOCKING');
    });

    it('should remain incoherent when coupling is below critical threshold K < Kc', () => {
      const controls = { couplingStrength: 0.5, frequencyVariance: 1.2, oscillatorCount: 100 };
      const step = sc.calculateStep(3, sc.initialState, controls);
      expect(step.orderParameter).toBeLessThan(0.35);
      const analysis = sc.analysis(step, controls);
      expect(analysis.isCritical).toBe(true);
    });
  });

  describe('Conway’s Life & Langton’s Ant', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'conway-life')!;

    it('should compute Conway B3/S23 step transitions smoothly', () => {
      const controls = { simulationMode: 0, gridDensity: 25, mutationNoise: 0 };
      const step1 = sc.calculateStep(1, sc.initialState, controls);
      expect(step1.liveCells).toBeGreaterThan(0);
      expect(step1.activeDensity).toBeGreaterThan(0);
      expect(step1.entropy).toBeGreaterThan(0);
    });

    it('should engage emergent highway in Langton Ant mode at high steps', () => {
      const controls = { simulationMode: 2, gridDensity: 25, mutationNoise: 0 };
      const step5 = sc.calculateStep(5, sc.initialState, controls);
      expect(step5.phaseDescription).toContain('HIGHWAY ENGAGED');
    });
  });

  describe('Preferential Attachment (Barabási–Albert)', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'preferential-attachment')!;

    it('should generate scale-free power law hubs with alpha=1.0', () => {
      const controls = { attachmentBias: 1.0, edgesPerNode: 2, initialSeedSize: 4 };
      const step = sc.calculateStep(4, sc.initialState, controls);
      expect(step.totalNodes).toBeGreaterThan(sc.initialState.totalNodes);
      expect(step.maxDegree).toBeGreaterThan(controls.edgesPerNode);
      expect(step.networkRegime).toContain('SCALE-FREE');
    });

    it('should identify monopoly winner-takes-all when alpha > 1.2', () => {
      const controls = { attachmentBias: 2.0, edgesPerNode: 2, initialSeedSize: 4 };
      const step = sc.calculateStep(5, sc.initialState, controls);
      expect(step.networkRegime).toContain('MONOPOLY');
      const analysis = sc.analysis(step, controls);
      expect(analysis.isCritical).toBe(true);
    });
  });

  describe('Spatial Prisoner’s Dilemma & Trust', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'spatial-prisoners-dilemma')!;

    it('should preserve cooperation clusters when temptation T < 1.8', () => {
      const controls = { temptationPayoff: 1.4, noiseRate: 1, mutationRate: 1 };
      const step = sc.calculateStep(3, sc.initialState, controls);
      expect(step.cooperationPercent).toBeGreaterThan(50);
      expect(step.statusComment).toContain('SPATIAL RECIPROCITY THRIVES');
    });
  });

  describe('Schelling Segregation Paradox', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'schelling-segregation')!;

    it('should cascade into extreme macro segregation even with mild 35% tolerance', () => {
      const controls = { similarityPreference: 35, vacancyRate: 15, demographicSplit: 50 };
      const step = sc.calculateStep(5, sc.initialState, controls);
      expect(step.segregationIndex).toBeGreaterThanOrEqual(75);
    });
  });

  describe('Boids Swarm Intelligence', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'boids-flocking')!;

    it('should build murmuration alignment under balanced separation/alignment/cohesion', () => {
      const controls = { cohesionWeight: 1.2, alignmentWeight: 1.4, separationWeight: 1.5, predatorPresent: false };
      const step = sc.calculateStep(3, sc.initialState, controls);
      expect(step.polarizationIndex).toBeGreaterThan(60);
    });

    it('should trigger flash expansion scatter when predator is introduced', () => {
      const controls = { cohesionWeight: 1.0, alignmentWeight: 1.2, separationWeight: 1.5, predatorPresent: true };
      const step = sc.calculateStep(2, sc.initialState, controls);
      expect(step.flightBehavior).toContain('PREDATOR ATTACK');
    });
  });

  describe('Forest Fire Percolation Threshold', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'forest-fire-percolation')!;

    it('should halt fire locally in subcritical forest (density 45% < pc)', () => {
      const controls = { treeDensity: 45, windIntensity: 0.0, lightningSpark: true };
      const step = sc.calculateStep(4, sc.initialState, controls);
      expect(step.percolated).toBe(false);
      expect(step.forestStatus).toContain('EXTINGUISHED');
    });

    it('should percolate infinitely in supercritical forest (density 70% > pc)', () => {
      const controls = { treeDensity: 70, windIntensity: 0.5, lightningSpark: true };
      const step = sc.calculateStep(4, sc.initialState, controls);
      expect(step.percolated).toBe(true);
      expect(step.burnedPercent).toBeGreaterThan(50);
    });
  });

  describe('Epstein & Axtell Sugarscape Wealth Inequality', () => {
    const sc = SCENARIO_LIST.find(s => s.id === 'sugarscape')!;

    it('should resolve into extreme Pareto inequality over harvest rounds', () => {
      const controls = { sugarRegrowth: 1, visionRange: 5, metabolicPressure: 2 };
      const step = sc.calculateStep(5, sc.initialState, controls);
      expect(step.giniCoefficient).toBeGreaterThanOrEqual(0.60);
      expect(step.topTenPercentWealth).toBeGreaterThanOrEqual(60);
    });
  });

  describe('Red-Pill / Blue-Pill & Edge-Case Security Stress Testing', () => {
    it('should handle zero, extreme, and negative values across all 22 scenarios without crashing or producing NaN', () => {
      SCENARIO_LIST.forEach(scenario => {
        const edgeControls: Record<string, number | boolean> = {};
        scenario.controls.forEach(c => {
          if (c.type === 'slider') {
            edgeControls[c.id] = c.min ?? 0;
          } else {
            edgeControls[c.id] = false;
          }
        });

        // Run step with minimum controls
        const resMin = scenario.calculateStep(1, scenario.initialState, edgeControls);
        expect(resMin).toBeDefined();

        // Check for NaN or undefined in numerical fields
        Object.entries(resMin).forEach(([key, val]) => {
          if (typeof val === 'number') {
            expect(Number.isNaN(val)).toBe(false);
            expect(Number.isFinite(val)).toBe(true);
          }
        });

        // Run step with maximum controls
        const maxControls: Record<string, number | boolean> = {};
        scenario.controls.forEach(c => {
          if (c.type === 'slider') {
            maxControls[c.id] = c.max ?? 100;
          } else {
            maxControls[c.id] = true;
          }
        });

        const resMax = scenario.calculateStep(scenario.maxSteps, resMin, maxControls);
        expect(resMax).toBeDefined();
        Object.entries(resMax).forEach(([key, val]) => {
          if (typeof val === 'number') {
            expect(Number.isNaN(val)).toBe(false);
            expect(Number.isFinite(val)).toBe(true);
          }
        });

        // Ensure analysis function works properly under all extremes
        const analysisMin = scenario.analysis(resMin, edgeControls);
        expect(analysisMin.title).toBeTruthy();
        expect(analysisMin.text).toBeTruthy();

        const analysisMax = scenario.analysis(resMax, maxControls);
        expect(analysisMax.title).toBeTruthy();
        expect(analysisMax.text).toBeTruthy();
      });
    });
  });
});
