/**
 * Configuration module for the Particle Clustering Simulation
 * Handles default settings and simulation state management
 */
class Config {
    constructor() {
        // Default simulation settings
        this.defaults = {
            // Particle settings
            particleCount: 100,
            initialMass: 5,
            minMass: 2,
            maxMass: 20,
            
            // Force settings
            thresholdDistance: 50,
            attractionCoefficient: 0.1,
            repulsionCoefficient: 0.2,
            stickyForceCoefficient: 0.5,
            stickyForcePower: 4,
            
            // Repulsion delay settings
            repulsionDelay: 120, // Frames to wait before repulsion activates (2 seconds at 60fps)
            repulsionDelayIncrease: 30, // Additional frames added when a new particle joins
            maxRepulsionDelay: 300, // Maximum repulsion delay (5 seconds at 60fps)
            
            // Mass evolution settings
            massGainRate: 0.01,
            massLossRate: 0.005,
            
            // Canvas settings
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight - 100, // Account for controls
            
            // Simulation settings
            timeStep: 1,
            maxSpeed: 5
        };
        
        // Current settings (will be modified by UI)
        this.current = Object.assign({}, this.defaults);
    }
    
    /**
     * Reset settings to defaults
     */
    resetToDefaults() {
        this.current = Object.assign({}, this.defaults);
        return this.current;
    }
    
    /**
     * Save current simulation state
     */
    saveState() {
        const state = {
            settings: this.current,
            timestamp: Date.now()
        };
        
        localStorage.setItem('simulationState', JSON.stringify(state));
        return state;
    }
    
    /**
     * Load saved simulation state
     */
    loadState() {
        const savedState = localStorage.getItem('simulationState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.current = state.settings;
            return true;
        }
        return false;
    }
    
    /**
     * Update a specific setting
     */
    updateSetting(key, value) {
        if (key in this.current) {
            this.current[key] = value;
            return true;
        }
        return false;
    }
}

// Create and export a singleton instance
const config = new Config();
