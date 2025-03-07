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
            fps: 0
        };
    }
    
    /**
     * Initialize the simulation with particles
     */
    initialize() {
        this.particles = [];
        this.forceSystem = new ForceSystem(); // Reset force system
        this.particleFactory.reset(); // Reset particle ID counter
        
        // Create particles using the factory
        this.particles = this.particleFactory.createParticleBatch(this.config.current.particleCount);
        
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
        // Calculate average mass
        let totalMass = 0;
        let totalClusters = 0;
        let particlesInClusters = 0;
        
        for (let particle of this.particles) {
            totalMass += particle.mass;
            totalClusters += particle.clusterCount;
            if (particle.inCluster) {
                particlesInClusters++;
            }
        }
        
        this.stats.averageMass = totalMass / this.particles.length;
        this.stats.clusterCount = totalClusters;
        this.stats.particlesInClusters = particlesInClusters;
        this.stats.distinctClusters = this.forceSystem.getDistinctClusterCount();
        this.stats.fps = frameRate();
    }
    
    /**
     * Render the simulation
     * @param {Renderer} renderer - The renderer instance to use
     */
    render(renderer) {
        if (renderer) {
            // Use the provided renderer
            renderer.render();
        } else {
            // Fallback to basic rendering if no renderer is provided
            background(240);
            
            // Draw each particle
            for (let particle of this.particles) {
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
