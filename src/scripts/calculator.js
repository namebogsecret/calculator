/**
 * Basic calculator functionality and operations
 */

import { prepareExpression, formatNumber, isValidNumber } from './utils.js';
import { CALCULATOR_CONFIG } from './constants.js';

/**
 * Calculator class for basic arithmetic operations
 */
export class Calculator {
    constructor() {
        this.expression = '';
        this.angleMode = CALCULATOR_CONFIG.DEFAULT_ANGLE_MODE;
        this.history = [];
        this.maxHistorySize = 50;
        this.memory = 0;
        this.memoryStack = [];
    }

    /**
     * Core calculation methods
     */
    appendToExpression(value) {
        if (this.expression === '0' && value !== '.') {
            this.expression = '';
        }
        this.expression += value;
        return this.expression;
    }

    appendFunction(func) {
        this.expression += func;
        return this.expression;
    }

    calculate() {
        try {
            const preparedExpression = prepareExpression(this.expression, this.angleMode);
            // Use Function constructor instead of eval() for better performance and security
            const computeResult = new Function('return ' + preparedExpression);
            const result = computeResult();

            if (!isValidNumber(result)) {
                throw new Error('Invalid result');
            }

            // Add to history
            this.addToHistory(this.expression, result);

            // Update expression to result
            this.expression = result.toString();

            return {
                success: true,
                result: result,
                formattedResult: formatNumber(result)
            };

        } catch (error) {
            return {
                success: false,
                error: error.message || 'Calculation Error',
                result: null
            };
        }
    }

    /**
     * Preview calculation without changing the expression
     */
    previewCalculation() {
        try {
            const preparedExpression = prepareExpression(this.expression, this.angleMode);
            // Use Function constructor instead of eval() for better performance and security
            const computeResult = new Function('return ' + preparedExpression);
            const result = computeResult();

            if (isValidNumber(result)) {
                return formatNumber(result);
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Expression manipulation methods
     */
    clear() {
        this.expression = '';
        return this.expression;
    }

    deleteLastChar() {
        this.expression = this.expression.slice(0, -1);
        return this.expression;
    }

    insertAtCursor(value, cursorPosition) {
        const before = this.expression.substring(0, cursorPosition);
        const after = this.expression.substring(cursorPosition);
        this.expression = before + value + after;
        return this.expression;
    }

    /**
     * Angle mode management
     */
    setAngleMode(mode) {
        if (['deg', 'rad'].includes(mode)) {
            this.angleMode = mode;
        }
        return this.angleMode;
    }

    toggleAngleMode() {
        this.angleMode = this.angleMode === 'deg' ? 'rad' : 'deg';
        return this.angleMode;
    }

    getAngleMode() {
        return this.angleMode;
    }

    /**
     * History management
     */
    addToHistory(expression, result) {
        const entry = {
            expression: expression,
            result: result,
            formattedResult: formatNumber(result),
            timestamp: new Date()
        };
        
        this.history.unshift(entry);
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }
    }

    getHistory() {
        return [...this.history];
    }

    clearHistory() {
        this.history = [];
    }

    recallFromHistory(index) {
        if (index >= 0 && index < this.history.length) {
            this.expression = this.history[index].result.toString();
            return this.expression;
        }
        return null;
    }

    /**
     * Memory functions
     */
    initializeMemory() {
        this.memory = 0;
        this.memoryStack = [];
    }

    memoryStore(value = null) {
        const valueToStore = value !== null ? value : this.getLastResult();
        if (isValidNumber(valueToStore)) {
            this.memory = valueToStore;
            return this.memory;
        }
        return null;
    }

    memoryRecall() {
        return this.memory;
    }

    memoryAdd(value = null) {
        const valueToAdd = value !== null ? value : this.getLastResult();
        if (isValidNumber(valueToAdd)) {
            this.memory += valueToAdd;
            return this.memory;
        }
        return null;
    }

    memorySubtract(value = null) {
        const valueToSubtract = value !== null ? value : this.getLastResult();
        if (isValidNumber(valueToSubtract)) {
            this.memory -= valueToSubtract;
            return this.memory;
        }
        return null;
    }

    memoryClear() {
        this.memory = 0;
        return this.memory;
    }

    /**
     * Stack-based memory operations
     */
    pushToMemoryStack(value = null) {
        const valueToPush = value !== null ? value : this.getLastResult();
        if (isValidNumber(valueToPush)) {
            this.memoryStack.push(valueToPush);
            return this.memoryStack.length;
        }
        return null;
    }

    popFromMemoryStack() {
        if (this.memoryStack.length > 0) {
            return this.memoryStack.pop();
        }
        return null;
    }

    getMemoryStack() {
        return [...this.memoryStack];
    }

    clearMemoryStack() {
        this.memoryStack = [];
        return true;
    }

    /**
     * Utility methods
     */
    getLastResult() {
        if (this.history.length > 0) {
            return this.history[0].result;
        }
        return 0;
    }

    getCurrentExpression() {
        return this.expression;
    }

    setExpression(expr) {
        this.expression = expr;
        return this.expression;
    }

    validateExpression(expr = this.expression) {
        try {
            const prepared = prepareExpression(expr, this.angleMode);
            // Try to evaluate without actually executing
            new Function(`return ${prepared}`);
            return { valid: true, error: null };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    /**
     * Basic arithmetic operations (for programmatic use)
     */
    add(a, b) {
        return a + b;
    }

    subtract(a, b) {
        return a - b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        if (b === 0) {
            throw new Error('Division by zero');
        }
        return a / b;
    }

    power(base, exponent) {
        return Math.pow(base, exponent);
    }

    root(radicand, index = 2) {
        if (index === 0) {
            throw new Error('Root index cannot be zero');
        }
        return Math.pow(radicand, 1 / index);
    }

    percentage(value, percent) {
        return (value * percent) / 100;
    }

    /**
     * Export/Import functionality
     */
    exportState() {
        return {
            expression: this.expression,
            angleMode: this.angleMode,
            memory: this.memory,
            memoryStack: [...this.memoryStack],
            history: [...this.history]
        };
    }

    importState(state) {
        if (state.expression !== undefined) this.expression = state.expression;
        if (state.angleMode !== undefined) this.angleMode = state.angleMode;
        if (state.memory !== undefined) this.memory = state.memory;
        if (state.memoryStack !== undefined) this.memoryStack = [...state.memoryStack];
        if (state.history !== undefined) this.history = [...state.history];
    }

    /**
     * Reset calculator to initial state
     */
    reset() {
        this.expression = '';
        this.angleMode = CALCULATOR_CONFIG.DEFAULT_ANGLE_MODE;
        this.memory = 0;
        this.memoryStack = [];
        this.history = [];
    }
}

/**
 * Factory function to create calculator instance
 */
export function createCalculator() {
    return new Calculator();
}