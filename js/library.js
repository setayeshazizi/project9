
/* Auto-split file: library.js */
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

        

// --- Build Subject Dropdown ---
function updateFilterOptions(capsules) {
  const subjectFilter = document.getElementById('subject-filter');
  
  // Extract subjects without duplicates
  const subjects = [...new Set(capsules.map(c => c.subject).filter(s => s))];
  
  // Build dropdown options
  subjectFilter.innerHTML = `
    <option value="">Select Subject</option>
    <option value="all">All Subjects</option>
    ${subjects.map(subject => `<option value="${subject}">${subject}</option>`).join('')}
  `;
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
               const matchesSubject =
  subjectFilter === "all" || !subjectFilter
    ? true
    : capsule.subject.toLowerCase() === subjectFilter;

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

        

// --- Added auto-delete fade-out animation ---
document.addEventListener('click', function(e){
  if(e.target && e.target.classList.contains('delete-btn')){
    e.preventDefault();
    const btn = e.target;
    const capsuleEl = btn.closest('.capsule-item, .capsule-card, .card');
    if(capsuleEl){
      if(confirm('Are you sure you want to delete this capsule?')){
        capsuleEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        capsuleEl.style.opacity = '0';
        capsuleEl.style.transform = 'scale(0.9)';
        setTimeout(()=>{
          capsuleEl.remove();
        },400);
        // If storage function exists, call it
        try {
          if(typeof deleteCapsule === 'function'){
            deleteCapsule(btn.dataset.id || null);
          }
        } catch(err){ console.warn(err); }
      }
    }
  }
});
// --- End auto-delete fade-out ---

// --- Import Capsules (restored) ---
function importCapsuleData(data) {
    if (!data) {
        alert('No data to import');
        return;
    }

    const index = getCapsuleIndex ? getCapsuleIndex() : JSON.parse(localStorage.getItem('pc_capsules_index') || '[]');
    const now = new Date().toISOString();

    // --- Multiple capsule import ---
    if (data.schema === 'pocket-classroom-backup/v1' && Array.isArray(data.capsules)) {
        data.capsules.forEach(c => {
            const capsule = { ...c };
            let id = capsule.id || (`imported_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
            while (localStorage.getItem('pc_capsule_' + id)) {
                id = `imported_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            }
            capsule.id = id;

            localStorage.setItem('pc_capsule_' + id, JSON.stringify(capsule));

            index.push({
                id: id,
                title: capsule.title || 'Imported Capsule',
                subject: capsule.subject || '',
                level: capsule.level || 'beginner',
                description: capsule.description || '',
                updatedAt: capsule.updatedAt || now
            });
        });

        localStorage.setItem('pc_capsules_index', JSON.stringify(index));
        alert(`✅ Imported ${data.capsules.length} capsules successfully.`);
        loadLibrary();
        return;
    }

    // --- Single capsule import ---
    if (data.schema && data.title) {
        const capsule = { ...data };
        let id = capsule.id || (`imported_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
        while (localStorage.getItem('pc_capsule_' + id)) {
            id = `imported_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        }
        capsule.id = id;

        localStorage.setItem('pc_capsule_' + id, JSON.stringify(capsule));

        index.push({
            id: id,
            title: capsule.title,
            subject: capsule.subject || '',
            level: capsule.level || 'beginner',
            description: capsule.description || '',
            updatedAt: capsule.updatedAt || now
        });

        localStorage.setItem('pc_capsules_index', JSON.stringify(index));
        alert('✅ Capsule imported successfully.');
        loadLibrary();
        return;
    }

    alert('❌ Unrecognized capsule format.');
}
