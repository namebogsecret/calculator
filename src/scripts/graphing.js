/**
 * Graph plotting and visualization functionality
 */

import { prepareFunctionExpression, isValidNumber, clamp } from './utils.js';
import { GRAPH_CONFIG, COLOR_SCHEMES } from './constants.js';

/**
 * Graph rendering engine
 */
export class GraphRenderer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.scale = GRAPH_CONFIG.DEFAULT_SCALE;
        this.offsetX = 0;
        this.offsetY = 0;
        this.functions = [];
        this.dataPoints = [];
        this.isDragging = false;
        this.isTracing = false;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.setupEventListeners();
    }

    /**
     * Canvas initialization and setup
     */
    initializeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.drawGrid();
    }

    /**
     * Event listeners for interaction
     */
    setupEventListeners() {
        // Zoom with mouse wheel
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.scale *= delta;
            this.scale = clamp(this.scale, GRAPH_CONFIG.MIN_SCALE, GRAPH_CONFIG.MAX_SCALE);
            this.redraw();
        });

        // Drag to pan
        let dragStartX, dragStartY;
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            dragStartX = e.clientX - this.offsetX;
            dragStartY = e.clientY - this.offsetY;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;

            if (this.isDragging && !this.isTracing) {
                this.offsetX = e.clientX - dragStartX;
                this.offsetY = e.clientY - dragStartY;
                this.redraw();
            } else if (this.isTracing) {
                this.updateTrace();
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        // Touch events for mobile
        this.setupTouchEvents();
    }

    /**
     * Touch event handling for mobile devices
     */
    setupTouchEvents() {
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                const touch = e.touches[0];
                const dragStartX = touch.clientX - this.offsetX;
                const dragStartY = touch.clientY - this.offsetY;
                this.touchStartData = { dragStartX, dragStartY };
            }
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (this.isDragging && e.touches.length === 1) {
                e.preventDefault();
                const touch = e.touches[0];
                this.offsetX = touch.clientX - this.touchStartData.dragStartX;
                this.offsetY = touch.clientY - this.touchStartData.dragStartY;
                this.redraw();
            }
        });

        this.canvas.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }

    /**
     * Grid and axes drawing
     */
    drawGrid() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2 + this.offsetX;
        const centerY = height / 2 + this.offsetY;
        
        // Background gradient
        const gradient = this.ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#000');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
        
        // Grid lines
        this.ctx.strokeStyle = `rgba(59, 130, 246, ${GRAPH_CONFIG.GRID_OPACITY})`;
        this.ctx.lineWidth = 0.5;
        
        // Vertical grid lines
        for (let x = centerX % this.scale; x < width; x += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let y = centerY % this.scale; y < height; y += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        
        // Main axes
        this.ctx.strokeStyle = `rgba(59, 130, 246, ${GRAPH_CONFIG.AXIS_OPACITY})`;
        this.ctx.lineWidth = 2;
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(width, centerY);
        this.ctx.stroke();
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, height);
        this.ctx.stroke();
        
        // Axis labels
        this.drawAxisLabels(centerX, centerY);
    }

    /**
     * Draw axis labels and tick marks
     */
    drawAxisLabels(centerX, centerY) {
        this.ctx.fillStyle = '#64748b';
        this.ctx.font = '12px SF Mono, monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // X-axis labels
        const xStart = -Math.floor(centerX / this.scale);
        const xEnd = Math.floor((this.canvas.width - centerX) / this.scale);
        
        for (let i = xStart; i <= xEnd; i++) {
            if (i !== 0) {
                const x = centerX + i * this.scale;
                this.ctx.fillText(i.toString(), x, centerY + 15);
            }
        }
        
        // Y-axis labels
        const yStart = -Math.floor((this.canvas.height - centerY) / this.scale);
        const yEnd = Math.floor(centerY / this.scale);
        
        for (let i = yStart; i <= yEnd; i++) {
            if (i !== 0) {
                const y = centerY - i * this.scale;
                this.ctx.fillText(i.toString(), centerX - 15, y);
            }
        }
    }

    /**
     * Function plotting
     */
    addFunction(expression, color = null) {
        try {
            const processedExpression = prepareFunctionExpression(expression);
            const func = new Function('x', `return ${processedExpression}`);
            
            // Test the function
            func(0);
            
            const graphFunction = {
                func: func,
                expression: expression,
                color: color || this.getNextColor(),
                visible: true
            };
            
            this.functions.push(graphFunction);
            this.redraw();
            
            return graphFunction;
        } catch (error) {
            throw new Error(`Invalid function: ${error.message}`);
        }
    }

    /**
     * Plot all functions
     */
    plotFunctions() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2 + this.offsetX;
        const centerY = height / 2 + this.offsetY;
        
        this.functions.forEach(({ func, color, visible }) => {
            if (!visible) return;
            
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = GRAPH_CONFIG.LINE_WIDTH;
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = GRAPH_CONFIG.SHADOW_BLUR;
            this.ctx.beginPath();
            
            let firstPoint = true;
            
            for (let px = 0; px < width; px++) {
                const x = (px - centerX) / this.scale;
                
                try {
                    const y = func(x);
                    const py = centerY - y * this.scale;
                    
                    if (isValidNumber(y) && Math.abs(y) < 1000000) {
                        if (firstPoint) {
                            this.ctx.moveTo(px, py);
                            firstPoint = false;
                        } else {
                            this.ctx.lineTo(px, py);
                        }
                    } else {
                        firstPoint = true;
                    }
                } catch (e) {
                    firstPoint = true;
                }
            }
            
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        });
    }

    /**
     * Data point plotting (for scatter plots and regression)
     */
    addDataPoints(xData, yData, options = {}) {
        const points = {
            x: xData,
            y: yData,
            color: options.color || '#fff',
            size: options.size || 4,
            style: options.style || 'circle',
            visible: true
        };
        
        this.dataPoints.push(points);
        this.redraw();
        
        return points;
    }

    /**
     * Plot data points
     */
    plotDataPoints() {
        const centerX = this.canvas.width / 2 + this.offsetX;
        const centerY = this.canvas.height / 2 + this.offsetY;
        
        this.dataPoints.forEach(({ x, y, color, size, style, visible }) => {
            if (!visible) return;
            
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = '#3b82f6';
            this.ctx.lineWidth = 2;
            
            for (let i = 0; i < Math.min(x.length, y.length); i++) {
                const px = centerX + x[i] * this.scale;
                const py = centerY - y[i] * this.scale;
                
                this.ctx.beginPath();
                
                switch (style) {
                    case 'circle':
                        this.ctx.arc(px, py, size, 0, 2 * Math.PI);
                        break;
                    case 'square':
                        this.ctx.rect(px - size, py - size, size * 2, size * 2);
                        break;
                    case 'triangle':
                        this.ctx.moveTo(px, py - size);
                        this.ctx.lineTo(px - size, py + size);
                        this.ctx.lineTo(px + size, py + size);
                        this.ctx.closePath();
                        break;
                }
                
                this.ctx.fill();
                this.ctx.stroke();
            }
        });
    }

    /**
     * Tracing functionality
     */
    enableTracing() {
        this.isTracing = true;
    }

    disableTracing() {
        this.isTracing = false;
    }

    updateTrace() {
        const centerX = this.canvas.width / 2 + this.offsetX;
        const centerY = this.canvas.height / 2 + this.offsetY;
        
        const x = (this.mouseX - centerX) / this.scale;
        const y = -(this.mouseY - centerY) / this.scale;
        
        // Redraw graph
        this.redraw();
        
        // Draw crosshair
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouseX, 0);
        this.ctx.lineTo(this.mouseX, this.canvas.height);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.mouseY);
        this.ctx.lineTo(this.canvas.width, this.mouseY);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
        
        // Calculate function values at cursor position
        const traceData = {
            x: x,
            y: y,
            functions: []
        };
        
        this.functions.forEach((func, index) => {
            if (func.visible) {
                try {
                    const value = func.func(x);
                    traceData.functions.push({
                        index: index,
                        expression: func.expression,
                        value: value
                    });
                } catch (e) {
                    traceData.functions.push({
                        index: index,
                        expression: func.expression,
                        value: undefined
                    });
                }
            }
        });
        
        // Dispatch trace event for UI updates
        this.canvas.dispatchEvent(new CustomEvent('trace', { detail: traceData }));
    }

    /**
     * Zoom and pan controls
     */
    zoomIn() {
        this.scale *= GRAPH_CONFIG.ZOOM_FACTOR;
        this.scale = Math.min(this.scale, GRAPH_CONFIG.MAX_SCALE);
        this.redraw();
    }

    zoomOut() {
        this.scale /= GRAPH_CONFIG.ZOOM_FACTOR;
        this.scale = Math.max(this.scale, GRAPH_CONFIG.MIN_SCALE);
        this.redraw();
    }

    resetView() {
        this.scale = GRAPH_CONFIG.DEFAULT_SCALE;
        this.offsetX = 0;
        this.offsetY = 0;
        this.redraw();
    }

    /**
     * Function management
     */
    removeFunction(index) {
        if (index >= 0 && index < this.functions.length) {
            this.functions.splice(index, 1);
            this.redraw();
        }
    }

    clearFunctions() {
        this.functions = [];
        this.redraw();
    }

    toggleFunction(index) {
        if (index >= 0 && index < this.functions.length) {
            this.functions[index].visible = !this.functions[index].visible;
            this.redraw();
        }
    }

    /**
     * Data point management
     */
    clearDataPoints() {
        this.dataPoints = [];
        this.redraw();
    }

    /**
     * Complete redraw
     */
    redraw() {
        this.drawGrid();
        this.plotFunctions();
        this.plotDataPoints();
    }

    /**
     * Utility methods
     */
    getNextColor() {
        const colors = COLOR_SCHEMES.GRAPH_COLORS;
        return colors[this.functions.length % colors.length];
    }

    screenToGraph(screenX, screenY) {
        const centerX = this.canvas.width / 2 + this.offsetX;
        const centerY = this.canvas.height / 2 + this.offsetY;
        
        return {
            x: (screenX - centerX) / this.scale,
            y: -(screenY - centerY) / this.scale
        };
    }

    graphToScreen(graphX, graphY) {
        const centerX = this.canvas.width / 2 + this.offsetX;
        const centerY = this.canvas.height / 2 + this.offsetY;
        
        return {
            x: centerX + graphX * this.scale,
            y: centerY - graphY * this.scale
        };
    }

    /**
     * Export functionality
     */
    exportAsImage(format = 'png') {
        return this.canvas.toDataURL(`image/${format}`);
    }

    getGraphState() {
        return {
            scale: this.scale,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            functions: this.functions.map(f => ({
                expression: f.expression,
                color: f.color,
                visible: f.visible
            })),
            dataPoints: this.dataPoints
        };
    }

    setGraphState(state) {
        this.scale = state.scale || GRAPH_CONFIG.DEFAULT_SCALE;
        this.offsetX = state.offsetX || 0;
        this.offsetY = state.offsetY || 0;
        
        if (state.functions) {
            this.functions = [];
            state.functions.forEach(f => {
                this.addFunction(f.expression, f.color);
                this.functions[this.functions.length - 1].visible = f.visible;
            });
        }
        
        if (state.dataPoints) {
            this.dataPoints = state.dataPoints;
        }
        
        this.redraw();
    }
}

/**
 * Table generation for function values
 */
export class FunctionTable {
    constructor() {
        this.functions = [];
    }

    addFunction(expression) {
        try {
            const processedExpression = prepareFunctionExpression(expression);
            const func = new Function('x', `return ${processedExpression}`);
            
            this.functions.push({
                expression: expression,
                func: func
            });
            
            return this.functions.length - 1;
        } catch (error) {
            throw new Error(`Invalid function: ${error.message}`);
        }
    }

    generateTable(start, end, step) {
        if (this.functions.length === 0) {
            throw new Error('No functions added');
        }

        if (step <= 0) {
            throw new Error('Step must be positive');
        }

        const table = [];
        
        for (let x = start; x <= end; x += step) {
            const row = { x: x };
            
            this.functions.forEach((func, index) => {
                try {
                    const y = func.func(x);
                    row[`f${index + 1}`] = isValidNumber(y) ? y : undefined;
                } catch (e) {
                    row[`f${index + 1}`] = undefined;
                }
            });
            
            table.push(row);
        }
        
        return table;
    }

    clearFunctions() {
        this.functions = [];
    }
}

/**
 * Factory functions
 */
export function createGraphRenderer(canvas) {
    return new GraphRenderer(canvas);
}

export function createFunctionTable() {
    return new FunctionTable();
}