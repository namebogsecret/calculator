/**
 * Mathematical constants and configuration values
 */

// Mathematical constants
export const MATH_CONSTANTS = {
    PI: Math.PI,
    E: Math.E,
    PHI: (1 + Math.sqrt(5)) / 2, // Golden ratio
    SQRT2: Math.sqrt(2),
    SQRT3: Math.sqrt(3),
    LN2: Math.log(2),
    LN10: Math.log(10),
    LOG2E: Math.LOG2E,
    LOG10E: Math.LOG10E
};

// Default calculator configuration
export const CALCULATOR_CONFIG = {
    DEFAULT_ANGLE_MODE: 'deg',
    DEFAULT_MODE: 'basic',
    DEFAULT_PRECISION: 10,
    MAX_DISPLAY_LENGTH: 15,
    EXPONENTIAL_THRESHOLD_LOWER: 0.000001,
    EXPONENTIAL_THRESHOLD_UPPER: 999999
};

// Graph configuration
export const GRAPH_CONFIG = {
    DEFAULT_SCALE: 40,
    MIN_SCALE: 10,
    MAX_SCALE: 200,
    ZOOM_FACTOR: 1.2,
    CANVAS_PADDING: 40,
    GRID_OPACITY: 0.1,
    AXIS_OPACITY: 0.5,
    LINE_WIDTH: 2.5,
    SHADOW_BLUR: 10
};

// Statistics configuration
export const STATS_CONFIG = {
    MAX_BINS: 20,
    DEFAULT_SIGNIFICANCE_LEVEL: 0.05,
    MAX_ITERATIONS: 100,
    TOLERANCE: 1e-7,
    MIN_DATA_POINTS: 2
};

// Color schemes for graphs
export const COLOR_SCHEMES = {
    GRAPH_COLORS: [
        '#3b82f6', // Blue
        '#10b981', // Green
        '#f59e0b', // Yellow
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#ec4899', // Pink
        '#14b8a6', // Teal
        '#f97316'  // Orange
    ],
    REGRESSION_COLORS: {
        linear: '#10b981',
        quadratic: '#f59e0b',
        exponential: '#ef4444',
        logarithmic: '#8b5cf6',
        power: '#ec4899'
    }
};

// Default data lists structure
export const DEFAULT_DATA_LISTS = {
    L1: [],
    L2: [],
    L3: [],
    L4: [],
    L5: [],
    L6: []
};

// UI configuration
export const UI_CONFIG = {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 250,
    TOAST_DURATION: 3000,
    CALCULATION_DELAY: 1500
};

// Key bindings
export const KEY_BINDINGS = {
    NUMBERS: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    OPERATORS: ['+', '-', '*', '/'],
    SPECIAL: {
        DECIMAL: '.',
        ENTER: 'Enter',
        ESCAPE: 'Escape',
        BACKSPACE: 'Backspace',
        OPEN_PAREN: '(',
        CLOSE_PAREN: ')'
    }
};