/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MetricProps {
  metrics: {
    key: string;
    label: string;
    unit?: string;
    formatter?: (val: any) => string;
    color: string;
  }[];
  state: Record<string, any>;
}

export default function MetricCards({ metrics, state }: MetricProps) {
  if (metrics.length === 0) return null;

  return (
    <div id="metric-cards" className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {metrics.map((met) => {
        const rawValue = state[met.key];
        const displayValue = met.formatter ? met.formatter(rawValue) : rawValue;

        return (
          <div
            key={met.key}
            className="bg-white border border-slate-200 rounded p-3 flex flex-col justify-between"
          >
            <span className="text-xs text-slate-600 font-medium truncate">
              {met.label}
            </span>
            <div className={`mt-1.5 text-lg font-bold font-mono tracking-tight ${met.color}`}>
              {displayValue}
            </div>
          </div>
        );
      })}
    </div>
  );
}
