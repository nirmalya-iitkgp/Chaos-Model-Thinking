/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ModelIllustrationProps {
  scenarioId: string;
  className?: string;
}

const ECLIPSE = {
  void: '#0F0E47',
  base: '#272757',
  mid: '#505081',
  mist: '#8686AC',
  soft: '#C5C5DF',
  white: '#F4F4FA',
};

export default function ModelIllustration({ scenarioId, className = 'w-full h-full' }: ModelIllustrationProps) {
  const renderArt = () => {
    switch (scenarioId) {
      case 'market-panic':
        return (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Soft orbital halo */}
            <circle cx="245" cy="120" r="78" fill={ECLIPSE.base} opacity="0.65" />
            <path d="M 20 225 C 75 220, 110 175, 145 188 C 175 198, 215 80, 245 68 C 268 58, 265 215, 298 228 C 325 238, 355 205, 382 248" stroke={ECLIPSE.white} strokeWidth="2.2" />
            <path d="M 20 238 C 80 232, 115 190, 148 202 C 180 212, 215 95, 242 84 C 266 74, 270 225, 305 236 C 335 245, 360 222, 385 260" stroke={ECLIPSE.mist} strokeWidth="1.2" opacity="0.7" />
            {/* Flowing speculative feedback swirl */}
            <path d="M 110 105 C 145 45, 225 45, 245 88 C 265 130, 195 160, 175 125 C 160 98, 192 80, 212 96" stroke={ECLIPSE.soft} strokeWidth="1.6" className="flow-line" />
            <circle cx="245" cy="68" r="5" fill={ECLIPSE.white} />
            <circle cx="298" cy="228" r="4" fill={ECLIPSE.mist} />
          </g>
        );

      case 'bullwhip-effect':
        return (
          <g fill="none" strokeLinecap="round">
            <ellipse cx="290" cy="150" rx="85" ry="95" fill={ECLIPSE.base} opacity="0.5" />
            {/* Continuous amplifying sine wave ribbons */}
            <path d="M 20 150 C 45 144, 65 156, 90 150 C 118 134, 140 168, 172 150 C 205 104, 232 198, 268 150 C 304 42, 336 258, 382 150" stroke={ECLIPSE.white} strokeWidth="2.2" />
            <path d="M 20 150 C 45 156, 65 144, 90 150 C 118 166, 140 132, 172 150 C 205 196, 232 102, 268 150 C 304 258, 336 42, 382 150" stroke={ECLIPSE.mist} strokeWidth="1.4" className="flow-line" />
            <path d="M 20 150 C 50 147, 75 153, 105 150 C 140 120, 170 182, 210 150 C 250 75, 285 225, 340 150" stroke={ECLIPSE.mid} strokeWidth="1.2" />
            {/* Fluid supply nodes */}
            <circle cx="90" cy="150" r="4" fill={ECLIPSE.mist} />
            <circle cx="172" cy="150" r="5" fill={ECLIPSE.soft} />
            <circle cx="268" cy="150" r="6" fill={ECLIPSE.white} />
          </g>
        );

      case 'climate-tipping':
        return (
          <g fill="none" strokeLinecap="round">
            <path d="M 25 220 C 115 205, 195 235, 295 200 C 335 186, 365 198, 385 190 L 385 275 L 25 275 Z" fill={ECLIPSE.base} opacity="0.7" />
            {/* Flowing thermal currents & feedback spiral */}
            <path d="M 30 92 C 110 92, 175 68, 195 112 C 215 154, 140 185, 130 142 C 122 108, 220 82, 295 104 C 338 116, 355 155, 375 140" stroke={ECLIPSE.white} strokeWidth="2.2" />
            <path d="M 40 112 C 118 112, 165 92, 182 125 C 198 156, 152 175, 146 146" stroke={ECLIPSE.mist} strokeWidth="1.3" className="flow-line" />
            <path d="M 35 208 C 120 190, 190 220, 290 184 C 330 170, 360 184, 382 175" stroke={ECLIPSE.soft} strokeWidth="1.6" />
            <circle cx="288" cy="78" r="24" stroke={ECLIPSE.mist} strokeWidth="1.5" />
            <circle cx="288" cy="78" r="36" stroke={ECLIPSE.mid} strokeWidth="1" strokeDasharray="4 6" />
          </g>
        );

      case 'predator-prey':
        return (
          <g fill="none" strokeLinecap="round">
            <ellipse cx="200" cy="150" rx="130" ry="80" transform="rotate(-14 200 150)" fill={ECLIPSE.base} opacity="0.45" />
            {/* Continuous Lotka-Volterra phase-space spiral */}
            <path
              d="M 200 150 C 220 135, 245 155, 225 178 C 195 208, 140 175, 155 128 C 175 72, 275 85, 280 155 C 285 225, 150 245, 110 170 C 70 95, 190 35, 285 75 C 350 105, 345 215, 260 250"
              stroke={ECLIPSE.white}
              strokeWidth="2"
            />
            <path
              d="M 195 148 C 215 118, 265 135, 250 178 C 230 225, 125 205, 125 135 C 125 65, 260 55, 305 135"
              stroke={ECLIPSE.mist}
              strokeWidth="1.4"
              className="flow-line"
            />
            <circle cx="200" cy="150" r="4" fill={ECLIPSE.white} />
            <circle cx="285" cy="75" r="5" fill={ECLIPSE.soft} />
          </g>
        );

      case 'phantom-traffic':
        return (
          <g fill="none" strokeLinecap="round">
            <circle cx="200" cy="150" r="102" fill={ECLIPSE.base} opacity="0.35" />
            {/* Flowing concentric ring trajectories */}
            <circle cx="200" cy="150" r="98" stroke={ECLIPSE.mid} strokeWidth="1.2" />
            <circle cx="200" cy="150" r="84" stroke={ECLIPSE.mist} strokeWidth="1.5" className="flow-line" />
            <circle cx="200" cy="150" r="70" stroke={ECLIPSE.mid} strokeWidth="1" strokeDasharray="3 6" />
            {/* Shockwave compression ribbons */}
            <path d="M 284 98 C 304 128, 304 172, 284 202" stroke={ECLIPSE.white} strokeWidth="3.2" />
            <path d="M 272 106 C 288 132, 288 168, 272 194" stroke={ECLIPSE.soft} strokeWidth="2" />
            <path d="M 110 102 C 92 132, 92 168, 110 198" stroke={ECLIPSE.mist} strokeWidth="1.5" />
          </g>
        );

      case 'power-grid':
        return (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Flowing harmonic power transmission curves */}
            <path d="M 25 150 C 90 90, 140 210, 200 150 C 260 90, 310 210, 375 150" stroke={ECLIPSE.mid} strokeWidth="1.5" />
            <path d="M 25 150 C 95 55, 165 245, 240 120 C 285 45, 325 180, 375 130" stroke={ECLIPSE.white} strokeWidth="2" />
            <path d="M 45 210 C 120 185, 160 95, 225 125 C 280 150, 305 240, 365 205" stroke={ECLIPSE.mist} strokeWidth="1.5" className="flow-line" />
            {/* Delicate node loops */}
            <circle cx="115" cy="145" r="14" stroke={ECLIPSE.soft} strokeWidth="1.5" fill={ECLIPSE.base} />
            <circle cx="225" cy="125" r="18" stroke={ECLIPSE.white} strokeWidth="2" fill={ECLIPSE.base} />
            <circle cx="315" cy="175" r="12" stroke={ECLIPSE.mist} strokeWidth="1.5" fill={ECLIPSE.base} />
            <circle cx="225" cy="125" r="5" fill={ECLIPSE.white} />
          </g>
        );

      case 'pandemic-outbreak':
        return (
          <g fill="none" strokeLinecap="round">
            {/* Flowing SIR waves */}
            <path d="M 25 235 C 95 235, 125 58, 175 58 C 225 58, 255 225, 375 235" stroke={ECLIPSE.white} strokeWidth="2.4" />
            <path d="M 25 235 C 110 232, 165 155, 225 155 C 285 155, 315 228, 375 235" stroke={ECLIPSE.mist} strokeWidth="1.8" className="flow-line" />
            <path d="M 25 85 C 105 90, 145 190, 235 215 C 300 232, 345 235, 375 235" stroke={ECLIPSE.mid} strokeWidth="1.5" />
            {/* Organic branching wisps */}
            <path d="M 175 58 C 205 42, 245 45, 275 72" stroke={ECLIPSE.soft} strokeWidth="1.2" />
            <circle cx="175" cy="58" r="5" fill={ECLIPSE.white} />
            <circle cx="225" cy="155" r="4" fill={ECLIPSE.mist} />
          </g>
        );

      case 'vaccination-threshold':
        return (
          <g fill="none" strokeLinecap="round">
            <circle cx="205" cy="150" r="88" fill={ECLIPSE.base} opacity="0.55" />
            {/* Flowing protective wave barrier */}
            <path d="M 185 35 C 225 90, 165 150, 210 205 C 235 235, 215 260, 195 275" stroke={ECLIPSE.white} strokeWidth="2.4" />
            <path d="M 205 35 C 245 90, 185 150, 230 205 C 255 235, 235 260, 215 275" stroke={ECLIPSE.mist} strokeWidth="1.5" />
            {/* Incoming vector smoothly deflected away */}
            <path d="M 35 165 C 95 165, 145 160, 175 135 C 192 120, 155 82, 105 68" stroke={ECLIPSE.soft} strokeWidth="2" className="flow-line" />
            <circle cx="175" cy="135" r="5" fill={ECLIPSE.white} />
            <circle cx="275" cy="115" r="16" stroke={ECLIPSE.mist} strokeWidth="1.3" />
            <circle cx="305" cy="175" r="22" stroke={ECLIPSE.mid} strokeWidth="1.2" />
          </g>
        );

      case 'fake-news':
        return (
          <g fill="none" strokeLinecap="round">
            <circle cx="125" cy="150" r="18" fill={ECLIPSE.base} stroke={ECLIPSE.white} strokeWidth="2" />
            {/* Flowing rippling acoustic/network arcs */}
            <path d="M 155 110 C 185 130, 185 170, 155 190" stroke={ECLIPSE.white} strokeWidth="2" />
            <path d="M 185 85 C 235 120, 235 180, 185 215" stroke={ECLIPSE.soft} strokeWidth="1.8" />
            <path d="M 220 58 C 295 108, 295 192, 220 242" stroke={ECLIPSE.mist} strokeWidth="1.5" className="flow-line" />
            <path d="M 260 38 C 355 95, 355 205, 260 262" stroke={ECLIPSE.mid} strokeWidth="1.3" />
            {/* Secondary echo loops */}
            <path d="M 125 150 C 195 110, 255 90, 325 105" stroke={ECLIPSE.mist} strokeWidth="1.2" />
            <path d="M 125 150 C 200 185, 260 215, 330 190" stroke={ECLIPSE.mist} strokeWidth="1.2" />
            <circle cx="325" cy="105" r="5" fill={ECLIPSE.white} />
            <circle cx="330" cy="190" r="4" fill={ECLIPSE.mist} />
          </g>
        );

      case 'viral-tipping':
        return (
          <g fill="none" strokeLinecap="round">
            <path d="M 35 235 C 125 230, 165 215, 195 145 C 225 75, 265 65, 365 60" stroke={ECLIPSE.white} strokeWidth="2.5" />
            <path d="M 35 245 C 135 240, 180 225, 210 155 C 240 85, 275 75, 365 72" stroke={ECLIPSE.mist} strokeWidth="1.4" className="flow-line" />
            <path d="M 35 225 C 115 220, 150 205, 180 135 C 210 65, 250 55, 365 48" stroke={ECLIPSE.mid} strokeWidth="1.2" />
            {/* Threshold inflection ring */}
            <circle cx="195" cy="145" r="24" fill={ECLIPSE.base} opacity="0.65" stroke={ECLIPSE.mist} strokeWidth="1.5" />
            <circle cx="195" cy="145" r="6" fill={ECLIPSE.white} />
          </g>
        );

      case 'conway-life':
        return (
          <g fill="none" strokeLinecap="round">
            {/* Flowing cellular contour field & glider ribbon */}
            <path d="M 45 95 C 125 55, 185 135, 255 95 C 315 60, 345 120, 365 90" stroke={ECLIPSE.mid} strokeWidth="1.4" />
            <path d="M 35 165 C 105 125, 165 205, 245 160 C 315 120, 335 190, 370 155" stroke={ECLIPSE.mist} strokeWidth="1.6" className="flow-line" />
            <path d="M 55 235 C 135 195, 195 255, 265 215 C 325 180, 345 230, 365 210" stroke={ECLIPSE.mid} strokeWidth="1.4" />
            {/* Organic rounded glider cells & Langton spiral */}
            <circle cx="145" cy="110" r="10" fill={ECLIPSE.base} stroke={ECLIPSE.white} strokeWidth="1.8" />
            <circle cx="172" cy="135" r="10" fill={ECLIPSE.base} stroke={ECLIPSE.white} strokeWidth="1.8" />
            <circle cx="118" cy="160" r="10" fill={ECLIPSE.base} stroke={ECLIPSE.white} strokeWidth="1.8" />
            <circle cx="145" cy="160" r="10" fill={ECLIPSE.base} stroke={ECLIPSE.white} strokeWidth="1.8" />
            <circle cx="172" cy="160" r="10" fill={ECLIPSE.white} />
            {/* Flowing diagonal highway trail */}
            <path d="M 185 170 C 235 205, 265 115, 325 65" stroke={ECLIPSE.white} strokeWidth="2.2" />
          </g>
        );

      case 'preferential-attachment':
        return (
          <g fill="none" strokeLinecap="round">
            <circle cx="185" cy="148" r="56" fill={ECLIPSE.base} opacity="0.6" />
            {/* Curved organic network filaments radiating from central hub */}
            {[
              'M 185 148 C 145 95, 105 70, 62 72',
              'M 185 148 C 175 90, 145 55, 130 35',
              'M 185 148 C 235 95, 285 65, 335 78',
              'M 185 148 C 255 135, 315 155, 355 142',
              'M 185 148 C 245 185, 285 225, 325 245',
              'M 185 148 C 175 205, 145 245, 115 260',
              'M 185 148 C 125 165, 85 195, 52 215',
            ].map((d, i) => (
              <path key={i} d={d} stroke={i % 2 === 0 ? ECLIPSE.soft : ECLIPSE.mist} strokeWidth={i === 2 || i === 4 ? 2 : 1.3} />
            ))}
            <path d="M 62 72 C 120 35, 265 30, 335 78" stroke={ECLIPSE.mid} strokeWidth="1.2" className="flow-line" />
            <circle cx="185" cy="148" r="16" fill={ECLIPSE.mid} stroke={ECLIPSE.white} strokeWidth="2.2" />
            <circle cx="335" cy="78" r="7" fill={ECLIPSE.white} />
            <circle cx="325" cy="245" r="6" fill={ECLIPSE.mist} />
            <circle cx="62" cy="72" r="5" fill={ECLIPSE.mist} />
          </g>
        );

      case 'spatial-prisoners-dilemma':
        return (
          <g fill="none" strokeLinecap="round">
            {/* Intertwining continuous reciprocity ribbons */}
            <path d="M 35 110 C 110 45, 165 185, 225 125 C 285 65, 315 190, 365 135" stroke={ECLIPSE.white} strokeWidth="2.4" />
            <path d="M 35 190 C 110 255, 165 115, 225 175 C 285 235, 315 110, 365 165" stroke={ECLIPSE.mist} strokeWidth="2" className="flow-line" />
            {/* Spatial reciprocity cluster loops */}
            <circle cx="135" cy="150" r="46" fill={ECLIPSE.base} opacity="0.65" stroke={ECLIPSE.soft} strokeWidth="1.5" />
            <circle cx="265" cy="150" r="38" stroke={ECLIPSE.mist} strokeWidth="1.5" strokeDasharray="5 5" />
            <circle cx="135" cy="150" r="6" fill={ECLIPSE.white} />
            <circle cx="265" cy="150" r="5" fill={ECLIPSE.mist} />
          </g>
        );

      case 'schelling-segregation':
        return (
          <g fill="none" strokeLinecap="round">
            <path d="M 195 30 C 165 100, 235 200, 195 270" stroke={ECLIPSE.mid} strokeWidth="1.5" strokeDasharray="4 6" />
            {/* Flowing migration paths sorting into two clusters */}
            <path d="M 295 85 C 235 45, 165 55, 115 95" stroke={ECLIPSE.white} strokeWidth="2" className="flow-line" />
            <path d="M 105 215 C 165 255, 235 245, 285 205" stroke={ECLIPSE.mist} strokeWidth="2" className="flow-line" />
            {/* Cluster A orbits */}
            <circle cx="105" cy="115" r="44" fill={ECLIPSE.base} stroke={ECLIPSE.white} strokeWidth="1.8" />
            <circle cx="105" cy="115" r="24" stroke={ECLIPSE.soft} strokeWidth="1.2" />
            {/* Cluster B orbits */}
            <circle cx="290" cy="190" r="48" fill={ECLIPSE.mid} opacity="0.45" stroke={ECLIPSE.mist} strokeWidth="1.8" />
            <circle cx="290" cy="190" r="26" stroke={ECLIPSE.white} strokeWidth="1.2" />
          </g>
        );

      case 'boids-flocking':
        return (
          <g fill="none" strokeLinecap="round">
            {/* Flowing murmuration stream lines */}
            <path d="M 25 220 C 105 210, 155 125, 235 105 C 295 90, 335 120, 380 85" stroke={ECLIPSE.white} strokeWidth="2.2" />
            <path d="M 35 240 C 115 230, 170 155, 245 130 C 305 110, 340 138, 382 108" stroke={ECLIPSE.soft} strokeWidth="1.6" />
            <path d="M 20 198 C 95 188, 145 105, 225 82 C 285 65, 325 95, 375 65" stroke={ECLIPSE.mist} strokeWidth="1.4" className="flow-line" />
            {/* Minimalist gliding chevrons */}
            {[
              [145, 152, -32],
              [205, 118, -22],
              [255, 102, -12],
              [315, 102, -18],
            ].map(([x, y, ang], i) => (
              <path
                key={i}
                d="M -9 -5 L 8 0 L -9 5"
                transform={`translate(${x}, ${y}) rotate(${ang})`}
                stroke={ECLIPSE.white}
                strokeWidth="2"
              />
            ))}
            {/* Predator vortex */}
            <circle cx="285" cy="210" r="30" fill={ECLIPSE.base} stroke={ECLIPSE.mist} strokeWidth="1.4" strokeDasharray="5 4" />
          </g>
        );

      case 'forest-fire-percolation':
        return (
          <g fill="none" strokeLinecap="round">
            {/* Flowing percolation front contours */}
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M ${80 + i * 42} 35 C ${110 + i * 42} 95, ${55 + i * 42} 185, ${95 + i * 42} 265`}
                stroke={i === 2 ? ECLIPSE.white : i < 2 ? ECLIPSE.mid : ECLIPSE.mist}
                strokeWidth={i === 2 ? 2.6 : 1.4}
                className={i === 2 ? 'flow-line' : ''}
              />
            ))}
            {/* Organic canopy loops */}
            <circle cx="275" cy="110" r="26" fill={ECLIPSE.base} stroke={ECLIPSE.soft} strokeWidth="1.5" />
            <circle cx="315" cy="185" r="32" fill={ECLIPSE.base} stroke={ECLIPSE.mist} strokeWidth="1.5" />
          </g>
        );

      case 'sugarscape':
        return (
          <g fill="none" strokeLinecap="round">
            {/* Flowing topographic mountain contours */}
            <path d="M 55 145 C 55 85, 185 75, 205 135 C 225 195, 55 205, 55 145 Z" fill={ECLIPSE.base} opacity="0.65" stroke={ECLIPSE.mist} strokeWidth="1.4" />
            <path d="M 85 142 C 85 102, 165 98, 178 135 C 190 172, 85 180, 85 142 Z" stroke={ECLIPSE.soft} strokeWidth="1.6" />
            <path d="M 110 140 C 110 120, 148 118, 154 138 C 160 156, 110 160, 110 140 Z" stroke={ECLIPSE.white} strokeWidth="2" />
            {/* Second peak */}
            <path d="M 205 185 C 205 125, 335 120, 345 180 C 355 240, 205 245, 205 185 Z" stroke={ECLIPSE.mist} strokeWidth="1.4" />
            <path d="M 245 182 C 245 152, 305 150, 312 180 C 318 210, 245 215, 245 182 Z" stroke={ECLIPSE.white} strokeWidth="1.8" />
            {/* Lorenz flow arc */}
            <path d="M 45 255 C 185 248, 285 215, 355 48" stroke={ECLIPSE.white} strokeWidth="2" className="flow-line" />
          </g>
        );

      case 'gray-scott':
        return (
          <g fill="none" strokeLinecap="round">
            {/* Continuous flowing Turing morphogenesis contours */}
            <path
              d="M 85 95 C 70 55, 135 45, 152 88 C 168 130, 198 85, 222 65 C 258 38, 305 78, 268 122 C 235 160, 315 168, 338 132 C 365 162, 325 232, 268 215 C 220 202, 228 252, 180 250 C 132 248, 142 195, 100 212 C 60 228, 45 165, 92 142 C 115 130, 96 118, 85 95 Z"
              fill={ECLIPSE.base}
              opacity="0.7"
              stroke={ECLIPSE.white}
              strokeWidth="2.2"
            />
            <path
              d="M 118 128 C 102 98, 152 92, 165 125 C 178 158, 215 120, 240 105 C 268 88, 282 130, 252 155 C 228 175, 275 192, 250 205 C 222 220, 178 188, 150 198 C 122 208, 118 165, 118 128 Z"
              stroke={ECLIPSE.mist}
              strokeWidth="1.5"
              className="flow-line"
            />
            <circle cx="152" cy="145" r="14" stroke={ECLIPSE.soft} strokeWidth="1.5" />
            <circle cx="242" cy="162" r="10" fill={ECLIPSE.white} />
          </g>
        );

      case 'slime-mold':
        return (
          <g fill="none" strokeLinecap="round">
            {/* Flowing protoplasmic Physarum Steiner web */}
            <path d="M 75 95 C 130 120, 165 142, 200 150 C 245 160, 280 120, 325 95" stroke={ECLIPSE.white} strokeWidth="2.6" />
            <path d="M 200 150 C 175 185, 125 205, 85 225" stroke={ECLIPSE.soft} strokeWidth="2.2" />
            <path d="M 200 150 C 225 185, 255 215, 305 230" stroke={ECLIPSE.soft} strokeWidth="2.2" />
            <path d="M 75 95 C 135 65, 255 60, 325 95" stroke={ECLIPSE.mist} strokeWidth="1.4" className="flow-line" />
            <path d="M 75 95 C 62 155, 68 185, 85 225" stroke={ECLIPSE.mid} strokeWidth="1.3" />
            <path d="M 325 95 C 335 160, 325 195, 305 230" stroke={ECLIPSE.mid} strokeWidth="1.3" />
            {/* Nutrient hubs */}
            {[
              [75, 95],
              [325, 95],
              [85, 225],
              [305, 230],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="9" fill={ECLIPSE.base} stroke={ECLIPSE.white} strokeWidth="2" />
            ))}
            <circle cx="200" cy="150" r="6" fill={ECLIPSE.white} />
          </g>
        );

      case 'ant-colony':
        return (
          <g fill="none" strokeLinecap="round">
            {/* Flowing upper optimal vs lower stigmergic paths */}
            <path d="M 65 150 C 135 55, 265 55, 335 150" stroke={ECLIPSE.white} strokeWidth="2.6" />
            <path d="M 65 150 C 135 72, 265 72, 335 150" stroke={ECLIPSE.mist} strokeWidth="1.4" className="flow-line" />
            <path d="M 65 150 C 135 255, 265 255, 335 150" stroke={ECLIPSE.mid} strokeWidth="1.4" strokeDasharray="5 6" />
            {/* Smooth organic obstacle form */}
            <ellipse cx="200" cy="155" rx="34" ry="44" fill={ECLIPSE.base} stroke={ECLIPSE.mist} strokeWidth="1.5" />
            <circle cx="65" cy="150" r="14" fill={ECLIPSE.base} stroke={ECLIPSE.white} strokeWidth="2" />
            <circle cx="335" cy="150" r="14" fill={ECLIPSE.base} stroke={ECLIPSE.soft} strokeWidth="2" />
          </g>
        );

      case 'watts-strogatz':
        return (
          <g fill="none" strokeLinecap="round">
            <circle cx="200" cy="150" r="96" fill={ECLIPSE.base} opacity="0.35" stroke={ECLIPSE.mid} strokeWidth="1.5" />
            <circle cx="200" cy="150" r="96" stroke={ECLIPSE.mist} strokeWidth="1.4" className="flow-line" />
            {/* Flowing curved small-world shortcut chords */}
            <path d="M 296 150 C 235 160, 175 130, 114 106" stroke={ECLIPSE.white} strokeWidth="2.4" />
            <path d="M 200 54 C 215 115, 175 180, 152 234" stroke={ECLIPSE.soft} strokeWidth="2" />
            <path d="M 268 82 C 215 130, 190 175, 132 218" stroke={ECLIPSE.mist} strokeWidth="1.6" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 2 * Math.PI) / 12;
              return (
                <circle
                  key={i}
                  cx={200 + 96 * Math.cos(a)}
                  cy={150 + 96 * Math.sin(a)}
                  r="4.5"
                  fill={i % 3 === 0 ? ECLIPSE.white : ECLIPSE.mist}
                />
              );
            })}
          </g>
        );

      case 'kuramoto-oscillators':
      default:
        return (
          <g fill="none" strokeLinecap="round">
            <circle cx="200" cy="150" r="96" fill={ECLIPSE.base} opacity="0.4" stroke={ECLIPSE.mid} strokeWidth="1.5" />
            <circle cx="200" cy="150" r="64" stroke={ECLIPSE.mid} strokeWidth="1" strokeDasharray="4 6" />
            {/* Flowing phase wave spiraling toward collective vector */}
            <path d="M 105 165 C 115 80, 215 45, 276 94" stroke={ECLIPSE.white} strokeWidth="2.2" />
            <path d="M 215 245 C 280 230, 310 155, 282 104" stroke={ECLIPSE.mist} strokeWidth="1.8" className="flow-line" />
            {/* Synchronized phase beads */}
            {[-25, -14, -3, 8, 19].map((deg, idx) => {
              const rad = ((deg - 35) * Math.PI) / 180;
              return (
                <circle
                  key={idx}
                  cx={200 + 96 * Math.cos(rad)}
                  cy={150 + 96 * Math.sin(rad)}
                  r="5.5"
                  fill={ECLIPSE.white}
                />
              );
            })}
            {/* Order parameter vector */}
            <path d="M 200 150 Q 238 128, 272 98" stroke={ECLIPSE.white} strokeWidth="3" />
            <circle cx="200" cy="150" r="4.5" fill={ECLIPSE.mist} />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label={`${scenarioId} flowing line-art illustration`}
    >
      {renderArt()}
    </svg>
  );
}
