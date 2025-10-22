

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
                            { front: 'How do you declare a function?', back: 'function functionName() { }' },
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
        function getCapsuleIndex() {
            const stored = localStorage.getItem(STORAGE_KEYS.INDEX);
            return stored ? JSON.parse(stored) : [];
        }

        function saveCapsuleIndex(index) {
            localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(index));
        }

        function getCapsule(id) {
            const stored = localStorage.getItem(STORAGE_KEYS.CAPSULE_PREFIX + id);
            return stored ? JSON.parse(stored) : null;
        }

        function saveCapsuleData(id, capsule) {
            localStorage.setItem(STORAGE_KEYS.CAPSULE_PREFIX + id, JSON.stringify(capsule));
        }

        function getProgress(id) {
            const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS_PREFIX + id);
            return stored ? JSON.parse(stored) : { 
                bestScore: 0, 
                knownFlashcards: [],
                cardProgress: {},
                totalStudyTime: 0,
                lastStudied: null,
                streakDays: 0
            };
        }

        function saveProgress(id, progress) {
            localStorage.setItem(STORAGE_KEYS.PROGRESS_PREFIX + id, JSON.stringify(progress));
        }

        // Spaced Repetition Algorithm (simplified SM2)
        function calculateNextReview(cardId, quality) {
            const progress = getProgress(currentCapsuleId);
            const cardProgress = progress.cardProgress[cardId] || {
                easeFactor: 2.5,
                interval: 1,
                repetitions: 0,
                nextReview: Date.now()
            };

            if (quality >= 3) {
                if (cardProgress.repetitions === 0) {
                    cardProgress.interval = 1;
                } else if (cardProgress.repetitions === 1) {
                    cardProgress.interval = 6;
                } else {
                    cardProgress.interval = Math.round(cardProgress.interval * cardProgress.easeFactor);
                }
                cardProgress.repetitions++;
            } else {
                cardProgress.repetitions = 0;
                cardProgress.interval = 1;
            }

            cardProgress.easeFactor = Math.max(1.3, cardProgress.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
            cardProgress.nextReview = Date.now() + (cardProgress.interval * 24 * 60 * 60 * 1000);

            progress.cardProgress[cardId] = cardProgress;
            saveProgress(currentCapsuleId, progress);
            
            return cardProgress;
        }

        function getCardsForReview(capsuleId) {
            const progress = getProgress(capsuleId);
            const capsule = getCapsule(capsuleId);
            if (!capsule) return [];

            const now = Date.now();
            const reviewCards = [];

            // Check flashcards
            capsule.flashcards?.forEach((card, index) => {
                const cardId = `flashcard_${index}`;
                const cardProgress = progress.cardProgress[cardId];
                
                if (!cardProgress || cardProgress.nextReview <= now) {
                    reviewCards.push({
                        type: 'flashcard',
                        index: index,
                        card: card,
                        priority: cardProgress ? (now - cardProgress.nextReview) : now
                    });
                }
            });

            // Sort by priority (overdue cards first)
            return reviewCards.sort((a, b) => b.priority - a.priority);
        }

        // Library functions
        function loadLibrary() {
            const index = getCapsuleIndex();
            const grid = document.getElementById('capsules-grid');
            
            if (index.length === 0) {
                grid.innerHTML = `
                    <div class="col-12">
                        <div class="empty-state">
                            <i class="bi bi-collection"></i>
                            <h4>No learning capsules yet</h4>
                            <p>Create your first capsule to get started!</p>
                            <button class="btn btn-primary" onclick="createNewCapsule()">
                                <i class="bi bi-plus-circle"></i> Create New Capsule
                            </button>
                        </div>
                    </div>
                `;
                return;
            }

            // Update filter options
            updateFilterOptions(index);

            // Render capsules
            renderCapsules(index);
        }

        function renderCapsules(capsules) {
            const grid = document.getElementById('capsules-grid');
            
            grid.innerHTML = capsules.map(capsule => {
                const progress = getProgress(capsule.id);
                const fullCapsule = getCapsule(capsule.id);
                const flashcardCount = fullCapsule?.flashcards?.length || 0;
                const quizCount = fullCapsule?.quiz?.length || 0;
                
                return `
                    <div class="col-lg-4 col-md-6 mb-4 capsule-item fade-in" 
                         data-subject="${capsule.subject.toLowerCase()}" 
                         data-level="${capsule.level}">
                        <div class="capsule-card">
                            <div class="capsule-header">
                                <div class="capsule-title">${capsule.title}</div>
                                <div class="capsule-meta">
                                    <span class="level-badge level-${capsule.level}">${capsule.level}</span>
                                    <span class="ms-2">${capsule.subject}</span>
                                    <div class="mt-1">
                                        <small>Updated: ${new Date(capsule.updatedAt).toLocaleDateString()}</small>
                                    </div>
                                </div>
                            </div>
                            <div class="capsule-body">
                                <div class="capsule-stats">
                                    <div class="stat-item">
                                        <div class="stat-value">${progress.bestScore}%</div>
                                        <div class="stat-label">Best Score</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${progress.knownFlashcards.length}</div>
                                        <div class="stat-label">Known Cards</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value">${getCardsForReview(capsule.id).length}</div>
                                        <div class="stat-label">Due Today</div>
                                    </div>
                                </div>
                                <div class="progress-ring-container mb-3">
                                    <div class="progress-ring">
                                        <svg width="60" height="60">
                                            <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(120, 219, 255, 0.2)" stroke-width="4"/>
                                            <circle cx="30" cy="30" r="25" fill="none" stroke="#78dbff" stroke-width="4" 
                                                    stroke-dasharray="${2 * Math.PI * 25}" 
                                                    stroke-dashoffset="${2 * Math.PI * 25 * (1 - (progress.knownFlashcards.length / Math.max(flashcardCount, 1)))}"
                                                    transform="rotate(-90 30 30)"/>
                                        </svg>
                                        <div class="progress-text">${Math.round((progress.knownFlashcards.length / Math.max(flashcardCount, 1)) * 100)}%</div>
                                    </div>
                                </div>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-primary btn-sm flex-fill" onclick="learnCapsule('${capsule.id}')">
                                        <i class="bi bi-play"></i> Learn
                                    </button>
                                    <button class="btn btn-outline-primary btn-sm" onclick="editCapsule('${capsule.id}')">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-outline-primary btn-sm" onclick="exportCapsule('${capsule.id}')">
                                        <i class="bi bi-download"></i>
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm" onclick="deleteCapsule('${capsule.id}')">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function updateFilterOptions(capsules) {
            const subjects = [...new Set(capsules.map(c => c.subject).filter(s => s))];
            const subjectFilter = document.getElementById('subject-filter');
            
            subjectFilter.innerHTML = '<option value="">Select Subject</option>' +
                subjects.map(subject => `<option value="${subject}">${subject}</option>`).join('');
        }

        function filterCapsules() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            const subjectFilter = document.getElementById('subject-filter').value.toLowerCase();
            const levelFilter = document.getElementById('level-filter').value;
            // If "Select Subject" is selected, show every capsule
if (!document.getElementById("subject-filter").value) {
  const allCapsules = Object.values(getAllCapsules());
  renderCapsules(allCapsules);
}

            
            const index = getCapsuleIndex();
            
            const filtered = index.filter(capsule => {
                const matchesSearch = capsule.title.toLowerCase().includes(searchTerm) ||
                                    capsule.subject.toLowerCase().includes(searchTerm);
                const matchesSubject = !subjectFilter || capsule.subject.toLowerCase() === subjectFilter;
                const matchesLevel = !levelFilter || capsule.level === levelFilter;
                
                return matchesSearch && matchesSubject && matchesLevel;
            });
            
            renderCapsules(filtered);
        }

        // Author functions
        function createNewCapsule() {
            currentCapsuleId = null;
            showAuthor();
        }

        function editCapsule(id) {
            currentCapsuleId = id;
            showAuthor(id);
        }

        function resetAuthorForm() {
            document.getElementById('capsule-title').value = '';
            document.getElementById('capsule-subject').value = '';
            document.getElementById('capsule-level').value = 'beginner';
            document.getElementById('capsule-description').value = '';
            document.getElementById('notes-editor').value = '';
            document.getElementById('flashcards-editor').innerHTML = '';
            document.getElementById('quiz-editor').innerHTML = '';
            currentCapsule = {
                schema: 'pocket-classroom/v1',
                title: '',
                subject: '',
                level: 'beginner',
                description: '',
                notes: [],
                flashcards: [],
                quiz: []
            };
        }

        function loadCapsuleForEditing(id) {
            const capsule = getCapsule(id);
            if (!capsule) return;
            
            currentCapsule = capsule;
            
            document.getElementById('capsule-title').value = capsule.title || '';
            document.getElementById('capsule-subject').value = capsule.subject || '';
            document.getElementById('capsule-level').value = capsule.level || 'beginner';
            document.getElementById('capsule-description').value = capsule.description || '';
            document.getElementById('notes-editor').value = (capsule.notes || []).join('');
            
            renderFlashcardsEditor();
            renderQuizEditor();
        }

        function saveCapsuleFromModal() {
            const title = document.getElementById('modal-capsule-title').value.trim();
            if (!title) {
                alert('Title is required!');
                return;
            }
            
            // Collect data
            const capsule = {
                schema: 'pocket-classroom/v1',
                title: title,
                subject: document.getElementById('modal-capsule-subject').value.trim(),
                level: document.getElementById('modal-capsule-level').value,
                description: document.getElementById('modal-capsule-description').value.trim(),
                notes: document.getElementById('modal-notes-editor').value.split('').filter(line => line.trim()),
                flashcards: currentCapsule?.flashcards || [],
                quiz: currentCapsule?.quiz || []
            };
            
            // Validation
            if (capsule.notes.length === 0 && capsule.flashcards.length === 0 && capsule.quiz.length === 0) {
                alert('Please add at least one note, flashcard, or quiz question!');
                return;
            }
            
            // Save
            const id = currentCapsuleId || Date.now().toString();
            const now = new Date().toISOString();
            
            saveCapsuleData(id, capsule);
            
            // Update index
            const index = getCapsuleIndex();
            const existingIndex = index.findIndex(item => item.id === id);
            
            const indexItem = {
                id: id,
                title: capsule.title,
                subject: capsule.subject,
                level: capsule.level,
                updatedAt: now
            };
            
            if (existingIndex >= 0) {
                index[existingIndex] = indexItem;
            } else {
                index.push(indexItem);
            }
            
            saveCapsuleIndex(index);
            
            // Close modal and refresh library
            bootstrap.Modal.getInstance(document.getElementById('authorModal')).hide();
            alert('Capsule saved successfully!');
            loadLibrary();
        }

        function resetModalAuthorForm() {
            document.getElementById('modal-capsule-title').value = '';
            document.getElementById('modal-capsule-subject').value = '';
            document.getElementById('modal-capsule-level').value = 'beginner';
            document.getElementById('modal-capsule-description').value = '';
            document.getElementById('modal-notes-editor').value = '';
            document.getElementById('modal-flashcards-editor').innerHTML = '';
            document.getElementById('modal-quiz-editor').innerHTML = '';
            currentCapsule = {
                schema: 'pocket-classroom/v1',
                title: '',
                subject: '',
                level: 'beginner',
                description: '',
                notes: [],
                flashcards: [],
                quiz: []
            };
        }

        function loadCapsuleForModalEditing(id) {
            const capsule = getCapsule(id);
            if (!capsule) return;
            
            currentCapsule = capsule;
            
            document.getElementById('modal-capsule-title').value = capsule.title || '';
            document.getElementById('modal-capsule-subject').value = capsule.subject || '';
            document.getElementById('modal-capsule-level').value = capsule.level || 'beginner';
            document.getElementById('modal-capsule-description').value = capsule.description || '';
            document.getElementById('modal-notes-editor').value = (capsule.notes || []).join('');
            
            renderModalFlashcardsEditor();
            renderModalQuizEditor();
        }

        function addModalFlashcard() {
            if (!currentCapsule) currentCapsule = { flashcards: [] };
            if (!currentCapsule.flashcards) currentCapsule.flashcards = [];
            
            currentCapsule.flashcards.push({ front: '', back: '' });
            renderModalFlashcardsEditor();
        }

        function renderModalFlashcardsEditor() {
            const container = document.getElementById('modal-flashcards-editor');
            const flashcards = currentCapsule?.flashcards || [];
            
            container.innerHTML = flashcards.map((card, index) => `
                <div class="card mb-3" style="background: var(--card-bg); border: 1px solid var(--border-color);">
                    <div class="card-header d-flex justify-content-between align-items-center" style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-color);">
                        <span style="color: var(--text-primary);">Flashcard ${index + 1}</span>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeModalFlashcard(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <label class="form-label" style="color: var(--text-primary);">Front</label>
                                <textarea class="form-control" rows="3" onchange="updateModalFlashcard(${index}, 'front', this.value)" style="background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-primary);">${card.front}</textarea>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" style="color: var(--text-primary);">Back</label>
                                <textarea class="form-control" rows="3" onchange="updateModalFlashcard(${index}, 'back', this.value)" style="background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-primary);">${card.back}</textarea>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function removeModalFlashcard(index) {
            if (currentCapsule?.flashcards) {
                currentCapsule.flashcards.splice(index, 1);
                renderModalFlashcardsEditor();
            }
        }

        function updateModalFlashcard(index, field, value) {
            if (currentCapsule?.flashcards?.[index]) {
                currentCapsule.flashcards[index][field] = value;
            }
        }

        function addModalQuizQuestion() {
            if (!currentCapsule) currentCapsule = { quiz: [] };
            if (!currentCapsule.quiz) currentCapsule.quiz = [];
            
            currentCapsule.quiz.push({
                question: '',
                choices: ['', '', '', ''],
                correct: 0,
                explanation: ''
            });
            renderModalQuizEditor();
        }

        function renderModalQuizEditor() {
            const container = document.getElementById('modal-quiz-editor');
            const quiz = currentCapsule?.quiz || [];
            
            container.innerHTML = quiz.map((question, index) => `
                <div class="card mb-3" style="background: var(--card-bg); border: 1px solid var(--border-color);">
                    <div class="card-header d-flex justify-content-between align-items-center" style="background: var(--bg-secondary); border-bottom: 1px solid var(--border-color);">
                        <span style="color: var(--text-primary);">Question ${index + 1}</span>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeModalQuizQuestion(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label" style="color: var(--text-primary);">Question</label>
                            <textarea class="form-control" rows="2" onchange="updateModalQuizQuestion(${index}, 'question', this.value)" style="background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-primary);">${question.question}</textarea>
                        </div>
                        <div class="row">
                            ${question.choices.map((choice, choiceIndex) => `
                                <div class="col-md-6 mb-2">
                                    <label class="form-label" style="color: var(--text-primary);">Choice ${String.fromCharCode(65 + choiceIndex)}</label>
                                    <input type="text" class="form-control" value="${choice}" 
                                           onchange="updateModalQuizChoice(${index}, ${choiceIndex}, this.value)" style="background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-primary);">
                                </div>
                            `).join('')}
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <label class="form-label" style="color: var(--text-primary);">Correct Answer</label>
                                <select class="form-select" onchange="updateModalQuizQuestion(${index}, 'correct', parseInt(this.value))" style="background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-primary);">
                                    ${question.choices.map((_, choiceIndex) => `
                                        <option value="${choiceIndex}" ${question.correct === choiceIndex ? 'selected' : ''}>
                                            ${String.fromCharCode(65 + choiceIndex)}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label" style="color: var(--text-primary);">Explanation (optional)</label>
                                <input type="text" class="form-control" value="${question.explanation || ''}" 
                                       onchange="updateModalQuizQuestion(${index}, 'explanation', this.value)" style="background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-primary);">
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function removeModalQuizQuestion(index) {
            if (currentCapsule?.quiz) {
                currentCapsule.quiz.splice(index, 1);
                renderModalQuizEditor();
            }
        }

        function updateModalQuizQuestion(index, field, value) {
            if (currentCapsule?.quiz?.[index]) {
                currentCapsule.quiz[index][field] = value;
            }
        }

        function updateModalQuizChoice(questionIndex, choiceIndex, value) {
            if (currentCapsule?.quiz?.[questionIndex]?.choices) {
                currentCapsule.quiz[questionIndex].choices[choiceIndex] = value;
            }
        }

        function renderFlashcardsEditor() {
            const container = document.getElementById('flashcards-editor');
            const flashcards = currentCapsule?.flashcards || [];
            
            container.innerHTML = flashcards.map((card, index) => `
                <div class="card mb-3">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Flashcard ${index + 1}</span>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFlashcard(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <label class="form-label">Front</label>
                                <textarea class="form-control" rows="3" onchange="updateFlashcard(${index}, 'front', this.value)">${card.front}</textarea>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Back</label>
                                <textarea class="form-control" rows="3" onchange="updateFlashcard(${index}, 'back', this.value)">${card.back}</textarea>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function addFlashcard() {
            if (!currentCapsule) currentCapsule = { flashcards: [] };
            if (!currentCapsule.flashcards) currentCapsule.flashcards = [];
            
            currentCapsule.flashcards.push({ front: '', back: '' });
            renderFlashcardsEditor();
        }

        function removeFlashcard(index) {
            if (currentCapsule?.flashcards) {
                currentCapsule.flashcards.splice(index, 1);
                renderFlashcardsEditor();
            }
        }

        function updateFlashcard(index, field, value) {
            if (currentCapsule?.flashcards?.[index]) {
                currentCapsule.flashcards[index][field] = value;
            }
        }

        function renderQuizEditor() {
            const container = document.getElementById('quiz-editor');
            const quiz = currentCapsule?.quiz || [];
            
            container.innerHTML = quiz.map((question, index) => `
                <div class="card mb-3">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Question ${index + 1}</span>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeQuizQuestion(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Question</label>
                            <textarea class="form-control" rows="2" onchange="updateQuizQuestion(${index}, 'question', this.value)">${question.question}</textarea>
                        </div>
                        <div class="row">
                            ${question.choices.map((choice, choiceIndex) => `
                                <div class="col-md-6 mb-2">
                                    <label class="form-label">Choice ${String.fromCharCode(65 + choiceIndex)}</label>
                                    <input type="text" class="form-control" value="${choice}" 
                                           onchange="updateQuizChoice(${index}, ${choiceIndex}, this.value)">
                                </div>
                            `).join('')}
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <label class="form-label">Correct Answer</label>
                                <select class="form-select" onchange="updateQuizQuestion(${index}, 'correct', parseInt(this.value))">
                                    ${question.choices.map((_, choiceIndex) => `
                                        <option value="${choiceIndex}" ${question.correct === choiceIndex ? 'selected' : ''}>
                                            ${String.fromCharCode(65 + choiceIndex)}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Explanation (optional)</label>
                                <input type="text" class="form-control" value="${question.explanation || ''}" 
                                       onchange="updateQuizQuestion(${index}, 'explanation', this.value)">
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function addQuizQuestion() {
            if (!currentCapsule) currentCapsule = { quiz: [] };
            if (!currentCapsule.quiz) currentCapsule.quiz = [];
            
            currentCapsule.quiz.push({
                question: '',
                choices: ['', '', '', ''],
                correct: 0,
                explanation: ''
            });
            renderQuizEditor();
        }

        function removeQuizQuestion(index) {
            if (currentCapsule?.quiz) {
                currentCapsule.quiz.splice(index, 1);
                renderQuizEditor();
            }
        }

        function updateQuizQuestion(index, field, value) {
            if (currentCapsule?.quiz?.[index]) {
                currentCapsule.quiz[index][field] = value;
            }
        }

        function updateQuizChoice(questionIndex, choiceIndex, value) {
            if (currentCapsule?.quiz?.[questionIndex]?.choices) {
                currentCapsule.quiz[questionIndex].choices[choiceIndex] = value;
            }
        }

        // Learn functions
        function loadCapsuleSelector() {
            const index = getCapsuleIndex();
            const selector = document.getElementById('capsule-selector');
            
            selector.innerHTML = '<option value="">Select a capsule...</option>' +
                index.map(capsule => `<option value="${capsule.id}">${capsule.title}</option>`).join('');
        }

        function loadCapsuleForLearning() {
            const selector = document.getElementById('capsule-selector');
            const capsuleId = selector.value;
            
            if (!capsuleId) {
                resetLearnContent();
                document.getElementById('export-btn').disabled = true;
                document.getElementById('smart-learn-btn').disabled = true;
                updateWallpaper();
                return;
            }
            
            currentCapsule = getCapsule(capsuleId);
            currentCapsuleId = capsuleId;
            document.getElementById('export-btn').disabled = false;
            document.getElementById('smart-learn-btn').disabled = false;
            
            // Update wallpaper based on capsule subject
            updateWallpaper(currentCapsule.subject);
            
            loadLearnNotes();
            loadLearnFlashcards();
            loadLearnQuiz();
        }

        function startSmartLearning() {
            if (!currentCapsuleId) return;
            
            const reviewCards = getCardsForReview(currentCapsuleId);
            
            if (reviewCards.length === 0) {
                alert('🎉 Great job! No cards are due for review right now. Come back later!');
                return;
            }
            
            spacedRepetitionCards = reviewCards;
            currentFlashcardIndex = 0;
            learningSession = {
                startTime: Date.now(),
                cardsReviewed: 0,
                correctAnswers: 0
            };
            
            // Switch to flashcards tab and start smart review
            const flashcardsTab = document.querySelector('[data-bs-target="#learn-flashcards-tab"]');
            new bootstrap.Tab(flashcardsTab).show();
            
            renderSmartFlashcard();
        }

        function renderSmartFlashcard() {
            const container = document.getElementById('learn-flashcards-content');
            
            if (currentFlashcardIndex >= spacedRepetitionCards.length) {
                finishLearningSession();
                return;
            }
            
            const reviewCard = spacedRepetitionCards[currentFlashcardIndex];
            const progress = getProgress(currentCapsuleId);
            
            container.innerHTML = `
                <div class="row">
                    <div class="col-md-8 mx-auto">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5><i class="bi bi-brain"></i> Smart Review Session</h5>
                                <span class="badge bg-primary">${currentFlashcardIndex + 1} / ${spacedRepetitionCards.length}</span>
                            </div>
                            <div class="progress-custom">
                                <div class="progress-bar-custom" style="width: ${((currentFlashcardIndex + 1) / spacedRepetitionCards.length) * 100}%"></div>
                            </div>
                        </div>
                        
                        <div class="flashcard" id="current-flashcard" onclick="flipFlashcard()">
                            <div class="flashcard-face">
                                <h4>${reviewCard.card.front}</h4>
                                <div class="mt-3">
                                    <small class="text-muted">Click to reveal answer</small>
                                </div>
                            </div>
                            <div class="flashcard-face flashcard-back">
                                <h4>${reviewCard.card.back}</h4>
                                <div class="mt-4">
                                    <p class="text-center mb-3">How well did you know this?</p>
                                    <div class="d-flex justify-content-center gap-2">
                                        <button class="btn btn-danger btn-sm" onclick="rateCard(1)">
                                            <i class="bi bi-x-circle"></i> Hard
                                        </button>
                                        <button class="btn btn-warning btn-sm" onclick="rateCard(3)">
                                            <i class="bi bi-dash-circle"></i> Good
                                        </button>
                                        <button class="btn btn-success btn-sm" onclick="rateCard(5)">
                                            <i class="bi bi-check-circle"></i> Easy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="text-center mt-3">
                            <small class="text-muted">Press <span class="keyboard-shortcut">Space</span> to flip card</small>
                        </div>
                    </div>
                </div>
            `;
        }

        function rateCard(quality) {
            const reviewCard = spacedRepetitionCards[currentFlashcardIndex];
            const cardId = `${reviewCard.type}_${reviewCard.index}`;
            
            // Update spaced repetition data
            calculateNextReview(cardId, quality);
            
            // Update session stats
            learningSession.cardsReviewed++;
            if (quality >= 3) {
                learningSession.correctAnswers++;
            }
            
            // Move to next card
            currentFlashcardIndex++;
            renderSmartFlashcard();
        }

        function finishLearningSession() {
            const container = document.getElementById('learn-flashcards-content');
            const sessionTime = Math.round((Date.now() - learningSession.startTime) / 1000 / 60);
            const accuracy = Math.round((learningSession.correctAnswers / learningSession.cardsReviewed) * 100);
            
            // Update total study time
            const progress = getProgress(currentCapsuleId);
            progress.totalStudyTime += sessionTime;
            progress.lastStudied = Date.now();
            saveProgress(currentCapsuleId, progress);
            
            container.innerHTML = `
                <div class="text-center">
                    <div class="card">
                        <div class="card-body">
                            <h3><i class="bi bi-trophy text-warning"></i> Session Complete!</h3>
                            <div class="row mt-4">
                                <div class="col-md-4">
                                    <div class="stat-value">${learningSession.cardsReviewed}</div>
                                    <div class="stat-label">Cards Reviewed</div>
                                </div>
                                <div class="col-md-4">
                                    <div class="stat-value">${accuracy}%</div>
                                    <div class="stat-label">Accuracy</div>
                                </div>
                                <div class="col-md-4">
                                    <div class="stat-value">${sessionTime}m</div>
                                    <div class="stat-label">Study Time</div>
                                </div>
                            </div>
                            <div class="mt-4">
                                <button class="btn btn-primary me-2" onclick="startSmartLearning()">
                                    <i class="bi bi-arrow-repeat"></i> Another Session
                                </button>
                                <button class="btn btn-outline-primary" onclick="loadLearnFlashcards()">
                                    <i class="bi bi-card-text"></i> Browse All Cards
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Reset session
            learningSession = null;
            spacedRepetitionCards = [];
        }

        function resetLearnContent() {
            document.getElementById('learn-notes-content').innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-journal-text"></i>
                    <h4>No capsule selected</h4>
                    <p>Select a capsule to view its notes</p>
                </div>
            `;
            
            document.getElementById('learn-flashcards-content').innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-card-text"></i>
                    <h4>No capsule selected</h4>
                    <p>Select a capsule to study its flashcards</p>
                </div>
            `;
            
            document.getElementById('learn-quiz-content').innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-question-circle"></i>
                    <h4>No capsule selected</h4>
                    <p>Select a capsule to take its quiz</p>
                </div>
            `;
        }

        function loadLearnNotes() {
            const container = document.getElementById('learn-notes-content');
            const notes = currentCapsule?.notes || [];
            
            if (notes.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="bi bi-journal-text"></i>
                        <h4>No notes available</h4>
                        <p>This capsule doesn't contain any notes</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = `
                <div id="notes-list">
                    ${notes.map((note, index) => `
                        <div class="card mb-2 note-item">
                            <div class="card-body">
                                <p class="mb-0">${note}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function searchNotes() {
            const searchTerm = document.getElementById('notes-search').value.toLowerCase();
            const noteItems = document.querySelectorAll('.note-item');
            
            noteItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        }

        function loadLearnFlashcards() {
            const container = document.getElementById('learn-flashcards-content');
            const flashcards = currentCapsule?.flashcards || [];
            
            if (flashcards.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="bi bi-card-text"></i>
                        <h4>No flashcards available</h4>
                        <p>This capsule doesn't contain any flashcards</p>
                    </div>
                `;
                return;
            }
            
            currentFlashcardIndex = 0;
            renderFlashcardStudy();
        }

        function renderFlashcardStudy() {
            const container = document.getElementById('learn-flashcards-content');
            const flashcards = currentCapsule?.flashcards || [];
            const progress = getProgress(currentCapsuleId);
            
            if (flashcards.length === 0) return;
            
            const currentCard = flashcards[currentFlashcardIndex];
            const isKnown = progress.knownFlashcards.includes(currentFlashcardIndex);
            
            container.innerHTML = `
                <div class="row">
                    <div class="col-md-8 mx-auto">
                        <div class="mb-3">
                            <div class="progress-custom">
                                <div class="progress-bar-custom" style="width: ${((currentFlashcardIndex + 1) / flashcards.length) * 100}%"></div>
                            </div>
                            <div class="d-flex justify-content-between mt-2">
                                <span>Card ${currentFlashcardIndex + 1} of ${flashcards.length}</span>
                                <span>Known: ${progress.knownFlashcards.length}/${flashcards.length}</span>
                            </div>
                        </div>
                        
                        <div class="flashcard" id="current-flashcard" onclick="flipFlashcard()">
                            <div class="flashcard-face">
                                <h4>${currentCard.front}</h4>
                            </div>
                            <div class="flashcard-face flashcard-back">
                                <h4>${currentCard.back}</h4>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center mt-4">
                            <button class="btn btn-outline-primary" onclick="previousFlashcard()" ${currentFlashcardIndex === 0 ? 'disabled' : ''}>
                                <i class="bi bi-arrow-left"></i> Previous
                            </button>
                            
                            <div class="btn-group">
                                <button class="btn ${isKnown ? 'btn-success' : 'btn-outline-success'}" onclick="toggleKnown()">
                                    <i class="bi bi-check-circle"></i> ${isKnown ? 'Known' : 'Mark Known'}
                                </button>
                                <button class="btn ${!isKnown ? 'btn-warning' : 'btn-outline-warning'}" onclick="toggleKnown()">
                                    <i class="bi bi-question-circle"></i> ${!isKnown ? 'Unknown' : 'Mark Unknown'}
                                </button>
                            </div>
                            
                            <button class="btn btn-outline-primary" onclick="nextFlashcard()" ${currentFlashcardIndex === flashcards.length - 1 ? 'disabled' : ''}>
                                Next <i class="bi bi-arrow-right"></i>
                            </button>
                        </div>
                        
                        <div class="text-center mt-3">
                            <small class="text-muted">Press <span class="keyboard-shortcut">Space</span> to flip card</small>
                        </div>
                    </div>
                </div>
            `;
        }

        function flipFlashcard() {
            const flashcard = document.getElementById('current-flashcard');
            flashcard.classList.toggle('flipped');
        }

        function previousFlashcard() {
            if (currentFlashcardIndex > 0) {
                currentFlashcardIndex--;
                renderFlashcardStudy();
            }
        }

        function nextFlashcard() {
            const flashcards = currentCapsule?.flashcards || [];
            if (currentFlashcardIndex < flashcards.length - 1) {
                currentFlashcardIndex++;
                renderFlashcardStudy();
            }
        }

        function toggleKnown() {
            const progress = getProgress(currentCapsuleId);
            const index = progress.knownFlashcards.indexOf(currentFlashcardIndex);
            
            if (index >= 0) {
                progress.knownFlashcards.splice(index, 1);
            } else {
                progress.knownFlashcards.push(currentFlashcardIndex);
            }
            
            saveProgress(currentCapsuleId, progress);
            renderFlashcardStudy();
        }

        function loadLearnQuiz() {
            const container = document.getElementById('learn-quiz-content');
            const quiz = currentCapsule?.quiz || [];
            
            if (quiz.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="bi bi-question-circle"></i>
                        <h4>No quiz available</h4>
                        <p>This capsule doesn't contain any quiz questions</p>
                    </div>
                `;
                return;
            }
            
            renderQuizStart();
        }

        function renderQuizStart() {
            const container = document.getElementById('learn-quiz-content');
            const quiz = currentCapsule?.quiz || [];
            const progress = getProgress(currentCapsuleId);
            
            container.innerHTML = `
                <div class="text-center">
                    <div class="card">
                        <div class="card-body">
                            <h4><i class="bi bi-play-circle"></i> Ready to start the quiz?</h4>
                            <p class="text-muted">This quiz contains ${quiz.length} questions</p>
                            <p class="text-muted">Your best score: <strong>${progress.bestScore}%</strong></p>
                            <button class="btn btn-primary btn-lg" onclick="startQuiz()">
                                <i class="bi bi-play"></i> Start Quiz
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        function startQuiz() {
            const quiz = currentCapsule?.quiz || [];
            currentQuizIndex = 0;
            quizAnswers = new Array(quiz.length).fill(null);
            quizStarted = true;
            
            renderQuizQuestion();
        }

        function renderQuizQuestion() {
            const container = document.getElementById('learn-quiz-content');
            const quiz = currentCapsule?.quiz || [];
            const question = quiz[currentQuizIndex];
            
            container.innerHTML = `
                <div class="row">
                    <div class="col-md-10 mx-auto">
                        <div class="mb-3">
                            <div class="progress-custom">
                                <div class="progress-bar-custom" style="width: ${((currentQuizIndex + 1) / quiz.length) * 100}%"></div>
                            </div>
                            <div class="text-center mt-2">
                                Question ${currentQuizIndex + 1} of ${quiz.length}
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <h4>${question.question}</h4>
                            <div class="mt-4">
                                ${question.choices.map((choice, index) => `
                                    <div class="quiz-option ${quizAnswers[currentQuizIndex] === index ? 'selected' : ''}" 
                                         onclick="selectQuizAnswer(${index})">
                                        <strong>${String.fromCharCode(65 + index)}.</strong> ${choice}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between mt-4">
                            <button class="btn btn-outline-secondary" onclick="previousQuizQuestion()" ${currentQuizIndex === 0 ? 'disabled' : ''}>
                                <i class="bi bi-arrow-left"></i> Previous
                            </button>
                            
                            <button class="btn btn-primary" onclick="nextQuizQuestion()" ${quizAnswers[currentQuizIndex] === null ? 'disabled' : ''}>
                                ${currentQuizIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next'} 
                                <i class="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        function selectQuizAnswer(answerIndex) {
            quizAnswers[currentQuizIndex] = answerIndex;
            renderQuizQuestion();
        }

        function previousQuizQuestion() {
            if (currentQuizIndex > 0) {
                currentQuizIndex--;
                renderQuizQuestion();
            }
        }

        function nextQuizQuestion() {
            const quiz = currentCapsule?.quiz || [];
            
            if (currentQuizIndex < quiz.length - 1) {
                currentQuizIndex++;
                renderQuizQuestion();
            } else {
                finishQuiz();
            }
        }

        function finishQuiz() {
            const quiz = currentCapsule?.quiz || [];
            let correctAnswers = 0;
            
            const results = quiz.map((question, index) => {
                const userAnswer = quizAnswers[index];
                const isCorrect = userAnswer === question.correct;
                if (isCorrect) correctAnswers++;
                
                return {
                    question: question.question,
                    userAnswer: userAnswer,
                    correctAnswer: question.correct,
                    isCorrect: isCorrect,
                    explanation: question.explanation,
                    choices: question.choices
                };
            });
            
            const score = Math.round((correctAnswers / quiz.length) * 100);
            
            // Update best score
            const progress = getProgress(currentCapsuleId);
            if (score > progress.bestScore) {
                progress.bestScore = score;
                saveProgress(currentCapsuleId, progress);
            }
            
            renderQuizResults(score, correctAnswers, quiz.length, results);
        }

        function renderQuizResults(score, correct, total, results) {
            const container = document.getElementById('learn-quiz-content');
            
            container.innerHTML = `
                <div class="text-center mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h2><i class="bi bi-trophy"></i> Quiz Complete!</h2>
                            <div class="display-4 text-primary mb-3">${score}%</div>
                            <p class="lead">You got ${correct} out of ${total} questions correct</p>
                            <div class="btn-group">
                                <button class="btn btn-primary" onclick="startQuiz()">
                                    <i class="bi bi-arrow-repeat"></i> Retake Quiz
                                </button>
                                <button class="btn btn-outline-primary" onclick="renderQuizStart()">
                                    <i class="bi bi-house"></i> Back to Start
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h5><i class="bi bi-list-check"></i> Detailed Results</h5>
                    </div>
                    <div class="card-body">
                        ${results.map((result, index) => `
                            <div class="mb-4 pb-3 border-bottom">
                                <h6>Question ${index + 1}: ${result.question}</h6>
                                <div class="row">
                                    ${result.choices.map((choice, choiceIndex) => {
                                        let className = 'quiz-option';
                                        if (choiceIndex === result.correctAnswer) {
                                            className += ' correct';
                                        } else if (choiceIndex === result.userAnswer && !result.isCorrect) {
                                            className += ' incorrect';
                                        }
                                        return `
                                            <div class="col-md-6 mb-2">
                                                <div class="${className}">
                                                    <strong>${String.fromCharCode(65 + choiceIndex)}.</strong> ${choice}
                                                    ${choiceIndex === result.correctAnswer ? ' <i class="bi bi-check-circle text-success"></i>' : ''}
                                                    ${choiceIndex === result.userAnswer && !result.isCorrect ? ' <i class="bi bi-x-circle text-danger"></i>' : ''}
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                                ${result.explanation ? `<div class="alert alert-info mt-2"><small><strong>Explanation:</strong> ${result.explanation}</small></div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Export/Import functions
        function exportCapsule(id) {
            const capsule = getCapsule(id);
            if (!capsule) return;
            
            const dataStr = JSON.stringify(capsule, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `${capsule.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
            link.click();
        }

        function exportAllCapsules() {
            const index = getCapsuleIndex();
            if (index.length === 0) {
                alert('No capsules to export!');
                return;
            }

            // Create a complete backup with all data
            const backup = {
                schema: 'pocket-classroom-backup/v1',
                exportDate: new Date().toISOString(),
                totalCapsules: index.length,
                capsules: [],
                progress: {}
            };

            // Collect all capsules and their progress
            index.forEach(item => {
                const capsule = getCapsule(item.id);
                const progress = getProgress(item.id);
                
                if (capsule) {
                    backup.capsules.push({
                        ...capsule,
                        id: item.id,
                        updatedAt: item.updatedAt
                    });
                    backup.progress[item.id] = progress;
                }
            });

            // Create and download the backup file
            const dataStr = JSON.stringify(backup, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `pocket_classroom_backup_${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            // Show success message with details
            alert(`✅ Successfully exported ${backup.totalCapsules} capsules!The backup includes:• All learning capsules• Your progress data• Study statisticsYou can import this file on any device to restore your data.`);
        }

        function exportCurrentCapsule() {
            if (currentCapsuleId) {
                exportCapsule(currentCapsuleId);
            }
        }

        function importCapsule() {
            const modal = new bootstrap.Modal(document.getElementById('importModal'));
            modal.show();
        }

        function processImport() {
            const fileInput = document.getElementById('import-file');
            const textInput = document.getElementById('import-text');
            
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const capsule = JSON.parse(e.target.result);
                        importCapsuleData(capsule);
                    } catch (error) {
                        alert('Invalid JSON file!');
                    }
                };
                reader.readAsText(file);
            } else if (textInput.value.trim()) {
                try {
                    const capsule = JSON.parse(textInput.value);
                    importCapsuleData(capsule);
                } catch (error) {
                    alert('Invalid JSON data!');
                }
            } else {
                alert('Please select a file or paste JSON data!');
                return;
            }
        }

        function importCapsuleData(data) {
            // Check if it's a backup file or single capsule
            if (data.schema === 'pocket-classroom-backup/v1') {
                // Import full backup
                importBackupData(data);
            } else if (data.schema && data.title) {
                // Import single capsule
                importSingleCapsule(data);
            } else {
                alert('Invalid file format! Please select a valid capsule or backup file.');
                return;
            }
        }

        function importSingleCapsule(capsule) {
            const id = Date.now().toString();
            const now = new Date().toISOString();
            
            // Save capsule data
            saveCapsuleData(id, capsule);
            
            // Update index
            const index = getCapsuleIndex();
            index.push({
                id: id,
                title: capsule.title,
                subject: capsule.subject || '',
                level: capsule.level || 'beginner',
                updatedAt: now
            });
            saveCapsuleIndex(index);
            
            // Close modal and refresh
            bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
            document.getElementById('import-file').value = '';
            document.getElementById('import-text').value = '';
            
            alert('✅ Capsule imported successfully!');
            loadLibrary();
        }

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
            // Remove from index
            let index = getCapsuleIndex();
            index = index.filter(item => item.id !== id);
            saveCapsuleIndex(index);
            
            // Remove capsule data and progress
            localStorage.removeItem(STORAGE_KEYS.CAPSULE_PREFIX + id);
            localStorage.removeItem(STORAGE_KEYS.PROGRESS_PREFIX + id);
        }
                saveCapsuleData(newId, capsuleData);
                
                // Import progress if available
                if (backup.progress && backup.progress[capsule.id]) {
                    saveProgress(newId, backup.progress[capsule.id]);
                }
                
                // Update index
                index.push({
                    id: newId,
                    title: capsule.title,
                    subject: capsule.subject || '',
                    level: capsule.level || 'beginner',
                    updatedAt: now
                });
                
                importedCount++;
            });

            // Save updated index
            saveCapsuleIndex(index);
            
            // Close modal and refresh
            bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
            document.getElementById('import-file').value = '';
            document.getElementById('import-text').value = '';
            
            alert(`🎉 Successfully imported ${importedCount} capsules!All your learning data and progress has been restored.`);
            loadLibrary();
        }

        // Utility functions
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
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'98b8e32d7323355c',t:'MTc1OTk2MDU3OC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
// === IMPORT CAPSULES / BACKUP ===
function processImport() {
  const fileInput = document.getElementById("import-file");
  const textInput = document.getElementById("import-text");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        importCapsuleData(data);
      } catch (err) {
        alert("❌ Invalid JSON file!");
      }
    };
    reader.readAsText(file);
  } else if (textInput.value.trim()) {
    try {
      const data = JSON.parse(textInput.value.trim());
      importCapsuleData(data);
    } catch (err) {
      alert("❌ Invalid JSON text!");
    }
  } else {
    alert("Please select a file or paste JSON.");
  }
}

// === MAIN IMPORT HANDLER ===
function importCapsuleData(data) {
  if (!data) return alert("No data found.");

  const index = getCapsuleIndex();
  const now = new Date().toISOString();

  // --- Multiple capsules (Backup file) ---
  if (data.schema === "pocket-classroom-backup/v1" && Array.isArray(data.capsules)) {
    data.capsules.forEach(cap => {
      const id = Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      saveCapsuleData(id, cap);
      index.push({
        id,
        title: cap.title,
        subject: cap.subject || "General",
        level: cap.level || "beginner",
        updatedAt: now
      });
    });
    saveCapsuleIndex(index);
    alert("✅ Imported backup successfully!");
    loadLibrary();
    return;
  }

  // --- Single capsule ---
  if (data.schema && data.title) {
    const id = Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    saveCapsuleData(id, data);
    index.push({
      id,
      title: data.title,
      subject: data.subject || "General",
      level: data.level || "beginner",
      updatedAt: now
    });
    saveCapsuleIndex(index);
    alert("✅ Imported one capsule successfully!");
    loadLibrary();
    return;
  }

  alert("❌ Invalid format. Make sure your JSON matches the Pocket Classroom schema.");
}
