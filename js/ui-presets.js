/**
 * UI Presets module
 * Contains methods for handling preset settings
 */

/**
 * Reset all settings to their default values while preserving the current particle type
 */
UIController.prototype.resetToDefaultSettings = function() {
    // Get current particle type before reset
    const currentParticleType = this.config.current.particleType;
    
    // Reset to defaults while preserving the current particle type
    this.config.resetToDefaults({ particleType: currentParticleType });
    
    // Update UI sliders
    for (const [key, control] of Object.entries(this.controls)) {
        if (control.slider) {
            control.slider.value(this.config.current[key]);
            if (control.valueDisplay) {
                control.valueDisplay.html(this.config.current[key]);
            }
        }
    }
    
    // Make sure the rod-specific controls are shown/hidden appropriately
    const rodLengthDiv = document.getElementById('rod-length-control');
    const ratioDiv = document.getElementById('rod-ratio-control');
    
    if (rodLengthDiv && ratioDiv) {
        // Show/hide rod length slider based on particle type
        const showRodLength = currentParticleType === 'rod' || currentParticleType === 'mixed';
        rodLengthDiv.style.display = showRodLength ? 'block' : 'none';
        
        // Show/hide rod ratio slider based on particle type
        const showRodRatio = currentParticleType === 'mixed';
        ratioDiv.style.display = showRodRatio ? 'block' : 'none';
    }
};

/**
 * Set settings to the "Try Me Settings 1" configuration
 */
UIController.prototype.setToTryMeSettings = function() {
    const tryMeSettings = {
        particleCount: 400,
        initialMass: 5,
        maxSpeed: 5,
        dampeningCoefficient: 0.03,
        thresholdDistance: 60,
        attractionCoefficient: 0.03,
        repulsionCoefficient: 1,
        stickyForceCoefficient: 1.21,
        repulsionDelay: 120,
        delayIncrease: 30,
        maxRepulsionDelay: 300,
        minMass: 2,
        maxMass: 20,
        massGainRate: 0.003,
        massLossRate: 0.1
    };

    // Update config with new settings
    for (const [key, value] of Object.entries(tryMeSettings)) {
        this.config.updateSetting(key, value);
    }

    // Update UI sliders
    for (const [key, control] of Object.entries(this.controls)) {
        if (control.slider && tryMeSettings[key] !== undefined) {
            control.slider.value(tryMeSettings[key]);
            if (control.valueDisplay) {
                control.valueDisplay.html(tryMeSettings[key]);
            }
        }
    }
};

/**
 * Set settings to the "Try Me Settings 2" configuration
 */
UIController.prototype.setToTryMeSettings2 = function() {
    const tryMeSettings2 = {
        particleCount: 250,
        initialMass: 5,
        maxSpeed: 5,
        dampeningCoefficient: 0.03,
        thresholdDistance: 40,
        attractionCoefficient: 0.54,
        repulsionCoefficient: 0.22,
        stickyForceCoefficient: 1.21,
        repulsionDelay: 120,
        delayIncrease: 30,
        maxRepulsionDelay: 300,
        minMass: 2,
        maxMass: 20,
        massGainRate: 0.001,
        massLossRate: 0.1
    };

    // Update config with new settings
    for (const [key, value] of Object.entries(tryMeSettings2)) {
        this.config.updateSetting(key, value);
    }

    // Update UI sliders
    for (const [key, control] of Object.entries(this.controls)) {
        if (control.slider && tryMeSettings2[key] !== undefined) {
            control.slider.value(tryMeSettings2[key]);
            if (control.valueDisplay) {
                control.valueDisplay.html(tryMeSettings2[key]);
            }
        }
    }
};
