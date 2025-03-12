# Particle Clustering Simulation - Technical Progress Report

## 1. Project Overview

The Particle Clustering Simulation is a sophisticated JavaScript-based physics simulation that visualizes emergent clustering behaviors of particles. Built with p5.js, the project demonstrates complex particle interactions through force dynamics, cluster formation, and visual representation techniques.

### 1.1 Core Objectives

1. Create a realistic particle simulation with emergent clustering behavior
2. Implement sophisticated force interactions (attraction, repulsion, stickiness)
3. Develop intelligent cluster detection and tracking mechanisms
4. Provide intuitive visual feedback about cluster formation and interactions
5. Implement advanced rendering techniques for cluster visualization
6. Optimize performance for handling large numbers of particles

## 2. Technical Architecture

The project follows a modular architecture with clear separation of concerns:

### 2.1 Core Modules

1. **Particle System**: Handles individual particle properties and behaviors
2. **Force System**: Manages force calculations and interactions between particles
3. **Renderer**: Visualizes particles and their clustering behaviors
4. **Simulation Manager**: Coordinates the overall simulation flow
5. **UI System**: Provides user interface for parameter adjustments

### 2.2 Key Files and Their Purposes

- `js/particle.js`: Defines the Particle class with position, velocity, mass, and clustering properties
- `js/particleFactory.js`: Implements the ParticleFactory class for centralized particle creation and configuration
- `js/force.js`: Implements the ForceSystem class for calculating forces and detecting clusters
- `js/render.js`: Contains the Renderer class for visualizing particles and clusters
- `js/simulation.js`: Manages the overall simulation state and lifecycle
- `js/main.js`: Entry point that initializes the simulation
- `js/ui.js`: Handles user interface elements and interactions

## 3. Core Algorithms and Mechanisms

### 3.1 Force Calculation System

The force system (`ForceSystem` class) is the heart of the simulation, implementing:

1. **Attraction Forces**: Particles attract each other at distances greater than the threshold
   ```javascript
   forceMagnitude = config.attractionCoefficient * (p1.mass * p2.mass) / (distance * distance);
   ```

2. **Sticky Forces**: Additional attractive forces at intermediate distances
   ```javascript
   const stickyForceMagnitude = config.stickyForceCoefficient * 
       (p1.mass * p2.mass) / Math.pow(distance, config.stickyForcePower);
   ```

3. **Repulsion Forces**: Particles repel when too close and after a delay period
   - Between different clusters:
     ```javascript
     forceMagnitude = -config.repulsionCoefficient * (p1.mass * p2.mass) / (distance * distance);
     ```
   - Within the same cluster (radial repulsion):
     ```javascript
     // Calculate radial directions from cluster center
     const p1Direction = p5.Vector.sub(p1.position, clusterCenter).normalize();
     const p2Direction = p5.Vector.sub(p2.position, clusterCenter).normalize();
     
     // Apply outward radial forces
     const radialForceMagnitude = config.repulsionCoefficient * 0.5 * 
         (p1.mass * p2.mass) / (distance * distance);
     ```

### 3.2 Cluster Detection Algorithm

The simulation uses a disjoint-set (union-find) data structure to efficiently identify distinct clusters:

1. Each particle starts in its own set
2. Particles within proximity threshold are unioned into the same set
3. After processing all connections, distinct clusters are identified
4. Cluster properties (size, center) are calculated and tracked

```javascript
// Union function to merge sets
const union = (x, y) => {
    parent[find(x)] = find(y);
};

// Process all connections to build the disjoint sets
for (const connection of this.currentClusters) {
    const [id1, id2] = connection.split('-').map(id => parseInt(id));
    union(id1, id2);
}
```

### 3.3 Cluster-wide Repulsion Propagation

A key mechanism ensures that when any particle in a cluster should repulse, the entire cluster repulses:

1. Track cluster repulsion states in a map
2. Check if any particle in a cluster has `shouldRepulse = true`
3. If so, set all particles in that cluster to repulse
4. Apply radial forces from cluster center to create outward expansion

```javascript
// For each cluster, check if any particle has shouldRepulse = true
for (const [clusterIndex, particleIds] of clusterParticles.entries()) {
    let anyParticleShouldRepulse = false;
    
    // Check if any particle in the cluster should repulse
    for (const id of particleIds) {
        if (id >= 0 && id < particles.length && particles[id].shouldRepulse === true) {
            anyParticleShouldRepulse = true;
            break;
        }
    }
    
    // Store the cluster's repulsion state
    this.clusterRepulsionStates.set(clusterIndex, anyParticleShouldRepulse);
}
```

### 3.4 Visualization Techniques

The renderer implements sophisticated visual techniques:

1. **Cluster History Visualization**: Fill color based on how many times a particle has been in clusters
   ```javascript
   // Map 0-100 to 240-0 (blue to red)
   mainHue = map(particle.clusterCount, 0, maxClusterCount, 240, 0);
   ```

2. **Cluster Size Visualization**: Outer glow color based on current cluster size
   ```javascript
   // Small clusters (2-20% of max): blue to cyan (240-180)
   // Medium clusters (20-50% of max): cyan to yellow (180-60)
   // Large clusters (50-100% of max): yellow to red (60-0)
   ```

3. **Glow Effect**: Visual indicator for particles in clusters
   ```javascript
   // Draw outer glow effect
   noStroke();
   fill(ringHue, 85, 95, 30);
   circle(particle.position.x, particle.position.y, baseSize + (glowPixels * 2));
   ```

## 4. Key Variables and Parameters

### 4.1 Simulation Configuration

- `thresholdDistance`: Distance threshold for determining particle interactions
- `attractionCoefficient`: Strength of attractive forces
- `repulsionCoefficient`: Strength of repulsive forces
- `stickyForceCoefficient`: Strength of sticky forces
- `stickyForcePower`: Power law exponent for sticky force calculation
- `repulsionDelay`: Time delay before particles can repulse again

### 4.2 Particle Properties

- `position`: 2D vector representing particle position
- `velocity`: 2D vector representing particle velocity
- `acceleration`: 2D vector representing particle acceleration
- `mass`: Particle mass, affects force calculations and visual size
- `shouldRepulse`: Boolean flag indicating if particle should repulse
- `inCluster`: Boolean flag indicating if particle is in a cluster
- `clusterSize`: Number of particles in the current cluster
- `clusterCount`: Historical count of how many times particle has been in clusters

### 4.3 Cluster Tracking

- `particleClusterMap`: Maps particle IDs to cluster indices
- `clusterSizes`: Maps cluster indices to their sizes
- `clusterCenters`: Maps cluster indices to their center positions
- `clusterRepulsionStates`: Maps cluster indices to their repulsion states
- `currentClusters`: Set of current cluster connections
- `previousClusters`: Set of cluster connections from previous frame

## 5. Recent Improvements

### 5.1 Cluster-wide Repulsion Mechanism

Previously, repulsion was only applied between individual particle pairs, not propagated across entire clusters. This was fixed by:

1. Adding cluster repulsion state tracking
2. Implementing the `propagateRepulsionInClusters` method
3. Ensuring repulsion state is propagated before applying forces

### 5.2 Radial Force Implementation

To ensure entire clusters expand outward during repulsion:

1. Added cluster center tracking
2. Implemented radial force calculation from cluster centers
3. Applied outward forces to all particles in repulsing clusters

### 5.3 Rendering Improvements

1. Removed outer ring, keeping only the glow effect
2. Implemented fixed pixel sizing for glow
3. Enhanced color mapping for cluster sizes to scale with particle count

### 5.4 Repulsion Mechanism Improvements (March 2025)

Fixed an issue where repulsive forces were only being applied to two particles in a cluster, instead of propagating to all particles. The key changes were:

1. **Force Calculation Timing**: Modified the `applyForces` method in `ForceSystem` class to delay cluster status updates until after all forces have been applied
   ```javascript
   // Previous approach (problematic):
   // Reset cluster status at the beginning of force calculation
   if (typeof particles[i].setInCluster === 'function') {
       particles[i].setInCluster(false);
   }
   
   // New approach:
   // First pass: Calculate and apply all forces without resetting cluster states
   // Second pass: Update cluster states after all forces have been applied
   ```

2. **Particle State Management**: Enhanced the `setInCluster` method in `Particle` class to preserve repulsion state when a particle remains in a cluster
   ```javascript
   // Added state tracking variables
   this.wasInCluster = false;
   this.wasRepulsing = false;
   
   // Modified setInCluster to preserve repulsion state
   setInCluster(status) {
       // Store previous state before making changes
       this.wasInCluster = this.inCluster;
       this.wasRepulsing = this.shouldRepulse;
       
       // Only reset repulsion state when first joining a cluster
       if (status && !this.inCluster) {
           this.inCluster = true;
           this.shouldRepulse = false;
           this.repulsionTimer = 0;
       } else if (status && this.inCluster) {
           // Preserve repulsion state when already in a cluster
           this.inCluster = true;
       } else {
           this.inCluster = false;
       }
   }
   ```

3. **Repulsion State Preservation**: Ensured that `shouldRepulse` is not automatically reset when a particle remains in a cluster, allowing repulsion to propagate through the entire cluster consistently

These changes ensure that when particles in a cluster should repulse, the repulsion is applied uniformly to all particles in that cluster, not just a pair of particles.

### 5.5 Factory Pattern Implementation (March 2025)

Implemented a dedicated particle factory pattern to improve code organization and maintainability:

1. **Centralized Particle Creation**: Created a new `ParticleFactory` class in `js/particleFactory.js` that handles all particle instantiation:
   ```javascript
   class ParticleFactory {
       constructor(config) {
           this.config = config;
           this.particleCount = 0; // Counter for generating unique IDs
       }
       
       createRandomParticle() {
           const x = random(this.config.current.canvasWidth);
           const y = random(this.config.current.canvasHeight);
           const mass = this.config.current.initialMass;
           
           const particle = new Particle(x, y, mass);
           particle.id = this.particleCount++;
           return particle;
       }
   }
   ```

2. **Enhanced Particle Management**:
   - Consistent ID generation and tracking
   - Support for different particle creation strategies
   - Centralized configuration management

3. **Improved Simulation Integration**:
   - Modified `SimulationManager` to use the factory pattern
   - Simplified particle initialization process
   - Better separation of concerns between creation and management

These changes provide a foundation for future extensions such as different particle types or behaviors.

### 5.6 Visualization and UI Improvements (March 2025)

Enhanced the visualization and user interface to improve user experience and visual clarity:

1. **Constant Line Thickness**: Modified the `renderForceVectors` method in the `Renderer` class to use a constant line thickness for connections between particles
   ```javascript
   // Previous approach (variable thickness):
   const weight = map(clusterSize, 2, 20, 0.5, 1.5);
   
   // New approach (constant thickness):
   const weight = 1; // Set a constant line thickness
   ```

2. **Reduced Color Brightness**: Adjusted HSV values for particle fill and glow effects to reduce brightness and improve visual clarity
   ```javascript
   // Previous approach (brighter colors):
   fill(mainHue, 80, 90);
   fill(ringHue, 85, 95, 30);
   
   // New approach (softer colors):
   fill(mainHue, 60, 70);
   fill(ringHue, 70, 80, 30);
   ```

3. **Improved Rendering Order**: Modified the rendering order to ensure connecting lines are visible on top of particles
   ```javascript
   // Previous approach (connections hidden behind particles):
   // Draw connections first, then particles
   
   // New approach (connections visible on top):
   // Draw particles first, then connections
   ```

4. **One-Click Configurations**: Added "Default Settings" and "Try Me" buttons to the UI for quick configuration
   ```javascript
   // Default Settings button
   const defaultBtn = createButton('Default Settings');
   defaultBtn.mousePressed(() => {
       this.resetToDefaultSettings();
       this.simulation.reset();
   });
   
   // Try Me button
   const tryMeBtn = createButton('Try Me');
   tryMeBtn.mousePressed(() => {
       this.setToTryMeSettings();
       this.simulation.reset();
       this.simulation.start();
   });
   ```

5. **Preset Configurations**: Implemented "Try Me" configurations with optimized parameters for interesting clustering behavior

   **Try Me Settings 1**: Optimized for large-scale circular cluster formation
   ```javascript
   const tryMeSettings = {
       particleCount: 400,
       initialMass: 5,
       maxSpeed: 5,
       dampeningCoefficient: 0.03,
       thresholdDistance: 60,
       attractionCoefficient: 0.03,
       repulsionCoefficient: 1,
       stickyForceCoefficient: 1.21,
       repulsionDelay: 120,
       delayIncrease: 30,
       maxRepulsionDelay: 300,
       minMass: 2,
       maxMass: 20,
       massGainRate: 0.003,
       massLossRate: 0.1
   };
   ```
   
   **Try Me Settings 2**: Optimized for medium-sized clusters with higher attraction
   ```javascript
   const tryMeSettings2 = {
       particleCount: 250,
       initialMass: 5,
       maxSpeed: 5,
       dampeningCoefficient: 0.03,
       thresholdDistance: 40,
       attractionCoefficient: 0.54,
       repulsionCoefficient: 0.22,
       stickyForceCoefficient: 1.21,
       repulsionDelay: 120,
       delayIncrease: 30,
       maxRepulsionDelay: 300,
       minMass: 2,
       maxMass: 20,
       massGainRate: 0.001,
       massLossRate: 0.1
   };
   ```

These improvements enhance the visual experience and make the simulation more accessible to users by providing easy access to optimized configurations.

## 6. Current Issues and Challenges

### 6.1 Performance Considerations

With large numbers of particles, the O(n²) force calculation can become a bottleneck. Potential optimizations include:

1. Spatial partitioning (quadtree, grid-based)
2. Parallel processing or web workers
3. Selective force calculation based on distance thresholds

### 6.2 Edge Cases in Cluster Detection

Some edge cases in cluster detection and force calculation may need refinement:

1. Handling of very large clusters (potential instability)
2. Transition between cluster states (formation and dissolution)
3. Boundary conditions and edge effects

### 6.3 Visual Clarity at Scale

As the number of particles increases, visual clarity can become an issue:

1. Overlapping particles in dense clusters
2. Distinguishing between different clusters
3. Representing very small or very large clusters effectively

## 7. Potential Next Steps

### 7.1 Performance Optimization

1. Implement spatial partitioning for force calculations
2. Optimize cluster detection algorithm for large particle counts
3. Add selective rendering based on viewport and importance

### 7.2 Enhanced Cluster Dynamics

1. Implement cluster merging and splitting mechanics
2. Add cluster lifetime tracking and aging effects
3. Develop more sophisticated inter-cluster interaction rules

### 7.3 Advanced Visualization

1. Add cluster boundary visualization
2. Implement heat map or density visualization for clusters
3. Add statistical overlays for cluster metrics

### 7.4 User Experience Improvements

1. Add more interactive controls for simulation parameters
2. Implement save/load functionality for simulation states
3. Add guided scenarios or presets for interesting emergent behaviors

### 7.5 Data Analysis Features

1. Add metrics tracking for cluster formation and dissolution
2. Implement time-series visualization of cluster dynamics
3. Add export functionality for simulation data

## 8. Code Structure and Design Patterns

The codebase follows object-oriented design principles with clear separation of concerns:

1. **Observer Pattern**: For event handling and UI updates
2. **Strategy Pattern**: For different force calculation strategies
3. **Factory Pattern**: For particle creation and configuration
4. **Command Pattern**: For user interactions and parameter changes

## 9. Development Environment

- **Language**: JavaScript (ES6+)
- **Libraries**: p5.js for rendering and vector math
- **Development Platform**: macOS
- **Browser Compatibility**: Modern browsers with HTML5 Canvas support

### 7.6 Rod Particle Implementation

1. Implement rotational dynamics for rod-shaped particles
2. Extend force calculations to handle rod-particle interactions
3. Develop specialized visualization for rod orientation and rotation

## 8. Recent Implementations

### 8.1 Rod Particle Rotational Dynamics (March 2025)

Implemented rotational physics for rod-shaped particles to enable more complex and realistic interactions:

1. **RodParticle Class**: Extended the base Particle class with rod-specific properties and behaviors in `js/RodParticle.js`:
   ```javascript
   class RodParticle extends Particle {
       constructor(x, y, length, angle, mass) {
           super(x, y, mass);
           
           // Rod-specific properties
           this.length = length;
           this.angle = angle || 0;
           this.pointA = createVector(0, 0); // One endpoint
           this.pointB = createVector(0, 0); // Other endpoint
           
           // Rotational dynamics properties
           this.angularVelocity = 0;         // Angular velocity in radians per time step
           this.angularAcceleration = 0;     // Angular acceleration in radians per time step squared
           this.momentOfInertia = this.calculateMomentOfInertia();
       }
   }
   ```

2. **Moment of Inertia Calculation**: Implemented physics-based moment of inertia calculation for rods:
   ```javascript
   calculateMomentOfInertia() {
       // For a rod rotating about its center: I = (1/12) * m * L²
       return (1/12) * this.mass * (this.length * this.length);
   }
   ```

3. **Torque and Force Application**: Added methods to calculate and apply torque when forces are applied off-center:
   ```javascript
   applyForceAtPoint(force, applicationPoint) {
       // Apply linear force (affects center of mass)
       this.applyForce(force);
       
       // Calculate torque: τ = r × F
       const r = p5.Vector.sub(applicationPoint, this.position);
       const torque = r.x * force.y - r.y * force.x;
       
       this.applyTorque(torque);
   }
   ```

4. **Rotational Dampening**: Implemented consistent dampening for both linear and rotational motion:
   ```javascript
   // Apply rotational dampening (similar to linear dampening)
   if (config.dampeningCoefficient > 0) {
       // τ_dampening = -c * ω
       const dampeningTorque = -config.dampeningCoefficient * this.angularVelocity;
       this.applyTorque(dampeningTorque);
   }
   ```

5. **Selective Interaction Point Model**: Implemented a three-point model that selects the closest point for force interactions:
   ```javascript
   getInteractionPoint(targetPosition) {
       const distToA = p5.Vector.dist(targetPosition, this.pointA);
       const distToCenter = p5.Vector.dist(targetPosition, this.position);
       const distToB = p5.Vector.dist(targetPosition, this.pointB);
       
       if (distToA <= distToCenter && distToA <= distToB) {
           return this.pointA.copy();
       } else if (distToB <= distToCenter && distToB <= distToA) {
           return this.pointB.copy();
       }
       return this.position.copy();
   }
   ```

6. **Visual Representation**: Enhanced the display method to render rods with proper orientation:
   ```javascript
   display() {
       // Set color based on cluster properties
       // ...
       
       // Draw the rod as a rectangle
       push();
       translate(this.position.x, this.position.y);
       rotate(this.angle);
       rectMode(CENTER);
       rect(0, 0, this.length, this.mass * 0.8);
       pop();
   }
   ```

These enhancements enable the simulation to model rod-shaped particles with realistic rotational physics, including torque-induced rotation when forces are applied off-center. The implementation maintains consistency with the existing physics model by using the same dampening coefficient for both linear and rotational motion.

### 8.2 Force System Integration for Rod Particles (March 2025)

Modified the ForceSystem class to properly handle interactions involving rod particles:

1. **Interaction Point Detection**: Enhanced the force calculation to use the appropriate interaction points:
   ```javascript
   // Check if either particle is a RodParticle and get the appropriate interaction point
   const isP1Rod = p1.constructor.name === 'RodParticle';
   const isP2Rod = p2.constructor.name === 'RodParticle';
   
   if (isP1Rod) {
       p1InteractionPoint = p1.getInteractionPoint(p2.position);
   }
   
   if (isP2Rod) {
       p2InteractionPoint = p2.getInteractionPoint(p1.position);
   }
   ```

2. **Force Application at Interaction Points**: Modified force application to use the `applyForceAtPoint` method for rod particles:
   ```javascript
   // For rod particles, apply force at the interaction point to generate torque
   // For regular particles, apply force at the center
   if (isP1Rod) {
       p1.applyForceAtPoint(finalForce, p1InteractionPoint);
   } else {
       p1.applyForce(finalForce);
   }
   ```

3. **Cluster Repulsion Handling**: Updated the cluster repulsion mechanism to work with rod particles:
   ```javascript
   // For regular particles, apply force to center
   // For rod particles, apply force at the interaction point
   if (isP1Rod) {
       const radialForce = p5.Vector.mult(p1Direction, radialForceMagnitude);
       p1.applyForceAtPoint(radialForce, p1InteractionPoint);
   } else {
       p1.applyForce(p5.Vector.mult(p1Direction, radialForceMagnitude));
   }
   ```

These modifications ensure that forces between particles are calculated and applied in a physically accurate manner, taking into account the rod geometry and generating appropriate torque when forces are applied off-center.

### 8.3 Project Management Improvements (March 2025)

Implemented a structured approach to tracking development tasks and technical debt:

1. **TODO File**: Created a dedicated `TODO.md` file to track items that need further investigation or improvement:
   ```markdown

### 8.4 UI and Rendering Improvements (March 2025)

Enhanced the user interface and rendering system to improve usability and fix issues with circular particle rendering:

1. **UI Control Improvements**: Replaced dropdown menus with buttons for more reliable particle type selection:
   ```javascript
   // Previous approach (dropdown menu):
   this.typeSelect = createSelect();
   this.typeSelect.option('rod');
   this.typeSelect.option('circular');
   this.typeSelect.option('mixed');
   this.typeSelect.changed(() => {
       this.config.current.particleType = this.typeSelect.value();
       this.simulation.reset();
   });
   
   // New approach (buttons):
   const rodButton = createButton('Rod');
   rodButton.mousePressed(() => {
       this.config.current.particleType = 'rod';
       this.simulation.reset();
   });
   
   const circularButton = createButton('Circular');
   circularButton.mousePressed(() => {
       this.config.current.particleType = 'circular';
       this.simulation.reset();
   });
   
   const mixedButton = createButton('Mixed');
   mixedButton.mousePressed(() => {
       this.config.current.particleType = 'mixed';
       this.simulation.reset();
   });
   ```

2. **Particle Type Detection**: Enhanced the particle type detection in the renderer to use both `instanceof` and property checking for more reliable identification:
   ```javascript
   // Previous approach (property checking only):
   if (particle.hasOwnProperty('angle') && particle.hasOwnProperty('length') && 
       particle.hasOwnProperty('pointA') && particle.hasOwnProperty('pointB')) {
       this.renderRodParticle(particle, mainHue, ringHue);
   } else {
       this.renderCircularParticle(particle, mainHue, ringHue);
   }
   
   // New approach (instanceof and property checking):
   if (particle instanceof RodParticle || 
       (particle.hasOwnProperty('angle') && particle.hasOwnProperty('length') && 
        particle.hasOwnProperty('pointA') && particle.hasOwnProperty('pointB'))) {
       this.renderRodParticle(particle, mainHue, ringHue);
   } else {
       this.renderCircularParticle(particle, mainHue, ringHue);
   }
   ```

3. **Debug Logging**: Added extensive debug logging throughout the simulation and rendering processes to track particle creation and rendering:
   ```javascript
   // In ParticleFactory.createRandomParticle:
   console.log(`Creating ${type} particle at (${x}, ${y}) with mass ${mass}`);
   
   // In Renderer.renderParticle:
   console.log('Detected ROD particle, rendering with renderRodParticle');
   console.log('Detected CIRCULAR particle, rendering with renderCircularParticle');
   
   // In SimulationManager.initialize:
   console.log(`Initializing simulation with particle type: ${options.type}`);
   console.log(`Created ${this.particles.length} particles`);
   ```

4. **Default Configuration**: Changed the default particle type in the configuration from 'rod' to 'circular' to ensure circular particles appear by default:
   ```javascript
   // Previous default configuration:
   particleType: 'rod',
   
   // New default configuration:
   particleType: 'circular',
   ```

These improvements ensure that circular particles are correctly created and rendered when selected, providing a more reliable and consistent user experience. The combination of UI enhancements, improved type detection, and comprehensive logging makes the system more robust and easier to debug.

### 8.5 Project Management Improvements (March 2025)

Implemented a structured approach to tracking development tasks and technical debt:

1. **TODO File**: Created a dedicated `TODO.md` file to track items that need further investigation or improvement:
   ```markdown
   # Particle Clustering Simulation - TODO List

   This file tracks important items that need to be checked, investigated, 
   or implemented in the future.

   ## Interaction Points and Force Application

   1. **Interaction Point Detection**
      - Explore how interaction point detection is working for rod particles
      - Verify consistency across different scenarios (rod-particle, rod-rod)
   ```

2. **Key Areas for Investigation**:
   - Interaction point detection consistency across different scenarios
   - Cluster interaction point calculation for rod particles
   - Sticky force implementation and necessity

This structured approach to tracking technical tasks helps ensure that important implementation details are properly verified and optimized as the project evolves.

## 9. Code Structure and Design Patterns

The codebase follows object-oriented design principles with clear separation of concerns:

1. **Observer Pattern**: For event handling and UI updates
2. **Strategy Pattern**: For different force calculation strategies
3. **Factory Pattern**: For particle creation and configuration
4. **Command Pattern**: For user interactions and parameter changes
5. **Inheritance Pattern**: For extending particle behaviors (e.g., RodParticle extends Particle)

## 10. Development Environment

- **Language**: JavaScript (ES6+)
- **Libraries**: p5.js for rendering and vector math
- **Development Platform**: macOS
- **Browser Compatibility**: Modern browsers with HTML5 Canvas support

## 11. Conclusion

The Particle Clustering Simulation project demonstrates sophisticated particle dynamics with emergent clustering behaviors. Recent improvements to cluster-wide repulsion, visualization, and the addition of rod-shaped particles with rotational dynamics have enhanced the simulation's realism and interpretability. Future work will focus on performance optimization, enhanced cluster dynamics, advanced visualization techniques, and further refinement of rod-particle interactions.
