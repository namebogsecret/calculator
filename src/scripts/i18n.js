/**
 * Internationalization (i18n) module for the calculator application
 * Provides multilingual support with English as the primary language
 */

// Default translations (English)
const defaultTranslations = {};

// Available locales
const availableLocales = ['en', 'ru'];

// Current state
let currentLocale = 'en';
let translations = {};

/**
 * Load translations for a specific locale
 * @param {string} locale - The locale code (e.g., 'en', 'ru')
 * @returns {Promise<object>} - The translations object
 */
async function loadTranslations(locale) {
    try {
        const response = await fetch(`./src/locales/${locale}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load locale: ${locale}`);
        }
        return await response.json();
    } catch (error) {
        console.warn(`Could not load translations for ${locale}:`, error);
        // Fallback to English if available
        if (locale !== 'en') {
            return loadTranslations('en');
        }
        return defaultTranslations;
    }
}

/**
 * Initialize the i18n system
 * @param {string} locale - Initial locale to use
 */
async function initI18n(locale = null) {
    // Determine the locale to use
    if (locale) {
        currentLocale = locale;
    } else {
        // Check localStorage for saved preference
        const savedLocale = localStorage.getItem('calculator-locale');
        if (savedLocale && availableLocales.includes(savedLocale)) {
            currentLocale = savedLocale;
        } else {
            // Detect browser language
            const browserLang = navigator.language.split('-')[0];
            currentLocale = availableLocales.includes(browserLang) ? browserLang : 'en';
        }
    }

    // Load translations
    translations = await loadTranslations(currentLocale);

    // Apply translations to the DOM
    applyTranslations();

    // Update HTML lang attribute
    document.documentElement.lang = currentLocale;

    // Update language selector if exists
    updateLanguageSelector();

    console.log(`i18n initialized with locale: ${currentLocale}`);
}

/**
 * Get a translation by key
 * @param {string} key - The translation key (can be dot-separated for nested keys)
 * @param {object} params - Optional parameters for interpolation
 * @returns {string} - The translated string
 */
function t(key, params = {}) {
    // Navigate to the nested key
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            // Key not found, return the key itself
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }
    }

    if (typeof value !== 'string') {
        return key;
    }

    // Interpolate parameters
    let result = value;
    for (const [param, val] of Object.entries(params)) {
        result = result.replace(new RegExp(`{${param}}`, 'g'), val);
    }

    return result;
}

/**
 * Change the current locale
 * @param {string} locale - The new locale code
 */
async function setLocale(locale) {
    if (!availableLocales.includes(locale)) {
        console.error(`Locale not available: ${locale}`);
        return;
    }

    currentLocale = locale;
    localStorage.setItem('calculator-locale', locale);

    // Reload translations
    translations = await loadTranslations(locale);

    // Apply translations to the DOM
    applyTranslations();

    // Update HTML lang attribute
    document.documentElement.lang = locale;

    // Update language selector
    updateLanguageSelector();

    // Dispatch custom event for components that need to react
    window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale } }));
}

/**
 * Get the current locale
 * @returns {string} - Current locale code
 */
function getLocale() {
    return currentLocale;
}

/**
 * Get available locales
 * @returns {string[]} - Array of available locale codes
 */
function getAvailableLocales() {
    return [...availableLocales];
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        if (translation !== key) {
            element.textContent = translation;
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = t(key);
        if (translation !== key) {
            element.placeholder = translation;
        }
    });

    // Translate titles/tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = t(key);
        if (translation !== key) {
            element.title = translation;
        }
    });

    // Translate innerHTML (for elements with HTML content like <sup>)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        const translation = t(key);
        if (translation !== key) {
            element.innerHTML = translation;
        }
    });

    // Update page title
    const titleKey = 'app.title';
    const title = t(titleKey);
    if (title !== titleKey) {
        document.title = title;
    }
}

/**
 * Update the language selector UI
 */
function updateLanguageSelector() {
    const selector = document.getElementById('languageSelect');
    if (selector) {
        selector.value = currentLocale;
    }

    // Update active state on language buttons if they exist
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const locale = btn.getAttribute('data-locale');
        btn.classList.toggle('active', locale === currentLocale);
    });
}

/**
 * Create a language switcher element
 * @returns {HTMLElement} - The language switcher element
 */
function createLanguageSwitcher() {
    const container = document.createElement('div');
    container.className = 'language-switcher';

    const select = document.createElement('select');
    select.id = 'languageSelect';
    select.className = 'language-select';

    const localeNames = {
        'en': 'English',
        'ru': 'Русский'
    };

    availableLocales.forEach(locale => {
        const option = document.createElement('option');
        option.value = locale;
        option.textContent = localeNames[locale] || locale;
        option.selected = locale === currentLocale;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        setLocale(e.target.value);
    });

    container.appendChild(select);
    return container;
}

// Export functions
export {
    initI18n,
    t,
    setLocale,
    getLocale,
    getAvailableLocales,
    applyTranslations,
    createLanguageSwitcher
};

// Also export as default object for convenience
export default {
    init: initI18n,
    t,
    setLocale,
    getLocale,
    getAvailableLocales,
    applyTranslations,
    createLanguageSwitcher
};
