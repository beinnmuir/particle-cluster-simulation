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
        
        // Draw connections between particles first (if debug is enabled)
        if (this.showForceVectors) {
            this.renderForceVectors();
        }
        
        // Draw particles on top of connections
        for (let particle of this.simulation.particles) {
            this.renderParticle(particle);
        }
        
        // Draw cluster statistics
        this.renderClusterStats();
    }
    
    /**
     * Render a single particle
     * @param {Particle} particle - The particle to render
     */
    renderParticle(particle) {
        // Use cluster size to determine color if in a cluster
        let hue, saturation, brightness;
        
        // Set color mode to HSB for more intuitive color mapping
        colorMode(HSB, 360, 100, 100);
        
        if (particle.inCluster && particle.clusterSize > 1) {
            // Map cluster size to hue: larger clusters = warmer colors
            // Small clusters (2-5): blue to cyan (240-180)
            // Medium clusters (6-15): cyan to green to yellow (180-60)
            // Large clusters (16+): yellow to red to magenta (60-300)
            const maxClusterSize = 30;
            
            if (particle.clusterSize <= 5) {
                hue = map(particle.clusterSize, 1, 5, 240, 180);
                saturation = 80;
                brightness = 90;
            } else if (particle.clusterSize <= 15) {
                hue = map(particle.clusterSize, 6, 15, 180, 60);
                saturation = 85;
                brightness = 95;
            } else {
                hue = map(Math.min(particle.clusterSize, maxClusterSize), 16, maxClusterSize, 60, 300);
                saturation = 90;
                brightness = 100;
            }
            
            // Draw a larger, semi-transparent circle for glow effect
            // Glow size scales with cluster size
            const glowSize = map(particle.clusterSize, 1, maxClusterSize, 3, 5);
            noStroke();
            fill(hue, saturation, brightness, 30);
            circle(particle.position.x, particle.position.y, particle.mass * glowSize);
            
            // Add a second glow layer for larger clusters
            if (particle.clusterSize > 10) {
                fill(hue, saturation, brightness, 15);
                circle(particle.position.x, particle.position.y, particle.mass * (glowSize + 1));
            }
            
            // Draw the main particle with a brighter color
            fill(hue, saturation, brightness);
        } else {
            // For isolated particles, use cluster count for color
            const maxClusterCount = 100;
            
            if (particle.clusterCount <= maxClusterCount) {
                // Map 0-100 to 240-0 (blue to red)
                hue = map(particle.clusterCount, 0, maxClusterCount, 240, 0);
            } else {
                // For counts > 100, cycle through red to magenta (0-300)
                hue = map(particle.clusterCount % maxClusterCount, 0, maxClusterCount, 0, 300);
            }
            
            saturation = 80;
            brightness = 90;
            
            fill(hue, saturation, brightness);
        }
        
        // Draw particle outline
        stroke(0, 0, 0, 100);
        strokeWeight(1);
        
        // Draw the main particle circle with size based on mass
        // For particles in clusters, slightly increase the size based on cluster size
        let sizeMultiplier = 2;
        if (particle.inCluster && particle.clusterSize > 1) {
            // Add a small bonus to size based on cluster size (max +0.5)
            sizeMultiplier += map(Math.min(particle.clusterSize, 20), 1, 20, 0, 0.5);
        }
        
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
                            const weight = map(clusterSize, 2, 20, 0.5, 1.5);
                            
                            // Use HSB color mode for more intuitive color mapping
                            colorMode(HSB, 360, 100, 100);
                            
                            // Determine color based on cluster size (same logic as particle color)
                            let hue;
                            if (clusterSize <= 5) {
                                hue = map(clusterSize, 1, 5, 240, 180);
                            } else if (clusterSize <= 15) {
                                hue = map(clusterSize, 6, 15, 180, 60);
                            } else {
                                hue = map(Math.min(clusterSize, 30), 16, 30, 60, 300);
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
