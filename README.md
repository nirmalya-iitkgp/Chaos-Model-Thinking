# Chaos model Thinking 🌀
An interactive complex systems simulator for non-linear dynamics, cellular automata, emergence, bifurcation theory, and positive/negative feedback loops.

**Chaos model Thinking** is an educational, visual web sandbox designed to explore non-linear system dynamics. It allows users to study how small perturbations, local rules, feedback amplification, threshold limits, and cascade triggers shape macro outcomes across cellular automata, network science, game theory, urban sorting, swarm intelligence, percolation physics, economics, and environmental cycles.

---

## 🎨 Visual Identity & App Logo
- **Shortcut Symbol/Favicon**: Branded `image/png` icon (`/public/logo.png`) representing abstract interconnected systems, bifurcations, and feedback loops.
- **Branded Interface**: Displayed in the header pane of both desktop and mobile layouts alongside responsive domain navigation rails.

---

## 🌟 Foundational Emergent Complex Systems Models

### 1. Conway’s Game of Life & Langton’s Ant 👾
* **Visual Mechanics**: Infinite 2D grid cellular automaton rendered on interactive HTML5 Canvas.
* **Interactivity**:
  - Draw pixel patterns directly onto the lattice by clicking or dragging.
  - One-click presets: *Gosper Glider Gun*, *Pulsar Oscillator*, *Spaceship (LWSS)*, *Acorn Methuselah*, and *Random Soup*.
  - Rule modes: Conway Standard ($B3/S23$), HighLife Replicator ($B36/S23$), and **Langton’s Ant** (2-state Turing automaton).
* **Why it works**: The benchmark for emergent complexity—deterministic 2-state micro-rules give birth to gliders, logic gates, self-replicators, and the emergent 104-step diagonal highway of Langton’s Ant from pure chaotic noise.

### 2. Preferential Attachment (Barabási–Albert Network Graph) 🕸️
* **Visual Mechanics**: Real-time force-directed spring graph paired with an live log-log degree distribution histogram.
* **Interactivity**:
  - Adjust Attachment Bias ($\alpha$ power exponent):
    - $\alpha = 0$: Uniform random attachment (Erdős–Rényi Poisson bell curve, no super-hubs).
    - $\alpha = 1.0$: Standard Barabási–Albert scale-free network ($P(k) \sim k^{-3}$ power law).
    - $\alpha > 1.2$: Monopolistic "Winner-Takes-All" star network where one colossal node swallows all incoming edges.
  - Buttons for *Add 1 Node*, *Add 5 Nodes*, *Auto-Grow*, and *Reset*. Node hover reveals degree centrality.
* **Why it works**: Visually demonstrates how linear rich-get-richer feedback produces scale-free topologies, explaining internet hubs, airline routing networks, and platform monopolies.

### 3. Spatial Prisoner’s Dilemma & Evolution of Trust 🤝
* **Visual Mechanics**: Color-coded 2D spatial grid where 5 competing strategies play repeated Prisoner's Dilemma against 8 Moore neighbors and adopt the winning strategy in their neighborhood.
* **Strategies Included**:
  - 🟦 **Tit-for-Tat** (Cooperate first, copy neighbor's previous move)
  - 🟥 **Always Defect (Hawk / Cheater)** (Exploits naive altruists)
  - 🟩 **Always Cooperate (Dove)** (Benevolent cooperator)
  - 🟨 **Grudger / Grim Trigger** (Cooperates until betrayed once, then permanent defection)
  - 🟪 **Pavlov / Win-Stay-Lose-Shift** (Repeats choice if rewarded, switches if exploited)
* **Interactivity**:
  - Sliders for Temptation payoff ($T$), Noise/Miscommunication %, and Strategy Mutation %.
  - Interactive paintbrush to inject strategies directly into the canvas.
  - Presets: *Cooperator Island in Sea of Defectors*, *Defector Invasion*, and *Random Mix*.
* **Why it works**: Proves Nowak & May’s spatial reciprocity theorem: in a well-mixed soup, defectors always win; but in spatial geometry, cooperators form protective clusters that insulate themselves and out-earn predatory defectors at boundaries.

### 4. Schelling’s Segregation Model 🏘️
* **Visual Mechanics**: 2D grid of Red residents (Group A), Blue residents (Group B), and vacant houses.
* **Interactivity**:
  - Similarity Preference Threshold ($T\%$): Minimum % of same-color neighbors required for resident happiness.
  - Neighborhood Vacancy Rate % and Demographic Split % sliders.
  - *Auto-Relocate* and *Step Relocate* buttons. Click any house to inspect neighborhood demographics.
* **Why it works**: Demonstrates the famous Schelling paradox (Nobel Prize 2005): even when individuals are highly tolerant and perfectly happy being in a minority (only requiring 30% similar neighbors), uncoordinated individual relocations inevitably cascade into extreme systemic segregation ($>75\%$).

### 5. Boids Flocking (Reynolds’ Swarm Intelligence) 🦅
* **Visual Mechanics**: Particle vectors (boids) moving smoothly across a 2D physics canvas at 60 FPS with toroidal wrapping.
* **Interactivity**:
  - Sliders for Separation weight, Alignment weight, and Cohesion weight.
  - *Spawn Apex Predator (Hawk)* toggle: Watch boids scatter in panic (flash expansion) and dynamically fold behind the predator.
  - Click canvas to drop a Food Attractor that the swarm swirls and vortices around.
* **Why it works**: Demonstrates how biological flocking, schooling, and murmuration emerge naturally from 3 local steering rules without any central leader or global coordination.

### 6. Forest Fire & Percolation Threshold 🔥
* **Visual Mechanics**: 2D lattice of green trees where fire spreads cell-by-cell and burns out to ash.
* **Interactivity**:
  - Tree Density slider ($p \in [35\%, 85\%]$) with marked critical threshold at $p_c \approx 59.27\%$.
  - Wind velocity and direction multiplier.
  - *Strike Lightning* button or click on any tree to ignite manually.
* **Why it works**: Visually proves statistical physics percolation and non-linear phase transitions: at 55% density, fire is contained in local clusters; cross into 60%, and an infinite spanning cluster enables the fire to percolate completely across the forest.

### 7. Sugarscape & Wealth Distribution (Epstein & Axtell) 🌾
* **Visual Mechanics**: 2D terrain map featuring two Sugar Mountains with agents foraging based on vision radius and metabolic consumption.
* **Interactivity**:
  - Sliders for Sugar Regrowth Rate, Agent Vision Range, and Metabolic Consumption Pressure.
  - Real-time Lorenz Curve & Gini Coefficient display alongside a Pareto Wealth Histogram.
* **Why it works**: Proves how identical initial opportunities naturally resolve into an extreme Pareto wealth inequality distribution ($Gini > 0.65$) through simple resource harvesting mechanics and biological variance.

### 8. Gray-Scott Reaction-Diffusion Model 🧪
* **Visual Mechanics**: High-performance 2D lattice simulating the diffusion and reaction of two chemical morphogens ($U$ and $V$) governed by Pearson’s partial differential equations:
  $$\frac{\partial U}{\partial t} = D_u \nabla^2 U - U V^2 + F(1 - U)$$
  $$\frac{\partial V}{\partial t} = D_v \nabla^2 V + U V^2 - (F + K) V$$
* **Interactivity**:
  - Sliders for Feed Rate ($F$), Kill Rate ($K$), and Diffusion Ratio ($D_u / D_v$).
  - One-click morphological presets: *Spot Mitosis*, *Soliton Waves*, *Coral Reef & Labyrinths*, and *Spiral Chaos*.
  - Direct canvas click to inject high concentrations of morphogen $V$ and seed new spot divisions.
* **Why it works**: Alan Turing's 1952 Morphogenesis theory visualized: local autocatalytic activation combined with long-range lateral inhibition generates leopards' spots, zebrafish stripes, and living cellular patterns without genetic blueprints.

### 9. Slime Mold Network Optimization (Physarum Polycephalum) 🧫
* **Visual Mechanics**: Multi-agent simulation of autonomous amoeboid foraging particles with chemotaxis sensors navigating a 2D substrate.
* **Interactivity**:
  - Sliders for Pheromone Evaporation / Decay Rate %, Sensory Aperture Angle ($15^\circ - 60^\circ$), and Particle Count.
  - Interactive canvas: click anywhere to place new nutrient/food sources.
  - Realistic Presets: *Tokyo Rail Network* (reproducing the iconic 2010 Science paper benchmark), *Triangle Steiner Tree*, and *Pentagon Web*.
  - Real-time metrics for Transport Routing Efficiency, Fault-Tolerant Loops, and Active Biomass Vein Density.
* **Why it works**: Demonstrates decentralized biological computing: Physarum solves NP-hard geometric Steiner network problems. Feedback between protoplasmic flux and tube diameter naturally prunes redundant loops to balance cost, distance, and fault tolerance.

### 10. Ant Colony Optimization (ACO & Stigmergy) 🐜
* **Visual Mechanics**: Multi-agent ant colony simulation traversing between nest and food nodes with obstacle mazes and dynamic pheromone evaporation.
* **Interactivity**:
  - Sliders for Trail Evaporation Rate ($\rho$), Pheromone Sensitivity ($\alpha$), and Forager Population.
  - Interactive Paint Tools: *Draw Obstacle Wall*, *Erase Wall*, and *Drop Food Cache*.
  - Maze Presets: *Symmetric Short vs. Long Path Dilemma*, *Central Wall Barrier*, and *Double Slit Maze*.
* **Why it works**: Discovered by Marco Dorigo: ants deposit evaporation-prone pheromones on return trips. Shorter paths take less transit time, allowing round-trip ants to refresh trails before evaporation takes effect. Positive feedback rapidly concentrates the colony onto the global optimum.

### 11. Watts–Strogatz Small-World Network 🌐
* **Visual Mechanics**: Circular ring lattice ($N$ nodes, $k$ nearest neighbors) with dynamic edge rewiring with probability $p \in [0, 1]$.
* **Interactivity**:
  - Sliders for Rewiring Probability ($p$), Node Count ($N$), and Nearest Neighbors ($k$).
  - Interactive Phase Diagram plotting normalized Path Length $L(p)/L(0)$ vs. Clustering $C(p)/C(0)$.
  - Node hover inspects degree centrality and geodesic distances.
  - Quick presets: *Regular Ring Lattice ($p=0$)*, *Small-World Regime ($p=0.05$)*, and *Random Graph ($p=1.0$)*.
* **Why it works**: Steven Strogatz & Duncan Watts (Nature 1998): rewiring just $1-5\%$ of regular lattice edges creates long-range shortcuts that collapse average path length exponentially while preserving high local clustering—explaining "Six Degrees of Separation" in human society, neural networks, and viral contagions.

### 12. Kuramoto Synchronized Oscillators ⏱️
* **Visual Mechanics**: Dual synchronized visualization:
  1. **Complex Unit Circle**: Real-time phase angles $\theta_i$ on the circle with the rotating collective order parameter vector $r e^{i \psi}$.
  2. **Synchronous 2D Flashing Grid**: Visualizing firefly synchrony, where cell luminescence peaks as oscillators hit phase $\theta = 0$.
* **Interactivity**:
  - Sliders for Coupling Strength ($K$), Natural Frequency Dispersion ($\sigma$), and Oscillator Population ($N$).
  - *Scramble Phases* perturbation button to inject noise and watch spontaneous re-synchronization.
  - Regimes: *Zero Coupling*, *Subcritical Drift ($K < K_c$)*, *Phase Locking ($K \ge K_c$)*, and *Lockstep Synchrony*.
* **Why it works**: Yoshiki Kuramoto’s 1975 non-linear differential equations:
  $$\frac{d\theta_i}{dt} = \omega_i + \frac{K}{N} \sum_{j=1}^{N} \sin(\theta_j - \theta_i)$$
  Proves that collective order emerges spontaneously across independent pacemakers (cardiac cells, flashing Malaysian fireflies, power grid generators) once coupling surpasses critical threshold $K_c = 2\sigma$.

---

## 🏛️ Additional Real-World Domain Scenarios (10 Scenarios)

1. **Market Speculation Panic** (Economics): Trader sentiment gauge, circuit breaker halts, and panic cascades.
2. **Supply Chain Bullwhip Effect** (Economics): Multi-tier variance amplification from Retailer to Factory.
3. **Runaway Climate Feedback** (Environment): Arctic ice albedo collapse and permafrost methane runaway heating.
4. **Predator-Prey Dynamics** (Environment): Lotka-Volterra phase-space cycles and culling bifurcations.
5. **Phantom Traffic Waves** (Urban): Non-linear shockwaves and stop-and-go jams from minor braking delays.
6. **Cascading Grid Failure** (Urban): Thermal capacity limits, redundant line routing, and cascading substation blackouts.
7. **Epidemic Pathogen Outbreak** (Public Health): SIR/SEIR models, superspreader hubs, and $R_0$ suppression.
8. **Vaccination Threshold** (Public Health): Herd immunity tipping points and pathogen reproduction limits.
9. **Algorithmic Disinformation Cascade** (Social): Outrage echo chambers and algorithmic recommendation amplification.
10. **Viral Cultural Tipping Point** (Social): Centola 25% minority commitment threshold and social bandwagon dynamics.

---

## 🧭 Hero Catalog & Simulation Workspace UX

The application is structured into two focused navigation modes designed under strict, restrained aesthetic principles:
- **Hero Models Hub (`viewMode === 'catalog'`)**: A fast, scannable simulation directory showcasing all 22 models. Stripped of non-priority text and filler paragraphs, displaying only the simulation name, domain, core mechanism, control count, and direct launch action.
- **Full-Width Simulation Workspace (`viewMode === 'simulation'`)**: Maximizes interactive canvas space. Features a compact title bar, lean slider controls with immediate value feedback (no redundant description paragraphs), concise metric cards, and a one-line real-time status bar.

### 📐 Design Constitution & Principles
- **Restrained Color Palette**: Banned neon gradients, fluorescent halos, and multi-color fades. Built on deep matte zinc/slate tones (`bg-zinc-950`, `border-zinc-800`) with solid single-hue accents.
- **Minimal Text & Concrete Prose**: Deleted all non-priority informational text, instructional paragraphs, and filler copy.
- **Zero Floating Badges**: Eliminated empty pill capsules and all-caps eyebrow headers.
- **High-Density Usability**: Direct access to sliders, interactive physics canvases, and metrics without scrolling past text walls.

---

## 🛡️ Security, Robustness & Red-Pill / Blue-Pill Stress Testing

- **Zero AI / External Dependency in Core Loop**: Fully self-contained, deterministic computational mathematics engine with zero runtime telemetry or unconfirmed LLM calls.
- **Boundary & Extremes Validation**: Every scenario includes automated unit tests verifying that zero, negative, and extreme parameter values never cause crashes, divide-by-zero, `NaN`, or infinite loops.
- **Resilient State Multipliers**: Mathematical safeguards with clamped parameters ($Math.max / Math.min$) and fallback thresholds across all 22 scenarios.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The server will run on `http://localhost:3000`.

### 3. Run Unit Tests
```bash
npm run test
```
Executes the comprehensive Vitest unit test suite covering mathematical models, state transitions, and security boundaries.

### 4. Build for Production
```bash
npm run build
```
Generates production-ready static assets in the `dist/` directory.
