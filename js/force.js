/**
 * Force module for calculating and applying forces between particles
 * Handles attraction, repulsion, and sticky forces
 */
class ForceSystem {
    /**
     * Calculate and apply forces between all particles
     * @param {Array} particles - Array of all particles in the simulation
     * @param {object} config - Current simulation configuration
     */
    applyForces(particles, config) {
        // Loop through all pairs of particles
        for (let i = 0; i < particles.length; i++) {
            // Reset cluster status at the beginning of each frame
            particles[i].leaveCluster();
            
            for (let j = i + 1; j < particles.length; j++) {
                this.applyForceBetweenParticles(particles[i], particles[j], config);
            }
        }
    }
    
    /**
     * Calculate and apply forces between two particles
     * @param {Particle} p1 - First particle
     * @param {Particle} p2 - Second particle
     * @param {object} config - Current simulation configuration
     */
    applyForceBetweenParticles(p1, p2, config) {
        // Calculate distance between particles
        const force = p5.Vector.sub(p2.position, p1.position);
        const distance = force.mag();
        
        // Skip if particles are at the same position
        if (distance === 0) return;
        
        // Normalize the force vector
        force.normalize();
        
        // Calculate force magnitude based on distance
        let forceMagnitude = 0;
        
        // Check if distance is greater than threshold (attraction) or less (repulsion)
        if (distance > config.thresholdDistance) {
            // Attractive force: F = k_a * (m1 * m2) / r^2
            forceMagnitude = config.attractionCoefficient * (p1.mass * p2.mass) / (distance * distance);
            
            // Apply sticky force at very close distances
            if (distance < config.thresholdDistance * 1.2) {
                // Sticky force: F = k_s * (m1 * m2) / r^p
                const stickyForceMagnitude = config.stickyForceCoefficient * 
                    (p1.mass * p2.mass) / Math.pow(distance, config.stickyForcePower);
                forceMagnitude += stickyForceMagnitude;
            }
        } else {
            // Repulsive force: F = -k_r * (m1 * m2) / r^2
            forceMagnitude = -config.repulsionCoefficient * (p1.mass * p2.mass) / (distance * distance);
        }
        
        // Scale the force vector by the calculated magnitude
        force.mult(forceMagnitude);
        
        // Apply the force to both particles (equal and opposite)
        p1.applyForce(force);
        p2.applyForce(p5.Vector.mult(force, -1));
        
        // Check if particles are close enough to be considered in a cluster
        if (distance < config.thresholdDistance * 0.8) {
            p1.joinCluster();
            p2.joinCluster();
        }
    }
}
