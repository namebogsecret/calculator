/**
 * Effects Module - Sound, Confetti, Haptics, Themes & Animations
 * Adds "wow-factor" to the calculator experience
 */

// ============================================
// SOUND MANAGER - Web Audio API based sounds
// ============================================
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.volume = parseFloat(localStorage.getItem('soundVolume')) || 0.3;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    // Ensure audio context is running (needed after user interaction)
    async ensureContext() {
        if (!this.audioContext) this.init();
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    // Generate a click sound
    playClick() {
        if (!this.enabled) return;
        this.ensureContext();
        this.playTone(800, 0.05, 'sine', 0.15);
    }

    // Generate a number press sound
    playNumber() {
        if (!this.enabled) return;
        this.ensureContext();
        this.playTone(600, 0.04, 'sine', 0.12);
    }

    // Generate an operator press sound
    playOperator() {
        if (!this.enabled) return;
        this.ensureContext();
        this.playTone(400, 0.06, 'triangle', 0.18);
    }

    // Generate a success/equals sound
    playSuccess() {
        if (!this.enabled) return;
        this.ensureContext();
        // Play a pleasant chord
        this.playTone(523.25, 0.15, 'sine', 0.2); // C5
        setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.15), 50); // E5
        setTimeout(() => this.playTone(783.99, 0.2, 'sine', 0.12), 100); // G5
    }

    // Generate an error sound
    playError() {
        if (!this.enabled) return;
        this.ensureContext();
        this.playTone(200, 0.2, 'sawtooth', 0.15);
    }

    // Generate a clear sound
    playClear() {
        if (!this.enabled) return;
        this.ensureContext();
        this.playTone(300, 0.1, 'triangle', 0.1);
    }

    // Special sound for special results (like π, 42, 777, etc.)
    playSpecial() {
        if (!this.enabled) return;
        this.ensureContext();
        // Magical ascending arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.1, 'sine', 0.15 - i * 0.02), i * 60);
        });
    }

    // Core tone generation
    playTone(frequency, duration, type = 'sine', volume = 0.2) {
        if (!this.audioContext || !this.enabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        const now = this.audioContext.currentTime;
        const adjustedVolume = volume * this.volume;

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(adjustedVolume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        if (this.enabled) {
            this.playClick();
        }
        return this.enabled;
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        localStorage.setItem('soundVolume', this.volume);
    }

    isEnabled() {
        return this.enabled;
    }
}

// ============================================
// CONFETTI MANAGER - Canvas-based confetti
// ============================================
class ConfettiManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.enabled = localStorage.getItem('confettiEnabled') !== 'false';
    }

    init() {
        // Create canvas overlay
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Create confetti explosion
    burst(x, y, count = 50) {
        if (!this.enabled) return;
        if (!this.canvas) this.init();

        const colors = [
            '#4F46E5', '#06B6D4', '#EC4899', '#10B981',
            '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'
        ];

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const velocity = 8 + Math.random() * 8;

            this.particles.push({
                x: x || this.canvas.width / 2,
                y: y || this.canvas.height / 2,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 4 + Math.random() * 6,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                shape: Math.random() > 0.5 ? 'rect' : 'circle',
                life: 1,
                decay: 0.015 + Math.random() * 0.01
            });
        }

        if (!this.animationId) {
            this.animate();
        }
    }

    // Rain confetti from top
    rain(duration = 3000) {
        if (!this.enabled) return;
        if (!this.canvas) this.init();

        const colors = [
            '#4F46E5', '#06B6D4', '#EC4899', '#10B981',
            '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'
        ];

        const startTime = Date.now();
        const createParticle = () => {
            if (Date.now() - startTime > duration) return;

            for (let i = 0; i < 3; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: -20,
                    vx: (Math.random() - 0.5) * 2,
                    vy: 3 + Math.random() * 3,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: 5 + Math.random() * 5,
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 5,
                    shape: Math.random() > 0.5 ? 'rect' : 'circle',
                    life: 1,
                    decay: 0.005
                });
            }
            requestAnimationFrame(createParticle);
        };

        createParticle();
        if (!this.animationId) {
            this.animate();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update physics
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3; // Gravity
            p.vx *= 0.99; // Air resistance
            p.rotation += p.rotationSpeed;
            p.life -= p.decay;

            // Draw particle
            if (p.life > 0) {
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rotation * Math.PI) / 180);
                this.ctx.globalAlpha = p.life;
                this.ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                this.ctx.restore();
            } else {
                this.particles.splice(i, 1);
            }
        }

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('confettiEnabled', this.enabled);
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }
}

// ============================================
// COUNTER ANIMATION - Slot machine effect
// ============================================
class CounterAnimation {
    constructor() {
        this.enabled = localStorage.getItem('counterAnimEnabled') !== 'false';
    }

    // Animate number from current to target
    animate(element, targetValue, duration = 500) {
        if (!this.enabled || !element) return;

        const targetNum = parseFloat(targetValue);
        if (isNaN(targetNum)) {
            element.textContent = targetValue;
            return;
        }

        const startValue = parseFloat(element.textContent) || 0;
        const startTime = performance.now();
        const isDecimal = targetValue.includes('.') || Math.abs(targetNum) < 1;
        const decimals = isDecimal ? (targetValue.split('.')[1]?.length || 2) : 0;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-expo)
            const easeProgress = 1 - Math.pow(1 - progress, 4);

            const currentValue = startValue + (targetNum - startValue) * easeProgress;

            if (decimals > 0) {
                element.textContent = currentValue.toFixed(decimals);
            } else {
                element.textContent = Math.round(currentValue).toLocaleString();
            }

            // Add visual effect during animation
            if (progress < 1) {
                element.style.transform = `scale(${1 + (1 - progress) * 0.05})`;
                element.style.filter = `blur(${(1 - progress) * 0.5}px)`;
                requestAnimationFrame(step);
            } else {
                element.textContent = targetValue;
                element.style.transform = '';
                element.style.filter = '';
                // Pop effect at the end
                element.classList.add('counter-pop');
                setTimeout(() => element.classList.remove('counter-pop'), 200);
            }
        };

        requestAnimationFrame(step);
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('counterAnimEnabled', this.enabled);
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }
}

// ============================================
// HAPTIC MANAGER - Vibration feedback
// ============================================
class HapticManager {
    constructor() {
        this.enabled = localStorage.getItem('hapticEnabled') !== 'false';
        this.supported = 'vibrate' in navigator;
    }

    // Short tap feedback
    tap() {
        if (!this.enabled || !this.supported) return;
        navigator.vibrate(10);
    }

    // Button press feedback
    press() {
        if (!this.enabled || !this.supported) return;
        navigator.vibrate(20);
    }

    // Success feedback
    success() {
        if (!this.enabled || !this.supported) return;
        navigator.vibrate([20, 50, 20]);
    }

    // Error feedback
    error() {
        if (!this.enabled || !this.supported) return;
        navigator.vibrate([50, 30, 50, 30, 50]);
    }

    // Special result feedback
    special() {
        if (!this.enabled || !this.supported) return;
        navigator.vibrate([10, 20, 10, 20, 10, 20, 30]);
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('hapticEnabled', this.enabled);
        if (this.enabled && this.supported) {
            this.tap();
        }
        return this.enabled;
    }

    isEnabled() {
        return this.enabled && this.supported;
    }

    isSupported() {
        return this.supported;
    }
}

// ============================================
// KEYBOARD HIGHLIGHTER - Visual key feedback
// ============================================
class KeyboardHighlighter {
    constructor() {
        this.enabled = true;
        this.keyMap = {
            '0': '[data-value="0"]',
            '1': '[data-value="1"]',
            '2': '[data-value="2"]',
            '3': '[data-value="3"]',
            '4': '[data-value="4"]',
            '5': '[data-value="5"]',
            '6': '[data-value="6"]',
            '7': '[data-value="7"]',
            '8': '[data-value="8"]',
            '9': '[data-value="9"]',
            '+': '[data-value="+"]',
            '-': '[data-value="-"]',
            '*': '[data-value="×"], [data-value="*"]',
            '/': '[data-value="÷"], [data-value="/"]',
            '.': '[data-value="."]',
            ',': '[data-value="."]',
            'Enter': '[data-value="="], .btn-equals',
            '=': '[data-value="="], .btn-equals',
            'Escape': '[onclick*="clearDisplay"], .btn-clear',
            'c': '[onclick*="clearDisplay"], .btn-clear',
            'C': '[onclick*="clearDisplay"], .btn-clear',
            'Backspace': '[onclick*="deleteLastChar"], .btn-delete',
            '(': '[data-value="("]',
            ')': '[data-value=")"]',
            '%': '[data-value="%"]',
            '^': '[data-value="^"]',
        };
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        if (!this.enabled) return;

        const selectors = this.keyMap[e.key];
        if (!selectors) return;

        const selectorList = selectors.split(', ');
        for (const selector of selectorList) {
            const btn = document.querySelector(selector);
            if (btn) {
                btn.classList.add('keyboard-active');
                break;
            }
        }
    }

    handleKeyUp(e) {
        if (!this.enabled) return;

        const selectors = this.keyMap[e.key];
        if (!selectors) return;

        const selectorList = selectors.split(', ');
        for (const selector of selectorList) {
            const btn = document.querySelector(selector);
            if (btn) {
                btn.classList.remove('keyboard-active');
                break;
            }
        }
    }

    // Highlight a specific button by value
    highlightButton(value) {
        const btn = document.querySelector(`[data-value="${value}"]`) ||
                    document.querySelector(`button:contains("${value}")`);
        if (btn) {
            btn.classList.add('keyboard-active');
            setTimeout(() => btn.classList.remove('keyboard-active'), 150);
        }
    }
}

// ============================================
// THEME MANAGER - Multi-theme support
// ============================================
class ThemeManager {
    constructor() {
        this.themes = ['dark', 'light', 'neon', 'sunset', 'ocean'];
        this.currentTheme = localStorage.getItem('theme') || 'dark';
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeSelector();
    }

    applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        this.currentTheme = themeName;
        localStorage.setItem('theme', themeName);

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: themeName }}));
    }

    nextTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.applyTheme(this.themes[nextIndex]);
        return this.currentTheme;
    }

    setTheme(themeName) {
        if (this.themes.includes(themeName)) {
            this.applyTheme(themeName);
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    createThemeSelector() {
        // Theme selector will be created in the UI
    }

    getThemeIcon() {
        const icons = {
            'dark': '🌙',
            'light': '☀️',
            'neon': '💜',
            'sunset': '🌅',
            'ocean': '🌊'
        };
        return icons[this.currentTheme] || '🎨';
    }
}

// ============================================
// PARTICLE EFFECTS - Button press particles
// ============================================
class ParticleEffects {
    constructor() {
        this.enabled = localStorage.getItem('particlesEnabled') !== 'false';
    }

    createRipple(element, event) {
        if (!this.enabled) return;

        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;

        element.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    createSparkle(element) {
        if (!this.enabled) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';

            const angle = (Math.PI * 2 * i) / 6;
            const distance = 20 + Math.random() * 15;

            sparkle.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                --tx: ${Math.cos(angle) * distance}px;
                --ty: ${Math.sin(angle) * distance}px;
            `;

            document.body.appendChild(sparkle);

            sparkle.addEventListener('animationend', () => {
                sparkle.remove();
            });
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('particlesEnabled', this.enabled);
        return this.enabled;
    }

    isEnabled() {
        return this.enabled;
    }
}

// ============================================
// EFFECTS CONTROLLER - Main coordinator
// ============================================
class EffectsController {
    constructor() {
        this.sound = new SoundManager();
        this.confetti = new ConfettiManager();
        this.counter = new CounterAnimation();
        this.haptic = new HapticManager();
        this.keyboard = new KeyboardHighlighter();
        this.theme = new ThemeManager();
        this.particles = new ParticleEffects();

        // Special numbers that trigger extra effects
        this.specialNumbers = [
            42, 69, 420, 666, 777, 1337,
            Math.PI, Math.E,
            3.14159, 2.71828,
            123456789, 987654321
        ];
    }

    init() {
        this.sound.init();
        this.confetti.init();
        this.keyboard.init();
        this.theme.init();
        this.setupButtonListeners();
        this.createSettingsPanel();

        console.log('Effects system initialized');
    }

    setupButtonListeners() {
        // Delegate button clicks for all calculator buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button, .btn');
            if (!btn) return;

            // Create ripple effect
            this.particles.createRipple(btn, e);

            // Determine button type and play appropriate sound
            const value = btn.dataset.value || btn.textContent.trim();

            if (/^[0-9]$/.test(value)) {
                this.sound.playNumber();
                this.haptic.tap();
            } else if (['+', '-', '×', '÷', '*', '/', '^', '%'].includes(value)) {
                this.sound.playOperator();
                this.haptic.press();
            } else if (value === '=' || btn.classList.contains('btn-equals')) {
                // Equals will be handled separately after calculation
            } else if (value === 'C' || btn.onclick?.toString().includes('clear')) {
                this.sound.playClear();
                this.haptic.tap();
            } else {
                this.sound.playClick();
                this.haptic.tap();
            }
        });

        // Touch events for better mobile experience
        document.addEventListener('touchstart', (e) => {
            const btn = e.target.closest('button, .btn');
            if (btn) {
                btn.classList.add('touch-active');
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const btn = e.target.closest('button, .btn');
            if (btn) {
                btn.classList.remove('touch-active');
            }
        }, { passive: true });
    }

    // Called when calculation is complete
    onCalculationComplete(result, isSuccess = true) {
        if (isSuccess) {
            this.sound.playSuccess();
            this.haptic.success();

            // Check for special numbers
            const numResult = parseFloat(result);
            const isSpecial = this.specialNumbers.some(n =>
                Math.abs(numResult - n) < 0.0001 ||
                result.toString().includes('3.14159') ||
                result.toString().includes('2.71828')
            );

            if (isSpecial) {
                this.sound.playSpecial();
                this.haptic.special();
                this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
                this.particles.createSparkle(document.getElementById('result'));
            }

            // Animate the result counter
            const resultElement = document.getElementById('result');
            if (resultElement && this.counter.isEnabled()) {
                this.counter.animate(resultElement, result.toString());
            }
        } else {
            this.sound.playError();
            this.haptic.error();
        }
    }

    // Trigger celebration for big moments
    celebrate() {
        this.confetti.rain(2000);
        this.sound.playSpecial();
        this.haptic.special();
    }

    createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'effects-settings';
        panel.className = 'effects-settings';
        panel.innerHTML = `
            <button class="effects-toggle-btn" onclick="window.effectsController.togglePanel()">
                <span class="settings-icon">⚙️</span>
            </button>
            <div class="effects-panel hidden">
                <h3>Эффекты</h3>
                <div class="effect-option">
                    <label>
                        <input type="checkbox" id="sound-toggle" ${this.sound.isEnabled() ? 'checked' : ''}>
                        <span>🔊 Звуки</span>
                    </label>
                </div>
                <div class="effect-option">
                    <label>
                        <input type="checkbox" id="confetti-toggle" ${this.confetti.isEnabled() ? 'checked' : ''}>
                        <span>🎉 Конфетти</span>
                    </label>
                </div>
                <div class="effect-option">
                    <label>
                        <input type="checkbox" id="counter-toggle" ${this.counter.isEnabled() ? 'checked' : ''}>
                        <span>🔢 Анимация цифр</span>
                    </label>
                </div>
                <div class="effect-option ${!this.haptic.isSupported() ? 'disabled' : ''}">
                    <label>
                        <input type="checkbox" id="haptic-toggle" ${this.haptic.isEnabled() ? 'checked' : ''} ${!this.haptic.isSupported() ? 'disabled' : ''}>
                        <span>📳 Вибрация</span>
                    </label>
                </div>
                <div class="effect-option">
                    <label>
                        <input type="checkbox" id="particles-toggle" ${this.particles.isEnabled() ? 'checked' : ''}>
                        <span>✨ Частицы</span>
                    </label>
                </div>
                <hr>
                <h3>Тема</h3>
                <div class="theme-buttons">
                    <button class="theme-btn" data-theme="dark" title="Тёмная">🌙</button>
                    <button class="theme-btn" data-theme="light" title="Светлая">☀️</button>
                    <button class="theme-btn" data-theme="neon" title="Неон">💜</button>
                    <button class="theme-btn" data-theme="sunset" title="Закат">🌅</button>
                    <button class="theme-btn" data-theme="ocean" title="Океан">🌊</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Setup toggle listeners
        document.getElementById('sound-toggle')?.addEventListener('change', (e) => {
            this.sound.enabled = e.target.checked;
            localStorage.setItem('soundEnabled', e.target.checked);
        });

        document.getElementById('confetti-toggle')?.addEventListener('change', (e) => {
            this.confetti.enabled = e.target.checked;
            localStorage.setItem('confettiEnabled', e.target.checked);
        });

        document.getElementById('counter-toggle')?.addEventListener('change', (e) => {
            this.counter.enabled = e.target.checked;
            localStorage.setItem('counterAnimEnabled', e.target.checked);
        });

        document.getElementById('haptic-toggle')?.addEventListener('change', (e) => {
            this.haptic.enabled = e.target.checked;
            localStorage.setItem('hapticEnabled', e.target.checked);
        });

        document.getElementById('particles-toggle')?.addEventListener('change', (e) => {
            this.particles.enabled = e.target.checked;
            localStorage.setItem('particlesEnabled', e.target.checked);
        });

        // Theme buttons
        panel.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.theme.setTheme(btn.dataset.theme);
                this.updateThemeButtons();
                this.sound.playClick();
            });
        });

        this.updateThemeButtons();
    }

    updateThemeButtons() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.theme.getCurrentTheme());
        });
    }

    togglePanel() {
        const panel = document.querySelector('.effects-panel');
        if (panel) {
            panel.classList.toggle('hidden');
            this.sound.playClick();
        }
    }
}

// Create global instance
const effectsController = new EffectsController();

// Export for module usage
export {
    EffectsController,
    SoundManager,
    ConfettiManager,
    CounterAnimation,
    HapticManager,
    KeyboardHighlighter,
    ThemeManager,
    ParticleEffects,
    effectsController
};
