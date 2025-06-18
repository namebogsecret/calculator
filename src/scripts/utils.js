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
 * Expression processing utilities
 */
export function prepareExpression(expr, angleMode = 'deg') {
    let prepared = expr
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/aMath\.sin/g, 'Math.asin')
        .replace(/aMath\.cos/g, 'Math.acos')
        .replace(/aMath\.tan/g, 'Math.atan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/cbrt/g, 'Math.cbrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/exp/g, 'Math.exp')
        .replace(/floor/g, 'Math.floor')
        .replace(/ceil/g, 'Math.ceil')
        .replace(/round/g, 'Math.round')
        .replace(/\^/g, '**')
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/−/g, '-')
        .replace(/%/g, '%')
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E');
    
    // Handle factorial
    prepared = prepared.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)));
    
    // Convert angles for trigonometric functions
    if (angleMode === 'deg') {
        prepared = prepared
            .replace(/Math\.sin\((.*?)\)/g, (match, angle) => `Math.sin((${angle}) * Math.PI / 180)`)
            .replace(/Math\.cos\((.*?)\)/g, (match, angle) => `Math.cos((${angle}) * Math.PI / 180)`)
            .replace(/Math\.tan\((.*?)\)/g, (match, angle) => `Math.tan((${angle}) * Math.PI / 180)`);
    }
    
    return prepared;
}

export function prepareFunctionExpression(funcStr) {
    return funcStr
        .replace(/f\(x\)\s*=\s*/, '')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/\^/g, '**')
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E');
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
    // Box-Muller transform
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    
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

export function gamma(z) {
    // Stirling's approximation
    if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    }
    
    z -= 1;
    let x = 0.99999999999980993;
    const coefficients = [
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];
    
    for (let i = 0; i < coefficients.length; i++) {
        x += coefficients[i] / (z + i + 1);
    }
    
    const t = z + coefficients.length - 0.5;
    const sqrtTwoPi = Math.sqrt(2 * Math.PI);
    
    return sqrtTwoPi * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
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