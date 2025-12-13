# API Documentation

Подробная документация по всем классам и методам калькулятора.

## Содержание
- [Calculator](#calculator) - Основной класс калькулятора
- [Scientific Functions](#scientific-functions) - Научные функции
- [Graph Renderer](#graph-renderer) - Построение графиков
- [Statistics](#statistics) - Статистический анализ
- [UI Management](#ui-management) - Управление интерфейсом
- [Additional Modules](#additional-modules) - Дополнительные модули
- [Utilities](#utilities) - Вспомогательные функции

## Обзор модулей

Калькулятор состоит из 9 основных модулей:

| Модуль | Размер | Описание |
|--------|--------|----------|
| app.js | 638 строк | Главный модуль приложения и координация |
| statistics.js | 715 строк | Статистический анализ и визуализация |
| ui.js | 663 строки | Управление интерфейсом (8 менеджеров) |
| graphing.js | 602 строки | Построение и анализ графиков |
| scientific.js | 490 строк | Научные и математические функции |
| calculator.js | 335 строк | Базовые вычисления |
| utils.js | 295 строк | Вспомогательные функции |
| constants.js | 100 строк | Константы и конфигурация |
| component-loader.js | 66 строк | Динамическая загрузка компонентов |

## Calculator

### Класс `Calculator`
Основной класс для базовых математических вычислений.

```javascript
import { Calculator } from './src/scripts/calculator.js';
```

#### Конструктор
```javascript
const calculator = new Calculator();
```

#### Методы

##### `appendToExpression(value)`
Добавляет значение к математическому выражению.
- **Параметры**: `value` (string) - значение для добавления
- **Возвращает**: void

```javascript
calculator.appendToExpression('2');
calculator.appendToExpression('+');
calculator.appendToExpression('3');
```

##### `calculate(expression = null)`
Вычисляет математическое выражение.
- **Параметры**: `expression` (string, optional) - выражение для вычисления
- **Возвращает**: string - результат вычисления или сообщение об ошибке

```javascript
const result = calculator.calculate('2 + 3 * 4'); // "14"
```

##### `clear()`
Очищает текущее выражение и результат.

```javascript
calculator.clear();
```

##### `deleteLast()`
Удаляет последний символ из выражения.

```javascript
calculator.deleteLast();
```

##### `setAngleMode(mode)`
Устанавливает режим углов (градусы/радианы).
- **Параметры**: `mode` (string) - 'deg' или 'rad'

```javascript
calculator.setAngleMode('deg');
```

##### Методы памяти

###### `memoryStore(value)`
Сохраняет значение в память.
- **Параметры**: `value` (number) - значение для сохранения

###### `memoryRecall()`
Извлекает значение из памяти.
- **Возвращает**: number - сохраненное значение

###### `memoryAdd(value)`
Добавляет значение к памяти.

###### `memorySubtract(value)`
Вычитает значение из памяти.

###### `memoryClear()`
Очищает память.

## Scientific Functions

### Класс `TrigonometricFunctions`
Тригонометрические и гиперболические функции.

```javascript
import { TrigonometricFunctions } from './src/scripts/scientific.js';
```

#### Статические методы

##### `sin(x, angleMode = 'rad')`
Синус угла.
- **Параметры**: 
  - `x` (number) - угол
  - `angleMode` (string) - 'rad' или 'deg'
- **Возвращает**: number

```javascript
TrigonometricFunctions.sin(Math.PI / 2); // 1
TrigonometricFunctions.sin(90, 'deg'); // 1
```

##### `cos(x, angleMode = 'rad')`
Косинус угла.

##### `tan(x, angleMode = 'rad')`
Тангенс угла.

##### `asin(x, angleMode = 'rad')`
Арксинус.

##### `acos(x, angleMode = 'rad')`
Арккосинус.

##### `atan(x, angleMode = 'rad')`
Арктангенс.

##### `sinh(x)`
Гиперболический синус.

##### `cosh(x)`
Гиперболический косинус.

##### `tanh(x)`
Гиперболический тангенс.

### Класс `LogarithmicFunctions`
Логарифмические и экспоненциальные функции.

#### Статические методы

##### `log(x, base = 10)`
Логарифм по основанию.
- **Параметры**:
  - `x` (number) - число
  - `base` (number) - основание логарифма
- **Возвращает**: number

```javascript
LogarithmicFunctions.log(100); // 2
LogarithmicFunctions.log(8, 2); // 3
```

##### `ln(x)`
Натуральный логарифм.

##### `exp(x)`
Экспонента (e^x).

##### `pow(base, exponent)`
Возведение в степень.

##### `sqrt(x)`
Квадратный корень.

##### `cbrt(x)`
Кубический корень.

##### `nthRoot(x, n)`
Корень n-й степени.

## Graph Renderer

### Класс `GraphRenderer`
Построение и отображение графиков функций.

```javascript
import { GraphRenderer } from './src/scripts/graphing.js';
```

#### Конструктор
```javascript
const renderer = new GraphRenderer(canvasId, options = {});
```
- **Параметры**:
  - `canvasId` (string) - ID элемента canvas
  - `options` (object) - опции конфигурации

#### Методы

##### `plotFunction(functionStr, color = 'blue')`
Строит график математической функции.
- **Параметры**:
  - `functionStr` (string) - строка с функцией (например, 'x^2 + 2*x + 1')
  - `color` (string) - цвет линии графика

```javascript
renderer.plotFunction('sin(x)', 'red');
renderer.plotFunction('x^2', 'blue');
```

##### `plotData(data, color = 'blue')`
Строит график по точкам данных.
- **Параметры**:
  - `data` (Array<{x: number, y: number}>) - массив точек
  - `color` (string) - цвет точек

```javascript
const data = [{x: 1, y: 2}, {x: 2, y: 4}, {x: 3, y: 8}];
renderer.plotData(data, 'green');
```

##### `setRange(xMin, xMax, yMin, yMax)`
Устанавливает диапазон отображения.

```javascript
renderer.setRange(-10, 10, -5, 5);
```

##### `zoom(factor)`
Изменяет масштаб графика.
- **Параметры**: `factor` (number) - коэффициент масштабирования

##### `pan(deltaX, deltaY)`
Сдвигает график.
- **Параметры**:
  - `deltaX` (number) - сдвиг по X
  - `deltaY` (number) - сдвиг по Y

##### `clear()`
Очищает график.

##### `exportImage()`
Экспортирует график как изображение.
- **Возвращает**: string - Data URL изображения

### Класс `FunctionTable`
Создание таблиц значений функций.

#### Методы

##### `generateTable(functionStr, xMin, xMax, step)`
Генерирует таблицу значений функции.
- **Параметры**:
  - `functionStr` (string) - строка с функцией
  - `xMin` (number) - минимальное значение X
  - `xMax` (number) - максимальное значение X  
  - `step` (number) - шаг
- **Возвращает**: Array<{x: number, y: number}>

## Statistics

### Класс `DescriptiveStatistics`
Описательная статистика для массива данных.

```javascript
import { DescriptiveStatistics } from './src/scripts/statistics.js';
```

#### Конструктор
```javascript
const stats = new DescriptiveStatistics(data);
```
- **Параметры**: `data` (Array<number>) - массив чисел

#### Методы

##### `mean()`
Среднее арифметическое.
- **Возвращает**: number

```javascript
const stats = new DescriptiveStatistics([1, 2, 3, 4, 5]);
console.log(stats.mean()); // 3
```

##### `median()`
Медиана.
- **Возвращает**: number

##### `mode()`
Мода (наиболее частое значение).
- **Возвращает**: Array<number>

##### `standardDeviation()`
Стандартное отклонение.
- **Возвращает**: number

##### `variance()`
Дисперсия.
- **Возвращает**: number

##### `min()`
Минимальное значение.
- **Возвращает**: number

##### `max()`
Максимальное значение.
- **Возвращает**: number

##### `range()`
Размах (разность между max и min).
- **Возвращает**: number

##### `quartiles()`
Квартили.
- **Возвращает**: {Q1: number, Q2: number, Q3: number}

##### `skewness()`
Коэффициент асимметрии.
- **Возвращает**: number

##### `kurtosis()`
Коэффициент эксцесса.
- **Возвращает**: number

### Класс `RegressionAnalysis`
Регрессионный анализ.

#### Статические методы

##### `linear(data)`
Линейная регрессия y = ax + b.
- **Параметры**: `data` (Array<{x: number, y: number}>) - точки данных
- **Возвращает**: {a: number, b: number, r2: number, equation: string}

```javascript
const data = [{x: 1, y: 2}, {x: 2, y: 4}, {x: 3, y: 6}];
const result = RegressionAnalysis.linear(data);
console.log(result.equation); // "y = 2x + 0"
console.log(result.r2); // 1 (идеальная корреляция)
```

##### `quadratic(data)`
Квадратичная регрессия y = ax² + bx + c.

##### `exponential(data)`
Экспоненциальная регрессия y = ae^(bx).

##### `logarithmic(data)`
Логарифмическая регрессия y = a*ln(x) + b.

##### `power(data)`
Степенная регрессия y = ax^b.

### Класс `StatisticalTests`
Статистические тесты.

#### Статические методы

##### `tTest(sample1, sample2 = null, mu = 0)`
t-тест для одной или двух выборок.

##### `zTest(sample, populationMean, populationStd)`
z-тест.

##### `chiSquareTest(observed, expected)`
Тест хи-квадрат.

## UI Management

### Класс `DisplayManager`
Управление отображением результатов.

#### Методы

##### `updateExpression(expression)`
Обновляет отображение выражения.

##### `updateResult(result)`
Обновляет отображение результата.

##### `clear()`
Очищает дисплей.

### Класс `ModeManager`
Управление режимами калькулятора.

#### Методы

##### `setMode(mode)`
Переключает режим калькулятора.
- **Параметры**: `mode` (string) - 'basic', 'scientific', 'graphing', 'statistics'

##### `getCurrentMode()`
Возвращает текущий режим.
- **Возвращает**: string

### Класс `TabManager`
Управление вкладками внутри режимов.

#### Методы

##### `switchTab(tabName, event)`
Переключает активную вкладку.
- **Параметры**:
  - `tabName` (string) - имя вкладки
  - `event` (Event) - событие клика

##### `onTabChange(callback)`
Регистрирует обработчик изменения вкладки.

### Класс `InputHandler`
Обработка пользовательского ввода.

#### Методы

##### `setInputDisabled(disabled)`
Включает/отключает обработку ввода.

### Класс `DataListManager`
Управление списками данных (L1-L6).

#### Методы

##### `setList(name, data)`
Устанавливает данные в указанный список.
- **Параметры**:
  - `name` (string) - имя списка ('L1'-'L6')
  - `data` (Array<number>) - массив чисел

##### `getList(name)`
Получает данные из списка.
- **Возвращает**: Array<number>

##### `clearList(name)`
Очищает указанный список.

##### `getListsState()`
Получает состояние всех списков.

### Класс `NotificationManager`
Система уведомлений.

#### Методы

##### `showSuccess(message)`
Показывает успешное уведомление.

##### `showError(message)`
Показывает уведомление об ошибке.

##### `showInfo(message)`
Показывает информационное уведомление.

### Класс `FormHandler`
Обработка форм ввода данных.

#### Методы

##### `setFormHandler(formId, callback)`
Регистрирует обработчик для формы.

### Класс `ResizeHandler`
Обработка изменения размера окна.

#### Методы

##### `onResize(callback)`
Регистрирует обработчик изменения размера.

## Additional Modules

### Класс `Matrix` (scientific.js)
Операции с матрицами.

#### Конструктор
```javascript
const matrix = new Matrix([[1, 2], [3, 4]]);
```

#### Методы

##### `add(otherMatrix)`
Сложение матриц.

##### `subtract(otherMatrix)`
Вычитание матриц.

##### `multiply(otherMatrix)`
Умножение матриц.

##### `transpose()`
Транспонирование матрицы.

##### `determinant()`
Вычисление определителя.

##### `inverse()`
Вычисление обратной матрицы.

### Класс `FinancialFunctions` (scientific.js)
Финансовые расчеты.

#### Статические методы

##### `compoundInterest(principal, rate, time, n = 1)`
Сложные проценты.
- **Параметры**:
  - `principal` (number) - начальная сумма
  - `rate` (number) - процентная ставка
  - `time` (number) - период в годах
  - `n` (number) - количество начислений в год
- **Возвращает**: number - итоговая сумма

```javascript
FinancialFunctions.compoundInterest(1000, 0.05, 10, 12); // ~1647.01
```

##### `presentValue(futureValue, rate, periods)`
Приведенная стоимость.

##### `futureValue(presentValue, rate, periods)`
Будущая стоимость.

##### `annuity(payment, rate, periods)`
Расчет аннуитета.

##### `amortization(principal, rate, periods)`
Амортизация кредита.

### Класс `UnitConverter` (scientific.js)
Конвертация единиц измерения.

#### Статические методы

##### `convert(value, fromUnit, toUnit, category)`
Конвертирует значение из одной единицы в другую.
- **Параметры**:
  - `value` (number) - значение для конвертации
  - `fromUnit` (string) - исходная единица
  - `toUnit` (string) - целевая единица
  - `category` (string) - категория ('length', 'weight', 'temperature', 'volume', 'time', 'speed')

```javascript
UnitConverter.convert(100, 'cm', 'm', 'length'); // 1
UnitConverter.convert(32, 'F', 'C', 'temperature'); // 0
```

##### Поддерживаемые категории:
- **length**: m, km, cm, mm, mile, yard, foot, inch
- **weight**: kg, g, mg, ton, pound, ounce
- **temperature**: C, F, K
- **volume**: L, mL, gallon, quart, pint, cup
- **time**: s, min, hour, day, week, year
- **speed**: m/s, km/h, mph, knot

### Класс `ProbabilityDistributions` (scientific.js)
Распределения вероятностей.

#### Статические методы

##### `normalPDF(x, mu = 0, sigma = 1)`
Плотность вероятности нормального распределения.

##### `normalCDF(x, mu = 0, sigma = 1)`
Функция распределения нормального распределения.

##### `binomialPMF(k, n, p)`
Вероятностная масса биномиального распределения.

##### `binomialCDF(k, n, p)`
Функция распределения биномиального распределения.

##### `poissonPMF(k, lambda)`
Вероятностная масса распределения Пуассона.

##### `poissonCDF(k, lambda)`
Функция распределения Пуассона.

##### `exponentialPDF(x, lambda)`
Плотность вероятности экспоненциального распределения.

##### `exponentialCDF(x, lambda)`
Функция распределения экспоненциального распределения.

```javascript
// Нормальное распределение
ProbabilityDistributions.normalPDF(0, 0, 1); // ~0.3989
ProbabilityDistributions.normalCDF(1.96, 0, 1); // ~0.975

// Биномиальное распределение
ProbabilityDistributions.binomialPMF(3, 10, 0.3); // ~0.2668

// Пуассона
ProbabilityDistributions.poissonPMF(2, 3); // ~0.224
```

### Класс `StatisticalTests` (scientific.js)
Статистические тесты.

#### Статические методы

##### `tTest(sample, mu = 0, alternative = 'two-sided')`
Одновыборочный t-тест.
- **Возвращает**: {statistic: number, pValue: number, df: number}

##### `tTestTwoSample(sample1, sample2, equalVariance = true)`
Двухвыборочный t-тест.

##### `zTest(sample, mu, sigma)`
z-тест для известной дисперсии.

##### `chiSquareTest(observed, expected)`
Тест хи-квадрат.

```javascript
const data = [12, 15, 18, 20, 22, 25];
const result = StatisticalTests.tTest(data, 15);
console.log(`t-статистика: ${result.statistic}`);
console.log(`p-значение: ${result.pValue}`);
```

## Utilities

### Функции из utils.js

#### `formatNumber(num, precision = 10)`
Форматирует число для отображения.
- **Параметры**:
  - `num` (number) - число для форматирования
  - `precision` (number) - точность (количество значащих цифр)
- **Возвращает**: string

```javascript
formatNumber(3.14159265359); // "3.141592654"
formatNumber(1000000); // "1,000,000"
```

#### `isValidNumber(str)`
Проверяет, является ли строка корректным числом.
- **Параметры**: `str` (string) - строка для проверки
- **Возвращает**: boolean

#### `factorial(n)`
Вычисляет факториал числа.
- **Параметры**: `n` (number) - число
- **Возвращает**: number

```javascript
factorial(5); // 120
```

#### `combination(n, r)`
Вычисляет биномиальный коэффициент C(n,r).

#### `permutation(n, r)`
Вычисляет размещения P(n,r).

#### `parseNumberArray(str)`
Парсит строку чисел в массив.
- **Параметры**: `str` (string) - строка с числами, разделенными запятыми или пробелами
- **Возвращает**: Array<number>

```javascript
parseNumberArray("1, 2, 3, 4, 5"); // [1, 2, 3, 4, 5]
parseNumberArray("1 2 3 4 5"); // [1, 2, 3, 4, 5]
```

#### `debounce(func, delay)`
Создает debounced версию функции.
- **Параметры**:
  - `func` (Function) - функция для debounce
  - `delay` (number) - задержка в миллисекундах
- **Возвращает**: Function

```javascript
const debouncedFunction = debounce(() => {
    console.log('Выполнено!');
}, 300);
```

## События

### Пользовательские события

Калькулятор генерирует пользовательские события для интеграции:

#### `calculatorResult`
Срабатывает при получении результата вычисления.
```javascript
window.addEventListener('calculatorResult', (event) => {
    console.log('Результат:', event.detail.result);
    console.log('Выражение:', event.detail.expression);
});
```

#### `modeChanged`
Срабатывает при смене режима калькулятора.
```javascript
window.addEventListener('modeChanged', (event) => {
    console.log('Новый режим:', event.detail.mode);
});
```

#### `graphPlotted`
Срабатывает при построении графика.
```javascript
window.addEventListener('graphPlotted', (event) => {
    console.log('Функция:', event.detail.function);
    console.log('Цвет:', event.detail.color);
});
```

## Обработка ошибок

Все методы API возвращают результаты в консистентном формате:

```javascript
// Успешный результат
{
    success: true,
    result: "42",
    error: null
}

// Ошибка
{
    success: false,
    result: null,
    error: "Division by zero"
}
```

## Примеры использования

### Простое вычисление
```javascript
const calc = new Calculator();
calc.appendToExpression('2 + 2');
const result = calc.calculate();
console.log(result); // "4"
```

### Построение графика функции
```javascript
const renderer = new GraphRenderer('my-canvas');
renderer.plotFunction('sin(x) + cos(x)', 'blue');
renderer.setRange(-10, 10, -2, 2);
```

### Статистический анализ
```javascript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const stats = new DescriptiveStatistics(data);

console.log('Среднее:', stats.mean()); // 5.5
console.log('Медиана:', stats.median()); // 5.5
console.log('Стандартное отклонение:', stats.standardDeviation());

// Регрессионный анализ
const points = [{x: 1, y: 2}, {x: 2, y: 4}, {x: 3, y: 6}];
const regression = RegressionAnalysis.linear(points);
console.log('Уравнение:', regression.equation); // "y = 2x + 0"
```

## Сводка по классам

### Основные модули (9):

**calculator.js** - Базовые вычисления
- `Calculator` - основной класс калькулятора

**scientific.js** - Научные функции
- `TrigonometricFunctions` - тригонометрия
- `LogarithmicFunctions` - логарифмы и степени
- `ProbabilityDistributions` - распределения вероятностей
- `StatisticalTests` - статистические тесты
- `FinancialFunctions` - финансовые функции
- `Matrix` - матричные операции
- `UnitConverter` - конвертация единиц

**graphing.js** - Построение графиков
- `GraphRenderer` - рендеринг графиков
- `FunctionTable` - таблицы функций

**statistics.js** - Статистический анализ
- `DescriptiveStatistics` - описательная статистика
- `RegressionAnalysis` - регрессионный анализ
- `TwoVariableStatistics` - двумерная статистика
- `StatisticsVisualizer` - визуализация

**ui.js** - Управление интерфейсом (8 менеджеров)
- `DisplayManager` - управление дисплеем
- `ModeManager` - управление режимами
- `TabManager` - управление вкладками
- `InputHandler` - обработка ввода
- `DataListManager` - управление списками данных
- `NotificationManager` - система уведомлений
- `FormHandler` - обработка форм
- `ResizeHandler` - адаптивность

**app.js** - Главное приложение
- `CalculatorApp` - основной класс приложения

**utils.js** - Вспомогательные функции
- 15+ утилитарных функций

**constants.js** - Константы и конфигурация
- Математические константы
- Конфигурация калькулятора
- Цветовые схемы
- Привязки клавиш

**component-loader.js** - Динамическая загрузка
- `ComponentLoader` - загрузчик HTML компонентов

### Общее количество:
- **Классов**: 20+
- **Функций**: 150+
- **Строк кода**: ~3900
- **Модулей**: 9