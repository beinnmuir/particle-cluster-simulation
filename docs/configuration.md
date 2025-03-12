# Key Variables and Parameters

## Simulation Configuration

- `thresholdDistance`: Distance threshold for determining particle interactions
- `attractionCoefficient`: Strength of attractive forces
- `repulsionCoefficient`: Strength of repulsive forces
- `stickyForceCoefficient`: Strength of sticky forces
- `stickyForcePower`: Power law exponent for sticky force calculation
- `repulsionDelay`: Time delay before particles can repulse again

## Particle Properties

- `position`: 2D vector representing particle position
- `velocity`: 2D vector representing particle velocity
- `acceleration`: 2D vector representing particle acceleration
- `mass`: Particle mass, affects force calculations and visual size
- `shouldRepulse`: Boolean flag indicating if particle should repulse
- `inCluster`: Boolean flag indicating if particle is in a cluster
- `clusterSize`: Number of particles in the current cluster
- `clusterCount`: Historical count of how many times particle has been in clusters

## Cluster Tracking

- `particleClusterMap`: Maps particle IDs to cluster indices
- `clusterSizes`: Maps cluster indices to their sizes
- `clusterCenters`: Maps cluster indices to their center positions
- `clusterRepulsionStates`: Maps cluster indices to their repulsion states
- `currentClusters`: Set of current cluster connections
- `previousClusters`: Set of cluster connections from previous frame

## Preset Configurations

### Try Me Settings 1: Optimized for large-scale circular cluster formation
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

### Try Me Settings 2: Optimized for medium-sized clusters with higher attraction
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
