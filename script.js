const preguntasDesafio = {
    1: { p: "¿Cuál es la forma correcta de mostrar un mensaje en Python? (Tema: print)", o: ['print("Hola")', 'print Hola', 'echo("Hola")'], r: 0 },
    2: { p: "Queremos guardar el nombre del usuario desde el teclado. ¿Qué código usamos? (Tema: input)", o: ['nombre = read()', 'nombre = input("Dime tu nombre: ")', 'input = nombre'], r: 1 },
    3: { p: "Si queremos comprobar si una persona es mayor de edad Y tiene boleto, ¿qué operador lógico usamos? (Tema: Operadores Lógicos)", o: ['and', 'or', 'not'], r: 0 },
    4: { p: "¿Cómo se escribe correctamente una condición en Python? (Tema: Condicionales)", o: ['if x == 5 then:', 'if x = 5:', 'if x == 5:'], r: 2 },
    5: { p: "¿Qué palabra clave se usa en un 'if' si la primera condición fue falsa y queremos evaluar otra? (Tema: Condicionales)", o: ['else if', 'elif', 'elseif'], r: 1 },
    6: { p: "Queremos que un bucle 'while' se ejecute para siempre de forma infinita. ¿Cómo lo escribimos? (Tema: while)", o: ['while True:', 'while siempre:', 'while loop:'], r: 0 },
    7: { p: "¿Qué le falta a este bucle para que no tenga un error de sintaxis?\nx = 1\nwhile x < 5\n    print(x) (Tema: while)", o: ['Los paréntesis () en la condición', 'Dos puntos (:) al final de la línea del while', 'Cambiar x por una variable local'], r: 1 },
    8: { p: "¿Cuántas veces se imprimirá la palabra 'Python' en este bucle?\nfor i in range(3):\n    print(\"Python\") (Tema: for)", o: ['2 veces', '3 veces', '4 veces'], r: 1 },
    9: { p: "¿Cuál es la estructura correcta para recorrer una lista llamada 'colores'? (Tema: for)", o: ['for color in colores:', 'for each color in colores:', 'for i = 1 to colores:'], r: 0 },
    10: { p: "Si una variable 'tiene_llave = False', ¿qué devolverá la expresión 'not tiene_llave'? (Tema: Operadores Lógicos)", o: ['True', 'False', 'None'], r: 0 },
    11: { p: "Al usar input(), ¿en qué formato o tipo de dato recibe Python la respuesta del alumno por defecto? (Tema: input)", o: ['Número entero (int)', 'Texto / Cadena (str)', 'Booleano (bool)'], r: 1 },
    12: { p: "¿Qué error tiene esta línea de código?\nprint(\"Me encanta Python') (Tema: print)", o: ['Las comillas no coinciden (abre doble y cierra simple)', 'Le falta un punto y coma al final', 'La palabra print debe ir en mayúsculas'], r: 0 }
};

let posicionActual = 0;
const metaCasilla = 13; // Casilla 13 es la meta final
let pasosPendientes = 0;

function inicializarTablero() {
    const contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";
    
    // Generar casillas del 12 al 0 de forma descendente en pantalla
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
    
    let giros = 0;
    const intervalo = setInterval(() => {
        resultado.innerText = Math.floor(Math.random() * 3) + 1; // Dados del 1 al 3 para controlar el ritmo de avance
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
    document.getElementById("opciones-contenedor").innerHTML = "";

    if (seleccionada === correcta) {
        feedback.className = "correcto";
        feedback.innerText = "✅ ¡Excelente! Código compilado sin errores. Puedes volver a lanzar el dado.";
        document.getElementById("btn-dado").disabled = false;
    } else {
        feedback.className = "incorrecto";
        feedback.innerText = "❌ IndentationError / SyntaxError... Tu script falló y retrocedes 1 línea.";
        setTimeout(() => {
            if (posicionActual > 0) posicionActual--;
            actualizarPosicionVisual();
            document.getElementById("btn-dado").disabled = false;
            document.getElementById("texto-desafio").innerText = "¡Lanza el dado para intentar procesar tu código de nuevo!";
            feedback.innerText = "";
        }, 2500);
    }
}

function reiniciarJuego() {
    posicionActual = 0;
    document.getElementById("modal-victoria").style.display = "none";
    document.getElementById("btn-dado").disabled = false;
    document.getElementById("resultado-dado").innerText = "-";
    document.getElementById("texto-desafio").innerText = "¡Lanza el dado para compilar tu primer script!";
    inicializarTablero();
}

window.onload = inicializarTablero;
