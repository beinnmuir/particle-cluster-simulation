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
        this.running = false;
        this.stats = {
            averageMass: 0,
            clusterCount: 0,
            fps: 0
        };
    }
    
    /**
     * Initialize the simulation with particles
     */
    initialize() {
        this.particles = [];
        
        // Create particles with random positions
        for (let i = 0; i < this.config.current.particleCount; i++) {
            const x = random(this.config.current.canvasWidth);
            const y = random(this.config.current.canvasHeight);
            const mass = this.config.current.initialMass;
            
            this.particles.push(new Particle(x, y, mass));
        }
        
        this.running = false;
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
    }
    
    /**
     * Update simulation statistics
     */
    updateStats() {
        // Calculate average mass
        let totalMass = 0;
        let totalClusters = 0;
        
        for (let particle of this.particles) {
            totalMass += particle.mass;
            totalClusters += particle.clusterCount;
        }
        
        this.stats.averageMass = totalMass / this.particles.length;
        this.stats.clusterCount = totalClusters;
        this.stats.fps = frameRate();
    }
    
    /**
     * Render all particles
     */
    render() {
        // Clear background
        background(240);
        
        // Draw each particle
        for (let particle of this.particles) {
            particle.display();
        }
    }
    
    /**
     * Resize the simulation canvas
     */
    resize(width, height) {
        this.config.current.canvasWidth = width;
        this.config.current.canvasHeight = height;
    }
}
