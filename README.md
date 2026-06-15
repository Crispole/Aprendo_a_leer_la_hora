# ⏰ Aprende a leer la hora, Eloísa

Una aplicación web educativa e interactiva diseñada especialmente para que los niños aprendan a leer un reloj analógico de forma divertida y progresiva.

---

## 📖 ¿De qué trata la app?

Esta app fue creada con mucho cariño para **Eloísa**, con el objetivo de enseñarle a leer la hora en un reloj de manecillas de manera intuitiva y sin presión.

El aprendizaje está estructurado en **4 pasos progresivos**:

1. **Pantalla de inicio** — El reloj muestra la hora real del dispositivo, animándose segundo a segundo.
2. **Paso 1 — La aguja corta** — Se explica que la manecilla corta (naranja) indica la **hora**. El usuario puede avanzar y retroceder entre las 12 horas para verlo en acción.
3. **Paso 2 — La aguja larga** — Se explica que la manecilla larga (azul) indica los **minutos**, contando de 5 en 5. El usuario puede manipularla libremente.
4. **Modo Práctica** — Se genera una hora aleatoria y el usuario mueve las manecillas para poner el reloj a esa hora. Al acertar, gana una ⭐ estrella.
5. **Modo Quiz** — Se muestra una hora en el reloj y hay que elegir la opción correcta entre 3 alternativas. ¡Al acertar suma puntos!

Cuando se alcanzan **10 estrellas**, se muestra una pantalla de victoria con confetti y un mensaje de celebración. 🎉

---

## 🛠️ Detalles técnicos

### Stack tecnológico

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica de la app |
| **CSS3 (Vanilla)** | Estilos, animaciones y diseño responsivo |
| **JavaScript (ES6+)** | Lógica de la app, generación del SVG y manejo de estado |
| **SVG** | Renderizado del reloj analógico (generado dinámicamente con JS) |
| **Google Fonts** | Tipografías `Comic Neue` y `Nunito` |

### Arquitectura

El proyecto es una **Single Page Application (SPA)** completamente estática — no requiere servidor ni dependencias externas. Funciona abriendo directamente el `index.html` en cualquier navegador.

```
📁 Aprender a leer la hora/
├── index.html      # Estructura HTML y secciones de la app
├── script.js       # Lógica de la aplicación y clase Clock
└── styles.css      # Sistema de diseño y estilos
```

### Clase `Clock` (script.js)

El reloj analógico es un componente reutilizable basado en SVG, construido desde cero en JavaScript puro mediante la clase `Clock`:

- **`constructor(containerId, options)`** — Crea un reloj en el contenedor indicado. Acepta opciones de tamaño y colores de manecillas.
- **`render()`** — Genera dinámicamente el SVG: esfera, números del 1 al 12, manecilla de horas y de minutos.
- **`updateTime(hours, minutes)`** — Calcula los ángulos de rotación correctos y aplica la transformación `rotate()` a cada grupo de manecillas.
  - Hora: `(h % 12) * 30 + m * 0.5` grados
  - Minutos: `m * 6` grados
- **`animateTo(hours, minutes)`** — Método preparado para futuras animaciones interpoladas.

Se crean **5 instancias independientes** del reloj:
- `heroClock` — Pantalla de inicio (sincronizado con el reloj real)
- `hourClock` — Paso 1 (manecilla de minutos desenfocada)
- `minuteClock` — Paso 2 (manecilla de horas desenfocada)
- `practiceClock` — Modo práctica
- `quizClock` — Modo quiz

### Sistema de diseño (styles.css)

Basado en **CSS Custom Properties** para un diseño consistente y vibrante:

```css
--color-sun:    #FFE66D   /* Amarillo */
--color-sky:    #4D96FF   /* Azul cielo */
--color-grass:  #6BCB77   /* Verde */
--color-orange: #FF6B6B   /* Naranja/rojo */
--font-heading: 'Comic Neue', cursive
--font-body:    'Nunito', sans-serif
```

### Animaciones CSS destacadas

| Animación | Descripción |
|---|---|
| `fadeIn` | Transición suave al cambiar de sección |
| `popIn` | El modal de victoria aparece con efecto de rebote |
| `shake` | Las opciones incorrectas en el quiz vibran |
| `fall` | Confetti cae animado al ganar |
| `cubic-bezier bounce` | Las manecillas del reloj tienen efecto resorte al moverse |

### Sistema de puntos

- ✅ Respuesta correcta en práctica: **+1 punto**
- ❌ Respuesta incorrecta: **-1 punto** (mínimo 0)
- ✅ Respuesta correcta en quiz: **+1 punto**
- 🏆 Al llegar a **10 puntos**: pantalla de victoria con confetti

---

## 🚀 Cómo ejecutar

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Crispole/Aprendo_a_leer_la_hora.git
   ```
2. Abre `index.html` directamente en tu navegador.

¡No se necesita instalar nada! ✨

---

## 📱 Compatibilidad

- ✅ Google Chrome
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari

Diseñado para funcionar en escritorio y tablets. Optimizado para pantallas desde 320px de ancho.

---

*Hecho con ❤️ para Eloísa*
