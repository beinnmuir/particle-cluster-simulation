/**
 * Visualization module
 * Handles rendering particles and visual effects
 */
class Renderer {
    /**
     * Create a new renderer
     * @param {SimulationManager} simulation - The simulation manager
     * @param {object} config - Configuration object
     */
    constructor(simulation, config) {
        this.simulation = simulation;
        this.config = config;
        this.showForceVectors = false; // Debug option to show force vectors
    }
    
    /**
     * Render the simulation
     */
    render() {
        // Clear background
        background(240);
        
        // Draw particles first
        for (let particle of this.simulation.particles) {
            this.renderParticle(particle);
        }
        
        // Draw connections between particles on top (if debug is enabled)
        if (this.showForceVectors) {
            this.renderForceVectors();
        }
        
        // Draw cluster statistics
        this.renderClusterStats();
    }
    
    /**
     * Render a single particle
     * @param {Particle} particle - The particle to render
     */
    renderParticle(particle) {
        // Set color mode to HSB for more intuitive color mapping
        colorMode(HSB, 360, 100, 100);
        
        // Calculate size multiplier based on mass
        let sizeMultiplier = 2;
        if (particle.inCluster && particle.clusterSize > 1) {
            // Add a small bonus to size based on cluster size (max +0.5)
            sizeMultiplier += map(Math.min(particle.clusterSize, 20), 1, 20, 0, 0.5);
        }
        
        // Calculate colors for main fill (based on cluster count history)
        const maxClusterCount = 100;
        let mainHue;
        if (particle.clusterCount <= maxClusterCount) {
            // Map 0-100 to 240-0 (blue to red)
            mainHue = map(particle.clusterCount, 0, maxClusterCount, 240, 0);
        } else {
            // For counts > 100, cycle through red to magenta (0-300)
            mainHue = map(particle.clusterCount % maxClusterCount, 0, maxClusterCount, 0, 300);
        }
        
        // Draw outer ring if particle is in a cluster
        if (particle.inCluster && particle.clusterSize > 1) {
            // Calculate ring color based on current cluster size
            let ringHue;
            // Set max cluster size to 80% of total particle count
            const maxClusterSize = Math.floor(this.simulation.particles.length * 0.8);
            
            // Map cluster sizes to color ranges
            // Small clusters (2-20% of max): blue to cyan (240-180)
            // Medium clusters (20-50% of max): cyan to yellow (180-60)
            // Large clusters (50-100% of max): yellow to red (60-0)
            const smallThreshold = Math.max(2, Math.floor(maxClusterSize * 0.2));
            const mediumThreshold = Math.floor(maxClusterSize * 0.5);
            
            if (particle.clusterSize <= smallThreshold) {
                ringHue = map(particle.clusterSize, 2, smallThreshold, 240, 180);
            } else if (particle.clusterSize <= mediumThreshold) {
                ringHue = map(particle.clusterSize, smallThreshold, mediumThreshold, 180, 60);
            } else {
                ringHue = map(Math.min(particle.clusterSize, maxClusterSize), mediumThreshold, maxClusterSize, 60, 0);
            }
            
            // Calculate base particle size
            const baseSize = particle.mass * sizeMultiplier;
            
            // Fixed pixel size for glow
            const glowPixels = 4; // How many pixels the glow extends outward
            
            // Draw outer glow effect
            noStroke();
            fill(ringHue, 60, 70, 30);
            circle(particle.position.x, particle.position.y, baseSize + (glowPixels * 2)); // *2 because we add pixels to both sides
        }
        
        // Draw main particle circle
        noStroke();
        fill(mainHue, 60, 70);
        circle(particle.position.x, particle.position.y, particle.mass * sizeMultiplier);
        
        // Reset color mode to default
        colorMode(RGB, 255, 255, 255);
    }
    
    /**
     * Render force vectors (debug visualization)
     */
    renderForceVectors() {
        // This is a debug visualization that shows connections between particles in clusters
        
        // Get the force system to access cluster information
        const forceSystem = this.simulation.forceSystem;
        if (!forceSystem) return;
        
        // Draw lines between particles that are in the same cluster
        for (let i = 0; i < this.simulation.particles.length; i++) {
            const p1 = this.simulation.particles[i];
            
            if (p1.inCluster && p1.clusterSize > 1) {
                for (let j = i + 1; j < this.simulation.particles.length; j++) {
                    const p2 = this.simulation.particles[j];
                    
                    // Check if particles are in the same cluster
                    const sameCluster = forceSystem.particleClusterMap && 
                                       forceSystem.particleClusterMap.has(p1.id) && 
                                       forceSystem.particleClusterMap.has(p2.id) && 
                                       forceSystem.particleClusterMap.get(p1.id) === forceSystem.particleClusterMap.get(p2.id);
                    
                    if (sameCluster) {
                        const distance = p5.Vector.dist(p1.position, p2.position);
                        
                        if (distance < this.config.current.thresholdDistance * 1.2) {
                            // Color and thickness based on cluster size
                            const clusterSize = p1.clusterSize;
                            const alpha = map(clusterSize, 2, 20, 80, 150);
                            const weight = 1; // Set a constant line thickness
                            
                            // Use HSB color mode for more intuitive color mapping
                            colorMode(HSB, 360, 100, 100);
                            
                            // Determine color based on cluster size (same logic as particle color)
                            // Use the same color mapping as particle rings
                            const maxSize = Math.floor(this.simulation.particles.length * 0.8);
                            const smallThresh = Math.max(2, Math.floor(maxSize * 0.2));
                            const mediumThresh = Math.floor(maxSize * 0.5);
                            
                            let hue;
                            if (clusterSize <= smallThresh) {
                                hue = map(clusterSize, 2, smallThresh, 240, 180);
                            } else if (clusterSize <= mediumThresh) {
                                hue = map(clusterSize, smallThresh, mediumThresh, 180, 60);
                            } else {
                                hue = map(Math.min(clusterSize, maxSize), mediumThresh, maxSize, 60, 0);
                            }
                            
                            stroke(hue, 70, 90, alpha);
                            strokeWeight(weight);
                            line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
                            
                            // Reset color mode
                            colorMode(RGB, 255, 255, 255);
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Toggle debug visualization
     */
    toggleForceVectors() {
        this.showForceVectors = !this.showForceVectors;
    }
    
    /**
     * Render cluster statistics
     * Shows information about clusters in the simulation
     */
    renderClusterStats() {
        // Get the force system to access cluster information
        const forceSystem = this.simulation.forceSystem;
        if (!forceSystem) return;
        
        // Set text properties
        fill(0);
        noStroke();
        textSize(14);
        textAlign(LEFT, TOP);
        
        // Display number of distinct clusters
        const clusterCount = forceSystem.getDistinctClusterCount();
        text(`Distinct Clusters: ${clusterCount}`, 10, 10);
        
        // Display cluster size distribution if there are clusters
        if (clusterCount > 0 && forceSystem.clusterSizes) {
            let y = 30;
            
            // Group clusters by size range
            const smallClusters = Array.from(forceSystem.clusterSizes.values()).filter(size => size <= 5).length;
            const mediumClusters = Array.from(forceSystem.clusterSizes.values()).filter(size => size > 5 && size <= 15).length;
            const largeClusters = Array.from(forceSystem.clusterSizes.values()).filter(size => size > 15).length;
            
            // Display distribution
            text(`Small Clusters (2-5): ${smallClusters}`, 10, y);
            y += 20;
            text(`Medium Clusters (6-15): ${mediumClusters}`, 10, y);
            y += 20;
            text(`Large Clusters (16+): ${largeClusters}`, 10, y);
            
            // Find the largest cluster
            const largestClusterSize = Math.max(...Array.from(forceSystem.clusterSizes.values()));
            y += 20;
            text(`Largest Cluster: ${largestClusterSize} particles`, 10, y);
        }
    }
}
