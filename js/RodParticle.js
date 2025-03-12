/**
 * RodParticle class representing a rod-shaped particle in the simulation
 * Extends the base Particle class with orientation and endpoints
 */
class RodParticle extends Particle {
    /**
     * Create a new rod particle
     * @param {number} x - Initial x position of center
     * @param {number} y - Initial y position of center
     * @param {number} length - Length of the rod
     * @param {number} angle - Initial angle in radians
     * @param {number} mass - Initial mass
     */
    constructor(x, y, length, angle, mass) {
        super(x, y, mass);
        
        // Rod-specific properties
        this.length = length;
        this.angle = angle || 0;
        this.pointA = createVector(0, 0);
        this.pointB = createVector(0, 0);
        
        // Rotational dynamics properties
        this.angularVelocity = 0;         // Angular velocity in radians per time step
        this.angularAcceleration = 0;     // Angular acceleration in radians per time step squared
        this.momentOfInertia = this.calculateMomentOfInertia(); // Moment of inertia
        
        // Initialize endpoints
        this.updateEndpoints();
    }

    /**
     * Calculate the moment of inertia for the rod
     * For a thin rod rotating about its center, I = (1/12) * m * L²
     * @returns {number} The moment of inertia
     */
    calculateMomentOfInertia() {
        // For a rod rotating about its center
        return (1/12) * this.mass * (this.length * this.length);
    }

    /**
     * Update the moment of inertia when mass changes
     */
    updateMomentOfInertia() {
        this.momentOfInertia = this.calculateMomentOfInertia();
    }

    /**
     * Update the positions of the rod endpoints based on center position and angle
     */
    updateEndpoints() {
        const halfLength = this.length / 2;
        const dx = halfLength * cos(this.angle);
        const dy = halfLength * sin(this.angle);

        this.pointA.set(
            this.position.x + dx,
            this.position.y + dy
        );
        this.pointB.set(
            this.position.x - dx,
            this.position.y - dy
        );
    }

    /**
     * Get the closest point on the rod to a target position
     * @param {p5.Vector} targetPosition - Position to check against
     * @returns {p5.Vector} The closest point (either pointA, center, or pointB)
     */
    getInteractionPoint(targetPosition) {
        const distToA = p5.Vector.dist(targetPosition, this.pointA);
        const distToCenter = p5.Vector.dist(targetPosition, this.position);
        const distToB = p5.Vector.dist(targetPosition, this.pointB);
        
        if (distToA <= distToCenter && distToA <= distToB) {
            return this.pointA.copy();
        } else if (distToB <= distToCenter && distToB <= distToA) {
            return this.pointB.copy();
        }
        return this.position.copy();
    }

    /**
     * Apply a force at a specific point on the rod
     * This will calculate both linear and angular effects
     * @param {p5.Vector} force - Force vector to apply
     * @param {p5.Vector} applicationPoint - Point where the force is applied
     */
    applyForceAtPoint(force, applicationPoint) {
        // Apply linear force (affects center of mass)
        this.applyForce(force);
        
        // Calculate torque
        // τ = r × F where r is the vector from center to application point
        const r = p5.Vector.sub(applicationPoint, this.position);
        
        // In 2D, torque is a scalar: τ = r × F = r_x * F_y - r_y * F_x
        const torque = r.x * force.y - r.y * force.x;
        
        // Apply torque: angular acceleration = torque / moment of inertia
        this.applyTorque(torque);
    }
    
    /**
     * Apply torque to the rod
     * @param {number} torque - Torque to apply (scalar in 2D)
     */
    applyTorque(torque) {
        // τ = I·α, so α = τ/I
        const angularAccel = torque / this.momentOfInertia;
        this.angularAcceleration += angularAccel;
    }

    /**
     * Override the update method to handle rod-specific updates including rotation
     * @param {object} config - Current simulation configuration
     */
    update(config) {
        // Call parent update for basic physics (linear motion)
        super.update(config);
        
        // Apply rotational dampening (similar to linear dampening in Particle class)
        if (config.dampeningCoefficient > 0) {
            // Create a dampening torque proportional to angular velocity but in opposite direction
            // τ_dampening = -c * ω
            // where c is the dampening coefficient and ω is the angular velocity
            const dampeningTorque = -config.dampeningCoefficient * this.angularVelocity;
            this.applyTorque(dampeningTorque);
        }
        
        // Update angular velocity based on angular acceleration
        this.angularVelocity += this.angularAcceleration;
        
        // Limit maximum angular velocity (optional)
        const maxAngularVelocity = 0.2; // Adjust as needed
        this.angularVelocity = constrain(this.angularVelocity, -maxAngularVelocity, maxAngularVelocity);
        
        // Update angle based on angular velocity
        this.angle += this.angularVelocity * config.timeStep;
        
        // Normalize angle to keep it between 0 and 2π
        this.angle = this.angle % TWO_PI;
        if (this.angle < 0) this.angle += TWO_PI;
        
        // Reset angular acceleration for next frame
        this.angularAcceleration = 0;
        
        // Update moment of inertia if mass has changed
        this.updateMomentOfInertia();
        
        // Update endpoint positions after movement and rotation
        this.updateEndpoints();
    }
    
    /**
     * Override the updateMass method to also update moment of inertia
     * @param {object} config - Current simulation configuration
     */
    updateMass(config) {
        // Call parent method to update mass
        super.updateMass(config);
        
        // Update moment of inertia based on new mass
        this.updateMomentOfInertia();
    }
    
    /**
     * Override the display method to render the rod
     */
    display() {
        // Set color based on cluster properties (similar to parent class)
        const maxClusterCount = 100;
        let hue;
        
        if (this.inCluster && this.clusterSize > 1) {
            const maxClusterSize = 30;
            if (this.clusterSize <= 5) {
                hue = map(this.clusterSize, 1, 5, 240, 180);
            } else if (this.clusterSize <= 15) {
                hue = map(this.clusterSize, 6, 15, 180, 60);
            } else {
                hue = map(Math.min(this.clusterSize, maxClusterSize), 16, maxClusterSize, 60, 300);
            }
        } else {
            if (this.clusterCount <= maxClusterCount) {
                hue = map(this.clusterCount, 0, maxClusterCount, 240, 0);
            } else {
                hue = map(this.clusterCount % maxClusterCount, 0, maxClusterCount, 0, 300);
            }
        }
        
        const saturation = 80;
        const brightness = 90;
        
        // Set fill and stroke
        colorMode(HSB, 360, 100, 100);
        fill(hue, saturation, brightness);
        stroke(0, 0, 0, 100);
        strokeWeight(1);
        
        // Draw the rod as a rectangle
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        rectMode(CENTER);
        rect(0, 0, this.length, this.mass * 0.8); // Width = length, height based on mass
        pop();
        
        // Reset color mode
        colorMode(RGB, 255, 255, 255);
    }
}
