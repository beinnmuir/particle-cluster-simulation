/**
 * UI Controller class
 * Handles UI elements and parameter controls
 */
class UIController {
    /**
     * Create a new UI controller
     * @param {SimulationManager} simulation - The simulation manager
     * @param {object} config - Configuration object
     */
    constructor(simulation, config) {
        this.simulation = simulation;
        this.config = config;
        this.controls = {};
        this.startPauseBtn = null; // Reference to the start/pause button
    }
    
    /**
     * Initialize UI elements
     */
    initialize() {
        const controlsContainer = select('#controls-container');
        
        // Create control groups
        this.createSimulationControls(controlsContainer);
        this.createParticleControls(controlsContainer);
        this.createRodParticleControls(controlsContainer);  // New rod particle controls
        this.createForceControls(controlsContainer);
        this.createRepulsionDelayControls(controlsContainer);
        this.createMassControls(controlsContainer);
        this.createStatsDisplay(controlsContainer);
    }

    /**
     * Create rod particle control elements
     * @param {p5.Element} container - Parent container
     */
    createRodParticleControls(container) {
        const group = createDiv();
        group.class('control-group');
        group.parent(container);
        
        // Title
        const title = createElement('h3', 'Morphology Controls');
        title.parent(group);
        
        // Particle type selector
        const typeLabel = createElement('label', 'Particle Type:');
        typeLabel.parent(group);
        
        // We already have a reference to the start/pause button as this.startPauseBtn
        
        // Store references to buttons for updating selected state
        this.morphologyButtons = {};
        
        // Base style for all buttons
        const baseButtonStyle = {
            margin: '5px',
            padding: '10px',
            backgroundColor: '#4CAF50',  // Default green
            color: 'white',
            border: '1px solid #3e8e41',
            borderRadius: '4px',
            cursor: 'pointer'
        };
        
        // Selected state style (lighter green)
        const selectedButtonStyle = {
            backgroundColor: '#8BC34A'  // Lighter green for selected state
        };
        
        // Create buttons instead of dropdown for more reliable control
        const circularBtn = createButton('Circular');
        circularBtn.parent(group);
        this.morphologyButtons.circular = circularBtn;
        
        // Apply base styles
        Object.entries(baseButtonStyle).forEach(([prop, val]) => {
            circularBtn.style(prop, val);
        });
        
        circularBtn.mousePressed(() => {
            // Force set the particle type to circular
            console.log('Setting particle type to: circular');
            this.config.current.particleType = 'circular';
            console.log('Config after direct update:', this.config.current.particleType);
            
            // Hide rod ratio slider for circular particles
            ratioDiv.style('display', 'none');
            
            // Hide rod length slider for circular particles
            rodLengthDiv.style('display', 'none');
            
            // Update button styles
            this.updateMorphologyButtonStyles('circular');
            
            this.simulation.reset();
            // Update start/pause button text since simulation is now stopped
            if (this.startPauseBtn) this.startPauseBtn.html('Start');
        });
        
        const rodBtn = createButton('Rod');
        rodBtn.parent(group);
        this.morphologyButtons.rod = rodBtn;
        
        // Apply base styles
        Object.entries(baseButtonStyle).forEach(([prop, val]) => {
            rodBtn.style(prop, val);
        });
        
        rodBtn.mousePressed(() => {
            // Force set the particle type to rod
            console.log('Setting particle type to: rod');
            this.config.current.particleType = 'rod';
            console.log('Config after direct update:', this.config.current.particleType);
            
            // Hide rod ratio slider for rod particles
            ratioDiv.style('display', 'none');
            
            // Show rod length slider for rod particles
            rodLengthDiv.style('display', 'block');
            
            // Update button styles
            this.updateMorphologyButtonStyles('rod');
            
            this.simulation.reset();
            // Update start/pause button text since simulation is now stopped
            if (this.startPauseBtn) this.startPauseBtn.html('Start');
        });
        
        const mixedBtn = createButton('Mixed');
        mixedBtn.parent(group);
        this.morphologyButtons.mixed = mixedBtn;
        
        // Apply base styles
        Object.entries(baseButtonStyle).forEach(([prop, val]) => {
            mixedBtn.style(prop, val);
        });
        
        mixedBtn.mousePressed(() => {
            // Force set the particle type to mixed
            console.log('Setting particle type to: mixed');
            this.config.current.particleType = 'mixed';
            console.log('Config after direct update:', this.config.current.particleType);
            
            // Show rod ratio slider for mixed particles
            ratioDiv.style('display', 'block');
            
            // Show rod length slider for mixed particles
            rodLengthDiv.style('display', 'block');
            
            // Update button styles
            this.updateMorphologyButtonStyles('mixed');
            
            this.simulation.reset();
            // Update start/pause button text since simulation is now stopped
            if (this.startPauseBtn) this.startPauseBtn.html('Start');
        });
        
        // Rod ratio slider (only visible when type is 'mixed')
        const ratioDiv = createDiv();
        ratioDiv.parent(group);
        ratioDiv.id('rod-ratio-control');
        ratioDiv.style('display', this.config.current.particleType === 'mixed' ? 'block' : 'none');
        
        this.createSlider(
            ratioDiv,
            'rodRatio',
            'Rod Particle Ratio',
            0, 1,
            this.config.current.rodRatio,
            0.1,
            (value) => {
                this.config.updateSetting('rodRatio', value);
                this.simulation.reset();
            }
        );
        
        // Rod length slider in its own div for visibility control
        const rodLengthDiv = createDiv();
        rodLengthDiv.parent(group);
        rodLengthDiv.id('rod-length-control');
        
        // Only show rod length slider for rod or mixed particles
        const showRodLength = this.config.current.particleType === 'rod' || 
                             this.config.current.particleType === 'mixed';
        rodLengthDiv.style('display', showRodLength ? 'block' : 'none');
        
        this.createSlider(
            rodLengthDiv,
            'rodLength',
            'Rod Length',
            10, 100,  
            this.config.current.rodLength,
            1,
            (value) => {
                this.config.updateSetting('rodLength', value);
                this.simulation.reset();
            }
        );
        
        // Set initial button styles based on current particle type
        this.updateMorphologyButtonStyles(this.config.current.particleType);
    }
    
    /**
     * Update morphology button styles to show selected state
     * @param {string} selectedType - The currently selected particle type
     */
    updateMorphologyButtonStyles(selectedType) {
        if (!this.morphologyButtons) return;
        
        // Base style for all buttons
        const baseStyle = {
            backgroundColor: '#4CAF50'  // Default green
        };
        
        // Selected style
        const selectedStyle = {
            backgroundColor: '#8BC34A'  // Lighter green
        };
        
        // Reset all buttons to base style
        Object.keys(this.morphologyButtons).forEach(type => {
            this.morphologyButtons[type].style('background-color', baseStyle.backgroundColor);
        });
        
        // Apply selected style to the active button
        if (this.morphologyButtons[selectedType]) {
            this.morphologyButtons[selectedType].style('background-color', selectedStyle.backgroundColor);
        }
    }
    
    /**
     * Create simulation control buttons
     * @param {p5.Element} container - Parent container
     */
    createSimulationControls(container) {
        const group = createDiv();
        group.class('control-group');
        group.parent(container);
        
        // Title
        const title = createElement('h3', 'Simulation Controls');
        title.parent(group);
        
        // Start/Pause button
        this.startPauseBtn = createButton('Start');
        this.startPauseBtn.parent(group);
        this.startPauseBtn.mousePressed(() => {
            if (this.simulation.running) {
                this.simulation.pause();
                this.startPauseBtn.html('Start');
            } else {
                this.simulation.start();
                this.startPauseBtn.html('Pause');
            }
        });
        
        // Reset button
        const resetBtn = createButton('Reset');
        resetBtn.parent(group);
        resetBtn.mousePressed(() => {
            this.simulation.reset();
            this.startPauseBtn.html('Start');
        });

        // Default Settings button
        const defaultBtn = createButton('Default Settings');
        defaultBtn.parent(group);
        defaultBtn.mousePressed(() => {
            this.resetToDefaultSettings();
            this.simulation.reset();
            this.startPauseBtn.html('Start');
        });

        // Try Me Settings 1 button
        const tryMeBtn = createButton('Try Me Settings 1');
        tryMeBtn.parent(group);
        tryMeBtn.mousePressed(() => {
            this.setToTryMeSettings();
            this.simulation.reset();
            this.simulation.start();
            this.startPauseBtn.html('Pause');
        });
        
        // Try Me Settings 2 button
        const tryMeBtn2 = createButton('Try Me Settings 2');
        tryMeBtn2.parent(group);
        tryMeBtn2.mousePressed(() => {
            this.setToTryMeSettings2();
            this.simulation.reset();
            this.simulation.start();
            this.startPauseBtn.html('Pause');
        });
    }
    
    /**
     * Create particle control sliders
     * @param {p5.Element} container - Parent container
     */
    createParticleControls(container) {
        const group = createDiv();
        group.class('control-group');
        group.parent(container);
        
        // Title
        const title = createElement('h3', 'Particle Controls');
        title.parent(group);
        
        // Particle count slider
        this.createSlider(
            group,
            'particleCount',
            'Particle Count',
            10, 500, 
            this.config.current.particleCount,
            1,
            (value) => {
                this.config.updateSetting('particleCount', value);
                this.simulation.reset();
            }
        );
        
        // Initial mass slider
        this.createSlider(
            group,
            'initialMass',
            'Initial Mass',
            1, 20, 
            this.config.current.initialMass,
            0.5,
            (value) => {
                this.config.updateSetting('initialMass', value);
            }
        );
        
        // Max speed slider
        this.createSlider(
            group,
            'maxSpeed',
            'Max Speed',
            1, 10, 
            this.config.current.maxSpeed,
            0.1,
            (value) => {
                this.config.updateSetting('maxSpeed', value);
            }
        );
        
        // Dampening coefficient slider
        this.createSlider(
            group,
            'dampeningCoefficient',
            'Dampening (Friction)',
            0, 0.1, 
            this.config.current.dampeningCoefficient,
            0.001,
            (value) => {
                this.config.updateSetting('dampeningCoefficient', value);
            }
        );
    }
    
    /**
     * Create force control sliders
     * @param {p5.Element} container - Parent container
     */
    createForceControls(container) {
        const group = createDiv();
        group.class('control-group');
        group.parent(container);
        
        // Title
        const title = createElement('h3', 'Force Controls');
        title.parent(group);
        
        // Threshold distance slider
        this.createSlider(
            group,
            'thresholdDistance',
            'Threshold Distance',
            10, 200, 
            this.config.current.thresholdDistance,
            1,
            (value) => {
                this.config.updateSetting('thresholdDistance', value);
            }
        );
        
        // Attraction coefficient slider
        this.createSlider(
            group,
            'attractionCoefficient',
            'Attraction Strength',
            0.01, 1, 
            this.config.current.attractionCoefficient,
            0.01,
            (value) => {
                this.config.updateSetting('attractionCoefficient', value);
            }
        );
        
        // Repulsion coefficient slider
        this.createSlider(
            group,
            'repulsionCoefficient',
            'Repulsion Strength',
            0.01, 1, 
            this.config.current.repulsionCoefficient,
            0.01,
            (value) => {
                this.config.updateSetting('repulsionCoefficient', value);
            }
        );
        
        // Sticky force coefficient slider
        this.createSlider(
            group,
            'stickyForceCoefficient',
            'Sticky Force Strength',
            0, 2, 
            this.config.current.stickyForceCoefficient,
            0.01,
            (value) => {
                this.config.updateSetting('stickyForceCoefficient', value);
            }
        );
    }
    
    /**
     * Create mass evolution control sliders
     * @param {p5.Element} container - Parent container
     */
    /**
     * Create repulsion delay control sliders
     * @param {p5.Element} container - Parent container
     */
    createRepulsionDelayControls(container) {
        const group = createDiv();
        group.class('control-group');
        group.parent(container);
        
        // Title
        const title = createElement('h3', 'Repulsion Delay');
        title.parent(group);
        
        // Repulsion delay slider
        this.createSlider(
            group,
            'repulsionDelay',
            'Repulsion Delay (frames)',
            0, 300, 
            this.config.current.repulsionDelay,
            10,
            (value) => {
                this.config.updateSetting('repulsionDelay', value);
            }
        );
        
        // Repulsion delay increase slider
        this.createSlider(
            group,
            'repulsionDelayIncrease',
            'Delay Increase on Join',
            0, 100, 
            this.config.current.repulsionDelayIncrease,
            5,
            (value) => {
                this.config.updateSetting('repulsionDelayIncrease', value);
            }
        );
        
        // Max repulsion delay slider
        this.createSlider(
            group,
            'maxRepulsionDelay',
            'Max Repulsion Delay',
            60, 600, 
            this.config.current.maxRepulsionDelay,
            30,
            (value) => {
                this.config.updateSetting('maxRepulsionDelay', value);
            }
        );
    }
    
    /**
     * Create mass evolution control sliders
     * @param {p5.Element} container - Parent container
     */
    createMassControls(container) {
        const group = createDiv();
        group.class('control-group');
        group.parent(container);
        
        // Title
        const title = createElement('h3', 'Mass Evolution');
        title.parent(group);
        
        // Min mass slider
        this.createSlider(
            group,
            'minMass',
            'Minimum Mass',
            1, 10, 
            this.config.current.minMass,
            0.5,
            (value) => {
                this.config.updateSetting('minMass', value);
            }
        );
        
        // Max mass slider
        this.createSlider(
            group,
            'maxMass',
            'Maximum Mass',
            5, 30, 
            this.config.current.maxMass,
            0.5,
            (value) => {
                this.config.updateSetting('maxMass', value);
            }
        );
        
        // Mass gain rate slider
        this.createSlider(
            group,
            'massGainRate',
            'Mass Gain Rate',
            0.001, 0.1, 
            this.config.current.massGainRate,
            0.001,
            (value) => {
                this.config.updateSetting('massGainRate', value);
            }
        );
        
        // Mass loss rate slider
        this.createSlider(
            group,
            'massLossRate',
            'Mass Loss Rate',
            0.001, 0.1, 
            this.config.current.massLossRate,
            0.001,
            (value) => {
                this.config.updateSetting('massLossRate', value);
            }
        );
    }
    
    /**
     * Create statistics display
     * @param {p5.Element} container - Parent container
     */
    /**
     * Reset all settings to their default values
     */
    resetToDefaultSettings() {
        // Update all sliders to their default values
        this.config.resetToDefaults();
        
        // Update UI sliders
        for (const [key, control] of Object.entries(this.controls)) {
            if (control.slider) {
                control.slider.value(this.config.current[key]);
                if (control.valueDisplay) {
                    control.valueDisplay.html(this.config.current[key]);
                }
            }
        }
    }

    /**
     * Set settings to the "Try Me Settings 1" configuration
     */
    setToTryMeSettings() {
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

        // Update config with new settings
        for (const [key, value] of Object.entries(tryMeSettings)) {
            this.config.updateSetting(key, value);
        }

        // Update UI sliders
        for (const [key, control] of Object.entries(this.controls)) {
            if (control.slider && tryMeSettings[key] !== undefined) {
                control.slider.value(tryMeSettings[key]);
                if (control.valueDisplay) {
                    control.valueDisplay.html(tryMeSettings[key]);
                }
            }
        }
    }
    
    /**
     * Set settings to the "Try Me Settings 2" configuration
     */
    setToTryMeSettings2() {
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

        // Update config with new settings
        for (const [key, value] of Object.entries(tryMeSettings2)) {
            this.config.updateSetting(key, value);
        }

        // Update UI sliders
        for (const [key, control] of Object.entries(this.controls)) {
            if (control.slider && tryMeSettings2[key] !== undefined) {
                control.slider.value(tryMeSettings2[key]);
                if (control.valueDisplay) {
                    control.valueDisplay.html(tryMeSettings2[key]);
                }
            }
        }
    }

    createStatsDisplay(container) {
        const statsDiv = createDiv();
        statsDiv.class('stats-display');
        statsDiv.parent(container);
        
        // Title
        const title = createElement('h3', 'Statistics');
        title.parent(statsDiv);
        
        // Stats elements
        this.statsElements = {
            fps: createP('FPS: 0'),
            particleCount: createP('Particles: 0'),
            rodParticles: createP('Rod Particles: 0'),
            circularParticles: createP('Circular Particles: 0'),
            averageMass: createP('Avg Mass: 0'),
            totalClusters: createP('Total Clusters: 0'),
            distinctClusters: createP('Distinct Clusters: 0'),
            particlesInClusters: createP('Particles in Clusters: 0'),
            largestCluster: createP('Largest Cluster: 0'),
            clusterDistribution: createP('Cluster Sizes: 0 small, 0 medium, 0 large')
        };
        
        // Add stats elements to container
        for (let key in this.statsElements) {
            this.statsElements[key].parent(statsDiv);
        }
    }
    
    /**
     * Create a slider with label
     * @param {p5.Element} container - Parent container
     * @param {string} id - Slider ID
     * @param {string} label - Slider label
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {number} value - Initial value
     * @param {number} step - Step size
     * @param {function} onChange - Change handler
     */
    createSlider(container, id, label, min, max, value, step, onChange) {
        const sliderContainer = createDiv();
        sliderContainer.class('slider-container');
        sliderContainer.parent(container);
        
        // Create label
        const labelElement = createElement('label', label);
        labelElement.parent(sliderContainer);
        
        // Create slider
        const slider = createSlider(min, max, value, step);
        slider.parent(sliderContainer);
        slider.style('width', '100%');
        
        // Create value display
        const valueDisplay = createSpan(value);
        valueDisplay.parent(sliderContainer);
        
        // Store control reference
        this.controls[id] = {
            slider: slider,
            valueDisplay: valueDisplay
        };
        
        // Add event listener
        slider.input(() => {
            const val = slider.value();
            valueDisplay.html(val);
            onChange(val);
        });
    }
    
    /**
     * Update statistics display
     * @param {object} stats - Optional stats object from simulation
     */
    updateStats(stats) {
        // Use provided stats or get from simulation
        const simStats = stats || this.simulation.getStats();
        
        // Update basic stats
        this.statsElements.fps.html(`FPS: ${simStats.fps.toFixed(1)}`);
        this.statsElements.particleCount.html(`Particles: ${this.simulation.particles.length}`);
        this.statsElements.rodParticles.html(`Rod Particles: ${simStats.rodParticleCount}`);
        this.statsElements.circularParticles.html(`Circular Particles: ${simStats.circularParticleCount}`);
        this.statsElements.averageMass.html(`Avg Mass: ${simStats.averageMass.toFixed(2)}`);
        this.statsElements.totalClusters.html(`Total Clusters: ${simStats.clusterCount}`);
        
        // Update enhanced cluster stats
        this.statsElements.distinctClusters.html(`Distinct Clusters: ${simStats.distinctClusters}`);
        this.statsElements.particlesInClusters.html(`Particles in Clusters: ${simStats.particlesInClusters}`);
        
        // Get the force system for additional cluster information
        const forceSystem = this.simulation.getForceSystem();
        if (forceSystem && forceSystem.clusterSizes) {
            // Find the largest cluster
            const clusterSizes = Array.from(forceSystem.clusterSizes.values());
            const largestClusterSize = clusterSizes.length > 0 ? Math.max(...clusterSizes) : 0;
            this.statsElements.largestCluster.html(`Largest Cluster: ${largestClusterSize}`);
            
            // Calculate cluster size distribution
            const smallClusters = clusterSizes.filter(size => size <= 5).length;
            const mediumClusters = clusterSizes.filter(size => size > 5 && size <= 15).length;
            const largeClusters = clusterSizes.filter(size => size > 15).length;
            
            this.statsElements.clusterDistribution.html(
                `Cluster Sizes: ${smallClusters} small, ${mediumClusters} medium, ${largeClusters} large`
            );
        }
    }
}
