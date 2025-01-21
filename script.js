document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const gameScreen = document.getElementById('game-screen');
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const submitBtn = document.getElementById('submit-btn');
    const startBtn = document.getElementById('start-btn');
    const quitBtn = document.getElementById('quit-btn');

    let userName = '';
    let currentQuestion = null;

    startBtn.addEventListener('click', () => {
        introScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        addMessage('Quizi: Please enter your name!', 'bot');
    });

    quitBtn.addEventListener('click', () => {
        // Clear chat and reset game
        chatLog.innerHTML = '';
        userName = '';
        currentQuestion = null;

        // Switch back to the intro screen
        gameScreen.style.display = 'none';
        introScreen.style.display = 'block';
    });

    submitBtn.addEventListener('click', async () => {
        const userAnswer = userInput.value.trim();
        userInput.value = '';

        if (!userAnswer) {
            addMessage('Quizi: Please type something!', 'bot');
            return;
        }

        if (!userName) {
            userName = userAnswer;
            addMessage(`You: ${userName}`, 'user');
            addMessage(`Quizi: Nice to meet you, ${userName}! Let's start the quiz.`, 'bot');
            await askQuestion();
        } else {
            addMessage(`You: ${userAnswer}`, 'user');
            checkAnswer(userAnswer);
        }
    });

    async function askQuestion() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
            const data = await response.json();
            if (data.results.length > 0) {
                const question = data.results[0];
                currentQuestion = {
                    question: question.question,
                    correctAnswer: question.correct_answer,
                    incorrectAnswers: question.incorrect_answers,
                };

                addMessage(`Quizi: ${currentQuestion.question}`, 'bot');
            } else {
                addMessage("Quizi: I couldn't fetch a question. Try again later.", 'bot');
            }
        } catch (error) {
            console.error('Error fetching question:', error);
            addMessage('Quizi: Sorry, something went wrong. Please connect to internet.', 'bot');
        }
    }

    function checkAnswer(userAnswer) {
        if (currentQuestion) {
            if (userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
                addMessage(`Quizi: Correct! Well done, ${userName}.`, 'bot');
            } else {
                addMessage(`Quizi: Wrong answer! The correct answer was "${currentQuestion.correctAnswer}".`, 'bot');
            }
            askQuestion();
        }
    }

    function addMessage(content, sender) {
        const message = document.createElement('div');
        message.classList.add('message', sender);
        message.innerHTML = content;
        chatLog.appendChild(message);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
});
