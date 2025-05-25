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
        // Override in subclasses for different chapters
        return {
            questions: [
                {
                    question: "What is the first step in the scientific method?",
                    options: ["Experiment", "Ask a question", "Make a hypothesis", "Analyze data"],
                    correct: 1,
                    explanation: "The scientific method always starts with asking a question about something you observe or want to understand!"
                }
            ]
        };
    }

    init() {
        this.setupEventListeners();
        this.showQuestion(0);
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (submitBtn) submitBtn.addEventListener('click', () => this.submitQuiz());
    }

    showQuestion(index) {
        const questions = document.querySelectorAll('.question');
        questions.forEach(q => q.classList.remove('active'));
        
        const currentQ = document.querySelector(`[data-question="${index}"]`);
        if (currentQ) currentQ.classList.add('active');
        
        this.updateNavigation();
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (prevBtn) prevBtn.disabled = this.currentQuestion === 0;
        
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
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `<h3>Quiz Complete! Score: ${score}%</h3>`;
        }
    }

    saveProgress() {
        const completed = JSON.parse(localStorage.getItem('completedChapters') || '[]');
        const chapterNumber = this.getChapterNumber();
        
        if (!completed.includes(chapterNumber)) {
            completed.push(chapterNumber);
            localStorage.setItem('completedChapters', JSON.stringify(completed));
        }
    }

    getChapterNumber() {
        const path = window.location.pathname;
        const match = path.match(/chapter(\d+)/);
        return match ? parseInt(match[1]) : 1;
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('quiz-container')) {
        new ScienceQuiz();
    }
    addPageAnimations();
});

function addPageAnimations() {
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

    const animatedElements = document.querySelectorAll('.step, .tool-card, .experiment-box, .fun-fact');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}