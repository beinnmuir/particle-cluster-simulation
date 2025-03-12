# Technical Architecture

## Project Structure

The project follows a modular architecture with clear separation of concerns:

### Core Modules

1. **Particle System**: Handles individual particle properties and behaviors
2. **Force System**: Manages force calculations and interactions between particles
3. **Renderer**: Visualizes particles and their clustering behaviors
4. **Simulation Manager**: Coordinates the overall simulation flow
5. **UI System**: Provides user interface for parameter adjustments

### Key Files and Their Purposes

- `js/particle.js`: Defines the Particle class with position, velocity, mass, and clustering properties
- `js/particleFactory.js`: Implements the ParticleFactory class for centralized particle creation and configuration
- `js/force.js`: Implements the ForceSystem class for calculating forces and detecting clusters
- `js/render.js`: Contains the Renderer class for visualizing particles and clusters
- `js/simulation.js`: Manages the overall simulation state and lifecycle
- `js/main.js`: Entry point that initializes the simulation
- `js/ui-core.js`: Main UIController class definition and initialization
- `js/ui-controls.js`: Control creation methods for simulation, particles, forces, etc.
- `js/ui-morphology.js`: Morphology-specific functions for button styles and visibility
- `js/ui-presets.js`: Preset settings functions (default, Try Me settings)
- `js/ui-stats.js`: Statistics display creation and update methods
- `js/ui-components.js`: Reusable UI component creation methods (sliders, etc.)

## Code Structure and Design Patterns

The codebase follows object-oriented design principles with clear separation of concerns:

1. **Observer Pattern**: For event handling and UI updates
2. **Strategy Pattern**: For different force calculation strategies
3. **Factory Pattern**: For particle creation and configuration
4. **Command Pattern**: For user interactions and parameter changes

## Development Environment

- **Language**: JavaScript (ES6+)
- **Libraries**: p5.js for rendering and vector math
- **Development Platform**: macOS
- **Browser Compatibility**: Modern browsers with HTML5 Canvas support
