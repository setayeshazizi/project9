
// --- AUTO CLEAR LOCAL STORAGE ON STARTUP (added by ChatGPT fix) ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Clearing all localStorage data...');
        localStorage.clear();
        console.log('LocalStorage cleared successfully.');
    } catch (e) {
        console.warn('Failed to clear localStorage', e);
    }
});
// --- END AUTO CLEAR ---


/* Auto-split file: main.js */
/* Safe globals initialization */
window.currentCapsule = window.currentCapsule || null;
window.currentCapsuleId = window.currentCapsuleId || null;
window.currentFlashcardIndex = window.currentFlashcardIndex || 0;
window.currentQuizIndex = window.currentQuizIndex || 0;
window.quizAnswers = window.quizAnswers || [];
window.quizStarted = window.quizStarted || false;
window.spacedRepetitionCards = window.spacedRepetitionCards || [];
window.learningSession = window.learningSession || null;

window.STORAGE_KEYS = window.STORAGE_KEYS || {
    INDEX: 'pc_capsules_index',
    CAPSULE_PREFIX: 'pc_capsule_',
    PROGRESS_PREFIX: 'pc_progress_'
};



function initializeTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
            updateWallpaper();
        }

        

function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        }

        

function updateThemeIcon(theme) {
            const icon = document.querySelector('#theme-toggle i');
            if (theme === 'dark') {
                icon.className = 'bi bi-sun-fill';
            } else {
                icon.className = 'bi bi-moon-fill';
            }
        }

        // Dynamic wallpaper based on subject
        

function updateWallpaper(subject = '') {
            const body = document.body;
            
            // Remove all wallpaper classes
            body.classList.remove('wallpaper-programming', 'wallpaper-language', 'wallpaper-trading', 'wallpaper-geography', 'wallpaper-default');
            
            // Add appropriate wallpaper class
            switch(subject.toLowerCase()) {
                case 'programming':
                case 'javascript':
                case 'coding':
                    body.classList.add('wallpaper-programming');
                    break;
                case 'language':
                case 'spanish':
                case 'english':
                case 'french':
                    body.classList.add('wallpaper-language');
                    break;
                case 'trading':
                case 'finance':
                case 'investment':
                case 'stocks':
                    body.classList.add('wallpaper-trading');
                    break;
                case 'geography':
                case 'history':
                case 'world':
                    body.classList.add('wallpaper-geography');
                    break;
                default:
                    body.classList.add('wallpaper-default');
            }
        }

        // Show 3D loader and initialize app
        

function showLoader() {
            const loader = document.getElementById('loader');
            const mainApp = document.getElementById('main-app');
            
            // Show loader for 3 seconds
            setTimeout(() => {
                // Start fade out animation
                loader.classList.add('loader-fade-out');
                
                // After fade out completes, hide loader and show main app
                setTimeout(() => {
                    loader.style.display = 'none';
                    mainApp.style.display = 'block';
                    mainApp.classList.add('fade-in');
                    
                    // Initialize app after loader
                    initializeSampleData();
                    loadLibrary();
                    setupKeyboardShortcuts();
                    setupAutoSave();
                }, 1000);
            }, 3000);
        }

        // Initialize with sample data if empty
        

function initializeSampleData() {
            
    // AUTO_SAMPLES_DISABLED_BY_CHATGPT: Prevent auto-creating sample capsules on load
    console.log('initializeSampleData: auto-samples disabled');
    return;

    const index = getCapsuleIndex();
            if (index.length === 0) {
                // Create sample capsules
                const sampleCapsules = [
                    {
                        id: 'sample_1',
                        schema: 'pocket-classroom/v1',
                        title: 'JavaScript Fundamentals',
                        subject: 'Programming',
                        level: 'beginner',
                        description: 'Essential JavaScript concepts for beginners',
                        notes: [
                            'Variables are containers for storing data values',
                            'Functions are reusable blocks of code',
                            'Arrays store multiple values in a single variable',
                            'Objects are collections of key-value pairs'
                        ],
                        flashcards: [
                            { front: 'What is a variable in JavaScript?', back: 'A container for storing data values' },
                            { front: 'How do you declare a function?', back: '

function functionName() { }' },
                            { front: 'What is an array?', back: 'A data structure that stores multiple values' },
                            { front: 'What is JSON?', back: 'JavaScript Object Notation - a data interchange format' }
                        ],
                        quiz: [
                            {
                                question: 'Which keyword is used to declare a variable in JavaScript?',
                                choices: ['var', 'variable', 'declare', 'set'],
                                correct: 0,
                                explanation: 'var, let, and const are all used to declare variables'
                            },
                            {
                                question: 'What does DOM stand for?',
                                choices: ['Document Object Model', 'Data Object Management', 'Dynamic Object Method', 'Document Oriented Model'],
                                correct: 0,
                                explanation: 'DOM represents the structure of HTML documents'
                            }
                        ]
                    },
                    {
                        id: 'sample_2',
                        schema: 'pocket-classroom/v1',
                        title: 'Spanish Vocabulary',
                        subject: 'Language',
                        level: 'intermediate',
                        description: 'Common Spanish words and phrases',
                        notes: [
                            'Hola - Hello',
                            'Gracias - Thank you',
                            'Por favor - Please',
                            'Lo siento - I\'m sorry'
                        ],
                        flashcards: [
                            { front: 'Hello', back: 'Hola' },
                            { front: 'Thank you', back: 'Gracias' },
                            { front: 'Please', back: 'Por favor' },
                            { front: 'Goodbye', back: 'Adiós' },
                            { front: 'How are you?', back: '¿Cómo estás?' }
                        ],
                        quiz: [
                            {
                                question: 'How do you say "Thank you" in Spanish?',
                                choices: ['Hola', 'Gracias', 'Por favor', 'Adiós'],
                                correct: 1,
                                explanation: 'Gracias is the most common way to say thank you'
                            }
                        ]
                    },
                    {
                        id: 'sample_3',
                        schema: 'pocket-classroom/v1',
                        title: 'World Capitals',
                        subject: 'Geography',
                        level: 'advanced',
                        description: 'Capital cities of countries around the world',
                        notes: [
                            'Europe has 44 countries',
                            'Asia is the largest continent',
                            'Africa has 54 countries',
                            'South America has 12 countries'
                        ],
                        flashcards: [
                            { front: 'Capital of France', back: 'Paris' },
                            { front: 'Capital of Japan', back: 'Tokyo' },
                            { front: 'Capital of Brazil', back: 'Brasília' },
                            { front: 'Capital of Australia', back: 'Canberra' },
                            { front: 'Capital of Egypt', back: 'Cairo' }
                        ],
                        quiz: [
                            {
                                question: 'What is the capital of Canada?',
                                choices: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'],
                                correct: 2,
                                explanation: 'Ottawa is the capital city of Canada'
                            },
                            {
                                question: 'Which city is the capital of India?',
                                choices: ['Mumbai', 'New Delhi', 'Bangalore', 'Kolkata'],
                                correct: 1,
                                explanation: 'New Delhi is the capital of India'
                            }
                        ]
                    },
                    {
                        id: 'sample_4',
                        schema: 'pocket-classroom/v1',
                        title: 'Trading Fundamentals',
                        subject: 'Trading',
                        level: 'beginner',
                        description: 'Basic concepts of financial trading and investment',
                        notes: [
                            'Bull Market: Rising prices and optimistic sentiment',
                            'Bear Market: Falling prices and pessimistic sentiment',
                            'Support Level: Price level where buying interest emerges',
                            'Resistance Level: Price level where selling pressure appears',
                            'Volume: Number of shares traded in a given period',
                            'Market Cap: Total value of company shares',
                            'P/E Ratio: Price-to-Earnings ratio for valuation',
                            'Dividend: Payment made by companies to shareholders'
                        ],
                        flashcards: [
                            { front: 'What is a Bull Market?', back: 'A market with rising prices and optimistic investor sentiment' },
                            { front: 'What is a Bear Market?', back: 'A market with falling prices and pessimistic investor sentiment' },
                            { front: 'What is Support Level?', back: 'A price level where buying interest typically emerges' },
                            { front: 'What is Resistance Level?', back: 'A price level where selling pressure typically appears' },
                            { front: 'What does Volume indicate?', back: 'The number of shares traded in a given time period' },
                            { front: 'What is Market Capitalization?', back: 'The total value of all company shares outstanding' },
                            { front: 'What is P/E Ratio?', back: 'Price-to-Earnings ratio used for stock valuation' },
                            { front: 'What is a Dividend?', back: 'A payment made by companies to their shareholders' }
                        ],
                        quiz: [
                            {
                                question: 'What characterizes a Bull Market?',
                                choices: ['Falling prices', 'Rising prices', 'Stable prices', 'Volatile prices'],
                                correct: 1,
                                explanation: 'A Bull Market is characterized by rising prices and optimistic sentiment'
                            },
                            {
                                question: 'What is the main purpose of a Stop Loss order?',
                                choices: ['Maximize profits', 'Limit losses', 'Increase volume', 'Split shares'],
                                correct: 1,
                                explanation: 'Stop Loss orders are designed to limit potential losses on a trade'
                            },
                            {
                                question: 'What does high trading volume typically indicate?',
                                choices: ['Low interest', 'High interest', 'Price stability', 'Market closure'],
                                correct: 1,
                                explanation: 'High volume indicates strong interest and participation in the market'
                            },
                            {
                                question: 'What is diversification in trading?',
                                choices: ['Buying one stock', 'Spreading investments', 'Day trading only', 'Using leverage'],
                                correct: 1,
                                explanation: 'Diversification means spreading investments across different assets to reduce risk'
                            }
                        ]
                    }
                ];

                // Save sample capsules
                const indexItems = [];
                sampleCapsules.forEach(capsule => {
                    saveCapsuleData(capsule.id, capsule);
                    indexItems.push({
                        id: capsule.id,
                        title: capsule.title,
                        subject: capsule.subject,
                        level: capsule.level,
                        updatedAt: new Date().toISOString()
                    });
                });

                saveCapsuleIndex(indexItems);
            }
        }

        // Navigation functions
        

function showLibrary() {
            hideAllViews();
            document.getElementById('library-view').style.display = 'block';
            setActiveNav('nav-library');
            loadLibrary();
        }

        

function showAuthor(capsuleId = null) {
            // Create modal overlay for author mode
            const authorModal = document.getElementById('authorModal');
            if (authorModal) {
                const modal = new bootstrap.Modal(authorModal);
                modal.show();
                
                if (capsuleId) {
                    loadCapsuleForModalEditing(capsuleId);
                } else {
                    resetModalAuthorForm();
                }
            }
        }

        

function showLearn() {
            hideAllViews();
            document.getElementById('learn-view').style.display = 'block';
            setActiveNav('nav-learn');
            loadCapsuleSelector();
        }

        

function hideAllViews() {
            document.querySelectorAll('.view-section').forEach(view => {
                view.style.display = 'none';
            });
        }

        

function setActiveNav(activeId) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.getElementById(activeId).classList.add('active');
        }

        // Storage functions
        

function importBackupData(backup) {
            if (!backup.capsules || !Array.isArray(backup.capsules)) {
                alert('Invalid backup format!');
                return;
            }

            const confirmMessage = `🔄 Import Backup File?This backup contains:• ${backup.totalCapsules} capsules• Progress data from ${new Date(backup.exportDate).toLocaleDateString()}This will ADD to your existing data (won't replace it).Continue?`;
            
            if (!confirm(confirmMessage)) {
                return;
            }

            let importedCount = 0;
            const index = getCapsuleIndex();
            const now = new Date().toISOString();

            // Import each capsule
            backup.capsules.forEach(capsule => {
                // Generate new ID to avoid conflicts
                const newId = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
              

function deleteCapsule(id) {
            if (!confirm('Are you sure you want to delete this capsule?')) return;
            
            // Remove from storage
            localStorage.removeItem(STORAGE_KEYS.CAPSULE_PREFIX + id);
            localStorage.removeItem(STORAGE_KEYS.PROGRESS_PREFIX + id);
            // Update the list immediately after deleting
loadLibrary();
filterCapsules();

            
            // Update index
            const index = getCapsuleIndex();
            const filteredIndex = index.filter(item => item.id !== id);
            saveCapsuleIndex(filteredIndex);
            
            loadLibrary();
        }

        

function learnCapsule(id) {
            showLearn();
            document.getElementById('capsule-selector').value = id;
            loadCapsuleForLearning();
        }

        // Keyboard shortcuts
        

function setupKeyboardShortcuts() {
            document.addEventListener('keydown', function(e) {
                // Only handle shortcuts in learn mode
                if (document.getElementById('learn-view').style.display === 'none') return;
                
                switch(e.code) {
                    case 'Space':
                        e.preventDefault();
                        if (document.getElementById('current-flashcard')) {
                            flipFlashcard();
                        }
                        break;
                    case 'BracketLeft':
                        e.preventDefault();
                        switchLearnTab(-1);
                        break;
                    case 'BracketRight':
                        e.preventDefault();
                        switchLearnTab(1);
                        break;
                }
            });
        }

        

function switchLearnTab(direction) {
            const tabs = ['learn-notes-tab', 'learn-flashcards-tab', 'learn-quiz-tab'];
            const activeTab = document.querySelector('#learn-tabs .nav-link.active');
            const currentIndex = tabs.findIndex(tab => activeTab.getAttribute('data-bs-target') === '#' + tab.replace('-tab', ''));
            
            let newIndex = currentIndex + direction;
            if (newIndex < 0) newIndex = tabs.length - 1;
            if (newIndex >= tabs.length) newIndex = 0;
            
            const newTab = document.querySelector(`[data-bs-target="#${tabs[newIndex].replace('-tab', '')}"]`);
            new bootstrap.Tab(newTab).show();
        }

        // Auto-save functionality
        

function setupAutoSave() {
            const inputs = ['capsule-title', 'capsule-subject', 'capsule-description', 'notes-editor'];
            
            inputs.forEach(inputId => {
                const element = document.getElementById(inputId);
                if (element) {
                    element.addEventListener('input', debounce(autoSave, 1000));
                }
            });
        }

        

function autoSave() {
            if (document.getElementById('author-view').style.display !== 'none') {
                // Auto-save is happening, could show a subtle indicator
                console.log('Auto-saving...');
            }
        }

        

function debounce(func, wait) {
            let timeout;
            return 

function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

(function(){

function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'98b8e32d7323355c',t:'MTc1OTk2MDU3OC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();

// top-level initialization


/* Extracted inline scripts from original HTML */

// Global state
        let currentCapsule = null;
        let currentCapsuleId = null;
        let currentFlashcardIndex = 0;
        let currentQuizIndex = 0;
        let quizAnswers = [];
        let quizStarted = false;
        let spacedRepetitionCards = [];
        let learningSession = null;

        // Storage keys
        const STORAGE_KEYS = {
            INDEX: 'pc_capsules_index',
            CAPSULE_PREFIX: 'pc_capsule_',
            PROGRESS_PREFIX: 'pc_progress_'
        };

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            initializeTheme();
            // Set default wallpaper immediately
            document.body.classList.add('wallpaper-default');
            showLoader();
        });

        // Theme management
        