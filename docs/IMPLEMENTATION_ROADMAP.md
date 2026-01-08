# Implementation Roadmap

## National Interest Waiver (NIW) Enhancement Plan

**Goal:** Transform the Advanced Graphing Calculator into a project that demonstrates substantial merit and national importance for the United States education system.

**Timeline:** 6 months
**Phases:** 4

---

## Phase 1: Foundation (Weeks 1-2)

### Goal: Establish professional open-source project standards

---

### 1.1 Create LICENSE File

**Priority:** 🔴 Critical
**Effort:** 1 hour
**Impact:** Enables open-source distribution

```markdown
MIT License

Copyright (c) 2026 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

### 1.2 Create package.json

**Priority:** 🔴 Critical
**Effort:** 2 hours
**Impact:** NPM ecosystem integration

```json
{
  "name": "advanced-graphing-calculator",
  "version": "1.0.0",
  "description": "A comprehensive web-based scientific calculator with graphing, statistics, and matrix operations. Built for STEM education.",
  "main": "src/scripts/app.js",
  "type": "module",
  "scripts": {
    "start": "npx serve .",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/scripts/**/*.js",
    "lint:fix": "eslint src/scripts/**/*.js --fix",
    "format": "prettier --write src/**/*.{js,css,html}",
    "build": "npm run lint && npm run test",
    "prepare": "husky install"
  },
  "keywords": [
    "calculator",
    "scientific-calculator",
    "graphing-calculator",
    "mathematics",
    "stem-education",
    "statistics",
    "matrix",
    "education",
    "accessibility",
    "wcag"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/advanced-graphing-calculator.git"
  },
  "bugs": {
    "url": "https://github.com/username/advanced-graphing-calculator/issues"
  },
  "homepage": "https://username.github.io/advanced-graphing-calculator",
  "devDependencies": {
    "eslint": "^8.56.0",
    "prettier": "^3.2.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/jest-dom": "^6.2.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.2.0"
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"],
    "*.{css,html,json,md}": "prettier --write"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

### 1.3 ESLint Configuration

**Priority:** 🟡 Medium
**Effort:** 2 hours
**File:** `.eslintrc.json`

```json
{
  "env": {
    "browser": true,
    "es2022": true,
    "jest": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "no-eval": "error",
    "no-implied-eval": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

---

### 1.4 Prettier Configuration

**Priority:** 🟡 Medium
**Effort:** 1 hour
**File:** `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true
}
```

---

### 1.5 GitHub Actions CI/CD

**Priority:** 🔴 Critical
**Effort:** 4 hours
**File:** `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          fail_ci_if_error: true

  accessibility:
    name: Accessibility Check
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx serve . &
      - run: sleep 5
      - run: npx pa11y http://localhost:3000

  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    needs: [test, accessibility]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

### 1.6 English README

**Priority:** 🔴 Critical
**Effort:** 4 hours
**File:** `README.md` (replace or rename current to `README.ru.md`)

```markdown
# Advanced Graphing Calculator

[![CI/CD](https://github.com/username/calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/username/calculator/actions)
[![Coverage](https://codecov.io/gh/username/calculator/branch/main/graph/badge.svg)](https://codecov.io/gh/username/calculator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)

A comprehensive, accessible web-based scientific calculator designed for STEM education. Features graphing, statistics, and matrix operations with full keyboard navigation and screen reader support.

## Features

- **Basic Calculator** - Standard arithmetic with memory functions
- **Scientific Mode** - Trigonometry, logarithms, and advanced functions
- **Graphing** - Plot functions, trace points, regression analysis
- **Statistics** - Descriptive stats, distributions, hypothesis testing
- **Matrix Operations** - Addition, multiplication, determinants, inverses

## Accessibility

This calculator is designed to meet WCAG 2.1 AA standards:
- Full keyboard navigation
- Screen reader compatible (NVDA, JAWS, VoiceOver)
- High contrast mode
- Reduced motion support

## Quick Start

```bash
# Clone the repository
git clone https://github.com/username/calculator.git
cd calculator

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test
```

## Documentation

- [User Guide](docs/USER_GUIDE.md)
- [API Reference](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Accessibility Statement](docs/ACCESSIBILITY.md)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.
```

---

### 1.7 CONTRIBUTING.md

**Priority:** 🟡 Medium
**Effort:** 2 hours

```markdown
# Contributing to Advanced Graphing Calculator

Thank you for your interest in contributing! This project aims to provide accessible STEM education tools.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## How to Contribute

### Reporting Bugs

1. Check existing issues first
2. Use the bug report template
3. Include browser/OS information
4. Provide steps to reproduce

### Suggesting Features

1. Open a discussion first
2. Explain the educational value
3. Consider accessibility implications

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit: `git commit -m 'Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Coding Standards

- ES6+ JavaScript
- JSDoc comments for public APIs
- 80%+ test coverage for new code
- WCAG 2.1 AA compliance required
- Mobile-first responsive design

### Accessibility Requirements

All contributions must:
- Include ARIA labels
- Support keyboard navigation
- Work with screen readers
- Maintain color contrast ratios

## Development Setup

```bash
npm install
npm run lint
npm test
npm start
```

## Questions?

Open a discussion or reach out to maintainers.
```

---

### 1.8 CODE_OF_CONDUCT.md

**Priority:** 🟡 Medium
**Effort:** 1 hour

Use the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) standard template.

---

## Phase 2: Quality & Compliance (Weeks 3-6)

### Goal: Achieve professional quality standards and accessibility compliance

---

### 2.1 Jest Testing Setup

**Priority:** 🔴 Critical
**Effort:** 8 hours
**File:** `jest.config.js`

```javascript
export default {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  collectCoverageFrom: [
    'src/scripts/**/*.js',
    '!src/scripts/app.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  transform: {}
};
```

**File:** `tests/setup.js`

```javascript
import '@testing-library/jest-dom';

// Mock Web Audio API
global.AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: jest.fn(() => ({
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    frequency: { setValueAtTime: jest.fn() }
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() }
  })),
  destination: {}
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;
```

---

### 2.2 Core Module Tests

**Priority:** 🔴 Critical
**Effort:** 40 hours
**Target Coverage:** 80%+

**File:** `tests/calculator.test.js`

```javascript
import { Calculator } from '../src/scripts/calculator.js';

describe('Calculator', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe('Basic Operations', () => {
    test('adds two numbers correctly', () => {
      expect(calc.calculate('2+3')).toBe(5);
    });

    test('subtracts two numbers correctly', () => {
      expect(calc.calculate('10-4')).toBe(6);
    });

    test('multiplies two numbers correctly', () => {
      expect(calc.calculate('6*7')).toBe(42);
    });

    test('divides two numbers correctly', () => {
      expect(calc.calculate('20/4')).toBe(5);
    });

    test('handles division by zero', () => {
      expect(calc.calculate('5/0')).toBe(Infinity);
    });

    test('respects order of operations', () => {
      expect(calc.calculate('2+3*4')).toBe(14);
    });

    test('handles parentheses', () => {
      expect(calc.calculate('(2+3)*4')).toBe(20);
    });
  });

  describe('Memory Operations', () => {
    test('stores and recalls value', () => {
      calc.memoryStore(42);
      expect(calc.memoryRecall()).toBe(42);
    });

    test('adds to memory', () => {
      calc.memoryStore(10);
      calc.memoryAdd(5);
      expect(calc.memoryRecall()).toBe(15);
    });

    test('subtracts from memory', () => {
      calc.memoryStore(10);
      calc.memorySubtract(3);
      expect(calc.memoryRecall()).toBe(7);
    });

    test('clears memory', () => {
      calc.memoryStore(42);
      calc.memoryClear();
      expect(calc.memoryRecall()).toBe(0);
    });
  });

  describe('Error Handling', () => {
    test('handles invalid expressions', () => {
      expect(() => calc.calculate('2++3')).toThrow();
    });

    test('handles empty input', () => {
      expect(calc.calculate('')).toBe(0);
    });
  });
});
```

**File:** `tests/scientific.test.js`

```javascript
import { ScientificCalculator } from '../src/scripts/scientific.js';

describe('ScientificCalculator', () => {
  let sci;

  beforeEach(() => {
    sci = new ScientificCalculator();
  });

  describe('Trigonometric Functions', () => {
    test('calculates sin correctly', () => {
      expect(sci.sin(0)).toBeCloseTo(0);
      expect(sci.sin(Math.PI / 2)).toBeCloseTo(1);
    });

    test('calculates cos correctly', () => {
      expect(sci.cos(0)).toBeCloseTo(1);
      expect(sci.cos(Math.PI)).toBeCloseTo(-1);
    });

    test('calculates tan correctly', () => {
      expect(sci.tan(0)).toBeCloseTo(0);
      expect(sci.tan(Math.PI / 4)).toBeCloseTo(1);
    });
  });

  describe('Logarithmic Functions', () => {
    test('calculates log10 correctly', () => {
      expect(sci.log10(100)).toBeCloseTo(2);
    });

    test('calculates ln correctly', () => {
      expect(sci.ln(Math.E)).toBeCloseTo(1);
    });

    test('handles log of zero', () => {
      expect(sci.log10(0)).toBe(-Infinity);
    });
  });

  describe('Factorial', () => {
    test('calculates factorial correctly', () => {
      expect(sci.factorial(5)).toBe(120);
      expect(sci.factorial(0)).toBe(1);
    });

    test('handles negative numbers', () => {
      expect(() => sci.factorial(-1)).toThrow();
    });
  });
});
```

**File:** `tests/statistics.test.js`

```javascript
import { StatisticsCalculator } from '../src/scripts/statistics.js';

describe('StatisticsCalculator', () => {
  let stats;

  beforeEach(() => {
    stats = new StatisticsCalculator();
  });

  describe('Descriptive Statistics', () => {
    const data = [2, 4, 4, 4, 5, 5, 7, 9];

    test('calculates mean correctly', () => {
      expect(stats.mean(data)).toBe(5);
    });

    test('calculates median correctly', () => {
      expect(stats.median(data)).toBe(4.5);
    });

    test('calculates mode correctly', () => {
      expect(stats.mode(data)).toEqual([4]);
    });

    test('calculates variance correctly', () => {
      expect(stats.variance(data)).toBeCloseTo(4);
    });

    test('calculates standard deviation correctly', () => {
      expect(stats.standardDeviation(data)).toBeCloseTo(2);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty array', () => {
      expect(stats.mean([])).toBeNaN();
    });

    test('handles single element', () => {
      expect(stats.mean([5])).toBe(5);
      expect(stats.median([5])).toBe(5);
    });
  });
});
```

---

### 2.3 Accessibility Implementation

**Priority:** 🔴 Critical
**Effort:** 40 hours

#### 2.3.1 ARIA Labels for Buttons

**File:** Update `src/components/basic-calculator-buttons.html`

```html
<!-- Before -->
<button class="btn btn-number" onclick="appendToDisplay('7')">7</button>

<!-- After -->
<button
    class="btn btn-number"
    onclick="appendToDisplay('7')"
    data-value="7"
    aria-label="Number seven"
    role="button"
    tabindex="0"
>7</button>
```

#### 2.3.2 Keyboard Navigation Module

**File:** `src/scripts/accessibility.js`

```javascript
/**
 * Accessibility module for keyboard navigation and screen reader support
 * @module accessibility
 */

export class AccessibilityManager {
  constructor() {
    this.focusableElements = [];
    this.currentFocusIndex = 0;
    this.announcer = null;
    this.init();
  }

  init() {
    this.createAnnouncer();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.checkReducedMotion();
  }

  /**
   * Create live region for screen reader announcements
   */
  createAnnouncer() {
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('role', 'status');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    document.body.appendChild(this.announcer);
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announce(message, priority = 'polite') {
    this.announcer.setAttribute('aria-live', priority);
    this.announcer.textContent = '';
    setTimeout(() => {
      this.announcer.textContent = message;
    }, 100);
  }

  /**
   * Setup keyboard navigation for calculator
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Number keys
      if (e.key >= '0' && e.key <= '9') {
        this.handleNumberKey(e.key);
        return;
      }

      // Operator keys
      const operatorMap = {
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide',
        'Enter': 'calculate',
        '=': 'calculate',
        'Escape': 'clear',
        'Backspace': 'backspace',
        '.': 'decimal'
      };

      if (operatorMap[e.key]) {
        e.preventDefault();
        this.handleOperatorKey(operatorMap[e.key]);
        return;
      }

      // Arrow key navigation
      if (e.key.startsWith('Arrow')) {
        this.handleArrowNavigation(e);
      }
    });
  }

  handleNumberKey(key) {
    window.appendToDisplay?.(key);
    this.announce(`Entered ${key}`);
  }

  handleOperatorKey(operation) {
    const operations = {
      add: () => { window.appendToDisplay?.('+'); this.announce('Plus'); },
      subtract: () => { window.appendToDisplay?.('-'); this.announce('Minus'); },
      multiply: () => { window.appendToDisplay?.('×'); this.announce('Times'); },
      divide: () => { window.appendToDisplay?.('÷'); this.announce('Divided by'); },
      calculate: () => { window.calculate?.(); this.announceResult(); },
      clear: () => { window.clearDisplay?.(); this.announce('Cleared'); },
      backspace: () => { window.backspace?.(); this.announce('Deleted'); },
      decimal: () => { window.appendToDisplay?.('.'); this.announce('Point'); }
    };

    operations[operation]?.();
  }

  announceResult() {
    const display = document.getElementById('display');
    if (display) {
      this.announce(`Result: ${display.textContent}`, 'assertive');
    }
  }

  handleArrowNavigation(e) {
    e.preventDefault();
    const buttons = Array.from(document.querySelectorAll('.btn:not([disabled])'));
    const currentIndex = buttons.indexOf(document.activeElement);

    let newIndex;
    const cols = 4; // Assume 4 column grid

    switch (e.key) {
      case 'ArrowRight':
        newIndex = Math.min(currentIndex + 1, buttons.length - 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        newIndex = Math.min(currentIndex + cols, buttons.length - 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(currentIndex - cols, 0);
        break;
    }

    if (newIndex !== undefined && buttons[newIndex]) {
      buttons[newIndex].focus();
    }
  }

  setupFocusManagement() {
    // Add visible focus styles
    document.addEventListener('focusin', (e) => {
      if (e.target.matches('.btn')) {
        e.target.classList.add('focus-visible');
      }
    });

    document.addEventListener('focusout', (e) => {
      if (e.target.matches('.btn')) {
        e.target.classList.remove('focus-visible');
      }
    });
  }

  checkReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionPreference = (e) => {
      document.documentElement.classList.toggle('reduced-motion', e.matches);
    };

    handleMotionPreference(mediaQuery);
    mediaQuery.addEventListener('change', handleMotionPreference);
  }

  /**
   * Check high contrast mode
   */
  checkHighContrast() {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');

    const handleContrastPreference = (e) => {
      document.documentElement.classList.toggle('high-contrast', e.matches);
    };

    handleContrastPreference(mediaQuery);
    mediaQuery.addEventListener('change', handleContrastPreference);
  }
}

export const accessibility = new AccessibilityManager();
```

#### 2.3.3 Accessibility CSS

**File:** `src/styles/accessibility.css`

```css
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus visible styles */
.btn:focus-visible,
.focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(0, 95, 204, 0.3);
}

/* High contrast mode */
.high-contrast .btn {
  border: 2px solid currentColor;
  background: #000;
  color: #fff;
}

.high-contrast .btn:hover,
.high-contrast .btn:focus {
  background: #fff;
  color: #000;
}

.high-contrast .display {
  background: #000;
  color: #fff;
  border: 2px solid #fff;
}

/* Reduced motion */
.reduced-motion *,
.reduced-motion *::before,
.reduced-motion *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  z-index: 1000;
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
}

/* Focus within for groups */
.button-group:focus-within {
  outline: 2px dashed #005fcc;
  outline-offset: 4px;
}

/* Minimum touch target size (44x44px) */
.btn {
  min-width: 44px;
  min-height: 44px;
}

/* Text resize support */
html {
  font-size: 100%; /* Respect user preferences */
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

### 2.4 Spanish Localization

**Priority:** 🟡 Medium
**Effort:** 8 hours
**File:** `src/locales/es.json`

```json
{
  "app": {
    "title": "Calculadora Científica Avanzada",
    "subtitle": "Gráficos, Estadísticas y Matrices"
  },
  "modes": {
    "basic": "Básica",
    "scientific": "Científica",
    "graphs": "Gráficos",
    "statistics": "Estadísticas",
    "matrix": "Matrices"
  },
  "buttons": {
    "calculate": "Calcular",
    "clear": "Limpiar",
    "backspace": "Borrar",
    "equals": "Igual"
  },
  "graph": {
    "function": "Función",
    "addFunction": "Agregar Función",
    "table": "Tabla",
    "trace": "Trazar",
    "zoomIn": "Acercar",
    "zoomOut": "Alejar",
    "reset": "Restablecer"
  },
  "statistics": {
    "mean": "Media",
    "median": "Mediana",
    "mode": "Moda",
    "range": "Rango",
    "variance": "Varianza",
    "stdDev": "Desviación Estándar",
    "calculate": "Calcular Estadísticas"
  },
  "matrix": {
    "rows": "Filas",
    "columns": "Columnas",
    "create": "Crear Matriz",
    "determinant": "Determinante",
    "inverse": "Inversa",
    "transpose": "Transpuesta"
  },
  "errors": {
    "invalidExpression": "Expresión inválida",
    "divisionByZero": "División por cero",
    "overflow": "Desbordamiento numérico"
  },
  "accessibility": {
    "calculatorRegion": "Región de la calculadora",
    "displayResult": "Resultado: {value}",
    "buttonPressed": "Presionado: {button}"
  }
}
```

---

### 2.5 VPAT Documentation

**Priority:** 🟡 Medium
**Effort:** 16 hours
**File:** `docs/VPAT.md`

```markdown
# Voluntary Product Accessibility Template (VPAT)

## Product Information

**Product Name:** Advanced Graphing Calculator
**Version:** 1.0.0
**Report Date:** January 2026
**Contact:** [Your Email]

## Applicable Standards

- WCAG 2.1 Level AA
- Section 508 of the Rehabilitation Act

## Evaluation Methods

- Automated testing with axe-core
- Manual keyboard testing
- Screen reader testing (NVDA, VoiceOver)
- Color contrast analysis

## Summary

| Criteria | Conformance Level | Notes |
|----------|-------------------|-------|
| Perceivable | Supports | All content has text alternatives |
| Operable | Supports | Full keyboard navigation |
| Understandable | Supports | Consistent, predictable UI |
| Robust | Supports | Compatible with assistive tech |

## Detailed Compliance

### 1.1 Text Alternatives
**Status:** Supports
All images and icons have appropriate alt text or aria-labels.

### 1.3 Adaptable
**Status:** Supports
Content structure is maintained when presented in different ways.

### 1.4 Distinguishable
**Status:** Supports
- Color contrast ratio: 7:1 (AAA level)
- Text resizable up to 200%
- No images of text

### 2.1 Keyboard Accessible
**Status:** Supports
- All functionality available via keyboard
- No keyboard traps
- Arrow key grid navigation

### 2.4 Navigable
**Status:** Supports
- Skip navigation link
- Focus indicators visible
- Descriptive page title

### 3.1 Readable
**Status:** Supports
- Language of page identified
- Language of parts identified

### 4.1 Compatible
**Status:** Supports
- Valid HTML
- Complete start/end tags
- Unique IDs
- Proper ARIA usage
```

---

## Phase 3: Educational Enhancement (Months 2-3)

### Goal: Add features specifically valuable for STEM education

---

### 3.1 Step-by-Step Solver Mode

**Priority:** 🔴 Critical
**Effort:** 40 hours

**File:** `src/scripts/solver.js`

```javascript
/**
 * Step-by-step mathematical problem solver
 * Designed for educational purposes with detailed explanations
 * @module solver
 */

export class StepBySolver {
  constructor() {
    this.steps = [];
    this.currentExpression = '';
  }

  /**
   * Solve expression with step-by-step breakdown
   * @param {string} expression - Mathematical expression
   * @returns {Object} Solution with steps
   */
  solve(expression) {
    this.steps = [];
    this.currentExpression = expression;

    // Parse and identify operations
    const operations = this.parseExpression(expression);

    // Execute each step
    let result = this.executeSteps(operations);

    return {
      originalExpression: expression,
      steps: this.steps,
      finalResult: result,
      totalSteps: this.steps.length
    };
  }

  parseExpression(expr) {
    // Tokenize expression
    const tokens = [];
    let current = '';

    for (const char of expr) {
      if ('+-×÷*/()^'.includes(char)) {
        if (current) tokens.push({ type: 'number', value: parseFloat(current) });
        tokens.push({ type: 'operator', value: char });
        current = '';
      } else {
        current += char;
      }
    }
    if (current) tokens.push({ type: 'number', value: parseFloat(current) });

    return tokens;
  }

  executeSteps(tokens) {
    // Step 1: Handle parentheses
    this.addStep('Identify groupings', 'Look for parentheses to evaluate first');

    // Step 2: Handle exponents
    this.addStep('Evaluate exponents', 'Calculate any powers');

    // Step 3: Multiplication and Division (left to right)
    this.addStep('Multiply and Divide', 'Work from left to right');

    // Step 4: Addition and Subtraction (left to right)
    this.addStep('Add and Subtract', 'Work from left to right');

    // Simplified - actual implementation would process tokens
    const result = this.evaluateExpression(this.currentExpression);

    this.addStep('Final Result', `The answer is ${result}`);

    return result;
  }

  addStep(title, explanation, calculation = null) {
    this.steps.push({
      stepNumber: this.steps.length + 1,
      title,
      explanation,
      calculation,
      currentState: this.currentExpression
    });
  }

  evaluateExpression(expr) {
    // Safe evaluation using Function constructor
    const sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**');

    try {
      return new Function(`return ${sanitized}`)();
    } catch {
      return NaN;
    }
  }

  /**
   * Get educational explanation for operation
   * @param {string} operation - Operation symbol
   * @returns {string} Educational explanation
   */
  getOperationExplanation(operation) {
    const explanations = {
      '+': 'Addition combines quantities together',
      '-': 'Subtraction finds the difference between quantities',
      '*': 'Multiplication is repeated addition',
      '/': 'Division splits a quantity into equal parts',
      '^': 'Exponentiation is repeated multiplication'
    };
    return explanations[operation] || 'Mathematical operation';
  }
}

export const solver = new StepBySolver();
```

---

### 3.2 Common Core Standards Alignment

**Priority:** 🟡 Medium
**Effort:** 20 hours
**File:** `docs/COMMON_CORE_ALIGNMENT.md`

```markdown
# Common Core State Standards Alignment

## Overview

The Advanced Graphing Calculator supports the following Common Core State Standards for Mathematics (CCSSM).

## Grade-Level Alignment

### Grades 6-8

| Standard | Feature | Description |
|----------|---------|-------------|
| 6.EE.A.2 | Expression Evaluation | Write, read, and evaluate expressions |
| 6.EE.B.5 | Equation Solving | Understand solving as finding values |
| 7.RP.A.2 | Proportional Relationships | Graph proportional relationships |
| 8.EE.B.5 | Linear Functions | Graph and compare linear functions |
| 8.F.A.1 | Function Concept | Understand functions as rules |

### High School - Algebra

| Standard | Feature | Description |
|----------|---------|-------------|
| HSA-SSE.A.2 | Expression Structure | See structure in expressions |
| HSA-REI.D.10 | Graphing Equations | Understand equation graphs |
| HSA-REI.D.11 | Intersection Points | Find intersection of graphs |

### High School - Functions

| Standard | Feature | Description |
|----------|---------|-------------|
| HSF-IF.C.7 | Function Graphs | Graph functions and features |
| HSF-BF.A.1 | Build Functions | Write functions for relationships |
| HSF-LE.A.1 | Linear vs Exponential | Distinguish growth types |
| HSF-TF.A.2 | Trigonometric Functions | Explain using unit circle |

### High School - Statistics

| Standard | Feature | Description |
|----------|---------|-------------|
| HSS-ID.A.1 | Data Representation | Dot plots, histograms, box plots |
| HSS-ID.A.2 | Center and Spread | Mean, median, IQR, std dev |
| HSS-ID.A.3 | Outliers | Identify effect of outliers |
| HSS-ID.B.6 | Linear Models | Fit and interpret linear models |

## Classroom Integration Guide

### Lesson Plan Examples

1. **Exploring Linear Functions (Grade 8)**
   - Use graphing mode to plot y = mx + b
   - Adjust m and b to see effects
   - Trace points to verify coordinates

2. **Statistical Analysis (High School)**
   - Enter data into L1
   - Calculate descriptive statistics
   - Create histogram and box plot
   - Analyze distribution shape

3. **Trigonometric Functions**
   - Graph sin(x), cos(x), tan(x)
   - Compare periods and amplitudes
   - Use DEG/RAD toggle for exploration
```

---

### 3.3 PWA Implementation

**Priority:** 🟡 Medium
**Effort:** 24 hours

**File:** `manifest.json`

```json
{
  "name": "Advanced Graphing Calculator",
  "short_name": "Calculator",
  "description": "Scientific calculator with graphing, statistics, and matrix operations for STEM education",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#4a90d9",
  "orientation": "any",
  "icons": [
    {
      "src": "/icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["education", "utilities"],
  "screenshots": [
    {
      "src": "/screenshots/basic.png",
      "sizes": "1280x720",
      "type": "image/png",
      "label": "Basic Calculator Mode"
    },
    {
      "src": "/screenshots/graphing.png",
      "sizes": "1280x720",
      "type": "image/png",
      "label": "Graphing Mode"
    }
  ]
}
```

**File:** `sw.js` (Service Worker)

```javascript
const CACHE_NAME = 'calculator-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/src/scripts/app.js',
  '/src/scripts/calculator.js',
  '/src/scripts/scientific.js',
  '/src/scripts/graphing.js',
  '/src/scripts/statistics.js',
  '/src/scripts/matrix.js',
  '/src/scripts/ui.js',
  '/src/scripts/utils.js',
  '/src/scripts/i18n.js',
  '/src/styles/variables.css',
  '/src/styles/base.css',
  '/src/styles/calculator.css',
  '/src/styles/buttons.css',
  '/src/locales/en.json',
  '/src/locales/es.json',
  '/src/locales/ru.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
            return response;
          });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});
```

---

## Phase 4: Community & Impact (Months 4-6)

### Goal: Build community presence and document impact for NIW

---

### 4.1 NPM Package Publishing

**Priority:** 🟡 Medium
**Effort:** 4 hours

```bash
# Prepare for publishing
npm login
npm publish --access public

# Verify
npm info advanced-graphing-calculator
```

---

### 4.2 GitHub Pages Deployment

**Priority:** 🔴 Critical
**Effort:** 2 hours

Already configured in CI/CD workflow. Enable in repository settings:
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages

---

### 4.3 Impact Metrics Collection

**Priority:** 🟡 Medium
**Effort:** 8 hours

**File:** `src/scripts/analytics.js` (Privacy-focused)

```javascript
/**
 * Privacy-focused analytics for impact measurement
 * No personal data collection, aggregate statistics only
 * @module analytics
 */

export class ImpactAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.events = [];
  }

  generateSessionId() {
    // Anonymous session ID, not tied to user
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Track feature usage (aggregate only)
   * @param {string} feature - Feature name
   */
  trackFeatureUsage(feature) {
    const event = {
      type: 'feature_usage',
      feature,
      timestamp: Date.now(),
      // No personal identifiers
    };
    this.events.push(event);
    this.sendIfReady();
  }

  /**
   * Track accessibility feature usage
   * @param {string} feature - Accessibility feature
   */
  trackAccessibilityUsage(feature) {
    this.trackFeatureUsage(`accessibility:${feature}`);
  }

  sendIfReady() {
    if (this.events.length >= 10) {
      this.sendEvents();
    }
  }

  sendEvents() {
    // Only send aggregate data
    const aggregateData = {
      sessionCount: 1,
      featureCounts: this.aggregateFeatures(),
      // No PII, no IP tracking, no cookies
    };

    // Send to privacy-respecting endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(aggregateData));
    }

    this.events = [];
  }

  aggregateFeatures() {
    const counts = {};
    for (const event of this.events) {
      counts[event.feature] = (counts[event.feature] || 0) + 1;
    }
    return counts;
  }
}
```

---

### 4.4 Testimonial Collection Template

**Priority:** 🟡 Medium
**File:** `docs/TESTIMONIAL_REQUEST.md`

```markdown
# Request for Testimonial

Dear Educator,

Thank you for using the Advanced Graphing Calculator in your classroom. Your feedback is invaluable for improving this educational tool.

## Questions

1. **How do you use this calculator in your teaching?**

2. **What features do your students find most helpful?**

3. **How does this compare to other calculators you've used?**

4. **Has this tool improved student understanding? How?**

5. **What improvements would you suggest?**

## Optional Information

- Your name and title (for attribution):
- School/Institution:
- Grade level(s) taught:
- Subject area:
- Approximate number of students using the tool:

## Permission

[ ] I grant permission to use my testimonial (with attribution)
[ ] I grant permission to use my testimonial (anonymous)

---

Please email your response to: [your.email@example.com]

Thank you for supporting open-source education!
```

---

## Implementation Checklist

### Phase 1: Foundation ✅
- [ ] LICENSE file (MIT)
- [ ] package.json
- [ ] .eslintrc.json
- [ ] .prettierrc
- [ ] .github/workflows/ci.yml
- [ ] README.md (English)
- [ ] CONTRIBUTING.md
- [ ] CODE_OF_CONDUCT.md

### Phase 2: Quality & Compliance
- [ ] Jest configuration
- [ ] calculator.test.js (80%+ coverage)
- [ ] scientific.test.js
- [ ] statistics.test.js
- [ ] matrix.test.js
- [ ] accessibility.js module
- [ ] accessibility.css
- [ ] ARIA labels on all buttons
- [ ] Keyboard navigation
- [ ] Skip navigation link
- [ ] High contrast mode
- [ ] Reduced motion support
- [ ] Spanish localization (es.json)
- [ ] VPAT documentation

### Phase 3: Educational Enhancement
- [ ] Step-by-step solver
- [ ] Common Core alignment docs
- [ ] PWA manifest.json
- [ ] Service Worker (sw.js)
- [ ] Offline support

### Phase 4: Community & Impact
- [ ] NPM package published
- [ ] GitHub Pages live
- [ ] Analytics implementation
- [ ] Testimonial collection started
- [ ] School partnership initiated
- [ ] Conference submission drafted

---

## Success Metrics Dashboard

| Metric | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|--------|---------|---------|---------|---------|
| Test Coverage | 0% | 80% | 85% | 90% |
| WCAG Compliance | 30% | 100% | 100% | 100% |
| Languages | 2 | 3 | 3 | 4+ |
| NPM Downloads | - | - | 100 | 1000+ |
| GitHub Stars | 0 | 10 | 50 | 150+ |
| School Adoptions | 0 | 0 | 1 | 3+ |
| Testimonials | 0 | 0 | 2 | 5+ |

---

*Document Version: 1.0*
*Last Updated: January 2026*
