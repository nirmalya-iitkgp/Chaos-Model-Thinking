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
          text: `Equipping vehicles with Adaptive Cruise Control (ACC) eliminated human braking reaction delay. Maintaining electronic headway spacing prevented the amplification of deceleration waves, preserving steady traffic flow.`,
          isCritical: false
        };
      } else if (density <= 50 || reactivity <= 45) {
        return {
          title: 'Density Buffer Restored',
          text: `At a volume of ${density}%, headway cushions allowed trailing drivers to absorb speed fluctuations without initiating a macroscopic stop-and-go wave.`,
          isCritical: false
        };
      }
      return {
        title: 'Macroscopic Shockwave Formed',
        text: `Under vehicle density of ${density}% and driver reaction delay (${reactivity}%), backward-propagating deceleration waves amplified upstream, causing a localized standstill without physical blockage.`,
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
          text: `An operating reserve margin of +${reserve}% provided sufficient capacity for neighboring substations Beta and Gamma to absorb load shed from Alpha, arresting the cascade before system-wide collapse.`,
          isCritical: false
        };
      }
      return {
        title: 'Macroscopic Cascading Failure Triggered',
        text: `With an operating reserve margin of +${reserve}% and peak demand (${demand}%), redirecting Alpha's load pushed adjacent loops beyond thermal trip thresholds, initiating a cascading blackout across downstream substations.`,
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
          text: `Early intervention at Phase ${phase} alongside contact tracing kept transmission reproduction below replacement. Active cases peaked at ${state.infected.toLocaleString()}, allowing hospital capacity to support all patients and limiting deaths to ${state.deceased.toLocaleString()}.`,
          isCritical: false
        };
      }
      return {
        title: 'Exponential Outbreak Phase',
        text: `Delayed intervention until Phase ${phase} allowed unchecked viral transmission. Cases escalated to ${state.infected.toLocaleString()}, exceeding clinical capacity and leading to ${state.deceased.toLocaleString()} cumulative fatalities.`,
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
          title: `Herd Immunity Active (Threshold: ${threshold}%)`,
          text: `At ${coverage}% vaccination (exceeding the critical threshold Pc = 1 - 1/R0 of ${threshold}%), immune individuals shield vulnerable members, preventing sustained chains of infection and reducing annual cases to ${state.newInfections}.`,
          isCritical: false
        };
      }
      return {
        title: `Outbreak Sustained (Below Threshold: ${threshold}%)`,
        text: `At ${coverage}% coverage (below the critical threshold of ${threshold}% for R0 = ${infectivity}), the remaining susceptible population maintains contiguous transmission paths, causing annual infections to reach ${state.newInfections}. A marginal drop below the critical point flips the system from containment to recurrence.`,
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
  },
  {
    id: 'conway-life',
    domain: 'Emergence & Complexity',
    name: 'Conway’s Life & Langton’s Ant',
    chaosConcept: 'Cellular Automata, Emergence & Computation',
    learningObjective: 'Observe how microscopic deterministic local rules generate self-replicating gliders, chaotic oscillators, and the emergent 104-step highway structure of Langton’s Ant from pure stochastic noise.',
    timeLabel: 'Epoch',
    maxSteps: 6,
    controls: [
      {
        id: 'simulationMode',
        label: 'Automaton Model Mode',
        type: 'slider',
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 0,
        description: '0: Conway’s Standard (B3/S23), 1: HighLife Replicator (B36/S23), 2: Langton’s Ant (2-state emergent highway)'
      },
      {
        id: 'gridDensity',
        label: 'Initial Seed Density',
        type: 'slider',
        min: 10,
        max: 50,
        step: 5,
        defaultValue: 25,
        unit: '%',
        description: 'Initial percentage of active live cells or seed particles on the lattice.'
      },
      {
        id: 'mutationNoise',
        label: 'Entropy Perturbation Noise',
        type: 'slider',
        min: 0,
        max: 5,
        step: 1,
        defaultValue: 0,
        unit: '%',
        description: 'Stochastic cosmic bit-flips injected each epoch to test structural resilience.'
      }
    ],
    initialState: {
      liveCells: 300,
      activeDensity: 25,
      entropy: 0.72,
      gliderCount: 2,
      phaseDescription: 'Initial random soup seeded on the 2D lattice. Micro-scale interaction begins.'
    },
    calculateStep: (step, prev, controls) => {
      const mode = Number(controls.simulationMode ?? 0);
      const density = Number(controls.gridDensity ?? 25);
      const noise = Number(controls.mutationNoise ?? 0);

      let liveCells = prev.liveCells;
      let activeDensity = prev.activeDensity;
      let entropy = prev.entropy;
      let gliderCount = prev.gliderCount;
      let phaseDescription = '';

      if (mode === 2) {
        // Langton's Ant trajectory
        const stepsCount = step * 1800;
        const inHighway = stepsCount >= 8000;
        liveCells = Math.round(150 + step * 95);
        activeDensity = Math.round((liveCells / 1600) * 100);
        entropy = inHighway ? 0.22 : Math.max(0.4, 0.85 - step * 0.08);
        gliderCount = inHighway ? 1 : 0;
        phaseDescription = inHighway 
          ? `EMERGENT HIGHWAY ENGAGED: After chaotic wandering, the ant locked into the famous 104-step self-repeating diagonal highway!`
          : `Chaotic build phase (~${stepsCount} steps): Ant modifies grid symmetrically, forming pseudo-fractal card patterns.`;
      } else if (mode === 1) {
        // HighLife Replicator
        liveCells = Math.min(1200, Math.round(prev.liveCells * 1.25 + noise * 15));
        activeDensity = Math.min(75, Math.round((liveCells / 1600) * 100));
        entropy = Math.min(0.9, Math.round((0.55 + step * 0.05) * 100) / 100);
        gliderCount = step * 2;
        phaseDescription = `HighLife B36/S23: Replicator pattern clones itself every 12 generations. Population expanding exponentially.`;
      } else {
        // Conway B3/S23
        if (step === 1) {
          liveCells = Math.round(1600 * (density / 100) * 0.75);
          gliderCount = Math.max(1, Math.round(density / 15));
          phaseDescription = 'Extinction wave: isolated cells die of underpopulation, dense clusters die of overcrowding.';
        } else if (step === 2) {
          liveCells = Math.round(prev.liveCells * 0.88 + noise * 12);
          gliderCount = prev.gliderCount + 1;
          phaseDescription = 'Stable structures crystallize: Blinkers, Blocks, Gliders, and Beehives separate from chaos.';
        } else if (step === 3) {
          liveCells = Math.round(prev.liveCells * 0.94);
          phaseDescription = 'Gliders traverse empty voids. Collisions either annihilate or breed new secondary oscillators.';
        } else {
          liveCells = Math.max(80, Math.round(prev.liveCells * (0.97 + (noise * 0.02))));
          phaseDescription = `Self-organized criticality reached: Steady state balance of gliders, pulsars, and still lifes.`;
        }
        activeDensity = Math.min(60, Math.max(5, Math.round((liveCells / 1600) * 100)));
        entropy = Math.max(0.15, Math.round((0.7 - step * 0.08 + (noise * 0.04)) * 100) / 100);
      }

      return {
        liveCells,
        activeDensity,
        entropy,
        gliderCount,
        phaseDescription
      };
    },
    metrics: [
      { key: 'liveCells', label: 'Living Cells', color: 'text-emerald-500', formatter: (val) => `${val} cells` },
      { key: 'activeDensity', label: 'Lattice Density', color: 'text-indigo-500', formatter: (val) => `${val}%` },
      { key: 'entropy', label: 'Shannon Entropy', color: 'text-amber-500', formatter: (val) => `${val} bits` }
    ],
    analysis: (state, controls) => {
      const mode = Number(controls.simulationMode ?? 0);
      if (mode === 2) {
        return {
          title: 'Langton’s Ant Emergence Theorem',
          text: `Langton's Ant demonstrates that extremely simple local rules (turn 90° right on white, turn 90° left on black) create deterministic chaos that inevitably organizes into a periodic 104-step diagonal highway, proving how complex computational order emerges spontaneously.`,
          isCritical: false
        };
      }
      return {
        title: 'Universal Computation at the Edge of Chaos',
        text: `Conway's Game of Life is Turing complete. Simple cell-level binary rules generate self-propelled structures (gliders), logic gates (glider guns), and memory cells. System density settled to ${state.activeDensity}% with ${state.liveCells} active organisms.`,
        isCritical: false
      };
    }
  },
  {
    id: 'preferential-attachment',
    domain: 'Social',
    name: 'Preferential Attachment (Scale-Free Graph)',
    chaosConcept: 'Power-Law Distribution & "Rich-Get-Richer" Feedback',
    learningObjective: 'Discover how linear preferential attachment (Barabási–Albert model) generates scale-free hubs, and explore the bifurcation boundary between random Poisson graphs and winner-takes-all monopoly hubs.',
    timeLabel: 'Growth Wave',
    maxSteps: 6,
    controls: [
      {
        id: 'attachmentBias',
        label: 'Attachment Bias (α Power Exponent)',
        type: 'slider',
        min: 0.0,
        max: 2.5,
        step: 0.5,
        defaultValue: 1.0,
        unit: 'α',
        description: 'α=0: Uniform random (Bell curve). α=1: Standard Barabási–Albert scale-free. α>1.5: Winner-takes-all monopoly hub.'
      },
      {
        id: 'edgesPerNode',
        label: 'Edges Per New Node (m)',
        type: 'slider',
        min: 1,
        max: 4,
        step: 1,
        defaultValue: 2,
        description: 'Number of links each newly entering node casts to existing network members.'
      },
      {
        id: 'initialSeedSize',
        label: 'Initial Seed Clique',
        type: 'slider',
        min: 3,
        max: 8,
        step: 1,
        defaultValue: 4,
        description: 'Starting fully connected seed nodes before growth waves begin.'
      }
    ],
    initialState: {
      totalNodes: 12,
      totalEdges: 18,
      maxDegree: 5,
      degreeGini: 0.22,
      networkRegime: 'Early seed cluster. Uniform link distribution across founders.'
    },
    calculateStep: (step, prev, controls) => {
      const alpha = Number(controls.attachmentBias ?? 1.0);
      const m = Number(controls.edgesPerNode ?? 2);
      const seed = Number(controls.initialSeedSize ?? 4);

      const addedNodes = 20 * step;
      const totalNodes = seed + addedNodes;
      const totalEdges = Math.round(seed * (seed - 1) / 2 + addedNodes * m);

      let maxDegree: number;
      let degreeGini: number;
      let networkRegime = '';

      if (alpha === 0) {
        // Erdős–Rényi Poisson random network
        maxDegree = Math.round(m * 2 + Math.sqrt(totalNodes));
        degreeGini = Math.round((0.15 + step * 0.02) * 100) / 100;
        networkRegime = 'RANDOM POISSON REGIME (α=0): No super-hubs. Node degrees follow a narrow bell-curve Gaussian distribution.';
      } else if (alpha <= 1.2) {
        // Scale-free Barabási-Albert power law
        maxDegree = Math.round(m * Math.pow(totalNodes / seed, 0.5) * 1.8);
        degreeGini = Math.min(0.75, Math.round((0.28 + step * 0.07 * alpha) * 100) / 100);
        networkRegime = 'SCALE-FREE POWER LAW (α=1.0): Hub dominance emerges! A few mega-nodes capture disproportionate traffic (P(k) ~ k⁻³).';
      } else {
        // Super-linear winner-takes-all monopoly
        maxDegree = Math.min(totalEdges, Math.round(m * Math.pow(totalNodes / seed, 0.85) * alpha * 1.5));
        degreeGini = Math.min(0.94, Math.round((0.35 + step * 0.11 * alpha) * 100) / 100);
        networkRegime = 'MONOPOLY STAR REGIME (α>1.5): Winner-Takes-All! One single colossal hub swallows virtually all incoming edges.';
      }

      return {
        totalNodes,
        totalEdges,
        maxDegree,
        degreeGini,
        networkRegime
      };
    },
    metrics: [
      { key: 'totalNodes', label: 'Network Nodes', color: 'text-indigo-500', formatter: (val) => `${val} nodes` },
      { key: 'maxDegree', label: 'Top Hub Degree', color: 'text-rose-500', formatter: (val) => `${val} links` },
      { key: 'degreeGini', label: 'Degree Gini Inequality', color: 'text-amber-500', formatter: (val) => `${val}` }
    ],
    analysis: (state, controls) => {
      const alpha = Number(controls.attachmentBias ?? 1.0);
      if (alpha > 1.2) {
        return {
          title: 'Monopolistic Hub Consolidation (Winner-Takes-All)',
          text: `With super-linear attachment (α=${alpha}), the rich-get-richer feedback escalates exponentially. The founding node became a monopoly hub with ${state.maxDegree} links (Degree Gini: ${state.degreeGini}), mirroring extreme market capture in tech platforms and social media monopolies.`,
          isCritical: true
        };
      } else if (alpha === 0) {
        return {
          title: 'Decentralized Poisson Network',
          text: `Without preferential attachment (α=0), new links connect purely at random. The network lacks vulnerable single-point-of-failure hubs, showing low inequality (${state.degreeGini} Gini) and high resilience against targeted attacks.`,
          isCritical: false
        };
      }
      return {
        title: 'Scale-Free Power Law Network (Barabási–Albert)',
        text: `Linear preferential attachment produced a scale-free topology with a top hub of ${state.maxDegree} links. The network exhibits high resistance against random failures, but extreme vulnerability to targeted attacks against the central hubs.`,
        isCritical: false
      };
    }
  },
  {
    id: 'spatial-prisoners-dilemma',
    domain: 'Social',
    name: 'Spatial Prisoner’s Dilemma & Trust',
    chaosConcept: 'Spatial Reciprocity & Evolutionary Game Fractality',
    learningObjective: 'Observe why spatial geometry allows cooperators to survive against selfish defectors (Nowak & May model): cooperators cluster in protective spatial colonies to out-earn predatory defectors at the boundaries.',
    timeLabel: 'Generation',
    maxSteps: 6,
    controls: [
      {
        id: 'temptationPayoff',
        label: 'Temptation Payoff (T)',
        type: 'slider',
        min: 1.1,
        max: 2.2,
        step: 0.1,
        defaultValue: 1.6,
        description: 'Payoff for defecting against a cooperator (T > R=1.0 > P=0.1 > S=0.0). Critical boundary occurs around T ≈ 1.8.'
      },
      {
        id: 'noiseRate',
        label: 'Noise / Miscommunication Rate',
        type: 'slider',
        min: 0,
        max: 15,
        step: 1,
        defaultValue: 2,
        unit: '%',
        description: 'Probability that an intended cooperation accidentally registers as a defection.'
      },
      {
        id: 'mutationRate',
        label: 'Strategy Mutation Rate',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        defaultValue: 1,
        unit: '%',
        description: 'Rate at which offspring spontaneously adopt a random strategy variant.'
      }
    ],
    initialState: {
      cooperationPercent: 55,
      defectionPercent: 45,
      clusterIndex: 0.35,
      averagePayoff: 5.8,
      statusComment: 'Diverse strategy population seeded on the 2D grid: Tit-for-Tat, Cooperators, Defectors, Pavlov, and Grudgers.'
    },
    calculateStep: (step, prev, controls) => {
      const T = Number(controls.temptationPayoff ?? 1.6);
      const noise = Number(controls.noiseRate ?? 2);
      const mutation = Number(controls.mutationRate ?? 1);

      let coop = prev.cooperationPercent;
      let cluster = prev.clusterIndex;
      let avgPayoff = prev.averagePayoff;
      let comment = '';

      if (T >= 1.85 || noise > 8) {
        // Defection wave dominates
        coop = Math.max(5, Math.round(prev.cooperationPercent - (T * 12 + noise * 1.5)));
        cluster = Math.max(0.1, Math.round((prev.clusterIndex - 0.06) * 100) / 100);
        avgPayoff = Math.max(0.8, Math.round((prev.averagePayoff * 0.7) * 10) / 10);
        comment = `TRAGEDY OF THE COMMONS: High temptation (T=${T}) breaks cooperation shields. Defectors invade clusters, collapsing total group wealth.`;
      } else {
        // Spatial reciprocity shields cooperators
        coop = Math.min(92, Math.round(prev.cooperationPercent + (1.8 - T) * 14 - (noise * 0.8)));
        cluster = Math.min(0.88, Math.round((prev.clusterIndex + 0.11) * 100) / 100);
        avgPayoff = Math.min(8.8, Math.round((prev.averagePayoff + 0.55 - (noise * 0.05)) * 10) / 10);
        comment = `SPATIAL RECIPROCITY THRIVES: Tit-for-Tat cooperators formed tightly packed shields. Mutual cooperation inside colonies rewards higher than border defection.`;
      }

      const def = 100 - coop;

      return {
        cooperationPercent: coop,
        defectionPercent: def,
        clusterIndex: cluster,
        averagePayoff: avgPayoff,
        statusComment: comment
      };
    },
    metrics: [
      { key: 'cooperationPercent', label: 'Cooperation Share', color: 'text-emerald-500', formatter: (val) => `${val}%` },
      { key: 'defectionPercent', label: 'Defection Share', color: 'text-rose-500', formatter: (val) => `${val}%` },
      { key: 'clusterIndex', label: 'Spatial Cluster Density', color: 'text-indigo-500', formatter: (val) => `${val}` }
    ],
    analysis: (state, controls) => {
      const T = Number(controls.temptationPayoff ?? 1.6);
      if (state.cooperationPercent < 25) {
        return {
          title: 'Cooperative Extinction (Threshold Crossed)',
          text: `At temptation T=${T}, the short-term advantage of predatory defection destroyed spatial clusters. Without geometric shields, unconditional defectors overran the population, dragging group average payoff down to ${state.averagePayoff}.`,
          isCritical: true
        };
      }
      return {
        title: 'Spatial Reciprocity Clustered Equilibrium',
        text: `In a well-mixed well-stirred soup, defectors always win. But in a 2D spatial lattice, cooperators help each other and insulate their colony interior, sustaining ${state.cooperationPercent}% cooperation and a strong cluster index of ${state.clusterIndex}.`,
        isCritical: false
      };
    }
  },
  {
    id: 'schelling-segregation',
    domain: 'Urban',
    name: 'Schelling’s Neighborhood Segregation',
    chaosConcept: 'Micro-Motives & Macro-Behavior (Threshold Cascades)',
    learningObjective: 'Observe the counter-intuitive Schelling paradox: even when individual agents are completely tolerant and only require 30% similar neighbors, individual relocation cascades inexorably into extreme systemic segregation (>75%).',
    timeLabel: 'Moving Round',
    maxSteps: 6,
    controls: [
      {
        id: 'similarityPreference',
        label: 'Similarity Preference (Tolerance Threshold)',
        type: 'slider',
        min: 15,
        max: 75,
        step: 5,
        defaultValue: 35,
        unit: '%',
        description: 'Minimum % of same-color neighbors an agent requires to feel happy and stay put.'
      },
      {
        id: 'vacancyRate',
        label: 'Neighborhood Vacancy Rate',
        type: 'slider',
        min: 5,
        max: 35,
        step: 5,
        defaultValue: 15,
        unit: '%',
        description: 'Percentage of open homes available for unhappy agents to relocate to.'
      },
      {
        id: 'demographicSplit',
        label: 'Group A (Red) Population Share',
        type: 'slider',
        min: 40,
        max: 60,
        step: 5,
        defaultValue: 50,
        unit: '%',
        description: 'Demographic balance between Red and Blue resident populations.'
      }
    ],
    initialState: {
      segregationIndex: 48,
      happyPercent: 62,
      unhappyCount: 380,
      relocations: 0,
      cascadeStatus: 'Uniformly integrated initial distribution. High mixing of Red and Blue residents.'
    },
    calculateStep: (step, prev, controls) => {
      const pref = Number(controls.similarityPreference ?? 35);
      const vacancy = Number(controls.vacancyRate ?? 15);

      let segregation = prev.segregationIndex;
      let happy = prev.happyPercent;
      let unhappy = prev.unhappyCount;
      let relocations = prev.relocations + Math.round(unhappy * 0.7);
      let cascadeStatus = '';

      if (step === 1) {
        unhappy = Math.round(1000 * (1 - vacancy / 100) * (pref / 100) * 0.9);
        happy = Math.round(100 - (unhappy / 10));
        segregation = Math.min(85, Math.round(48 + (pref - 25) * 0.6));
        cascadeStatus = `${unhappy} residents feel uncomfortable below their ${pref}% preference threshold and begin searching for vacant houses.`;
      } else {
        const moves = Math.round(unhappy * 0.65);
        unhappy = Math.max(12, Math.round(unhappy * 0.45));
        happy = Math.min(99, 100 - Math.round(unhappy / 10));
        // Supports both single-step and direct jump
        const stepMultiplier = prev.segregationIndex <= 48 ? step : 1;
        segregation = Math.min(96, Math.round(prev.segregationIndex + (pref / 30) * 8 * stepMultiplier));
        
        if (segregation > 80) {
          cascadeStatus = `TOTAL SEGREGATION: Neighborhoods have fractured into distinct Red and Blue enclaves. Segregation reached ${segregation}%.`;
        } else {
          cascadeStatus = `Sorting round ${step}: Relocations trigger ripple effects, causing previously happy neighbors to dip below their threshold.`;
        }
      }

      return {
        segregationIndex: segregation,
        happyPercent: happy,
        unhappyCount: unhappy,
        relocations,
        cascadeStatus
      };
    },
    metrics: [
      { key: 'segregationIndex', label: 'Segregation Index', color: 'text-rose-500', formatter: (val) => `${val}% segregated` },
      { key: 'happyPercent', label: 'Satisfied Residents', color: 'text-emerald-500', formatter: (val) => `${val}%` },
      { key: 'unhappyCount', label: 'Displaced Seekers', color: 'text-amber-500', formatter: (val) => `${val} people` }
    ],
    analysis: (state, controls) => {
      const pref = Number(controls.similarityPreference ?? 35);
      return {
        title: `The Schelling Tipping Paradox (${pref}% Individual Preference → ${state.segregationIndex}% Macro Segregation)`,
        text: `Thomas Schelling proved that severe macro-segregation does NOT require racist or xenophobic micro-motives. Even when residents are happy being in the minority (only requiring ${pref}% similar neighbors), the iterative relocation feedback drives macro segregation to ${state.segregationIndex}%.`,
        isCritical: state.segregationIndex >= 75
      };
    }
  },
  {
    id: 'boids-flocking',
    domain: 'Emergence & Complexity',
    name: 'Boids Flocking (Swarm Intelligence)',
    chaosConcept: 'Decentralized Coordination & Murmuration',
    learningObjective: 'Explore how 3 simple local steering rules (Separation, Alignment, Cohesion) generate macroscopic bird flocking, fish schooling, and murmuration without central leadership or global communication.',
    timeLabel: 'Flight Frame',
    maxSteps: 6,
    controls: [
      {
        id: 'cohesionWeight',
        label: 'Cohesion Weight (Attraction to Center)',
        type: 'slider',
        min: 0.2,
        max: 2.5,
        step: 0.1,
        defaultValue: 1.0,
        description: 'Steer toward the average position of local flockmates.'
      },
      {
        id: 'alignmentWeight',
        label: 'Alignment Weight (Match Heading)',
        type: 'slider',
        min: 0.2,
        max: 2.5,
        step: 0.1,
        defaultValue: 1.2,
        description: 'Steer toward the average heading direction of local flockmates.'
      },
      {
        id: 'separationWeight',
        label: 'Separation Weight (Collision Avoidance)',
        type: 'slider',
        min: 0.5,
        max: 3.0,
        step: 0.2,
        defaultValue: 1.5,
        description: 'Steer to avoid crowding or crashing into local flockmates.'
      },
      {
        id: 'predatorPresent',
        label: 'Introduce Apex Predator (Hawk)',
        type: 'toggle',
        defaultValue: false,
        description: 'Spawns a hunting predator that exerts a strong repulsive scatter force on nearby boids.'
      }
    ],
    initialState: {
      polarizationIndex: 35,
      flockCohesion: 42,
      clusterCount: 4,
      meanSeparation: 38,
      flightBehavior: 'Initial disordered flight vectors. Boids begin sensing nearest neighbors.'
    },
    calculateStep: (step, prev, controls) => {
      const coh = Number(controls.cohesionWeight ?? 1.0);
      const ali = Number(controls.alignmentWeight ?? 1.2);
      const sep = Number(controls.separationWeight ?? 1.5);
      const predator = !!controls.predatorPresent;

      let pol = prev.polarizationIndex;
      let cohIdx = prev.flockCohesion;
      let clusters = prev.clusterCount;
      let sepDist = prev.meanSeparation;
      let flight = '';

      if (predator) {
        pol = Math.max(18, Math.round(prev.polarizationIndex * 0.65));
        cohIdx = Math.max(20, Math.round(prev.flockCohesion * 0.7));
        clusters = Math.min(8, prev.clusterCount + 2);
        sepDist = Math.round(sep * 28);
        flight = 'PREDATOR ATTACK: Flash expansion! Swarm fragments into evasion pockets to confuse the predator’s targeting.';
      } else {
        const stepMultiplier = prev.polarizationIndex <= 35 ? step : 1;
        pol = Math.min(98, Math.round(prev.polarizationIndex + ali * 16 * stepMultiplier));
        cohIdx = Math.min(95, Math.round(prev.flockCohesion + coh * 14 * stepMultiplier));
        clusters = Math.max(1, Math.round(prev.clusterCount - 0.7 * stepMultiplier));
        sepDist = Math.round(20 + sep * 8);
        
        if (pol > 85) {
          flight = 'ORGANIZED MURMURATION: Unified coherent swarm cruising as a single organic super-organism.';
        } else {
          flight = `Swarm coalescing: Alignment forces (${ali}x) syncing heading vectors into streaming sub-flocks.`;
        }
      }

      return {
        polarizationIndex: pol,
        flockCohesion: cohIdx,
        clusterCount: clusters,
        meanSeparation: sepDist,
        flightBehavior: flight
      };
    },
    metrics: [
      { key: 'polarizationIndex', label: 'Flock Alignment (Polarization)', color: 'text-indigo-500', formatter: (val) => `${val}% aligned` },
      { key: 'flockCohesion', label: 'Cohesion Index', color: 'text-emerald-500', formatter: (val) => `${val}%` },
      { key: 'clusterCount', label: 'Sub-Flock Groups', color: 'text-amber-500', formatter: (val) => `${val} clusters` }
    ],
    analysis: (state, controls) => {
      const predator = !!controls.predatorPresent;
      if (predator) {
        return {
          title: 'Predator Evasion & Collective Flash Expansion',
          text: `When a predator penetrates the flock, local collision avoidance overrides global alignment. The swarm undergoes a "flash expansion" bifurcation, splitting into ${state.clusterCount} sub-groups before reconverging behind the predator.`,
          isCritical: true
        };
      }
      return {
        title: 'Emergent Reynolds Flocking (Murmuration)',
        text: `With Alignment (${controls.alignmentWeight}) and Cohesion (${controls.cohesionWeight}) in balance with Separation (${controls.separationWeight}), the flock achieved ${state.polarizationIndex}% polarization. No central controller is needed—global order is purely emergent.`,
        isCritical: false
      };
    }
  },
  {
    id: 'forest-fire-percolation',
    domain: 'Environment',
    name: 'Forest Fire & Percolation Threshold',
    chaosConcept: 'Critical Phenomena & Phase Transitions (pc ≈ 59.3%)',
    learningObjective: 'Investigate statistical physics percolation: at 55% tree density, fires burn out locally; at 62%, a single spark percolates through the entire lattice, revealing the universal mathematical phase transition boundary.',
    timeLabel: 'Fire Wave',
    maxSteps: 6,
    controls: [
      {
        id: 'treeDensity',
        label: 'Forest Canopy Density (p)',
        type: 'slider',
        min: 35,
        max: 85,
        step: 2,
        defaultValue: 59,
        unit: '%',
        description: 'Square lattice occupancy probability p. The exact theoretical percolation threshold is pc = 59.27%.'
      },
      {
        id: 'windIntensity',
        label: 'Wind Velocity Multiplier',
        type: 'slider',
        min: 0.0,
        max: 2.0,
        step: 0.5,
        defaultValue: 0.5,
        unit: 'x',
        description: 'Increases forward leap distance of burning embers across barren gaps.'
      },
      {
        id: 'lightningSpark',
        label: 'Inject Lightning Ignition Spark',
        type: 'toggle',
        defaultValue: true,
        description: 'Ignites trees along the western forest boundary.'
      }
    ],
    initialState: {
      burnedPercent: 0,
      activeFires: 12,
      percolated: false,
      forestStatus: 'Forest seeded at specified tree density. Waiting for ignition event.'
    },
    calculateStep: (step, prev, controls) => {
      const density = Number(controls.treeDensity ?? 59);
      const wind = Number(controls.windIntensity ?? 0.5);
      const ignited = !!controls.lightningSpark;

      // Effective percolation threshold adjusted slightly for wind
      const criticalThreshold = Math.max(45, Math.round(59.3 - wind * 6));
      const isPercolating = density >= criticalThreshold && ignited;

      let burned = prev.burnedPercent;
      let active = prev.activeFires;
      let percolated = isPercolating;
      let status = '';

      if (!ignited) {
        burned = 0;
        active = 0;
        status = 'No ignition source active. Forest canopy remains untouched.';
      } else if (step === 1) {
        burned = Math.round(density * 0.08);
        active = Math.round(density * 0.4);
        status = `Lightning strikes western border. Fire catches in initial trees (${burned}% consumed).`;
      } else {
        if (isPercolating) {
          // Exponential fire spread across spanning cluster
          const stepMultiplier = prev.burnedPercent === 0 ? step : 1;
          burned = Math.min(99.4, Math.round(prev.burnedPercent + (density * 0.28 * (1 + wind * 0.3) * stepMultiplier)));
          active = burned > 90 ? Math.max(0, Math.round(prev.activeFires * 0.4)) : Math.round(prev.activeFires * 1.6);
          status = burned > 90 
            ? 'TOTAL CONFLAGRATION: Spanning cluster burned through the entire eastern boundary!'
            : `EXPONENTIAL PERCOLATION: Density (${density}%) exceeds critical threshold (${criticalThreshold}%). Continuous tree chain detected.`;
        } else {
          // Fire dies out in finite subcritical cluster
          active = Math.max(0, Math.round(prev.activeFires * 0.35));
          burned = Math.min(Math.round(density * 0.35), Math.round(prev.burnedPercent + active * 0.2));
          status = `EXTINGUISHED: Density (${density}%) is subcritical (<${criticalThreshold}%). Fire halted at natural tree gaps.`;
        }
      }

      return {
        burnedPercent: burned,
        activeFires: active,
        percolated,
        forestStatus: status
      };
    },
    metrics: [
      { key: 'burnedPercent', label: 'Forest Consumed', color: 'text-rose-500', formatter: (val) => `${val}% burned` },
      { key: 'activeFires', label: 'Active Burning Fronts', color: 'text-amber-500', formatter: (val) => `${val} fronts` },
      { key: 'percolated', label: 'Spanning Cluster Spanned', color: 'text-indigo-500', formatter: (val) => val ? 'YES (Critical)' : 'NO (Contained)' }
    ],
    analysis: (state, controls) => {
      const density = Number(controls.treeDensity ?? 59);
      const wind = Number(controls.windIntensity ?? 0.5);
      const criticalThreshold = Math.max(45, Math.round(59.3 - wind * 6));

      if (density >= criticalThreshold) {
        return {
          title: `Percolation Phase Transition Triggered (${density}% >= ${criticalThreshold}% pc)`,
          text: `Above the 2D square lattice percolation threshold (pc ≈ 59.3%), a connected path of adjacent trees spans from one end of the forest to the other. The fire percolated infinitely, consuming ${state.burnedPercent}% of the biome.`,
          isCritical: true
        };
      }
      return {
        title: `Subcritical Forest Self-Containment (${density}% < ${criticalThreshold}% pc)`,
        text: `Below pc, tree clusters are geometrically disconnected. Even with blazing flames, the fire extinguished itself after burning only ${state.burnedPercent}%, demonstrating the non-linear "all-or-nothing" nature of percolation boundaries.`,
        isCritical: false
      };
    }
  },
  {
    id: 'sugarscape',
    domain: 'Economics',
    name: 'Sugarscape & Wealth Distribution',
    chaosConcept: 'Emergent Wealth Inequality & Pareto Power Laws',
    learningObjective: 'Explore the Epstein & Axtell artificial society: observe how even with equal opportunities and uniform initial conditions, random differences in vision and metabolism inevitably produce an extreme Pareto wealth inequality distribution (Gini > 0.65).',
    timeLabel: 'Harvest Cycle',
    maxSteps: 6,
    controls: [
      {
        id: 'sugarRegrowth',
        label: 'Sugar Terrain Regrowth Rate',
        type: 'slider',
        min: 1,
        max: 4,
        step: 1,
        defaultValue: 1,
        unit: 'units/tick',
        description: 'Speed at which sugar piles replenish after agent harvest.'
      },
      {
        id: 'visionRange',
        label: 'Agent Vision Range',
        type: 'slider',
        min: 2,
        max: 6,
        step: 1,
        defaultValue: 4,
        unit: 'cells',
        description: 'Maximum distance agents can scan in 4 cardinal directions to locate sugar.'
      },
      {
        id: 'metabolicPressure',
        label: 'Metabolic Consumption Cost',
        type: 'slider',
        min: 1,
        max: 3,
        step: 1,
        defaultValue: 2,
        unit: 'sugar/tick',
        description: 'Energy burned by agents each cycle. High metabolism causes starvation if not foraging rich cells.'
      }
    ],
    initialState: {
      giniCoefficient: 0.28,
      topTenPercentWealth: 26,
      totalPopulation: 250,
      starvationRate: 2,
      economicStatus: 'Agents spawn uniformly across Sugarscape with random vision and metabolism.'
    },
    calculateStep: (step, prev, controls) => {
      const regrowth = Number(controls.sugarRegrowth ?? 1);
      const vision = Number(controls.visionRange ?? 4);
      const metabolism = Number(controls.metabolicPressure ?? 2);

      let gini = prev.giniCoefficient;
      let top10 = prev.topTenPercentWealth;
      let pop = prev.totalPopulation;
      let starvation = prev.starvationRate;
      let status = '';

      if (step === 1) {
        gini = 0.38;
        top10 = 35;
        starvation = Math.round(metabolism * 3);
        status = 'Initial harvest begins. Agents near sugar mountain peaks start accumulating massive surpluses.';
      } else {
        // Inequality escalates over time (Pareto distribution emergence)
        const inequalityBoost = (vision / 4) * (metabolism / 2);
        const stepMultiplier = prev.giniCoefficient <= 0.28 ? step : 1;
        gini = Math.min(0.85, Math.round((prev.giniCoefficient + 0.08 * inequalityBoost * stepMultiplier) * 100) / 100);
        top10 = Math.min(88, Math.round(prev.topTenPercentWealth + 9 * inequalityBoost * stepMultiplier));
        starvation = Math.round((metabolism / regrowth) * 4);
        pop = Math.max(120, Math.round(prev.totalPopulation - starvation + regrowth * 3));
        
        if (gini >= 0.65) {
          status = `PARETO LAW LOCKED: Gini hit ${gini}! Top 10% own ${top10}% of all sugar assets. Wealth distribution matches Pareto 80/20 power law.`;
        } else {
          status = `Inequality widening: Low-metabolism high-vision agents monopolize the two sugar peaks.`;
        }
      }

      return {
        giniCoefficient: gini,
        topTenPercentWealth: top10,
        totalPopulation: pop,
        starvationRate: starvation,
        economicStatus: status
      };
    },
    metrics: [
      { key: 'giniCoefficient', label: 'Gini Inequality Index', color: 'text-amber-500', formatter: (val) => `${val}` },
      { key: 'topTenPercentWealth', label: 'Top 10% Wealth Share', color: 'text-rose-500', formatter: (val) => `${val}%` },
      { key: 'totalPopulation', label: 'Active Population', color: 'text-emerald-500', formatter: (val) => `${val} agents` }
    ],
    analysis: (state, controls) => {
      return {
        title: `Spontaneous Wealth Inequality (Epstein & Axtell Sugarscape)`,
        text: `Despite a decentralized environment with equal initial endowments, simple biological variance (vision and metabolism) compounded over generations into an extreme Gini coefficient of ${state.giniCoefficient}, with the top 10% holding ${state.topTenPercentWealth}% of all capital.`,
        isCritical: state.giniCoefficient >= 0.60
      };
    }
  },
  {
    id: 'gray-scott',
    domain: 'Emergence & Complexity',
    name: 'Gray-Scott Reaction-Diffusion',
    chaosConcept: 'Morphogenesis & Turing Pattern Bifurcations',
    learningObjective: 'Explore Alan Turing’s reaction-diffusion equations: discover how two diffusing chemicals (U and V) generate biological leopard spots, coral mazes, and cell-division mitosis through non-linear feed and kill dynamics.',
    timeLabel: 'Reaction Epoch',
    maxSteps: 6,
    controls: [
      {
        id: 'feedRate',
        label: 'Chemical U Feed Rate (F)',
        type: 'slider',
        min: 0.010,
        max: 0.090,
        step: 0.002,
        defaultValue: 0.037,
        unit: 'F',
        description: 'Rate at which fresh substance U is fed into the system.'
      },
      {
        id: 'killRate',
        label: 'Chemical V Kill Rate (K)',
        type: 'slider',
        min: 0.045,
        max: 0.070,
        step: 0.001,
        defaultValue: 0.060,
        unit: 'K',
        description: 'Rate at which reactant V decays or is removed from the system.'
      },
      {
        id: 'diffusionRatio',
        label: 'Diffusion Coefficient Ratio (Du/Dv)',
        type: 'slider',
        min: 1.5,
        max: 3.0,
        step: 0.1,
        defaultValue: 2.0,
        unit: 'ratio',
        description: 'Ratio of diffusion rates between substance U and substance V.'
      }
    ],
    initialState: {
      morphogenBalance: 78,
      patternEntropy: 0.35,
      activeSpots: 24,
      patternType: 'Mitosis Solitons (Self-Replicating Cells)',
      phaseNarrative: 'Chemical U fully saturates the dish. Seed spots of catalyst V begin consuming U.'
    },
    calculateStep: (step, prev, controls) => {
      const F = Number(controls.feedRate ?? 0.037);
      const K = Number(controls.killRate ?? 0.060);

      let pattern = 'Mitosis Solitons';
      let balance = prev.morphogenBalance;
      let entropy = prev.patternEntropy;
      let spots = prev.activeSpots;
      let narrative = '';

      if (F <= 0.032 && K >= 0.060) {
        pattern = 'Stable Leopard Spots';
        spots = Math.min(180, Math.round(24 + 28 * step));
        balance = Math.max(30, Math.round(78 - 6 * step));
        entropy = Math.round((0.35 + step * 0.08) * 100) / 100;
        narrative = `Spots equilibrium reached: ${spots} isolated circular morphogen islands stabilized across the lattice.`;
      } else if (F >= 0.055 && K >= 0.058) {
        pattern = 'Coral Reef / Labyrinthine Stripes';
        spots = Math.round(12 + step * 4);
        balance = Math.max(45, Math.round(78 - 5 * step));
        entropy = Math.min(0.88, Math.round((0.40 + step * 0.10) * 100) / 100);
        narrative = `Labyrinthine coral lines branching: Continuous connected stripe network forms fingerprint patterns.`;
      } else if (F <= 0.038 && K <= 0.062) {
        pattern = 'Mitosis / Soliton Cell Division';
        spots = Math.min(320, Math.round(24 * Math.pow(1.65, step)));
        balance = Math.max(25, Math.round(78 - 9 * step));
        entropy = Math.min(0.92, Math.round((0.35 + step * 0.11) * 100) / 100);
        narrative = `Cell division cascade: Growing circular spots deform into peanut shapes and divide into twin daughter cells (${spots} cells).`;
      } else {
        pattern = 'Turbulent Chemical Waves';
        spots = Math.round(50 + step * 15);
        balance = 55;
        entropy = 0.85;
        narrative = `Chaotic rotating spiral wave fronts undulating through the reaction medium.`;
      }

      return {
        morphogenBalance: balance,
        patternEntropy: entropy,
        activeSpots: spots,
        patternType: pattern,
        phaseNarrative: narrative
      };
    },
    metrics: [
      { key: 'activeSpots', label: 'Active Morphogen Spots', color: 'text-emerald-500', formatter: (val) => `${val} spots` },
      { key: 'morphogenBalance', label: 'Chemical U Concentration', color: 'text-indigo-500', formatter: (val) => `${val}%` },
      { key: 'patternEntropy', label: 'Spatial Order Entropy', color: 'text-amber-500', formatter: (val) => `${val} bits` }
    ],
    analysis: (state, controls) => {
      const F = Number(controls.feedRate ?? 0.037);
      const K = Number(controls.killRate ?? 0.060);
      return {
        title: `Turing Morphogenesis Regime: ${state.patternType}`,
        text: `At F=${F} and K=${K}, the balance of local activation (autocatalysis UV²) and lateral inhibition (diffusion Du/Dv) triggers Turing bifurcation, generating ${state.activeSpots} self-organizing structures with ${state.patternEntropy} entropy.`,
        isCritical: false
      };
    }
  },
  {
    id: 'slime-mold',
    domain: 'Emergence & Complexity',
    name: 'Slime Mold Network Optimization',
    chaosConcept: 'Bio-Computing & Shortest-Path Steiner Trees',
    learningObjective: 'Witness decentralized bio-intelligence in Physarum Polycephalum: autonomous amoeboid particles deposit pheromones and follow sensory gradients to build resilient shortest-path transportation webs between nutrient sources.',
    timeLabel: 'Foraging Wave',
    maxSteps: 6,
    controls: [
      {
        id: 'decayRate',
        label: 'Pheromone Evaporation / Decay Rate',
        type: 'slider',
        min: 1,
        max: 15,
        step: 1,
        defaultValue: 5,
        unit: '%',
        description: 'Rate at which unreinforced chemical trails evaporate from the environment.'
      },
      {
        id: 'sensorAngle',
        label: 'Sensory Aperture Angle',
        type: 'slider',
        min: 15,
        max: 60,
        step: 5,
        defaultValue: 35,
        unit: '°',
        description: 'Angular offset of front-left and front-right chemoattractant sensors.'
      },
      {
        id: 'particleDensity',
        label: 'Amoeboid Particle Count',
        type: 'slider',
        min: 500,
        max: 2000,
        step: 100,
        defaultValue: 1000,
        unit: 'particles',
        description: 'Number of active foraging agents on the sensory map.'
      }
    ],
    initialState: {
      transportEfficiency: 42,
      networkRedundancy: 28,
      veinDensity: 35,
      foragingStatus: 'Particles deployed around nutrient nodes. Early exploratory foraging filaments radiating outwards.'
    },
    calculateStep: (step, prev, controls) => {
      const decay = Number(controls.decayRate ?? 5);
      const angle = Number(controls.sensorAngle ?? 35);
      const count = Number(controls.particleDensity ?? 1000);

      const stepMultiplier = prev.transportEfficiency <= 42 ? step : 1;
      const efficiencyBoost = (decay / 5) * (count / 1000);
      const efficiency = Math.min(98, Math.round(prev.transportEfficiency + 9.5 * efficiencyBoost * stepMultiplier));
      const redundancy = Math.min(85, Math.round(28 + (60 - angle) * 0.8 * (step / 2)));
      const vein = Math.min(92, Math.round(35 + (count / 50) * (step / 3)));

      let status = '';
      if (efficiency > 85) {
        status = 'OPTIMAL STEINER SPAN: Disconnected veins pruned by evaporation. Slime mold established minimal-length transport network matching human engineered rail systems!';
      } else {
        status = `Wave ${step}: Pheromone reinforcement strengthens high-traffic trunk lines while low-flow exploratory trails decay.`;
      }

      return {
        transportEfficiency: efficiency,
        networkRedundancy: redundancy,
        veinDensity: vein,
        foragingStatus: status
      };
    },
    metrics: [
      { key: 'transportEfficiency', label: 'Transport Routing Efficiency', color: 'text-emerald-500', formatter: (val) => `${val}% optimal` },
      { key: 'networkRedundancy', label: 'Fault-Tolerant Loops', color: 'text-indigo-500', formatter: (val) => `${val}% redundancy` },
      { key: 'veinDensity', label: 'Active Biomass Veins', color: 'text-amber-500', formatter: (val) => `${val}% coverage` }
    ],
    analysis: (state, controls) => {
      return {
        title: 'Physarum Polycephalum Decentralized Bio-Computing',
        text: `Without a central brain or nervous system, Physarum solves NP-hard geometric Steiner network problems. Feedback between flux and tube diameter naturally prunes redundant loops to achieve ${state.transportEfficiency}% optimal transport efficiency.`,
        isCritical: false
      };
    }
  },
  {
    id: 'ant-colony',
    domain: 'Emergence & Complexity',
    name: 'Ant Colony Optimization (ACO)',
    chaosConcept: 'Stigmergy & Positive Feedback Route Discovery',
    learningObjective: 'Discover Marco Dorigo’s ACO algorithm: individual ants leave nests searching for food, depositing evaporation-prone pheromones on return. Shorter paths complete round trips faster, refreshing pheromones before evaporation to discover optimal paths around complex obstacles.',
    timeLabel: 'Foraging Round',
    maxSteps: 6,
    controls: [
      {
        id: 'evaporationRate',
        label: 'Pheromone Evaporation Rate (ρ)',
        type: 'slider',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 3,
        unit: '%',
        description: 'Rate of trail evaporation per tick. Higher evaporation eliminates sub-optimal detours faster.'
      },
      {
        id: 'pheromoneSensitivity',
        label: 'Pheromone Sensitivity (α)',
        type: 'slider',
        min: 1.0,
        max: 3.0,
        step: 0.2,
        defaultValue: 2.0,
        unit: 'α',
        description: 'Exploitation vs exploration balance. High α forces ants onto the strongest existing highway.'
      },
      {
        id: 'antPopulation',
        label: 'Foraging Ant Population',
        type: 'slider',
        min: 80,
        max: 250,
        step: 10,
        defaultValue: 120,
        unit: 'ants',
        description: 'Number of active foragers traversing between nest and food nodes.'
      }
    ],
    initialState: {
      routeOptimality: 38,
      foodHarvested: 0,
      activePheromoneStrength: 25,
      colonyStatus: 'Ants deploy from nest in random Brownian walk searching for food sources.'
    },
    calculateStep: (step, prev, controls) => {
      const rho = Number(controls.evaporationRate ?? 3);
      const alpha = Number(controls.pheromoneSensitivity ?? 2.0);
      const pop = Number(controls.antPopulation ?? 120);

      const stepMultiplier = prev.routeOptimality <= 38 ? step : 1;
      const optimality = Math.min(99, Math.round(prev.routeOptimality + (10 * alpha * (1 + rho * 0.1)) * stepMultiplier));
      const food = prev.foodHarvested + Math.round((pop * 0.45) * (optimality / 100) * step);
      const phero = Math.min(100, Math.round(25 + 12 * alpha * (pop / 120) * step));

      let status = '';
      if (optimality > 85) {
        status = 'CONVERGENCE: Colony converged on global shortest path around the obstacles. Round-trip speed locked in exponential pheromone reinforcement.';
      } else {
        status = `Round ${step}: Shorter path ants return to nest faster, refreshing the shorter route before evaporation degrades the trail.`;
      }

      return {
        routeOptimality: optimality,
        foodHarvested: food,
        activePheromoneStrength: phero,
        colonyStatus: status
      };
    },
    metrics: [
      { key: 'routeOptimality', label: 'Route Optimality Index', color: 'text-emerald-500', formatter: (val) => `${val}% optimal` },
      { key: 'foodHarvested', label: 'Total Food Retrieved', color: 'text-amber-500', formatter: (val) => `${val} units` },
      { key: 'activePheromoneStrength', label: 'Pheromone Trail Intensity', color: 'text-indigo-500', formatter: (val) => `${val}%` }
    ],
    analysis: (state, controls) => {
      return {
        title: 'Stigmergic Swarm Intelligence (ACO)',
        text: `Ant Colony Optimization uses indirect communication (stigmergy). Because the shorter route takes less transit time, ants traverse it more frequently per unit time. Pheromones accumulate faster on the short branch, creating positive feedback that drives route optimality to ${state.routeOptimality}%.`,
        isCritical: false
      };
    }
  },
  {
    id: 'watts-strogatz',
    domain: 'Social',
    name: 'Watts–Strogatz Small-World Network',
    chaosConcept: 'Phase Transition to "Six Degrees of Separation"',
    learningObjective: 'Discover Duncan Watts & Steven Strogatz’s small-world phenomenon: observe how rewiring just 1-5% of regular lattice edges collapses average path length exponentially while preserving high local clustering.',
    timeLabel: 'Rewiring Phase',
    maxSteps: 6,
    controls: [
      {
        id: 'rewiringProb',
        label: 'Rewiring Probability (p)',
        type: 'slider',
        min: 0.00,
        max: 1.00,
        step: 0.05,
        defaultValue: 0.05,
        unit: 'p',
        description: 'Probability that each edge in the regular ring lattice is rewired to a uniformly random node.'
      },
      {
        id: 'networkNodes',
        label: 'Network Node Count (N)',
        type: 'slider',
        min: 20,
        max: 60,
        step: 4,
        defaultValue: 36,
        unit: 'nodes',
        description: 'Total number of nodes arranged in the circular ring lattice.'
      },
      {
        id: 'initialNeighbors',
        label: 'Nearest Neighbors per Node (k)',
        type: 'slider',
        min: 2,
        max: 6,
        step: 2,
        defaultValue: 4,
        unit: 'k',
        description: 'Initial regular ring connections to adjacent k nearest neighbors.'
      }
    ],
    initialState: {
      averagePathLength: 4.8,
      clusteringCoefficient: 0.67,
      smallWorldRatio: 1.0,
      rewiredShortcuts: 0,
      networkPhase: 'Regular Ring Lattice (p=0): High clustering (C=0.67), but long geodesic path distances (L=4.8).'
    },
    calculateStep: (step, prev, controls) => {
      const p = Number(controls.rewiringProb ?? 0.05);
      const N = Number(controls.networkNodes ?? 36);
      const k = Number(controls.initialNeighbors ?? 4);

      const totalEdges = Math.round((N * k) / 2);
      const shortcuts = Math.round(totalEdges * p);

      // Theoretical scaling:
      // L(0) ~ N / (2k), L(1) ~ ln(N) / ln(k)
      // C(0) = 3(k-2)/(4(k-1)), C(1) ~ k / N
      const L0 = N / (2 * k);
      const L_random = Math.log(N) / Math.log(k);
      const C0 = (3 * (k - 2)) / (4 * (k - 1));
      const C_random = k / N;

      // Small-world effect: L drops exponentially with p, but C stays high until p > 0.3
      const effectiveP = Math.min(1.0, p * (step > 1 && prev.rewiredShortcuts === 0 ? 1 : 1));
      const L = Math.max(L_random, Math.round((L_random + (L0 - L_random) / (1 + 15 * effectiveP)) * 10) / 10);
      const C = Math.max(C_random, Math.round((C0 * Math.pow(1 - effectiveP, 3) + C_random * effectiveP) * 100) / 100);

      // Small world coefficient: (C/C_rand) / (L/L_rand)
      const sigma = Math.round(((C / C_random) / Math.max(0.1, (L / L_random))) * 10) / 10;

      let phase = '';
      if (effectiveP === 0) {
        phase = 'REGULAR LATTICE (p=0): High clustering but long separation. Information travels slowly.';
      } else if (effectiveP <= 0.15) {
        phase = `SMALL-WORLD EMERGENCE (${shortcuts} shortcuts): "Six Degrees of Separation"! Path length plummeted from ${L0.toFixed(1)} to ${L}, while high clustering (${C}) remains intact!`;
      } else {
        phase = `RANDOM GRAPH (p=${effectiveP}): Disordered random network. Low path length, but local community clustering has disintegrated.`;
      }

      return {
        averagePathLength: L,
        clusteringCoefficient: C,
        smallWorldRatio: sigma,
        rewiredShortcuts: shortcuts,
        networkPhase: phase
      };
    },
    metrics: [
      { key: 'averagePathLength', label: 'Average Degrees of Separation (L)', color: 'text-indigo-500', formatter: (val) => `${val} hops` },
      { key: 'clusteringCoefficient', label: 'Local Clustering Index (C)', color: 'text-emerald-500', formatter: (val) => `${val}` },
      { key: 'smallWorldRatio', label: 'Small-World Index (σ)', color: 'text-amber-500', formatter: (val) => `σ = ${val}` }
    ],
    analysis: (state, controls) => {
      const p = Number(controls.rewiringProb ?? 0.05);
      if (p > 0.01 && p <= 0.2) {
        return {
          title: 'Small-World Phase Transition (Watts & Strogatz 1998)',
          text: `With just ${Math.round(p * 100)}% random rewiring, the network entered the small-world regime (σ = ${state.smallWorldRatio}). Long-range shortcuts connect distant clusters without breaking local neighborhoods, explaining viral contagions and the human social "six degrees of separation".`,
          isCritical: false
        };
      }
      return {
        title: p === 0 ? 'Regular Ordered Ring Lattice' : 'Erdős–Rényi Random Graph',
        text: p === 0
          ? `At p=0, each node connects strictly to neighbors. Local clustering is high (${state.clusteringCoefficient}), but average path length is long (${state.averagePathLength} hops).`
          : `At p=${p}, extensive rewiring turned the topology into a random graph, destroying clustering while maintaining low path length (${state.averagePathLength} hops).`,
        isCritical: false
      };
    }
  },
  {
    id: 'kuramoto-oscillators',
    domain: 'Emergence & Complexity',
    name: 'Kuramoto Synchronized Oscillators',
    chaosConcept: 'Spontaneous Order & Phase Transition to Coherence',
    learningObjective: 'Explore Yoshiki Kuramoto’s coupled non-linear differential equations: discover how independent oscillators with diverse natural frequencies spontaneously lock into unified collective synchronization once coupling strength K crosses the critical threshold Kc.',
    timeLabel: 'Coupling Cycle',
    maxSteps: 6,
    controls: [
      {
        id: 'couplingStrength',
        label: 'Coupling Strength (K)',
        type: 'slider',
        min: 0.0,
        max: 5.0,
        step: 0.2,
        defaultValue: 1.8,
        unit: 'K',
        description: 'Interaction attraction between oscillators. Critical sync threshold Kc ≈ 1.5.'
      },
      {
        id: 'frequencyVariance',
        label: 'Natural Frequency Dispersion (σ)',
        type: 'slider',
        min: 0.2,
        max: 2.0,
        step: 0.2,
        defaultValue: 0.8,
        unit: 'σ',
        description: 'Standard deviation of individual oscillator natural frequencies.'
      },
      {
        id: 'oscillatorCount',
        label: 'Oscillator Population (N)',
        type: 'slider',
        min: 40,
        max: 200,
        step: 20,
        defaultValue: 100,
        unit: 'units',
        description: 'Number of coupled phase oscillators in the system.'
      }
    ],
    initialState: {
      orderParameter: 0.12,
      phaseCoherence: 12,
      synchronizedFraction: 15,
      syncRegime: 'Incoherent State: Oscillators drifting at random natural frequencies. Center order parameter r ≈ 0.'
    },
    calculateStep: (step, prev, controls) => {
      const K = Number(controls.couplingStrength ?? 1.8);
      const sigma = Number(controls.frequencyVariance ?? 0.8);
      const N = Number(controls.oscillatorCount ?? 100);

      // Critical coupling threshold Kc = 2 * sigma
      const Kc = 2 * sigma;
      const isSynchronizing = K >= Kc;

      let r = prev.orderParameter;
      let regime = '';

      if (K === 0) {
        r = Math.round((0.08 + (1 / Math.sqrt(N))) * 100) / 100;
        regime = 'ZERO COUPLING: Pure stochastic chaos. Zero phase alignment between oscillators.';
      } else if (isSynchronizing) {
        // Kuramoto phase transition: r = sqrt(1 - Kc/K)
        const asymptoticR = Math.sqrt(1 - (Kc / (K + 0.1)));
        const stepMultiplier = prev.orderParameter <= 0.12 ? step : 1;
        r = Math.min(0.99, Math.round((prev.orderParameter + (asymptoticR - prev.orderParameter) * 0.45 * stepMultiplier) * 100) / 100);
        regime = r > 0.85 
          ? `LOCKSTEP SYNCHRONY (r = ${r}): All ${N} oscillators locked into unified phase coherence! Flashing in perfect unison.`
          : `PHASE LOCKING ENGAGED (K = ${K} > ${Kc.toFixed(1)} Kc): A giant synchronous core formed and sweeps drifting oscillators into lockstep.`;
      } else {
        r = Math.max(0.08, Math.round((prev.orderParameter * 0.7) * 100) / 100);
        regime = `SUBCRITICAL DRIFT (K = ${K} < ${Kc.toFixed(1)} Kc): Coupling is too weak to overcome natural frequency variance. System remains incoherent.`;
      }

      return {
        orderParameter: r,
        phaseCoherence: Math.round(r * 100),
        synchronizedFraction: Math.round(Math.min(100, (r * 100) * 1.1)),
        syncRegime: regime
      };
    },
    metrics: [
      { key: 'orderParameter', label: 'Kuramoto Order Parameter (r)', color: 'text-indigo-500', formatter: (val) => `r = ${val}` },
      { key: 'phaseCoherence', label: 'Phase Coherence', color: 'text-emerald-500', formatter: (val) => `${val}% in sync` },
      { key: 'synchronizedFraction', label: 'Locked Oscillators', color: 'text-amber-500', formatter: (val) => `${val}% locked` }
    ],
    analysis: (state, controls) => {
      const K = Number(controls.couplingStrength ?? 1.8);
      const sigma = Number(controls.frequencyVariance ?? 0.8);
      const Kc = 2 * sigma;

      if (K >= Kc) {
        return {
          title: `Kuramoto Spontaneous Synchronization (K = ${K} >= ${Kc.toFixed(1)} Kc)`,
          text: `Above critical coupling Kc, non-linear sine interactions overcome frequency dispersion. Mutual phase entrainment emerged spontaneously, driving the Kuramoto order parameter to r = ${state.orderParameter} (mirroring Malaysian firefly swarms and cardiac pacemaker synchrony).`,
          isCritical: false
        };
      }
      return {
        title: `Incoherent Phase Drift (K = ${K} < ${Kc.toFixed(1)} Kc)`,
        text: `Coupling strength K=${K} is below the critical threshold Kc=${Kc.toFixed(1)}. Natural frequency diversity dominates, preventing global synchronization (order parameter r = ${state.orderParameter}).`,
        isCritical: true
      };
    }
  }
];
