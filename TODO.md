# Particle Clustering Simulation - TODO List

This file tracks important items that need to be checked, investigated, or implemented in the future.

## Interaction Points and Force Application

1. **Interaction Point Detection**
   - Explore how interaction point detection is working for rod particles
   - Verify consistency across different scenarios (rod-particle, rod-rod)
   - Consider edge cases where interaction points might jump between endpoints and center

2. **Cluster Interaction Points**
   - Investigate how interaction points are calculated for cluster repulsion
   - Ensure cluster centers properly account for rod particles' orientations
   - Verify that radial forces from cluster centers are applied correctly to rod endpoints

3. **Sticky Force Implementation**
   - Check that the sticky force is being implemented correctly
   - Verify it behaves as expected for both regular particles and rod particles
   - Determine if sticky forces are actually needed or if they can be simplified
   - Evaluate if sticky forces should be applied differently for rod-rod interactions

## Future Enhancements

*Additional items will be added here as needed.*
