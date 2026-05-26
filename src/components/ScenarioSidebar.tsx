/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  Leaf, 
  Zap, 
  Activity, 
  Share2, 
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { Domain, ScenarioDefinition } from '../types';

interface SidebarProps {
  scenarios: ScenarioDefinition[];
  currentId: string;
  onSelect: (id: string) => void;
}

const DOMAIN_ICONS: Record<Domain, React.ComponentType<any>> = {
  'Economics': TrendingUp,
  'Environment': Leaf,
  'Urban': Zap,
  'Public Health': Activity,
  'Social': Share2,
};

const DOMAIN_COLORS: Record<Domain, { bg: string; text: string; border: string }> = {
  'Economics': { bg: 'bg-indigo-55 bg-opacity-70 text-indigo-700', text: 'text-indigo-800', border: 'border-indigo-100' },
  'Environment': { bg: 'bg-emerald-55 bg-opacity-70 text-emerald-700', text: 'text-emerald-800', border: 'border-emerald-100' },
  'Urban': { bg: 'bg-amber-55 bg-opacity-70 text-amber-700', text: 'text-amber-800', border: 'border-amber-100' },
  'Public Health': { bg: 'bg-rose-55 bg-opacity-70 text-rose-700', text: 'text-rose-800', border: 'border-rose-100' },
  'Social': { bg: 'bg-blue-55 bg-opacity-70 text-blue-700', text: 'text-blue-800', border: 'border-blue-100' },
};

export default function ScenarioSidebar({ scenarios, currentId, onSelect }: SidebarProps) {
  // Group scenarios by domain
  const domains: Domain[] = ['Economics', 'Environment', 'Urban', 'Public Health', 'Social'];

  return (
    <div id="scenario-sidebar" className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Title block */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="Chaos model Thinking" 
              className="h-7 w-7 object-contain rounded-md" 
              referrerPolicy="no-referrer"
            />
            Chaos model Thinking
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Tipping Point Simulator</p>
        </div>
        <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
      </div>

      {/* Info helper */}
      <div className="p-4 bg-slate-55 bg-opacity-55 border-b border-slate-150 text-xs text-slate-500 flex gap-2">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          Select an interactive domain below, adjust feedback controls, and step forward in time to watch the non-linear chains unfold.
        </p>
      </div>

      {/* Scenarios lists scroll area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {domains.map((domain) => {
          const domainScenarios = scenarios.filter(s => s.domain === domain);
          const Icon = DOMAIN_ICONS[domain];
          const colors = DOMAIN_COLORS[domain];

          return (
            <div key={domain} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-400 uppercase font-bold sticky top-0 bg-white py-1">
                <Icon className="h-3 w-3 text-slate-550" />
                <span>{domain}</span>
              </div>

              <div className="space-y-1.5">
                {domainScenarios.map((scenario) => {
                  const isSelected = scenario.id === currentId;
                  return (
                    <button
                      key={scenario.id}
                      id={`btn-scenario-${scenario.id}`}
                      onClick={() => onSelect(scenario.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-250 flex flex-col gap-1 cursor-pointer ${
                        isSelected
                          ? `bg-slate-900 border-slate-900 text-white shadow-sm`
                          : `bg-slate-55 bg-opacity-45 hover:bg-slate-100 border-slate-150 text-slate-850 hover:border-slate-300`
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-sm leading-tight pr-1">
                          {scenario.name}
                        </span>
                        {!isSelected && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-medium tracking-wide uppercase shrink-0 ${colors.bg}`}>
                            {scenario.timeLabel}
                          </span>
                        )}
                      </div>
                      <span className={`text-[11px] font-mono leading-normal ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {scenario.chaosConcept}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky footer credits */}
      <div className="p-4 border-t border-slate-100 bg-slate-55 bg-opacity-25 text-[11px] text-slate-400 font-mono text-center">
        <span>Deterministic Chaos Engine v1.1</span>
      </div>
    </div>
  );
}
