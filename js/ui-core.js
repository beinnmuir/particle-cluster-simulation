/**
 * UI Controller core class
 * Main controller for UI elements and parameter controls
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
        this.tryMeButtons = {}; // References to Try Me buttons
        this.morphologyButtons = {}; // References to morphology buttons
        this.statsElements = {}; // References to stats elements
    }
    
    /**
     * Initialize UI elements
     */
    initialize() {
        const controlsContainer = select('#controls-container');
        
        // Create control groups
        this.createSimulationControls(controlsContainer);
        this.createParticleControls(controlsContainer);
        this.createRodParticleControls(controlsContainer);
        this.createForceControls(controlsContainer);
        this.createRepulsionDelayControls(controlsContainer);
        this.createMassControls(controlsContainer);
        this.createStatsDisplay(controlsContainer);
    }
}
