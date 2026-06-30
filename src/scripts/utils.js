/**
 * Utility functions for mathematical operations and data processing
 */

import { CALCULATOR_CONFIG } from './constants.js';

/**
 * Number formatting and display utilities
 */
export function formatNumber(num) {
    // Handle non-numeric inputs
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
        return 'Error';
    }
    
    if (Math.abs(num) < CALCULATOR_CONFIG.EXPONENTIAL_THRESHOLD_LOWER || 
        Math.abs(num) > CALCULATOR_CONFIG.EXPONENTIAL_THRESHOLD_UPPER) {
        return num.toExponential(6);
    }
    return parseFloat(num.toPrecision(CALCULATOR_CONFIG.DEFAULT_PRECISION)).toString();
}

/**
 * Mathematical utility functions
 */
export function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

export function combination(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    let result = 1;
    for (let i = 0; i < k; i++) {
        result *= (n - i) / (i + 1);
    }
    return result;
}

export function permutation(n, k) {
    if (k > n) return 0;
    let result = 1;
    for (let i = 0; i < k; i++) {
        result *= (n - i);
    }
    return result;
}

/**
 * Expression processing utilities with caching for performance
 */

// Cache for prepared expressions to avoid repeated processing
const expressionCache = new Map();
const MAX_CACHE_SIZE = 100;

// Pre-compiled replacement map for single-pass processing
const FUNCTION_REPLACEMENTS = {
    'asin': 'Math.asin',
    'acos': 'Math.acos',
    'atan': 'Math.atan',
    'sinh': 'Math.sinh',
    'cosh': 'Math.cosh',
    'tanh': 'Math.tanh',
    'sin': 'Math.sin',
    'cos': 'Math.cos',
    'tan': 'Math.tan',
    'log2': 'Math.log2',
    'log': 'Math.log10',
    'ln': 'Math.log',
    'sqrt': 'Math.sqrt',
    'cbrt': 'Math.cbrt',
    'abs': 'Math.abs',
    'exp': 'Math.exp',
    'floor': 'Math.floor',
    'ceil': 'Math.ceil',
    'round': 'Math.round',
    'pi': 'Math.PI'
};

// Create regex for all function names (sorted by length descending to match longer ones first)
const FUNCTION_PATTERN = new RegExp(
    '\\b(' + Object.keys(FUNCTION_REPLACEMENTS).sort((a, b) => b.length - a.length).join('|') + ')\\b',
    'g'
);

// Operator replacements
const OPERATOR_REPLACEMENTS = {
    '^': '**',
    '÷': '/',
    '×': '*',
    '−': '-'
};

const OPERATOR_PATTERN = /[\^÷×−]/g;

export function prepareExpression(expr, angleMode = 'deg') {
    // Check cache first
    const cacheKey = `${expr}|${angleMode}`;
    if (expressionCache.has(cacheKey)) {
        return expressionCache.get(cacheKey);
    }

    // Single-pass function replacement
    let prepared = expr.replace(FUNCTION_PATTERN, (match) => FUNCTION_REPLACEMENTS[match] || match);

    // Handle 'e' separately to avoid replacing 'e' in other words
    prepared = prepared.replace(/\be\b/g, 'Math.E');

    // Mathematical constant symbols inserted by buttons
    prepared = prepared.replace(/π/g, 'Math.PI');
    prepared = prepared.replace(/φ/g, '((1 + Math.sqrt(5)) / 2)');

    // Operator replacements in single pass
    prepared = prepared.replace(OPERATOR_PATTERN, (match) => OPERATOR_REPLACEMENTS[match] || match);

    // Repair unary minus directly before exponentiation: JS forbids `-3**2`.
    // Rewrite to `-(3**2)` so it evaluates with the mathematical convention -3^2 = -9.
    {
        const POW_OPERAND = '(\\d+\\.?\\d*|Math\\.[A-Za-z]+|\\([^()]*\\))';
        const unaryPow = new RegExp(`(^|[(+\\-*/%,=])\\s*-\\s*${POW_OPERAND}\\s*\\*\\*\\s*${POW_OPERAND}`, 'g');
        let prev;
        do {
            prev = prepared;
            prepared = prepared.replace(unaryPow, (m, pre, base, exp) => `${pre}-(${base}**${exp})`);
        } while (prepared !== prev);
    }

    // Handle factorial — only for bare non-negative integers (e.g. 5!), so that
    // 5.5! / (2+3)! surface as an error instead of silently mis-evaluating.
    prepared = prepared.replace(/(?<![\d.])(\d+)!/g, (match, num) => factorial(parseInt(num)));

    // Convert angles for trigonometric functions
    if (angleMode === 'deg') {
        prepared = prepared
            .replace(/Math\.sin\(([^)]+)\)/g, (match, angle) => `Math.sin((${angle}) * Math.PI / 180)`)
            .replace(/Math\.cos\(([^)]+)\)/g, (match, angle) => `Math.cos((${angle}) * Math.PI / 180)`)
            .replace(/Math\.tan\(([^)]+)\)/g, (match, angle) => `Math.tan((${angle}) * Math.PI / 180)`)
            // Inverse trig must return degrees in DEG mode
            .replace(/Math\.asin\(([^)]+)\)/g, (match, v) => `(Math.asin(${v}) * 180 / Math.PI)`)
            .replace(/Math\.acos\(([^)]+)\)/g, (match, v) => `(Math.acos(${v}) * 180 / Math.PI)`)
            .replace(/Math\.atan\(([^)]+)\)/g, (match, v) => `(Math.atan(${v}) * 180 / Math.PI)`);
    }

    // Manage cache size
    if (expressionCache.size >= MAX_CACHE_SIZE) {
        // Remove oldest entry
        const firstKey = expressionCache.keys().next().value;
        expressionCache.delete(firstKey);
    }
    expressionCache.set(cacheKey, prepared);

    return prepared;
}

// Cache for function expressions
const functionExpressionCache = new Map();

export function prepareFunctionExpression(funcStr) {
    // Check cache first
    if (functionExpressionCache.has(funcStr)) {
        return functionExpressionCache.get(funcStr);
    }

    let prepared = funcStr.replace(/f\(x\)\s*=\s*/, '');

    // Use the same single-pass replacement pattern
    prepared = prepared.replace(FUNCTION_PATTERN, (match) => FUNCTION_REPLACEMENTS[match] || match);

    // Handle 'e' separately
    prepared = prepared.replace(/\be\b/g, 'Math.E');

    // Mathematical constant symbols
    prepared = prepared.replace(/π/g, 'Math.PI');
    prepared = prepared.replace(/φ/g, '((1 + Math.sqrt(5)) / 2)');

    // Operator replacement
    prepared = prepared.replace(OPERATOR_PATTERN, (match) => OPERATOR_REPLACEMENTS[match] || match);

    // Manage cache size
    if (functionExpressionCache.size >= MAX_CACHE_SIZE) {
        const firstKey = functionExpressionCache.keys().next().value;
        functionExpressionCache.delete(firstKey);
    }
    functionExpressionCache.set(funcStr, prepared);

    return prepared;
}

/**
 * Array and data processing utilities
 */
export function parseNumberArray(input) {
    return input
        .split(/[\s,;]+/)
        .map(n => parseFloat(n))
        .filter(n => !isNaN(n));
}

export function mean(data) {
    return data.reduce((sum, val) => sum + val, 0) / data.length;
}

export function variance(data, population = false) {
    const avg = mean(data);
    const sumSquaredDiffs = data.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0);
    return sumSquaredDiffs / (data.length - (population ? 0 : 1));
}

export function standardDeviation(data, population = false) {
    return Math.sqrt(variance(data, population));
}

export function quantile(sortedData, q) {
    const pos = (sortedData.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    
    if (sortedData[base + 1] !== undefined) {
        return sortedData[base] + rest * (sortedData[base + 1] - sortedData[base]);
    } else {
        return sortedData[base];
    }
}

/**
 * Random number generators
 */
export function randomNormal(mu = 0, sigma = 1) {
    // Box-Muller transform with safe random value generation
    // Use Math.max to avoid infinite loop risk when Math.random() returns 0
    const u = Math.max(Number.MIN_VALUE, Math.random());
    const v = Math.max(Number.MIN_VALUE, Math.random());

    return mu + sigma * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function generateRandomData(type, n, ...params) {
    const data = [];
    
    switch (type) {
        case 'normal':
            const [mu, sigma] = params;
            for (let i = 0; i < n; i++) {
                data.push(randomNormal(mu, sigma));
            }
            break;
            
        case 'uniform':
            const [a, b] = params;
            for (let i = 0; i < n; i++) {
                data.push(a + Math.random() * (b - a));
            }
            break;
            
        case 'exponential':
            const [lambda] = params;
            for (let i = 0; i < n; i++) {
                data.push(-Math.log(1 - Math.random()) / lambda);
            }
            break;
    }
    
    return data;
}

/**
 * Advanced mathematical functions
 */
export function erf(x) {
    // Error function approximation
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
}

// Memoization cache for gamma function
const gammaCache = new Map();
const GAMMA_CACHE_SIZE = 200;

// Pre-computed coefficients for gamma function
const GAMMA_COEFFICIENTS = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
];

const SQRT_TWO_PI = Math.sqrt(2 * Math.PI);

export function gamma(z) {
    // Round to 10 decimal places for cache key
    const cacheKey = Math.round(z * 1e10) / 1e10;

    if (gammaCache.has(cacheKey)) {
        return gammaCache.get(cacheKey);
    }

    let result;

    // Reflection formula for z < 0.5
    if (z < 0.5) {
        result = Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    } else {
        z -= 1;
        let x = 0.99999999999980993;

        for (let i = 0; i < GAMMA_COEFFICIENTS.length; i++) {
            x += GAMMA_COEFFICIENTS[i] / (z + i + 1);
        }

        const t = z + GAMMA_COEFFICIENTS.length - 0.5;
        result = SQRT_TWO_PI * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }

    // Manage cache size
    if (gammaCache.size >= GAMMA_CACHE_SIZE) {
        const firstKey = gammaCache.keys().next().value;
        gammaCache.delete(firstKey);
    }
    gammaCache.set(cacheKey, result);

    return result;
}

/**
 * Validation utilities
 */
export function isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Debounce utility for performance optimization
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * File handling utilities
 */
export function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
}

export function readJSONFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                resolve(data);
            } catch (error) {
                reject(new Error('Invalid JSON file'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}