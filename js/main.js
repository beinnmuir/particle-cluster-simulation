/**
 * Main script for Particle Clustering Simulation
 * Sets up p5.js and initializes all components
 */

// Global variables
let simulationManager;
let uiController;
let renderer;

/**
 * p5.js setup function - runs once at the beginning
 */
function setup() {
    // Create canvas and place it in the simulation container
    const simulationContainer = select('#simulation-container');
    const canvas = createCanvas(
        config.current.canvasWidth,
        config.current.canvasHeight
    );
    canvas.parent(simulationContainer);
    
    // Initialize simulation components
    simulationManager = new SimulationManager(config);
    renderer = new Renderer(simulationManager, config);
    uiController = new UIController(simulationManager, config);
    
    // Initialize simulation and UI
    simulationManager.initialize();
    uiController.initialize();
    
    // Set framerate
    frameRate(60);
}

/**
 * p5.js draw function - runs every frame
 */
function draw() {
    // Update simulation if running
    simulationManager.update();
    
    // Render simulation
    renderer.render();
    
    // Update UI statistics
    uiController.updateStats();
}

/**
 * p5.js windowResized function - runs when window is resized
 */
function windowResized() {
    // Calculate new canvas size (accounting for UI height)
    const newWidth = windowWidth;
    const newHeight = windowHeight - 100; // Account for controls
    
    // Resize canvas
    resizeCanvas(newWidth, newHeight);
    
    // Update simulation dimensions
    simulationManager.resize(newWidth, newHeight);
}

/**
 * p5.js keyPressed function - handle keyboard input
 */
function keyPressed() {
    // Space bar toggles simulation
    if (key === ' ') {
        if (simulationManager.running) {
            simulationManager.pause();
        } else {
            simulationManager.start();
        }
    }
    
    // 'R' key resets simulation
    if (key === 'r' || key === 'R') {
        simulationManager.reset();
    }
    
    // 'D' key toggles debug visualization
    if (key === 'd' || key === 'D') {
        renderer.toggleForceVectors();
    }
    
    // Prevent default behavior for these keys
    return false;
}
