let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Load all questions
function loadQuestions() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "questions.json", true);
    xhr.onload = function () {
        if(xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            questions = data[0].questions;
            showQuestion();
        } else {
            console.error("Could not load questions:", xhr.statusText);
            document.getElementById("quiz-card").innerText = "Could not load Christmas Trivia";
        }
    };
    xhr.send();
}

// Display current question
function showQuestion() {
    const questionData = questions[currentQuestionIndex];
    document.getElementById("question-box").innerText = questionData.question;
    
    const optionsBox = document.getElementById("options-box");
    optionsBox.innerHTML = "";

    questionData.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => handleAnswer(option);
        optionsBox.appendChild(button);
    });
    document.getElementById("feedback").innerText = "";
    document.getElementById("next-btn").style.display = "none";
}

//Handle the selected option
function handleAnswer(selectedOption) {
    const questionData = questions[currentQuestionIndex];
    const feedback = document.getElementById("feedback");
    const buttons = document.querySelectorAll("#options-box button");

    //Disable all buttons to prevent further clicks when a button has been selected
    buttons.forEach(button => {
        button.disabled = true;
        if(button.innerText === selectedOption) {
            button.style.backgroundColor = selectedOption === questionData.answer ? "green" : "red";
        }
    })

    if(selectedOption === questionData.answer) {
        feedback.innerText = "Correct";
        feedback.style.color = "green";
        score++;
    } else {
        feedback.innerText = "Wrong";
        feedback.style.color = "red";
    }
    document.getElementById("next-btn").style.display = "inline-block";
}

//Move to next question
function nextQuestion() {
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showSummary();
    }
}
// Summary display
function showSummary() {
    document.getElementById("quiz-card").style.display = "none";
    const summaryBox = document.getElementById("summary");
    summaryBox.style.display = "flex";
    summaryBox.innerHTML = `
        <h2>Summary</h2>
        <p>You got ${score} out of ${questions.length}!</p>`;
}
document.getElementById("next-btn").addEventListener("click", nextQuestion);

loadQuestions();