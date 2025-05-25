// Quiz functionality for all chapters
class ScienceQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.quizData = this.getQuizData();
        this.userAnswers = [];
        this.init();
    }

    getQuizData() {
        // Quiz data for Chapter 1 - Scientific Method & Tools
        return {
            questions: [
                {
                    question: "What is the first step in the scientific method?",
                    options: ["Experiment", "Ask a question", "Make a hypothesis", "Analyze data"],
                    correct: 1,
                    explanation: "The scientific method always starts with asking a question about something you observe or want to understand!"
                },
                {
                    question: "Which tool would you use to see very small things like cells?",
                    options: ["Ruler", "Thermometer", "Microscope", "Balance scale"],
                    correct: 2,
                    explanation: "A microscope magnifies tiny objects so we can see details that are invisible to the naked eye!"
                },
                {
                    question: "A hypothesis is:",
                    options: ["A proven fact", "Your best educated guess", "The final answer", "A type of experiment"],
                    correct: 1,
                    explanation: "A hypothesis is your educated guess about what you think will happen, based on what you already know!"
                },
                {
                    question: "What do you use a graduated cylinder for?",
                    options: ["Measuring temperature", "Measuring volume of liquids", "Weighing objects", "Looking at tiny things"],
                    correct: 1,
                    explanation: "A graduated cylinder has markings that help us measure exactly how much liquid we have!"
                },
                {
                    question: "Why is it important to repeat experiments?",
                    options: ["To waste time", "To make sure results are reliable", "To use more materials", "To confuse other scientists"],
                    correct: 1,
                    explanation: "Repeating experiments helps us make sure our results are accurate and not just a lucky accident!"
                }
            ]
        };
    }

    init() {
        this.setupEventListeners();
        this.showQuestion(0);
    }

    setupEventListeners() {
        // Option selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('option')) {
                this.selectOption(e.target);
            }
        });

        // Navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitQuiz());
        }
    }

    showQuestion(index) {
        // Hide all questions
        const questions = document.querySelectorAll('.question');
        questions.forEach(q => q.classList.remove('active'));

        // Show current question
        const currentQ = document.querySelector(`[data-question="${index}"]`);
        if (currentQ) {
            currentQ.classList.add('active');
        }

        // Update navigation buttons
        this.updateNavigation();
    }

    selectOption(optionElement) {
        const questionDiv = optionElement.closest('.question');
        const questionIndex = parseInt(questionDiv.dataset.question);
        const answerIndex = parseInt(optionElement.dataset.answer);

        // Clear previous selections
        const options = questionDiv.querySelectorAll('.option');
        options.forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });

        // Mark selected option
        optionElement.classList.add('selected');
        
        // Store user's answer
        this.userAnswers[questionIndex] = answerIndex;

        // Show immediate feedback
        this.showFeedback(questionDiv, questionIndex, answerIndex);
    }

    showFeedback(questionDiv, questionIndex, userAnswer) {
        const correctAnswer = this.quizData.questions[questionIndex].correct;
        const options = questionDiv.querySelectorAll('.option');
        const feedback = questionDiv.querySelector('.feedback');

        // Mark correct and incorrect options
        options.forEach((opt, index) => {
            if (index === correctAnswer) {
                opt.classList.add('correct');
            } else if (index === userAnswer && index !== correctAnswer) {
                opt.classList.add('incorrect');
            }
        });

        // Show explanation
        if (feedback) {
            const isCorrect = userAnswer === correctAnswer;
            feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
            feedback.innerHTML = `
                <strong>${isCorrect ? '🎉 Correct!' : '❌ Not quite right!'}</strong><br>
                ${this.quizData.questions[questionIndex].explanation}
            `;
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.quizData.questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion(this.currentQuestion);
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showQuestion(this.currentQuestion);
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
        }

        if (nextBtn && submitBtn) {
            if (this.currentQuestion === this.quizData.questions.length - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'inline-block';
            } else {
                nextBtn.style.display = 'inline-block';
                submitBtn.style.display = 'none';
            }
        }
    }

    calculateScore() {
        let correctAnswers = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer === this.quizData.questions[index].correct) {
                correctAnswers++;
            }
        });
        return Math.round((correctAnswers / this.quizData.questions.length) * 100);
    }

    submitQuiz() {
        const score = this.calculateScore();
        this.showResults(score);
        this.saveProgress();
    }

    showResults(score) {
        const resultsDiv = document.getElementById('quiz-results');
        const scoreDisplay = document.getElementById('score-display');
        const answersReview = document.getElementById('answers-review');

        if (resultsDiv && scoreDisplay) {
            // Show results section
            resultsDiv.style.display = 'block';
            resultsDiv.scrollIntoView({ behavior: 'smooth' });

            // Display score with appropriate styling
            let scoreClass = '';
            let message = '';
            let emoji = '';

            if (score >= 90) {
                scoreClass = 'score-excellent';
                message = "Outstanding! You're a science superstar! 🌟";
                emoji = '🏆';
            } else if (score >= 70) {
                scoreClass = 'score-good';
                message = "Great job! You're getting the hang of this! 👍";
                emoji = '🎯';
            } else {
                scoreClass = 'score-needs-practice';
                message = "Keep practicing! You'll get better with time! 💪";
                emoji = '📚';
            }

            scoreDisplay.className = scoreClass;
            scoreDisplay.innerHTML = `
                <div style="font-size: 3em; margin-bottom: 15px;">${emoji}</div>
                <div>Your Score: ${score}%</div>
                <div style="font-size: 1em; margin-top: 10px;">${message}</div>
            `;

            // Generate detailed review
            if (answersReview) {
                let reviewHTML = '<h4>📋 Answer Review:</h4><div style="text-align: left; margin-top: 15px;">';
                
                this.quizData.questions.forEach((q, index) => {
                    const userAnswer = this.userAnswers[index];
                    const isCorrect = userAnswer === q.correct;
                    const icon = isCorrect ? '✅' : '❌';
                    
                    reviewHTML += `
                        <div style="margin-bottom: 15px; padding: 10px; background: ${isCorrect ? '#e8f5e8' : '#fee'}; border-radius: 8px;">
                            <strong>${icon} Question ${index + 1}:</strong> ${q.question}<br>
                            <strong>Your answer:</strong> ${q.options[userAnswer] || 'Not answered'}<br>
                            ${!isCorrect ? `<strong>Correct answer:</strong> ${q.options[q.correct]}<br>` : ''}
                            <em>${q.explanation}</em>
                        </div>
                    `;
                });
                
                reviewHTML += '</div>';
                answersReview.innerHTML = reviewHTML;
            }
        }
    }

    saveProgress() {
        // Save completion status to localStorage
        const completed = JSON.parse(localStorage.getItem('completedChapters') || '[]');
        const chapterNumber = this.getChapterNumber();
        
        if (!completed.includes(chapterNumber)) {
            completed.push(chapterNumber);
            localStorage.setItem('completedChapters', JSON.stringify(completed));
        }

        // Save quiz score
        const scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
        scores[`chapter${chapterNumber}`] = this.calculateScore();
        localStorage.setItem('quizScores', JSON.stringify(scores));
    }

    getChapterNumber() {
        // Extract chapter number from URL or page
        const path = window.location.pathname;
        const match = path.match(/chapter(\d+)/);
        return match ? parseInt(match[1]) : 1;
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize quiz if we're on a chapter page with quiz elements
    if (document.getElementById('quiz-container')) {
        new ScienceQuiz();
    }
    
    // Add some fun animations
    addPageAnimations();
});

function addPageAnimations() {
    // Animate elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.step, .tool-card, .experiment-box, .fun-fact');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

// Utility function to update overall progress
function updateOverallProgress() {
    const completed = JSON.parse(localStorage.getItem('completedChapters') || '[]');
    const totalChapters = 5; // Update this if you add more chapters
    const progress = (completed.length / totalChapters) * 100;
    
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        bar.style.width = progress + '%';
        bar.textContent = Math.round(progress) + '% Complete';
    });
}

// Call this on page load
document.addEventListener('DOMContentLoaded', updateOverallProgress);
