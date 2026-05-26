/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
  return (
    <div id="metric-cards" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {metrics.map((met) => {
          const rawValue = state[met.key];
          const displayValue = met.formatter ? met.formatter(rawValue) : rawValue;

          return (
            <motion.div
              key={met.key}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden"
            >
              <div className="text-[11px] font-semibold text-slate-450 uppercase tracking-widest leading-none font-mono">
                {met.label}
              </div>
              
              <div className="mt-2.5 flex items-baseline gap-1">
                <motion.span 
                  key={String(rawValue)} // forces exit/entry scaling animation upon value flip
                  initial={{ y: 3, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-xl md:text-2xl font-bold tracking-tight ${met.color}`}
                >
                  {displayValue}
                </motion.span>
              </div>

              {/* Decorative side accents */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-slate-100" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
