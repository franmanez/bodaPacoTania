const startButton = document.getElementById("startButton");
const startMissionButton = document.getElementById("startMissionButton");
const openLockButton = document.getElementById("openLockButton");
const restartButton = document.getElementById("restartButton");
const skipChallengeButton = document.getElementById("skipChallengeButton"); // TEMPORAL - MODO DESARROLLO

const landing = document.querySelector(".landing");
const mission = document.getElementById("mission");
const challengeContainer = document.getElementById("challengeContainer");
const digitsScreen = document.getElementById("digitsScreen");
const lockScreen = document.getElementById("lockScreen");

let currentChallengeIndex = 0;
let memoryTimer = null;

// Definición de los 10 desafíos
const challenges = [
    {
        type: "text",
        target: "paco",
        question: "¿Cómo se llama el colegio donde estudió Tania?",
        validAnswers: ["academia san gervasio", "san gervasio"],
        hint: "Pista: Si te casaste con ella, seguro que lo sabes..."
    },
    {
        type: "drag",
        question: "Ordena estas películas por año de estreno (de más antigua a más reciente)",
        items: [
            { text: "Psicosis", year: 1960 },
            { text: "El Padrino", year: 1972 },
            { text: "El Exorcista", year: 1973 },
            { text: "Star Wars", year: 1977 },
            { text: "Alien", year: 1979 },
            { text: "E.T.", year: 1982 },
            { text: "Pesadilla en Elm Street", year: 1984 },
            { text: "Pulp Fiction", year: 1994 },
            { text: "Titanic", year: 1997 },
            { text: "Saw", year: 2004 },
            { text: "Get Out", year: 2017 },
            { text: "Hereditary", year: 2018 }
        ]
    },
    {
        type: "photo",
        target: "tania",
        question: "¿Dónde y cuándo se tomó esta foto?",
        image: "images/foto01.png",
        validAnswers: {
            place: ["begur"],
            year: ["2006"]
        },
        hint: "Pista: Ibamos mucho y eramos jovenes (nosotros... Paco ya tenia una edad) 😛"
    },
    {
        type: "memory",
        question: "Encuentra las 8 parejas de familiares",
        pairs: ["images/01.png", "images/02.png", "images/03.png", "images/04.png", "images/05.png", "images/06.png", "images/07.png", "images/08.png"],
        timeLimit: 25
    },
    {
        type: "audio",
        question: "¿Qué canción estábamos bailando en este momento?",
        image: "images/pacofran.gif",
        options: [
            "Soy una taza - Cantajuegos",
            "La Macarena - Los del Río",
            "Chuchuwa - Cachureos",
            "Dubidubidu - Christell"
        ],
        correctAnswer: 3,
        videoUrl: "https://www.youtube.com/embed/K3V0XvCE4ak",
        hint: "Pista: Aquí no hay pista... Solo resaltar que el baile no es lo nuestro. 💃"
    },
    {
        type: "radio",
        target: "tania",
        question: "Pregunta seria: ¿Quién da más la chapa en la relación?",
        options: [
            "Paco",
            "Paco Oliva",
            "Todas las anteriores son correctas"
        ],
        correctAnswer: 2,
        acceptAny: true,
        hint: "Pista: No hace falta pensarlo mucho. Solo recordad la última vez que Paco empezó a hablar de algo que le gusta."
    },
    {
        type: "text",
        target: "paco",
        question: "¿Cuáles son los 8 apellidos de Tania en orden?",
        validAnswers: [
            "linares manez escudero sanchez munoz perez fernandez gonzalez"
        ],
        normalizeInput: true,
        hint: "Orden:\n1) Primer apellido del padre\n2) Primer apellido de la madre\n3) Segundo apellido del padre\n4) Segundo apellido de la madre\n5) Segundo apellido del abuelo paterno\n6) Segundo apellido del abuelo materno\n7) Segundo apellido de la abuela paterna\n8) Segundo apellido de la abuela materna"
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
            { name: "El Rey León", year: 1994, correct: true },
            { name: "Terminator 2", year: 1991, correct: true },
            { name: "Jurassic Park", year: 1993, correct: true },
            { name: "Batman", year: 1989, correct: false },
            { name: "Toy Story", year: 1995, correct: true },
            { name: "Gladiator", year: 2000, correct: false },
            { name: "Harry Potter", year: 2001, correct: false },
            { name: "El Señor de los Anillos", year: 2001, correct: false },
            { name: "Braveheart", year: 1995, correct: true },
            { name: "Inception", year: 2010, correct: false },
            { name: "Batman Begins", year: 2005, correct: false },
            { name: "Toy Story 2", year: 1999, correct: true },
            { name: "X-Men", year: 2000, correct: false }
        ],
        targetScore: 10
    },
    {
        type: "anecdote",
        target: "paco",
        question: "Cuando Fran empezó a salir con Davinia, Tania tenía 2 años y medio. ¿Qué pasó cuando Fran trajo a Davinia a casa a presentársela?",
        options: [
            "Tania y Davinia se hicieron muy buenas amigas. Jugaban juntas y Tania estaba siempre deseando que Davinia viniera a casa de la yaya Maria. Estaba encantada con su nueva amiga y no podía estar más feliz de tenerla cerca.",
            "Tania no quería ni hablarle ni mirarla a la cara. Para ella, Davinia había venido con una misión muy clara: ¡quitarle al 'Tete Fran'! Y eso no le hizo ninguna gracia.\n\nDurante casi un año decidió que Davinia no existía. Cuando la veía, se ponía seria, giraba la cara y se marchaba enfadada. ¡Davinia no lo tuvo nada fácil!"
        ],
        correctAnswer: 1
    },
    {
        type: "text",
        question: "Cada mañana, Fran se hace esta pregunta al despertarse... Si un ciempiés tiene cien patas, ¿cuántos ojos tiene un piojo?",
        validAnswers: ["3.14", "3,14", "3.1416", "3,1416", "3.14159", "3,14159", "3.14159265", "3,14159265", "pi", "π"]
    },
    {
        type: "story",
        question: "¿Qué debe hacer Paco?",
        story: "Tania está preparando una media maratón.\n\nPara ello, algunas mañanas se levanta cuando todavía no ha amanecido, se calza las zapatillas y se va a correr mientras Paco y los niños siguen plácidamente durmiendo.\n\nHasta aquí, todo muy bonito.\n\nEl problema viene cuando, durante una de esas gloriosas sesiones de entrenamiento...\n\nel pequeño se despierta.\n\nSon las 6:47 de la mañana.\n\nTiene 2 años.\n\nQuiere a mamá.\n\nY mamá está a varios kilómetros de distancia, corriendo felizmente hacia su objetivo de 21,097 km.\n\nPaco abre un ojo.\n\nMira al niño.\n\nMira el lado vacío de la cama.\n\nMira el reloj.\n\nY comprende que su verdadera media maratón acaba de empezar.",
        options: [
            "A) Intentar convencer al niño de que mamá está a punto de volver, aunque ambos sepan perfectamente que eso es mentira.",
            "B) Sacar todas sus habilidades de entretenimiento infantil: dibujos, juguetes, canciones, cosquillas y cualquier otra técnica permitida por la Convención de Ginebra.",
            "C) Intentar que el niño vuelva a dormirse mientras piensa: «¿Por qué no seré yo el que está corriendo?»",
            "D) Todas las anteriores.",
            "E) Llamar a Tania y decirle: «Cariño, ¿cuántos kilómetros te quedan?»"
        ],
        correctAnswer: 3
    },
    {
        type: "reveal",
        question: "¿Quién es el mejor imitador de Mickey Mouse?",
        options: ["Paco", "Tania"],
        images: ["images/pacomickey.png", "images/fotoasombro.png"],
        correctAnswer: 0,
        explanation: "Esta es la cara de vuestra familia cuando Paco se pone a imitar a Mickey Mouse."
    }
];

// Navegación entre pantallas
function showScreen(screen) {
    if (memoryTimer) {
        clearInterval(memoryTimer);
        memoryTimer = null;
    }
    
    const screens = [landing, mission, challengeContainer, digitsScreen, lockScreen];
    
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
    document.querySelector(".mission-content").scrollTop = 0;
});

startMissionButton.addEventListener("click", () => {
    currentChallengeIndex = 0;
    showScreen(challengeContainer);
    loadChallenge(0);
});

openLockButton.addEventListener("click", () => {
    showScreen(lockScreen);
});

restartButton.addEventListener("click", () => {
    showScreen(landing);
});

// BOTÓN TEMPORAL PARA DESARROLLO - ELIMINAR EN PRODUCCIÓN
skipChallengeButton.addEventListener("click", () => {
    nextChallenge();
});

// Cargar desafío
function loadChallenge(index) {
    if (memoryTimer) {
        clearInterval(memoryTimer);
        memoryTimer = null;
    }
    
    const challenge = challenges[index];
    const content = document.getElementById("challengeContent");
    const progressFill = document.getElementById("progressFill");
    
    document.getElementById("currentChallenge").textContent = index + 1;
    progressFill.style.width = ((index + 1) / challenges.length * 100) + "%";

    content.innerHTML = "";

    if (challenge.type === "text") {
        renderTextChallenge(challenge, content);
    } else if (challenge.type === "radio") {
        renderRadioChallenge(challenge, content);
    } else if (challenge.type === "photo") {
        renderPhotoChallenge(challenge, content);
    } else if (challenge.type === "audio") {
        renderAudioChallenge(challenge, content);
    } else if (challenge.type === "anecdote") {
        renderAnecdoteChallenge(challenge, content);
    } else if (challenge.type === "drag") {
        renderDragChallenge(challenge, content);
    } else if (challenge.type === "memory") {
        renderMemoryChallenge(challenge, content);
    } else if (challenge.type === "reaction") {
        renderReactionChallenge(challenge, content);
    } else if (challenge.type === "story") {
        renderStoryChallenge(challenge, content);
    } else if (challenge.type === "reveal") {
        renderRevealChallenge(challenge, content);
    }
}

// Desafío de texto
function renderTextChallenge(challenge, content) {
    const targetLabel = challenge.target 
        ? `<div class="challenge-target">Pregunta para ${challenge.target === "paco" ? "Paco" : "Tania"}</div>` 
        : "";

    const hintHTML = challenge.hint
        ? `<div class="challenge-hint">${challenge.hint}</div>`
        : "";

    content.innerHTML = `
        ${targetLabel}
        <div class="challenge-question">${challenge.question}</div>
        ${hintHTML}
        <input type="text" class="challenge-input" id="textInput" placeholder="Escribe tu respuesta...">
        <button class="start-button" id="submitAnswer">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;

    document.getElementById("submitAnswer").addEventListener("click", () => {
        const input = document.getElementById("textInput");
        let userAnswer = input.value.trim().toLowerCase();
        
        if (challenge.normalizeInput) {
            userAnswer = userAnswer.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        
        if (challenge.validAnswers && challenge.validAnswers.length > 0) {
            const isCorrect = challenge.validAnswers.some(answer => 
                userAnswer === answer.toLowerCase()
            );
            
            if (isCorrect) {
                input.style.borderColor = "var(--gold)";
                setTimeout(() => nextChallenge(), 500);
            } else {
                input.style.borderColor = "#dc3545";
                input.value = "";
                input.placeholder = "Respuesta incorrecta. Intenta de nuevo...";
            }
        } else {
            nextChallenge();
        }
    });
}

// Desafío de radio buttons
function renderRadioChallenge(challenge, content) {
    const targetLabel = challenge.target 
        ? `<div class="challenge-target">Pregunta para ${challenge.target === "paco" ? "Paco" : "Tania"}</div>` 
        : "";

    let optionsHTML = challenge.options.map((option, index) => `
        <label class="radio-option">
            <input type="radio" name="radioAnswer" value="${option}">
            <span class="radio-label">${option}</span>
        </label>
    `).join('');

    const hintHTML = challenge.hint
        ? `<div class="challenge-hint">${challenge.hint}</div>`
        : "";

    content.innerHTML = `
        ${targetLabel}
        <div class="challenge-question">${challenge.question}</div>
        ${hintHTML}
        <div class="radio-container">
            ${optionsHTML}
        </div>
        <button class="start-button" id="submitRadio">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;

    document.getElementById("submitRadio").addEventListener("click", () => {
        const selected = document.querySelector('input[name="radioAnswer"]:checked');
        
        if (challenge.acceptAny === true) {
            if (selected) {
                setTimeout(() => nextChallenge(), 500);
            } else {
                alert("Selecciona una opción...");
            }
        } else if (challenge.correctAnswer !== undefined) {
            if (selected && parseInt(selected.value) === challenge.correctAnswer) {
                setTimeout(() => nextChallenge(), 500);
            } else {
                alert("Respuesta incorrecta. Intenta de nuevo...");
            }
        } else {
            nextChallenge();
        }
    });
}

// Desafío de historia con texto narrativo
function renderStoryChallenge(challenge, content) {
    const storyParagraphs = challenge.story.split('\n\n').map(p => `<p>${p}</p>`).join('');
    
    let optionsHTML = challenge.options.map((option, index) => `
        <label class="radio-option">
            <input type="radio" name="storyAnswer" value="${index}">
            <span class="radio-label">${option}</span>
        </label>
    `).join('');

    content.innerHTML = `
        <div class="story-text">${storyParagraphs}</div>
        <div class="challenge-question">${challenge.question}</div>
        <div class="radio-container">
            ${optionsHTML}
        </div>
        <button class="start-button" id="submitStory">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;

    document.getElementById("submitStory").addEventListener("click", () => {
        nextChallenge();
    });
}

// Desafío de revelación con fotos
function renderRevealChallenge(challenge, content) {
    let optionsHTML = challenge.options.map((option, index) => `
        <label class="radio-option">
            <input type="radio" name="revealAnswer" value="${index}">
            <span class="radio-label">${option}</span>
        </label>
    `).join('');

    content.innerHTML = `
        <div class="challenge-question">${challenge.question}</div>
        <div class="radio-container">
            ${optionsHTML}
        </div>
        <button class="start-button" id="submitReveal">
            <span>VER RESULTADO</span>
            <span class="arrow">→</span>
        </button>
    `;

    document.getElementById("submitReveal").addEventListener("click", () => {
        const selected = document.querySelector('input[name="revealAnswer"]:checked');
        
        if (challenge.correctAnswer !== undefined) {
            if (selected && parseInt(selected.value) === challenge.correctAnswer) {
                content.innerHTML = `
                    <div class="challenge-question">${challenge.question}</div>
                    <div class="reveal-images">
                        <img src="${challenge.images[0]}" alt="Mickey Mouse" class="reveal-image">
                        <img src="${challenge.images[1]}" alt="Cara de asombro" class="reveal-image">
                    </div>
                    <button class="start-button" id="continueReveal">
                        <span>CONTINUAR</span>
                        <span class="arrow">→</span>
                    </button>
                `;

                document.getElementById("continueReveal").addEventListener("click", () => {
                    nextChallenge();
                });
            } else {
                alert("Respuesta incorrecta. Intenta de nuevo...");
            }
        } else {
            content.innerHTML = `
                <div class="challenge-question">${challenge.question}</div>
                <div class="reveal-images">
                    <img src="${challenge.images[0]}" alt="Mickey Mouse" class="reveal-image">
                    <img src="${challenge.images[1]}" alt="Cara de asombro" class="reveal-image">
                </div>
                <button class="start-button" id="continueReveal">
                    <span>CONTINUAR</span>
                    <span class="arrow">→</span>
                </button>
            `;

            document.getElementById("continueReveal").addEventListener("click", () => {
                nextChallenge();
            });
        }
    });
}

// Desafío de foto con dos inputs
function renderPhotoChallenge(challenge, content) {
    const targetLabel = challenge.target 
        ? `<div class="challenge-target">Pregunta para ${challenge.target === "paco" ? "Paco" : "Tania"}</div>` 
        : "";

    const hintHTML = challenge.hint
        ? `<div class="challenge-hint">${challenge.hint}</div>`
        : "";

    content.innerHTML = `
        ${targetLabel}
        <div class="challenge-question">${challenge.question}</div>
        <div class="photo-container">
            <img src="${challenge.image}" alt="Foto del recuerdo" class="challenge-photo">
        </div>
        ${hintHTML}
        <div class="photo-inputs">
            <div class="photo-input-group">
                <label class="photo-label">¿Dónde?</label>
                <input type="text" class="challenge-input" id="placeInput" placeholder="Lugar...">
            </div>
            <div class="photo-input-group">
                <label class="photo-label">¿Cuándo?</label>
                <input type="text" class="challenge-input" id="yearInput" placeholder="Año...">
            </div>
        </div>
        <button class="start-button" id="submitPhoto">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;

    document.getElementById("submitPhoto").addEventListener("click", () => {
        const placeInput = document.getElementById("placeInput");
        const yearInput = document.getElementById("yearInput");
        const userPlace = placeInput.value.trim().toLowerCase();
        const userYear = yearInput.value.trim();
        
        if (challenge.validAnswers) {
            const placeCorrect = challenge.validAnswers.place.some(answer => 
                userPlace === answer.toLowerCase()
            );
            const yearCorrect = challenge.validAnswers.year.some(answer => 
                userYear === answer
            );
            
            if (placeCorrect && yearCorrect) {
                placeInput.style.borderColor = "var(--gold)";
                yearInput.style.borderColor = "var(--gold)";
                setTimeout(() => nextChallenge(), 500);
            } else {
                if (!placeCorrect) {
                    placeInput.style.borderColor = "#dc3545";
                    placeInput.value = "";
                    placeInput.placeholder = "Lugar incorrecto...";
                }
                if (!yearCorrect) {
                    yearInput.style.borderColor = "#dc3545";
                    yearInput.value = "";
                    yearInput.placeholder = "Año incorrecto...";
                }
            }
        } else {
            nextChallenge();
        }
    });
}

// Desafío de audio con gif
function renderAudioChallenge(challenge, content) {
    const hintHTML = challenge.hint
        ? `<div class="challenge-hint">${challenge.hint}</div>`
        : "";

    content.innerHTML = `
        <div class="challenge-question">${challenge.question}</div>
        <div class="audio-gif-container">
            <img src="${challenge.image}" alt="Bailando" class="audio-gif">
        </div>
        ${hintHTML}
        <div class="radio-container">
            ${challenge.options.map((option, index) => `
                <label class="radio-option">
                    <input type="radio" name="audioAnswer" value="${index}">
                    <span class="radio-label">${option}</span>
                </label>
            `).join('')}
        </div>
        <button class="start-button" id="submitAudio">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;

    document.getElementById("submitAudio").addEventListener("click", () => {
        const selected = document.querySelector('input[name="audioAnswer"]:checked');
        if (selected && parseInt(selected.value) === challenge.correctAnswer) {
            content.innerHTML = `
                <div class="video-explanation-screen">
                    <div class="video-explanation-title">¡CORRECTO! Esta era la canción...</div>
                    <div class="video-explanation-container">
                        <iframe width="100%" height="315" src="${challenge.videoUrl}?autoplay=1" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
                <button class="start-button" id="continueVideo">
                    <span>CONTINUAR</span>
                    <span class="arrow">→</span>
                </button>
            `;
            document.getElementById("continueVideo").addEventListener("click", () => {
                nextChallenge();
            });
        } else {
            alert("Respuesta incorrecta. Intenta de nuevo...");
        }
    });
}

// Desafío de anécdota con explicación
function renderAnecdoteChallenge(challenge, content) {
    const targetLabel = challenge.target 
        ? `<div class="challenge-target">Pregunta para ${challenge.target === "paco" ? "Paco" : "Tania"}</div>` 
        : "";

    let optionsHTML = challenge.options.map((option, index) => `
        <label class="radio-option">
            <input type="radio" name="anecdoteAnswer" value="${index}">
            <span class="radio-label">${option}</span>
        </label>
    `).join('');

    content.innerHTML = `
        ${targetLabel}
        <div class="challenge-question">${challenge.question}</div>
        <div class="radio-container">
            ${optionsHTML}
        </div>
        <button class="start-button" id="submitAnecdote">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;

    document.getElementById("submitAnecdote").addEventListener("click", () => {
        const selected = document.querySelector('input[name="anecdoteAnswer"]:checked');
        
        if (challenge.correctAnswer !== undefined) {
            if (selected && parseInt(selected.value) === challenge.correctAnswer) {
                setTimeout(() => nextChallenge(), 500);
            } else {
                alert("Respuesta incorrecta. Intenta de nuevo...");
            }
        } else {
            nextChallenge();
        }
    });
}

// Desafío de arrastrar y ordenar
function renderDragChallenge(challenge, content) {
    const shuffled = [...challenge.items].sort(() => Math.random() - 0.5);
    
    content.innerHTML = `
        <div class="challenge-question">${challenge.question}</div>
        <div class="drag-hint">Arrastra para ordenar</div>
        <div class="drag-container" id="dragContainer"></div>
        <button class="start-button" id="checkOrder">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;

    const container = document.getElementById("dragContainer");
    let draggedItem = null;
    let touchStartY = 0;
    let touchItem = null;
    let placeholder = null;

    shuffled.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "drag-item";
        div.draggable = true;
        div.dataset.year = item.year;
        div.innerHTML = `<span class="drag-text">${item.text}</span>`;
        container.appendChild(div);
    });

    // Desktop drag events
    container.querySelectorAll(".drag-item").forEach(item => {
        item.addEventListener("dragstart", (e) => {
            draggedItem = item;
            setTimeout(() => item.classList.add("dragging"), 0);
        });

        item.addEventListener("dragend", (e) => {
            item.classList.remove("dragging");
            draggedItem = null;
        });

        item.addEventListener("dragover", (e) => {
            e.preventDefault();
            if (draggedItem && draggedItem !== item) {
                const rect = item.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                
                if (e.clientY < midY) {
                    container.insertBefore(draggedItem, item);
                } else {
                    container.insertBefore(draggedItem, item.nextSibling);
                }
            }
        });
    });

    // Touch events for mobile
    container.querySelectorAll(".drag-item").forEach(item => {
        item.addEventListener("touchstart", (e) => {
            touchItem = item;
            touchStartY = e.touches[0].clientY;
            item.classList.add("dragging");
        }, { passive: true });

        item.addEventListener("touchmove", (e) => {
            if (!touchItem) return;
            e.preventDefault();
            
            const touchY = e.touches[0].clientY;
            const allItems = [...container.querySelectorAll(".drag-item")];
            const currentIndex = allItems.indexOf(touchItem);
            
            // Find the item we're hovering over
            for (let i = 0; i < allItems.length; i++) {
                if (allItems[i] === touchItem) continue;
                const rect = allItems[i].getBoundingClientRect();
                const midY = rect.top + rect.height / 2;
                
                if (touchY < midY && i < currentIndex) {
                    container.insertBefore(touchItem, allItems[i]);
                    break;
                } else if (touchY > midY && i > currentIndex) {
                    container.insertBefore(touchItem, allItems[i].nextSibling);
                    break;
                }
            }
        }, { passive: false });

        item.addEventListener("touchend", (e) => {
            if (touchItem) {
                touchItem.classList.remove("dragging");
                touchItem = null;
            }
        });
    });

    document.getElementById("checkOrder").addEventListener("click", () => {
        const items = [...container.querySelectorAll(".drag-item")];
        const years = items.map(item => parseInt(item.dataset.year));
        const isCorrect = years.every((year, index) => index === 0 || year >= years[index - 1]);
        
        if (isCorrect) {
            items.forEach(item => item.style.borderColor = "var(--gold)");
            setTimeout(() => nextChallenge(), 500);
        } else {
            items.forEach(item => item.style.borderColor = "#dc3545");
            setTimeout(() => {
                items.forEach(item => item.style.borderColor = "");
            }, 1500);
            alert("Orden incorrecto. Intenta de nuevo...");
        }
    });
}

// Desafío de memoria
function renderMemoryChallenge(challenge, content) {
    let timeLeft = challenge.timeLimit || 30;
    let matchedPairs = 0;
    let flippedCards = [];
    
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
            card.innerHTML = `<div class="card-inner"><div class="card-front">?</div><div class="card-back"><img src="${pair}" alt="Familiar"></div></div>`;
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
                            if (memoryTimer) {
                                clearInterval(memoryTimer);
                                memoryTimer = null;
                            }
                            setTimeout(() => nextChallenge(), 1000);
                        }
                    } else {
                        setTimeout(() => {
                            card1.classList.remove("flipped");
                            card2.classList.remove("flipped");
                            flippedCards = [];
                        }, 600);
                    }
                }
            });
        });

        document.getElementById("skipMemory").addEventListener("click", () => {
            if (memoryTimer) {
                clearInterval(memoryTimer);
                memoryTimer = null;
            }
            nextChallenge();
        });

        memoryTimer = setInterval(() => {
            timeLeft--;
            const display = document.getElementById("memoryTimeDisplay");
            if (display) {
                display.textContent = timeLeft;
            }
            
            if (timeLeft <= 0) {
                clearInterval(memoryTimer);
                timeLeft = challenge.timeLimit || 30;
                initGame();
            }
        }, 1000);
    }

    initGame();
}

// Desafío de reacción
function renderReactionChallenge(challenge, content) {
    const shuffled = [...challenge.movies].sort(() => Math.random() - 0.5);
    let attempts = 0;

    content.innerHTML = `
        <div class="challenge-question">${challenge.question}</div>
        <div class="reaction-info">
            <div class="reaction-score">Intento: <span id="attemptDisplay">1</span></div>
            <div class="reaction-feedback" id="reactionFeedback"></div>
        </div>
        <div class="reaction-grid" id="reactionGrid"></div>
        <button class="start-button" id="validateReaction">
            <span>VALIDAR SELECCIÓN</span>
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
            btn.classList.toggle("selected");
        });
        
        grid.appendChild(btn);
    });

    document.getElementById("validateReaction").addEventListener("click", () => {
        const selected = document.querySelectorAll(".reaction-btn.selected");
        let correctCount = 0;
        let wrongCount = 0;
        
        selected.forEach(btn => {
            if (btn.dataset.correct === "true") {
                correctCount++;
            } else {
                wrongCount++;
            }
        });
        
        const feedback = document.getElementById("reactionFeedback");
        
        if (correctCount === challenge.targetScore && wrongCount === 0) {
            feedback.innerHTML = `<span class="feedback-success">¡PERFECTO! ${correctCount} correctas</span>`;
            setTimeout(() => nextChallenge(), 1500);
        } else {
            attempts++;
            document.getElementById("attemptDisplay").textContent = attempts + 1;
            feedback.innerHTML = `<span class="feedback-info">${correctCount} correctas, ${wrongCount} incorrectas</span>`;
        }
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