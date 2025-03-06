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
        
        // Draw particles
        for (let particle of this.simulation.particles) {
            this.renderParticle(particle);
        }
        
        // Draw debug information if enabled
        if (this.showForceVectors) {
            this.renderForceVectors();
        }
    }
    
    /**
     * Render a single particle
     * @param {Particle} particle - The particle to render
     */
    renderParticle(particle) {
        // Map cluster count to color (HSB color mode)
        // Use a wider range and cycle through the color spectrum
        // Start with blue (240), through green, yellow, red, and then cycle to magenta
        const maxClusterCount = 100; // Increased from 20 to 100
        
        // Calculate hue: blue (240) -> cyan -> green -> yellow -> red (0) -> magenta
        // This creates a full 360° color cycle for better visual distinction
        let hue;
        if (particle.clusterCount <= maxClusterCount) {
            // Map 0-100 to 240-0 (blue to red)
            hue = map(particle.clusterCount, 0, maxClusterCount, 240, 0);
        } else {
            // For counts > 100, cycle through red to magenta (0-300)
            hue = map(particle.clusterCount % maxClusterCount, 0, maxClusterCount, 0, 300);
        }
        
        const saturation = 80;
        const brightness = 90;
        
        // Set fill color based on cluster count
        colorMode(HSB, 360, 100, 100);
        fill(hue, saturation, brightness);
        
        // Add a subtle glow effect for particles in clusters
        if (particle.inCluster) {
            // Draw a larger, semi-transparent circle for glow effect
            noStroke();
            fill(hue, saturation, brightness, 30);
            circle(particle.position.x, particle.position.y, particle.mass * 3);
            
            // Draw repulsion timer indicator
            if (particle.repulsionTimer > 0 && this.config.current.repulsionDelay > 0) {
                // Calculate progress as a percentage
                const progress = particle.repulsionTimer / this.config.current.repulsionDelay;
                
                // Draw arc showing timer progress
                noFill();
                const arcColor = particle.shouldRepulse ? color(255, 0, 0) : color(0, 255, 0);
                stroke(arcColor);
                strokeWeight(2);
                const arcRadius = particle.mass * 1.5;
                arc(
                    particle.position.x,
                    particle.position.y,
                    arcRadius * 2,
                    arcRadius * 2,
                    0,
                    TWO_PI * progress
                );
            }
            
            // Draw the main particle with a brighter color
            noStroke();
            fill(hue, saturation, brightness);
        }
        
        // Draw particle outline
        stroke(0, 0, 0, 100);
        strokeWeight(1);
        
        // Draw the main particle circle with size based on mass
        circle(particle.position.x, particle.position.y, particle.mass * 2);
        
        // Reset color mode to default
        colorMode(RGB, 255, 255, 255);
    }
    
    /**
     * Render force vectors (debug visualization)
     */
    renderForceVectors() {
        // This is a debug visualization that would show force vectors between particles
        // Implementation would depend on how force data is stored/accessed
        stroke(255, 0, 0, 100);
        strokeWeight(0.5);
        
        // Example: Draw lines between particles that are in clusters
        for (let i = 0; i < this.simulation.particles.length; i++) {
            const p1 = this.simulation.particles[i];
            
            if (p1.inCluster) {
                for (let j = i + 1; j < this.simulation.particles.length; j++) {
                    const p2 = this.simulation.particles[j];
                    
                    if (p2.inCluster) {
                        const distance = p5.Vector.dist(p1.position, p2.position);
                        
                        if (distance < this.config.current.thresholdDistance) {
                            line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
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
}
