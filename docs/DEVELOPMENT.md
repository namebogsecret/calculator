# Development Guide

Руководство по разработке и расширению калькулятора.

## Содержание
- [Архитектура проекта](#архитектура-проекта)
- [Настройка окружения](#настройка-окружения)
- [Структура кода](#структура-кода)
- [Добавление новых функций](#добавление-новых-функций)
- [Тестирование](#тестирование)
- [Отладка](#отладка)
- [Оптимизация](#оптимизация)
- [Лучшие практики](#лучшие-практики)

## Архитектура проекта

### Принципы архитектуры

1. **Модульность**: Каждая функциональность выделена в отдельный модуль
2. **Разделение ответственности**: HTML, CSS и JavaScript четко разделены
3. **Компонентный подход**: UI разбит на переиспользуемые компоненты
4. **Слабая связанность**: Модули минимально зависят друг от друга

### Диаграмма архитектуры

```
┌─────────────────────────────────────────────────────────────┐
│                     index.html                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 Component Loader                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     App.js                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │ Calculator  │ │ Scientific  │ │ Graphing    │ │ Stats   │ │
│  │             │ │             │ │             │ │         │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │ UI Manager  │ │ Display     │ │ Utils       │ │Constants│ │
│  │             │ │             │ │             │ │         │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Настройка окружения

### Требования

- **Браузер**: Chrome 85+, Firefox 85+, Safari 14+, Edge 85+
- **Node.js**: 14+ (для инструментов разработки)
- **Редактор**: VS Code (рекомендуется)

### Рекомендуемые расширения VS Code

```json
{
    "recommendations": [
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-eslint",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-json"
    ]
}
```

### Настройка проекта

1. **Клонирование**:
   ```bash
   git clone <repository-url>
   cd calculator
   ```

2. **Настройка инструментов** (опционально):
   ```bash
   npm init -y
   npm install --save-dev prettier eslint live-server
   ```

3. **Запуск локального сервера**:
   ```bash
   # Используя Node.js
   npx live-server
   
   # Используя Python
   python -m http.server 8000
   
   # Используя PHP
   php -S localhost:8000
   ```

## Структура кода

### Файловая организация

```
src/
├── components/          # HTML компоненты
│   ├── *.html          # Шаблоны компонентов
├── styles/             # CSS стили
│   ├── variables.css   # CSS переменные
│   ├── base.css        # Базовые стили
│   └── *.css          # Стили компонентов
├── scripts/            # JavaScript модули
│   ├── constants.js    # Константы
│   ├── utils.js        # Утилиты
│   ├── calculator.js   # Основная логика
│   ├── scientific.js   # Научные функции
│   ├── graphing.js     # Построение графиков
│   ├── statistics.js   # Статистика
│   ├── ui.js          # Управление UI
│   └── app.js         # Главный модуль
└── utils/             # Вспомогательные файлы
```

### Соглашения именования

- **Файлы**: kebab-case (`calculator-button.js`)
- **Классы**: PascalCase (`Calculator`, `GraphRenderer`)
- **Функции**: camelCase (`calculateResult`, `plotFunction`)
- **Константы**: UPPER_SNAKE_CASE (`MAX_PRECISION`, `DEFAULT_RANGE`)
- **CSS классы**: kebab-case (`.calculator-display`, `.btn-primary`)

## Добавление новых функций

### 1. Математическая функция

#### Шаг 1: Добавить функцию в соответствующий модуль

```javascript
// src/scripts/scientific.js
export class TrigonometricFunctions {
    static sec(x, angleMode = 'rad') {
        const radians = angleMode === 'deg' ? x * Math.PI / 180 : x;
        return 1 / Math.cos(radians);
    }
}
```

#### Шаг 2: Добавить кнопку в UI

```html
<!-- src/components/scientific-calculator-buttons.html -->
<button class="btn function" onclick="appendFunction('sec')">sec</button>
```

#### Шаг 3: Обновить парсер выражений

```javascript
// src/scripts/calculator.js
prepareExpression(expr) {
    return expr
        .replace(/sec\(/g, 'TrigonometricFunctions.sec(')
        // ... другие замены
}
```

#### Шаг 4: Добавить тест

```javascript
// tests/scientific.test.js
test('sec function', () => {
    expect(TrigonometricFunctions.sec(0)).toBeCloseTo(1);
    expect(TrigonometricFunctions.sec(60, 'deg')).toBeCloseTo(2);
});
```

### 2. Новый режим калькулятора

#### Шаг 1: Создать HTML компонент

```html
<!-- src/components/programming-calculator.html -->
<div class="programming-calculator" id="programming-mode">
    <div class="number-base-selector">
        <button class="base-btn active" data-base="10">DEC</button>
        <button class="base-btn" data-base="16">HEX</button>
        <button class="base-btn" data-base="8">OCT</button>
        <button class="base-btn" data-base="2">BIN</button>
    </div>
    <!-- Дополнительные элементы -->
</div>
```

#### Шаг 2: Добавить CSS стили

```css
/* src/styles/programming.css */
.programming-calculator {
    display: none;
    padding: 1rem;
}

.programming-calculator.active {
    display: block;
}

.number-base-selector {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
```

#### Шаг 3: Создать класс логики

```javascript
// src/scripts/programming.js
export class ProgrammingCalculator {
    constructor() {
        this.currentBase = 10;
        this.value = 0;
    }

    setBase(base) {
        this.currentBase = base;
        this.updateDisplay();
    }

    convertToBase(value, base) {
        return value.toString(base).toUpperCase();
    }
}
```

#### Шаг 4: Зарегистрировать в ModeManager

```javascript
// src/scripts/ui.js
export class ModeManager {
    constructor() {
        this.modes = {
            'basic': BasicMode,
            'scientific': ScientificMode,
            'graphing': GraphingMode,
            'statistics': StatisticsMode,
            'programming': ProgrammingMode // Новый режим
        };
    }
}
```

### 3. Новый тип графика

#### Шаг 1: Расширить GraphRenderer

```javascript
// src/scripts/graphing.js
export class GraphRenderer {
    plotPolarFunction(rFunction, color = 'blue') {
        const points = [];
        for (let theta = 0; theta <= 2 * Math.PI; theta += 0.01) {
            try {
                const r = this.evaluateFunction(rFunction, theta);
                const x = r * Math.cos(theta);
                const y = r * Math.sin(theta);
                points.push({ x, y });
            } catch (error) {
                continue;
            }
        }
        this.drawCurve(points, color);
    }
}
```

#### Шаг 2: Добавить UI элементы

```html
<!-- В graph-container.html -->
<div class="graph-type-selector">
    <button class="graph-type-btn active" data-type="cartesian">y = f(x)</button>
    <button class="graph-type-btn" data-type="polar">r = f(θ)</button>
    <button class="graph-type-btn" data-type="parametric">x = f(t), y = g(t)</button>
</div>
```

## Тестирование

### Структура тестов

```
tests/
├── unit/
│   ├── calculator.test.js
│   ├── scientific.test.js
│   ├── statistics.test.js
│   └── utils.test.js
├── integration/
│   ├── ui.test.js
│   └── app.test.js
└── e2e/
    ├── basic-operations.test.js
    └── graphing.test.js
```

### Настройка Jest

```javascript
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "jest": "^27.0.0",
    "@testing-library/dom": "^8.0.0"
  }
}
```

### Примеры тестов

#### Unit тесты

```javascript
// tests/unit/calculator.test.js
import { Calculator } from '../../src/scripts/calculator.js';

describe('Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    test('should add numbers correctly', () => {
        expect(calculator.calculate('2 + 3')).toBe('5');
    });

    test('should handle division by zero', () => {
        expect(calculator.calculate('5 / 0')).toBe('Infinity');
    });

    test('should format large numbers', () => {
        expect(calculator.calculate('1000000 + 1')).toBe('1,000,001');
    });
});
```

#### Integration тесты

```javascript
// tests/integration/ui.test.js
import { CalculatorApp } from '../../src/scripts/app.js';

describe('Calculator UI Integration', () => {
    let app;

    beforeEach(async () => {
        document.body.innerHTML = '<div id="calculator-container"></div>';
        app = new CalculatorApp();
        await app.initialize();
    });

    test('should switch modes correctly', () => {
        app.modeManager.setMode('scientific');
        expect(document.querySelector('.scientific-buttons')).toBeVisible();
    });
});
```

### Мокирование

```javascript
// Мокирование Canvas API
const mockCanvas = {
    getContext: jest.fn(() => ({
        fillRect: jest.fn(),
        clearRect: jest.fn(),
        drawImage: jest.fn(),
    }))
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: mockCanvas.getContext
});
```

## Отладка

### Browser DevTools

#### Console API
```javascript
// Отладочные команды
console.log('Выражение:', expression);
console.table(statisticsData);
console.time('Calculation');
// ... код вычислений
console.timeEnd('Calculation');
```

#### Performance профилирование
```javascript
// Измерение производительности
performance.mark('calc-start');
const result = heavyCalculation();
performance.mark('calc-end');
performance.measure('calculation', 'calc-start', 'calc-end');
```

### Отладка в VS Code

#### launch.json
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Chrome",
            "request": "launch",
            "type": "chrome",
            "url": "http://localhost:8000",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

### Логирование

```javascript
// src/scripts/utils.js
export class Logger {
    static log(level, message, data = null) {
        if (process.env.NODE_ENV === 'development') {
            console[level](`[${new Date().toISOString()}] ${message}`, data);
        }
    }

    static error(message, error) {
        this.log('error', message, error);
    }

    static warn(message, data) {
        this.log('warn', message, data);
    }

    static info(message, data) {
        this.log('info', message, data);
    }
}
```

## Оптимизация

### Производительность

#### Debouncing
```javascript
// Оптимизация пересчета графиков
const debouncedPlot = debounce((expression) => {
    graphRenderer.plotFunction(expression);
}, 300);
```

#### Мемоизация
```javascript
// Кэширование вычислений функций
const memoizedSin = memoize((x) => Math.sin(x));
```

#### Lazy Loading
```javascript
// Отложенная загрузка модулей
const loadStatisticsModule = async () => {
    const { StatisticsCalculator } = await import('./statistics.js');
    return new StatisticsCalculator();
};
```

### Размер бандла

#### Анализ размера
```bash
# Анализ размера файлов
du -h src/scripts/*.js

# Минификация
npx terser src/scripts/app.js -o dist/app.min.js
```

#### Code Splitting
```javascript
// Динамический импорт для крупных модулей
const loadAdvancedMath = async () => {
    const module = await import('./advanced-math.js');
    return module.default;
};
```

## Лучшие практики

### Код-стиль

#### ESLint конфигурация
```javascript
// .eslintrc.js
module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ['eslint:recommended'],
    rules: {
        'no-unused-vars': 'error',
        'no-console': 'warn',
        'prefer-const': 'error'
    }
};
```

#### Prettier конфигурация
```json
{
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 80,
    "tabWidth": 4
}
```

### Документация кода

```javascript
/**
 * Вычисляет факториал числа
 * @param {number} n - Число для вычисления факториала
 * @returns {number} Факториал числа n
 * @throws {Error} Если n < 0 или n не является целым числом
 * @example
 * factorial(5) // 120
 * factorial(0) // 1
 */
export function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) {
        throw new Error('Факториал определен только для неотрицательных целых чисел');
    }
    
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    
    return result;
}
```

### Обработка ошибок

```javascript
// Централизованная обработка ошибок
export class ErrorHandler {
    static handle(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Логирование в внешний сервис
        if (this.shouldReport(error)) {
            this.reportError(error, context);
        }
        
        // Показ пользователю
        this.showUserError(this.getUserMessage(error));
    }

    static shouldReport(error) {
        return error.name !== 'ValidationError';
    }

    static getUserMessage(error) {
        const messages = {
            'SyntaxError': 'Ошибка в математическом выражении',
            'RangeError': 'Значение выходит за допустимые пределы',
            'TypeError': 'Неверный тип данных'
        };
        
        return messages[error.name] || 'Произошла неожиданная ошибка';
    }
}
```

### Безопасность

```javascript
// Безопасное выполнение математических выражений
export class SafeEvaluator {
    static allowedFunctions = new Set([
        'sin', 'cos', 'tan', 'log', 'exp', 'sqrt', 'abs', 'floor', 'ceil'
    ]);

    static sanitizeExpression(expr) {
        // Удаление потенциально опасных конструкций
        const dangerous = [
            'eval', 'Function', 'setTimeout', 'setInterval',
            'document', 'window', 'process', 'require'
        ];
        
        for (const word of dangerous) {
            if (expr.includes(word)) {
                throw new Error('Недопустимое выражение');
            }
        }
        
        return expr;
    }
}
```

### Доступность

```javascript
// Поддержка клавиатурной навигации
export class KeyboardHandler {
    constructor() {
        this.setupKeyboardShortcuts();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                this.calculate();
            }
            
            if (event.key === 'Escape') {
                this.clear();
            }
            
            // Числовые клавиши
            if (/^\d$/.test(event.key)) {
                this.appendNumber(event.key);
            }
        });
    }
}
```

### Интернационализация

```javascript
// Поддержка множественных языков
export class I18n {
    static translations = {
        'en': {
            'calculate': 'Calculate',
            'clear': 'Clear',
            'error': 'Error'
        },
        'ru': {
            'calculate': 'Вычислить',
            'clear': 'Очистить', 
            'error': 'Ошибка'
        }
    };

    static t(key, lang = 'ru') {
        return this.translations[lang]?.[key] || key;
    }
}
```

## Развертывание

### Подготовка к продакшену

1. **Минификация**:
   ```bash
   npx terser src/scripts/*.js -o dist/bundle.min.js
   npx csso src/styles/*.css -o dist/styles.min.css
   ```

2. **Оптимизация изображений**:
   ```bash
   npx imagemin assets/images/* --out-dir=dist/images
   ```

3. **Gzip сжатие**:
   ```bash
   gzip -9 dist/*.js dist/*.css
   ```

4. **Service Worker** для кэширования:
   ```javascript
   // sw.js
   const CACHE_NAME = 'calculator-v1';
   const urlsToCache = [
       '/',
       '/src/styles/main.css',
       '/src/scripts/app.js'
   ];
   ```

### Непрерывная интеграция

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm test
      - run: npm run build
```