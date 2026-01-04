# Performance Analysis Report

## Summary

This report documents **20 performance issues** identified in the calculator codebase. Issues are categorized by severity and include specific recommendations for remediation.

| Severity | Count |
|----------|-------|
| HIGH     | 5     |
| MEDIUM   | 12    |
| LOW      | 3     |

---

## HIGH Severity Issues

### 1. Use of `eval()` for Expression Evaluation

**Files:** `src/scripts/calculator.js:40,73`

**Description:** The calculator uses `eval()` to evaluate mathematical expressions, which is both a security vulnerability and a performance anti-pattern.

```javascript
// calculator.js:40
const result = eval(preparedExpression);

// calculator.js:73
const result = eval(preparedExpression);
```

**Impact:**
- `eval()` must parse and compile code at runtime (slow)
- Security risk: potential code injection attacks
- Cannot be optimized by JavaScript engines

**Recommendation:** Use `Function` constructor or a proper expression parser library (e.g., math.js, expr-eval).

```javascript
// Better approach
const func = new Function('return ' + preparedExpression);
const result = func();
```

---

### 2. Inefficient Graph Rendering - O(width) Pixel-by-Pixel Plotting

**File:** `src/scripts/graphing.js:250-270`

**Description:** The `plotFunctions()` method iterates through every pixel on the canvas width and evaluates functions for each pixel.

```javascript
for (let px = 0; px < width; px++) {
    const x = (px - centerX) / this.scale;
    const y = func(x);  // Function evaluated for EVERY pixel
    // ... drawing code
}
```

**Impact:**
- For a 1000px canvas: 1000+ function evaluations per render
- With multiple functions and frequent redraws (zoom, pan), performance degrades significantly
- No use of `requestAnimationFrame` batching

**Recommendation:**
- Use adaptive sampling (evaluate fewer points, interpolate between them)
- Implement path caching for unchanged functions
- Batch updates using `requestAnimationFrame`

---

### 3. Event Listeners Attached in Loops (N+1 Pattern)

**Files:**
- `src/scripts/app.js:375-382, 387-404`
- `src/scripts/ui.js:242-262`

**Description:** Individual event listeners are attached to each button in loops instead of using event delegation.

```javascript
// app.js:375-382
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const mode = e.target.dataset.mode;
        if (mode) {
            this.modeManager.setMode(mode);
        }
    });
});

// ui.js:242-246
document.querySelectorAll('.btn-number').forEach(btn => {
    btn.addEventListener('click', (e) => {
        this.handleInput(e.target.textContent);
    });
});
```

**Impact:**
- Memory overhead: one listener per button (10+ number buttons, operators, functions)
- More GC pressure
- Harder to manage dynamic elements

**Recommendation:** Use event delegation on parent container:

```javascript
document.querySelector('.calculator-buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-number');
    if (btn) {
        this.handleInput(btn.textContent);
    }
});
```

---

### 4. DOM Thrashing - Repeated appendChild in Loop

**File:** `src/scripts/app.js:498-506`

**Description:** Table rows are appended one by one, causing multiple DOM reflows.

```javascript
tableBody.innerHTML = '';  // DOM reflow
tableData.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.x.toFixed(4)}</td>...`;
    tableBody.appendChild(tr);  // DOM reflow on each iteration
});
```

**Impact:**
- Each `appendChild` triggers a DOM reflow
- Performance degrades linearly with data size

**Recommendation:** Use `DocumentFragment` for batch insertion:

```javascript
const fragment = document.createDocumentFragment();
tableData.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.x.toFixed(4)}</td>...`;
    fragment.appendChild(tr);
});
tableBody.innerHTML = '';
tableBody.appendChild(fragment);  // Single reflow
```

---

### 5. Excessive Regex Replacements in Expression Preparation

**File:** `src/scripts/utils.js:59-95`

**Description:** Expression preparation uses 15+ sequential regex replacements on every calculation.

```javascript
let prepared = expr
    .replace(/sin/g, 'Math.sin')
    .replace(/cos/g, 'Math.cos')
    .replace(/tan/g, 'Math.tan')
    // ... 15+ more replacements
```

**Impact:**
- Each `.replace()` creates a new string
- Runs on every single calculation
- No caching of previously prepared expressions

**Recommendation:**
- Use a single-pass tokenizer
- Cache compiled expressions
- Use a Map for function name lookups

---

## MEDIUM Severity Issues

### 6. Multiple `Math.max/min` with Spread on Large Arrays

**File:** `src/scripts/statistics.js:527-528`

```javascript
const min = Math.min(...data);  // Spreads entire array
const max = Math.max(...data);  // Another pass
```

**Impact:**
- Stack overflow risk for large arrays (>100k elements)
- Two separate passes through data

**Recommendation:** Single pass to find both min and max:

```javascript
let min = data[0], max = data[0];
for (let i = 1; i < data.length; i++) {
    if (data[i] < min) min = data[i];
    if (data[i] > max) max = data[i];
}
```

---

### 7. Multiple Data Passes in Statistical Calculations

**File:** `src/scripts/statistics.js:153-180`

**Description:** Skewness and kurtosis calculations call `mean()` and `standardDeviation()` inside, causing 3+ passes through data.

```javascript
skewness() {
    const meanVal = this.mean();              // Pass 1
    const stdDev = this.standardDeviation();  // Pass 2 (which also calls mean())
    const sumCubedDeviations = this.data.reduce(...);  // Pass 3
}
```

**Impact:** For n data points, O(3n) or worse operations when O(n) is possible.

**Recommendation:** Combine calculations into single pass or pre-cache intermediate values.

---

### 8. Missing Memoization in Gamma Function

**File:** `src/scripts/utils.js:211-238`

```javascript
gamma(z) {
    if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));  // Recursive
    }
    // ...
}
```

**Impact:** Recursive calls without caching; same values computed repeatedly.

**Recommendation:** Add memoization cache for computed values.

---

### 9. Event Listener Memory Leak - Resize Handler

**File:** `src/scripts/effects.js:162`

```javascript
window.addEventListener('resize', () => this.resize());
```

**Impact:**
- No corresponding `removeEventListener`
- Listener persists even if confetti manager is no longer needed

**Recommendation:** Store listener reference and clean up in a `destroy()` method.

---

### 10. Inefficient Histogram Max Count Calculation

**File:** `src/scripts/statistics.js:531-539`

```javascript
const binCounts = Array(bins).fill(0);
data.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
    binCounts[binIndex]++;
});
const maxCount = Math.max(...binCounts);  // Extra pass
```

**Recommendation:** Track `maxCount` during bin population loop.

---

### 11. DOM Queries on Every Keypress

**File:** `src/scripts/effects.js:462-492`

```javascript
handleKeyDown(e) {
    const selectorList = selectors.split(', ');
    for (const selector of selectorList) {
        const btn = document.querySelector(selector);  // Query per keypress
        if (btn) {
            btn.classList.add('keyboard-active');
            break;
        }
    }
}
```

**Recommendation:** Cache button references in a Map during initialization.

---

### 12. Multiple DOM Queries for i18n Translation Updates

**File:** `src/scripts/i18n.js:157-190`

```javascript
document.querySelectorAll('[data-i18n]').forEach(...);        // Query 1
document.querySelectorAll('[data-i18n-placeholder]').forEach(...);  // Query 2
document.querySelectorAll('[data-i18n-title]').forEach(...);        // Query 3
document.querySelectorAll('[data-i18n-html]').forEach(...);         // Query 4
```

**Recommendation:** Single DOM traversal, check all attributes on each element.

---

### 13. Fixed 100 Iterations in Series Calculations

**File:** `src/scripts/scientific.js:207-227`

```javascript
for (let k = 0; k < 100; k++) {  // Always 100 iterations
    const term = ...;
    sum += term;
    if (Math.abs(term) < 1e-10) break;  // Early termination exists
}
```

**Impact:** Could converge in far fewer iterations.

**Recommendation:** Better convergence detection or adaptive iteration count.

---

### 14. New Object Created on Every Touch Event

**File:** `src/scripts/graphing.js:90-98`

```javascript
this.canvas.addEventListener('touchstart', (e) => {
    this.touchStartData = { dragStartX, dragStartY };  // New object each touch
});
```

**Recommendation:** Reuse single object or use primitive instance variables.

---

### 15. innerHTML with Array Map in Loop

**File:** `src/scripts/ui.js:420-427`

```javascript
listElement.innerHTML = this.lists[listName].map(value =>
    `<div class="list-value">${formatNumber(value)}</div>`
).join('');
```

**Impact:** Creates HTML strings and replaces entire innerHTML.

**Recommendation:** Use DocumentFragment for batch DOM operations.

---

### 16. Regex Constructor in Loop for i18n Parameters

**File:** `src/scripts/i18n.js:100-102`

```javascript
for (const [param, val] of Object.entries(params)) {
    result = result.replace(new RegExp(`{${param}}`, 'g'), val);
}
```

**Recommendation:** Use simple string replacement without regex when possible.

---

### 17. Duplicated State Management in Effect Toggles

**File:** `src/scripts/effects.js:806-829`

```javascript
document.getElementById('sound-toggle')?.addEventListener('change', (e) => {
    this.sound.enabled = e.target.checked;
    localStorage.setItem('soundEnabled', e.target.checked);
});
```

**Impact:** Duplicates state management logic across multiple toggles.

**Recommendation:** Use shared state management pattern or single source of truth.

---

## LOW Severity Issues

### 18. Theoretical Infinite Loop Risk

**File:** `src/scripts/utils.js:154-156`

```javascript
let u = 0, v = 0;
while (u === 0) u = Math.random();
while (v === 0) v = Math.random();
```

**Impact:** Theoretically could infinite loop (1 in 2^53 chance), blocks UI thread.

**Recommendation:** Add maximum iteration guard or use conditional assignment.

---

### 19. No Early Return in Mode Button Handler

**File:** `src/scripts/app.js:375-382`

The loop continues checking buttons even after finding a match.

---

### 20. Potential Memory Leak in Ripple Effects

**File:** `src/scripts/effects.js:589, 617`

```javascript
ripple.addEventListener('animationend', () => { ripple.remove(); });
```

**Impact:** Event listeners on ephemeral elements - low risk as element is removed.

---

## Recommendations Summary

### Immediate Actions (High Priority)

1. **Replace `eval()` with `Function` constructor or expression parser**
2. **Implement event delegation for button listeners**
3. **Use DocumentFragment for batch DOM updates**
4. **Add adaptive sampling for graph rendering**

### Short-term Improvements (Medium Priority)

1. Cache expression preparations
2. Add memoization to recursive functions
3. Single-pass statistical calculations
4. Cache DOM references for keyboard highlighting

### Long-term Optimizations (Low Priority)

1. Implement virtual scrolling for large data tables
2. Use Web Workers for heavy calculations
3. Add performance monitoring hooks
4. Consider using a reactive framework for state management

---

## Testing Recommendations

1. **Profile with Chrome DevTools** - Use Performance tab to identify actual bottlenecks
2. **Test with large datasets** - Statistics with 10k+ data points
3. **Test rapid graph interactions** - Zoom/pan quickly to test rendering
4. **Mobile testing** - Touch events and lower-powered devices

---

*Generated: 2026-01-04*
