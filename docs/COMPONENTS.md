# Components Documentation

Подробная документация по HTML компонентам калькулятора.

## Обзор

Калькулятор построен на модульной архитектуре компонентов. Каждый компонент представляет собой отдельный HTML файл, который загружается и вставляется в основную страницу.

## Структура компонентов

```
src/components/
├── mode-selector.html              # Селектор режимов калькулятора
├── display.html                    # Область отображения выражений и результатов
├── basic-calculator-buttons.html   # Кнопки базового калькулятора
├── scientific-calculator-buttons.html  # Кнопки научного калькулятора
├── buttons-container.html          # Контейнер всех кнопок
├── graph-container.html            # Компонент построения графиков  
└── statistics-container.html       # Компонент статистического анализа
```

## Компоненты

### mode-selector.html

**Назначение**: Панель переключения между режимами калькулятора.

**Содержимое**:
- 4 кнопки режимов: Основной, Научный, Графики, Статистика
- Индикатор активного режима

**Структура**:
```html
<div class="mode-selector">
    <button class="mode-btn active" onclick="switchMode('basic')">
        Основной
    </button>
    <button class="mode-btn" onclick="switchMode('scientific')">
        Научный  
    </button>
    <button class="mode-btn" onclick="switchMode('graphing')">
        Графики
    </button>
    <button class="mode-btn" onclick="switchMode('statistics')">
        Статистика
    </button>
</div>
```

**CSS классы**:
- `.mode-selector` - контейнер селектора
- `.mode-btn` - кнопка режима
- `.mode-btn.active` - активная кнопка

**События**:
- `onclick="switchMode(mode)"` - переключение режима

---

### display.html

**Назначение**: Область отображения математических выражений и результатов.

**Содержимое**:
- Поле ввода выражения
- Поле результата с анимацией сканирования

**Структура**:
```html
<div class="display">
    <div class="expression" id="expression">0</div>
    <div class="result" id="result">
        <span class="scan-line"></span>
    </div>
</div>
```

**CSS классы**:
- `.display` - контейнер дисплея
- `.expression` - область выражения
- `.result` - область результата
- `.scan-line` - анимированная линия сканирования

**ID элементов**:
- `#expression` - для обновления выражения
- `#result` - для обновления результата

---

### basic-calculator-buttons.html

**Назначение**: Базовые кнопки калькулятора (цифры и операторы).

**Содержимое**:
- Цифры 0-9
- Операторы +, -, ×, ÷
- Функциональные кнопки (=, C, ⌫)
- Дополнительные функции (%, ±, .)

**Структура**:
```html
<div class="basic-buttons">
    <!-- Строки кнопок с цифрами и операторами -->
    <div class="button-row">
        <button class="btn clear" onclick="clearCalculator()">C</button>
        <button class="btn clear" onclick="clearEntry()">CE</button>
        <button class="btn operator" onclick="deleteLast()">⌫</button>
        <button class="btn operator" onclick="appendToExpression('/')">/</button>
    </div>
    <!-- ... остальные строки кнопок -->
</div>
```

**Типы кнопок**:
- `.btn.number` - цифровые кнопки (0-9)
- `.btn.operator` - операторы (+, -, ×, ÷)
- `.btn.function` - функциональные кнопки
- `.btn.clear` - кнопки очистки
- `.btn.equals` - кнопка вычисления

---

### scientific-calculator-buttons.html

**Назначение**: Дополнительные кнопки для научных функций.

**Содержимое**:
- Тригонометрические функции (sin, cos, tan)
- Логарифмические функции (log, ln)
- Степенные функции (x², x³, √)
- Константы (π, e)
- Факториал, комбинации, размещения

**Структура**:
```html
<div class="scientific-buttons">
    <div class="button-row">
        <button class="btn function" onclick="appendFunction('sin')">sin</button>
        <button class="btn function" onclick="appendFunction('cos')">cos</button>
        <button class="btn function" onclick="appendFunction('tan')">tan</button>
        <!-- ... другие научные функции -->
    </div>
</div>
```

**Функции**:
- Тригонометрические: sin, cos, tan, asin, acos, atan
- Гиперболические: sinh, cosh, tanh
- Логарифмические: log, ln, log₂
- Степенные: x², x³, x^y, √x, ∛x, ⁿ√x
- Константы: π, e, φ (золотое сечение)
- Статистические: n!, nPr, nCr

---

### buttons-container.html

**Назначение**: Контейнер, объединяющий все кнопки калькулятора.

**Содержимое**:
- Научные кнопки (видны в научном режиме)
- Базовые кнопки (всегда видны)

**Структура**:
```html
<div class="buttons-container">
    <div class="scientific-buttons" id="scientific-buttons">
        <!-- Содержимое scientific-calculator-buttons.html -->
    </div>
    <div class="basic-buttons">
        <!-- Содержимое basic-calculator-buttons.html -->
    </div>
</div>
```

**Управление видимостью**:
Научные кнопки показываются/скрываются в зависимости от режима через CSS классы.

---

### graph-container.html

**Назначение**: Интерфейс для построения и анализа графиков функций.

**Основные разделы**:

#### 1. Вкладки графиков
```html
<div class="graph-tabs">
    <button class="tab-btn active" onclick="showGraphTab('functions')">Функции</button>
    <button class="tab-btn" onclick="showGraphTab('table')">Таблица</button>
    <button class="tab-btn" onclick="showGraphTab('regression')">Регрессия</button>
    <button class="tab-btn" onclick="showGraphTab('trace')">Трассировка</button>
</div>
```

#### 2. Вкладка "Функции"
- Поле ввода функции
- Кнопки управления (построить, очистить, экспорт)
- Canvas для отображения графика
- Элементы управления масштабом

```html
<div class="graph-content" id="functions-tab">
    <div class="function-input">
        <input type="text" id="function-input" placeholder="Введите функцию, например: x^2 + 2*x + 1">
        <button class="btn" onclick="plotFunction()">Построить</button>
    </div>
    <div class="graph-area">
        <canvas id="graph-canvas" width="600" height="400"></canvas>
        <div class="graph-controls">
            <!-- Элементы управления -->
        </div>
    </div>
</div>
```

#### 3. Вкладка "Таблица"
- Настройки диапазона и шага
- Таблица значений функции
- Экспорт данных

#### 4. Вкладка "Регрессия"
- Ввод данных (точки X,Y)
- Выбор типа регрессии
- Результаты анализа
- Визуализация

#### 5. Вкладка "Трассировка"
- Трассировка точек на графике
- Отображение координат
- Поиск экстремумов

**Ключевые элементы**:
- `#graph-canvas` - холст для рисования графиков
- `#function-input` - поле ввода функции
- `.zoom-controls` - элементы управления масштабом
- `.coordinate-display` - отображение координат

---

### statistics-container.html

**Назначение**: Интерфейс для статистического анализа данных.

**Основные разделы**:

#### 1. Вкладки статистики
```html
<div class="stats-tabs">
    <button class="tab-btn active" onclick="showStatsTab('onevar')">1-Var Stats</button>
    <button class="tab-btn" onclick="showStatsTab('twovar')">2-Var Stats</button>
    <button class="tab-btn" onclick="showStatsTab('distributions')">Распределения</button>
    <button class="tab-btn" onclick="showStatsTab('tests')">Тесты</button>
</div>
```

#### 2. Вкладка "1-Var Stats"
- Поле ввода данных
- Результаты описательной статистики
- Гистogramма

```html
<div class="stats-content" id="onevar-tab">
    <div class="data-input">
        <label>Данные (разделенные запятыми или пробелами):</label>
        <textarea id="data-input" placeholder="1, 2, 3, 4, 5, 6, 7, 8, 9, 10"></textarea>
        <button class="btn" onclick="calculateOneVarStats()">Вычислить</button>
    </div>
    <div class="stats-results" id="onevar-results">
        <!-- Результаты статистики -->
    </div>
</div>
```

#### 3. Вкладка "2-Var Stats"
- Ввод парных данных X,Y  
- Корреляционный анализ
- Регрессионный анализ
- Диаграмма рассеяния

#### 4. Вкладка "Распределения"
- Выбор типа распределения
- Параметры распределения
- Вычисление вероятностей
- Графики распределений

#### 5. Вкладка "Тесты"
- Статистические тесты (t-тест, z-тест, хи-квадрат)
- Настройка параметров теста
- Результаты тестирования

**Ключевые элементы**:
- `#data-input` - поле ввода данных
- `.stats-results` - область результатов
- `.distribution-params` - параметры распределений
- `.test-params` - параметры статистических тестов

## Интеграция компонентов

### Загрузка компонентов

Компоненты загружаются динамически через `ComponentLoader`:

```javascript
import { ComponentLoader } from './component-loader.js';

// Загрузка всех компонентов
await ComponentLoader.initializeCalculatorComponents();

// Загрузка отдельного компонента
await ComponentLoader.loadComponent('src/components/display.html', 'display-container');
```

### Стилизация

Каждый компонент стилизуется через соответствующие CSS файлы:

- **mode-selector.html** → `modes.css`
- **display.html** → `display.css`
- **buttons-container.html** → `buttons.css`
- **graph-container.html** → `graphs.css`
- **statistics-container.html** → `statistics.css`

### События и взаимодействие

Компоненты взаимодействуют через:

1. **Глобальные функции**: `onclick="functionName()"`
2. **Пользовательские события**: `dispatchEvent(new CustomEvent('eventName'))`
3. **Состояние приложения**: через центральный `CalculatorApp`

### Адаптивность

Все компоненты адаптируются под разные размеры экрана:

- **Мобильные устройства** (< 600px): компактная компоновка
- **Планшеты** (600px - 768px): промежуточная компоновка  
- **Десктоп** (> 768px): полная компоновка

## Создание новых компонентов

### 1. Создание HTML файла

```html
<!-- src/components/my-component.html -->
<div class="my-component">
    <h3>Мой компонент</h3>
    <button onclick="myFunction()">Кнопка</button>
</div>
```

### 2. Добавление стилей

```css
/* src/styles/my-component.css */
.my-component {
    background: var(--dark-lighter);
    padding: 1rem;
    border-radius: 8px;
}
```

### 3. Подключение к загрузчику

```javascript
// В component-loader.js
const components = [
    // ... существующие компоненты
    { path: 'src/components/my-component.html', container: 'my-component-container' }
];
```

### 4. Добавление контейнера в index.html

```html
<!-- В index.html -->
<div id="my-component-container"></div>
```

### 5. Реализация функциональности

```javascript
// В соответствующем JS модуле
export function myFunction() {
    console.log('Функция компонента выполнена');
}
```

## Лучшие практики

### 1. Семантическая разметка
Используйте семантически правильные HTML теги:
```html
<section class="calculator-section">
    <header class="section-header">
        <h2>Заголовок раздела</h2>
    </header>
    <main class="section-content">
        <!-- Содержимое -->
    </main>
</section>
```

### 2. Доступность
Добавляйте атрибуты доступности:
```html
<button 
    class="btn" 
    aria-label="Очистить калькулятор"
    onclick="clearCalculator()">
    C
</button>
```

### 3. Консистентность
Используйте единообразные паттерны:
- Одинаковые классы для похожих элементов
- Консистентные обработчики событий
- Единообразное именование ID и классов

### 4. Производительность
- Минимизируйте количество DOM элементов
- Используйте CSS для стилизации вместо inline стилей
- Группируйте похожие элементы

### 5. Поддерживаемость
- Добавляйте комментарии к сложным частям
- Используйте описательные имена классов и ID
- Разделяйте логику по отдельным функциям