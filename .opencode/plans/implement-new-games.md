# Plan: Implementar nuevos juegos de habilidad

## Resumen
Eliminar el juego de Simon Says (sequence) y añadir dos nuevos juegos de habilidad con temporizador.

## Cambios en script.js

### 1. Eliminar desafío "sequence" del array challenges
- **Líneas a eliminar**: 55-59
- Eliminar el objeto completo del desafío sequence

### 2. Añadir dos nuevos desafíos en el array challenges
Insertar después del desafío de texto "FBA" (línea 54):

**Juego 1: Atrapa los corazones**
```javascript
{
    type: "catch",
    question: "Atrapa los corazones dorados y evita los rojos",
    targetScore: 20,
    timeLimit: 25
}
```

**Juego 2: Secuencia relámpago**
```javascript
{
    type: "flash-sequence",
    question: "Memoriza y reproduce la secuencia",
    rounds: 5,
    timeLimit: 40
}
```

### 3. Actualizar función loadChallenge (línea 145-157)
Eliminar la condición para "sequence" (líneas 151-152) y añadir:
```javascript
} else if (challenge.type === "catch") {
    renderCatchChallenge(challenge, content);
} else if (challenge.type === "flash-sequence") {
    renderFlashSequenceChallenge(challenge, content);
}
```

### 4. Eliminar función renderSequenceChallenge
- **Líneas a eliminar**: 326-410 (función completa)

### 5. Implementar función renderCatchChallenge
```javascript
function renderCatchChallenge(challenge, content) {
    let timeLeft = challenge.timeLimit;
    let score = 0;
    let timer;
    let spawnTimer;
    
    content.innerHTML = `
        <div class="challenge-question">${challenge.question}</div>
        <div class="catch-info">
            <div class="catch-timer">Tiempo: <span id="catchTimeDisplay">${timeLeft}</span>s</div>
            <div class="catch-score">Puntos: <span id="catchScoreDisplay">0</span> / ${challenge.targetScore}</div>
        </div>
        <div class="catch-area" id="catchArea"></div>
        <button class="start-button" id="skipCatch" style="margin-top: 20px;">
            <span>CONTINUAR</span>
            <span class="arrow">→</span>
        </button>
    `;
    
    const area = document.getElementById("catchArea");
    const areaRect = area.getBoundingClientRect();
    
    function spawnHeart() {
        const heart = document.createElement("div");
        const isGold = Math.random() > 0.4;
        heart.className = `catch-heart ${isGold ? 'gold' : 'red'}`;
        heart.innerHTML = '❤';
        heart.style.left = Math.random() * (area.offsetWidth - 40) + 'px';
        heart.style.top = '-40px';
        area.appendChild(heart);
        
        let posY = -40;
        const speed = 2 + Math.random() * 2;
        
        const fallInterval = setInterval(() => {
            posY += speed;
            heart.style.top = posY + 'px';
            
            if (posY > area.offsetHeight) {
                clearInterval(fallInterval);
                heart.remove();
            }
        }, 30);
        
        heart.addEventListener("click", () => {
            if (heart.classList.contains('clicked')) return;
            heart.classList.add('clicked');
            clearInterval(fallInterval);
            
            if (isGold) {
                score += 2;
            } else {
                score = Math.max(0, score - 1);
            }
            
            document.getElementById("catchScoreDisplay").textContent = score;
            
            if (score >= challenge.targetScore) {
                clearInterval(timer);
                clearInterval(spawnTimer);
                setTimeout(() => nextChallenge(), 500);
            }
            
            setTimeout(() => heart.remove(), 200);
        });
    }
    
    spawnTimer = setInterval(spawnHeart, 600);
    
    document.getElementById("skipCatch").addEventListener("click", () => {
        clearInterval(timer);
        clearInterval(spawnTimer);
        nextChallenge();
    });
    
    timer = setInterval(() => {
        timeLeft--;
        const display = document.getElementById("catchTimeDisplay");
        if (display) display.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            clearInterval(spawnTimer);
            setTimeout(() => nextChallenge(), 500);
        }
    }, 1000);
}
```

### 6. Implementar función renderFlashSequenceChallenge
```javascript
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
```

## Cambios en style.css

### 7. Eliminar estilos de sequence (Simon Says)
Eliminar las secciones:
- `.sequence-display`
- `.sequence-grid`
- `.sequence-btn` y variantes
- `.sequence-status`

### 8. Añadir estilos para juego "catch"
```css
/* =========================
    CATCH GAME
 ========================= */

.catch-info {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 25px;
}

.catch-timer,
.catch-score {
    font-size: 16px;
    color: var(--gold);
    letter-spacing: 2px;
}

.catch-area {
    position: relative;
    width: 100%;
    max-width: 500px;
    height: 350px;
    margin: 0 auto 25px;
    background: rgba(214, 184, 120, 0.05);
    border: 2px solid rgba(214, 184, 120, 0.2);
    border-radius: 8px;
    overflow: hidden;
}

.catch-heart {
    position: absolute;
    font-size: 32px;
    cursor: pointer;
    transition: transform 0.2s;
    user-select: none;
    animation: pulse 0.6s infinite alternate;
}

.catch-heart.gold {
    color: var(--gold);
    text-shadow: 0 0 15px rgba(214, 184, 120, 0.8);
}

.catch-heart.red {
    color: #e74c3c;
    text-shadow: 0 0 15px rgba(231, 76, 60, 0.8);
}

.catch-heart.clicked {
    transform: scale(1.5);
    opacity: 0;
}

@keyframes pulse {
    from { transform: scale(1); }
    to { transform: scale(1.15); }
}
```

### 9. Añadir estilos para juego "flash-sequence"
```css
/* =========================
    FLASH SEQUENCE GAME
 ========================= */

.flash-info {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 25px;
}

.flash-timer,
.flash-round {
    font-size: 16px;
    color: var(--gold);
    letter-spacing: 2px;
}

.flash-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    max-width: 280px;
    margin: 0 auto 25px;
}

.flash-btn {
    aspect-ratio: 1;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.4;
    border: 3px solid transparent;
}

.flash-btn.red {
    background: #e74c3c;
}

.flash-btn.blue {
    background: #3498db;
}

.flash-btn.green {
    background: #2ecc71;
}

.flash-btn.yellow {
    background: #f39c12;
}

.flash-btn.active {
    opacity: 1;
    transform: scale(1.08);
    border-color: var(--gold-light);
    box-shadow: 0 0 30px currentColor;
}

.flash-status {
    font-size: 16px;
    color: var(--gold-light);
    font-style: italic;
    margin-bottom: 10px;
}
```

## Orden de ejecución

1. Eliminar desafío "sequence" del array challenges
2. Añadir desafíos "catch" y "flash-sequence" en el array
3. Actualizar función loadChallenge para incluir nuevos tipos
4. Eliminar función renderSequenceChallenge
5. Añadir función renderCatchChallenge
6. Añadir función renderFlashSequenceChallenge
7. Eliminar estilos CSS de sequence
8. Añadir estilos CSS para catch
9. Añadir estilos CSS para flash-sequence

## Notas importantes

- Los corazones dorados valen +2 puntos, los rojos -1 punto
- Objetivo del catch: 20 puntos en 25 segundos
- Secuencia relámpago: 5 rondas en 40 segundos
- Cada error en flash-sequence reinicia la ronda actual (no todo el juego)
- Ambos juegos tienen botón "CONTINUAR" para saltar si es necesario
