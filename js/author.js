
/* Auto-split file: author.js */
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

        