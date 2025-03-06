/**
 * Force module for calculating and applying forces between particles
 * Handles attraction, repulsion, and sticky forces
 */
class ForceSystem {
    constructor() {
        // Track clusters from previous frame to detect new cluster formations
        this.previousClusters = new Set();
        this.currentClusters = new Set();
    }
    
    /**
     * Calculate and apply forces between all particles
     * @param {Array} particles - Array of all particles in the simulation
     * @param {object} config - Current simulation configuration
     */
    applyForces(particles, config) {
        // Reset current clusters for this frame
        this.currentClusters.clear();
        
        // First pass: reset cluster status and apply forces
        for (let i = 0; i < particles.length; i++) {
            // Ensure each particle has an ID for cluster tracking
            if (particles[i].id === undefined || particles[i].id === null) {
                particles[i].id = i;
            }
            
            // Reset cluster status at the beginning of each frame
            if (typeof particles[i].setInCluster === 'function') {
                particles[i].setInCluster(false);
            } else {
                // Fallback for compatibility
                particles[i].inCluster = false;
            }
            
            for (let j = i + 1; j < particles.length; j++) {
                this.applyForceBetweenParticles(particles[i], particles[j], config);
            }
        }
        
        // Second pass: detect new clusters and update cluster counts
        // Find clusters that are new in this frame but weren't in the previous frame
        for (const clusterId of this.currentClusters) {
            if (!this.previousClusters.has(clusterId)) {
                // This is a new cluster formation
                const particleIds = clusterId.split('-').map(id => parseInt(id));
                
                // Increment cluster count for all particles in this new cluster
                for (const id of particleIds) {
                    if (id >= 0 && id < particles.length) {
                        if (typeof particles[id].incrementClusterCount === 'function') {
                            particles[id].incrementClusterCount();
                        } else {
                            // Fallback for compatibility
                            particles[id].clusterCount++;
                        }
                    }
                }
            }
        }
        
        // Update previous clusters for next frame comparison
        this.previousClusters = new Set(this.currentClusters);
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
        
        // Check if particles should repulse based on the repulsion delay
        const p1ShouldRepulse = p1.shouldRepulse === true;
        const p2ShouldRepulse = p2.shouldRepulse === true;
        
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
            // Only apply repulsion if the repulsion delay has expired for either particle
            if (p1ShouldRepulse || p2ShouldRepulse) {
                // Repulsive force: F = -k_r * (m1 * m2) / r^2
                forceMagnitude = -config.repulsionCoefficient * (p1.mass * p2.mass) / (distance * distance);
            } else {
                // Otherwise, apply a weak attractive force to maintain the cluster
                forceMagnitude = config.stickyForceCoefficient * 0.5 * 
                    (p1.mass * p2.mass) / Math.pow(distance, config.stickyForcePower);
            }
        }
        
        // Scale the force vector by the calculated magnitude
        force.mult(forceMagnitude);
        
        // Apply the force to both particles (equal and opposite)
        p1.applyForce(force);
        p2.applyForce(p5.Vector.mult(force, -1));
        
        // Check if particles are close enough to be considered in a cluster
        if (distance < config.thresholdDistance * 0.8) {
            // Create a unique cluster identifier using particle indices
            // Sort the indices to ensure the same cluster has the same ID regardless of order
            const clusterID = [p1.id, p2.id].sort().join('-');
            this.currentClusters.add(clusterID);
            
            // Count particles in this cluster (approximate)
            const clusterSize = this.getApproximateClusterSize(p1.id, p2.id);
            
            // Mark particles as being in a cluster with cluster size information
            if (typeof p1.setInCluster === 'function') {
                p1.setInCluster(true, clusterSize, config);
            } else {
                // Fallback for compatibility
                p1.inCluster = true;
            }
            
            if (typeof p2.setInCluster === 'function') {
                p2.setInCluster(true, clusterSize, config);
            } else {
                // Fallback for compatibility
                p2.inCluster = true;
            }
        }
    }
    
    /**
     * Get an approximate size of a cluster containing the given particles
     * @param {number} id1 - ID of the first particle
     * @param {number} id2 - ID of the second particle
     * @returns {number} - Approximate size of the cluster
     */
    getApproximateClusterSize(id1, id2) {
        // Count how many clusters contain either of these particles
        let count = 0;
        
        // Check all current clusters for connections to these particles
        for (const clusterId of this.currentClusters) {
            const particleIds = clusterId.split('-').map(id => parseInt(id));
            if (particleIds.includes(id1) || particleIds.includes(id2)) {
                count++;
            }
        }
        
        // Return count + 1 (the two particles themselves form a cluster)
        return count + 1;
    }
}
