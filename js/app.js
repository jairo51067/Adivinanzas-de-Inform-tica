let currentQuestionIndex = 0;
let score = 0;
let questions = []; // Declarar la variable questions aquí

const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = Array.from(document.getElementsByClassName("answer-button"));
const resultContainer = document.getElementById("result");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart");

// Botones para iniciar, pausar y reiniciar
const botonIniciar = document.getElementById('botonIniciar');
const botonPausar = document.getElementById('botonPausar');
const botonReiniciar = document.getElementById('botonReiniciar');

// Obtenemos el elemento HTML donde mostraremos el tiempo
const cronometro = document.getElementById('cronometro');

// Inicializamos las variables para llevar el tiempo
let segundos = 0;
let minutos = 0;
let horas = 0;
let intervaloId;

// Funciones para el cronómetro
function actualizarTiempo() {
    segundos++;
    if (segundos === 60) {
        segundos = 0;
        minutos++;
    }
    if (minutos === 60) {
        minutos = 0;
        horas++;
    }

    // Formateamos el tiempo para mostrarlo en el elemento HTML
    const tiempoFormateado = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    cronometro.textContent = tiempoFormateado;
}

function iniciarCronometro() {
    intervaloId = setInterval(actualizarTiempo, 1000);
}

function pausarCronometro() {
    clearInterval(intervaloId);
}

function reiniciarCronometro() {
    pausarCronometro();
    segundos = 0;
    minutos = 0;
    horas = 0;
    cronometro.textContent = '00:00:00';
}

// Funciones del juego
function startGame() {
    reiniciarCronometro();
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    const answers = [question.answerCorrect, ...question.answerIncorrect];
    answers.sort(() => Math.random() - 0.5); // Mezclar respuestas

    answerButtons.forEach((button, index) => {
        button.innerText = answers[index];
        button.onclick = () => selectAnswer(button.innerText, question.answerCorrect);
    });
}

function selectAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        score++;
    } else {
        score--;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        endGame();
    }
}

function endGame() {
    pausarCronometro();
    questionContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    scoreElement.innerText = `${score}/${questions.length}`;
  
    if (score === questions.length) {
        Swal.fire({
            title: "¡Felicitaciones!",
            text: "Has respondido todas las preguntas correctamente.",
            icon: "success",
            confirmButtonText: "¡Genial!",
        });
    } else {
        Swal.fire({
            title: "¡Buen intento!",
            text: "No has respondido todas las preguntas correctamente. Inténtalo de nuevo.",
            icon: "info",
            confirmButtonText: "Volver a intentarlo",
        });
    }
}

// Función para cargar preguntas
function fetchQuestions() {
    fetch("questions.json")
        .then((response) => response.json())
        .then((data) => {
            questions = data; // Asigna las preguntas a la variable global
            startGame(); // Inicia el juego con las preguntas cargadas
        })
        .catch((error) => console.error("Error al cargar las preguntas:", error));
}

// Asignamos la función al evento click del botón de reiniciar
restartButton.onclick = fetchQuestions;

// Cargar las preguntas al inicio
fetchQuestions();
// Asignamos la función al evento click del botón

// botonIniciar.addEventListener('click', iniciarCronometro);
// botonPausar.addEventListener('click', pausarCronometro);
botonReiniciar.addEventListener('click', reiniciarCronometro);