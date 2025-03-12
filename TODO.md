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

## Physics and Movement

1. **Particle Mass Balance**
   - Check relative masses for circles vs rods - circles seem more massive than rods, shown by the fact that rods move around much faster and more readily
   - Consider adjusting mass calculation or force application for different particle types
   - Ensure consistent behavior across particle types with the same mass value

## Visualization Improvements

1. **Connection Line Placement**
   - Investigate whether connection lines between rods and particles should be drawn at the centers or at the relevant rod points (e.g., endpoints)
   - Determine the most physically accurate and visually informative way to represent these connections
   - Consider implementing multiple connection visualization options that can be toggled

2. **Attraction Visualization**
   - Verify that lines currently show when the threshold distance is reached
   - Explore adding visualization of when and where attraction starts/occurs
   - Consider adding visual indicators (e.g., gradients, fading lines) to show attraction strength
   - Implement optional visualization of attraction fields around particles

## Future Enhancements

*Additional items will be added here as needed.*
