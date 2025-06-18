/**
 * Statistical calculations and regression analysis
 */

import { mean, variance, standardDeviation, quantile, parseNumberArray, formatNumber } from './utils.js';
import { COLOR_SCHEMES, STATS_CONFIG } from './constants.js';

/**
 * Descriptive statistics calculator
 */
export class DescriptiveStatistics {
    constructor(data = []) {
        this.data = [...data];
        this.sortedData = null;
        this.cache = {};
    }

    setData(data) {
        this.data = [...data];
        this.sortedData = null;
        this.cache = {};
    }

    addData(value) {
        this.data.push(value);
        this.sortedData = null;
        this.cache = {};
    }

    getSortedData() {
        if (!this.sortedData) {
            this.sortedData = [...this.data].sort((a, b) => a - b);
        }
        return this.sortedData;
    }

    /**
     * Basic statistics
     */
    count() {
        return this.data.length;
    }

    sum() {
        if (this.cache.sum === undefined) {
            this.cache.sum = this.data.reduce((sum, val) => sum + val, 0);
        }
        return this.cache.sum;
    }

    sumOfSquares() {
        if (this.cache.sumOfSquares === undefined) {
            this.cache.sumOfSquares = this.data.reduce((sum, val) => sum + val * val, 0);
        }
        return this.cache.sumOfSquares;
    }

    mean() {
        if (this.cache.mean === undefined) {
            this.cache.mean = mean(this.data);
        }
        return this.cache.mean;
    }

    median() {
        if (this.cache.median === undefined) {
            this.cache.median = quantile(this.getSortedData(), 0.5);
        }
        return this.cache.median;
    }

    mode() {
        if (this.cache.mode === undefined) {
            const frequency = {};
            let maxFreq = 0;
            let modes = [];

            this.data.forEach(val => {
                frequency[val] = (frequency[val] || 0) + 1;
                if (frequency[val] > maxFreq) {
                    maxFreq = frequency[val];
                }
            });

            for (const val in frequency) {
                if (frequency[val] === maxFreq) {
                    modes.push(parseFloat(val));
                }
            }

            this.cache.mode = modes.length === this.data.length ? null : modes;
        }
        return this.cache.mode;
    }

    /**
     * Measures of spread
     */
    range() {
        if (this.cache.range === undefined) {
            const sorted = this.getSortedData();
            this.cache.range = sorted[sorted.length - 1] - sorted[0];
        }
        return this.cache.range;
    }

    variance(population = false) {
        const key = population ? 'populationVariance' : 'sampleVariance';
        if (this.cache[key] === undefined) {
            this.cache[key] = variance(this.data, population);
        }
        return this.cache[key];
    }

    standardDeviation(population = false) {
        const key = population ? 'populationStdDev' : 'sampleStdDev';
        if (this.cache[key] === undefined) {
            this.cache[key] = standardDeviation(this.data, population);
        }
        return this.cache[key];
    }

    /**
     * Quantiles and percentiles
     */
    quartiles() {
        if (this.cache.quartiles === undefined) {
            const sorted = this.getSortedData();
            this.cache.quartiles = {
                q1: quantile(sorted, 0.25),
                q2: quantile(sorted, 0.5),
                q3: quantile(sorted, 0.75)
            };
        }
        return this.cache.quartiles;
    }

    interquartileRange() {
        if (this.cache.iqr === undefined) {
            const q = this.quartiles();
            this.cache.iqr = q.q3 - q.q1;
        }
        return this.cache.iqr;
    }

    percentile(p) {
        return quantile(this.getSortedData(), p / 100);
    }

    /**
     * Skewness and kurtosis
     */
    skewness() {
        if (this.cache.skewness === undefined) {
            const n = this.data.length;
            const meanVal = this.mean();
            const stdDev = this.standardDeviation();
            
            const sumCubedDeviations = this.data.reduce((sum, val) => 
                sum + Math.pow((val - meanVal) / stdDev, 3), 0);
            
            this.cache.skewness = (n / ((n - 1) * (n - 2))) * sumCubedDeviations;
        }
        return this.cache.skewness;
    }

    kurtosis() {
        if (this.cache.kurtosis === undefined) {
            const n = this.data.length;
            const meanVal = this.mean();
            const stdDev = this.standardDeviation();
            
            const sumFourthDeviations = this.data.reduce((sum, val) => 
                sum + Math.pow((val - meanVal) / stdDev, 4), 0);
            
            this.cache.kurtosis = ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sumFourthDeviations - 
                                 (3 * (n - 1) * (n - 1)) / ((n - 2) * (n - 3));
        }
        return this.cache.kurtosis;
    }

    /**
     * Generate complete statistics summary
     */
    summary() {
        const sorted = this.getSortedData();
        const quartiles = this.quartiles();
        
        return {
            count: this.count(),
            sum: this.sum(),
            sumOfSquares: this.sumOfSquares(),
            mean: this.mean(),
            median: this.median(),
            mode: this.mode(),
            minimum: sorted[0],
            maximum: sorted[sorted.length - 1],
            range: this.range(),
            q1: quartiles.q1,
            q3: quartiles.q3,
            iqr: this.interquartileRange(),
            variance: this.variance(),
            standardDeviation: this.standardDeviation(),
            populationVariance: this.variance(true),
            populationStandardDeviation: this.standardDeviation(true),
            skewness: this.skewness(),
            kurtosis: this.kurtosis()
        };
    }
}

/**
 * Regression analysis
 */
export class RegressionAnalysis {
    constructor() {
        this.regressionTypes = {
            linear: this.linearRegression.bind(this),
            quadratic: this.quadraticRegression.bind(this),
            exponential: this.exponentialRegression.bind(this),
            logarithmic: this.logarithmicRegression.bind(this),
            power: this.powerRegression.bind(this)
        };
    }

    /**
     * Linear regression: y = ax + b
     */
    linearRegression(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
        const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
        const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);
        
        const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const b = (sumY - a * sumX) / n;
        
        // Correlation coefficient
        const r = (n * sumXY - sumX * sumY) / 
            Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        const r2 = r * r;
        
        return {
            type: 'linear',
            coefficients: { a, b },
            equation: `y = ${formatNumber(a)}x + ${formatNumber(b)}`,
            r: r,
            r2: r2,
            func: (x) => a * x + b
        };
    }

    /**
     * Quadratic regression: y = ax² + bx + c
     */
    quadraticRegression(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
        const sumX3 = x.reduce((acc, xi) => acc + xi * xi * xi, 0);
        const sumX4 = x.reduce((acc, xi) => acc + xi * xi * xi * xi, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
        const sumX2Y = x.reduce((acc, xi, i) => acc + xi * xi * y[i], 0);
        
        // System of equations for quadratic regression
        const matrix = [
            [n, sumX, sumX2, sumY],
            [sumX, sumX2, sumX3, sumXY],
            [sumX2, sumX3, sumX4, sumX2Y]
        ];
        
        const solution = this.solveLinearSystem(matrix);
        const [c, b, a] = solution;
        
        // Calculate R²
        const yMean = sumY / n;
        const ssTotal = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
        const ssResidual = y.reduce((acc, yi, i) => {
            const yPred = a * x[i] * x[i] + b * x[i] + c;
            return acc + Math.pow(yi - yPred, 2);
        }, 0);
        const r2 = 1 - ssResidual / ssTotal;
        
        return {
            type: 'quadratic',
            coefficients: { a, b, c },
            equation: `y = ${formatNumber(a)}x² + ${formatNumber(b)}x + ${formatNumber(c)}`,
            r2: r2,
            func: (x) => a * x * x + b * x + c
        };
    }

    /**
     * Exponential regression: y = ae^(bx)
     */
    exponentialRegression(x, y) {
        // Transform to linear: ln(y) = ln(a) + bx
        const lnY = y.map(yi => Math.log(yi));
        const linear = this.linearRegression(x, lnY);
        
        const a = Math.exp(linear.coefficients.b);
        const b = linear.coefficients.a;
        
        // Calculate R² for original data
        const yMean = mean(y);
        const ssTotal = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
        const ssResidual = y.reduce((acc, yi, i) => {
            const yPred = a * Math.exp(b * x[i]);
            return acc + Math.pow(yi - yPred, 2);
        }, 0);
        const r2 = 1 - ssResidual / ssTotal;
        
        return {
            type: 'exponential',
            coefficients: { a, b },
            equation: `y = ${formatNumber(a)} * e^(${formatNumber(b)}x)`,
            r2: r2,
            func: (x) => a * Math.exp(b * x)
        };
    }

    /**
     * Logarithmic regression: y = a * ln(x) + b
     */
    logarithmicRegression(x, y) {
        const lnX = x.map(xi => Math.log(xi));
        const linear = this.linearRegression(lnX, y);
        
        return {
            type: 'logarithmic',
            coefficients: { a: linear.coefficients.a, b: linear.coefficients.b },
            equation: `y = ${formatNumber(linear.coefficients.a)} * ln(x) + ${formatNumber(linear.coefficients.b)}`,
            r2: linear.r2,
            func: (x) => linear.coefficients.a * Math.log(x) + linear.coefficients.b
        };
    }

    /**
     * Power regression: y = ax^b
     */
    powerRegression(x, y) {
        // Transform to linear: ln(y) = ln(a) + b*ln(x)
        const lnX = x.map(xi => Math.log(xi));
        const lnY = y.map(yi => Math.log(yi));
        const linear = this.linearRegression(lnX, lnY);
        
        const a = Math.exp(linear.coefficients.b);
        const b = linear.coefficients.a;
        
        // Calculate R² for original data
        const yMean = mean(y);
        const ssTotal = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
        const ssResidual = y.reduce((acc, yi, i) => {
            const yPred = a * Math.pow(x[i], b);
            return acc + Math.pow(yi - yPred, 2);
        }, 0);
        const r2 = 1 - ssResidual / ssTotal;
        
        return {
            type: 'power',
            coefficients: { a, b },
            equation: `y = ${formatNumber(a)} * x^${formatNumber(b)}`,
            r2: r2,
            func: (x) => a * Math.pow(x, b)
        };
    }

    /**
     * Perform regression analysis
     */
    analyze(xData, yData, type = 'linear') {
        if (xData.length !== yData.length || xData.length < 2) {
            throw new Error('Invalid data: arrays must have same length and at least 2 points');
        }

        if (!this.regressionTypes[type]) {
            throw new Error(`Unknown regression type: ${type}`);
        }

        return this.regressionTypes[type](xData, yData);
    }

    /**
     * Solve linear system using Gaussian elimination
     */
    solveLinearSystem(augmentedMatrix) {
        const n = augmentedMatrix.length;
        
        // Forward elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmentedMatrix[k][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
                    maxRow = k;
                }
            }
            
            // Swap rows
            [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];
            
            // Eliminate column
            for (let k = i + 1; k < n; k++) {
                const factor = augmentedMatrix[k][i] / augmentedMatrix[i][i];
                for (let j = i; j < n + 1; j++) {
                    augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                }
            }
        }
        
        // Back substitution
        const solution = new Array(n);
        for (let i = n - 1; i >= 0; i--) {
            solution[i] = augmentedMatrix[i][n];
            for (let j = i + 1; j < n; j++) {
                solution[i] -= augmentedMatrix[i][j] * solution[j];
            }
            solution[i] /= augmentedMatrix[i][i];
        }
        
        return solution;
    }
}

/**
 * Two-variable statistics
 */
export class TwoVariableStatistics {
    constructor(xData = [], yData = []) {
        this.setData(xData, yData);
    }

    setData(xData, yData) {
        if (xData.length !== yData.length) {
            throw new Error('X and Y data arrays must have the same length');
        }
        
        this.xData = [...xData];
        this.yData = [...yData];
        this.xStats = new DescriptiveStatistics(this.xData);
        this.yStats = new DescriptiveStatistics(this.yData);
        this.regression = new RegressionAnalysis();
    }

    /**
     * Correlation coefficient
     */
    correlationCoefficient() {
        const n = this.xData.length;
        const sumX = this.xStats.sum();
        const sumY = this.yStats.sum();
        const sumXY = this.xData.reduce((acc, xi, i) => acc + xi * this.yData[i], 0);
        const sumX2 = this.xStats.sumOfSquares();
        const sumY2 = this.yStats.sumOfSquares();
        
        return (n * sumXY - sumX * sumY) / 
               Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    }

    /**
     * Covariance
     */
    covariance() {
        const n = this.xData.length;
        const meanX = this.xStats.mean();
        const meanY = this.yStats.mean();
        
        const sumProducts = this.xData.reduce((acc, xi, i) => 
            acc + (xi - meanX) * (this.yData[i] - meanY), 0);
        
        return sumProducts / (n - 1);
    }

    /**
     * Linear regression
     */
    linearRegression() {
        return this.regression.analyze(this.xData, this.yData, 'linear');
    }

    /**
     * Complete two-variable summary
     */
    summary() {
        const correlation = this.correlationCoefficient();
        const covariance = this.covariance();
        const linearReg = this.linearRegression();
        
        return {
            n: this.xData.length,
            xStats: this.xStats.summary(),
            yStats: this.yStats.summary(),
            sumXY: this.xData.reduce((acc, xi, i) => acc + xi * this.yData[i], 0),
            correlation: correlation,
            covariance: covariance,
            regression: linearReg
        };
    }
}

/**
 * Data visualization helpers
 */
export class StatisticsVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    /**
     * Draw histogram
     */
    drawHistogram(data, options = {}) {
        const {
            bins = Math.min(STATS_CONFIG.MAX_BINS, Math.ceil(Math.sqrt(data.length))),
            color = '#3b82f6',
            title = 'Histogram'
        } = options;

        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        const binWidth = range / bins;

        // Create bins
        const binCounts = Array(bins).fill(0);
        data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
            binCounts[binIndex]++;
        });

        const maxCount = Math.max(...binCounts);

        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw histogram
        const padding = 40;
        const chartWidth = this.canvas.width - 2 * padding;
        const chartHeight = this.canvas.height - 2 * padding;
        const barWidth = chartWidth / bins;

        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color.replace('0.6', '1');

        binCounts.forEach((count, i) => {
            const barHeight = (count / maxCount) * chartHeight;
            const x = padding + i * barWidth;
            const y = this.canvas.height - padding - barHeight;

            this.ctx.fillRect(x, y, barWidth - 2, barHeight);
            this.ctx.strokeRect(x, y, barWidth - 2, barHeight);
        });

        // Draw axes
        this.drawAxes(padding, chartWidth, chartHeight, min, max, binWidth);
    }

    /**
     * Draw box plot
     */
    drawBoxPlot(data, options = {}) {
        const { color = '#3b82f6', title = 'Box Plot' } = options;

        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        const stats = new DescriptiveStatistics(data);
        const summary = stats.summary();
        const quartiles = stats.quartiles();
        const iqr = summary.iqr;

        // Calculate whiskers and outliers
        const lowerWhisker = Math.max(summary.minimum, quartiles.q1 - 1.5 * iqr);
        const upperWhisker = Math.min(summary.maximum, quartiles.q3 + 1.5 * iqr);

        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw box plot
        const padding = 60;
        const plotY = this.canvas.height / 2;
        const plotHeight = 60;

        const scale = (this.canvas.width - 2 * padding) / (summary.maximum - summary.minimum);
        const getX = (value) => padding + (value - summary.minimum) * scale;

        // Box
        this.ctx.fillStyle = `${color}33`;
        this.ctx.fillRect(getX(quartiles.q1), plotY - plotHeight/2, getX(quartiles.q3) - getX(quartiles.q1), plotHeight);

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(getX(quartiles.q1), plotY - plotHeight/2, getX(quartiles.q3) - getX(quartiles.q1), plotHeight);

        // Median line
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(getX(summary.median), plotY - plotHeight/2);
        this.ctx.lineTo(getX(summary.median), plotY + plotHeight/2);
        this.ctx.stroke();

        // Whiskers
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        
        // Left whisker
        this.ctx.beginPath();
        this.ctx.moveTo(getX(lowerWhisker), plotY);
        this.ctx.lineTo(getX(quartiles.q1), plotY);
        this.ctx.stroke();

        // Right whisker
        this.ctx.beginPath();
        this.ctx.moveTo(getX(quartiles.q3), plotY);
        this.ctx.lineTo(getX(upperWhisker), plotY);
        this.ctx.stroke();

        // Whisker caps
        this.ctx.beginPath();
        this.ctx.moveTo(getX(lowerWhisker), plotY - 20);
        this.ctx.lineTo(getX(lowerWhisker), plotY + 20);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(getX(upperWhisker), plotY - 20);
        this.ctx.lineTo(getX(upperWhisker), plotY + 20);
        this.ctx.stroke();

        // Outliers
        this.ctx.fillStyle = '#ef4444';
        data.forEach(value => {
            if (value < lowerWhisker || value > upperWhisker) {
                this.ctx.beginPath();
                this.ctx.arc(getX(value), plotY, 4, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        });

        // Labels
        this.drawBoxPlotLabels(summary, quartiles, getX, plotY, plotHeight);
    }

    /**
     * Helper methods for drawing
     */
    drawAxes(padding, chartWidth, chartHeight, min, max, binWidth) {
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, this.canvas.height - padding);
        this.ctx.lineTo(this.canvas.width - padding, this.canvas.height - padding);
        this.ctx.stroke();

        // X-axis labels
        this.ctx.fillStyle = '#ccc';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';

        const labelCount = 5;
        for (let i = 0; i <= labelCount; i++) {
            const value = min + (i * (max - min)) / labelCount;
            const x = padding + (i * chartWidth) / labelCount;
            this.ctx.fillText(formatNumber(value), x, this.canvas.height - padding + 20);
        }
    }

    drawBoxPlotLabels(summary, quartiles, getX, plotY, plotHeight) {
        this.ctx.fillStyle = '#ccc';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';

        const labels = [
            { value: summary.minimum, text: `Min: ${formatNumber(summary.minimum)}` },
            { value: quartiles.q1, text: `Q1: ${formatNumber(quartiles.q1)}` },
            { value: summary.median, text: `Med: ${formatNumber(summary.median)}` },
            { value: quartiles.q3, text: `Q3: ${formatNumber(quartiles.q3)}` },
            { value: summary.maximum, text: `Max: ${formatNumber(summary.maximum)}` }
        ];

        labels.forEach(({ value, text }) => {
            this.ctx.fillText(text, getX(value), plotY + plotHeight/2 + 30);
        });
    }
}

/**
 * Factory functions
 */
export function createDescriptiveStatistics(data) {
    return new DescriptiveStatistics(data);
}

export function createRegressionAnalysis() {
    return new RegressionAnalysis();
}

export function createTwoVariableStatistics(xData, yData) {
    return new TwoVariableStatistics(xData, yData);
}

export function createStatisticsVisualizer(canvas) {
    return new StatisticsVisualizer(canvas);
}