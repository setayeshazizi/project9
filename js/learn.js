
/* Auto-split file: learn.js */
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
        