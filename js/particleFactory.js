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
     * @param {string} type - Type of particle to create ('circular' or 'rod')
     * @returns {Particle} A new particle instance
     */
    createRandomParticle(type = 'circular') {
        const x = random(this.config.current.canvasWidth);
        const y = random(this.config.current.canvasHeight);
        const mass = this.config.current.initialMass;
        
        let particle;
        if (type === 'rod') {
            const length = this.config.current.rodLength || 20; // Default rod length if not specified
            const angle = random(TWO_PI); // Random initial orientation
            particle = new RodParticle(x, y, length, angle, mass);
        } else {
            particle = new Particle(x, y, mass);
        }
        
        particle.id = this.particleCount++; // Assign unique ID
        return particle;
    }

    /**
     * Create a particle at a specific position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {Object} options - Additional options
     * @param {number} options.mass - Particle mass (optional)
     * @param {string} options.type - Type of particle ('circular' or 'rod')
     * @param {number} options.length - Length for rod particles
     * @param {number} options.angle - Initial angle for rod particles in radians
     * @returns {Particle} A new particle instance
     */
    createParticleAtPosition(x, y, options = {}) {
        const mass = options.mass || this.config.current.initialMass;
        let particle;

        if (options.type === 'rod') {
            const length = options.length || this.config.current.rodLength || 20;
            const angle = options.angle !== undefined ? options.angle : random(TWO_PI);
            particle = new RodParticle(x, y, length, angle, mass);
        } else {
            particle = new Particle(x, y, mass);
        }

        particle.id = this.particleCount++;
        return particle;
    }

    /**
     * Create multiple particles with random positions
     * @param {number} count - Number of particles to create
     * @param {Object} options - Creation options
     * @param {string} options.type - Type of particles to create ('circular' or 'rod')
     * @param {number} options.rodRatio - Ratio of rod particles (0-1) when mixing types
     * @returns {Array<Particle>} Array of new particle instances
     */
    createParticleBatch(count, options = {}) {
        const particles = [];
        const type = options.type || 'circular';
        const rodRatio = options.rodRatio || 0;

        for (let i = 0; i < count; i++) {
            if (type === 'mixed') {
                // Create a mix of circular and rod particles based on rodRatio
                const particleType = Math.random() < rodRatio ? 'rod' : 'circular';
                particles.push(this.createRandomParticle(particleType));
            } else {
                particles.push(this.createRandomParticle(type));
            }
        }
        return particles;
    }

    /**
     * Create a rod particle with random position
     * @returns {RodParticle} A new rod particle instance
     */
    createRandomRodParticle() {
        return this.createRandomParticle('rod');
    }

    /**
     * Reset the particle counter
     * Useful when reinitializing the simulation
     */
    reset() {
        this.particleCount = 0;
    }
}
