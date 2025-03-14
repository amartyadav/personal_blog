// i18n.js - Handles language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load saved language preference from localStorage, or default to English
    let currentLang = localStorage.getItem('preferredLanguage') || 'en';
    
    // Initialize the page with the saved/default language
    setLanguage(currentLang);
    
    // Get all language selector buttons
    const langButtons = document.querySelectorAll('.language-btn');
    
    // Add click event listeners to each button
    langButtons.forEach(button => {
        // Set active class on the current language button
        if (button.getAttribute('data-lang') === currentLang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
        
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Remove active class from all buttons
            langButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set the new language
            setLanguage(lang);
            
            // Store the language preference in localStorage
            localStorage.setItem('preferredLanguage', lang);
        });
    });
});

// Function to update all text elements with the selected language
function setLanguage(lang) {
    // Check if the language exists in our translations
    if (!translations[lang]) {
        console.error(`Translation for language "${lang}" not found!`);
        return;
    }
    
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    // Update each element with the translated text
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (translations[lang][key]) {
            // Update text content with the translation
            element.textContent = translations[lang][key];
        } else {
            console.warn(`Translation key "${key}" not found for language "${lang}"`);
        }
    });
    
    // Update the lang attribute on the html tag
    document.documentElement.lang = lang;
}