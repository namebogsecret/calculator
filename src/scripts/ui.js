/**
 * UI management, mode switching, and display updates
 */

import { formatNumber, debounce } from './utils.js';
import { UI_CONFIG, KEY_BINDINGS, DEFAULT_DATA_LISTS } from './constants.js';

/**
 * Display manager for calculator screen
 */
export class DisplayManager {
    constructor(expressionElement, resultElement) {
        this.expressionElement = expressionElement;
        this.resultElement = resultElement;
        this.currentExpression = '';
        this.currentResult = '0';
        this.isError = false;
    }

    updateExpression(expression) {
        this.currentExpression = expression;
        this.expressionElement.textContent = expression || '0';
        this.isError = false;
    }

    updateResult(result, formatted = null) {
        this.currentResult = result;
        this.resultElement.textContent = formatted || formatNumber(result);
        this.isError = false;
    }

    showError(message = 'Error') {
        this.resultElement.textContent = message;
        this.isError = true;
        
        // Auto-clear error after delay
        setTimeout(() => {
            if (this.isError) {
                this.clear();
            }
        }, UI_CONFIG.CALCULATION_DELAY);
    }

    clear() {
        this.currentExpression = '';
        this.currentResult = '0';
        this.expressionElement.textContent = '';
        this.resultElement.textContent = '0';
        this.isError = false;
    }

    getCurrentExpression() {
        return this.currentExpression;
    }

    getCurrentResult() {
        return this.currentResult;
    }

    isInErrorState() {
        return this.isError;
    }
}

/**
 * Mode manager for different calculator modes
 */
export class ModeManager {
    constructor() {
        this.currentMode = 'basic';
        this.modeChangeCallbacks = [];
        this.modeElements = {
            calculator: document.getElementById('calculator'),
            graphContainer: document.getElementById('graphContainer'),
            statisticsContainer: document.getElementById('statisticsContainer'),
            matrixContainer: document.getElementById('matrixContainer')
        };
    }

    setMode(mode) {
        const previousMode = this.currentMode;
        this.currentMode = mode;

        // Update UI visibility
        this.updateModeVisibility(mode);
        
        // Update active button
        this.updateModeButtons(mode);

        // Notify callbacks
        this.modeChangeCallbacks.forEach(callback => {
            callback(mode, previousMode);
        });

        return mode;
    }

    getCurrentMode() {
        return this.currentMode;
    }

    onModeChange(callback) {
        this.modeChangeCallbacks.push(callback);
    }

    updateModeVisibility(mode) {
        // Reset all containers
        if (this.modeElements.calculator) {
            this.modeElements.calculator.className = 'calculator-container';
        }

        if (this.modeElements.graphContainer) {
            this.modeElements.graphContainer.style.display = 'none';
        }

        if (this.modeElements.statisticsContainer) {
            this.modeElements.statisticsContainer.style.display = 'none';
        }

        if (this.modeElements.matrixContainer) {
            this.modeElements.matrixContainer.style.display = 'none';
        }

        // Show appropriate container
        switch (mode) {
            case 'basic':
                // Calculator is always visible, just ensure no scientific mode
                break;
            case 'scientific':
                if (this.modeElements.calculator) {
                    this.modeElements.calculator.classList.add('scientific-mode');
                }
                break;
            case 'graph':
                if (this.modeElements.graphContainer) {
                    this.modeElements.graphContainer.style.display = 'block';
                }
                break;
            case 'statistics':
                if (this.modeElements.statisticsContainer) {
                    this.modeElements.statisticsContainer.style.display = 'block';
                }
                break;
            case 'matrix':
                if (this.modeElements.matrixContainer) {
                    this.modeElements.matrixContainer.style.display = 'block';
                }
                break;
        }
    }

    updateModeButtons(activeMode) {
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === activeMode) {
                btn.classList.add('active');
            }
        });
    }
}

/**
 * Tab manager for different sections within modes
 */
export class TabManager {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.activeTab = null;
        this.tabChangeCallbacks = [];
    }

    switchTab(tabName, event = null) {
        // Update tab buttons
        const tabButtons = this.container.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        if (event && event.target) {
            event.target.classList.add('active');
        } else {
            // Find button by tab name
            const targetButton = this.container.querySelector(`[data-tab="${tabName}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }
        }

        // Update tab content
        const tabContents = this.container.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
        
        const targetContent = this.container.querySelector(`#${tabName}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        const previousTab = this.activeTab;
        this.activeTab = tabName;

        // Notify callbacks
        this.tabChangeCallbacks.forEach(callback => {
            callback(tabName, previousTab);
        });

        return tabName;
    }

    getCurrentTab() {
        return this.activeTab;
    }

    onTabChange(callback) {
        this.tabChangeCallbacks.push(callback);
    }
}

/**
 * Input handler for keyboard and button events
 */
export class InputHandler {
    constructor(calculator, displayManager) {
        this.calculator = calculator;
        this.displayManager = displayManager;
        this.isInputDisabled = false;
        
        this.setupKeyboardListeners();
        this.setupButtonListeners();
    }

    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Don't handle keyboard in graph or statistics modes
            if (this.isInputDisabled) return;
            
            e.preventDefault();
            this.handleKeyInput(e.key);
        });
    }

    setupButtonListeners() {
        // Use event delegation on calculator container for all button types
        const calculatorContainer = document.querySelector('.calculator-buttons') ||
                                   document.querySelector('.calculator-container') ||
                                   document.body;

        calculatorContainer.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            // Handle number buttons
            if (target.classList.contains('btn-number')) {
                this.handleInput(target.textContent);
                return;
            }

            // Handle operator buttons
            if (target.classList.contains('btn-operator')) {
                this.handleInput(target.dataset.value || target.textContent);
                return;
            }

            // Handle function buttons
            if (target.classList.contains('btn-function')) {
                const func = target.dataset.function;
                if (func) {
                    this.handleFunction(func);
                }
                return;
            }
        });

        // Special action buttons
        this.setupSpecialButtons();
    }

    setupSpecialButtons() {
        // Clear button
        const clearBtn = document.getElementById('clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.handleClear());
        }

        // Delete button
        const deleteBtn = document.getElementById('delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.handleDelete());
        }

        // Equals button
        const equalsBtn = document.getElementById('equals');
        if (equalsBtn) {
            equalsBtn.addEventListener('click', () => this.handleCalculate());
        }

        // Angle mode toggle
        const angleModeBtn = document.getElementById('angleMode');
        if (angleModeBtn) {
            angleModeBtn.addEventListener('click', () => this.handleAngleModeToggle());
        }
    }

    handleKeyInput(key) {
        if (KEY_BINDINGS.NUMBERS.includes(key)) {
            this.handleInput(key);
        } else if (KEY_BINDINGS.OPERATORS.includes(key)) {
            this.handleInput(key);
        } else if (key === KEY_BINDINGS.SPECIAL.DECIMAL) {
            this.handleInput('.');
        } else if (key === KEY_BINDINGS.SPECIAL.ENTER) {
            this.handleCalculate();
        } else if (key === KEY_BINDINGS.SPECIAL.ESCAPE) {
            this.handleClear();
        } else if (key === KEY_BINDINGS.SPECIAL.BACKSPACE) {
            this.handleDelete();
        } else if (key === KEY_BINDINGS.SPECIAL.OPEN_PAREN) {
            this.handleInput('(');
        } else if (key === KEY_BINDINGS.SPECIAL.CLOSE_PAREN) {
            this.handleInput(')');
        }
    }

    handleInput(value) {
        if (this.displayManager.isInErrorState()) {
            this.displayManager.clear();
        }

        const newExpression = this.calculator.appendToExpression(value);
        this.displayManager.updateExpression(newExpression);
        
        // Show live preview
        this.updatePreview();
    }

    handleFunction(func) {
        if (this.displayManager.isInErrorState()) {
            this.displayManager.clear();
        }

        const newExpression = this.calculator.appendFunction(func);
        this.displayManager.updateExpression(newExpression);
        this.updatePreview();
    }

    handleClear() {
        this.calculator.clear();
        this.displayManager.clear();
    }

    handleDelete() {
        const newExpression = this.calculator.deleteLastChar();
        this.displayManager.updateExpression(newExpression);
        this.updatePreview();
    }

    handleCalculate() {
        const result = this.calculator.calculate();
        
        if (result.success) {
            this.displayManager.updateResult(result.result, result.formattedResult);
        } else {
            this.displayManager.showError(result.error);
        }
    }

    handleAngleModeToggle() {
        const newMode = this.calculator.toggleAngleMode();
        const angleModeBtn = document.getElementById('angleMode');
        if (angleModeBtn) {
            angleModeBtn.textContent = newMode.toUpperCase();
        }
        this.updatePreview();
    }

    updatePreview() {
        const preview = this.calculator.previewCalculation();
        if (preview !== null) {
            this.displayManager.updateResult(preview);
        }
    }

    setInputDisabled(disabled) {
        this.isInputDisabled = disabled;
    }
}

/**
 * Data list manager for statistics
 */
export class DataListManager {
    constructor() {
        this.lists = { ...DEFAULT_DATA_LISTS };
        this.activeList = 'L1';
    }

    setList(listName, data) {
        if (this.lists.hasOwnProperty(listName)) {
            this.lists[listName] = [...data];
            this.updateListDisplay(listName);
        }
    }

    getList(listName) {
        return this.lists[listName] || [];
    }

    addToList(listName, value) {
        if (this.lists.hasOwnProperty(listName)) {
            this.lists[listName].push(value);
            this.updateListDisplay(listName);
        }
    }

    clearList(listName) {
        if (this.lists.hasOwnProperty(listName)) {
            this.lists[listName] = [];
            this.updateListDisplay(listName);
        }
    }

    clearAllLists() {
        Object.keys(this.lists).forEach(listName => {
            this.lists[listName] = [];
            this.updateListDisplay(listName);
        });
    }

    updateListDisplay(listName) {
        const listElement = document.getElementById(`list${listName.slice(1)}`);
        if (listElement) {
            // Use DocumentFragment for better performance
            const fragment = document.createDocumentFragment();
            this.lists[listName].forEach(value => {
                const div = document.createElement('div');
                div.className = 'list-value';
                div.textContent = formatNumber(value);
                fragment.appendChild(div);
            });
            listElement.innerHTML = '';
            listElement.appendChild(fragment);
        }
    }

    updateAllDisplays() {
        Object.keys(this.lists).forEach(listName => {
            this.updateListDisplay(listName);
        });
    }

    importFromString(listName, dataString) {
        const data = dataString
            .split(/[\s,;]+/)
            .map(n => parseFloat(n))
            .filter(n => !isNaN(n));
        
        this.setList(listName, data);
        return data.length;
    }

    exportToString(listName) {
        return this.lists[listName].join(', ');
    }

    getListsState() {
        return { ...this.lists };
    }

    setListsState(state) {
        this.lists = { ...DEFAULT_DATA_LISTS, ...state };
        this.updateAllDisplays();
    }
}

/**
 * Toast notification system
 */
export class NotificationManager {
    constructor() {
        this.container = this.createNotificationContainer();
    }

    createNotificationContainer() {
        let container = document.getElementById('notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    }

    showNotification(message, type = 'info', duration = UI_CONFIG.TOAST_DURATION) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        this.container.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);

        return notification;
    }

    showSuccess(message, duration) {
        return this.showNotification(message, 'success', duration);
    }

    showError(message, duration) {
        return this.showNotification(message, 'error', duration);
    }

    showWarning(message, duration) {
        return this.showNotification(message, 'warning', duration);
    }

    showInfo(message, duration) {
        return this.showNotification(message, 'info', duration);
    }
}

/**
 * Form handler for various calculator inputs
 */
export class FormHandler {
    constructor() {
        this.forms = new Map();
        this.setupDefaultForms();
    }

    setupDefaultForms() {
        // Function input form
        this.registerForm('functionForm', {
            inputs: ['functionInput'],
            onSubmit: this.handleFunctionSubmit.bind(this)
        });

        // Statistics input form
        this.registerForm('statsForm', {
            inputs: ['statsInput'],
            onSubmit: this.handleStatsSubmit.bind(this)
        });

        // Regression form
        this.registerForm('regressionForm', {
            inputs: ['xValues', 'yValues'],
            onSubmit: this.handleRegressionSubmit.bind(this)
        });

        // Table generation form
        this.registerForm('tableForm', {
            inputs: ['tableFunction', 'tableStart', 'tableEnd', 'tableStep'],
            onSubmit: this.handleTableSubmit.bind(this)
        });
    }

    registerForm(formId, config) {
        const form = document.getElementById(formId);
        if (form) {
            this.forms.set(formId, config);
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(formId, e);
            });
        }
    }

    handleFormSubmit(formId, event) {
        const config = this.forms.get(formId);
        if (config && config.onSubmit) {
            const formData = this.extractFormData(formId, config.inputs);
            config.onSubmit(formData, event);
        }
    }

    extractFormData(formId, inputIds) {
        const data = {};
        inputIds.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                data[inputId] = element.value;
            }
        });
        return data;
    }

    // Default form handlers (to be overridden by application)
    handleFunctionSubmit(data) {
        console.log('Function submitted:', data);
    }

    handleStatsSubmit(data) {
        console.log('Stats submitted:', data);
    }

    handleRegressionSubmit(data) {
        console.log('Regression submitted:', data);
    }

    handleTableSubmit(data) {
        console.log('Table submitted:', data);
    }

    setFormHandler(formId, handler) {
        const config = this.forms.get(formId);
        if (config) {
            config.onSubmit = handler;
        }
    }
}

/**
 * Window resize handler
 */
export class ResizeHandler {
    constructor() {
        this.resizeCallbacks = [];
        this.debouncedResize = debounce(this.handleResize.bind(this), 250);
        
        window.addEventListener('resize', this.debouncedResize);
    }

    handleResize() {
        this.resizeCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Error in resize callback:', error);
            }
        });
    }

    onResize(callback) {
        this.resizeCallbacks.push(callback);
    }

    removeCallback(callback) {
        const index = this.resizeCallbacks.indexOf(callback);
        if (index > -1) {
            this.resizeCallbacks.splice(index, 1);
        }
    }
}

/**
 * Factory functions
 */
export function createDisplayManager(expressionElement, resultElement) {
    return new DisplayManager(expressionElement, resultElement);
}

export function createModeManager() {
    return new ModeManager();
}

export function createTabManager(containerSelector) {
    return new TabManager(containerSelector);
}

export function createInputHandler(calculator, displayManager) {
    return new InputHandler(calculator, displayManager);
}

export function createDataListManager() {
    return new DataListManager();
}

export function createNotificationManager() {
    return new NotificationManager();
}

export function createFormHandler() {
    return new FormHandler();
}

export function createResizeHandler() {
    return new ResizeHandler();
}