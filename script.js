const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const resultMessage = document.getElementById('result-message');
const timerElement = document.getElementById('timer');
const timeLeftElement = document.getElementById('time-left');

let currentQuestionIndex = 0;
let score = 0;
let isAnswered = false;
let timer;
let timeLeft = 15;
const useTimer = false; 

function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
    totalQuestionsElement.textContent = quizData.length;
        if (useTimer) {
        timerElement.classList.remove('hide');
    }
}

function loadQuestion() {
    isAnswered = false;
    optionsContainer.innerHTML = '';
    const currentQuestion = quizData[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${quizData.length}`;
    const progressPercentage = ((currentQuestionIndex) / quizData.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    currentQuestion.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option');
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => checkAnswer(index));
        optionsContainer.appendChild(optionButton);
    });
        if (useTimer) {
        resetTimer();
        startTimer();
    }
}

function checkAnswer(selectedIndex) {
    if (isAnswered) return;
    isAnswered = true;
    clearInterval(timer); 
    const currentQuestion = quizData[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
        options.forEach(option => {
        option.classList.add('disabled');
    });
    
    if (selectedIndex === currentQuestion.correctIndex) {
        options[selectedIndex].classList.add('correct');
        score++;
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[currentQuestion.correctIndex].classList.add('correct');
    }
        setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function startTimer() {
    timeLeft = 15;
    timeLeftElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            const options = document.querySelectorAll('.option');
            const correctIndex = quizData[currentQuestionIndex].correctIndex;
                        options.forEach(option => {
                option.classList.add('disabled');
            });
            options[correctIndex].classList.add('correct');
            isAnswered = true;
                        setTimeout(() => {
                currentQuestionIndex++;
                
                if (currentQuestionIndex < quizData.length) {
                    loadQuestion();
                } else {
                    showResults();
                }
            }, 1500);
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timeLeftElement.textContent = timeLeft;
}

function showResults() {
    quizScreen.classList.add('hide');
    resultScreen.classList.remove('hide');
    scoreElement.textContent = score;
        const percentage = (score / quizData.length) * 100;
    
    if (percentage >= 80) {
        resultMessage.textContent = "Excellent! You're a web development expert!";
    } else if (percentage >= 60) {
        resultMessage.textContent = "Good job! You have solid knowledge.";
    } else if (percentage >= 40) {
        resultMessage.textContent = "Not bad. Keep learning and try again.";
    } else {
        resultMessage.textContent = "You might need more practice. Don't give up!";
    }
    progressBar.style.width = "100%";
    saveHighScore();
}

function saveHighScore() {
    const highScore = localStorage.getItem('quizHighScore') || 0;
    
    if (score > highScore) {
        localStorage.setItem('quizHighScore', score);
    }
}
startButton.addEventListener('click', () => {
    startScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    initQuiz();
});
restartButton.addEventListener('click', () => {
    resultScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    
    initQuiz();
});