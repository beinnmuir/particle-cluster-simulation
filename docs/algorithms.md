# Core Algorithms and Mechanisms

## Force Calculation System

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

## Cluster Detection Algorithm

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

## Cluster-wide Repulsion Propagation

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

## Rod Particle Rotational Dynamics

Implemented rotational physics for rod-shaped particles to enable more complex and realistic interactions:

1. **RodParticle Class**: Extended the base Particle class with rod-specific properties and behaviors
2. **Moment of Inertia Calculation**: Implemented physics-based moment of inertia calculation for rods
3. **Torque and Force Application**: Added methods to calculate and apply torque when forces are applied off-center
4. **Rotational Dampening**: Implemented consistent dampening for both linear and rotational motion
5. **Selective Interaction Point Model**: Implemented a three-point model that selects the closest point for force interactions

## Visualization Techniques

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
