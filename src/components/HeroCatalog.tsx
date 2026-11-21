/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { ScenarioDefinition } from '../types';
import ModelIllustration from './ModelIllustrations';

interface HeroCatalogProps {
  scenarios: ScenarioDefinition[];
  onSelectModel: (id: string) => void;
  activeModelId?: string;
}

interface SlideTone {
  panelBg: string;
  artBg: string;
  borderColor: string;
}

const SLIDE_TONES: SlideTone[] = [
  {
    panelBg: 'bg-[#272757]',
    artBg: 'bg-[#0F0E47]',
    borderColor: 'border-[#7676AB]/60',
  },
  {
    panelBg: 'bg-[#2F2F66]',
    artBg: 'bg-[#0F0E47]',
    borderColor: 'border-[#7676AB]/75',
  },
];

export default function HeroCatalog({ scenarios, onSelectModel, activeModelId }: HeroCatalogProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const stripRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const domains: string[] = [
    'All',
    'Emergence & Complexity',
    'Economics',
    'Social',
    'Environment',
    'Urban',
    'Public Health',
  ];

  const filteredScenarios = useMemo(() => {
    return scenarios.filter((s) => {
      const matchesDomain = selectedDomain === 'All' || s.domain === selectedDomain;
      const matchesSearch =
        searchQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.chaosConcept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.domain.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [scenarios, selectedDomain, searchQuery]);

  // Keep activeIndex in bounds when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedDomain, searchQuery]);

  // Sync activeModelId on mount if provided
  useEffect(() => {
    if (activeModelId) {
      const idx = filteredScenarios.findIndex((s) => s.id === activeModelId);
      if (idx !== -1) setActiveIndex(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll active thumbnail into view smoothly
  useEffect(() => {
    const container = stripRef.current;
    if (!container) return;
    const activeEl = container.children[activeIndex] as HTMLElement | undefined;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDrawerOpen || document.activeElement?.tagName === 'INPUT') return;
      if (filteredScenarios.length === 0) return;

      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % filteredScenarios.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + filteredScenarios.length) % filteredScenarios.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredScenarios.length, isDrawerOpen]);

  // Focus search input when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isDrawerOpen]);

  const currentScenario = filteredScenarios[activeIndex] || filteredScenarios[0];
  const currentTone = SLIDE_TONES[activeIndex % SLIDE_TONES.length];

  const handlePrev = () => {
    if (filteredScenarios.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + filteredScenarios.length) % filteredScenarios.length);
  };

  const handleNext = () => {
    if (filteredScenarios.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % filteredScenarios.length);
  };

  const formatIndex = (idx: number) => String(idx + 1).padStart(2, '0');

  return (
    <div id="hero-models-catalog" className="w-full min-h-screen bg-[#0F0E47] text-[#EDEDF7] flex flex-col font-sans selection:bg-[#F5B544] selection:text-[#0F0E47]">
      
      {/* Unified Dark Header */}
      <header className="w-full bg-[#0F0E47]/95 backdrop-blur border-b border-[#7676AB]/45 sticky top-0 z-40 px-4 md:px-10 py-3.5 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="./logo.png"
            alt="Chaos model Thinking"
            className="h-6 w-6 object-contain rounded"
            referrerPolicy="no-referrer"
          />
          <span className="font-display font-bold text-base tracking-tight text-[#EDEDF7] whitespace-nowrap">
            Chaos model Thinking
          </span>
        </div>

        {/* Clean Typographic Domain Links (Desktop) */}
        <nav aria-label="Model categories" className="hidden lg:flex items-center gap-5 text-xs font-medium">
          {domains.map((domain) => {
            const isSelected = selectedDomain === domain;
            const shortLabel = domain === 'Emergence & Complexity' ? 'Emergence' : domain;
            return (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'border-[#F5B544] text-[#EDEDF7] font-semibold'
                    : 'border-transparent text-[#B4B4D6] hover:text-[#EDEDF7]'
                }`}
              >
                {shortLabel}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Search Index Drawer & Active Model */}
        <div className="flex items-center gap-3 shrink-0">
          {activeModelId && (
            <button
              onClick={() => onSelectModel(activeModelId)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#B4B4D6] hover:text-[#F5B544] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Resume active</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open model search and index"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2F2F66] hover:bg-[#7676AB]/35 border border-[#7676AB]/60 text-[#EDEDF7] text-xs font-medium transition-colors cursor-pointer rounded whitespace-nowrap shrink-0"
          >
            <Search className="h-3.5 w-3.5 text-[#F5B544]" />
            <span>Index</span>
          </button>
        </div>
      </header>

      {/* Mobile Domain Filter Strip */}
      <div className="lg:hidden bg-[#0F0E47] border-b border-[#7676AB]/40 px-4 py-2 flex items-center gap-4 overflow-x-auto scrollbar-none text-xs">
        {domains.map((domain) => {
          const isSelected = selectedDomain === domain;
          const shortLabel = domain === 'Emergence & Complexity' ? 'Emergence' : domain;
          return (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                isSelected
                  ? 'border-[#F5B544] text-[#EDEDF7] font-semibold'
                  : 'border-transparent text-[#B4B4D6]'
              }`}
            >
              {shortLabel}
            </button>
          );
        })}
      </div>

      {/* Main Carousel Stage */}
      <main className="flex-1 flex flex-col justify-center px-4 md:px-10 py-6 md:py-10 max-w-7xl mx-auto w-full gap-6">
        {currentScenario ? (
          <>
            {/* Featured Split-Panel Carousel Card */}
            <section
              aria-roledescription="carousel"
              aria-label="Simulation models carousel"
              className={`w-full grid grid-cols-1 lg:grid-cols-12 border ${currentTone.borderColor} rounded-lg overflow-hidden min-h-[420px] md:min-h-[460px] transition-colors duration-300`}
            >
              {/* Left Typography & Action Panel */}
              <div className={`lg:col-span-6 ${currentTone.panelBg} p-7 sm:p-10 md:p-12 flex flex-col justify-between transition-colors duration-300`}>
                <div className="space-y-4">
                  <div className="text-xs font-mono tabular-nums flex items-center gap-2 text-[#B4B4D6]">
                    <span className="text-[#F5B544] font-semibold">{formatIndex(activeIndex)} / {formatIndex(filteredScenarios.length - 1)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentScenario.domain}</span>
                  </div>

                  <h1 className="font-display text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight leading-[1.08] text-[#EDEDF7] text-balance">
                    {currentScenario.name}
                  </h1>

                  <p className="text-sm md:text-base font-normal leading-relaxed max-w-md pt-1 text-[#B4B4D6]">
                    {currentScenario.chaosConcept}
                  </p>
                </div>

                {/* Bottom Action & Carousel Controls */}
                <div className="pt-8 flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={() => onSelectModel(currentScenario.id)}
                    className="px-5 py-3 bg-[#F5B544] hover:bg-[#f7c568] text-[#0F0E47] text-xs font-semibold rounded flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Open Simulator</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      aria-label="Previous model"
                      className="p-2.5 bg-[#0F0E47]/65 hover:bg-[#2F2F66] text-[#EDEDF7] border border-[#7676AB]/60 rounded transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Next model"
                      className="p-2.5 bg-[#0F0E47]/65 hover:bg-[#2F2F66] text-[#EDEDF7] border border-[#7676AB]/60 rounded transition-colors cursor-pointer"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Flowy Running Line-Art Panel */}
              <div
                onClick={() => onSelectModel(currentScenario.id)}
                className={`lg:col-span-6 ${currentTone.artBg} p-6 md:p-8 flex items-center justify-center relative cursor-pointer group border-t lg:border-t-0 lg:border-l border-[#7676AB]/45`}
              >
                <div className="w-full max-w-[440px] aspect-[4/3] transition-transform duration-300 group-hover:scale-[1.02]">
                  <ModelIllustration scenarioId={currentScenario.id} className="w-full h-full" />
                </div>
              </div>
            </section>

            {/* Horizontal Carousel Peek Filmstrip */}
            <section aria-label="Model slides navigation" className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#B4B4D6] px-0.5">
                <span>Browse slides ({filteredScenarios.length})</span>
                <span className="hidden sm:inline">Use ← / → keys or select a slide</span>
              </div>

              <div
                ref={stripRef}
                className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#7676AB]"
              >
                {filteredScenarios.map((scenario, idx) => {
                  const isActive = idx === activeIndex;

                  return (
                    <button
                      key={scenario.id}
                      onClick={() => setActiveIndex(idx)}
                      onDoubleClick={() => onSelectModel(scenario.id)}
                      className={`snap-center shrink-0 w-56 sm:w-64 text-left flex flex-col border rounded overflow-hidden transition-all cursor-pointer group ${
                        isActive
                          ? 'border-[#F5B544] ring-1 ring-[#F5B544] bg-[#2F2F66] -translate-y-0.5'
                          : 'border-[#7676AB]/45 bg-[#272757] hover:bg-[#2F2F66] hover:border-[#7676AB] opacity-90 hover:opacity-100'
                      }`}
                    >
                      {/* Mini Flowing Line-Art Preview */}
                      <div className="w-full h-28 bg-[#0F0E47] p-2 border-b border-[#7676AB]/40 flex items-center justify-center overflow-hidden">
                        <ModelIllustration scenarioId={scenario.id} className="w-full h-full" />
                      </div>

                      {/* Mini Caption */}
                      <div className="p-3 flex-1 w-full flex flex-col justify-between">
                        <div className={`text-[11px] font-mono tabular-nums ${isActive ? 'text-[#F5B544]' : 'text-[#B4B4D6]'}`}>
                          {formatIndex(idx)} · {scenario.domain}
                        </div>
                        <div className="font-display font-semibold text-sm leading-snug mt-1 line-clamp-2 text-[#EDEDF7]">
                          {scenario.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          /* Empty State matching Unified Dark Theme */
          <section className="w-full bg-[#272757] border border-[#7676AB]/60 rounded-lg p-10 md:p-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-4">
              <h2 className="font-display text-2xl font-bold text-[#EDEDF7]">
                Nothing found
              </h2>
              <p className="text-sm text-[#B4B4D6]">
                Try clearing the search query or switching model category.
              </p>
              <button
                onClick={() => {
                  setSelectedDomain('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#F5B544] hover:bg-[#f7c568] text-[#0F0E47] text-xs font-semibold rounded cursor-pointer transition-colors"
              >
                Reset filter
              </button>
            </div>
            <div className="md:col-span-6 flex justify-center">
              <div className="w-56 h-44 bg-[#0F0E47] p-3 border border-[#7676AB]/60 rounded">
                <ModelIllustration scenarioId="watts-strogatz" className="w-full h-full" />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Unified Search & Index Drawer */}
      {isDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Models index and search"
          className="fixed inset-0 z-50 bg-[#0F0E47]/80 backdrop-blur-sm flex justify-end"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#272757] border-l border-[#7676AB] text-[#EDEDF7] h-full overflow-y-auto p-6 sm:p-10 flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-8">
              {/* Top Search Input Row */}
              <div className="flex items-center justify-between gap-4 border-b border-[#7676AB]/60 pb-3">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search models..."
                  className="w-full bg-transparent text-lg font-display font-semibold text-[#EDEDF7] placeholder-[#B4B4D6] focus:outline-none"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#B4B4D6] hover:text-[#F5B544] underline shrink-0 cursor-pointer"
                  >
                    Clear
                  </button>
                ) : null}
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close index"
                  className="p-1 text-[#B4B4D6] hover:text-[#EDEDF7] cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Interactive Filter Controls inside Drawer */}
              <div className="flex flex-wrap gap-2 text-xs">
                {domains.map((domain) => {
                  const isSelected = selectedDomain === domain;
                  const shortLabel = domain === 'Emergence & Complexity' ? 'Emergence' : domain;
                  return (
                    <button
                      key={domain}
                      onClick={() => setSelectedDomain(domain)}
                      className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#F5B544] text-[#0F0E47] font-semibold'
                          : 'bg-[#2F2F66] text-[#B4B4D6] hover:text-[#EDEDF7] border border-[#7676AB]/50'
                      }`}
                    >
                      {shortLabel}
                    </button>
                  );
                })}
              </div>

              {/* Two-Column Clean Index List */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-[#B4B4D6]">
                  Models ({filteredScenarios.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {filteredScenarios.map((scenario, idx) => (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        setActiveIndex(idx);
                        setIsDrawerOpen(false);
                      }}
                      className="text-left group py-1.5 border-b border-[#7676AB]/35 hover:border-[#F5B544] flex items-baseline justify-between gap-2 cursor-pointer"
                    >
                      <span className="text-xs font-medium text-[#EDEDF7] group-hover:text-[#F5B544] transition-colors truncate tabular-nums">
                        {formatIndex(idx)} · {scenario.name}
                      </span>
                      <ArrowRight className="h-3 w-3 shrink-0 text-[#F5B544] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#7676AB]/50 flex items-center justify-between text-xs text-[#B4B4D6] font-mono">
              <span>Chaos model Thinking</span>
              <span>{scenarios.length} simulations</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
