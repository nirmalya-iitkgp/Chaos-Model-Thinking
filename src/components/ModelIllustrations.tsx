/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ModelIllustrationProps {
  scenarioId: string;
  className?: string;
}

const PALETTE = {
  ink: '#18181B',
  vermilion: '#D94126',
  mustard: '#E5D261',
  sage: '#7FB7AC',
  ice: '#D6E2EE',
  cream: '#FAF8F3',
  slate: '#475569',
};

export default function ModelIllustration({ scenarioId, className = 'w-full h-full' }: ModelIllustrationProps) {
  const uid = scenarioId.replace(/[^a-zA-Z0-9]/g, '');

  const renderArt = () => {
    switch (scenarioId) {
      case 'market-panic':
        return (
          <g>
            {/* Geometric background planes */}
            <rect x="45" y="40" width="160" height="220" fill={PALETTE.ice} />
            <circle cx="290" cy="110" r="68" fill={PALETTE.mustard} />
            <rect x="210" y="185" width="130" height="90" fill={`url(#plaid-${uid})`} stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Price trajectory spike & crash line art */}
            <path
              d="M 30 250 L 75 235 L 110 245 L 155 170 L 185 185 L 235 80 L 255 60 L 270 230 L 315 215 L 365 265"
              fill="none"
              stroke={PALETTE.ink}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Bubble burst arcs */}
            <circle cx="255" cy="60" r="22" fill="none" stroke={PALETTE.vermilion} strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 272 32 L 288 18 M 286 58 L 308 54 M 234 36 L 220 20" stroke={PALETTE.vermilion} strokeWidth="2" strokeLinecap="round" />
            {/* Candlesticks */}
            <g stroke={PALETTE.ink} strokeWidth="1.5">
              <line x1="85" y1="145" x2="85" y2="215" />
              <rect x="78" y="165" width="14" height="32" fill={PALETTE.cream} />
              <line x1="125" y1="110" x2="125" y2="195" />
              <rect x="118" y="128" width="14" height="44" fill={PALETTE.vermilion} />
              <line x1="165" y1="85" x2="165" y2="165" />
              <rect x="158" y="102" width="14" height="36" fill={PALETTE.cream} />
            </g>
            {/* Feedback spiral loop */}
            <path d="M 110 75 C 140 35, 195 45, 195 80 C 195 105, 165 110, 155 95" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" />
            <polygon points="151,90 162,93 156,102" fill={PALETTE.ink} />
          </g>
        );

      case 'bullwhip-effect':
        return (
          <g>
            <rect x="30" y="55" width="90" height="190" fill={PALETTE.mustard} />
            <rect x="240" y="35" width="130" height="230" fill={`url(#dots-${uid})`} />
            {/* Amplifying sine wave from left (retail) to right (factory) */}
            <path
              d="M 25 150 Q 45 140, 65 150 T 105 150 T 155 150 Q 180 95, 205 150 T 265 150 Q 300 25, 335 150 T 385 150"
              fill="none"
              stroke={PALETTE.ink}
              strokeWidth="2.5"
            />
            <path
              d="M 25 150 Q 45 162, 65 150 T 105 150 T 155 150 Q 180 205, 205 150 T 265 150 Q 300 275, 335 150"
              fill="none"
              stroke={PALETTE.vermilion}
              strokeWidth="1.75"
              strokeDasharray="5 4"
            />
            {/* Tier Boxes */}
            <rect x="52" y="136" width="26" height="26" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="2" />
            <rect x="140" y="130" width="34" height="38" fill={PALETTE.ice} stroke={PALETTE.ink} strokeWidth="2" />
            <rect x="246" y="122" width="44" height="54" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="2" />
            <line x1="25" y1="150" x2="380" y2="150" stroke={PALETTE.ink} strokeWidth="1" opacity="0.4" />
          </g>
        );

      case 'climate-tipping':
        return (
          <g>
            {/* Geometric sea & ice mass */}
            <polygon points="20,220 120,165 245,195 370,150 385,280 20,280" fill={PALETTE.ice} stroke={PALETTE.ink} strokeWidth="1.5" />
            <polygon points="50,210 135,115 215,180 120,220" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="2" />
            <polygon points="135,115 170,145 120,220 90,190" fill={`url(#hatch-${uid})`} stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Sun & thermal feedback loop */}
            <circle cx="290" cy="85" r="42" fill={PALETTE.vermilion} />
            <circle cx="290" cy="85" r="56" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Albedo reflection vs absorption rays */}
            <path d="M 248 100 L 165 140 L 185 60" fill="none" stroke={PALETTE.ink} strokeWidth="2" />
            <polygon points="186,52 178,66 191,67" fill={PALETTE.ink} />
            {/* Hysteresis S-curve */}
            <path d="M 35 75 C 95 75, 115 45, 100 105 C 88 150, 145 140, 175 135" fill="none" stroke={PALETTE.mustard} strokeWidth="3.5" />
            <path d="M 35 75 C 95 75, 115 45, 100 105 C 88 150, 145 140, 175 135" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" />
          </g>
        );

      case 'predator-prey':
        return (
          <g>
            <rect x="190" y="35" width="165" height="225" fill={PALETTE.mustard} />
            <circle cx="130" cy="160" r="85" fill={PALETTE.ice} stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Phase space spiral / strange attractor loops */}
            <ellipse cx="195" cy="150" rx="115" ry="68" transform="rotate(-14 195 150)" fill="none" stroke={PALETTE.ink} strokeWidth="2" />
            <ellipse cx="195" cy="150" rx="88" ry="48" transform="rotate(-14 195 150)" fill="none" stroke={PALETTE.vermilion} strokeWidth="1.75" strokeDasharray="6 4" />
            <ellipse cx="195" cy="150" rx="58" ry="30" transform="rotate(-14 195 150)" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Minimalist geometric predator & prey silhouettes */}
            <polygon points="90,115 115,92 128,118 102,126" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="1.5" />
            <circle cx="275" cy="192" r="14" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="2" />
            <path d="M 270 178 L 265 162 M 280 178 L 285 162" stroke={PALETTE.ink} strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'phantom-traffic':
        return (
          <g>
            <circle cx="200" cy="150" r="112" fill={PALETTE.ice} />
            {/* Ring road tracks */}
            <circle cx="200" cy="150" r="96" fill="none" stroke={PALETTE.ink} strokeWidth="2" />
            <circle cx="200" cy="150" r="68" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" strokeDasharray="6 6" />
            {/* Shockwave compression zone highlight */}
            <path d="M 278 92 A 96 96 0 0 1 285 198" fill="none" stroke={PALETTE.vermilion} strokeWidth="14" opacity="0.85" />
            {/* Car blocks: spaced out on left, jammed together on right */}
            {[170, 200, 230, 265, 305, 350, 15, 28, 39, 49, 59, 70, 95, 130].map((deg, idx) => {
              const rad = (deg * Math.PI) / 180;
              const cx = 200 + 82 * Math.cos(rad);
              const cy = 150 + 82 * Math.sin(rad);
              const isJammed = deg >= 10 && deg <= 75;
              return (
                <rect
                  key={idx}
                  x={cx - 7}
                  y={cy - 4}
                  width="14"
                  height="8"
                  transform={`rotate(${deg + 90} ${cx} ${cy})`}
                  fill={isJammed ? PALETTE.vermilion : PALETTE.cream}
                  stroke={PALETTE.ink}
                  strokeWidth="1.5"
                />
              );
            })}
            {/* Backward shockwave arrow */}
            <path d="M 235 195 A 55 55 0 0 0 240 110" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" />
            <polygon points="236,104 246,110 238,118" fill={PALETTE.ink} />
          </g>
        );

      case 'power-grid':
        return (
          <g>
            <rect x="45" y="45" width="140" height="210" fill={`url(#plaid-${uid})`} opacity="0.6" />
            <polygon points="210,30 355,90 325,260 190,220" fill={PALETTE.mustard} />
            {/* High-voltage transmission tower line art */}
            <g stroke={PALETTE.ink} strokeWidth="2" fill="none">
              <path d="M 110 265 L 135 75 L 160 265" />
              <line x1="90" y1="120" x2="180" y2="120" />
              <line x1="100" y1="160" x2="170" y2="160" />
              <path d="M 116 220 L 154 160 M 154 220 L 116 160" strokeWidth="1.5" />
            </g>
            {/* Network substations & tripped link */}
            <line x1="180" y1="120" x2="290" y2="100" stroke={PALETTE.ink} strokeWidth="2" />
            <line x1="170" y1="160" x2="275" y2="210" stroke={PALETTE.vermilion} strokeWidth="2.5" strokeDasharray="5 4" />
            <rect x="272" y="84" width="34" height="34" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="2" />
            <rect x="260" y="192" width="36" height="36" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="2" />
            {/* Spark / overload arc */}
            <path d="M 225 162 L 238 142 L 246 158 L 260 135" fill="none" stroke={PALETTE.vermilion} strokeWidth="2.5" />
          </g>
        );

      case 'pandemic-outbreak':
        return (
          <g>
            <rect x="200" y="35" width="160" height="220" fill={PALETTE.ice} />
            <circle cx="145" cy="145" r="75" fill={PALETTE.mustard} />
            {/* SIR / Exponential vs Flattened Curves */}
            <path d="M 35 250 C 90 248, 120 75, 165 55 C 205 38, 235 235, 365 248" fill="none" stroke={PALETTE.vermilion} strokeWidth="3" />
            <path d="M 35 250 C 110 245, 175 180, 230 182 C 285 184, 315 240, 365 248" fill="none" stroke={PALETTE.ink} strokeWidth="2.5" />
            <line x1="35" y1="195" x2="365" y2="195" stroke={PALETTE.ink} strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Contagion tree nodes */}
            <circle cx="280" cy="80" r="10" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="1.5" />
            <line x1="280" y1="80" x2="245" y2="125" stroke={PALETTE.ink} strokeWidth="1.5" />
            <line x1="280" y1="80" x2="318" y2="125" stroke={PALETTE.ink} strokeWidth="1.5" />
            <circle cx="245" cy="125" r="7" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="1.5" />
            <circle cx="318" cy="125" r="7" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="1.5" />
          </g>
        );

      case 'vaccination-threshold':
        return (
          <g>
            <rect x="40" y="45" width="320" height="210" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Hexagonal shield barrier */}
            {[0, 1, 2, 3, 4].map((row) =>
              [0, 1, 2, 3, 4, 5].map((col) => {
                const cx = 75 + col * 48 + (row % 2) * 20;
                const cy = 72 + row * 38;
                const isShield = col >= 2 && col <= 3;
                const isInfected = col < 2 && row === 2;
                return (
                  <circle
                    key={`${row}-${col}`}
                    cx={cx}
                    cy={cy}
                    r={isShield ? 13 : 9}
                    fill={isShield ? PALETTE.sage : isInfected ? PALETTE.vermilion : PALETTE.ice}
                    stroke={PALETTE.ink}
                    strokeWidth="1.5"
                  />
                );
              })
            )}
            {/* Deflected pathogen vector */}
            <path d="M 35 148 L 152 148 L 118 92" fill="none" stroke={PALETTE.vermilion} strokeWidth="2.5" />
            <polygon points="113,84 126,90 115,98" fill={PALETTE.vermilion} />
          </g>
        );

      case 'fake-news':
        return (
          <g>
            <circle cx="255" cy="150" r="105" fill={PALETTE.mustard} />
            <circle cx="255" cy="150" r="74" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="255" cy="150" r="44" fill="none" stroke={PALETTE.vermilion} strokeWidth="2" />
            {/* Stylized megaphone line-art */}
            <polygon points="55,135 155,95 155,205 55,165" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="2" />
            <rect x="75" y="170" width="16" height="40" fill={PALETTE.ink} />
            {/* Branching amplification arcs */}
            <path d="M 175 115 C 205 115, 205 185, 175 185" fill="none" stroke={PALETTE.ink} strokeWidth="2" />
            <path d="M 192 92 C 232 92, 232 208, 192 208" fill="none" stroke={PALETTE.ink} strokeWidth="2" />
            {/* Connected viral nodes */}
            <circle cx="255" cy="150" r="10" fill={PALETTE.ink} />
            <circle cx="315" cy="105" r="8" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="1.5" />
            <circle cx="325" cy="195" r="8" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="1.5" />
            <line x1="255" y1="150" x2="315" y2="105" stroke={PALETTE.ink} strokeWidth="1.5" />
            <line x1="255" y1="150" x2="325" y2="195" stroke={PALETTE.ink} strokeWidth="1.5" />
          </g>
        );

      case 'viral-tipping':
        return (
          <g>
            <rect x="40" y="185" width="320" height="65" fill={PALETTE.ice} />
            {/* Falling domino sequence tipping past 25% */}
            <rect x="55" y="110" width="20" height="80" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="2" transform="rotate(28 65 190)" />
            <rect x="115" y="105" width="20" height="85" fill={PALETTE.mustard} stroke={PALETTE.ink} strokeWidth="2" transform="rotate(42 125 190)" />
            <rect x="180" y="100" width="22" height="90" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="2" transform="rotate(60 191 190)" />
            <rect x="265" y="95" width="24" height="95" fill={PALETTE.sage} stroke={PALETTE.ink} strokeWidth="2" />
            <rect x="315" y="95" width="24" height="95" fill={PALETTE.sage} stroke={PALETTE.ink} strokeWidth="2" />
            {/* Tipping curve */}
            <path d="M 45 75 Q 160 80, 210 55 T 355 45" fill="none" stroke={PALETTE.ink} strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="205" cy="57" r="6" fill={PALETTE.vermilion} />
          </g>
        );

      case 'conway-life':
        return (
          <g>
            <rect x="50" y="35" width="300" height="230" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Subtle matrix grid */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <line key={`v-${i}`} x1={50 + i * 37.5} y1="35" x2={50 + i * 37.5} y2="265" stroke={PALETTE.ice} strokeWidth="1" />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={`h-${i}`} x1="50" y1={35 + i * 38.3} x2="350" y2={35 + i * 38.3} stroke={PALETTE.ice} strokeWidth="1" />
            ))}
            {/* Classic Conway Glider + Blinker + Langton Diagonal Trail */}
            <rect x="125" y="73" width="37" height="38" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="1.5" />
            <rect x="162" y="111" width="37" height="38" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="1.5" />
            <rect x="88" y="150" width="37" height="38" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="1.5" />
            <rect x="125" y="150" width="37" height="38" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="1.5" />
            <rect x="162" y="150" width="37" height="38" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Langton diagonal highway */}
            <rect x="237" y="188" width="37" height="38" fill={PALETTE.mustard} stroke={PALETTE.ink} strokeWidth="1.5" />
            <rect x="275" y="150" width="37" height="38" fill={PALETTE.ink} />
            <path d="M 190 190 L 330 55" stroke={PALETTE.ink} strokeWidth="2" strokeDasharray="4 4" />
          </g>
        );

      case 'preferential-attachment':
        return (
          <g>
            <circle cx="170" cy="145" r="95" fill={PALETTE.ice} />
            {/* Spoke edges */}
            {[
              [70, 70], [115, 50], [260, 55], [325, 95], [340, 185], [275, 245], [140, 250], [65, 200]
            ].map(([x, y], idx) => (
              <g key={idx}>
                <line x1="170" y1="145" x2={x} y2={y} stroke={PALETTE.ink} strokeWidth="1.5" />
                <circle cx={x} cy={y} r={idx % 3 === 0 ? 11 : 6} fill={idx === 4 ? PALETTE.mustard : PALETTE.cream} stroke={PALETTE.ink} strokeWidth="1.5" />
              </g>
            ))}
            {/* Secondary hub connections */}
            <line x1="275" y1="245" x2="340" y2="185" stroke={PALETTE.ink} strokeWidth="1.5" />
            <line x1="275" y1="245" x2="335" y2="258" stroke={PALETTE.ink} strokeWidth="1.5" />
            <circle cx="335" cy="258" r="5" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Super-Hub */}
            <circle cx="170" cy="145" r="26" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="2" />
            <circle cx="170" cy="145" r="8" fill={PALETTE.cream} />
          </g>
        );

      case 'spatial-prisoners-dilemma':
        return (
          <g>
            <rect x="65" y="40" width="270" height="220" fill={`url(#plaid-${uid})`} stroke={PALETTE.ink} strokeWidth="2" />
            {/* Cooperator protective cluster */}
            <rect x="110" y="85" width="90" height="90" fill={PALETTE.sage} stroke={PALETTE.ink} strokeWidth="2" />
            <rect x="110" y="175" width="45" height="45" fill={PALETTE.sage} stroke={PALETTE.ink} strokeWidth="2" />
            {/* Defector wedges */}
            <rect x="200" y="85" width="90" height="45" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="2" />
            <rect x="245" y="130" width="45" height="90" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="2" />
            {/* Strategy interaction arrows */}
            <path d="M 155 130 L 245 130" stroke={PALETTE.mustard} strokeWidth="3" />
            <circle cx="155" cy="130" r="8" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="2" />
            <circle cx="245" cy="108" r="8" fill={PALETTE.ink} />
          </g>
        );

      case 'schelling-segregation':
        return (
          <g>
            {/* Split segregated blocks */}
            <rect x="45" y="45" width="145" height="210" fill={PALETTE.ice} stroke={PALETTE.ink} strokeWidth="1.5" />
            <rect x="210" y="45" width="145" height="210" fill={PALETTE.mustard} stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Group A & Group B geometric houses/dots */}
            {[0, 1, 2].map((r) =>
              [0, 1].map((c) => (
                <circle
                  key={`a-${r}-${c}`}
                  cx={85 + c * 55}
                  cy={85 + r * 58}
                  r="14"
                  fill={PALETTE.vermilion}
                  stroke={PALETTE.ink}
                  strokeWidth="1.5"
                />
              ))
            )}
            {[0, 1, 2].map((r) =>
              [0, 1].map((c) => (
                <rect
                  key={`b-${r}-${c}`}
                  x={236 + c * 55}
                  y={72 + r * 58}
                  width="24"
                  height="24"
                  fill={PALETTE.ink}
                />
              ))
            )}
            {/* Relocation arc across divide */}
            <path d="M 145 140 C 180 80, 220 80, 250 135" fill="none" stroke={PALETTE.ink} strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="252,140 242,132 254,127" fill={PALETTE.ink} />
          </g>
        );

      case 'boids-flocking':
        return (
          <g>
            <path d="M 35 230 C 120 190, 230 85, 360 75" fill="none" stroke={PALETTE.ice} strokeWidth="36" strokeLinecap="round" />
            {/* Sweeping swarm vectors */}
            {[
              [80, 210, -25], [115, 195, -28], [130, 222, -22],
              [165, 165, -35], [190, 188, -30], [210, 140, -32],
              [245, 118, -22], [275, 138, -18], [310, 92, -12], [335, 112, -10]
            ].map(([x, y, ang], idx) => (
              <polygon
                key={idx}
                points="0,-9 20,0 0,9 5,0"
                transform={`translate(${x}, ${y}) rotate(${ang})`}
                fill={idx === 5 ? PALETTE.vermilion : PALETTE.ink}
              />
            ))}
            {/* Apex predator disturbance circle */}
            <circle cx="290" cy="215" r="32" fill={PALETTE.mustard} stroke={PALETTE.ink} strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="282,208 304,215 282,222 287,215" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="1.5" />
          </g>
        );

      case 'forest-fire-percolation':
        return (
          <g>
            <rect x="40" y="55" width="320" height="190" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Burned ash zone left vs green trees right */}
            <polygon points="40,55 215,55 165,245 40,245" fill={`url(#hatch-${uid})`} />
            {/* Stylized geometric trees */}
            {[
              [85, 110, true], [130, 165, true], [90, 215, true],
              [195, 135, 'fire'], [175, 200, 'fire'],
              [255, 105, false], [305, 155, false], [260, 210, false], [320, 95, false]
            ].map(([x, y, state], idx) => (
              <g key={idx} transform={`translate(${x}, ${y})`}>
                <polygon
                  points="0,-24 -16,10 16,10"
                  fill={state === 'fire' ? PALETTE.vermilion : state ? PALETTE.ink : PALETTE.sage}
                  stroke={PALETTE.ink}
                  strokeWidth="1.5"
                />
                <line x1="0" y1="10" x2="0" y2="20" stroke={PALETTE.ink} strokeWidth="2" />
              </g>
            ))}
            {/* Critical percolation front */}
            <path d="M 215 45 L 165 255" stroke={PALETTE.vermilion} strokeWidth="3" strokeDasharray="6 4" />
          </g>
        );

      case 'sugarscape':
        return (
          <g>
            {/* Twin Sugar Mountain topographic contours */}
            <g fill="none" stroke={PALETTE.ink} strokeWidth="1.5">
              <circle cx="135" cy="125" r="78" fill={PALETTE.mustard} opacity="0.45" />
              <circle cx="135" cy="125" r="54" fill={PALETTE.mustard} opacity="0.7" />
              <circle cx="135" cy="125" r="28" fill={PALETTE.vermilion} />
              <circle cx="275" cy="185" r="65" fill={PALETTE.ice} />
              <circle cx="275" cy="185" r="42" />
              <circle cx="275" cy="185" r="20" fill={PALETTE.sage} />
            </g>
            {/* Pareto Lorenz Curve Overlay */}
            <path d="M 55 245 L 345 45" stroke={PALETTE.ink} strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 55 245 Q 290 235, 345 45" fill="none" stroke={PALETTE.vermilion} strokeWidth="3" />
          </g>
        );

      case 'gray-scott':
        return (
          <g>
            <rect x="45" y="40" width="310" height="220" fill={PALETTE.ice} stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Organic Turing morphogenesis coral/mitosis silhouettes */}
            <path
              d="M 85 95 C 75 65, 130 55, 145 85 C 160 115, 195 90, 210 70 C 235 50, 275 80, 250 115 C 225 145, 290 155, 315 125 C 345 150, 315 215, 265 205 C 225 198, 225 235, 185 235 C 145 235, 145 190, 110 205 C 75 218, 60 170, 95 145 C 115 130, 95 115, 85 95 Z"
              fill={PALETTE.mustard}
              stroke={PALETTE.ink}
              strokeWidth="2.5"
            />
            {/* Splitting mitotic cells */}
            <path d="M 135 135 C 120 118, 155 110, 165 130 C 175 150, 150 155, 135 135 Z" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="1.5" />
            <circle cx="245" cy="160" r="18" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="2" />
            <circle cx="290" cy="168" r="12" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth="1.5" />
          </g>
        );

      case 'slime-mold':
        return (
          <g>
            <rect x="35" y="40" width="330" height="220" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Physarum Steiner transport web */}
            <g stroke={PALETTE.ink} strokeLinecap="round" fill="none">
              <path d="M 85 95 Q 150 135, 195 150 T 305 100" strokeWidth="4" />
              <path d="M 195 150 Q 210 195, 265 225" strokeWidth="3.5" />
              <path d="M 195 150 Q 130 185, 85 215" strokeWidth="3" />
              <path d="M 85 95 Q 90 155, 85 215" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M 305 100 Q 300 165, 265 225" strokeWidth="2" />
            </g>
            {/* Nutrient food nodes */}
            {[
              [85, 95, PALETTE.vermilion],
              [305, 100, PALETTE.mustard],
              [265, 225, PALETTE.vermilion],
              [85, 215, PALETTE.sage],
              [195, 150, PALETTE.ink],
            ].map(([cx, cy, fill], idx) => (
              <circle key={idx} cx={cx as number} cy={cy as number} r={idx === 4 ? 7 : 13} fill={fill as string} stroke={PALETTE.ink} strokeWidth="2" />
            ))}
          </g>
        );

      case 'ant-colony':
        return (
          <g>
            <circle cx="80" cy="150" r="24" fill={PALETTE.mustard} stroke={PALETTE.ink} strokeWidth="2" />
            <circle cx="320" cy="150" r="24" fill={PALETTE.sage} stroke={PALETTE.ink} strokeWidth="2" />
            {/* Obstacle block */}
            <rect x="178" y="105" width="44" height="90" fill={`url(#plaid-${uid})`} stroke={PALETTE.ink} strokeWidth="2" />
            {/* Short upper path vs long lower detour */}
            <path d="M 104 142 Q 200 45, 296 142" fill="none" stroke={PALETTE.vermilion} strokeWidth="3.5" />
            <path d="M 104 158 Q 200 285, 296 158" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" strokeDasharray="5 5" />
            {/* Ants along short optimal path */}
            {[0.25, 0.45, 0.6, 0.78].map((t, i) => {
              const x = 104 + (296 - 104) * t;
              const y = 142 - Math.sin(t * Math.PI) * 50;
              return <circle key={i} cx={x} cy={y} r="4.5" fill={PALETTE.ink} />;
            })}
          </g>
        );

      case 'watts-strogatz':
        return (
          <g>
            <circle cx="200" cy="150" r="105" fill={PALETTE.ice} />
            <circle cx="200" cy="150" r="95" fill="none" stroke={PALETTE.ink} strokeWidth="1.5" />
            {/* Ring lattice nodes & local chords */}
            {Array.from({ length: 16 }).map((_, i) => {
              const a1 = (i * 2 * Math.PI) / 16;
              const a2 = (((i + 2) % 16) * 2 * Math.PI) / 16;
              const x1 = 200 + 95 * Math.cos(a1);
              const y1 = 150 + 95 * Math.sin(a1);
              const x2 = 200 + 95 * Math.cos(a2);
              const y2 = 150 + 95 * Math.sin(a2);
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={PALETTE.ink} strokeWidth="1.2" opacity="0.6" />
                  <circle cx={x1} cy={y1} r="5" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="1.5" />
                </g>
              );
            })}
            {/* Rewired long-range small-world shortcuts */}
            <line x1="295" y1="150" x2="112" y2="113" stroke={PALETTE.vermilion} strokeWidth="2.5" />
            <line x1="200" y1="55" x2="164" y2="238" stroke={PALETTE.vermilion} strokeWidth="2.5" />
            <line x1="267" y1="83" x2="133" y2="217" stroke={PALETTE.mustard} strokeWidth="2.5" />
          </g>
        );

      case 'kuramoto-oscillators':
      default:
        return (
          <g>
            <circle cx="200" cy="150" r="98" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="2" />
            <circle cx="200" cy="150" r="64" fill="none" stroke={PALETTE.ice} strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Crosshair axes */}
            <line x1="90" y1="150" x2="310" y2="150" stroke={PALETTE.ink} strokeWidth="1" opacity="0.25" />
            <line x1="200" y1="40" x2="200" y2="260" stroke={PALETTE.ink} strokeWidth="1" opacity="0.25" />
            {/* Synchronized phase cluster */}
            {[-22, -12, -4, 4, 14, 26].map((deg, idx) => {
              const rad = ((deg - 35) * Math.PI) / 180;
              const x = 200 + 98 * Math.cos(rad);
              const y = 150 + 98 * Math.sin(rad);
              return <circle key={idx} cx={x} cy={y} r="6.5" fill={PALETTE.mustard} stroke={PALETTE.ink} strokeWidth="1.5" />;
            })}
            {/* Drifting outliers */}
            {[115, 205].map((deg, idx) => {
              const rad = (deg * Math.PI) / 180;
              const x = 200 + 98 * Math.cos(rad);
              const y = 150 + 98 * Math.sin(rad);
              return <circle key={`out-${idx}`} cx={x} cy={y} r="5.5" fill={PALETTE.sage} stroke={PALETTE.ink} strokeWidth="1.5" />;
            })}
            {/* Collective Order Parameter Vector r e^(i psi) */}
            <line x1="200" y1="150" x2="268" y2="102" stroke={PALETTE.vermilion} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="200" cy="150" r="5" fill={PALETTE.ink} />
            <polygon points="274,98 261,100 269,110" fill={PALETTE.vermilion} />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label={`${scenarioId} editorial illustration`}
    >
      <defs>
        <pattern id={`plaid-${uid}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={PALETTE.cream} />
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke={PALETTE.ink} strokeWidth="1" opacity="0.35" />
          <path d="M 8 0 L 8 16 M 0 8 L 16 8" fill="none" stroke={PALETTE.ink} strokeWidth="0.6" opacity="0.2" />
        </pattern>
        <pattern id={`dots-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.2" fill={PALETTE.ink} opacity="0.35" />
        </pattern>
        <pattern id={`hatch-${uid}`} width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="10" stroke={PALETTE.ink} strokeWidth="1.2" opacity="0.3" />
        </pattern>
      </defs>
      {renderArt()}
    </svg>
  );
}
