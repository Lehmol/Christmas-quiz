let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let questions = [];

const startCard = document.getElementById("start-card");
const questionCard = document.getElementById("question-card");
const resultsCard = document.getElementById("results-card");
const playBtn = document.getElementById("play-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const questionText = document.getElementById("question-text");
const questionCounter = document.getElementById("question-counter");

async function loadQuestions() {
  try {
    console.log("Försöker ladda frågor från questions.json...");

    const response = await fetch("questions.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    questions = data.questions;

    console.log("Frågor laddade!", questions);
    return true;
  } catch (error) {
    console.error("Kunde inte ladda frågor:", error);
    alert(
      "Kunde inte ladda frågorna. Kontrollera att questions.json finns i samma mapp."
    );
    return false;
  }
}

async function startQuiz() {
  const questionsLoaded = await loadQuestions();

  if (!questionsLoaded) {
    return;
  }

  startCard.style.display = "none";
  questionCard.style.display = "block";
  showQuestion();
}

function showQuestion() {
  const question = questions[currentQuestionIndex];
  questionText.textContent = question.question;
  questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;

  const currentOptionButtons = document.querySelectorAll(".option-btn");

  currentOptionButtons.forEach((btn, index) => {
    btn.textContent = question.options[index];
    btn.className = "option-btn"; // Reset classes
    btn.disabled = false;

    btn.replaceWith(btn.cloneNode(true));
  });

  const newOptionButtons = document.querySelectorAll(".option-btn");
  newOptionButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => selectAnswer(index));
  });
}

function selectAnswer(selectedIndex) {
  const question = questions[currentQuestionIndex];
  const selectedAnswer = question.options[selectedIndex];
  const correctAnswer = question.answer;
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn) => (btn.disabled = true));

  buttons.forEach((btn, index) => {
    if (question.options[index] === correctAnswer) {
      btn.classList.add("correct");
    } else if (index === selectedIndex && selectedAnswer !== correctAnswer) {
      btn.classList.add("incorrect");
    }
  });

  if (selectedAnswer === correctAnswer) {
    correctAnswers++;
  } else {
    wrongAnswers++;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 2000);
}

function showResults() {
  questionCard.style.display = "none";
  resultsCard.style.display = "block";

  document.getElementById(
    "correct-answers"
  ).textContent = `Correct: ${correctAnswers}`;
  document.getElementById(
    "wrong-answers"
  ).textContent = `Wrong: ${wrongAnswers}`;

  const percentage = Math.round((correctAnswers / questions.length) * 100);
  document.getElementById(
    "final-score"
  ).textContent = `Final Score: ${percentage}%`;
}

function resetQuiz() {
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  resultsCard.style.display = "none";
  startCard.style.display = "block";
}

playBtn.addEventListener("click", startQuiz);
playAgainBtn.addEventListener("click", resetQuiz);
