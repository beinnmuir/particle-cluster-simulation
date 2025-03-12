# Particle System Documentation

## Overview

The particle system is the foundation of the simulation, handling the creation, properties, and behaviors of different particle types. It supports both circular and rod-shaped particles with realistic physics.

## Particle Types

### Circular Particles

Standard particles with position, velocity, and mass properties:

```javascript
class Particle {
    constructor(x, y, mass) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.mass = mass || 5;
        
        // Clustering properties
        this.inCluster = false;
        this.wasInCluster = false;
        this.clusterSize = 1;
        this.clusterCount = 0;
        
        // Repulsion properties
        this.shouldRepulse = false;
        this.wasRepulsing = false;
        this.repulsionTimer = 0;
        
        // Unique identifier
        this.id = -1;
    }
    
    // Methods for updating position, applying forces, etc.
}
```

### Rod Particles

Extended particles with rotational properties and torque handling:

```javascript
class RodParticle extends Particle {
    constructor(x, y, length, angle, mass) {
        super(x, y, mass);
        
        // Rod-specific properties
        this.length = length;
        this.angle = angle || 0;
        this.pointA = createVector(0, 0); // One endpoint
        this.pointB = createVector(0, 0); // Other endpoint
        
        // Rotational dynamics properties
        this.angularVelocity = 0;         // Angular velocity in radians per time step
        this.angularAcceleration = 0;     // Angular acceleration in radians per time step squared
        this.momentOfInertia = this.calculateMomentOfInertia();
    }
    
    // Methods for rotational dynamics
}
```

## Particle Factory

The `ParticleFactory` class centralizes particle creation with consistent configuration:

```javascript
class ParticleFactory {
    constructor(config) {
        this.config = config;
        this.particleCount = 0; // Counter for generating unique IDs
    }
    
    createRandomParticle(type) {
        const x = random(this.config.current.canvasWidth);
        const y = random(this.config.current.canvasHeight);
        const mass = this.config.current.initialMass;
        
        let particle;
        if (type === 'rod') {
            const length = this.config.current.rodLength || 20;
            const angle = random(TWO_PI);
            particle = new RodParticle(x, y, length, angle, mass);
        } else {
            particle = new Particle(x, y, mass);
        }
        
        particle.id = this.particleCount++;
        return particle;
    }
    
    createMixedParticles(count) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            const type = random() > 0.5 ? 'rod' : 'circular';
            particles.push(this.createRandomParticle(type));
        }
        return particles;
    }
}
```

## Key Particle Behaviors

### Force Application

Particles respond to forces according to Newton's laws:

```javascript
Particle.prototype.applyForce = function(force) {
    // F = ma, so a = F/m
    const f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
};
```

### Torque Application (Rod Particles)

Rod particles respond to torque for rotational motion:

```javascript
RodParticle.prototype.applyTorque = function(torque) {
    // τ = I*α, so α = τ/I
    this.angularAcceleration += torque / this.momentOfInertia;
};

RodParticle.prototype.applyForceAtPoint = function(force, applicationPoint) {
    // Apply linear force (affects center of mass)
    this.applyForce(force);
    
    // Calculate torque: τ = r × F
    const r = p5.Vector.sub(applicationPoint, this.position);
    const torque = r.x * force.y - r.y * force.x;
    
    this.applyTorque(torque);
};
```

### Interaction Point Detection (Rod Particles)

Rod particles use a three-point model for force interactions:

```javascript
RodParticle.prototype.getInteractionPoint = function(targetPosition) {
    const distToA = p5.Vector.dist(targetPosition, this.pointA);
    const distToCenter = p5.Vector.dist(targetPosition, this.position);
    const distToB = p5.Vector.dist(targetPosition, this.pointB);
    
    if (distToA <= distToCenter && distToA <= distToB) {
        return this.pointA.copy();
    } else if (distToB <= distToCenter && distToB <= distToA) {
        return this.pointB.copy();
    }
    return this.position.copy();
};
```

### Cluster State Management

Particles track their cluster membership and repulsion state:

```javascript
Particle.prototype.setInCluster = function(status) {
    // Store previous state before making changes
    this.wasInCluster = this.inCluster;
    this.wasRepulsing = this.shouldRepulse;
    
    // Only reset repulsion state when first joining a cluster
    if (status && !this.inCluster) {
        this.inCluster = true;
        this.shouldRepulse = false;
        this.repulsionTimer = 0;
    } else if (status && this.inCluster) {
        // Preserve repulsion state when already in a cluster
        this.inCluster = true;
    } else {
        this.inCluster = false;
    }
};
```

## Visualization

Particles are visualized differently based on their type and cluster properties:

### Circular Particles

```javascript
renderCircularParticle(particle, mainHue, ringHue) {
    const baseSize = particle.mass * 2;
    
    // Draw outer glow effect for particles in clusters
    if (particle.inCluster) {
        noStroke();
        fill(ringHue, 70, 80, 30);
        circle(particle.position.x, particle.position.y, baseSize + (this.glowPixels * 2));
    }
    
    // Draw the main particle
    noStroke();
    fill(mainHue, 60, 70);
    circle(particle.position.x, particle.position.y, baseSize);
}
```

### Rod Particles

```javascript
renderRodParticle(particle, mainHue, ringHue) {
    // Draw the rod with proper orientation
    push();
    translate(particle.position.x, particle.position.y);
    rotate(particle.angle);
    
    // Draw outer glow effect for particles in clusters
    if (particle.inCluster) {
        noStroke();
        fill(ringHue, 70, 80, 30);
        rectMode(CENTER);
        rect(0, 0, particle.length + (this.glowPixels * 2), particle.mass * 0.8 + (this.glowPixels * 2));
    }
    
    // Draw the main rod
    noStroke();
    fill(mainHue, 60, 70);
    rectMode(CENTER);
    rect(0, 0, particle.length, particle.mass * 0.8);
    pop();
}
```

## Recent Improvements

1. **Rod Particle Implementation**: Added rotational dynamics for rod-shaped particles
2. **Particle Factory Pattern**: Implemented centralized particle creation with consistent configuration
3. **Enhanced Particle Type Detection**: Improved type detection using both `instanceof` and property checking
4. **Interaction Point Model**: Implemented a three-point model for force interactions with rod particles
5. **Repulsion State Preservation**: Enhanced cluster state management to preserve repulsion state
