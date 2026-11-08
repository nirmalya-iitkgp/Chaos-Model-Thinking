/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowRight
} from 'lucide-react';
import { ScenarioDefinition } from '../types';

interface HeroCatalogProps {
  scenarios: ScenarioDefinition[];
  onSelectModel: (id: string) => void;
  activeModelId?: string;
}

export default function HeroCatalog({ scenarios, onSelectModel, activeModelId }: HeroCatalogProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const domains: string[] = ['All', 'Emergence & Complexity', 'Economics', 'Social', 'Environment', 'Urban', 'Public Health'];

  const filteredScenarios = useMemo(() => {
    return scenarios.filter(s => {
      const matchesDomain = selectedDomain === 'All' || s.domain === selectedDomain;
      const matchesSearch = searchQuery.trim() === '' || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.chaosConcept.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [scenarios, selectedDomain, searchQuery]);

  return (
    <div id="hero-models-catalog" className="w-full min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      
      {/* Header & Controls */}
      <header className="w-full border-b border-zinc-800 bg-zinc-950/95 sticky top-0 z-40 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-6 w-6 object-contain rounded" 
            referrerPolicy="no-referrer"
          />
          <span className="font-semibold text-sm text-white">
            Chaos model Thinking
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            ({scenarios.length})
          </span>
        </div>

        {activeModelId && (
          <button
            onClick={() => onSelectModel(activeModelId)}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 border border-zinc-700 transition-colors"
          >
            <span>Resume</span>
            <ArrowRight className="h-3 w-3 text-zinc-400" />
          </button>
        )}
      </header>

      {/* Filter & Search Bar */}
      <section className="px-4 md:px-8 pt-5 pb-3 max-w-6xl mx-auto w-full space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Domain Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            {domains.map((domain) => {
              const count = domain === 'All' 
                ? scenarios.length 
                : scenarios.filter(s => s.domain === domain).length;
              const isSelected = selectedDomain === domain;

              return (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  <span>{domain}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px] md:w-56">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>
      </section>

      {/* Simulation Grid */}
      <main className="px-4 md:px-8 pb-12 max-w-6xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => onSelectModel(scenario.id)}
              className="border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 p-3.5 rounded transition-colors cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  {scenario.domain}
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-zinc-100 mt-0.5">
                  {scenario.name}
                </h3>
                <div className="text-xs text-zinc-400 mt-1">
                  {scenario.chaosConcept}
                </div>
              </div>

              <div className="border-t border-zinc-800/80 pt-2.5 mt-3 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono text-[11px]">
                  {scenario.controls.length} controls
                </span>
                <span className="text-zinc-300 font-medium flex items-center gap-1 group-hover:text-white">
                  Launch
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredScenarios.length === 0 && (
          <div className="py-12 text-center border border-dashed border-zinc-800 rounded p-6">
            <p className="text-zinc-400 text-xs">No simulations found.</p>
            <button
              onClick={() => { setSelectedDomain('All'); setSearchQuery(''); }}
              className="mt-2 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
            >
              Reset
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
