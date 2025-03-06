/**
 * Particle class representing a single particle in the simulation
 * Handles position, velocity, mass, and cluster count
 */
class Particle {
    /**
     * Create a new particle
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {number} mass - Initial mass
     */
    constructor(x, y, mass) {
        // Position and movement
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        
        // Physical properties
        this.mass = mass;
        this.clusterCount = 0;
        this.inCluster = false;
        this.clusterTime = 0;
        this.isolationTime = 0;
        
        // Unique ID for cluster tracking (will be set by ForceSystem)
        this.id = null;
        
        // Future: affinity/attribute property
        this.affinity = null; // Will be implemented in future stages
    }
    
    /**
     * Apply a force to the particle
     * @param {p5.Vector} force - Force vector to apply
     */
    applyForce(force) {
        // F = ma, so a = F/m
        const f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    }
    
    /**
     * Update particle position and velocity based on forces
     * @param {object} config - Current simulation configuration
     */
    update(config) {
        // Update velocity based on acceleration
        this.velocity.add(this.acceleration);
        
        // Limit maximum speed
        this.velocity.limit(config.maxSpeed);
        
        // Update position based on velocity
        this.position.add(p5.Vector.mult(this.velocity, config.timeStep));
        
        // Reset acceleration for next frame
        this.acceleration.mult(0);
        
        // Handle boundary conditions (wrap around edges)
        this.handleBoundaries(config);
        
        // Update mass based on clustering status
        this.updateMass(config);
    }
    
    /**
     * Handle boundary conditions (wrap around edges)
     * @param {object} config - Current simulation configuration
     */
    handleBoundaries(config) {
        if (this.position.x < 0) {
            this.position.x = config.canvasWidth;
        } else if (this.position.x > config.canvasWidth) {
            this.position.x = 0;
        }
        
        if (this.position.y < 0) {
            this.position.y = config.canvasHeight;
        } else if (this.position.y > config.canvasHeight) {
            this.position.y = 0;
        }
    }
    
    /**
     * Update particle mass based on clustering status
     * @param {object} config - Current simulation configuration
     */
    updateMass(config) {
        if (this.inCluster) {
            this.clusterTime++;
            this.isolationTime = 0;
            
            // Increase mass when in cluster
            if (this.mass < config.maxMass) {
                this.mass += config.massGainRate;
            }
        } else {
            this.isolationTime++;
            this.clusterTime = 0;
            
            // Decrease mass when isolated
            if (this.mass > config.minMass) {
                this.mass -= config.massLossRate;
            }
        }
    }
    
    /**
     * Set the particle's cluster status
     * @param {boolean} status - Whether the particle is in a cluster
     */
    setInCluster(status) {
        this.inCluster = status;
    }
    
    /**
     * Increment the cluster count when a new cluster is formed
     * This is called by the ForceSystem when a new cluster is detected
     */
    incrementClusterCount() {
        this.clusterCount++;
    }
    
    /**
     * Display the particle
     */
    display() {
        // Map cluster count to color (HSB color mode)
        // Use a wider range and cycle through the color spectrum
        // Start with blue (240), through green, yellow, red, and then cycle to magenta
        const maxClusterCount = 100; // Increased from 20 to 100
        
        // Calculate hue: blue (240) -> cyan -> green -> yellow -> red (0) -> magenta
        // This creates a full 360° color cycle for better visual distinction
        let hue;
        if (this.clusterCount <= maxClusterCount) {
            // Map 0-100 to 240-0 (blue to red)
            hue = map(this.clusterCount, 0, maxClusterCount, 240, 0);
        } else {
            // For counts > 100, cycle through red to magenta (0-300)
            hue = map(this.clusterCount % maxClusterCount, 0, maxClusterCount, 0, 300);
        }
        
        const saturation = 80;
        const brightness = 90;
        
        // Set fill color based on cluster count
        colorMode(HSB, 360, 100, 100);
        fill(hue, saturation, brightness);
        stroke(0, 0, 0, 100);
        strokeWeight(1);
        
        // Draw circle with size based on mass
        circle(this.position.x, this.position.y, this.mass * 2);
        
        // Reset color mode to default
        colorMode(RGB, 255, 255, 255);
    }
}
