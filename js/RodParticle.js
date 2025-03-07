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
        
        // Initialize endpoints
        this.updateEndpoints();
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
     * Override the update method to handle rod-specific updates
     * @param {object} config - Current simulation configuration
     */
    update(config) {
        // Call parent update for basic physics
        super.update(config);
        
        // Update endpoint positions after movement
        this.updateEndpoints();
    }
}
