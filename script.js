const preguntasDesafio = {
    1: { p: "¿Qué comando usamos para mostrar un texto en la pantalla?\n(Tema: print)", o: ['print("Hola")', 'mostrar("Hola")', 'escribir "Hola"'], r: 0 },
    2: { p: "¿Qué usamos para pedirle al usuario que escriba un dato desde el teclado?\n(Tema: input)", o: ['input()', 'read()', 'get()'], r: 0 },
    3: { p: "Si queremos que dos condiciones se cumplan al mismo tiempo, ¿qué operador lógico usamos?\n(Tema: Operadores Lógicos)", o: ['or', 'and', 'not'], r: 1 },
    4: { p: "¿Cuál es el símbolo correcto para ver si dos variables son exactamente iguales?\n(Tema: Condicionales)", o: ['=', '==', '==='], r: 1 },
    5: { p: "En una condición, si el 'if' es falso, ¿qué palabra evalúa una segunda opción?\n(Tema: Condicionales)", o: ['else', 'elif', 'otherwise'], r: 1 },
    6: { p: "¿Qué tipo de bucle se ejecuta MIENTRAS una condición sea verdadera?\n(Tema: while)", o: ['for', 'repeat', 'while'], r: 2 },
    7: { p: "Si un bucle tiene la condición 'while True:', ¿cuántas veces se repetirá?\n(Tema: while)", o: ['Ninguna', 'Para siempre (infinito)', 'Solo 10 veces'], r: 1 },
    8: { p: "¿Qué función nos ayuda a crear una lista de números en un bucle for?\nEj: for i in ...(5):\n(Tema: for)", o: ['range()', 'list()', 'numbers()'], r: 0 },
    9: { p: "¿Cuál de estos bucles repetirá el código exactamente 3 veces?\n(Tema: for)", o: ['for i in range(3):', 'for i in range(1, 3):', 'while x < 3:'], r: 0 },
    10: { p: "Si una variable 'es_fin_de_semana = False', ¿qué dará la expresión 'not es_fin_de_semana'?\n(Tema: Operadores Lógicos)", o: ['True', 'False', 'None'], r: 0 },
    11: { p: "¿Qué carácter obligatorio se pone al final de la línea del 'if' o del 'while'?\n(Tema: Condicionales)", o: ['; (punto y coma)', '. (punto)', ': (dos puntos)'], r: 2 },
    12: { p: "Al usar input(), ¿qué tipo de dato entrega Python por defecto?\n(Tema: input)", o: ['Texto (str)', 'Número entero (int)', 'Booleano (bool)'], r: 0 }
};

let posicionActual = 0;
const metaCasilla = 12; // Casilla 12 es la meta final
let pasosPendientes = 0;
let respuestasBuenas = 0; // Conteo de aciertos
let intentosFallidos = 0; // Conteo de oportunidades por pregunta

function inicializarTablero() {
    const contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";
    
    for (let i = 12; i >= 0; i--) {
        const div = document.createElement("div");
        div.className = "casilla";
        div.id = `casilla-${i}`;
        
        let nombreCasilla = i === 12 ? "🏁 META: script_final.py" : i === 0 ? "🚀 START: init_project" : `Línea de código [${i}]`;
        div.innerHTML = `<span>${nombreCasilla}</span>`;
        if (i === 12) div.classList.add("meta");
        
        contenedor.appendChild(div);
    }
    actualizarPosicionVisual();
}

function actualizarPosicionVisual() {
    document.querySelectorAll(".casilla").forEach(c => {
        c.classList.remove("activa");
        const token = c.querySelector(".token-noob");
        if (token) token.remove();
    });

    const casillaActiva = document.getElementById(`casilla-${posicionActual}`);
    if (casillaActiva) {
        casillaActiva.classList.add("activa");
        const token = document.createElement("span");
        token.className = "token-noob";
        token.innerText = "🐍 Coder";
        casillaActiva.appendChild(token);
    }
    
    document.getElementById("posicion-texto").innerText = posicionActual;
}

function lanzarDado() {
    const botonDado = document.getElementById("btn-dado");
    const resultado = document.getElementById("resultado-dado");
    
    botonDado.disabled = true;
    intentosFallidos = 0; // Resetear intentos al lanzar el dado
    
    let giros = 0;
    const intervalo = setInterval(() => {
        resultado.innerText = Math.floor(Math.random() * 3) + 1; 
        giros++;
        if (giros > 8) {
            clearInterval(intervalo);
            pasosPendientes = parseInt(resultado.innerText);
            procesarMovimiento();
        }
    }, 80);
}

function procesarMovimiento() {
    posicionActual += pasosPendientes;
    
    if (posicionActual >= 12) {
        posicionActual = 12;
        actualizarPosicionVisual();
        document.getElementById("total-buenas").innerText = respuestasBuenas;
        document.getElementById("modal-victoria").style.display = "flex";
        return;
    }
    
    actualizarPosicionVisual();
    cargarDesafio(posicionActual);
}

function cargarDesafio(casilla) {
    const desafio = preguntasDesafio[casilla];
    const texto = document.getElementById("texto-desafio");
    const opcionesContenedor = document.getElementById("opciones-contenedor");
    const feedback = document.getElementById("feedback-desafio");
    
    opcionesContenedor.innerHTML = "";
    feedback.innerText = "";

    texto.innerText = desafio.p;

    desafio.o.forEach((opcion, index) => {
        const btn = document.createElement("button");
        btn.className = "btn-opcion";
        btn.innerText = opcion;
        btn.onclick = () => evaluarRespuesta(index, desafio.r);
        opcionesContenedor.appendChild(btn);
    });
}

function evaluarRespuesta(seleccionada, correcta) {
    const feedback = document.getElementById("feedback-desafio");
    
    if (seleccionada === correcta) {
        // Respuesta correcta
        document.getElementById("opciones-contenedor").innerHTML = "";
        feedback.className = "correcto";
        feedback.innerText = "✅ ¡Excelente! Código sin errores. ¡Tira el dado para continuar!";
        
        respuestasBuenas++;
        document.getElementById("contador-buenas").innerText = respuestasBuenas;
        document.getElementById("btn-dado").disabled = false;
    } else {
        // Respuesta incorrecta
        intentosFallidos++;
        
        if (intentosFallidos === 1) {
            // Primera oportunidad fallada
            feedback.className = "incorrecto";
            feedback.innerText = "❌ ¡SyntaxError! Tienes una segunda oportunidad. ¡Intenta con otra opción!";
            
            // Desactivar solo el botón que presionó mal para guiarlo
            const botones = document.getElementsByClassName("btn-opcion");
            if (botones[seleccionada]) {
                botones[seleccionada].disabled = true;
                botones[seleccionada].style.backgroundColor = "#475569";
                botones[seleccionada].style.cursor = "not-allowed";
            }
        } else {
            // Segunda oportunidad fallada
            document.getElementById("opciones-contenedor").innerHTML = "";
            feedback.className = "incorrecto";
            feedback.innerText = "❌ Bug persistente... Misión bloqueada. Vuelve a lanzar el dado para seguir avanzando.";
            document.getElementById("btn-dado").disabled = false;
        }
    }
}

function reiniciarJuego() {
    posicionActual = 0;
    respuestasBuenas = 0;
    intentosFallidos = 0;
    document.getElementById("contador-buenas").innerText = respuestasBuenas;
    document.getElementById("modal-victoria").style.display = "none";
    document.getElementById("btn-dado").disabled = false;
    document.getElementById("resultado-dado").innerText = "-";
    document.getElementById("texto-desafio").innerText = "¡Lanza el dado para compilar tu primer script!";
    inicializarTablero();
}

window.onload = inicializarTablero;
