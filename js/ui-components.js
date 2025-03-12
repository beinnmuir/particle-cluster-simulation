/**
 * UI Components module
 * Contains reusable UI component creation methods
 */

/**
 * Create a slider with label
 * @param {p5.Element} container - Parent container
 * @param {string} id - Slider ID
 * @param {string} label - Slider label
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} value - Initial value
 * @param {number} step - Step size
 * @param {function} onChange - Change handler
 */
UIController.prototype.createSlider = function(container, id, label, min, max, value, step, onChange) {
    const sliderContainer = createDiv();
    sliderContainer.class('slider-container');
    sliderContainer.parent(container);
    
    // Create label
    const labelElement = createElement('label', label);
    labelElement.parent(sliderContainer);
    
    // Create slider
    const slider = createSlider(min, max, value, step);
    slider.parent(sliderContainer);
    slider.style('width', '100%');
    
    // Create value display
    const valueDisplay = createSpan(value);
    valueDisplay.parent(sliderContainer);
    
    // Store control reference
    this.controls[id] = {
        slider: slider,
        valueDisplay: valueDisplay
    };
    
    // Add event listener
    slider.input(() => {
        const val = slider.value();
        valueDisplay.html(val);
        onChange(val);
    });
};
