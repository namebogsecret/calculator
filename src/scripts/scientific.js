/**
 * Scientific functions including trigonometry, logarithms, and probability distributions
 */

import { factorial, combination, erf, formatNumber } from './utils.js';

/**
 * Trigonometric functions
 */
export class TrigonometricFunctions {
    static sin(x, angleMode = 'rad') {
        return angleMode === 'deg' ? Math.sin(x * Math.PI / 180) : Math.sin(x);
    }

    static cos(x, angleMode = 'rad') {
        return angleMode === 'deg' ? Math.cos(x * Math.PI / 180) : Math.cos(x);
    }

    static tan(x, angleMode = 'rad') {
        return angleMode === 'deg' ? Math.tan(x * Math.PI / 180) : Math.tan(x);
    }

    static asin(x, angleMode = 'rad') {
        const result = Math.asin(x);
        return angleMode === 'deg' ? result * 180 / Math.PI : result;
    }

    static acos(x, angleMode = 'rad') {
        const result = Math.acos(x);
        return angleMode === 'deg' ? result * 180 / Math.PI : result;
    }

    static atan(x, angleMode = 'rad') {
        const result = Math.atan(x);
        return angleMode === 'deg' ? result * 180 / Math.PI : result;
    }

    static atan2(y, x, angleMode = 'rad') {
        const result = Math.atan2(y, x);
        return angleMode === 'deg' ? result * 180 / Math.PI : result;
    }

    // Hyperbolic functions
    static sinh(x) {
        return Math.sinh(x);
    }

    static cosh(x) {
        return Math.cosh(x);
    }

    static tanh(x) {
        return Math.tanh(x);
    }

    static asinh(x) {
        return Math.asinh(x);
    }

    static acosh(x) {
        return Math.acosh(x);
    }

    static atanh(x) {
        return Math.atanh(x);
    }
}

/**
 * Logarithmic and exponential functions
 */
export class LogarithmicFunctions {
    static log(x, base = 10) {
        if (base === 10) return Math.log10(x);
        if (base === Math.E) return Math.log(x);
        return Math.log(x) / Math.log(base);
    }

    static ln(x) {
        return Math.log(x);
    }

    static log10(x) {
        return Math.log10(x);
    }

    static log2(x) {
        return Math.log2(x);
    }

    static exp(x) {
        return Math.exp(x);
    }

    static pow(base, exponent) {
        return Math.pow(base, exponent);
    }

    static sqrt(x) {
        return Math.sqrt(x);
    }

    static cbrt(x) {
        return Math.cbrt(x);
    }

    static nthRoot(x, n) {
        return Math.pow(x, 1 / n);
    }
}

/**
 * Probability distributions
 */
export class ProbabilityDistributions {
    /**
     * Normal distribution
     */
    static normalPDF(x, mu = 0, sigma = 1) {
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) * 
               Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    }

    static normalCDF(x, mu = 0, sigma = 1) {
        return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
    }

    /**
     * Binomial distribution
     */
    static binomialPMF(k, n, p) {
        if (k < 0 || k > n) return 0;
        return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    static binomialCDF(k, n, p) {
        let sum = 0;
        for (let i = 0; i <= k; i++) {
            sum += this.binomialPMF(i, n, p);
        }
        return sum;
    }

    /**
     * Poisson distribution
     */
    static poissonPMF(k, lambda) {
        if (k < 0) return 0;
        return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
    }

    static poissonCDF(k, lambda) {
        let sum = 0;
        for (let i = 0; i <= k; i++) {
            sum += this.poissonPMF(i, lambda);
        }
        return sum;
    }

    /**
     * Exponential distribution
     */
    static exponentialPDF(x, lambda) {
        if (x < 0) return 0;
        return lambda * Math.exp(-lambda * x);
    }

    static exponentialCDF(x, lambda) {
        if (x < 0) return 0;
        return 1 - Math.exp(-lambda * x);
    }

    /**
     * Uniform distribution
     */
    static uniformPDF(x, a, b) {
        if (x < a || x > b) return 0;
        return 1 / (b - a);
    }

    static uniformCDF(x, a, b) {
        if (x < a) return 0;
        if (x > b) return 1;
        return (x - a) / (b - a);
    }

    /**
     * Chi-square distribution (approximation)
     */
    static chi2CDF(x, df) {
        return this.gammaIncomplete(x / 2, df / 2);
    }

    /**
     * t-distribution (approximation)
     */
    static tCDF(t, df) {
        const x = df / (df + t * t);
        return 0.5 * this.betaIncomplete(x, df / 2, 0.5);
    }

    /**
     * Helper functions for distributions with adaptive iteration
     */
    static gammaIncomplete(x, a) {
        // Simplified incomplete gamma function with adaptive termination
        const maxIterations = 100;
        const tolerance = 1e-10;
        let sum = 0;
        let prevSum = -1;

        for (let k = 0; k < maxIterations; k++) {
            const term = Math.pow(x, k) * Math.exp(-x) / factorial(k);
            sum += term;
            // Early termination when sum stabilizes or term is negligible
            if (Math.abs(term) < tolerance || Math.abs(sum - prevSum) < tolerance) {
                break;
            }
            prevSum = sum;
        }
        return sum;
    }

    static betaIncomplete(x, a, b) {
        // Simplified incomplete beta function with adaptive termination
        if (x < 0 || x > 1) return 0;

        const maxIterations = 100;
        const tolerance = 1e-10;
        let sum = 0;
        let prevSum = -1;

        for (let k = 0; k < maxIterations; k++) {
            const term = Math.pow(x, a + k) * Math.pow(1 - x, b) /
                        (factorial(k) * (a + k));
            sum += term;
            // Early termination when sum stabilizes or term is negligible
            if (Math.abs(term) < tolerance || Math.abs(sum - prevSum) < tolerance) {
                break;
            }
            prevSum = sum;
        }
        return sum;
    }
}

/**
 * Statistical tests
 */
export class StatisticalTests {
    /**
     * One-sample t-test
     */
    static oneSampleTTest(data, mu0 = 0) {
        const n = data.length;
        const mean = data.reduce((sum, x) => sum + x, 0) / n;
        const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1);
        const stdError = Math.sqrt(variance / n);
        
        const tStat = (mean - mu0) / stdError;
        const df = n - 1;
        const pValue = 2 * (1 - ProbabilityDistributions.tCDF(Math.abs(tStat), df));
        
        return {
            statistic: tStat,
            pValue: pValue,
            degreesOfFreedom: df,
            mean: mean,
            standardError: stdError,
            conclusion: pValue < 0.05 ? 'Reject H₀' : 'Fail to reject H₀'
        };
    }

    /**
     * One-sample z-test
     */
    static oneSampleZTest(data, mu0 = 0, sigma = null) {
        const n = data.length;
        const mean = data.reduce((sum, x) => sum + x, 0) / n;
        
        // Use sample standard deviation if population sigma not provided
        const stdDev = sigma || Math.sqrt(data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n);
        const stdError = stdDev / Math.sqrt(n);
        
        const zStat = (mean - mu0) / stdError;
        const pValue = 2 * (1 - ProbabilityDistributions.normalCDF(Math.abs(zStat), 0, 1));
        
        return {
            statistic: zStat,
            pValue: pValue,
            mean: mean,
            standardError: stdError,
            conclusion: pValue < 0.05 ? 'Reject H₀' : 'Fail to reject H₀'
        };
    }

    /**
     * Chi-square goodness of fit test
     */
    static chiSquareTest(observed, expected) {
        if (observed.length !== expected.length) {
            throw new Error('Observed and expected arrays must have the same length');
        }
        
        let chiStat = 0;
        for (let i = 0; i < observed.length; i++) {
            chiStat += Math.pow(observed[i] - expected[i], 2) / expected[i];
        }
        
        const df = observed.length - 1;
        const pValue = 1 - ProbabilityDistributions.chi2CDF(chiStat, df);
        
        return {
            statistic: chiStat,
            pValue: pValue,
            degreesOfFreedom: df,
            conclusion: pValue < 0.05 ? 'Reject H₀' : 'Fail to reject H₀'
        };
    }
}

/**
 * Financial functions
 */
export class FinancialFunctions {
    /**
     * Present Value
     */
    static presentValue(rate, nper, pmt, fv = 0, type = 0) {
        if (rate === 0) return -(pmt * nper + fv);
        
        const pvFactor = Math.pow(1 + rate, -nper);
        return -(pmt * (1 + rate * type) * (1 - pvFactor) / rate + fv * pvFactor);
    }

    /**
     * Future Value
     */
    static futureValue(rate, nper, pmt, pv = 0, type = 0) {
        if (rate === 0) return -(pv + pmt * nper);
        
        const fvFactor = Math.pow(1 + rate, nper);
        return -(pv * fvFactor + pmt * (1 + rate * type) * (fvFactor - 1) / rate);
    }

    /**
     * Net Present Value
     */
    static netPresentValue(rate, values) {
        return values.reduce((acc, val, i) => acc + val / Math.pow(1 + rate, i), 0);
    }

    /**
     * Internal Rate of Return (Newton's method)
     */
    static internalRateOfReturn(values, guess = 0.1) {
        let rate = guess;
        const maxIterations = 100;
        const tolerance = 1e-7;
        
        for (let i = 0; i < maxIterations; i++) {
            const npvValue = this.netPresentValue(rate, values);
            const npvDerivative = values.reduce((acc, val, j) => 
                acc - j * val / Math.pow(1 + rate, j + 1), 0
            );
            
            const newRate = rate - npvValue / npvDerivative;
            
            if (Math.abs(newRate - rate) < tolerance) {
                return newRate;
            }
            
            rate = newRate;
        }
        
        return NaN; // Did not converge
    }

    /**
     * Payment calculation
     */
    static payment(rate, nper, pv, fv = 0, type = 0) {
        if (rate === 0) return -(pv + fv) / nper;
        
        const factor = Math.pow(1 + rate, nper);
        return -(pv * factor + fv) * rate / ((factor - 1) * (1 + rate * type));
    }
}

/**
 * Matrix operations with optimized algorithms
 */
export class Matrix {
    constructor(data) {
        this.data = data;
        this.rows = data.length;
        this.cols = data[0].length;
    }

    multiply(other) {
        if (this.cols !== other.rows) {
            throw new Error('Matrix dimensions incompatible for multiplication');
        }

        const result = [];
        for (let i = 0; i < this.rows; i++) {
            result[i] = [];
            for (let j = 0; j < other.cols; j++) {
                let sum = 0;
                for (let k = 0; k < this.cols; k++) {
                    sum += this.data[i][k] * other.data[k][j];
                }
                result[i][j] = sum;
            }
        }

        return new Matrix(result);
    }

    transpose() {
        const result = [];
        for (let j = 0; j < this.cols; j++) {
            result[j] = [];
            for (let i = 0; i < this.rows; i++) {
                result[j][i] = this.data[i][j];
            }
        }
        return new Matrix(result);
    }

    /**
     * Calculate determinant using LU decomposition - O(n³) instead of O(n!)
     */
    determinant() {
        if (this.rows !== this.cols) {
            throw new Error('Matrix must be square to calculate determinant');
        }

        const n = this.rows;

        // Special case for small matrices
        if (n === 1) {
            return this.data[0][0];
        }
        if (n === 2) {
            return this.data[0][0] * this.data[1][1] - this.data[0][1] * this.data[1][0];
        }

        // LU decomposition with partial pivoting
        // Create a copy of the matrix
        const matrix = this.data.map(row => [...row]);
        let det = 1;
        let swaps = 0;

        for (let col = 0; col < n; col++) {
            // Find pivot
            let maxRow = col;
            for (let row = col + 1; row < n; row++) {
                if (Math.abs(matrix[row][col]) > Math.abs(matrix[maxRow][col])) {
                    maxRow = row;
                }
            }

            // Swap rows if needed
            if (maxRow !== col) {
                [matrix[col], matrix[maxRow]] = [matrix[maxRow], matrix[col]];
                swaps++;
            }

            // Check for zero pivot
            if (Math.abs(matrix[col][col]) < 1e-10) {
                return 0; // Matrix is singular
            }

            // Eliminate below
            for (let row = col + 1; row < n; row++) {
                const factor = matrix[row][col] / matrix[col][col];
                for (let j = col; j < n; j++) {
                    matrix[row][j] -= factor * matrix[col][j];
                }
            }

            det *= matrix[col][col];
        }

        // Apply sign change for row swaps
        return swaps % 2 === 0 ? det : -det;
    }

    getSubMatrix(skipRow, skipCol) {
        const subData = [];
        for (let i = 0; i < this.rows; i++) {
            if (i === skipRow) continue;
            const row = [];
            for (let j = 0; j < this.cols; j++) {
                if (j === skipCol) continue;
                row.push(this.data[i][j]);
            }
            subData.push(row);
        }
        return new Matrix(subData);
    }

    /**
     * Calculate inverse using Gauss-Jordan elimination - O(n³)
     */
    inverse() {
        if (this.rows !== this.cols) {
            throw new Error('Matrix must be square to calculate inverse');
        }

        const n = this.rows;

        // Special case for 2x2
        if (n === 2) {
            const det = this.data[0][0] * this.data[1][1] - this.data[0][1] * this.data[1][0];
            if (Math.abs(det) < 1e-10) {
                throw new Error('Matrix is singular and cannot be inverted');
            }
            return new Matrix([
                [this.data[1][1] / det, -this.data[0][1] / det],
                [-this.data[1][0] / det, this.data[0][0] / det]
            ]);
        }

        // Create augmented matrix [A|I]
        const augmented = [];
        for (let i = 0; i < n; i++) {
            augmented[i] = [...this.data[i]];
            for (let j = 0; j < n; j++) {
                augmented[i].push(i === j ? 1 : 0);
            }
        }

        // Gauss-Jordan elimination
        for (let col = 0; col < n; col++) {
            // Find pivot
            let maxRow = col;
            for (let row = col + 1; row < n; row++) {
                if (Math.abs(augmented[row][col]) > Math.abs(augmented[maxRow][col])) {
                    maxRow = row;
                }
            }

            [augmented[col], augmented[maxRow]] = [augmented[maxRow], augmented[col]];

            if (Math.abs(augmented[col][col]) < 1e-10) {
                throw new Error('Matrix is singular and cannot be inverted');
            }

            // Scale pivot row
            const pivot = augmented[col][col];
            for (let j = 0; j < 2 * n; j++) {
                augmented[col][j] /= pivot;
            }

            // Eliminate column
            for (let row = 0; row < n; row++) {
                if (row !== col) {
                    const factor = augmented[row][col];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented[row][j] -= factor * augmented[col][j];
                    }
                }
            }
        }

        // Extract inverse from augmented matrix
        const result = [];
        for (let i = 0; i < n; i++) {
            result[i] = augmented[i].slice(n);
        }

        return new Matrix(result);
    }
}

/**
 * Unit conversion utilities
 */
export class UnitConverter {
    static angleConversions = {
        degToRad: (deg) => deg * Math.PI / 180,
        radToDeg: (rad) => rad * 180 / Math.PI,
        degToGrad: (deg) => deg * 10 / 9,
        gradToDeg: (grad) => grad * 9 / 10,
        radToGrad: (rad) => rad * 200 / Math.PI,
        gradToRad: (grad) => grad * Math.PI / 200
    };
    
    static temperatureConversions = {
        celsiusToFahrenheit: (c) => (c * 9/5) + 32,
        fahrenheitToCelsius: (f) => (f - 32) * 5/9,
        celsiusToKelvin: (c) => c + 273.15,
        kelvinToCelsius: (k) => k - 273.15,
        fahrenheitToKelvin: (f) => (f - 32) * 5/9 + 273.15,
        kelvinToFahrenheit: (k) => (k - 273.15) * 9/5 + 32
    };
}