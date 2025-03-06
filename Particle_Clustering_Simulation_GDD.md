# Game Design Document: Particle Clustering Simulation

## 1. Overview

**Title:** Particle Clustering-Repulsion Simulation  
**Platform:** Web-based (using p5.js)  
**Objective:**  
Develop an interactive simulation where particles (circles) attract each other to form clusters. When clusters reach a threshold, the force reverses to repulsion, dispersing the particles. Over time, particles gain mass (displayed as size) when clustered and lose mass when isolated. Additionally, the simulation will track the number of clustering events (reflected in particle color). A future extension introduces particle attributes (tentatively called *affinity*) such that particles with the same attribute attract and those with opposing attributes repel.
**Summary:**
This GDD outlines the foundation for a dynamic particle clustering simulation in p5.js. The project is designed to be modular, allowing real-time parameter tuning and the possibility for future extensions such as attribute-based interactions. With the core mechanics, physics principles, and a scalable architecture in place, this simulation can serve both as an engaging visual tool and a platform for experimenting with complex emergent behaviors.

## 2. Core Simulation Mechanics

### Particle Behavior

- **Properties:**
  - **Position & Velocity:** Standard 2D vectors.
  - **Mass:** Increases gradually when part of a cluster; decreases when isolated. Mass is visually represented by the particle’s size.
  - **Cluster Count:** Tracks the number of times a particle has been part of a cluster; visually mapped to color.
  - **(Future) Affinity/Attribute:** A property (suggested name: *affinity*) that determines interaction:
    - **Same affinity:** Attraction.
    - **Opposing affinity:** Repulsion.  
      *Real-world analog:* In chemistry, “chemical affinity” describes the tendency of molecules to bond with similar substances. Alternatively, you might consider calling it a custom “bonding type” to avoid confusion with electrical charge (since like charges normally repel in electromagnetism).

### Force Mechanics

- **Attractive & Repulsive Forces:**
  - **Threshold Behavior:**  
    A single threshold distance defines when the interaction switches from attraction to repulsion. Initially implemented as a step function with plans for a smoother, gradual transition.
  - **Gradual Transition (Planned Enhancement):**  
    Use interpolation (e.g., linear or sigmoid) around the threshold to create a smooth force transition.
- **Sticky Force:**
  - **Short-Range Attraction:**  
    Introduce a strong attractive “sticky” force that kicks in at very close distances, ensuring that particles strongly bond when nearly colliding.

### Mass and Cluster Dynamics

- **Mass Evolution:**
  - **Gain:** Slowly increase mass when particles remain in clusters.
  - **Loss:** Gradually decrease mass when a particle is isolated.
- **Visual Representation:**
  - **Size:** Directly proportional to mass.
  - **Color:** Encodes the number of clustering events (the “cluster count”).

## 3. Technology Stack

### Primary Framework: p5.js

- **Rendering & Interaction:**  
  p5.js will handle the drawing of particles and interactive elements.
- **UI/Parameter Tuning:**  
  Use p5.dom (or p5.js’s built-in DOM capabilities) for creating sliders, buttons, and other controls to adjust parameters in real time.

### Numerical Methods

- **Integration Methods:**
  - **Euler or Verlet Integration:** For updating particle positions and velocities.  
    These methods are computationally efficient and suitable for handling 100 to 1000 particles.
- **Force Calculation Optimizations:**  
  Consider spatial partitioning (like quad-trees) if performance becomes an issue as particle count increases.

## 4. Software Architecture

### Modular Components

#### A. Particle Module (particle.js)

- **Class:** `Particle`
- **Attributes:**
  - Position, velocity, mass, cluster count, (future) affinity.
- **Methods:**
  - `update()`: Update position and velocity based on applied forces.
  - `applyForce(force)`: Modify velocity based on the force applied.
  - `display()`: Render the particle with size (mass) and color (cluster count).

#### B. Force Module (force.js)

- **Responsibilities:**
  - Calculate pairwise forces between particles.
  - Apply the threshold-based logic:
    ```js
    if (distance > threshold) {
      // Apply attractive force (with potential sticky force if distance is very small)
    } else {
      // Apply repulsive force
    }
    ```
  - Use interpolation around the threshold for gradual transitions (planned enhancement).

#### C. Simulation Manager (simulation.js)

- **Responsibilities:**
  - Manage the simulation loop (time-stepping, initialization, reset).
  - Maintain global parameters (number of particles, threshold values, sticky force coefficient, etc.).
  - Interface with UI controls to update parameters dynamically.

#### D. UI / Controls Module (ui.js)

- **Components:**
  - Parameter sliders for: threshold distance, sticky force coefficient, number of particles, mass gain/loss rates.
  - Buttons for: start, pause, reset simulation.
  - Real-time display of simulation statistics (e.g., average particle mass, cluster count).

#### E. Visualization Module (render.js)

- **Responsibilities:**
  - Render particles, force vectors (optional for debugging), and UI overlays.
  - Ensure that particle size and color accurately represent mass and cluster count.

#### F. Data/Configuration Module (config.js)

- **Responsibilities:**
  - Handle saving and loading simulation states.
  - Manage default configuration settings (particle distribution, initial mass values).

## 5. Mathematical & Physical Principles

### A. Newtonian Mechanics

- **Core Equation:**  
  $$ F = m a $$  
  Update particle velocity and position based on the net force.

### B. Force Equations

- **Attraction/Repulsion Based on Distance:**  
  $$ F_{ij} =
  \begin{cases}
    k_a \frac{m_i m_j}{r^2} \hat{r}, & \text{if } r > r_{\text{thresh}} \\
    -k_r \frac{m_i m_j}{r^2} \hat{r}, & \text{if } r \leq r_{\text{thresh}}
  \end{cases} $$  
  where \( k_a \) and \( k_r \) are scaling constants, \( r \) is the distance, and \( \hat{r} \) is the unit vector.

- **Sticky Force:**  
  $$ F_{\text{sticky}} = k_s \frac{m_i m_j}{r^p} \hat{r}, \quad \text{with } p \gg 2 $$  
  where \( k_s \) is the sticky force coefficient.

### C. Numerical Integration

- **Euler Integration:**  
  Straightforward and computationally light—adequate for a first implementation.
- **Verlet Integration:**  
  Offers improved stability for particle systems, particularly when simulating cohesive forces.

## 6. Future Enhancements

- **Smooth Transition Functions:**  
  Implement functions (e.g., sigmoid or linear interpolation) to gradually change force behavior around the threshold.
- **Attribute-Based Interactions:**  
  Expand the simulation to incorporate particle affinities.
  - **Proposed Name:** *Affinity* or *Bonding Type*
  - **Mechanics:**
    - Particles with matching affinity values attract.
    - Particles with differing affinity values repel.
- **Performance Optimizations:**  
  Explore spatial partitioning (quad-trees) to optimize force calculations.
- **3D Simulation:**  
  Consider extending to 3D using Three.js in the future.

## 7. Implementation Stages

### Stage 1: Proof of Concept

- Implement a basic simulation with:
  - A set number of particles.
  - Attraction-only forces.
  - Simple Euler integration for motion.

### Stage 2: Add Clustering Dynamics

- Introduce mass growth/shrinkage based on clustering.
- Implement threshold-based repulsion.
- Add UI controls for parameter tuning.

### Stage 3: Improve Force Model

- Introduce sticky force.
- Implement smoother transition from attraction to repulsion.

### Stage 4: Performance Enhancements

- Optimize force calculations using spatial partitioning (quad-trees).
- Experiment with Verlet integration.

### Stage 5: Affinity-Based Interactions

- Implement affinity-based attraction/repulsion.
- Add a color-coded visualization for different affinities.

### Stage 6: Advanced Features & UX Improvements

- Introduce logging and real-time data graphs.
- Allow saving and loading of simulation states.
- Add an option for exporting simulation results.