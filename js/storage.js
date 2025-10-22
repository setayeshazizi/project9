
/* Auto-split file: storage.js */
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

        

// Robust deleteCapsule implementation with custom non-blocking confirmation modal
function deleteCapsule(id) {
    if(!id) return;
    // create custom confirm overlay to avoid native "This page says" dialogs
    const existing = document.getElementById('pc-confirm-overlay');
    if(existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'pc-confirm-overlay';
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0,0,0,0.35)';
    overlay.style.zIndex = '9999';
    const box = document.createElement('div');
    box.style.background = '#fff';
    box.style.padding = '18px';
    box.style.borderRadius = '8px';
    box.style.boxShadow = '0 6px 24px rgba(0,0,0,0.2)';
    box.style.maxWidth = '90%';
    box.style.width = '420px';
    box.style.textAlign = 'center';
    box.innerHTML = '<div style="font-size:16px;margin-bottom:12px">Delete this capsule?</div>';
    const btnYes = document.createElement('button');
    btnYes.textContent = 'Delete';
    btnYes.className = 'btn btn-danger';
    btnYes.style.marginRight = '8px';
    const btnNo = document.createElement('button');
    btnNo.textContent = 'Cancel';
    btnNo.className = 'btn btn-secondary';
    box.appendChild(btnYes);
    box.appendChild(btnNo);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    function cleanup() {
        overlay.remove();
    }

    btnNo.addEventListener('click', cleanup);

    btnYes.addEventListener('click', function(){
        try {
            // Remove from DOM with fade-out
            // Find capsule element: look for an element with onclick attribute that calls deleteCapsule with this id
            const selector = `[onclick*=\"deleteCapsule('${id}')\"], [onclick*=\"deleteCapsule(\"]`;
            let btn = document.querySelector(`[onclick=\"deleteCapsule('${id}')\"]`) || document.querySelector(`[data-capsule-id=\"${id}\"]`) || null;
            if(!btn){
                // try to find by inner delete buttons and matching nearest capsule id in dataset
                const possible = Array.from(document.querySelectorAll('.capsule-item, .capsule-card, .card'));
                for(const p of possible){
                    if(p.innerHTML.includes(id)){
                        btn = p.querySelector('button');
                        break;
                    }
                }
            }
            let capsuleEl = null;
            if(btn){
                capsuleEl = btn.closest('.capsule-item, .capsule-card, .card') || btn.closest('[data-id]') || null;
            } else {
                // try query by data attribute for id
                capsuleEl = document.querySelector(`[data-id='${id}']`) || document.querySelector(`[data-capsule-id='${id}']`) || document.querySelector(`[data-subject]`);
            }
            if(capsuleEl){
                capsuleEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                capsuleEl.style.opacity = '0';
                capsuleEl.style.transform = 'scale(0.96)';
                setTimeout(()=>{
                    capsuleEl.remove();
                }, 420);
            }

            // Remove from storage index and localStorage entries
            const index = getCapsuleIndex() || [];
            const newIndex = index.filter(c => c.id !== id);
            saveCapsuleIndex(newIndex);

            try { localStorage.removeItem(STORAGE_KEYS.CAPSULE_PREFIX + id); } catch(e){}
            try { localStorage.removeItem(STORAGE_KEYS.PROGRESS_PREFIX + id); } catch(e){}

            // If there is a global library list in memory remove it
            if(window._pc_loadedCapsules && Array.isArray(window._pc_loadedCapsules)){
                window._pc_loadedCapsules = window._pc_loadedCapsules.filter(c => c.id !== id);
            }

        } catch(err){
            console.warn('deleteCapsule error', err);
        } finally {
            cleanup();
        }
    });
}
