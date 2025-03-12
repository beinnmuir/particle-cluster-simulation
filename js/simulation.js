/**
 * Simulation Manager class
 * Manages the simulation loop, initialization, and reset
 */
class SimulationManager {
    /**
     * Create a new simulation manager
     * @param {object} config - Configuration object
     */
    constructor(config) {
        // Set default rod particle configuration if not provided
        if (!config.current) {
            config.current = {};
        }
        
        // Rod particle specific defaults
        config.current.particleType = config.current.particleType || 'circular';
        config.current.rodRatio = config.current.rodRatio || 0;
        config.current.rodLength = config.current.rodLength || 20;
        
        this.particles = [];
        this.forceSystem = new ForceSystem();
        this.config = config;
        this.particleFactory = new ParticleFactory(config);
        this.running = false;
        this.stats = {
            averageMass: 0,
            clusterCount: 0,
            particlesInClusters: 0,
            distinctClusters: 0,
            fps: 0,
            rodParticleCount: 0,  // Track number of rod particles
            circularParticleCount: 0  // Track number of circular particles
        };
    }
    
    /**
     * Initialize the simulation with particles
     */
    initialize() {
        // DEBUG: Log the current particle type to verify configuration
        console.log('Initializing simulation with particle type:', this.config.current.particleType);
        
        this.particles = [];
        this.forceSystem = new ForceSystem(); // Reset force system
        this.particleFactory.reset(); // Reset particle ID counter
        
        // Force refresh the config value to ensure it's current
        const currentType = this.config.current.particleType;
        console.log('Double-checking particle type before creating particles:', currentType);
        
        // Get particle creation options from config
        const options = {
            type: currentType, // Use the directly retrieved value
            rodRatio: this.config.current.rodRatio || 0
        };
        
        // Log the options being passed to the particle factory
        console.log('Particle creation options:', options);
        
        // Create particles using the factory with specified options
        this.particles = this.particleFactory.createParticleBatch(
            this.config.current.particleCount,
            options
        );
        
        this.running = false;
        this.updateStats(); // Initialize stats
    }
    
    /**
     * Start the simulation
     */
    start() {
        this.running = true;
    }
    
    /**
     * Pause the simulation
     */
    pause() {
        this.running = false;
    }
    
    /**
     * Reset the simulation
     */
    reset() {
        this.initialize();
    }
    
    /**
     * Update the simulation for one time step
     */
    update() {
        if (!this.running) return;
        
        // Apply forces between particles
        this.forceSystem.applyForces(this.particles, this.config.current);
        
        // Update each particle
        for (let particle of this.particles) {
            particle.update(this.config.current);
        }
        
        // Update statistics
        this.updateStats();
        
        return this.stats; // Return current stats for external use
    }
    
    /**
     * Update simulation statistics
     */
    updateStats() {
        // Calculate average mass and particle type counts
        let totalMass = 0;
        let totalClusters = 0;
        let particlesInClusters = 0;
        let rodCount = 0;
        let circularCount = 0;
        
        for (let particle of this.particles) {
            totalMass += particle.mass;
            totalClusters += particle.clusterCount;
            
            if (particle.inCluster) {
                particlesInClusters++;
            }
            
            // Count particle types
            if (particle instanceof RodParticle) {
                rodCount++;
            } else {
                circularCount++;
            }
        }
        
        this.stats.averageMass = totalMass / this.particles.length;
        this.stats.clusterCount = totalClusters;
        this.stats.particlesInClusters = particlesInClusters;
        this.stats.distinctClusters = this.forceSystem.getDistinctClusterCount();
        this.stats.fps = frameRate();
        this.stats.rodParticleCount = rodCount;
        this.stats.circularParticleCount = circularCount;
    }
    
    /**
     * Render the simulation
     * @param {Renderer} renderer - The renderer instance to use
     */
    render(renderer) {
        console.log('SimulationManager.render called with', this.particles.length, 'particles');
        
        if (renderer) {
            // Use the provided renderer
            console.log('Using external renderer');
            renderer.render();
        } else {
            // Fallback to basic rendering if no renderer is provided
            console.log('Using fallback rendering (particle.display)');
            background(240);
            
            // Draw each particle
            for (let particle of this.particles) {
                // Debug: Log the type of particle being rendered
                const isRod = particle instanceof RodParticle;
                console.log('Rendering particle using display():', isRod ? 'ROD' : 'CIRCULAR');
                particle.display();
            }
        }
    }
    
    /**
     * Resize the simulation canvas
     */
    resize(width, height) {
        this.config.current.canvasWidth = width;
        this.config.current.canvasHeight = height;
    }
    
    /**
     * Get the force system
     * @returns {ForceSystem} - The force system instance
     */
    getForceSystem() {
        return this.forceSystem;
    }
    
    /**
     * Get current simulation statistics
     * @returns {object} - Current simulation statistics
     */
    getStats() {
        return this.stats;
    }
}
