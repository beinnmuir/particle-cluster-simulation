# UI System Documentation

## Overview

The UI system provides an interactive interface for controlling the particle simulation. It allows users to adjust simulation parameters, switch between particle types, and access preset configurations.

## UI Architecture

The UI system has been refactored into a modular structure with the following components:

### Core Module (`ui-core.js`)

Contains the main UIController class definition and initialization logic:

```javascript
class UIController {
    constructor(simulation, config) {
        this.simulation = simulation;
        this.config = config;
        this.morphologyButtons = {};
        this.controlGroups = {};
    }
    
    initialize() {
        // Create UI elements and set up event handlers
        const controlsContainer = select('#controls-container');
        this.createSimulationControls(controlsContainer);
        this.createParticleControls(controlsContainer);
        // ...
    }
}
```

### Components Module (`ui-components.js`)

Contains reusable UI component creation methods:

```javascript
UIController.prototype.createSliderWithLabel = function(container, label, min, max, value, step, callback) {
    const div = createDiv();
    div.parent(container);
    div.class('control-group');
    
    const labelElement = createElement('label', label);
    labelElement.parent(div);
    
    const slider = createSlider(min, max, value, step);
    slider.parent(div);
    slider.input(callback);
    
    return { div, slider };
};
```

### Controls Module (`ui-controls.js`)

Contains methods for creating various control groups:

```javascript
UIController.prototype.createSimulationControls = function(container) {
    const div = createDiv();
    div.parent(container);
    div.class('control-section');
    
    const heading = createElement('h3', 'Simulation Controls');
    heading.parent(div);
    
    this.createStartPauseButton(div);
    this.createResetButton(div);
    // ...
};

UIController.prototype.createParticleControls = function(container) {
    // Implementation for particle controls
};

UIController.prototype.createRodParticleControls = function(container) {
    // Implementation for rod-specific controls
};
```

### Morphology Module (`ui-morphology.js`)

Handles particle type selection and related UI updates:

```javascript
UIController.prototype.updateMorphologyButtonStyles = function(selectedType) {
    const baseStyle = {
        backgroundColor: '#4CAF50',
        color: 'white'
    };
    
    const selectedStyle = {
        backgroundColor: '#8BC34A',
        color: 'white'
    };
    
    // Reset all buttons to base style
    Object.keys(this.morphologyButtons).forEach(type => {
        this.morphologyButtons[type].style('background-color', baseStyle.backgroundColor);
    });
    
    // Apply selected style to the active button
    if (this.morphologyButtons[selectedType]) {
        this.morphologyButtons[selectedType].style('background-color', selectedStyle.backgroundColor);
    }
};
```

### Presets Module (`ui-presets.js`)

Contains preset settings functions for quick configuration:

```javascript
UIController.prototype.resetToDefaultSettings = function() {
    // Reset to default configuration
    this.config.current = Object.assign({}, this.config.default);
    this.updateUIFromConfig();
};

UIController.prototype.setToTryMeSettings = function() {
    // Apply optimized "Try Me" settings
    const tryMeSettings = {
        particleCount: 400,
        initialMass: 5,
        // ...other settings
    };
    
    Object.assign(this.config.current, tryMeSettings);
    this.updateUIFromConfig();
};
```

### Stats Module (`ui-stats.js`)

Manages the statistics display and updates:

```javascript
UIController.prototype.createStatsDisplay = function(container) {
    const div = createDiv();
    div.parent(container);
    div.class('stats-container');
    
    this.statsDisplay = {
        fps: createElement('p', 'FPS: 0'),
        particles: createElement('p', 'Particles: 0'),
        clusters: createElement('p', 'Clusters: 0')
    };
    
    Object.values(this.statsDisplay).forEach(element => {
        element.parent(div);
    });
};

UIController.prototype.updateStats = function() {
    const fps = Math.round(frameRate());
    const particleCount = this.simulation.particles.length;
    const clusterCount = this.simulation.forceSystem.getClusterCount();
    
    this.statsDisplay.fps.html(`FPS: ${fps}`);
    this.statsDisplay.particles.html(`Particles: ${particleCount}`);
    this.statsDisplay.clusters.html(`Clusters: ${clusterCount}`);
};
```

## Key UI Features

1. **Particle Type Selection**: Buttons for selecting circular, rod, or mixed particle types
2. **Simulation Controls**: Start/pause and reset buttons
3. **Parameter Adjustments**: Sliders for adjusting force coefficients, thresholds, and other parameters
4. **Preset Configurations**: "Default Settings" and "Try Me" buttons for quick configuration
5. **Statistics Display**: Real-time display of FPS, particle count, and cluster count
6. **Conditional Controls**: Context-aware controls that only display when relevant

## UI Improvements

Recent UI improvements include:

1. **Button-Based Selection**: Replaced dropdown menus with buttons for more reliable particle type selection
2. **Visual Feedback**: Added visual feedback for selected particle type through button styling
3. **Conditional UI Controls**: Implemented context-aware controls that only display when relevant
4. **Start/Pause Button Fix**: Corrected the start/pause button state when changing particle types
5. **Modular Structure**: Refactored UI code into separate functional modules for better organization

## Original Code Preservation

The original monolithic UI implementation has been archived for reference:
- Original file: `js/ui.js` moved to `js/archive/ui.js`
