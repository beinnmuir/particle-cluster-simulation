/**
 * UI Stats module
 * Contains methods for handling statistics display
 */

/**
 * Create statistics display
 * @param {p5.Element} container - Parent container
 */
UIController.prototype.createStatsDisplay = function(container) {
    const statsDiv = createDiv();
    statsDiv.class('stats-display');
    statsDiv.parent(container);
    
    // Title
    const title = createElement('h3', 'Statistics');
    title.parent(statsDiv);
    
    // Stats elements
    this.statsElements = {
        fps: createP('FPS: 0'),
        particleCount: createP('Particles: 0'),
        rodParticles: createP('Rod Particles: 0'),
        circularParticles: createP('Circular Particles: 0'),
        averageMass: createP('Avg Mass: 0'),
        totalClusters: createP('Total Clusters: 0'),
        distinctClusters: createP('Distinct Clusters: 0'),
        particlesInClusters: createP('Particles in Clusters: 0'),
        largestCluster: createP('Largest Cluster: 0'),
        clusterDistribution: createP('Cluster Sizes: 0 small, 0 medium, 0 large')
    };
    
    // Add stats elements to container
    for (let key in this.statsElements) {
        this.statsElements[key].parent(statsDiv);
    }
};

/**
 * Update statistics display
 * @param {object} stats - Optional stats object from simulation
 */
UIController.prototype.updateStats = function(stats) {
    // Use provided stats or get from simulation
    const simStats = stats || this.simulation.getStats();
    
    // Update basic stats
    this.statsElements.fps.html(`FPS: ${simStats.fps.toFixed(1)}`);
    this.statsElements.particleCount.html(`Particles: ${this.simulation.particles.length}`);
    this.statsElements.rodParticles.html(`Rod Particles: ${simStats.rodParticleCount}`);
    this.statsElements.circularParticles.html(`Circular Particles: ${simStats.circularParticleCount}`);
    this.statsElements.averageMass.html(`Avg Mass: ${simStats.averageMass.toFixed(2)}`);
    this.statsElements.totalClusters.html(`Total Clusters: ${simStats.clusterCount}`);
    
    // Update enhanced cluster stats
    this.statsElements.distinctClusters.html(`Distinct Clusters: ${simStats.distinctClusters}`);
    this.statsElements.particlesInClusters.html(`Particles in Clusters: ${simStats.particlesInClusters}`);
    
    // Get the force system for additional cluster information
    const forceSystem = this.simulation.getForceSystem();
    if (forceSystem && forceSystem.clusterSizes) {
        // Find the largest cluster
        const clusterSizes = Array.from(forceSystem.clusterSizes.values());
        const largestClusterSize = clusterSizes.length > 0 ? Math.max(...clusterSizes) : 0;
        this.statsElements.largestCluster.html(`Largest Cluster: ${largestClusterSize}`);
        
        // Calculate cluster size distribution
        const smallClusters = clusterSizes.filter(size => size <= 5).length;
        const mediumClusters = clusterSizes.filter(size => size > 5 && size <= 15).length;
        const largeClusters = clusterSizes.filter(size => size > 15).length;
        
        this.statsElements.clusterDistribution.html(
            `Cluster Sizes: ${smallClusters} small, ${mediumClusters} medium, ${largeClusters} large`
        );
    }
};
