/**
 * Particle Factory class
 * Handles creation and configuration of particles in a centralized way
 */
class ParticleFactory {
    /**
     * Create a new particle factory
     * @param {object} config - Configuration object
     */
    constructor(config) {
        this.config = config;
        this.particleCount = 0; // Counter for generating unique IDs
    }

    /**
     * Create a basic particle with random position
     * @returns {Particle} A new particle instance
     */
    createRandomParticle() {
        const x = random(this.config.current.canvasWidth);
        const y = random(this.config.current.canvasHeight);
        const mass = this.config.current.initialMass;
        
        const particle = new Particle(x, y, mass);
        particle.id = this.particleCount++; // Assign unique ID
        return particle;
    }

    /**
     * Create a particle at a specific position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} mass - Particle mass (optional)
     * @returns {Particle} A new particle instance
     */
    createParticleAtPosition(x, y, mass = null) {
        const particleMass = mass || this.config.current.initialMass;
        const particle = new Particle(x, y, particleMass);
        particle.id = this.particleCount++;
        return particle;
    }

    /**
     * Create multiple particles with random positions
     * @param {number} count - Number of particles to create
     * @returns {Array<Particle>} Array of new particle instances
     */
    createParticleBatch(count) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(this.createRandomParticle());
        }
        return particles;
    }

    /**
     * Reset the particle counter
     * Useful when reinitializing the simulation
     */
    reset() {
        this.particleCount = 0;
    }
}
