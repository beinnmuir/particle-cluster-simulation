# Implementation Guide for Rod-Shaped Particles Using a Selective Three-Point Model

## 1. Overview

This document describes how to add a new rod-shaped particle class to the simulation. The new class will represent rod-shaped molecules using three key points (two endpoints and a midpoint) but will compute inter-particle forces by selectively choosing the point on the rod that is closest to the interacting body. In addition to linear dynamics, the rod class will include rotational properties (orientation, angular velocity, etc.) to simulate torque when forces are applied off-center.

## 2. High-Level Architecture Changes

**New Modules / Files:**
- **RodParticle.js:**  
  Contains the `RodParticle` class that extends or composes the base functionality from the existing `Particle` class. It will add rod-specific properties (e.g., endpoints, orientation, angular velocity).

- **RotationalPhysics.js (or update existing):**  
  Contains functions to compute torque and update angular motion for rod-shaped particles.

**Factory Update:**
- **ParticleFactory.js (if available):**  
  Update or extend the factory pattern so that it can instantiate either a spherical particle or a rod-shaped particle based on configuration.

**Force Module Update:**
- **Force.js:**  
  Extend the force calculations to handle rod interactions. Implement logic to determine the closest interaction point from the three key points on a rod when computing forces.

**Renderer Update:**
- **render.js:**  
  Add logic to draw rod-shaped particles (e.g., as lines or rectangles) that visually represent orientation and length.

---

## 3. Step-by-Step Implementation

### Step 1: Create the RodParticle Class

1. **File Creation:**  
   Create a new file called `RodParticle.js` in your `modules/` directory.

2. **Class Definition:**  
   Define a new class `RodParticle` that extends the base `Particle` class or implements similar interfaces. Add the following properties:
   - **Endpoints:**  
     - `pointA`: Position vector for one endpoint.
     - `pointB`: Position vector for the other endpoint.
   - **Midpoint/COM:**  
     - `center`: Position vector (can be computed as the average of `pointA` and `pointB`).
   - **Orientation & Angular Properties:**  
     - `angle`: Current orientation in radians.
     - `angularVelocity`: Rotational speed.
     - `angularAcceleration`: For torque-induced changes.
   - **Length:**  
     - `length`: Distance between endpoints.

3. **Selective Force Calculation Method:**  
   Implement a method (e.g., `getInteractionPoint(targetPosition)`) that:
   - Calculates the distance from `targetPosition` (the interacting body) to each of the three points (`pointA`, `center`, `pointB`).
   - Returns the point with the minimum distance.


### Step 2: Update the Particle Factory

- Modify `ParticleFactory.js` to allow creation of `RodParticle` instances when specified in the configuration.

### Step 3: Extend Force Calculations

- Modify `Force.js` to:
  - Use `getInteractionPoint(targetPosition)` to determine the closest interaction points.
  - Compute forces based on these selected points.
  - Apply force at the point, inducing both linear acceleration and torque.

### Step 4: Update Rotational Dynamics

- Modify `RotationalPhysics.js` to:
  - Update angular velocity based on applied torques.
  - Implement damping and stability mechanisms if needed.

### Step 5: Update the Renderer

- Modify `render.js` to draw rods as lines or rectangles between `pointA` and `pointB`.

### Step 6: Testing and Validation

- Ensure rods respond correctly to forces and torques.
- Validate smooth transitions between active interaction points.
- Monitor performance to confirm efficiency gains.

---

## 4. Conclusion

This guide provides a structured approach to integrating rod-shaped particles using a selective three-point interaction model. By keeping modularity in mind, these additions will fit seamlessly into the existing simulation architecture while maintaining computational efficiency.
