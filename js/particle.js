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
        
        // Repulsion delay tracking
        this.repulsionTimer = 0;
        this.shouldRepulse = false;
        this.lastClusterSize = 0;
        
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
        // Apply dampening force (fluid resistance/friction)
        if (config.dampeningCoefficient > 0) {
            // Create a dampening force proportional to velocity but in opposite direction
            // F_dampening = -c * v
            // where c is the dampening coefficient and v is the velocity
            const dampeningForce = this.velocity.copy();
            dampeningForce.mult(-config.dampeningCoefficient);
            this.applyForce(dampeningForce);
        }
        
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
            
            // Update repulsion timer and check if it's time to repulse
            if (this.repulsionTimer < config.repulsionDelay) {
                this.repulsionTimer++;
                this.shouldRepulse = false;
            } else {
                this.shouldRepulse = true;
            }
            
            // Increase mass when in cluster
            if (this.mass < config.maxMass) {
                this.mass += config.massGainRate;
            }
        } else {
            this.isolationTime++;
            this.clusterTime = 0;
            this.repulsionTimer = 0;
            this.shouldRepulse = false;
            
            // Decrease mass when isolated
            if (this.mass > config.minMass) {
                this.mass -= config.massLossRate;
            }
        }
    }
    
    /**
     * Set the particle's cluster status
     * @param {boolean} status - Whether the particle is in a cluster
     * @param {number} clusterSize - The size of the cluster (optional)
     * @param {object} config - Current simulation configuration (optional)
     */
    setInCluster(status, clusterSize = 0, config = null) {
        // If joining a cluster
        if (status && !this.inCluster) {
            this.inCluster = true;
            this.shouldRepulse = false;
            this.repulsionTimer = 0;
        } 
        // If already in a cluster
        else if (status && this.inCluster) {
            // If cluster size increased, extend the repulsion delay
            if (config && clusterSize > this.lastClusterSize) {
                this.repulsionTimer = Math.min(
                    this.repulsionTimer + config.repulsionDelayIncrease,
                    config.maxRepulsionDelay
                );
            }
        }
        // If leaving a cluster
        else if (!status && this.inCluster) {
            this.inCluster = false;
            this.shouldRepulse = false;
            this.repulsionTimer = 0;
        }
        
        // Update last known cluster size
        if (clusterSize > 0) {
            this.lastClusterSize = clusterSize;
        }
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
