/**
 * UI Morphology module
 * Contains methods for handling particle morphology UI
 */

/**
 * Update morphology button styles to show selected state
 * @param {string} selectedType - The currently selected particle type
 */
UIController.prototype.updateMorphologyButtonStyles = function(selectedType) {
    if (!this.morphologyButtons) return;
    
    // Base style for all buttons
    const baseStyle = {
        backgroundColor: '#4CAF50'  // Default green
    };
    
    // Selected style
    const selectedStyle = {
        backgroundColor: '#8BC34A'  // Lighter green
    };
    
    // Reset all buttons to base style
    Object.keys(this.morphologyButtons).forEach(type => {
        this.morphologyButtons[type].style('background-color', baseStyle.backgroundColor);
    });
    
    // Apply selected style to the active button
    if (this.morphologyButtons[selectedType]) {
        this.morphologyButtons[selectedType].style('background-color', selectedStyle.backgroundColor);
    }
    
    // Update Try Me buttons visibility based on the selected type
    this.updateTryMeButtonsVisibility(selectedType);
};

/**
 * Update the visibility of Try Me buttons based on particle type
 * @param {string} particleType - The currently selected particle type
 */
UIController.prototype.updateTryMeButtonsVisibility = function(particleType) {
    if (!this.tryMeButtons) return;
    
    // Only show Try Me buttons for circular particles
    const isVisible = particleType === 'circular';
    
    // Update visibility of all Try Me buttons
    Object.values(this.tryMeButtons).forEach(button => {
        button.style('display', isVisible ? 'inline-block' : 'none');
    });
};
