/**
 * Component Loader
 * Utility for loading and inserting HTML components into the DOM
 */

export class ComponentLoader {
    /**
     * Load an HTML component from a file and insert it into a container
     * @param {string} componentPath - Path to the component HTML file
     * @param {string} containerId - ID of the container element
     * @returns {Promise<void>}
     */
    static async loadComponent(componentPath, containerId) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            
            const html = await response.text();
            const container = document.getElementById(containerId);
            
            if (!container) {
                throw new Error(`Container element not found: ${containerId}`);
            }
            
            container.innerHTML = html;
        } catch (error) {
            console.error('Error loading component:', error);
            throw error;
        }
    }

    /**
     * Load multiple components in parallel
     * @param {Array<{path: string, container: string}>} components
     * @returns {Promise<void>}
     */
    static async loadComponents(components) {
        try {
            const promises = components.map(({ path, container }) => 
                this.loadComponent(path, container)
            );
            
            await Promise.all(promises);
        } catch (error) {
            console.error('Error loading components:', error);
            throw error;
        }
    }

    /**
     * Initialize all calculator components
     * @returns {Promise<void>}
     */
    static async initializeCalculatorComponents() {
        const components = [
            { path: 'src/components/mode-selector.html', container: 'mode-selector-container' },
            { path: 'src/components/display.html', container: 'display-container' },
            { path: 'src/components/graph-container.html', container: 'graph-container' },
            { path: 'src/components/statistics-container.html', container: 'statistics-container' },
            { path: 'src/components/matrix-container.html', container: 'matrix-container' },
            { path: 'src/components/buttons-container.html', container: 'buttons-container' }
        ];

        await this.loadComponents(components);
    }
}