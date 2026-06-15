class Clock {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.size = options.size || 300;
        this.hourHandColor = options.hourHandColor || '#FF6B6B'; // Naranja
        this.minuteHandColor = options.minuteHandColor || '#4D96FF'; // Azul
        this.faceColor = options.faceColor || '#FFFFFF';
        
        this.svg = null;
        this.hourHand = null;
        this.minuteHand = null;
        
        this.init();
    }

    init() {
        this.render();
        this.updateTime(10, 10); // Hora inicial bonita 10:10
    }

    createSVGElement(type, attributes) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", type);
        for (const key in attributes) {
            el.setAttribute(key, attributes[key]);
        }
        return el;
    }

    render() {
        this.container.innerHTML = '';
        const cx = this.size / 2;
        const cy = this.size / 2;
        const radius = this.size / 2 - 10;

        // SVG Canvas
        this.svg = this.createSVGElement('svg', {
            width: this.size,
            height: this.size,
            viewBox: `0 0 ${this.size} ${this.size}`,
            class: 'clock-svg'
        });

        // Clock Face
        const face = this.createSVGElement('circle', {
            cx: cx,
            cy: cy,
            r: radius,
            fill: this.faceColor,
            stroke: '#2D3436',
            'stroke-width': '8'
        });
        this.svg.appendChild(face);

        // Center Dot
        const center = this.createSVGElement('circle', {
            cx: cx,
            cy: cy,
            r: 8,
            fill: '#2D3436'
        });

        // Numbers
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30) * (Math.PI / 180);
            const numRadius = radius - 40;
            const x = cx + Math.sin(angle) * numRadius;
            const y = cy - Math.cos(angle) * numRadius;

            const text = this.createSVGElement('text', {
                x: x,
                y: y,
                'text-anchor': 'middle',
                'dominant-baseline': 'middle',
                class: 'clock-number',
                fill: '#2D3436',
                'font-size': '24',
                'font-family': 'var(--font-heading)',
                'font-weight': 'bold'
            });
            text.textContent = i;
            this.svg.appendChild(text);
        }

        // Hour Hand Group
        const hourGroup = this.createSVGElement('g', { id: 'hour-group' });
        this.hourHand = this.createSVGElement('line', {
            x1: cx,
            y1: cy,
            x2: cx,
            y2: cy - (radius * 0.5),
            stroke: this.hourHandColor,
            'stroke-width': '12',
            'stroke-linecap': 'round'
        });
        hourGroup.appendChild(this.hourHand);
        this.svg.appendChild(hourGroup);

        // Minute Hand Group
        const minuteGroup = this.createSVGElement('g', { id: 'minute-group' });
        this.minuteHand = this.createSVGElement('line', {
            x1: cx,
            y1: cy,
            x2: cx,
            y2: cy - (radius * 0.75),
            stroke: this.minuteHandColor,
            'stroke-width': '8',
            'stroke-linecap': 'round'
        });
        minuteGroup.appendChild(this.minuteHand);
        this.svg.appendChild(minuteGroup);
        
        // Append Center on top
        this.svg.appendChild(center);

        this.container.appendChild(this.svg);
    }

    updateTime(hours, minutes) {
        // Calcular ángulos
        // Hora: 30 grados por hora + 0.5 grados por minuto
        const hourAngle = (hours % 12) * 30 + minutes * 0.5;
        // Minuto: 6 grados por minuto
        const minuteAngle = minutes * 6;

        const cx = this.size / 2;
        const cy = this.size / 2;

        const hourGroup = this.svg.getElementById('hour-group');
        const minuteGroup = this.svg.getElementById('minute-group');

        hourGroup.setAttribute('transform', `rotate(${hourAngle}, ${cx}, ${cy})`);
        minuteGroup.setAttribute('transform', `rotate(${minuteAngle}, ${cx}, ${cy})`);
    }

    // Método para animar el reloj a una hora específica
    animateTo(hours, minutes) {
        // Simple por ahora, usamos updateTime
        // En una versión más avanzada podríamos usar requestAnimationFrame para interpolar
        this.updateTime(hours, minutes);
    }
}

// Variables de estado
let hourState = 3;
let minuteState = 0; // 3:00 para el paso de minutos
let practiceTarget = { h: 0, m: 0 };
let practiceCurrent = { h: 9, m: 0 }; // Empieza en 9:00
let quizTarget = { h: 0, m: 0 }; // Para el Quiz
let score = 0;
const WIN_SCORE = 10;

// Instancias de reloj
let heroClock, hourClock, minuteClock, practiceClock, quizClock;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar relojes
    heroClock = new Clock('hero-clock', { size: 280 });
    
    // Paso 1: Solo importa la hora (aguja minutos fija en 12)
    hourClock = new Clock('clock-hours', { 
        size: 250, 
        minuteHandColor: '#e0e0e0' // Menos visible
    });
    hourClock.updateTime(3, 0);

    // Paso 2: Minutos
    minuteClock = new Clock('clock-minutes', { 
        size: 250,
        hourHandColor: '#e0e0e0' // Menos visible
    });
    minuteClock.updateTime(3, 0);

    // Práctica
    practiceClock = new Clock('clock-practice', {
        size: 250
    });
    
    // Quiz
    quizClock = new Clock('clock-quiz', {
        size: 280
    });
    
    generateNewTarget();
    updatePracticeClock();
    updateScoreUI();

    // Animación del Hero Clock
    setInterval(() => {
        const now = new Date();
        heroClock.updateTime(now.getHours(), now.getMinutes());
    }, 1000);
});

// Navegación
window.goToStep = function(stepId) {
    document.querySelectorAll('.step-section').forEach(el => el.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
    
    // Resetear/Animar entrada si es necesario
    if(stepId === 'step-practice') {
        generateNewTarget();
    } else if(stepId === 'step-quiz') {
        generateQuizQuestion();
    }
}

// Lógica Paso 1: Horas (Sin cambios)
window.changeHour = function(delta) {
    hourState += delta;
    if (hourState > 12) hourState = 1;
    if (hourState < 1) hourState = 12;
    
    document.getElementById('hour-display').textContent = hourState;
    hourClock.updateTime(hourState, 0);
}

// Lógica Paso 2: Minutos (Sin cambios)
window.changeMinute = function(delta) {
    minuteState += delta;
    if (minuteState >= 60) minuteState = 0;
    if (minuteState < 0) minuteState = 55; // Saltos de 5 en 5 idealmente
    
    const displayMin = minuteState.toString().padStart(2, '0');
    document.getElementById('minute-display').textContent = displayMin;
    minuteClock.updateTime(3, minuteState); // Hora fija en 3
}

// Lógica Práctica (Sin cambios significativos)
window.adjustPractice = function(addH, addM) {
    practiceCurrent.h += addH;
    practiceCurrent.m += addM;

    // Manejo de Minutos
    if (practiceCurrent.m >= 60) {
        practiceCurrent.m = 0;
        practiceCurrent.h += 1;
    } else if (practiceCurrent.m < 0) {
        practiceCurrent.m = 55;
        practiceCurrent.h -= 1;
    }

    // Manejo de Horas
    if (practiceCurrent.h > 12) practiceCurrent.h = 1;
    if (practiceCurrent.h < 1) practiceCurrent.h = 12;

    updatePracticeClock();
    document.getElementById('feedback-msg').textContent = ""; // Limpiar mensaje previo
}

function updatePracticeClock() {
    practiceClock.updateTime(practiceCurrent.h, practiceCurrent.m);
}

function generateNewTarget() {
    // Generar hora aleatoria fácil (minutos en múltiplos de 5)
    const h = Math.floor(Math.random() * 12) + 1;
    const m = Math.floor(Math.random() * 12) * 5;
    
    practiceTarget = { h, m };
    
    // Resetear reloj de usuario a algo diferente
    practiceCurrent = { h: 12, m: 0 };
    updatePracticeClock();

    const minStr = m.toString().padStart(2, '0');
    document.getElementById('target-time').textContent = `${h}:${minStr}`;
    document.getElementById('feedback-msg').textContent = "";
}

window.checkAnswer = function() {
    const feedback = document.getElementById('feedback-msg');
    
    // Evitar spam de puntos en la misma pregunta
    if (feedback.textContent.includes("Correcto")) return;

    if (practiceCurrent.h === practiceTarget.h && practiceCurrent.m === practiceTarget.m) {
        feedback.textContent = "¡Correcto! 🎉 ¡Eres un genio!";
        feedback.style.color = "var(--color-grass)";
        updateScore(1);
        setTimeout(generateNewTarget, 2000); // Nueva pregunta
    } else {
        feedback.textContent = "Mmm... inténtalo de nuevo. 😅";
        feedback.style.color = "var(--color-orange)";
        updateScore(-1);
    }
}

// Lógica Quiz: ¿Qué hora es?
window.generateQuizQuestion = function() {
    // 1. Generar hora target
    const h = Math.floor(Math.random() * 12) + 1;
    const m = Math.floor(Math.random() * 12) * 5;
    quizTarget = { h, m };

    // 2. Mostrar en reloj
    quizClock.updateTime(h, m);

    // 3. Generar opciones
    const options = [
        { h: h, m: m, correct: true }, // Correcta
        generateWrongOption(h, m),
        generateWrongOption(h, m)
    ];

    // Mezclar opciones
    options.sort(() => Math.random() - 0.5);

    // 4. Renderizar botones
    const container = document.getElementById('quiz-options');
    container.innerHTML = '';
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        const minStr = opt.m.toString().padStart(2, '0');
        btn.textContent = `${opt.h}:${minStr}`;
        btn.onclick = () => checkQuizAnswer(opt.correct, btn);
        container.appendChild(btn);
    });

    document.getElementById('quiz-feedback').textContent = "";
}

function generateWrongOption(correctH, correctM) {
    // Generar una opción incorrecta pero creíble
    let h = correctH;
    let m = correctM;

    // Estrategia aleatoria: cambiar hora o cambiar minuto
    if (Math.random() > 0.5) {
        h = (h % 12) + 1; // Hora diferente
    } else {
        m = (m + 15) % 60; // Minuto diferente
    }
    
    return { h, m, correct: false };
}

window.checkQuizAnswer = function(isCorrect, btnElement) {
    const feedback = document.getElementById('quiz-feedback');
    const allBtns = document.querySelectorAll('.btn-option');
    
    if(btnElement.disabled) return; // Evitar doble click

    // Deshabilitar botones temporales
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
        btnElement.classList.add('correct');
        feedback.textContent = "¡Sí! ¡Lo conseguiste! 🌟";
        feedback.style.color = "var(--color-grass)";
        updateScore(1);
        setTimeout(() => {
            generateQuizQuestion();
        }, 1500);
    } else {
        btnElement.classList.add('wrong');
        feedback.textContent = "¡Ups! Esa no es. ¡Intenta otra vez!";
        feedback.style.color = "var(--color-orange)";
        updateScore(-1);
        
        // Habilitar de nuevo para que sigan intentando (menos la incorrecta)
        setTimeout(() => {
            allBtns.forEach(b => { 
                if(!b.classList.contains('correct')) b.disabled = false; 
            });
        }, 500);
    }
}

// Sistema de Puntos
function updateScore(points) {
    score += points;
    if (score < 0) score = 0; // No puntos negativos
    updateScoreUI();

    if (score >= WIN_SCORE) {
        showVictory();
    }
}

function updateScoreUI() {
    const el = document.getElementById('score-val');
    if(el) el.textContent = score;
}

function showVictory() {
    const modal = document.getElementById('victory-modal');
    modal.classList.remove('hidden');
    fireConfetti();
}

window.resetGame = function() {
    score = 0;
    updateScoreUI();
    document.getElementById('victory-modal').classList.add('hidden');
    // Reiniciar al home o a práctica?
    goToStep('hero');
}

function fireConfetti() {
    // Simple confetti effect
    const colors = ['#FFE66D', '#4D96FF', '#6BCB77', '#FF6B6B'];
    const container = document.getElementById('confetti-canvas');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const confetto = document.createElement('div');
        confetto.style.width = '10px';
        confetto.style.height = '10px';
        confetto.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetto.style.position = 'absolute';
        confetto.style.left = Math.random() * 100 + '%';
        confetto.style.top = '-10px';
        confetto.style.borderRadius = '50%';
        confetto.style.animation = `fall ${Math.random() * 3 + 2}s linear infinite`;
        container.appendChild(confetto);
    }
}

// Añadir estilos de animación dinámicamente o en CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fall {
    to { transform: translateY(100vh) rotate(720deg); }
}
#confetti-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999;
}
`;
document.head.appendChild(styleSheet);
