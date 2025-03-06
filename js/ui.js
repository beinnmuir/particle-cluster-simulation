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
    }
    
    /**
     * Initialize UI elements
     */
    initialize() {
        const controlsContainer = select('#controls-container');
        
        // Create control groups
        this.createSimulationControls(controlsContainer);
        this.createParticleControls(controlsContainer);
        this.createForceControls(controlsContainer);
        this.createMassControls(controlsContainer);
        this.createStatsDisplay(controlsContainer);
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
        const startPauseBtn = createButton('Start');
        startPauseBtn.parent(group);
        startPauseBtn.mousePressed(() => {
            if (this.simulation.running) {
                this.simulation.pause();
                startPauseBtn.html('Start');
            } else {
                this.simulation.start();
                startPauseBtn.html('Pause');
            }
        });
        
        // Reset button
        const resetBtn = createButton('Reset');
        resetBtn.parent(group);
        resetBtn.mousePressed(() => {
            this.simulation.reset();
            startPauseBtn.html('Start');
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
            averageMass: createP('Avg Mass: 0'),
            totalClusters: createP('Total Clusters: 0')
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
     */
    updateStats() {
        const stats = this.simulation.stats;
        
        this.statsElements.fps.html(`FPS: ${stats.fps.toFixed(1)}`);
        this.statsElements.particleCount.html(`Particles: ${this.simulation.particles.length}`);
        this.statsElements.averageMass.html(`Avg Mass: ${stats.averageMass.toFixed(2)}`);
        this.statsElements.totalClusters.html(`Total Clusters: ${stats.clusterCount}`);
    }
}
