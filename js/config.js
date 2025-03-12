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
            
            // Particle type settings
            particleType: 'circular',  // 'circular', 'rod', or 'mixed'
            rodRatio: 0.5,       // For mixed particle types
            rodLength: 40,        // Length of rod particles
            
            // Force settings
            thresholdDistance: 60,
            attractionCoefficient: 0.1,
            repulsionCoefficient: 0.2,
            stickyForceCoefficient: 0.5,
            stickyForcePower: 4,
            
            // Repulsion delay settings
            repulsionDelay: 120,
            delayIncrease: 30,
            maxRepulsionDelay: 300,
            
            // Mass evolution settings
            massGainRate: 0.02,
            massLossRate: 0.003,
            
            // Canvas settings
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight - 100, // Account for controls
            
            // Simulation settings
            timeStep: 1,
            maxSpeed: 5,
            dampeningCoefficient: 0.03 // Friction/dampening force (0 = no dampening, 1 = immediate stop)
        };
        
        // Current settings (will be modified by UI)
        this.current = Object.assign({}, this.defaults);
    }
    
    /**
     * Reset settings to defaults
     * @param {Object} preserveSettings - Optional object containing settings to preserve
     */
    resetToDefaults(preserveSettings = {}) {
        // First reset everything to defaults
        this.current = Object.assign({}, this.defaults);
        
        // Then apply any preserved settings
        Object.entries(preserveSettings).forEach(([key, value]) => {
            if (key in this.current) {
                this.current[key] = value;
            }
        });
        
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
