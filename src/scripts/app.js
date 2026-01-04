/**
 * Main application file that imports all modules and initializes the calculator
 */

// Import all modules
import { createCalculator } from './calculator.js';
import { TrigonometricFunctions, LogarithmicFunctions, ProbabilityDistributions, StatisticalTests, FinancialFunctions } from './scientific.js';
import { createGraphRenderer, createFunctionTable } from './graphing.js';
import { createDescriptiveStatistics, createRegressionAnalysis, createTwoVariableStatistics, createStatisticsVisualizer } from './statistics.js';
import { 
    createDisplayManager, 
    createModeManager, 
    createTabManager, 
    createInputHandler, 
    createDataListManager,
    createNotificationManager,
    createFormHandler,
    createResizeHandler
} from './ui.js';
import { downloadJSON, readJSONFile, parseNumberArray } from './utils.js';
import { DEFAULT_DATA_LISTS } from './constants.js';

/**
 * Main calculator application class
 */
class CalculatorApp {
    constructor() {
        this.calculator = null;
        this.displayManager = null;
        this.modeManager = null;
        this.inputHandler = null;
        this.graphRenderer = null;
        this.dataListManager = null;
        this.notificationManager = null;
        this.formHandler = null;
        this.resizeHandler = null;
        this.tabManagers = {};
        
        // Component state
        this.isInitialized = false;
        this.currentGraphFunctions = [];
        this.currentStats = null;
    }

    /**
     * Initialize the calculator application
     */
    async init() {
        try {
            // Initialize core components
            this.initializeCore();
            
            // Initialize UI components
            this.initializeUI();
            
            // Initialize specialized components
            this.initializeGraphing();
            this.initializeStatistics();
            
            // Setup event handlers
            this.setupEventHandlers();
            
            // Setup form handlers
            this.setupFormHandlers();
            
            // Initialize default state
            this.setupDefaultState();
            
            this.isInitialized = true;
            this.notificationManager.showSuccess('Calculator initialized successfully');
            
            console.log('Calculator application initialized');
        } catch (error) {
            console.error('Failed to initialize calculator:', error);
            this.showInitializationError(error);
        }
    }

    /**
     * Initialize core calculator components
     */
    initializeCore() {
        // Create calculator engine
        this.calculator = createCalculator();
        
        // Create display manager
        const expressionElement = document.getElementById('expression');
        const resultElement = document.getElementById('result');
        this.displayManager = createDisplayManager(expressionElement, resultElement);
        
        // Create notification manager
        this.notificationManager = createNotificationManager();
    }

    /**
     * Initialize UI management components
     */
    initializeUI() {
        // Create mode manager
        this.modeManager = createModeManager();
        
        // Create input handler
        this.inputHandler = createInputHandler(this.calculator, this.displayManager);
        
        // Create data list manager
        this.dataListManager = createDataListManager();
        
        // Create form handler
        this.formHandler = createFormHandler();
        
        // Create resize handler
        this.resizeHandler = createResizeHandler();
        
        // Create tab managers for different sections
        this.tabManagers.graph = createTabManager('#graphContainer');
        this.tabManagers.statistics = createTabManager('#statisticsContainer');
    }

    /**
     * Initialize graphing components
     */
    initializeGraphing() {
        const graphCanvas = document.getElementById('graph-canvas');
        if (graphCanvas) {
            this.graphRenderer = createGraphRenderer(graphCanvas);
            
            // Setup graph event listeners
            this.setupGraphEventListeners();
        }
    }

    /**
     * Initialize statistics components
     */
    initializeStatistics() {
        const statsCanvas = document.getElementById('stats-chart');
        if (statsCanvas) {
            this.statsVisualizer = createStatisticsVisualizer(statsCanvas);
        }
    }

    /**
     * Setup event handlers for the application
     */
    setupEventHandlers() {
        // Mode switching
        this.modeManager.onModeChange((newMode, previousMode) => {
            this.handleModeChange(newMode, previousMode);
        });

        // Tab switching
        this.tabManagers.graph.onTabChange((tabName) => {
            this.handleGraphTabChange(tabName);
        });

        this.tabManagers.statistics.onTabChange((tabName) => {
            this.handleStatsTabChange(tabName);
        });

        // Window resize
        this.resizeHandler.onResize(() => {
            this.handleWindowResize();
        });

        // Setup mode buttons
        this.setupModeButtons();
        
        // Setup tab buttons
        this.setupTabButtons();
        
        // Setup function buttons
        this.setupFunctionButtons();
    }

    /**
     * Setup form handlers for different input forms
     */
    setupFormHandlers() {
        // Function plotting
        this.formHandler.setFormHandler('functionForm', (data) => {
            this.handleFunctionPlot(data);
        });

        // Statistics calculation
        this.formHandler.setFormHandler('statsForm', (data) => {
            this.handleStatisticsCalculation(data);
        });

        // Regression analysis
        this.formHandler.setFormHandler('regressionForm', (data) => {
            this.handleRegressionAnalysis(data);
        });

        // Table generation
        this.formHandler.setFormHandler('tableForm', (data) => {
            this.handleTableGeneration(data);
        });
    }

    /**
     * Setup default application state
     */
    setupDefaultState() {
        // Set initial mode
        this.modeManager.setMode('basic');
        
        // Initialize data lists display
        this.dataListManager.updateAllDisplays();
        
        // Set default angle mode display
        const angleModeBtn = document.getElementById('angleMode');
        if (angleModeBtn) {
            angleModeBtn.textContent = this.calculator.getAngleMode().toUpperCase();
        }
    }

    /**
     * Event handler implementations
     */
    handleModeChange(newMode, previousMode) {
        // Disable/enable input based on mode
        const isCalculatorMode = ['basic', 'scientific'].includes(newMode);
        this.inputHandler.setInputDisabled(!isCalculatorMode);
        
        // Initialize mode-specific components
        switch (newMode) {
            case 'graph':
                if (this.graphRenderer) {
                    this.graphRenderer.initializeCanvas();
                }
                break;
            case 'statistics':
                if (this.statsVisualizer) {
                    // Initialize stats visualization
                }
                break;
        }
    }

    handleGraphTabChange(tabName) {
        switch (tabName) {
            case 'trace':
                if (this.graphRenderer) {
                    this.graphRenderer.enableTracing();
                }
                break;
            default:
                if (this.graphRenderer) {
                    this.graphRenderer.disableTracing();
                }
                break;
        }
    }

    handleStatsTabChange(tabName) {
        // Handle statistics tab changes
        console.log(`Statistics tab changed to: ${tabName}`);
    }

    handleWindowResize() {
        // Resize graph canvas if visible
        if (this.modeManager.getCurrentMode() === 'graph' && this.graphRenderer) {
            this.graphRenderer.initializeCanvas();
        }
        
        // Resize statistics canvas if visible
        if (this.modeManager.getCurrentMode() === 'statistics' && this.statsVisualizer) {
            // Handle stats canvas resize
        }
    }

    /**
     * Form handler implementations
     */
    handleFunctionPlot(data) {
        if (!data.functionInput || !this.graphRenderer) return;
        
        try {
            this.graphRenderer.addFunction(data.functionInput);
            this.notificationManager.showSuccess('Function plotted successfully');
        } catch (error) {
            this.notificationManager.showError(`Error plotting function: ${error.message}`);
        }
    }

    handleStatisticsCalculation(data) {
        if (!data.statsInput) return;
        
        try {
            const numbers = parseNumberArray(data.statsInput);
            if (numbers.length === 0) {
                throw new Error('No valid numbers found');
            }
            
            // Store in L1
            this.dataListManager.setList('L1', numbers);
            
            // Calculate statistics
            const stats = createDescriptiveStatistics(numbers);
            const summary = stats.summary();
            
            // Update UI with results
            this.displayStatisticsSummary(summary);
            
            this.notificationManager.showSuccess('Statistics calculated successfully');
        } catch (error) {
            this.notificationManager.showError(`Error calculating statistics: ${error.message}`);
        }
    }

    handleRegressionAnalysis(data) {
        if (!data.xValues || !data.yValues) return;
        
        try {
            const xData = parseNumberArray(data.xValues);
            const yData = parseNumberArray(data.yValues);
            
            if (xData.length !== yData.length || xData.length < 2) {
                throw new Error('X and Y must have same length and at least 2 points');
            }
            
            // Store data
            this.dataListManager.setList('L1', xData);
            this.dataListManager.setList('L2', yData);
            
            // Perform regression
            const regressionType = document.getElementById('regressionType')?.value || 'linear';
            const regression = createRegressionAnalysis();
            const result = regression.analyze(xData, yData, regressionType);
            
            // Display results
            this.displayRegressionResults(result);
            
            // Add regression line to graph if in graph mode
            if (this.graphRenderer) {
                this.graphRenderer.addDataPoints(xData, yData);
                this.graphRenderer.addFunction(result.equation);
            }
            
            this.notificationManager.showSuccess('Regression analysis completed');
        } catch (error) {
            this.notificationManager.showError(`Error in regression analysis: ${error.message}`);
        }
    }

    handleTableGeneration(data) {
        const { tableFunction, tableStart, tableEnd, tableStep } = data;
        
        if (!tableFunction || !tableStart || !tableEnd || !tableStep) {
            this.notificationManager.showError('Please fill in all table parameters');
            return;
        }
        
        try {
            const functionTable = createFunctionTable();
            functionTable.addFunction(tableFunction);
            
            const start = parseFloat(tableStart);
            const end = parseFloat(tableEnd);
            const step = parseFloat(tableStep);
            
            const tableData = functionTable.generateTable(start, end, step);
            this.displayFunctionTable(tableData);
            
            this.notificationManager.showSuccess('Function table generated');
        } catch (error) {
            this.notificationManager.showError(`Error generating table: ${error.message}`);
        }
    }

    /**
     * UI setup methods
     */
    setupModeButtons() {
        // Use event delegation on parent container instead of individual listeners
        const modeContainer = document.querySelector('.mode-buttons') || document.body;
        modeContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.mode-btn');
            if (btn) {
                const mode = btn.dataset.mode;
                if (mode) {
                    this.modeManager.setMode(mode);
                }
            }
        });
    }

    setupTabButtons() {
        // Use event delegation for graph tabs
        const graphContainer = document.getElementById('graphContainer');
        if (graphContainer) {
            graphContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.tab-btn');
                if (btn) {
                    const tab = btn.dataset.tab;
                    if (tab) {
                        this.tabManagers.graph.switchTab(tab, e);
                    }
                }
            });
        }

        // Use event delegation for statistics tabs
        const statsContainer = document.getElementById('statisticsContainer');
        if (statsContainer) {
            statsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.tab-btn');
                if (btn) {
                    const tab = btn.dataset.tab;
                    if (tab) {
                        this.tabManagers.statistics.switchTab(tab, e);
                    }
                }
            });
        }
    }

    setupFunctionButtons() {
        // Graph control buttons
        const clearGraphBtn = document.getElementById('clearGraph');
        if (clearGraphBtn) {
            clearGraphBtn.addEventListener('click', () => {
                if (this.graphRenderer) {
                    this.graphRenderer.clearFunctions();
                    this.notificationManager.showInfo('Graph cleared');
                }
            });
        }

        const zoomInBtn = document.getElementById('zoomIn');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                if (this.graphRenderer) {
                    this.graphRenderer.zoomIn();
                }
            });
        }

        const zoomOutBtn = document.getElementById('zoomOut');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                if (this.graphRenderer) {
                    this.graphRenderer.zoomOut();
                }
            });
        }

        const resetZoomBtn = document.getElementById('resetZoom');
        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', () => {
                if (this.graphRenderer) {
                    this.graphRenderer.resetView();
                }
            });
        }
    }

    /**
     * Display update methods
     */
    displayStatisticsSummary(summary) {
        const elements = {
            'statCount': summary.count,
            'statMean': summary.mean,
            'statSum': summary.sum,
            'statSumSq': summary.sumOfSquares,
            'statStdDev': summary.standardDeviation,
            'statPopStdDev': summary.populationStandardDeviation,
            'statMin': summary.minimum,
            'statQ1': summary.q1,
            'statMedian': summary.median,
            'statQ3': summary.q3,
            'statMax': summary.maximum,
            'statIQR': summary.iqr
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = typeof value === 'number' ? value.toFixed(6) : value;
            }
        });

        const resultsDiv = document.getElementById('statsResults');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
        }
    }

    displayRegressionResults(result) {
        const equationElement = document.getElementById('regEquation');
        const r2Element = document.getElementById('regR2');
        const rElement = document.getElementById('regR');

        if (equationElement) equationElement.textContent = result.equation;
        if (r2Element) r2Element.textContent = result.r2.toFixed(6);
        if (rElement && result.r) rElement.textContent = result.r.toFixed(6);

        const resultsDiv = document.getElementById('regressionResults');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
        }
    }

    displayFunctionTable(tableData) {
        const tableBody = document.querySelector('#valueTable tbody');
        if (!tableBody) return;

        // Use DocumentFragment to batch DOM operations and avoid repeated reflows
        const fragment = document.createDocumentFragment();
        tableData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.x.toFixed(4)}</td>
                <td>${row.f1 !== undefined ? row.f1.toFixed(6) : 'undefined'}</td>
            `;
            fragment.appendChild(tr);
        });

        // Single DOM update
        tableBody.innerHTML = '';
        tableBody.appendChild(fragment);
    }

    /**
     * Graph event listeners
     */
    setupGraphEventListeners() {
        if (!this.graphRenderer) return;

        // Trace events
        this.graphRenderer.canvas.addEventListener('trace', (e) => {
            const traceData = e.detail;
            
            const coordsElement = document.getElementById('traceCoords');
            if (coordsElement) {
                coordsElement.textContent = `x: ${traceData.x.toFixed(3)}, y: ${traceData.y.toFixed(3)}`;
            }

            const valueElement = document.getElementById('traceValue');
            if (valueElement && traceData.functions.length > 0) {
                const lastFunc = traceData.functions[traceData.functions.length - 1];
                valueElement.textContent = lastFunc.value !== undefined ? 
                    lastFunc.value.toFixed(6) : 'undefined';
            }
        });
    }

    /**
     * Data import/export functionality
     */
    exportCalculatorData() {
        const data = {
            calculator: this.calculator.exportState(),
            dataLists: this.dataListManager.getListsState(),
            graph: this.graphRenderer ? this.graphRenderer.getGraphState() : null,
            mode: this.modeManager.getCurrentMode(),
            timestamp: new Date().toISOString()
        };

        downloadJSON(data, 'calculator-data.json');
        this.notificationManager.showSuccess('Data exported successfully');
    }

    async importCalculatorData(file) {
        try {
            const data = await readJSONFile(file);
            
            if (data.calculator) {
                this.calculator.importState(data.calculator);
                this.displayManager.updateExpression(this.calculator.getCurrentExpression());
            }
            
            if (data.dataLists) {
                this.dataListManager.setListsState(data.dataLists);
            }
            
            if (data.graph && this.graphRenderer) {
                this.graphRenderer.setGraphState(data.graph);
            }
            
            if (data.mode) {
                this.modeManager.setMode(data.mode);
            }
            
            this.notificationManager.showSuccess('Data imported successfully');
        } catch (error) {
            this.notificationManager.showError(`Import failed: ${error.message}`);
        }
    }

    /**
     * Error handling
     */
    showInitializationError(error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'initialization-error';
        errorDiv.innerHTML = `
            <h3>Calculator Initialization Error</h3>
            <p>Failed to initialize the calculator application.</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <button onclick="location.reload()">Reload Page</button>
        `;
        document.body.appendChild(errorDiv);
    }

    /**
     * Public API methods
     */
    getCalculator() {
        return this.calculator;
    }

    getDisplayManager() {
        return this.displayManager;
    }

    getModeManager() {
        return this.modeManager;
    }

    getGraphRenderer() {
        return this.graphRenderer;
    }

    getDataListManager() {
        return this.dataListManager;
    }

    isReady() {
        return this.isInitialized;
    }
}

/**
 * Global application instance
 */
let calculatorApp = null;

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    calculatorApp = new CalculatorApp();
    await calculatorApp.init();
    
    // Make app globally accessible for debugging
    window.calculatorApp = calculatorApp;
});

/**
 * Export for use in other modules
 */
export default CalculatorApp;
export { calculatorApp };