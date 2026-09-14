const startButton = document.getElementById("startButton");
const startMissionButton = document.getElementById("startMissionButton");
const openLockButton = document.getElementById("openLockButton");
const unlockButton = document.getElementById("unlockButton");
const restartButton = document.getElementById("restartButton");

const landing = document.querySelector(".landing");
const mission = document.getElementById("mission");
const challengeContainer = document.getElementById("challengeContainer");
const digitsScreen = document.getElementById("digitsScreen");
const lockScreen = document.getElementById("lockScreen");
const finalScreen = document.getElementById("finalScreen");

let currentChallengeIndex = 0;

// Definición de los 10 desafíos
const challenges = [
    {
        type: "text",
        target: "paco",
        question: "¿Cómo se llama el colegio donde estudió Tania?",
        validAnswers: ["academia san gervasio", "san gervasio"],
        hint: "Pista: Un lugar muy especial en la vida de Tania"
    },
    {
        type: "drag",
        question: "Ordena estas películas por año de estreno (de más antigua a más reciente)",
        items: [
            { text: "El Padrino", year: 1972 },
            { text: "Star Wars", year: 1977 },
            { text: "E.T.", year: 1982 },
            { text: "Pulp Fiction", year: 1994 },
            { text: "Titanic", year: 1997 }
        ]
    },
    {
        type: "text",
        target: "tania",
        question: "¿Cuál es la comida que más odia Tania?",
        validAnswers: ["cebolla", "cebollas"],
        hint: "Pista: Algo que hace llorar... pero no de emoción"
    },
    {
        type: "memory",
        question: "Encuentra las 8 parejas de familiares",
        pairs: ["Familiar 1", "Familiar 2", "Familiar 3", "Familiar 4", "Familiar 5", "Familiar 6", "Familiar 7", "Familiar 8"],
        timeLimit: 35
    },
    {
        type: "text",
        question: "¿Qué significan las siglas FBA en Amazon?",
        validAnswers: ["fulfillment by amazon", "fulfilled by amazon"],
        hint: "Pista: El corazón de vuestro negocio juntos"
    },
    {
        type: "text",
        target: "tania",
        question: "¿Qué manía tiene Paco que te vuelve loca?",
        validAnswers: ["dejar la ropa tirada", "ropa tirada", "dejar ropa tirada"],
        hint: "Pista: Algo que siempre acaba en el suelo..."
    },
    {
        type: "flash-sequence",
        question: "Memoriza y reproduce la secuencia",
        rounds: 5,
        timeLimit: 40
    },
    {
        type: "reaction",
        question: "Haz clic SOLO en las películas de los años 90",
        movies: [
            { name: "Titanic", year: 1997, correct: true },
            { name: "Avatar", year: 2009, correct: false },
            { name: "Matrix", year: 1999, correct: true },
            { name: "Shrek", year: 2001, correct: false },
            { name: "Pulp Fiction", year: 1994, correct: true },
            { name: "Forrest Gump", year: 1994, correct: true },
            { name: "Frozen", year: 2013, correct: false },
            { name: "El Rey León", year: 1994, correct: true }
        ],
        timeLimit: 30
    },
    {
        type: "text",
        question: "¿En qué año empezasteis a trabajar con Amazon?",
        validAnswers: ["2020", "2021", "2022"],
        hint: "Pista: Un año reciente que cambió vuestras vidas"
    },
    {
        type: "cipher",
        question: "Descifra este mensaje: 16-5-12-9-3-21-12-1",
        hint: "Pista: Cada número es una letra del alfabeto (A=1, B=2...)",
        answer: "PELICULA"
    }
];

// Navegación entre pantallas
function showScreen(screen) {
    const screens = [landing, mission, challengeContainer, digitsScreen, lockScreen, finalScreen];
    
    screens.forEach(s => {
        if (s !== screen) {
            s.classList.add("hidden");
        }
    });
    
    screen.classList.remove("hidden");
    screen.style.opacity = "1";
    screen.style.transform = "scale(1)";
}

// Event listeners
startButton.addEventListener("click", () => {
    showScreen(mission);
});

startMissionButton.addEventListener("click", () => {
    currentChallengeIndex = 0;
    showScreen(challengeContainer);
    loadChallenge(0);
});

openLockButton.addEventListener("click", () => {
    showScreen(lockScreen);
});

unlockButton.addEventListener("click", () => {
    showScreen(finalScreen);
});

restartButton.addEventListener("click", () => {
    showScreen(landing);
});

// Cargar desafío
function loadChallenge(index) {
    const challenge = challenges[index];
    const content = document.getElementById("challengeContent");
    const progressFill = document.getElementById("progressFill");
    
    document.getElementById("currentChallenge").textContent = index + 1;
    progressFill.style.width = ((index + 1) / challenges.length * 100) + "%";

    content.innerHTML = "";

    if (challenge.type === "text") {
        renderTextChallenge(challenge, content);
    } else if (challenge.type === "drag") {
        renderDragChallenge(challenge, content);
    } else if (challenge.type === "memory") {
        renderMemoryChallenge(challenge, content);
    } else if (challenge.type === "flash-sequence") {
        renderFlashSequenceChallenge(challenge, content);
    } else if (challenge.type === "reaction") {
        renderReactionChallenge(challenge, content);
    } else if (challenge.type === "cipher") {
        renderCipherChallenge(challenge, content);
    }
}

// Desafío de texto
function renderTextChallenge(challenge, content) {
    const targetLabel = challenge.target 
        ? `<div class="challenge-target">Pregunta para ${challenge.target === "paco" ? "Paco" : "Tania"}</div>` 
        : "";

    content.innerHTML = `
        ${targetLabel}
        <div class="challenge-question">${challenge.question}</div>
        <div class="challenge-hint">${challenge.hint}</div>
        <input type="text" class="challenge-input" id="textInput" placeholder="Escribe tu respuesta...">
        <button class="start-button" id="submitAnswer">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;

    document.getElementById("submitAnswer").addEventListener("click", () => {
        nextChallenge();
    });
}

// Desafío de arrastrar y ordenar
function renderDragChallenge(challenge, content) {
    const shuffled = [...challenge.items].sort(() => Math.random() - 0.5);
    
    content.innerHTML = `
        <div class="challenge-question">${challenge.question}</div>
        <div class="drag-container" id="dragContainer"></div>
        <button class="start-button" id="checkOrder">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;

    const container = document.getElementById("dragContainer");
    shuffled.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "drag-item";
        div.draggable = true;
        div.dataset.year = item.year;
        div.textContent = item.text;
        container.appendChild(div);
    });

    let draggedItem = null;

    container.querySelectorAll(".drag-item").forEach(item => {
        item.addEventListener("dragstart", (e) => {
            draggedItem = item;
            setTimeout(() => item.style.opacity = "0.5", 0);
        });

        item.addEventListener("dragend", (e) => {
            item.style.opacity = "1";
        });

        item.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        item.addEventListener("drop", (e) => {
            e.preventDefault();
            if (draggedItem !== item) {
                const allItems = [...container.querySelectorAll(".drag-item")];
                const draggedIndex = allItems.indexOf(draggedItem);
                const droppedIndex = allItems.indexOf(item);

                if (draggedIndex < droppedIndex) {
                    item.parentNode.insertBefore(draggedItem, item.nextSibling);
                } else {
                    item.parentNode.insertBefore(draggedItem, item);
                }
            }
        });
    });

    document.getElementById("checkOrder").addEventListener("click", () => {
        nextChallenge();
    });
}

// Desafío de memoria
function renderMemoryChallenge(challenge, content) {
    let timeLeft = challenge.timeLimit || 30;
    let matchedPairs = 0;
    let flippedCards = [];
    let timer;
    
    function initGame() {
        const pairs = [...challenge.pairs, ...challenge.pairs];
        const shuffled = pairs.sort(() => Math.random() - 0.5);
        
        content.innerHTML = `
            <div class="challenge-question">${challenge.question}</div>
            <div class="memory-timer">Tiempo: <span id="memoryTimeDisplay">${timeLeft}</span>s</div>
            <div class="memory-grid" id="memoryGrid"></div>
            <button class="start-button" id="skipMemory" style="margin-top: 20px;">
                <span>CONTINUAR</span>
                <span class="arrow">→</span>
            </button>
        `;

        const grid = document.getElementById("memoryGrid");
        flippedCards = [];
        matchedPairs = 0;

        shuffled.forEach((pair, index) => {
            const card = document.createElement("div");
            card.className = "memory-card";
            card.dataset.value = pair;
            card.innerHTML = `<div class="card-inner"><div class="card-front">?</div><div class="card-back">${pair}</div></div>`;
            grid.appendChild(card);

            card.addEventListener("click", () => {
                if (card.classList.contains("flipped") || flippedCards.length === 2) return;

                card.classList.add("flipped");
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    const [card1, card2] = flippedCards;
                    if (card1.dataset.value === card2.dataset.value) {
                        card1.classList.add("matched");
                        card2.classList.add("matched");
                        matchedPairs++;
                        flippedCards = [];
                        
                        if (matchedPairs === challenge.pairs.length) {
                            clearInterval(timer);
                            setTimeout(() => nextChallenge(), 1000);
                        }
                    } else {
                        setTimeout(() => {
                            card1.classList.remove("flipped");
                            card2.classList.remove("flipped");
                            flippedCards = [];
                        }, 1000);
                    }
                }
            });
        });

        document.getElementById("skipMemory").addEventListener("click", () => {
            clearInterval(timer);
            nextChallenge();
        });

        timer = setInterval(() => {
            timeLeft--;
            const display = document.getElementById("memoryTimeDisplay");
            if (display) {
                display.textContent = timeLeft;
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timeLeft = challenge.timeLimit || 30;
                initGame();
            }
        }, 1000);
    }

    initGame();
}

// Desafío de secuencia relámpago
function renderFlashSequenceChallenge(challenge, content) {
    let timeLeft = challenge.timeLimit;
    let currentRound = 1;
    let sequence = [];
    let playerSequence = [];
    let isShowingSequence = false;
    let timer;
    const colors = ["red", "blue", "green", "yellow"];
    
    function initGame() {
        content.innerHTML = `
            <div class="challenge-question">${challenge.question}</div>
            <div class="flash-info">
                <div class="flash-timer">Tiempo: <span id="flashTimeDisplay">${timeLeft}</span>s</div>
                <div class="flash-round">Ronda: <span id="flashRoundDisplay">1</span> / ${challenge.rounds}</div>
            </div>
            <div class="flash-grid" id="flashGrid">
                <div class="flash-btn red" data-color="red"></div>
                <div class="flash-btn blue" data-color="blue"></div>
                <div class="flash-btn green" data-color="green"></div>
                <div class="flash-btn yellow" data-color="yellow"></div>
            </div>
            <div class="flash-status" id="flashStatus">Observa la secuencia...</div>
            <button class="start-button" id="skipFlash" style="margin-top: 20px;">
                <span>CONTINUAR</span>
                <span class="arrow">→</span>
            </button>
        `;
        
        document.getElementById("skipFlash").addEventListener("click", () => {
            clearInterval(timer);
            nextChallenge();
        });
        
        document.querySelectorAll(".flash-btn").forEach(btn => {
            btn.addEventListener("click", () => handleFlashClick(btn));
        });
        
        timer = setInterval(() => {
            timeLeft--;
            const display = document.getElementById("flashTimeDisplay");
            if (display) display.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                setTimeout(() => nextChallenge(), 500);
            }
        }, 1000);
        
        setTimeout(() => showSequence(), 1000);
    }
    
    function showSequence() {
        isShowingSequence = true;
        sequence.push(colors[Math.floor(Math.random() * 4)]);
        
        document.getElementById("flashStatus").textContent = "Observa...";
        
        let i = 0;
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                isShowingSequence = false;
                playerSequence = [];
                document.getElementById("flashStatus").textContent = "Tu turno...";
                return;
            }
            
            const btn = document.querySelector(`.flash-btn.${sequence[i]}`);
            btn.classList.add("active");
            setTimeout(() => btn.classList.remove("active"), 400);
            i++;
        }, 600);
    }
    
    function handleFlashClick(btn) {
        if (isShowingSequence) return;
        
        const color = btn.dataset.color;
        playerSequence.push(color);
        
        btn.classList.add("active");
        setTimeout(() => btn.classList.remove("active"), 200);
        
        const currentIndex = playerSequence.length - 1;
        
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            document.getElementById("flashStatus").textContent = "¡Error! Reiniciando ronda...";
            setTimeout(() => {
                playerSequence = [];
                showSequence();
            }, 1500);
        } else if (playerSequence.length === sequence.length) {
            if (currentRound === challenge.rounds) {
                clearInterval(timer);
                document.getElementById("flashStatus").textContent = "¡Completado!";
                setTimeout(() => nextChallenge(), 1000);
            } else {
                currentRound++;
                document.getElementById("flashRoundDisplay").textContent = currentRound;
                document.getElementById("flashStatus").textContent = "¡Correcto! Siguiente ronda...";
                setTimeout(() => showSequence(), 1200);
            }
        }
    }
    
    initGame();
}

// Desafío de reacción
function renderReactionChallenge(challenge, content) {
    const shuffled = [...challenge.movies].sort(() => Math.random() - 0.5);
    let correctClicks = 0;
    let wrongClicks = 0;
    let timeLeft = challenge.timeLimit;

    content.innerHTML = `
        <div class="challenge-question">${challenge.question}</div>
        <div class="reaction-timer">Tiempo: <span id="timeDisplay">${timeLeft}</span>s</div>
        <div class="reaction-grid" id="reactionGrid"></div>
        <div class="reaction-score">Aciertos: <span id="scoreDisplay">0</span></div>
        <button class="start-button" id="skipReaction" style="margin-top: 20px;">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;

    const grid = document.getElementById("reactionGrid");
    shuffled.forEach(movie => {
        const btn = document.createElement("div");
        btn.className = "reaction-btn";
        btn.textContent = movie.name;
        btn.dataset.correct = movie.correct;
        
        btn.addEventListener("click", () => {
            if (btn.classList.contains("clicked")) return;
            
            btn.classList.add("clicked");
            if (movie.correct) {
                btn.classList.add("correct");
                correctClicks++;
            } else {
                btn.classList.add("wrong");
                wrongClicks++;
            }
            
            document.getElementById("scoreDisplay").textContent = correctClicks;
        });
    });

    document.getElementById("skipReaction").addEventListener("click", () => {
        clearInterval(timer);
        nextChallenge();
    });

    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timeDisplay").textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("timeDisplay").textContent = "0";
        }
    }, 1000);
}

// Desafío de cifrado
function renderCipherChallenge(challenge, content) {
    content.innerHTML = `
        <div class="challenge-question">${challenge.question}</div>
        <div class="challenge-hint">${challenge.hint}</div>
        <input type="text" class="challenge-input" id="cipherInput" placeholder="Escribe cualquier cosa...">
        <button class="start-button" id="checkCipher">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;

    document.getElementById("checkCipher").addEventListener("click", () => {
        nextChallenge();
    });
}

// Avanzar al siguiente desafío
function nextChallenge() {
    currentChallengeIndex++;
    if (currentChallengeIndex < challenges.length) {
        loadChallenge(currentChallengeIndex);
    } else {
        showScreen(digitsScreen);
    }
}

// Auto-avance para el candado
document.addEventListener("DOMContentLoaded", () => {
});

// Animación de shake
const style = document.createElement("style");
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);