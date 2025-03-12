# Particle Clustering Simulation

An interactive simulation where particles attract each other to form clusters, with forces that reverse to repulsion when clusters reach a threshold size. Particles gain mass when clustered and lose mass when isolated, with their clustering history reflected in their color. The simulation supports both circular and rod-shaped particles with realistic physics and interactions.

## Features

- Dynamic particle behavior with attraction and repulsion forces
- Support for both circular and rod-shaped particles with realistic physics
- Rotational dynamics for rod particles with torque and angular momentum
- Mass evolution based on clustering
- Visual representation of mass (size) and clustering history (color)
- Interactive UI for parameter tuning with multiple control categories
- Modular architecture for easy extension
- Visualization of connections between particles in the same cluster
- Multiple preset configurations with "Try Me" buttons for different particle types
- Statistics panel showing real-time simulation metrics

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
- **Simulation Controls**: Start/pause, reset, and apply preset configurations
- **Particle Controls**: Adjust particle count, mass, speed, and friction
- **Morphology Controls**: Select particle type (circular, rod, or mixed) and configure rod-specific parameters
- **Force Controls**: Modify threshold distance, attraction, repulsion, and stickiness
- **Repulsion Delay**: Configure delay parameters to control when clusters break apart
- **Mass Evolution**: Set minimum/maximum mass and mass gain/loss rates

## Recent Updates

- Added support for rod-shaped particles with realistic rotational dynamics
- Implemented mixed particle type simulations with configurable rod ratio
- Redesigned UI with categorized control panels for better organization
- Added multiple "Try Me" preset configurations for different particle types
- Enhanced cluster detection and force calculations for mixed particle types
- Added statistics panel showing real-time metrics about clusters and particles
- Optimized rendering for better performance with large numbers of particles
- Refactored technical documentation into modular, focused documentation files

## Future Enhancements

- Performance optimizations with spatial partitioning for O(n log n) force calculations
- Enhanced cluster visualization options with toggleable connection lines
- Additional visualization options for force fields and attraction zones
- Improved UI with reduced jitter in statistics display
- Attribute-based interactions (affinity)
- Smooth transition functions for force behavior
- Potential 3D simulation capabilities

## Documentation

Detailed technical documentation is available in the following files:

- [TechnicalSummary.md](TechnicalSummary.md): Overview and index of all documentation
- [docs/architecture.md](docs/architecture.md): Project structure and module design
- [docs/algorithms.md](docs/algorithms.md): Core algorithms and mechanisms
- [docs/configuration.md](docs/configuration.md): Key variables and parameters
- [docs/particles.md](docs/particles.md): Particle system and behaviors
- [docs/ui.md](docs/ui.md): UI system and components
- [docs/changelog.md](docs/changelog.md): Detailed history of changes
