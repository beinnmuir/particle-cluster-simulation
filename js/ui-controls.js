/**
 * UI Controls module
 * Contains methods for creating different control groups
 */

/**
 * Create simulation control buttons
 * @param {UIController} ui - The UI controller instance
 * @param {p5.Element} container - Parent container
 */
UIController.prototype.createSimulationControls = function(container) {
    const group = createDiv();
    group.class('control-group');
    group.parent(container);
    
    // Title
    const title = createElement('h3', 'Simulation Controls');
    title.parent(group);
    
    // Start/Pause button
    this.startPauseBtn = createButton('Start');
    this.startPauseBtn.parent(group);
    this.startPauseBtn.mousePressed(() => {
        if (this.simulation.running) {
            this.simulation.pause();
            this.startPauseBtn.html('Start');
        } else {
            this.simulation.start();
            this.startPauseBtn.html('Pause');
        }
    });
    
    // Reset button
    const resetBtn = createButton('Reset');
    resetBtn.parent(group);
    resetBtn.mousePressed(() => {
        this.simulation.reset();
        this.startPauseBtn.html('Start');
    });

    // Default Settings button
    const defaultBtn = createButton('Default Settings');
    defaultBtn.parent(group);
    defaultBtn.mousePressed(() => {
        this.resetToDefaultSettings();
        this.simulation.reset();
        this.startPauseBtn.html('Start');
    });

    // Try Me Settings 1 button
    const tryMeBtn = createButton('Try Me Settings 1');
    tryMeBtn.parent(group);
    this.tryMeButtons.tryMe1 = tryMeBtn;
    tryMeBtn.mousePressed(() => {
        this.setToTryMeSettings();
        this.simulation.reset();
        this.simulation.start();
        this.startPauseBtn.html('Pause');
    });
    
    // Try Me Settings 2 button
    const tryMeBtn2 = createButton('Try Me Settings 2');
    tryMeBtn2.parent(group);
    this.tryMeButtons.tryMe2 = tryMeBtn2;
    tryMeBtn2.mousePressed(() => {
        this.setToTryMeSettings2();
        this.simulation.reset();
        this.simulation.start();
        this.startPauseBtn.html('Pause');
    });
    
    // Set initial visibility of Try Me buttons based on current particle type
    this.updateTryMeButtonsVisibility(this.config.current.particleType);
};

/**
 * Create particle control sliders
 * @param {UIController} ui - The UI controller instance
 * @param {p5.Element} container - Parent container
 */
UIController.prototype.createParticleControls = function(container) {
    const group = createDiv();
    group.class('control-group');
    group.parent(container);
    
    // Title
    const title = createElement('h3', 'Particle Controls');
    title.parent(group);
    
    // Particle count slider
    this.createSlider(
        group,
        'particleCount',
        'Particle Count',
        10, 500, 
        this.config.current.particleCount,
        1,
        (value) => {
            this.config.updateSetting('particleCount', value);
            this.simulation.reset();
        }
    );
    
    // Initial mass slider
    this.createSlider(
        group,
        'initialMass',
        'Initial Mass',
        1, 20, 
        this.config.current.initialMass,
        0.5,
        (value) => {
            this.config.updateSetting('initialMass', value);
        }
    );
    
    // Max speed slider
    this.createSlider(
        group,
        'maxSpeed',
        'Max Speed',
        1, 10, 
        this.config.current.maxSpeed,
        0.1,
        (value) => {
            this.config.updateSetting('maxSpeed', value);
        }
    );
    
    // Dampening coefficient slider
    this.createSlider(
        group,
        'dampeningCoefficient',
        'Dampening (Friction)',
        0, 0.1, 
        this.config.current.dampeningCoefficient,
        0.001,
        (value) => {
            this.config.updateSetting('dampeningCoefficient', value);
        }
    );
};

/**
 * Create rod particle control elements
 * @param {UIController} ui - The UI controller instance
 * @param {p5.Element} container - Parent container
 */
UIController.prototype.createRodParticleControls = function(container) {
    const group = createDiv();
    group.class('control-group');
    group.parent(container);
    
    // Title
    const title = createElement('h3', 'Morphology Controls');
    title.parent(group);
    
    // Particle type selector
    const typeLabel = createElement('label', 'Particle Type:');
    typeLabel.parent(group);
    
    // Store references to buttons for updating selected state
    this.morphologyButtons = {};
    
    // Base style for all buttons
    const baseButtonStyle = {
        margin: '5px',
        padding: '10px',
        backgroundColor: '#4CAF50',  // Default green
        color: 'white',
        border: '1px solid #3e8e41',
        borderRadius: '4px',
        cursor: 'pointer'
    };
    
    // Create buttons instead of dropdown for more reliable control
    const circularBtn = createButton('Circular');
    circularBtn.parent(group);
    this.morphologyButtons.circular = circularBtn;
    
    // Apply base styles
    Object.entries(baseButtonStyle).forEach(([prop, val]) => {
        circularBtn.style(prop, val);
    });
    
    circularBtn.mousePressed(() => {
        // Force set the particle type to circular
        console.log('Setting particle type to: circular');
        this.config.current.particleType = 'circular';
        console.log('Config after direct update:', this.config.current.particleType);
        
        // Hide rod ratio slider for circular particles
        ratioDiv.style('display', 'none');
        
        // Hide rod length slider for circular particles
        rodLengthDiv.style('display', 'none');
        
        // Update button styles and Try Me buttons visibility
        this.updateMorphologyButtonStyles('circular');
        
        this.simulation.reset();
        // Update start/pause button text since simulation is now stopped
        if (this.startPauseBtn) this.startPauseBtn.html('Start');
    });
    
    const rodBtn = createButton('Rod');
    rodBtn.parent(group);
    this.morphologyButtons.rod = rodBtn;
    
    // Apply base styles
    Object.entries(baseButtonStyle).forEach(([prop, val]) => {
        rodBtn.style(prop, val);
    });
    
    rodBtn.mousePressed(() => {
        // Force set the particle type to rod
        console.log('Setting particle type to: rod');
        this.config.current.particleType = 'rod';
        console.log('Config after direct update:', this.config.current.particleType);
        
        // Hide rod ratio slider for rod particles
        ratioDiv.style('display', 'none');
        
        // Show rod length slider for rod particles
        rodLengthDiv.style('display', 'block');
        
        // Update button styles and Try Me buttons visibility
        this.updateMorphologyButtonStyles('rod');
        
        this.simulation.reset();
        // Update start/pause button text since simulation is now stopped
        if (this.startPauseBtn) this.startPauseBtn.html('Start');
    });
    
    const mixedBtn = createButton('Mixed');
    mixedBtn.parent(group);
    this.morphologyButtons.mixed = mixedBtn;
    
    // Apply base styles
    Object.entries(baseButtonStyle).forEach(([prop, val]) => {
        mixedBtn.style(prop, val);
    });
    
    mixedBtn.mousePressed(() => {
        // Force set the particle type to mixed
        console.log('Setting particle type to: mixed');
        this.config.current.particleType = 'mixed';
        console.log('Config after direct update:', this.config.current.particleType);
        
        // Show rod ratio slider for mixed particles
        ratioDiv.style('display', 'block');
        
        // Show rod length slider for mixed particles
        rodLengthDiv.style('display', 'block');
        
        // Update button styles and Try Me buttons visibility
        this.updateMorphologyButtonStyles('mixed');
        
        this.simulation.reset();
        // Update start/pause button text since simulation is now stopped
        if (this.startPauseBtn) this.startPauseBtn.html('Start');
    });
    
    // Rod ratio slider (only visible when type is 'mixed')
    const ratioDiv = createDiv();
    ratioDiv.parent(group);
    ratioDiv.id('rod-ratio-control');
    ratioDiv.style('display', this.config.current.particleType === 'mixed' ? 'block' : 'none');
    
    this.createSlider(
        ratioDiv,
        'rodRatio',
        'Rod Particle Ratio',
        0, 1,
        this.config.current.rodRatio,
        0.1,
        (value) => {
            this.config.updateSetting('rodRatio', value);
            this.simulation.reset();
        }
    );
    
    // Rod length slider in its own div for visibility control
    const rodLengthDiv = createDiv();
    rodLengthDiv.parent(group);
    rodLengthDiv.id('rod-length-control');
    
    // Only show rod length slider for rod or mixed particles
    const showRodLength = this.config.current.particleType === 'rod' || 
                         this.config.current.particleType === 'mixed';
    rodLengthDiv.style('display', showRodLength ? 'block' : 'none');
    
    this.createSlider(
        rodLengthDiv,
        'rodLength',
        'Rod Length',
        10, 100,  
        this.config.current.rodLength,
        1,
        (value) => {
            this.config.updateSetting('rodLength', value);
            this.simulation.reset();
        }
    );
    
    // Set initial button styles based on current particle type
    this.updateMorphologyButtonStyles(this.config.current.particleType);
};

/**
 * Create force control sliders
 * @param {UIController} ui - The UI controller instance
 * @param {p5.Element} container - Parent container
 */
UIController.prototype.createForceControls = function(container) {
    const group = createDiv();
    group.class('control-group');
    group.parent(container);
    
    // Title
    const title = createElement('h3', 'Force Controls');
    title.parent(group);
    
    // Threshold distance slider
    this.createSlider(
        group,
        'thresholdDistance',
        'Threshold Distance',
        10, 200, 
        this.config.current.thresholdDistance,
        1,
        (value) => {
            this.config.updateSetting('thresholdDistance', value);
        }
    );
    
    // Attraction coefficient slider
    this.createSlider(
        group,
        'attractionCoefficient',
        'Attraction Strength',
        0.01, 1, 
        this.config.current.attractionCoefficient,
        0.01,
        (value) => {
            this.config.updateSetting('attractionCoefficient', value);
        }
    );
    
    // Repulsion coefficient slider
    this.createSlider(
        group,
        'repulsionCoefficient',
        'Repulsion Strength',
        0.01, 1, 
        this.config.current.repulsionCoefficient,
        0.01,
        (value) => {
            this.config.updateSetting('repulsionCoefficient', value);
        }
    );
    
    // Sticky force coefficient slider
    this.createSlider(
        group,
        'stickyForceCoefficient',
        'Sticky Force Strength',
        0, 2, 
        this.config.current.stickyForceCoefficient,
        0.01,
        (value) => {
            this.config.updateSetting('stickyForceCoefficient', value);
        }
    );
};

/**
 * Create repulsion delay control sliders
 * @param {UIController} ui - The UI controller instance
 * @param {p5.Element} container - Parent container
 */
UIController.prototype.createRepulsionDelayControls = function(container) {
    const group = createDiv();
    group.class('control-group');
    group.parent(container);
    
    // Title
    const title = createElement('h3', 'Repulsion Delay');
    title.parent(group);
    
    // Repulsion delay slider
    this.createSlider(
        group,
        'repulsionDelay',
        'Repulsion Delay (frames)',
        0, 300, 
        this.config.current.repulsionDelay,
        10,
        (value) => {
            this.config.updateSetting('repulsionDelay', value);
        }
    );
    
    // Repulsion delay increase slider
    this.createSlider(
        group,
        'delayIncrease',
        'Delay Increase on Join',
        0, 100, 
        this.config.current.delayIncrease,
        5,
        (value) => {
            this.config.updateSetting('delayIncrease', value);
        }
    );
    
    // Max repulsion delay slider
    this.createSlider(
        group,
        'maxRepulsionDelay',
        'Max Repulsion Delay',
        60, 600, 
        this.config.current.maxRepulsionDelay,
        30,
        (value) => {
            this.config.updateSetting('maxRepulsionDelay', value);
        }
    );
};

/**
 * Create mass evolution control sliders
 * @param {UIController} ui - The UI controller instance
 * @param {p5.Element} container - Parent container
 */
UIController.prototype.createMassControls = function(container) {
    const group = createDiv();
    group.class('control-group');
    group.parent(container);
    
    // Title
    const title = createElement('h3', 'Mass Evolution');
    title.parent(group);
    
    // Min mass slider
    this.createSlider(
        group,
        'minMass',
        'Minimum Mass',
        1, 10, 
        this.config.current.minMass,
        0.5,
        (value) => {
            this.config.updateSetting('minMass', value);
        }
    );
    
    // Max mass slider
    this.createSlider(
        group,
        'maxMass',
        'Maximum Mass',
        5, 30, 
        this.config.current.maxMass,
        0.5,
        (value) => {
            this.config.updateSetting('maxMass', value);
        }
    );
    
    // Mass gain rate slider
    this.createSlider(
        group,
        'massGainRate',
        'Mass Gain Rate',
        0.001, 0.1, 
        this.config.current.massGainRate,
        0.001,
        (value) => {
            this.config.updateSetting('massGainRate', value);
        }
    );
    
    // Mass loss rate slider
    this.createSlider(
        group,
        'massLossRate',
        'Mass Loss Rate',
        0.001, 0.1, 
        this.config.current.massLossRate,
        0.001,
        (value) => {
            this.config.updateSetting('massLossRate', value);
        }
    );
};
