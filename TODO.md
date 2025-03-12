# Particle Clustering Simulation - TODO List

This file tracks important items that need to be checked, investigated, or implemented in the future.

## Try Me Mixed Settings

Add the following configuration as Try Me Mixed Settings:
- Particle Count: 100
- Initial Mass: 5
- Max Speed: 5
- Dampening (Friction): 0.1
- Particle Type: Mixed
- Rod Particle Ratio: 0.5
- Rod Length: 100
- Threshold Distance: 60
- Attraction Strength: 1
- Repulsion Strength: 0.2
- Sticky Force Strength: 0.5
- Repulsion Delay: 120
- Delay Increase on Join: 30
- Max Repulsion Delay: 300
- Minimum Mass: 2
- Maximum Mass: 10
- Mass Gain Rate: 0.01
- Mass Loss Rate: 0.1

## Try Me Rod Settings 1

Add the following configuration as Try Me Rod Settings 1:
- Particle Count: 120
- Initial Mass: 8
- Max Speed: 5
- Dampening (Friction): 0.1
- Rod Length: 40
- Threshold Distance: 50
- Attraction Strength: 1
- Repulsion Strength: 0.4
- Sticky Force Strength: 0.2
- Repulsion Delay: 60
- Delay Increase on Join: 20
- Max Repulsion Delay: 300
- Minimum Mass: 2
- Maximum Mass: 10
- Mass Gain Rate: 0.01
- Mass Loss Rate: 0.1

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

4. **Delay Increase Parameter**
   - Check that the delay increase parameter is working correctly
   - Do we need to add a minimum delay?

## Physics and Movement

1. **Particle Mass Balance**
   - Check relative masses for circles vs rods - circles seem more massive than rods, shown by the fact that rods move around much faster and more readily
   - Consider adjusting mass calculation or force application for different particle types
   - Ensure consistent behavior across particle types with the same mass value

## Visualization Improvements

1. **Connection Line Placement**
   - Investigate whether connection lines between rods and particles should be drawn at the centers or at the relevant rod points (e.g., endpoints)
   - Determine the most physically accurate and visually informative way to represent these connections
   - Consider implementing multiple connection visualisation options that can be toggled

2. **Attraction Visualisation**
   - Verify that lines currently show when the threshold distance is reached
   - Explore adding visualisation of when and where attraction starts/occurs
   - Consider adding visual indicators (e.g., gradients, fading lines) to show attraction strength
   - Implement optional visualisation of attraction fields around particles

3. **Fix UI jitter in stats panel & in HOD in main window**
   - Ensure smooth and consistent display of statistics
   - Fix jitter in Largest Cluster output

4. **Consider adding other visualisation options**
   - Show/hide visualisation of Force Control sliders
   - Option to show/hide connection lines

## Future Enhancements

*Additional items will be added here as needed.*
