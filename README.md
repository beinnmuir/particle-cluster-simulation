# Particle Clustering Simulation

An interactive simulation where particles attract each other to form clusters, with forces that reverse to repulsion when clusters reach a threshold size. Particles gain mass when clustered and lose mass when isolated, with their clustering history reflected in their color.

## Features

- Dynamic particle behavior with attraction and repulsion forces
- Mass evolution based on clustering
- Visual representation of mass (size) and clustering history (color)
- Interactive UI for parameter tuning
- Modular architecture for easy extension
- Visualization of connections between particles in the same cluster
- One-click preset configurations with "Try Me" and "Default Settings" buttons

## Technology

Built with p5.js for rendering and interaction.

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser
3. Use the UI controls to adjust simulation parameters
4. Try the preset configurations:
   - Click "Try Me" for an optimized configuration that demonstrates interesting clustering behavior
   - Click "Default Settings" to reset all parameters to their default values
5. Experiment with different parameters to see how they affect particle behavior

## Controls

### Simulation Controls
- **Start/Pause**: Begin or pause the simulation
- **Reset**: Reset the simulation with current parameters
- **Default Settings**: Reset all parameters to their default values
- **Try Me**: Apply a preset configuration optimized for interesting clustering behavior

### Parameter Controls
- Adjust particle count, mass, speed, and other properties
- Modify force behaviors including attraction, repulsion, and stickiness
- Set repulsion delay parameters to control when clusters break apart
- Configure mass evolution rates

## Recent Updates

- Added "Default Settings" and "Try Me" buttons for quick configuration
- Improved visualization with constant-thickness connecting lines between particles
- Adjusted color brightness for better visual clarity
- Enhanced rendering order for better visibility of connections

## Future Enhancements

- Smooth transition functions for force behavior
- Attribute-based interactions (affinity)
- Performance optimizations with spatial partitioning
- 3D simulation capabilities
