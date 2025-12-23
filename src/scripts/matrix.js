/**
 * Matrix operations module for the calculator
 */

/**
 * Matrix class for matrix operations
 */
export class Matrix {
    constructor(rows, cols, data = null) {
        this.rows = rows;
        this.cols = cols;
        if (data) {
            this.data = data;
        } else {
            this.data = Array(rows).fill(null).map(() => Array(cols).fill(0));
        }
    }

    static fromArray(arr) {
        const rows = arr.length;
        const cols = arr[0].length;
        return new Matrix(rows, cols, arr.map(row => [...row]));
    }

    clone() {
        return new Matrix(this.rows, this.cols, this.data.map(row => [...row]));
    }

    get(i, j) {
        return this.data[i][j];
    }

    set(i, j, value) {
        this.data[i][j] = value;
    }

    toArray() {
        return this.data.map(row => [...row]);
    }

    /**
     * Matrix addition
     */
    add(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error('Матрицы должны иметь одинаковый размер для сложения');
        }
        const result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.set(i, j, this.get(i, j) + other.get(i, j));
            }
        }
        return result;
    }

    /**
     * Matrix subtraction
     */
    subtract(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error('Матрицы должны иметь одинаковый размер для вычитания');
        }
        const result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.set(i, j, this.get(i, j) - other.get(i, j));
            }
        }
        return result;
    }

    /**
     * Matrix multiplication
     */
    multiply(other) {
        if (this.cols !== other.rows) {
            throw new Error(`Невозможно умножить: ${this.rows}×${this.cols} на ${other.rows}×${other.cols}`);
        }
        const result = new Matrix(this.rows, other.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < other.cols; j++) {
                let sum = 0;
                for (let k = 0; k < this.cols; k++) {
                    sum += this.get(i, k) * other.get(k, j);
                }
                result.set(i, j, sum);
            }
        }
        return result;
    }

    /**
     * Scalar multiplication
     */
    scalarMultiply(scalar) {
        const result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.set(i, j, this.get(i, j) * scalar);
            }
        }
        return result;
    }

    /**
     * Matrix transpose
     */
    transpose() {
        const result = new Matrix(this.cols, this.rows);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.set(j, i, this.get(i, j));
            }
        }
        return result;
    }

    /**
     * Calculate determinant using LU decomposition
     */
    determinant() {
        if (this.rows !== this.cols) {
            throw new Error('Определитель существует только для квадратных матриц');
        }

        const n = this.rows;
        const matrix = this.clone();
        let det = 1;
        let swaps = 0;

        for (let col = 0; col < n; col++) {
            // Find pivot
            let maxRow = col;
            for (let row = col + 1; row < n; row++) {
                if (Math.abs(matrix.get(row, col)) > Math.abs(matrix.get(maxRow, col))) {
                    maxRow = row;
                }
            }

            // Swap rows if needed
            if (maxRow !== col) {
                [matrix.data[col], matrix.data[maxRow]] = [matrix.data[maxRow], matrix.data[col]];
                swaps++;
            }

            // Check for zero pivot
            if (Math.abs(matrix.get(col, col)) < 1e-10) {
                return 0;
            }

            det *= matrix.get(col, col);

            // Eliminate below
            for (let row = col + 1; row < n; row++) {
                const factor = matrix.get(row, col) / matrix.get(col, col);
                for (let j = col; j < n; j++) {
                    matrix.set(row, j, matrix.get(row, j) - factor * matrix.get(col, j));
                }
            }
        }

        return swaps % 2 === 0 ? det : -det;
    }

    /**
     * Calculate inverse matrix using Gauss-Jordan elimination
     */
    inverse() {
        if (this.rows !== this.cols) {
            throw new Error('Обратная матрица существует только для квадратных матриц');
        }

        const n = this.rows;
        const det = this.determinant();

        if (Math.abs(det) < 1e-10) {
            throw new Error('Матрица вырожденная (det = 0), обратной не существует');
        }

        // Create augmented matrix [A|I]
        const augmented = new Matrix(n, 2 * n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                augmented.set(i, j, this.get(i, j));
                augmented.set(i, j + n, i === j ? 1 : 0);
            }
        }

        // Gauss-Jordan elimination
        for (let col = 0; col < n; col++) {
            // Find pivot
            let maxRow = col;
            for (let row = col + 1; row < n; row++) {
                if (Math.abs(augmented.get(row, col)) > Math.abs(augmented.get(maxRow, col))) {
                    maxRow = row;
                }
            }

            // Swap rows
            [augmented.data[col], augmented.data[maxRow]] = [augmented.data[maxRow], augmented.data[col]];

            // Scale pivot row
            const pivot = augmented.get(col, col);
            for (let j = 0; j < 2 * n; j++) {
                augmented.set(col, j, augmented.get(col, j) / pivot);
            }

            // Eliminate column
            for (let row = 0; row < n; row++) {
                if (row !== col) {
                    const factor = augmented.get(row, col);
                    for (let j = 0; j < 2 * n; j++) {
                        augmented.set(row, j, augmented.get(row, j) - factor * augmented.get(col, j));
                    }
                }
            }
        }

        // Extract inverse from augmented matrix
        const inverse = new Matrix(n, n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                inverse.set(i, j, augmented.get(i, j + n));
            }
        }

        return inverse;
    }

    /**
     * Calculate trace (sum of diagonal elements)
     */
    trace() {
        if (this.rows !== this.cols) {
            throw new Error('След существует только для квадратных матриц');
        }
        let sum = 0;
        for (let i = 0; i < this.rows; i++) {
            sum += this.get(i, i);
        }
        return sum;
    }

    /**
     * Calculate rank using Gaussian elimination
     */
    rank() {
        const matrix = this.clone();
        const m = this.rows;
        const n = this.cols;
        let rank = 0;

        for (let col = 0; col < n && rank < m; col++) {
            // Find pivot
            let pivotRow = -1;
            for (let row = rank; row < m; row++) {
                if (Math.abs(matrix.get(row, col)) > 1e-10) {
                    pivotRow = row;
                    break;
                }
            }

            if (pivotRow === -1) continue;

            // Swap rows
            [matrix.data[rank], matrix.data[pivotRow]] = [matrix.data[pivotRow], matrix.data[rank]];

            // Eliminate below
            for (let row = rank + 1; row < m; row++) {
                if (Math.abs(matrix.get(row, col)) > 1e-10) {
                    const factor = matrix.get(row, col) / matrix.get(rank, col);
                    for (let j = col; j < n; j++) {
                        matrix.set(row, j, matrix.get(row, j) - factor * matrix.get(rank, j));
                    }
                }
            }

            rank++;
        }

        return rank;
    }

    /**
     * Check if matrix is singular
     */
    isSingular() {
        if (this.rows !== this.cols) return true;
        return Math.abs(this.determinant()) < 1e-10;
    }

    /**
     * Check if matrix is symmetric
     */
    isSymmetric() {
        if (this.rows !== this.cols) return false;
        for (let i = 0; i < this.rows; i++) {
            for (let j = i + 1; j < this.cols; j++) {
                if (Math.abs(this.get(i, j) - this.get(j, i)) > 1e-10) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Create identity matrix
     */
    static identity(n) {
        const matrix = new Matrix(n, n);
        for (let i = 0; i < n; i++) {
            matrix.set(i, i, 1);
        }
        return matrix;
    }

    /**
     * Create zero matrix
     */
    static zeros(rows, cols) {
        return new Matrix(rows, cols);
    }

    /**
     * Create random matrix
     */
    static random(rows, cols, min = -10, max = 10) {
        const matrix = new Matrix(rows, cols);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                matrix.set(i, j, Math.floor(Math.random() * (max - min + 1)) + min);
            }
        }
        return matrix;
    }

    /**
     * Create symmetric random matrix
     */
    static randomSymmetric(n, min = -10, max = 10) {
        const matrix = new Matrix(n, n);
        for (let i = 0; i < n; i++) {
            for (let j = i; j < n; j++) {
                const value = Math.floor(Math.random() * (max - min + 1)) + min;
                matrix.set(i, j, value);
                matrix.set(j, i, value);
            }
        }
        return matrix;
    }
}

/**
 * Solve system of linear equations using Gaussian elimination with partial pivoting
 */
export function solveLinearSystem(augmentedMatrix) {
    const m = augmentedMatrix.rows;
    const n = augmentedMatrix.cols - 1; // Number of variables
    const matrix = augmentedMatrix.clone();
    const steps = [];

    // Store initial state
    steps.push({
        description: 'Исходная расширенная матрица [A|b]',
        matrix: matrix.toArray()
    });

    // Forward elimination with partial pivoting
    let pivotRow = 0;
    for (let col = 0; col < n && pivotRow < m; col++) {
        // Find pivot
        let maxRow = pivotRow;
        for (let row = pivotRow + 1; row < m; row++) {
            if (Math.abs(matrix.get(row, col)) > Math.abs(matrix.get(maxRow, col))) {
                maxRow = row;
            }
        }

        if (Math.abs(matrix.get(maxRow, col)) < 1e-10) {
            continue; // Skip this column
        }

        // Swap rows if needed
        if (maxRow !== pivotRow) {
            [matrix.data[pivotRow], matrix.data[maxRow]] = [matrix.data[maxRow], matrix.data[pivotRow]];
            steps.push({
                description: `Поменять строки ${pivotRow + 1} и ${maxRow + 1}`,
                matrix: matrix.toArray()
            });
        }

        // Normalize pivot row
        const pivot = matrix.get(pivotRow, col);
        if (pivot !== 1) {
            for (let j = 0; j < matrix.cols; j++) {
                matrix.set(pivotRow, j, matrix.get(pivotRow, j) / pivot);
            }
            steps.push({
                description: `Разделить строку ${pivotRow + 1} на ${pivot.toFixed(4)}`,
                matrix: matrix.toArray()
            });
        }

        // Eliminate below
        for (let row = pivotRow + 1; row < m; row++) {
            const factor = matrix.get(row, col);
            if (Math.abs(factor) > 1e-10) {
                for (let j = 0; j < matrix.cols; j++) {
                    matrix.set(row, j, matrix.get(row, j) - factor * matrix.get(pivotRow, j));
                }
                steps.push({
                    description: `Вычесть ${factor.toFixed(4)} × строка ${pivotRow + 1} из строки ${row + 1}`,
                    matrix: matrix.toArray()
                });
            }
        }

        pivotRow++;
    }

    // Back substitution (to get reduced row echelon form)
    for (let row = m - 1; row >= 0; row--) {
        // Find leading 1
        let leadCol = -1;
        for (let col = 0; col < n; col++) {
            if (Math.abs(matrix.get(row, col)) > 1e-10) {
                leadCol = col;
                break;
            }
        }

        if (leadCol === -1) continue;

        // Eliminate above
        for (let upperRow = 0; upperRow < row; upperRow++) {
            const factor = matrix.get(upperRow, leadCol);
            if (Math.abs(factor) > 1e-10) {
                for (let j = 0; j < matrix.cols; j++) {
                    matrix.set(upperRow, j, matrix.get(upperRow, j) - factor * matrix.get(row, j));
                }
            }
        }
    }

    steps.push({
        description: 'Приведённая ступенчатая форма (RREF)',
        matrix: matrix.toArray()
    });

    // Analyze solution
    const result = analyzeSystemSolution(matrix, n);
    result.steps = steps;
    return result;
}

/**
 * Analyze the solution of the system from RREF matrix
 */
function analyzeSystemSolution(rrefMatrix, numVars) {
    const m = rrefMatrix.rows;
    const n = numVars;

    // Find pivot columns
    const pivotCols = [];
    for (let row = 0; row < m; row++) {
        for (let col = 0; col < n; col++) {
            if (Math.abs(rrefMatrix.get(row, col) - 1) < 1e-10) {
                let isPivot = true;
                for (let r = 0; r < m; r++) {
                    if (r !== row && Math.abs(rrefMatrix.get(r, col)) > 1e-10) {
                        isPivot = false;
                        break;
                    }
                }
                if (isPivot) {
                    pivotCols.push({ row, col });
                    break;
                }
            }
        }
    }

    // Check for inconsistent system (0 = non-zero)
    for (let row = 0; row < m; row++) {
        let allZeros = true;
        for (let col = 0; col < n; col++) {
            if (Math.abs(rrefMatrix.get(row, col)) > 1e-10) {
                allZeros = false;
                break;
            }
        }
        if (allZeros && Math.abs(rrefMatrix.get(row, n)) > 1e-10) {
            return {
                type: 'inconsistent',
                message: 'Система несовместна (нет решений)',
                rank: pivotCols.length
            };
        }
    }

    const rank = pivotCols.length;

    // Unique solution
    if (rank === n) {
        const solution = [];
        for (let col = 0; col < n; col++) {
            const pivotInfo = pivotCols.find(p => p.col === col);
            if (pivotInfo) {
                solution.push(rrefMatrix.get(pivotInfo.row, n));
            } else {
                solution.push(0);
            }
        }
        return {
            type: 'unique',
            message: 'Единственное решение',
            solution: solution,
            rank: rank
        };
    }

    // Infinite solutions
    const freeVars = [];
    for (let col = 0; col < n; col++) {
        if (!pivotCols.some(p => p.col === col)) {
            freeVars.push(`x${col + 1}`);
        }
    }

    return {
        type: 'infinite',
        message: `Бесконечно много решений (свободные переменные: ${freeVars.join(', ')})`,
        freeVariables: freeVars,
        rank: rank
    };
}

/**
 * Calculate eigenvalues for 2x2 and 3x3 matrices
 */
export function calculateEigenvalues(matrix) {
    if (matrix.rows !== matrix.cols) {
        throw new Error('Собственные числа существуют только для квадратных матриц');
    }

    const n = matrix.rows;
    const trace = matrix.trace();
    const det = matrix.determinant();

    if (n === 2) {
        // For 2x2: λ² - trace*λ + det = 0
        const discriminant = trace * trace - 4 * det;
        const coefficients = [1, -trace, det];

        if (discriminant >= 0) {
            const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
            const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
            return {
                eigenvalues: [lambda1, lambda2],
                polynomial: `λ² - ${trace.toFixed(4)}λ + ${det.toFixed(4)}`,
                trace,
                determinant: det,
                isReal: true
            };
        } else {
            const realPart = trace / 2;
            const imagPart = Math.sqrt(-discriminant) / 2;
            return {
                eigenvalues: [`${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`, `${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`],
                polynomial: `λ² - ${trace.toFixed(4)}λ + ${det.toFixed(4)}`,
                trace,
                determinant: det,
                isReal: false
            };
        }
    }

    if (n === 3) {
        // For 3x3: λ³ - trace*λ² + c*λ - det = 0
        const a = matrix.data;
        const c = (a[0][0] * a[1][1] + a[1][1] * a[2][2] + a[0][0] * a[2][2]) -
                  (a[0][1] * a[1][0] + a[1][2] * a[2][1] + a[0][2] * a[2][0]);

        // Use numerical method (power iteration approximation)
        const eigenvalues = solveCharacteristicPolynomial3(trace, c, det);

        return {
            eigenvalues: eigenvalues,
            polynomial: `λ³ - ${trace.toFixed(4)}λ² + ${c.toFixed(4)}λ - ${det.toFixed(4)}`,
            trace,
            determinant: det,
            isReal: true
        };
    }

    // For larger matrices, use power iteration (simplified)
    return {
        eigenvalues: ['Используйте специализированное ПО для матриц > 3×3'],
        polynomial: 'N/A',
        trace,
        determinant: det,
        isReal: null
    };
}

/**
 * Solve cubic characteristic polynomial using Cardano's formula
 */
function solveCharacteristicPolynomial3(b, c, d) {
    // λ³ - bλ² + cλ - d = 0
    // Substitute λ = t + b/3
    const p = c - b * b / 3;
    const q = 2 * b * b * b / 27 - b * c / 3 + d;

    const discriminant = q * q / 4 + p * p * p / 27;

    const roots = [];

    if (discriminant > 1e-10) {
        // One real root
        const sqrtD = Math.sqrt(discriminant);
        const u = Math.cbrt(-q / 2 + sqrtD);
        const v = Math.cbrt(-q / 2 - sqrtD);
        roots.push(u + v + b / 3);
        // Complex roots would be added here
    } else if (discriminant < -1e-10) {
        // Three real roots (casus irreducibilis)
        const r = Math.sqrt(-p * p * p / 27);
        const theta = Math.acos(-q / (2 * r));
        const cubeRootR = Math.cbrt(r);

        roots.push(2 * cubeRootR * Math.cos(theta / 3) + b / 3);
        roots.push(2 * cubeRootR * Math.cos((theta + 2 * Math.PI) / 3) + b / 3);
        roots.push(2 * cubeRootR * Math.cos((theta + 4 * Math.PI) / 3) + b / 3);
    } else {
        // Repeated roots
        if (Math.abs(q) < 1e-10) {
            roots.push(b / 3);
        } else {
            roots.push(3 * q / p + b / 3);
            roots.push(-3 * q / (2 * p) + b / 3);
        }
    }

    return roots.map(r => Math.abs(r) < 1e-10 ? 0 : r).sort((a, b) => b - a);
}

/**
 * LU Decomposition
 */
export function luDecomposition(matrix) {
    if (matrix.rows !== matrix.cols) {
        throw new Error('LU разложение требует квадратную матрицу');
    }

    const n = matrix.rows;
    const L = Matrix.identity(n);
    const U = matrix.clone();

    for (let j = 0; j < n; j++) {
        for (let i = j + 1; i < n; i++) {
            const factor = U.get(i, j) / U.get(j, j);
            L.set(i, j, factor);
            for (let k = j; k < n; k++) {
                U.set(i, k, U.get(i, k) - factor * U.get(j, k));
            }
        }
    }

    return { L, U };
}

/**
 * Export matrix operations factory
 */
export function createMatrixOperations() {
    return {
        Matrix,
        solveLinearSystem,
        calculateEigenvalues,
        luDecomposition
    };
}
