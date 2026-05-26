/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScenarioDefinition } from '../types';

export const SCENARIO_LIST: ScenarioDefinition[] = [
  {
    id: 'market-panic',
    domain: 'Economics',
    name: 'Market Panic & Financial Bubble',
    chaosConcept: 'Feedback loops & sensitive dependence',
    learningObjective: 'Observe how a tiny initial press rumor can cascade into a complete stock market crash via a positive feedback loop of investor panic, unless countered by early regulator policies.',
    timeLabel: 'Period',
    maxSteps: 5,
    controls: [
      {
        id: 'startRumor',
        label: 'Introduce Tech Fraud Rumor',
        type: 'toggle',
        defaultValue: false,
        description: 'If active, an innocuous rumor is released at Period 0, setting off selling pressure.'
      },
      {
        id: 'policyLever',
        label: 'Regulator Policy Action',
        type: 'slider',
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 0,
        description: '0: Laissez-faire (No intervention), 1: Deploy Trading Halts (Circuit Breakers), 2: Urgent Liquidity Support (Fed rate cut & buyer credit)'
      },
      {
        id: 'marginLeverage',
        label: 'Speculative Margin Leverage',
        type: 'slider',
        min: 1,
        max: 5,
        step: 0.5,
        defaultValue: 2,
        unit: 'x',
        description: 'Higher leverage acts as an exponent multiplier that amplifies both panic selling speeds and recovery surges.'
      }
    ],
    initialState: {
      marketIndex: 1000,
      volatility: 10, // in %
      sentiment: 85, // 0 to 100
      qualitativeSentiment: 'Bullish',
      newsSummary: 'Market opens with strong corporate earnings and general institutional optimism. Investors feel Bullish.'
    },
    calculateStep: (step, prev, controls) => {
      const rumor = !!controls.startRumor;
      const policy = Number(controls.policyLever || 0);
      const margin = Number(controls.marginLeverage || 2);
      const mult = margin / 2;

      if (step === 1) {
        if (!rumor) {
          return {
            marketIndex: 1030,
            sentiment: 88,
            qualitativeSentiment: 'Bullish',
            volatility: 9,
            newsSummary: 'Indices rise modestly on stable organic earnings. Institutional traders report steady growth and positive momentum.'
          };
        } else {
          // rumor timeline
          const index = policy === 2 ? Math.round(985 - (margin - 2) * 5) : Math.round(980 - (margin - 2) * 8);
          const sent = policy === 2 ? Math.max(30, Math.round(58 - (margin - 2) * 6)) : Math.max(25, Math.round(50 - (margin - 2) * 9));
          const news = policy === 2 
            ? 'A negative fringe rumor emerges. Regulator immediately signals emergency monetary support to cushion impact.'
            : 'A tweet hinting at tech company fraud goes viral. Some nervous retail investors begin panic selling key stocks.';
          return {
            marketIndex: index,
            sentiment: sent,
            qualitativeSentiment: 'Neutral',
            volatility: policy === 2 ? Math.round(18 * Math.pow(mult, 0.8)) : Math.round(25 * Math.pow(mult, 1.2)),
            newsSummary: news
          };
        }
      }

      if (step === 2) {
        if (!rumor) {
          return {
            marketIndex: 1050,
            sentiment: 90,
            qualitativeSentiment: 'Bullish',
            volatility: 8,
            newsSummary: 'Healthy macro-economic growth continues. Low volatility encourages mid-cap sectors to expand corporate hiring.'
          };
        } else {
          if (policy === 0) {
            return {
              marketIndex: Math.max(300, Math.round(900 - (margin - 2) * 35)),
              sentiment: Math.max(5, Math.round(30 - (margin - 2) * 6)),
              qualitativeSentiment: 'Bearish',
              volatility: Math.min(99, Math.round(45 * Math.pow(mult, 1.3))),
              newsSummary: 'Drop triggers algorithmic stop-loss programs. Major investment desks automate sell routines as social coverage worsens.'
            };
          } else if (policy === 1) {
            return {
              marketIndex: Math.max(400, Math.round(920 - (margin - 2) * 20)),
              sentiment: Math.max(10, Math.round(45 - (margin - 2) * 5)),
              qualitativeSentiment: 'Neutral',
              volatility: Math.min(99, Math.round(35 * Math.pow(mult, 1.1))),
              newsSummary: 'Automatic pre-halt monitoring limits the speed of automated drops, keeping panic selling in a narrower band.'
            };
          } else {
            return {
              marketIndex: Math.min(1400, Math.round(960 + (margin - 2) * 15)),
              sentiment: Math.min(95, Math.round(62 + (margin - 2) * 5)),
              qualitativeSentiment: 'Neutral',
              volatility: Math.max(5, Math.round(20 / mult)),
              newsSummary: 'Aggressive rate cuts offset retail fears. Government buyers actively bid, absorbing initial liquidity drain.'
            };
          }
        }
      }

      if (step === 3) {
        if (!rumor) {
          return {
            marketIndex: 1040,
            sentiment: 75,
            qualitativeSentiment: 'Neutral',
            volatility: 12,
            newsSummary: 'Minor technical correction. Core fundamentals remain strong with solid buyer interest keeping the index steady.'
          };
        } else {
          if (policy === 0) {
            return {
              marketIndex: Math.max(200, Math.round(750 - (margin - 2) * 55)),
              sentiment: Math.max(2, Math.round(15 - (margin - 2) * 3)),
              qualitativeSentiment: 'Bearish',
              volatility: Math.min(99, Math.round(70 * Math.pow(mult, 1.4))),
              newsSummary: 'Panic Threshold Crossed (Index drops under 800)! Secondary selling wave: fear of insolvencies drives full Capitulation.'
            };
          } else if (policy === 1) {
            return {
              marketIndex: Math.max(300, Math.round(840 - (margin - 2) * 35)),
              sentiment: Math.max(5, Math.round(35 - (margin - 2) * 4)),
              qualitativeSentiment: 'Bearish',
              volatility: Math.min(99, Math.round(50 * Math.pow(mult, 1.2))),
              newsSummary: 'Exchange enforces trading halts (Level 1 Circuit Breaker triggered). Markets freeze for 15 minutes, allowing heads to cool.'
            };
          } else {
            return {
              marketIndex: Math.min(1450, Math.round(970 + (margin - 2) * 25)),
              sentiment: Math.min(98, Math.round(70 + (margin - 2) * 6)),
              qualitativeSentiment: 'Bullish',
              volatility: Math.max(5, Math.round(15 / Math.sqrt(mult))),
              newsSummary: 'Urgent liquidity streams trigger fresh capital reinvestment. Institutional investors confidently re-enter. Panic has subsided.'
            };
          }
        }
      }

      if (step === 4) {
        if (!rumor) {
          return {
            marketIndex: 1080,
            sentiment: 82,
            qualitativeSentiment: 'Bullish',
            volatility: 10,
            newsSummary: 'Markets recover from correction to resume general trend. Long-term bonds indicate high confidence and low volatility.'
          };
        } else {
          if (policy === 0) {
            return {
              marketIndex: Math.max(100, Math.round(600 - (margin - 2) * 75)),
              sentiment: Math.max(1, Math.round(5 - (margin - 2) * 1.5)),
              qualitativeSentiment: 'Bearish',
              volatility: Math.min(99, Math.round(85 * Math.pow(mult, 1.45))),
              newsSummary: 'Systemic panic intensifies. Margin calls lead to forced fund deleveraging. Bank runs and liquidity squeezes begin.'
            };
          } else if (policy === 1) {
            return {
              marketIndex: Math.max(250, Math.round(810 - (margin - 2) * 45)),
              sentiment: Math.max(2, Math.round(28 - (margin - 2) * 3.5)),
              qualitativeSentiment: 'Bearish',
              volatility: Math.min(99, Math.round(55 * Math.pow(mult, 1.25))),
              newsSummary: 'Subsequent trading resumes. Selling persists but halts stop sudden crashes, preventing catastrophic liquidations.'
            };
          } else {
            return {
              marketIndex: Math.min(1500, Math.round(1010 + (margin - 2) * 35)),
              sentiment: Math.min(99, Math.round(78 + (margin - 2) * 5)),
              qualitativeSentiment: 'Bullish',
              volatility: Math.max(5, Math.round(12 / mult)),
              newsSummary: 'Indexes surge on cheap credit. Strong market depth successfully buffers the butterfly spark. Baseline trend is restored.'
            };
          }
        }
      }

      // step === 5
      if (!rumor) {
        return {
          marketIndex: 1100,
          sentiment: 85,
          qualitativeSentiment: 'Bullish',
          volatility: 8,
          newsSummary: 'Market wraps up its stable, high-yield trade cycle with historic valuations, low volatility, and normal bull phase.'
        };
      } else {
        if (policy === 0) {
          return {
            marketIndex: Math.max(50, Math.round(500 - (margin - 2) * 95)),
            sentiment: Math.max(1, Math.round(2 - (margin - 2) * 0.5)),
            qualitativeSentiment: 'Bearish',
            volatility: Math.min(100, Math.round(95 * Math.pow(mult, 1.5))),
            newsSummary: 'Market bottoms out in total destruction of capital. Investment firms collapse, thrusting the wider economy into recession.'
          };
        } else if (policy === 1) {
          return {
            marketIndex: Math.max(200, Math.round(820 - (margin - 2) * 50)),
            sentiment: Math.max(5, Math.round(40 - (margin - 2) * 4)),
            qualitativeSentiment: 'Neutral',
            volatility: Math.min(99, Math.round(40 * Math.pow(mult, 1.3))),
            newsSummary: 'High-frequency stabilizers successfully cushion the floor. Market ends with moderate losses but avoids complete bankruptcy.'
          };
        } else {
          return {
            marketIndex: Math.min(1550, Math.round(1050 + (margin - 2) * 45)),
            sentiment: Math.min(100, Math.round(82 + (margin - 2) * 4)),
            qualitativeSentiment: 'Bullish',
            volatility: Math.max(5, Math.round(10 / mult)),
            newsSummary: 'Full economic recovery. Initial chaos is completely absorbed, proving the power of active regulatory backstops.'
          };
        }
      }
    },
    metrics: [
      { key: 'marketIndex', label: 'Market Index', color: 'text-indigo-600', formatter: (val) => `${val} pts` },
      { key: 'qualitativeSentiment', label: 'Investor Sentiment', color: 'text-emerald-500' },
      { key: 'volatility', label: 'Volatility Index (VIX)', color: 'text-amber-500', formatter: (val) => `${val}%` },
    ],
    analysis: (state, controls) => {
      const rumor = !!controls.startRumor;
      const policy = Number(controls.policyLever || 0);
      if (!rumor) {
        return {
          title: 'Steady Dynamic Equilibrium',
          text: 'Without the initial rumor catalyst, the market remained in a self-reinforcing circle of confidence: stable index → high sentiment → low volatility → increased investments → rising index. This represents a healthy, predictable dynamic equilibrium.',
          isCritical: false
        };
      }
      if (policy === 0) {
        return {
          title: 'Uncontrolled Positive Feedback Loop Collapse!',
          text: 'Planted rumor at Period 0 created a negative feedback cascade. Dropping prices bred fear, prompting retail and algorithmic panic selling, lowering prices further. Deleveraging and bank run fears caused a major stock market collapse of ~50% because laissez-faire policy did not stabilize the feedback loop.',
          isCritical: true
        };
      } else if (policy === 1) {
        return {
          title: 'Cushioned Decline via Circuit Breakers',
          text: 'By using the "Deploy Trading Halts" policy lever, the regulator triggered circuit breakers during panic drops. Pausing trading cooled investor sentiment and arrested automatic algorithmic cascades. The index stabilized around 820, limiting deep capital losses.',
          isCritical: false
        };
      } else {
        return {
          title: 'Successful Intervention: Crisis Defused!',
          text: 'Urgent Liquidity Support and emergency rate cuts countered the panic. Ready credit offset tech selloffs and restored buyer confidence, completely overcoming the initial negative spark. The market fully returned to its bullish trend, illustrating how swift regulatory policy can halt destructive feedback cycles.',
          isCritical: false
        };
      }
    }
  },
  {
    id: 'bullwhip-effect',
    domain: 'Economics',
    name: 'Supply Chain "Bullwhip" Oscillation',
    chaosConcept: 'Amplification feedback & delay nonlinearity',
    learningObjective: 'Observe how a minor end-consumer demand shift (+5% or -5%) propagates and amplifies through delayed supply tiers, causing wild factory oscillations, and how digital data sharing mitigates this chaos.',
    timeLabel: 'Period',
    maxSteps: 6,
    controls: [
      {
        id: 'demandIncrease',
        label: 'Customer Demand Shift',
        type: 'slider',
        min: -15,
        max: 15,
        step: 5,
        defaultValue: 5,
        unit: '%',
        description: 'The small consumer retail purchase shift introduced at Period 2. Can be positive (+) or negative (-).'
      },
      {
        id: 'infoSharing',
        label: 'Collaborative Data Connection (CPFR)',
        type: 'toggle',
        defaultValue: false,
        description: 'If active, all supply chain tiers share synchronized real-time checkout data. If inactive, they forecast based on delayed orders.'
      },
      {
        id: 'safetyStockMultiplier',
        label: 'Speculative Safety Stock Buffer Bias',
        type: 'slider',
        min: 1.0,
        max: 3.0,
        step: 0.2,
        defaultValue: 1.5,
        unit: 'x',
        description: 'The safety stock multiplier that upstream tiers speculatively order when reacting to a change in sales.'
      }
    ],
    initialState: {
      consumerSales: 100,
      retailerOrders: 100,
      wholesalerOrders: 100,
      distributorOrders: 100,
      factoryProduction: 100,
      retailerInventory: 50,
      wholesalerInventory: 50,
      distributorInventory: 50,
      factoryInventory: 50,
      commentary: 'All supply chain tiers are fully synchronized, ordered 100 units to match a flat 100 demand.'
    },
    calculateStep: (step, prev, controls) => {
      const demandIncrease = Number(controls.demandIncrease);
      const infoSharing = !!controls.infoSharing;
      const safetyStock = Number(controls.safetyStockMultiplier ?? 1.5);
      
      if (step === 1) {
        return {
          consumerSales: 100,
          retailerOrders: 100,
          wholesalerOrders: 100,
          distributorOrders: 100,
          factoryProduction: 100,
          retailerInventory: 50,
          wholesalerInventory: 50,
          distributorInventory: 50,
          factoryInventory: 50,
          commentary: 'Perfect initial equilibrium. Stable local buffers and balanced manufacturing outputs matching demand perfectly.'
        };
      }

      const consumerSales = 100 + (step >= 2 ? demandIncrease : 0);

      // MITIGATED STRATEGY: Real-time unified logistic systems
      if (infoSharing) {
        return {
          consumerSales,
          retailerOrders: consumerSales,
          wholesalerOrders: consumerSales,
          distributorOrders: consumerSales,
          factoryProduction: consumerSales,
          retailerInventory: 50,
          wholesalerInventory: 50,
          distributorInventory: 50,
          factoryInventory: 50,
          commentary: 'Collaborative pipeline active! Every partner upstream adjusts ordering smoothly in sync. Perfect balance is maintained.'
        };
      }

      // TRADITIONAL PIPELINE: Delayed forecasts & speculative safety stock buffers
      let retailerOrders = 100;
      let wholesalerOrders = 100;
      let distributorOrders = 100;
      let factoryProduction = 100;

      let retailerInventory = prev.retailerInventory || 50;
      let wholesalerInventory = prev.wholesalerInventory || 50;
      let distributorInventory = prev.distributorInventory || 50;
      let factoryInventory = prev.factoryInventory || 50;

      let commentary = '';

      if (step === 2) {
        retailerInventory = Math.round(50 - demandIncrease);
        retailerOrders = Math.round(consumerSales + demandIncrease * safetyStock);
        wholesalerOrders = 100;
        distributorOrders = 100;
        factoryProduction = 100;

        const verb = demandIncrease > 0 ? 'uptick' : 'drop';
        commentary = `Retailer registers a slight ${verb} in sales. Seeking to guard their local safety buffer (now at ${retailerInventory}), they overreact with a ${safetyStock}x safety bias and submit a speculative order of ${retailerOrders} to Wholesaler.`;
      } 
      else if (step === 3) {
        retailerInventory = Math.round(prev.retailerInventory + 100 - consumerSales);
        retailerOrders = Math.round(consumerSales + demandIncrease * safetyStock * 0.8);
        
        wholesalerInventory = Math.max(5, Math.round(55 - (prev.retailerOrders - 100)));
        wholesalerOrders = Math.round(100 + (prev.retailerOrders - 100) * 1.2 * safetyStock);
        
        distributorOrders = 100;
        factoryProduction = 100;

        const stateVerb = demandIncrease > 0 ? 'surge' : 'slump';
        commentary = `Wholesaler experiences the magnified retail order ${stateVerb}. Lacking retail insight, they assume high trend velocity. Wholesaler inventory swings to ${wholesalerInventory}, and they send a heavily inflated order of ${wholesalerOrders} to Distributor.`;
      } 
      else if (step === 4) {
        retailerInventory = Math.round(prev.retailerInventory + prev.retailerOrders - consumerSales);
        retailerOrders = Math.round(consumerSales + demandIncrease * safetyStock * 0.67);
        
        wholesalerInventory = Math.max(5, Math.round(prev.wholesalerInventory + 100 - prev.retailerOrders));
        wholesalerOrders = Math.round(100 + (prev.retailerOrders - 100) * 0.33 * safetyStock);
        
        distributorInventory = Math.max(2, Math.round(50 - (prev.wholesalerOrders - 100)));
        distributorOrders = Math.round(100 + (prev.wholesalerOrders - 100) * 1.4 * safetyStock);
        
        factoryProduction = 100;

        commentary = `Information lags compound! Wholesale swings hit Distributor. Panicked by safety stock depletion (inventory drops to ${distributorInventory}), they speculation-pile, requesting a massive ${distributorOrders} units from the Factory.`;
      } 
      else if (step === 5) {
        retailerInventory = Math.round(prev.retailerInventory + prev.retailerOrders - consumerSales);
        retailerOrders = Math.round(consumerSales + demandIncrease * safetyStock * 0.5);
        
        wholesalerInventory = Math.max(5, Math.round(prev.wholesalerInventory + prev.wholesalerOrders - prev.retailerOrders));
        wholesalerOrders = Math.round(100 + (prev.retailerOrders - 100) * 0.2 * safetyStock);
        
        distributorInventory = Math.max(2, Math.round(prev.distributorInventory + 100 - prev.wholesalerOrders));
        distributorOrders = Math.round(100 + (prev.wholesalerOrders - 100) * 0.25 * safetyStock);
        
        factoryInventory = Math.max(1, Math.round(50 - (prev.distributorOrders - 100)));
        factoryProduction = Math.max(10, Math.round(100 + (prev.distributorOrders - 100) * 1.7 * safetyStock));

        commentary = `The factory receives the massive wave order. To defend against deep backorders as raw warehouse stocks drain to ${factoryInventory}, plant managers trigger overtime to churn out an extreme ${factoryProduction} production pool.`;
      } 
      else if (step === 6) {
        // Bubble burst / overshoot corrective crash
        retailerInventory = Math.round(prev.retailerInventory + prev.retailerOrders - consumerSales);
        retailerOrders = Math.round(consumerSales - demandIncrease * 0.35 * safetyStock);
        
        wholesalerInventory = Math.max(15, Math.round(prev.wholesalerInventory + prev.wholesalerOrders - prev.retailerOrders));
        wholesalerOrders = Math.round(100 - demandIncrease * 0.67 * safetyStock);
        
        distributorInventory = Math.max(15, Math.round(prev.distributorInventory + prev.distributorOrders - prev.wholesalerOrders));
        distributorOrders = Math.max(10, Math.round(100 - (prev.wholesalerOrders - 100) * 1.0 * safetyStock));
        
        factoryInventory = Math.max(15, Math.round(prev.factoryInventory + prev.factoryProduction - prev.distributorOrders));
        factoryProduction = Math.max(5, Math.round(100 - (prev.distributorOrders - 100) * 1.35 * safetyStock));

        const resultVerb = demandIncrease > 0 ? 'unsellable overstock' : 'profound backlog imbalance';
        commentary = `The Bullwhip crashes. Delayed inventory finally arrives, leaving retailers saturated with stock. All orders freeze upstream. The Factory, over-responsive, is left holding a ${resultVerb} of ${factoryInventory} units.`;
      }

      return {
        consumerSales,
        retailerOrders,
        wholesalerOrders,
        distributorOrders,
        factoryProduction,
        retailerInventory,
        wholesalerInventory,
        distributorInventory,
        factoryInventory,
        commentary
      };
    },
    metrics: [
      { key: 'consumerSales', label: 'Consumer Purchases', color: 'text-zinc-500', formatter: (val) => `${val} units` },
      { key: 'retailerInventory', label: 'Retailer Inventory', color: 'text-emerald-500', formatter: (val) => `${val} units` },
      { key: 'wholesalerOrders', label: 'Wholesale Orders', color: 'text-indigo-500', formatter: (val) => `${val} units` },
      { key: 'factoryProduction', label: 'Factory Production', color: 'text-rose-500', formatter: (val) => `${val} units` }
    ],
    analysis: (state, controls) => {
      const increase = Number(controls.demandIncrease);
      const infoSharing = !!controls.infoSharing;
      if (increase === 0) {
        return {
          title: 'Static Chain Alignment',
          text: 'With absolutely flat consumer demand variance, the entire upstream logistics pipeline remains perfectly aligned and cost-efficient. No feedback-induced oscillations are triggered.',
          isCritical: false
        };
      }
      
      if (infoSharing) {
        return {
          title: 'Mitigated Equilibrium via Unified Logistics',
          text: `By activating Collaborative Data Connection, you bypassed speculative delay-piling. Upstream layers adjusted production in instant real-time sync with checkout demand (${100 + increase} units). Variances are squelched, and no bullwhip oscillations occur.`,
          isCritical: false
        };
      }
      
      const absIncr = Math.abs(increase);
      const resultVerb = increase > 0 ? 'wild overproduction wave followed by direct crash to near zero' : 'severe order dried-out collapse followed by inventory deficit';
      return {
        title: 'Speculative Delay Amplification Active!',
        text: `A mere ${absIncr}% starting consumer demand shift triggered upstream panic oscillations. Because partners ordered locally based on buffered safety targets and lagged forecasts, a ${resultVerb} occurred. By Period 6, factories find themselves in extreme mismatch. This displays how isolated decision-making amplifies minor signals into chaotic supply crashes.`,
        isCritical: absIncr >= 5
      };
    }
  },
  {
    id: 'climate-tipping',
    domain: 'Environment',
    name: 'Climate Tipping & Positive Feedbacks',
    chaosConcept: 'Hysteresis bifurcation & critical feedback thresholds',
    learningObjective: 'Manage global emissions rate to stay below the +1.8°C tipping point, and observe how positive loops (albedo collapse, methane venting) drive warming beyond a point of no return.',
    timeLabel: 'Decade',
    maxSteps: 5,
    controls: [
      {
        id: 'emissionsRate',
        label: 'Global CO2 Emissions Rate',
        type: 'slider',
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 45,
        unit: '%',
        description: 'Global carbon output levels. Try setting it high (e.g., 70%), then dropping it to 0% mid-run to test for hysteresis!'
      },
      {
        id: 'feedbackSensitivity',
        label: 'Feedback Sensitivity Multiplier',
        type: 'slider',
        min: 0.5,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.2,
        unit: 'x',
        description: 'Alters positive feedback loop gain. Higher gain makes albedo collapse and methane venting occur with severe exponent speed.'
      }
    ],
    initialState: {
      co2: 415,
      temperature: 1.1,
      albedo: 30,
      methane: 0,
      tippingState: 'Stable',
      warningText: 'Earth remains within a warming rate that allows ecological adaptation.'
    },
    calculateStep: (step, prev, controls) => {
      const emissionsRate = Number(controls.emissionsRate);
      const sensitivity = Number(controls.feedbackSensitivity ?? 1.2);
      
      if (step === 1) {
        // Initial transition to Decade 1
        const co2Incr = 10 + (emissionsRate * 0.4);
        const co2 = Math.round(415 + co2Incr);
        const temperature = Number((1.1 + (emissionsRate * 0.012)).toFixed(2));
        const albedo = Math.max(10, Math.round(30 - (temperature - 1.1) * 3 * sensitivity));
        const methane = Math.max(0, Math.round((temperature - 1.1) * 1.5 * sensitivity));
        const tippingState = temperature >= 1.7 ? 'Breached' : 'Stable';
        const warningText = 'Carbon sinks are absorbing excess carbon. Standard warming trajectory.';
        return {
          co2,
          temperature,
          albedo,
          methane,
          tippingState,
          warningText
        };
      }

      // Check for hysteresis: if already breached, or if previous temp crossed the trigger threshold of 1.70°C
      const prevTipped = prev.tippingState === 'Breached' || prev.temperature >= 1.70;
      let tippingState = prevTipped ? 'Breached' : 'Stable';
      
      const co2Incr = 8 + (emissionsRate * 0.4);
      let co2 = Math.round(prev.co2 + co2Incr);
      
      let temperature = prev.temperature;
      let albedo = prev.albedo;
      let methane = prev.methane;

      if (tippingState === 'Breached') {
        // Runaway positive feedback loops:
        // Ice Melt feedback: Ice melts -> darker planet -> extra heating (+0.25°C per step for low albedo)
        // Permafrost methane feedback: Methane escapes -> compounds greenhouse warming (+0.15°C per Gt of methane)
        const iceFeedback = (30 - albedo) * 0.045 * sensitivity;
        const methaneFeedback = methane * 0.05 * Math.pow(sensitivity, 1.4);
        
        // Even with extremely low/0% emissions, temperature keeps rising due to feedback loops!
        temperature = Number((prev.temperature + (emissionsRate * 0.012) + iceFeedback + methaneFeedback + 0.18 * sensitivity).toFixed(2));
        
        // Ice sheets collapse rapidly
        albedo = Math.max(5, Math.round(prev.albedo - (4 * sensitivity) - ((temperature - 1.5) * 4.5 * Math.sqrt(sensitivity))));
        
        // Methane outgassing accelerates
        methane = Math.round(prev.methane + (8 + (temperature * 5.5) + (30 - albedo) * 2.0) * sensitivity);
        co2 = Math.round(co2 + methane * 2.8); // Methane decomposes, compounding greenhouse equivalents
      } else {
        // Controlled feedback stable path
        temperature = Number((prev.temperature + (emissionsRate * 0.013)).toFixed(2));
        albedo = Math.max(22, Math.round(prev.albedo - ((temperature - 1.0) * 1.8 * sensitivity)));
        methane = Math.round(prev.methane + (temperature * 0.8 * sensitivity));
        
        // Check if we crossed the trigger point in this step
        if (temperature >= 1.70) {
          tippingState = 'Breached';
        }
      }

      // Generate qualitative commentary
      let warningText = 'Climate is operating within standard feedback absorption limits.';
      if (tippingState === 'Breached') {
        warningText = `⚠️ RUNAWAY CASCADE: Hysteresis locked. Polar Ice reflectivity dropped to ${albedo}%, and ${methane} Gt permafrost methane is venting. Even setting emissions to 0% cannot stop the feedback!`;
      } else if (temperature >= 1.5) {
        warningText = '🚨 SYSTEM THREATENED: Warming has hit +1.5°C. Arctic ice sheet buffer is deteriorating rapidly. Runaway tipping point (1.7°C) is near.';
      } else if (temperature >= 1.3) {
        warningText = 'Noticeable ice thinning. Earth reflectivity (albedo) is starting to decrease slightly.';
      }

      return {
        co2,
        temperature,
        albedo,
        methane,
        tippingState,
        warningText
      };
    },
    metrics: [
      { key: 'co2', label: 'Greenhouse Gases (CO2 eq)', color: 'text-amber-500', formatter: (val) => `${val} ppm` },
      { key: 'temperature', label: 'Average Warming', color: 'text-rose-500', formatter: (val) => `+${val}°C` },
      { key: 'albedo', label: 'Ice Albedo Reflectivity', color: 'text-blue-400', formatter: (val) => `${val}%` },
      { key: 'methane', label: 'Permafrost Methane Release', color: 'text-orange-400', formatter: (val) => `${val} Gt` }
    ],
    analysis: (state, controls) => {
      const emissionsRate = Number(controls.emissionsRate);
      const isTipped = state.tippingState === 'Breached';
      
      if (!isTipped) {
        return {
          title: 'Feedback Loops Contained',
          text: `With emissions controlled, peak warming stayed below the safe threshold of +1.7°C. The ocean ice caps retain reasonable albedo reflecting power (${state.albedo}%) and subterranean methane reserves remain locked under solid permafrost. Runaway acceleration of climate change was avoided.`,
          isCritical: false
        };
      }
      return {
        title: 'Bifurcation Triggered: Hysteresis Active!',
        text: `The planet crossed the critical +1.7°C bifurcation boundary. Because you allowed emissions to climb too high early on, positive feedbacks engaged: polar ice collapsed to ${state.albedo}%, exposing dark waters that absorb heat, and permafrost melted to release ${state.methane} Gt of methane. Notice how even if you cut emissions back to zero now, temperatures continue to spiral upward—this is classical hysteresis.`,
        isCritical: true
      };
    }
  },
  {
    id: 'predator-prey',
    domain: 'Environment',
    name: 'Wildlife Population Chaos',
    chaosConcept: 'Period-Doubling Bifurcations & Strange Attractor Chaos',
    learningObjective: 'Manage hunting culling quotas to see the exact threshold where clean 2-period predator-prey balance bifurcates into highly erratic, unrepeatable chaotic oscillations.',
    timeLabel: 'Year',
    maxSteps: 10,
    controls: [
      {
        id: 'cullingRate',
        label: 'Predator Culling / Quota',
        type: 'slider',
        min: -15,
        max: 35,
        step: 5,
        defaultValue: 10,
        unit: '%',
        description: '10% stabilizes the food chain. 0% triggers a classic repeating 2-year cycle. Under -5% (strict protection), population charts enter erratic deterministic chaos.'
      },
      {
        id: 'initialNoise',
        label: 'Initial Prey Count Disturbance',
        type: 'slider',
        min: 0,
        max: 3,
        step: 0.1,
        defaultValue: 0,
        unit: 'k',
        description: 'Introduce a minor disturbance at Year 0. For stable paths, this is filtered out; for chaotic paths, the minor change explodes (the Butterfly Effect).'
      },
      {
        id: 'growthCoeff',
        label: 'Herbivore Birth Growth Coeff',
        type: 'slider',
        min: 1.5,
        max: 3.5,
        step: 0.1,
        defaultValue: 2.5,
        unit: 'r',
        description: 'Ecological growth parameter r. Higher birth coeff accelerates the boom-and-bust cycle and initiates multi-period chaos at higher thresholds.'
      }
    ],
    initialState: {
      rabbits: 80,
      foxes: 30,
      vegetation: 90,
      balanceStatus: 'Balanced ecosystem feedback structures are fully peaceful.'
    },
    calculateStep: (step, prev, controls) => {
      const culling = Number(controls.cullingRate ?? 10);
      const noise = Number(controls.initialNoise ?? 0);
      const growR = Number(controls.growthCoeff ?? 2.5);
      const growScale = growR / 2.5;

      let rabbits = prev.rabbits;
      let foxes = prev.foxes;
      let vegetation = prev.vegetation || 90;

      if (culling >= 10) {
        // Regime 1: Steady point attractor. Noise decays exponentially.
        const targetR = Math.round((75 - (culling - 10) * 0.9) * growScale);
        const targetF = Math.round((35 - (culling - 10) * 0.5) * (1.1 - 0.1 * growScale));
        const decay = Math.pow(0.42 / growScale, step);
        const cyclePhase = step * 1.3;
        
        const rOsc = Math.round(Math.sin(cyclePhase) * (20 + noise * 5) * decay);
        const fOsc = Math.round(Math.cos(cyclePhase - 0.9) * 10 * decay);

        rabbits = Math.max(5, targetR + rOsc);
        foxes = Math.max(2, targetF + fOsc);
        vegetation = Math.max(10, Math.min(100, Math.round(95 - rabbits * 0.15)));
      } else if (culling >= 0) {
        // Regime 2: Period 2-Cycle. Steady clean oscillation waves.
        const isOdd = step % 2 === 1;
        // Minor transient decay of initial noise, returns to clean cycle
        const noiseFactor = noise * Math.pow(0.5, step) * 4;

        if (isOdd) {
          rabbits = Math.round(42 * growScale + noiseFactor);
          foxes = Math.round(64 / Math.sqrt(growScale) - noiseFactor * 0.2);
        } else {
          rabbits = Math.round(112 * growScale + noiseFactor * 0.8);
          foxes = Math.round(21 * Math.sqrt(growScale) + noiseFactor * 0.3);
        }
        vegetation = Math.max(10, Math.min(100, Math.round(88 - rabbits * 0.18)));
      } else {
        // Regime 3: Chaotic regime. Sensitizing Sine-coupled Map.
        // Runs a sensitive loop from start to amplify the initial noise difference step-by-step
        let rVal = 80 + noise * 4.2;
        let fVal = 30;

        for (let i = 1; i <= step; i++) {
          const rTemp = rVal;
          const fTemp = fVal;
          // High frequency coupled map that depends on culling protection sensitivity and growth parameter growR
          const sensitiveInput = (rTemp * 0.19 + fTemp * 0.25 - (culling * 0.15)) * growScale;
          
          rVal = 88 + Math.sin(sensitiveInput * 3.8 * growScale) * 72 * Math.pow(growScale, 1.2);
          fVal = 44 + Math.cos(sensitiveInput * 5.1 / growScale) * 32 * Math.pow(growScale, 0.8);
        }

        rabbits = Math.max(4, Math.round(rVal));
        foxes = Math.max(2, Math.round(fVal));
        vegetation = Math.max(5, Math.min(100, Math.round(95 - rabbits * 0.22 - foxes * 0.1)));
      }

      // Safeguards
      rabbits = Math.max(1, rabbits);
      foxes = Math.max(1, foxes);

      let balanceStatus = '';
      if (culling >= 10) {
        balanceStatus = `Stable Attractor Active. Year 0 disturbance (+${noise}k) decays to zero. Populations settle to a steady carrying capacity of ${rabbits}k rabbits & ${foxes}k foxes.`;
      } else if (culling >= 0) {
        balanceStatus = `Period 2-Cycle Oscillation. Populations regularize into clean boom-and-bust loops. The +${noise}k disturbance was absorbed by Year 4.`;
      } else {
        balanceStatus = `⚠️ DETOUR TO CHAOS (Strange Attractor): Culling rate is too low (${culling}%). The population is locked in an unpredictable, custom butterfly trajectory. Try modifying the disturbance (+${noise}k) to watch the curves diverge!`;
      }

      return {
        rabbits,
        foxes,
        vegetation,
        balanceStatus
      };
    },
    metrics: [
      { key: 'rabbits', label: 'Herbivores (Rabbits)', color: 'text-emerald-400', formatter: (val) => `${val}k population` },
      { key: 'foxes', label: 'Predators (Foxes)', color: 'text-indigo-400', formatter: (val) => `${val}k population` },
      { key: 'vegetation', label: 'Habitat Vegetation', color: 'text-amber-500', formatter: (val) => `${val}% density` }
    ],
    analysis: (state, controls) => {
      const culling = Number(controls.cullingRate ?? 10);
      const noise = Number(controls.initialNoise ?? 0);

      if (culling >= 10) {
        return {
          title: 'Steady State Stabilised',
          text: `With predator culling set to ${culling}%, the ecological feedback loop functions as a stable point attractor. Even when introducing a +${noise}k rabbit disturbance, the populations safely absorb the impact and converge back to the identical carrying capacity.`,
          isCritical: false
        };
      } else if (culling >= 0) {
        return {
          title: 'Periodic Limit Cycle Stable',
          text: `At a culling rate of ${culling}%, the predator-prey dynamics settle into a stable 2-period limit cycle (regular oscillations of boom-and-bust). The early +${noise}k disturbance is filtered out over successive periods, proving that while cyclic, the system is highly predictable.`,
          isCritical: false
        };
      }
      return {
        title: 'Strange Attractor: Deterministic Chaos',
        text: `With predator protection culling reduced to ${culling}%, the system crossed the critical period-doubling bifurcation threshold! Your ecosystem is now on a chaotic strange attractor. While 100% deterministic, it has extreme sensitivity to initial conditions: the minor +${noise}k disturbance caused the trajectories to completely diverge from the starting baseline!`,
        isCritical: true
      };
    }
  },
  {
    id: 'phantom-traffic',
    domain: 'Urban',
    name: 'Phantom Traffic Jams',
    chaosConcept: 'Emergent Self-Organization & Shockwave Chaos',
    learningObjective: 'Observe how a single driver’s minor tap on the brake pedal triggers back-propagating shockwaves (jams) under heavy volume, and how Adaptive Cruise Control (ACC) can dissolve it.',
    timeLabel: 'Second',
    maxSteps: 8,
    controls: [
      {
        id: 'trafficDensity',
        label: 'Vehicle Ring Density',
        type: 'slider',
        min: 20,
        max: 85,
        step: 5,
        defaultValue: 65,
        unit: '%',
        description: 'Represents the density of vehicles on the highway. Higher density squeezes safety thresholds.'
      },
      {
        id: 'brakingModel',
        label: 'Driver Reactivity (Panic Braking)',
        type: 'slider',
        min: 10,
        max: 95,
        step: 5,
        defaultValue: 70,
        unit: '%',
        description: 'How aggressively human drivers respond when seeing brake lights in front of them.'
      },
      {
        id: 'enableACC',
        label: 'Enable Adaptive Cruise Control (ACC)',
        type: 'toggle',
        defaultValue: false,
        description: 'Equip all cars with smart ACC radars to smooth driving patterns and absorb speed anomalies.'
      },
      {
        id: 'driverDistraction',
        label: 'Human Driver Distraction Lag',
        type: 'slider',
        min: 1.0,
        max: 3.0,
        step: 0.2,
        defaultValue: 1.5,
        unit: 's',
        description: 'Represents attention delay. High distraction means delayed reactions followed by extreme over-compensation braking.'
      }
    ],
    initialState: {
      averageSpeed: 75, // km/h
      flowRate: 45, // cars/minute
      gridlockPoints: 0, // points of standstill
      visualPositions: Array.from({ length: 22 }).map((_, i) => (i * (360 / 22)) % 360),
      visualSpeeds: Array(22).fill(75),
      clogLog: 'Traffic flow is fully laminar. Vehicles maintain safety buffers easily.'
    },
    calculateStep: (step, prev, controls) => {
      const density = Number(controls.trafficDensity ?? 65);
      const reactivity = Number(controls.brakingModel ?? 70);
      const enableACC = !!controls.enableACC;

      const numCars = Math.round(density / 3);
      
      let speeds = [...prev.visualSpeeds];
      let positions = [...prev.visualPositions];

      // If array size mismatch, reinitialize to match the selected car count
      if (speeds.length !== numCars || positions.length !== numCars) {
        speeds = Array(numCars).fill(75);
        positions = Array.from({ length: numCars }).map((_, i) => (i * (360 / numCars)) % 360);
      }

      let averageSpeed = 75;
      let flowRate = 45;
      let gridlockPoints = 0;
      let clogLog = '';

      if (step === 1) {
        // Trigger Event: Lead Car (Car 0) taps brakes for a floating bird!
        speeds[0] = 25; 
        for (let i = 1; i < numCars; i++) {
          speeds[i] = 75;
        }
        clogLog = 'Trigger Event: Car 0 taps their brake for an object beside the road. Trailing human drivers are unaware of the coming cascade.';
      } else {
        const distraction = Number(controls.driverDistraction ?? 1.5);
        // Calculate physics-based car-following update
        const bufferAdjustment = enableACC ? 1.6 : (1.05 - (density / 100) * 0.5);
        const reactFactor = enableACC ? 0.18 : (reactivity / 100);

        for (let i = 0; i < numCars; i++) {
          const leadIndex = (i - 1 + numCars) % numCars;
          const leadSpeed = prev.visualSpeeds[leadIndex] ?? 75;
          const myPrevSpeed = prev.visualSpeeds[i] ?? 75;

          if (leadSpeed < 72) {
            // Leader is slowing down, back-propagating friction
            const speedDiff = 75 - leadSpeed;
            // Higher density = lower bufferAdjustment = stronger amplified panic deceleration
            // Driver distraction acts as a reaction over-reaction exponent
            let brakeForce = speedDiff * reactFactor * (1.1 / bufferAdjustment) * Math.pow(distraction, 1.4);

            if (enableACC) {
              brakeForce = brakeForce * 0.12; // Radar dampening
            }

            let targetSpeed = myPrevSpeed - brakeForce;
            speeds[i] = Math.max(0, Math.min(75, Math.round(targetSpeed)));
          } else {
            // Accelerate back to cruising speed as the gap clears
            const accelRate = enableACC ? 12 : Math.max(2, Math.round(7 / distraction));
            speeds[i] = Math.min(75, myPrevSpeed + accelRate);
          }
        }

        gridlockPoints = speeds.filter(s => s <= 12).length;
        averageSpeed = Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length);
        flowRate = Math.round((numCars * averageSpeed) / 15);

        if (enableACC) {
          clogLog = 'ACC Radar Active: Car buffers safely absorb the brake tap. The minor speed ripple dissolves completely, returning to smooth high-speed flow.';
        } else if (gridlockPoints > 0) {
          clogLog = `⚠️ PHANTOM SHOCKWAVE ALERT: At ${density}% density, a backward-propagating wave has locked ${gridlockPoints} cars into a complete standstill. No physical obstacle exists!`;
        } else if (density > 52 && step > 3) {
          clogLog = 'The slowing wave is stretching trailing gaps. Slower speeds are developing behind the initial brake point.';
        } else {
          clogLog = 'Low Volume Buffer: Traffic slowed momentarily, but wide spacing allowed the ripple to melt away.';
        }
      }

      // Update position along circular highway track
      positions = positions.map((pos, idx) => {
        const sp = speeds[idx] ?? 75;
        // Speeds are mapped to angular degree change
        return (pos + sp * 0.12) % 360;
      });

      return {
        averageSpeed,
        flowRate,
        gridlockPoints,
        visualSpeeds: speeds,
        visualPositions: positions,
        clogLog
      };
    },
    metrics: [
      { key: 'averageSpeed', label: 'Average Highway Speed', color: 'text-indigo-400', formatter: (val) => `${val} km/h` },
      { key: 'flowRate', label: 'Effective Flow Rate', color: 'text-emerald-400', formatter: (val) => `${val} cars/min` },
      { key: 'gridlockPoints', label: 'Standstill Gridlocks', color: 'text-rose-500', formatter: (val) => `${val} cars stopped` }
    ],
    analysis: (state, controls) => {
      const density = Number(controls.trafficDensity ?? 65);
      const reactivity = Number(controls.brakingModel ?? 70);
      const enableACC = !!controls.enableACC;

      if (enableACC) {
        return {
          title: 'ACC Shock-Dampening (System Safe)',
          text: `Incredible! Equipping vehicles with Adaptive Cruise Control (ACC) filtered out human reaction lag and over-braking. Because ACC reads electronic spacing, it adjusted speed slightly without panic, squelching the shockwave before a macroscopic gridlock could emerge.`,
          isCritical: false
        };
      } else if (density <= 50 || reactivity <= 45) {
        return {
          title: 'Density Buffer Restored',
          text: `At a lower volume of ${density}%, trailing drivers had ample distance cushions. When Car 0 tapped their brakes, the trailing human spacing absorbed the speed fluctuation, dissipating the cascade without triggering a macroscopic halt.`,
          isCritical: false
        };
      }
      return {
        title: 'Macroscopic Shockwave Formed',
        text: `Deterministic Gridlock! Under high volume (${density}%) and human panic reaction (${reactivity}%), safety margins were too thin. Each trailing driver over-reacted and braked harder than the car in front, amplifying a backward-traveling wave. This highlights how individual micro-behaviors naturally self-organize into unprompted macroscopic jams.`,
        isCritical: true
      };
    }
  },
  {
    id: 'power-grid',
    domain: 'Urban',
    name: 'Cascading Blackout Grid',
    chaosConcept: 'Criticality Thresholds & Domino Feedback Loops',
    learningObjective: 'Adjust operating reserves and strike surges to identify the precise threshold where localized line failures avalanche into a regional grid blackout.',
    timeLabel: 'Minute',
    maxSteps: 6,
    controls: [
      {
        id: 'operatingReserve',
        label: 'Operating Reserve Margin',
        type: 'slider',
        min: 10,
        max: 60,
        step: 5,
        defaultValue: 15,
        unit: '%',
        description: 'Excess physical capacity buffer built into substations. Large buffers absorb surges, but thin margins increase efficiency.'
      },
      {
        id: 'initialLoad',
        label: 'Grid Demand Load Level',
        type: 'slider',
        min: 50,
        max: 95,
        step: 5,
        defaultValue: 80,
        unit: '%',
        description: 'Base consumer energy load level on the grid. Higher levels consume safety buffer space.'
      },
      {
        id: 'redundantPaths',
        label: 'Interconnection Redundancy',
        type: 'slider',
        min: 2,
        max: 4,
        step: 1,
        defaultValue: 2,
        unit: 'paths',
        description: 'Number of alternative routing lines that power gets redistributed to when a node fails. Higher splits density.'
      }
    ],
    initialState: {
      substations: [
        { name: 'Substation Alpha (Hub)', load: 90, threshold: 105, status: 'operational' },
        { name: 'Substation Beta (North)', load: 70, threshold: 80, status: 'operational' },
        { name: 'Substation Gamma (East)', load: 60, threshold: 70, status: 'operational' },
        { name: 'Substation Delta (South)', load: 50, threshold: 60, status: 'operational' },
        { name: 'Substation Epsilon (West)', load: 55, threshold: 65, status: 'operational' }
      ],
      gridIntegrity: 100, // % active
      overloadWarning: 'Regional grid is stable. Transformers operate well within designed thermal tolerances.'
    },
    calculateStep: (step, prev, controls) => {
      const reserve = Number(controls.operatingReserve ?? 15);
      const demand = Number(controls.initialLoad ?? 80);

      // Scale factors based on initial demand (normalized to 80%)
      const loadFactor = demand / 80;

      // Base loads
      const baseValues = [90, 70, 60, 50, 55];
      let substations = JSON.parse(JSON.stringify(prev.substations));

      // Re-initialize thresholds and capacities at step 0 or if not matching
      substations.forEach((sub: any, i: number) => {
        const baseVal = baseValues[i];
        sub.threshold = Math.round(baseVal * (1 + reserve / 100));
        
        // At Step 0, reset loads
        if (step === 0) {
          sub.load = Math.round(baseVal * loadFactor);
          sub.status = 'operational';
        }
      });

      let gridIntegrity = 100;
      let overloadWarning = '';

      if (step === 0) {
        overloadWarning = `Grid initialized at ${demand}% capacity. Safety margin of +${reserve}% gives a global capacity buffer. No high-frequency thermal warnings.`;
      } else if (step === 1) {
        // Step 1: External strike surge on Substation Alpha
        const alphaBase = Math.round(baseValues[0] * loadFactor);
        const surge = 55; // 55 MW strike surge
        const surgedLoad = alphaBase + surge;
        
        substations[0].load = surgedLoad;
        if (surgedLoad > substations[0].threshold) {
          substations[0].status = 'overloaded';
          overloadWarning = `⚡ EXTERNAL SURGE DAMAGE: Lightning storm downs a feeder line to Alpha, introducing +55MW excess. Current load (${surgedLoad}MW) triggers a critical THERMAL BREACH OVERLOAD!`;
        } else {
          substations[0].status = 'operational';
          overloadWarning = `⚡ Strike surge of +55MW hits Alpha. High capacity buffer (+${reserve}%) successfully holds the voltage strain without thermal breach.`;
        }
      } else if (step === 2) {
        // Step 2: Alpha Trips (Breakers open)
        const alphaStatus = prev.substations[0].status;
        const alphaPriorLoad = prev.substations[0].load;
        const paths = Number(controls.redundantPaths ?? 2);

        substations[0].status = 'tripped';
        substations[0].load = 0;

        // Load gets redistributed to backup looping lines Beta and Gamma, and potentially Delta/Epsilon if paths > 2
        // Division is linear paths reciprocal multiplier
        const targets = [1, 2, 3, 4].slice(0, paths); // indices of backup substations
        const spilledLoad = Math.round(alphaPriorLoad / paths);
        
        targets.forEach(idx => {
          substations[idx].load += spilledLoad;
        });

        let warningParts = [];
        if (substations[1].load > substations[1].threshold) {
          substations[1].status = 'overloaded';
          warningParts.push('Beta');
        }
        if (substations[2].load > substations[2].threshold) {
          substations[2].status = 'overloaded';
          warningParts.push('Gamma');
        }
        if (paths > 2 && substations[3].load > substations[3].threshold) {
          substations[3].status = 'overloaded';
          warningParts.push('Delta');
        }

        const linkNames = warningParts.map(x => `${x} Link`).join(' & ');
        if (warningParts.length > 0) {
          overloadWarning = `🔌 BREAKER OUTAGE cascade: Alpha tripped! Spilling ${alphaPriorLoad}MW across ${paths} redundant backup paths. Safety capacity exceeded: ${linkNames} went into red alarm overloads.`;
        } else {
          overloadWarning = `🔌 Alpha isolated successfully. Spilled ${alphaPriorLoad}MW across ${paths} redundant backup paths, holding voltages steady.`;
        }
      } else if (step === 3) {
        // Step 3: Beta and Gamma (and Delta if paths > 2) Trip if overloaded
        const paths = Number(controls.redundantPaths ?? 2);
        let localShed = 0;
        let trippedSubName = [];

        const checkIndices = [1, 2];
        if (paths > 2) checkIndices.push(3);

        checkIndices.forEach(idx => {
          if (prev.substations[idx].status === 'overloaded') {
            substations[idx].status = 'tripped';
            localShed += prev.substations[idx].load;
            substations[idx].load = 0;
            const subName = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'][idx];
            trippedSubName.push(subName);
          }
        });

        if (localShed > 0) {
          // Shed load spillage goes down to Delta and Epsilon (or Epsilon if Delta already tripped/tripping)
          const backupTargets = [];
          if (substations[3].status === 'operational' || substations[3].status === 'overloaded') backupTargets.push(3);
          if (substations[4].status === 'operational' || substations[4].status === 'overloaded') backupTargets.push(4);

          const divCount = backupTargets.length || 1;
          const spilledPercent = Math.round(localShed / divCount);

          backupTargets.forEach(idx => {
            substations[idx].load += spilledPercent;
          });

          let nextOverloads = [];
          if (substations[3].status !== 'tripped' && substations[3].load > substations[3].threshold) {
            substations[3].status = 'overloaded';
            nextOverloads.push('Delta');
          }
          if (substations[4].status !== 'tripped' && substations[4].load > substations[4].threshold) {
            substations[4].status = 'overloaded';
            nextOverloads.push('Epsilon');
          }

          if (nextOverloads.length > 0) {
            overloadWarning = `🔥 DOMINO CASCADE: Overloaded hubs ${trippedSubName.join(' & ')} tripped! Spilled load of ${localShed}MW redirected to backing downstream. ${nextOverloads.join(' & ')} went overload red!`;
          } else {
            overloadWarning = `💥 Overloaded hubs ${trippedSubName.join(' & ')} tripped. Under heavy volume, remaining active backups successfully absorbed the excess power.`;
          }
        } else {
          overloadWarning = `❄️ Cascade arrested. Localized isolation completed containment. Grid enters a safe steady-state layout.`;
        }
      } else if (step === 4) {
        // Step 4: Delta & Epsilon Trip
        let bottomShed = 0;
        let finalTrips = [];

        if (prev.substations[3].status === 'overloaded') {
          substations[3].status = 'tripped';
          substations[3].load = 0;
          finalTrips.push('Delta');
        }
        if (prev.substations[4].status === 'overloaded') {
          substations[4].status = 'tripped';
          substations[4].load = 0;
          finalTrips.push('Epsilon');
        }

        if (finalTrips.length > 0) {
          overloadWarning = `🚨 COMPLETE GRID FAILURE: Backup substations ${finalTrips.join(' & ')} tripped instantly under thermal fire risks. Reactive megawatt loops have collapsed completely.`;
        } else {
          overloadWarning = `✓ Grid voltage is stabilizing. High-frequency filters locked downstream safety. Rest of grid remains online.`;
        }
      } else {
        // Step 5 & 6: Final check
        const activeCount = substations.filter((s: any) => s.status === 'operational').length;
        if (activeCount === 0) {
          overloadWarning = `⛔ SYSTEM-WIDE COLLAPSE: 0/5 hubs active. The entire regional urban quadrant is blacked out. The total lack of capacity headroom turned a single strike into complete structural darkness.`;
        } else {
          const names = substations.filter((s: any) => s.status === 'operational').map((s: any) => s.name.split(' ')[1]).join(', ');
          overloadWarning = `🌿 RESILIENT SEGREGATION SUCCESS: Margin of +${reserve}% prevented a domino collapse. Staged circuit isolating protected ${activeCount}/5 hubs (${names}). Infrastructure remains secure.`;
        }
      }

      // Calculate grid health
      const operationalCount = substations.filter((s: any) => s.status === 'operational').length;
      gridIntegrity = Math.round((operationalCount / 5) * 100);

      return {
        substations,
        gridIntegrity,
        overloadWarning
      };
    },
    metrics: [
      { key: 'gridIntegrity', label: 'Global Grid Integrity', color: 'text-indigo-400', formatter: (val) => `${val}% Online` },
      { key: 'substations', label: 'Operational Substations', color: 'text-emerald-400', formatter: (val: any[]) => `${val.filter(s => s.status === 'operational').length}/5 Hubs` }
    ],
    analysis: (state, controls) => {
      const reserve = Number(controls.operatingReserve ?? 15);
      const demand = Number(controls.initialLoad ?? 80);

      if (reserve >= 35 && demand <= 80) {
        return {
          title: 'Domino Chain Arrested (System Resilient)',
          text: `Incredible! A generous +${reserve}% operating margin provided the necessary capacity headroom (slack) for neighboring substations Beta & Gamma to safely absorb Alpha's emergency load redistribution. Although localized disruptions occurred, the domino cascading feedback was blocked, preventing a macroscopic urban collapse.`,
          isCritical: false
        };
      }
      return {
        title: 'Macroscopic Cascading Failure Triggered!',
        text: `Grid criticality crossed the tipping point! With thin operating margins (+${reserve}% reserve) and heavy demand load (${demand}%), safety buffers were immediately breached. Once Alpha tripped, its surge spilled onto adjacent Beta & Gamma loops, overloading them and setting off an unavoidable cascading chain reaction. Your entire grid blacked out to 0%. This proves how extreme lean optimization makes interconnected infrastructures critically fragile to minor triggers.`,
        isCritical: true
      };
    }
  },
  {
    id: 'pandemic-outbreak',
    domain: 'Public Health',
    name: 'Pandemic: Early vs. Delayed Response',
    chaosConcept: 'Exponential growth & sensitive initial states',
    learningObjective: 'Observe path-dependency in epidemiology: see how tiny initial differences or a 1-period postponement in social triggers cascade into catastrophic national outbreaks.',
    timeLabel: 'Epidemic Phase',
    maxSteps: 6,
    controls: [
      {
        id: 'interventionPhase',
        label: 'Disease Mitigation Response Timing',
        type: 'slider',
        min: 1,
        max: 5,
        step: 1,
        defaultValue: 4,
        unit: 'Phase',
        description: 'Declare social regulations and lockdowns at the selected Phase. Phase 1 is proactive early containment; Phase 4-5 is reactive delay.'
      },
      {
        id: 'superspreaderCount',
        label: 'Initial Superspreader Seeds',
        type: 'slider',
        min: 0,
        max: 4,
        step: 1,
        defaultValue: 1,
        unit: 'Gatherings',
        description: 'Random cluster events occurring at Outbreak start. More clusters multiply initial cases and trigger aggressive growth trajectories.'
      },
      {
        id: 'transmissionRateModifier',
        label: 'Transmission Virulence Mutator',
        type: 'slider',
        min: 0.8,
        max: 1.8,
        step: 0.1,
        defaultValue: 1.0,
        unit: 'x',
        description: 'Multiplies unmitigated infectiousness as an exponential factor representing viral mutation severity.'
      }
    ],
    initialState: {
      susceptible: 1000000,
      infected: 10,
      recovered: 0,
      deceased: 0,
      r0Value: 3.5,
      phaseReport: 'Outbreak detected. Epidemic curves are highly sensitive to contact density seeding patterns.'
    },
    calculateStep: (step, prev, controls) => {
      const interventionPhase = Number(controls.interventionPhase ?? 4);
      const superspreaderCount = Number(controls.superspreaderCount ?? 1);
      const mutator = Number(controls.transmissionRateModifier ?? 1.0);
      
      let susceptible = prev.susceptible;
      let infected = prev.infected;
      let recovered = prev.recovered;
      let Deceased = prev.deceased;
      let r0Value = prev.r0Value;
      let phaseReport = '';

      if (step === 0) {
        infected = 10 + superspreaderCount * 25;
        susceptible = 1000000 - infected;
        recovered = 0;
        Deceased = 0;
        r0Value = (3.2 + (superspreaderCount * 0.25)) * mutator;
        phaseReport = `Epidemic initialized. Patient Zero is supported in quarantine. Contact tracing flags ${superspreaderCount} active urban transmission clusters.`;
        return { susceptible, infected, recovered, deceased: Deceased, r0Value, phaseReport };
      }

      // Standard SIR process with threshold mitigation
      const hasIntervened = step >= interventionPhase;

      if (hasIntervened) {
        // Mitigated propagation (lockdown/mitigation is in power)
        r0Value = (0.68 + (superspreaderCount * 0.04)) * Math.sqrt(mutator); // below 1 triggers decay
        const recoveryRate = 0.45;
        const recoveredNow = Math.round(infected * recoveryRate);
        const newlyInfected = Math.round(infected * r0Value * 0.18);
        
        infected = Math.max(0, infected + newlyInfected - recoveredNow);
        recovered = recovered + recoveredNow;
        susceptible = Math.max(0, susceptible - newlyInfected);
        
        // Fatality depends on current clinical stress
        const clinicalOverload = infected > 20000;
        const baseFatality = clinicalOverload ? 0.045 : 0.012;
        Deceased = Deceased + Math.round(recoveredNow * baseFatality);
      } else {
        // High unmitigated R0
        r0Value = (3.2 + (superspreaderCount * 0.3)) * Math.pow(mutator, 1.4);
        const newlyInfected = Math.round(infected * r0Value * 0.65);
        const recoveryRate = 0.18;
        const recoveredNow = Math.round(infected * recoveryRate);

        infected = Math.min(1000000, infected + newlyInfected - recoveredNow);
        recovered = recovered + recoveredNow;
        susceptible = Math.max(0, susceptible - newlyInfected);
        
        const clinicalOverload = infected > 20000;
        const baseFatality = clinicalOverload ? 0.08 : 0.02;
        Deceased = Deceased + Math.round(infected * baseFatality * 0.05 * mutator);
      }

      // Immersive reports
      if (step === 1) {
        if (superspreaderCount > 1) {
          phaseReport = `🚨 SUPER-SPREAD TRIGGERED: Mass gatherings in Metro airports seed ${superspreaderCount} high-density vectors. Clinics note massive spikes in acute respiratory infections.`;
        } else {
          phaseReport = 'Outbreak spreads from the central logistics Hub. Hospitals report isolated cases of acute atypical fever.';
        }
      } else if (step === 2) {
        phaseReport = hasIntervened 
          ? '🏠 EARLY CONTAINMENT ACTIVE: Public lock downs and facial filters decrease transmissibility. Localized containment successfully intercepts main vector lines.'
          : '⚠️ SYSTEM ESCALATION: Absence rates hit 25% in downtown administrative blocks. Large public events continue without sanitary controls.';
      } else if (step === 3) {
        phaseReport = hasIntervened
          ? '📉 CURVE FLATTENING: Local case volumes peak and drop below hospital critical capacities. Isolated wards handle recovery cases efficiently.'
          : '🔥 UNCONTROLLED INFECTION: Intensive care beds reach 100% capacity in all central districts. Triage protocol declared for heavy respirator demands.';
      } else if (step === 4) {
        phaseReport = hasIntervened 
          ? '🌿 STEADY CONTAINMENT: Healthcare pressure subsides. Outbreak is locked down inside localized quarantined clusters.'
          : '🚨 NATIONAL EMERGENCY: Temporary field clinics erected in regional civic centers. Medical nurse shortages worsen due to therapist sickness.';
      } else if (step === 5) {
        phaseReport = hasIntervened 
          ? '✓ VICTORY RECORDED: Outbreak successfully controlled. The rapid timing of response saved thousands of lives.'
          : '⛔ SYSTEM COLLAPSE: Wave peaks with massive casualties. High-frequency societal functions are severely disrupted by general lockouts.';
      } else {
        phaseReport = hasIntervened 
          ? 'The epidemic waves subside. Societal components return to standard operation with minimum disruptions.'
          : 'The virus burns through the remaining susceptible pool and slowly recedes, leaving profound community impact.';
      }

      return {
        susceptible,
        infected,
        recovered,
        deceased: Deceased,
        r0Value: Math.round(r0Value * 100) / 100,
        phaseReport
      };
    },
    metrics: [
      { key: 'infected', label: 'Active Infection Cases', color: 'text-rose-450', formatter: (val) => `${val.toLocaleString()} Active` },
      { key: 'deceased', label: 'Cumulative Casualties', color: 'text-zinc-400', formatter: (val) => `${val.toLocaleString()} Deaths` },
      { key: 'r0Value', label: 'Effective Reproduction (Rt)', color: 'text-amber-500', formatter: (val) => `Rt = ${val}` }
    ],
    analysis: (state, controls) => {
      const phase = Number(controls.interventionPhase ?? 4);
      const superspreaderCount = Number(controls.superspreaderCount ?? 1);
      
      if (phase <= 2 && superspreaderCount <= 1) {
        return {
          title: 'Epidemic Eradicated (Curve Flattened)',
          text: `Incredible foresight! By launching mitigation actions early on Phase ${phase} alongside light cluster seeding, you successfully squashed the exponential rise. Active cases peaked at a manageable ${state.infected.toLocaleString()}, allowing physicians to provide adequate support and hold deaths to only ${state.deceased.toLocaleString()}. This highlights the high impact of early timing in non-linear epidemics.`,
          isCritical: false
        };
      }
      return {
        title: 'Runaway Pandemic Outbreak!',
        text: `The exponential trigger achieved terminal velocity! Due to delayed intervention (Phase ${phase}) and active superspreader gathering seeds (${superspreaderCount}), the virus reproduced faster than standard social isolation could intercept. Infection count surged to ${state.infected.toLocaleString()}, triggering triage constraints that drove deaths to a devastating ${state.deceased.toLocaleString()}. This reveals how small initial delays inside chaotic systems cause cascading catastrophes.`,
        isCritical: true
      };
    }
  },
  {
    id: 'vaccination-threshold',
    domain: 'Public Health',
    name: 'Vaccination Herd Immunity',
    chaosConcept: 'Bifurcation & Threshold boundaries',
    learningObjective: 'Locate the exact "herd immunity critical threshold" where a 1% decline in vaccination turns quick disease eradication into viral outbreak expansion.',
    timeLabel: 'Year',
    maxSteps: 5,
    controls: [
      {
        id: 'vaccinationCoverage',
        label: 'Community Vaccination Rate',
        type: 'slider',
        min: 60,
        max: 98,
        step: 1,
        defaultValue: 83,
        unit: '%',
        description: 'Herd immunity threshold bifurcates depending on infectivity. Find what happens on either side.'
      },
      {
        id: 'pathogenInfectivity',
        label: 'Pathogen Infectivity (Raw R0)',
        type: 'slider',
        min: 2.0,
        max: 9.0,
        step: 0.5,
        defaultValue: 4.5,
        unit: 'R0',
        description: 'Represents viral contagiousness. High R0 values mathematically shift the bifurcation threshold to over 90%.'
      }
    ],
    initialState: {
      coverage: 83,
      newInfections: 120, // baseline
      susceptibleLeft: 15000,
      eradicationProgress: 'Pathogen remains endemic in urban pockets.'
    },
    calculateStep: (step, prev, controls) => {
      const coverage = Number(controls.vaccinationCoverage);
      
      const threshold = 85; 
      const isAboveThreshold = coverage >= threshold;

      let newInfections = prev.newInfections;
      let susceptibleLeft = prev.susceptibleLeft;
      let eradicationProgress = '';

      if (step === 1) {
        newInfections = 120;
        susceptibleLeft = Math.round(15000 * (1 - coverage / 100));
        eradicationProgress = 'Pathogen introduced via international travelers.';
      } else {
        // Pathogen propagation math based on threshold bifurcation
        if (isAboveThreshold) {
          // Extinction cycle: R0 is effectively < 1.0 (e.g., 0.6) because virus hits vaccinated walls
          const transCoeff = 0.5 - (coverage - 85) * 0.05;
          newInfections = Math.max(0, Math.round(prev.newInfections * transCoeff));
          susceptibleLeft = Math.max(0, Math.round(prev.susceptibleLeft - newInfections));
          
          if (newInfections <= 2) {
            eradicationProgress = 'ERADICATED: Pathogen can find no available susceptible hosts. Local transmission ceases entirely!';
          } else {
            eradicationProgress = 'Eradication program in active alignment. Transmission pools shrinking.';
          }
        } else {
          // Outbreak cycle: R0 > 1.0. Lower coverage = faster exponential bifurcation
          const deficiencyFactor = (85 - coverage) * 0.28;
          const growthRate = 1.15 + deficiencyFactor;
          newInfections = Math.round(prev.newInfections * growthRate);
          susceptibleLeft = Math.max(0, Math.round(prev.susceptibleLeft - newInfections * 0.1));
          
          if (newInfections > 1000) {
            eradicationProgress = 'OUTBREAK CRITICAL: Safe thresholds compromised. Disease expands into full societal epidemic.';
          } else {
            eradicationProgress = 'Pathogen propagates. Containment barriers overwhelmed in low-coverage suburbs.';
          }
        }
      }

      return {
        coverage,
        newInfections,
        susceptibleLeft,
        eradicationProgress
      };
    },
    metrics: [
      { key: 'newInfections', label: 'Annual New Infections', color: 'text-rose-600', formatter: (val) => `${val} cases` },
      { key: 'susceptibleLeft', label: 'Remaining Vulnerable Hosts', color: 'text-amber-500', formatter: (val) => `${val} citizens` }
    ],
    analysis: (state, controls) => {
      const coverage = Number(controls.vaccinationCoverage);
      const infectivity = Number(controls.pathogenInfectivity ?? 4.5);
      const threshold = Math.min(96, Math.max(70, Math.round((1 - 1 / infectivity) * 105))); 
      const isAboveThreshold = coverage >= threshold;

      if (isAboveThreshold) {
        return {
          title: `Herd Immunity Active (Passed Threshold ${threshold}%)`,
          text: `Outstanding! At ${coverage}% vaccination (above the dynamically shifted ${threshold}% critical threshold), there are not enough vulnerable people to sustain transmission. This dynamic threshold is derived from Pc = 1 - 1/R0. Each infected person encounters vaccinated individuals, stopping the chain. New Infections collapsed to ${state.newInfections} by Year 5, proving eradication.`,
          isCritical: false
        };
      }
      return {
        title: `Outbreak Explosion (Below Threshold ${threshold}%)`,
        text: `At ${coverage}% coverage (below the dynamically calculated ${threshold}% threshold required for R0 = ${infectivity}), herd immunity collapsed. Even though ${coverage}% looks high, the remaining vulnerable population allowed the virus to form continuous connection vectors. Infections escalated to ${state.newInfections} cases. A mere 1% difference completely flips the system from total eradication to widespread outbreak (a classic mathematical bifurcation).`,
        isCritical: true
      };
    }
  },
  {
    id: 'fake-news',
    domain: 'Social',
    name: 'Fake News Cascade',
    chaosConcept: 'Contagion networks & positive feedback loops',
    learningObjective: 'Observe how an unmoderated viral rumor breeds a self-amplifying cascade, and contrast it with early content flagging.',
    timeLabel: 'News Cycle',
    maxSteps: 5,
    controls: [
      {
        id: 'moderationEarly',
        label: 'Early Moderation & Flagging',
        type: 'toggle',
        defaultValue: false,
        description: 'Initiate third-party fact-checking and algorithmic restriction during Cycle 1.'
      },
      {
        id: 'echoChamberIntensity',
        label: 'Echo Chamber Multiplier',
        type: 'slider',
        min: 1.0,
        max: 3.0,
        step: 0.2,
        defaultValue: 1.5,
        unit: 'x',
        description: 'Amplifies outrage and reshare speed. Highly polarized bubbles lock in views and accelerate rumor believers.'
      }
    ],
    initialState: {
      rumorBelievers: 10,
      sharesPercent: 75,
      trustIndex: 90,
      cascadeUpdate: 'Rumor posted online by coordinated troll account.'
    },
    calculateStep: (step, prev, controls) => {
      const moderate = !!controls.moderationEarly;
      const echoChamber = Number(controls.echoChamberIntensity ?? 1.5);
      
      let rumorBelievers = prev.rumorBelievers;
      let sharesPercent = prev.sharesPercent;
      let trustIndex = prev.trustIndex;
      let cascadeUpdate = '';

      if (step === 1) {
        if (moderate) {
          rumorBelievers = Math.round(15 * Math.sqrt(echoChamber));
          sharesPercent = Math.round(15 * Math.sqrt(echoChamber));
          trustIndex = 88;
          cascadeUpdate = 'Fact-checkers immediately flag the post as "Manipulated Content". Distribution algorithm restricts reach.';
        } else {
          rumorBelievers = Math.round(50 * echoChamber);
          sharesPercent = Math.min(100, Math.round(85 * echoChamber));
          trustIndex = 85;
          cascadeUpdate = 'Rumor triggers outrage. Engagement algorithms notice high click-through and pushes it to Feed Tops.';
        }
      } else {
        if (moderate) {
          // rumor dies out
          sharesPercent = Math.max(2, Math.round(sharesPercent - 4 / Math.sqrt(echoChamber)));
          rumorBelievers = Math.round(rumorBelievers * 0.6 * Math.sqrt(echoChamber));
          trustIndex = Math.min(95, trustIndex + 1.5);
          
          if (step === 2) cascadeUpdate = 'Public notices fact-check warning label. Shares collapse by 90%.';
          else if (step === 3) cascadeUpdate = 'Original poster deletes the content due to community friction.';
          else if (step === 4) cascadeUpdate = 'Debunking articles trend. Rumor fully fizzles out.';
          else cascadeUpdate = 'Network fully sanitized. Overall community platform credibility preserved.';
        } else {
          // positive feedback loops of viral outrage
          sharesPercent = Math.min(100, Math.round(prev.sharesPercent + 3 * echoChamber));
          rumorBelievers = Math.round(prev.rumorBelievers * 5.2 * echoChamber);
          trustIndex = Math.max(15, Math.round(prev.trustIndex - (rumorBelievers / (2000 / echoChamber))));

          if (step === 2) cascadeUpdate = 'Unverified local news feeds copy the claim. Group discussions explode.';
          else if (step === 3) cascadeUpdate = 'Sensationalized talk shows repeat the claim. Outrage spills offline.';
          else if (step === 4) cascadeUpdate = 'Protests erupt outside civic offices. Platform is accused of massive algorithmic complicity.';
          else cascadeUpdate = 'Real-world physical panic. Rumor has completely taken over public dialogue, causing structural distrust.';
        }
      }

      return {
        rumorBelievers,
        sharesPercent,
        trustIndex,
        cascadeUpdate
      };
    },
    metrics: [
      { key: 'rumorBelievers', label: 'Citizens Deceived', color: 'text-amber-600', formatter: (val) => `${val.toLocaleString()} people` },
      { key: 'sharesPercent', label: 'Average Share Propensity', color: 'text-rose-500', formatter: (val) => `${val}%` },
      { key: 'trustIndex', label: 'Platform Trust Index', color: 'text-emerald-500', formatter: (val) => `${val}/100` }
    ],
    analysis: (state, controls) => {
      const moderate = !!controls.moderationEarly;
      if (moderate) {
        return {
          title: 'Contagion Suppressed at Source',
          text: 'Excellent intervention. By labeling and throttling the rumor at Cycle 1, you broke the positive feedback loop. People saw warning banners, which lowered confidence and halted reshares. Platform credibility was successfully protected.',
          isCritical: false
        };
      }
      return {
        title: 'Runaway Viral Contagion Cascade!',
        text: 'Without moderation, engagement loops amplified the sensational post. Popular algorithms saw high interactions and promoted it further, leading to a massive spike: from 10 to thousands of deceived citizens. Platform trust dropped to a critical point. This shows how platform routing curves drive self-reinforcing outrage bubbles.',
        isCritical: true
      };
    }
  },
  {
    id: 'viral-tipping',
    domain: 'Social',
    name: 'Viral Trend Tipping Point',
    chaosConcept: 'Social tipping & bandwagon thresholds',
    learningObjective: 'Discover the "25% minority tipping rule" in sociology where a critical mass of early adopters triggers complete majority trend adoption.',
    timeLabel: 'Social Media Round',
    maxSteps: 6,
    controls: [
      {
        id: 'initialAdopters',
        label: 'Initial Influencer Adoption',
        type: 'slider',
        min: 5,
        max: 45,
        step: 2,
        defaultValue: 21,
        unit: '%',
        description: 'Tipping point threshold of adoption depends on peer-to-peer social cohesion.'
      },
      {
        id: 'socialCohesion',
        label: 'Peer Social Cohesion',
        type: 'slider',
        min: 1.0,
        max: 3.0,
        step: 0.2,
        defaultValue: 2.0,
        unit: 'x',
        description: 'Represents network bonding. High social cohesion makes it much easier to tip the majority with lower seed requirements.'
      }
    ],
    initialState: {
      adoptionRate: 21, // %
      momentum: 10, // %
      socialInfluenceIndex: 1.2,
      tippingStatus: 'Trend remains a fringe internet subculture.'
    },
    calculateStep: (step, prev, controls) => {
      const initial = Number(controls.initialAdopters);
      const cohesion = Number(controls.socialCohesion ?? 2.0);
      
      // Dynamic threshold: higher social cohesion lowers required seed threshold
      const threshold = Math.max(10, Math.round(50 - cohesion * 12.5));
      const isAboveTipping = initial >= threshold;

      let adoptionRate = prev.adoptionRate;
      let momentum = prev.momentum;
      let socialInfluenceIndex = prev.socialInfluenceIndex;
      let tippingStatus = '';

      if (step === 1) {
        adoptionRate = initial;
        momentum = isAboveTipping ? Math.round(25 * cohesion / 2) : 8;
        socialInfluenceIndex = isAboveTipping ? (1.25 * cohesion) : 0.9;
        tippingStatus = `Influencers with aggregate ${initial}% coverage begin promoting the trend. Current network threshold is ${threshold}%.`;
      } else {
        if (isAboveTipping) {
          // Bandwagon feedback triggers
          socialInfluenceIndex = prev.socialInfluenceIndex + 0.3 * cohesion * step;
          momentum = Math.min(100, Math.round(prev.momentum + socialInfluenceIndex * 4 * (cohesion / 2)));
          // Exponential saturation curves towards 100%
          adoptionRate = Math.min(99.8, Math.round(prev.adoptionRate + momentum * 1.5 * (cohesion / 2)));
          
          if (adoptionRate > 90) tippingStatus = 'TOTAL DOMINANCE: The trend is now mainstream. Even skeptics adopt to avoid isolation.';
          else if (adoptionRate > 50) tippingStatus = 'MAJORITY CONTAGION: Mid-tier adopters join the bandwagon rapidly.';
          else tippingStatus = `BANDWAGON ENGAGED: Trend passes active threshold (${threshold}%) into widespread internet feeds.`;
        } else {
          // Trend loses steam and dies out
          socialInfluenceIndex = Math.max(0.1, prev.socialInfluenceIndex - 0.15 / (cohesion / 2));
          momentum = Math.max(1, Math.round(prev.momentum * 0.5));
          adoptionRate = Math.max(1.5, Math.round(prev.adoptionRate - (10 - momentum) * 0.6));
          
          if (adoptionRate < 5) tippingStatus = 'FAD EXPIRED: Completely forgotten. Users clean their feed histories.';
          else tippingStatus = `COOLING OFF: Bandwagon failed to trigger below ${threshold}% threshold. Low momentum creates social decay.`;
        }
      }

      return {
        adoptionRate,
        momentum,
        socialInfluenceIndex,
        tippingStatus
      };
    },
    metrics: [
      { key: 'adoptionRate', label: 'Societal Adoption Rate', color: 'text-indigo-600', formatter: (val) => `${val}% adopted` },
      { key: 'momentum', label: 'Trend Network Velocity', color: 'text-rose-500', formatter: (val) => `${val}% momentum` }
    ],
    analysis: (state, controls) => {
      const initial = Number(controls.initialAdopters);
      const cohesion = Number(controls.socialCohesion ?? 2.0);
      const threshold = Math.max(10, Math.round(50 - cohesion * 12.5));
      const isAboveTipping = initial >= threshold;

      if (isAboveTipping) {
        return {
          title: `Tipping Point Activated! (Passed Threshold ${threshold}%)`,
          text: `With an initial influencer seed of ${initial}% (>= ${threshold}% dynamic threshold), the trend successfully tipped. Social cohesion (${cohesion}x) lowered the bandwagon requirement. Once the active commitment minority passed the tipping point, their high coordination converted the silent majority rapidly to ${state.adoptionRate}% coverage.`,
          isCritical: false
        };
      }
      return {
        title: `Fad Dissipated (Flipped Below Threshold ${threshold}%)`,
        text: `At ${initial}% adoption (below the dynamic threshold of ${threshold}% needed for ${cohesion}x social cohesion), the bandwagon never materialized. The general majority ignored the trend, social velocity crashed, and adoption dropped to ${state.adoptionRate}%. Tipping points require exact critical mass relative to social cohesion to survive.`,
        isCritical: true
      };
    }
  }
];
