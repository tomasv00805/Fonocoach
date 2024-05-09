// Selecciona el contenedor del grid mediante su clase CSS
const gridContainer = document.querySelector(".grid-container");
const botonstart = document.querySelector(".start")
const felicidades= document.querySelector(".felicidades")
const actions= document.querySelector(".actions")


// Array para almacenar las cartas
let cards = [];

// Variables para las dos cartas que se comparan
let firstCard, secondCard;

// Variable para bloquear el tablero durante la comparacion de cartas
let lockBoard = false;

// Puntuacion inicial
let score = 0;
let matchsnv1=0;

// Muestra la puntuacion inicial en el marcador
document.querySelector(".score").textContent = score;



// Funcion para mezclar las cartas  
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// Funcion para generar las cartas en el tablero
function generateCards(grid, n, dificultad) {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    grid.style.display = "grid"
    grid.appendChild(cardElement);
    cardElement.addEventListener("click", function() {
      flipCard(cardElement, n, dificultad); // Pasar el elemento de la carta como argumento
    });
    // Voltear automáticamente la carta después de 3 segundos
    setTimeout(() => {
      cardElement.classList.add("flipped");
      setTimeout(() => {
        cardElement.classList.remove("flipped");
      }, 3000);
    }, 0);
  }
}

function flipCard(cardElement, n, dificultad) {
  if (lockBoard) return;
  if (cardElement === firstCard) return;

  cardElement.classList.add("flipped");

  if (!firstCard) {
    firstCard = cardElement;
    return;
  }

  secondCard = cardElement;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch(n, dificultad);
}

// Funcion para verificar si las dos cartas volteadas coinciden
function checkForMatch(n, dificultad) {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if(isMatch){
    disableCards()
    matchsnv1 ++
    console.log(matchsnv1)
  }else{
    unflipCards();
  }
  if(matchsnv1===n){

    gridContainer.style.display="none"
    actions.style.display= "flex"
    const pacienteId = sessionStorage.getItem('pacienteId');

    // Construir los datos de la sesión de juego
    const nombreDelJuego = "Memoria"; // Reemplaza con el nombre del juego
    const nivel = dificultad; // Reemplaza con el nivel del juego
    const cantidadDeIntentos = score; // Usar la puntuación como cantidad de intentos

    // Construir el cuerpo de la solicitud
    const body = JSON.stringify({
        nombreDelJuego,
        nivel,
        cantidadDeIntentos
    });

    // Realizar la solicitud fetch para registrar la sesión de juego
    fetch(`http://localhost:9000/api/juego/registrarSesion/${pacienteId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then(response => {
        if (response.ok) {
            console.log('Sesión de juego registrada exitosamente');
            // Ocultar el grid y mostrar las acciones
            gridContainer.style.display = "none";
            actions.style.display = "flex";
        } else {
            console.error('Error al registrar la sesión de juego');
            // Manejar el error
        }
    })
    .catch(error => {
        console.error('Error al registrar la sesión de juego:', error);
        // Manejar el error
    });
  }
}

// Funcion para desactivar dos cartas si coinciden
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

// Funcion para voltear de nuevo dos cartas si no coinciden
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Funcion para reiniciar el juego
function restart1() {
  resetBoard();
  shuffleCards();
  score = 0;
  matchsnv1=0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards(gridContainer);
}

function startgame(){
  // Carga los datos de las cartas desde un archivo JSON
  const dificultadElement = document.getElementById("dificultad");
  
  // Obtener el texto dentro del elemento h1
  const dificultad = dificultadElement.textContent.trim().toLowerCase(); // Se convierte a minúsculas para evitar problemas de capitalización
  
  // Realizar diferentes acciones dependiendo del contenido del h1
  if (dificultad === "facil") {
    // Acciones para el nivel fácil
    fetch("../data/cartasfacil.json")
    .then((res) => res.json())
    .then((data) => {
      cards = [...data, ...data];
      shuffleCards();
      generateCards(gridContainer,4,dificultad);
      botonstart.style.display = "none";
    });
  }else if(dificultad === "medio"){
    fetch("../data/cartasmedio.json")
    .then((res) => res.json())
    .then((data) => {
      cards = [...data, ...data];
      shuffleCards();
      const numeroDeColumnas = 5; // Define el número de columnas que deseas
      gridContainer.style.gridTemplateColumns = `repeat(${numeroDeColumnas}, 140px)`;
      generateCards(gridContainer,5,dificultad);
      botonstart.style.display = "none";
    });
  }else{
    fetch("../data/cards.json")
    .then((res) => res.json())
    .then((data) => {
      cards = [...data, ...data];
      shuffleCards();
      const numeroDeColumnas = 9; // Define el número de columnas que deseas
      gridContainer.style.gridTemplateColumns = `repeat(${numeroDeColumnas}, 140px)`;
      generateCards(gridContainer,9,dificultad);
      botonstart.style.display = "none";
    });
  }
}

function redirectToNextLevel(url) {
  window.location.href = url;
}