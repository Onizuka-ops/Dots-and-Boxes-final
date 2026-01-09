import {
  H,
  V,
  edgeToIndex,
  indexToEdge,
  getTotalEdges,
  getTotalBoxes,
  getBoxEdges,
  createGame,
  isGameOver,
  isValidMove,
  getBoxesForEdge,
  applyMove
} from "./gameLogic.js";




const params = new URLSearchParams(window.location.search);
const size = parseInt(params.get("size")) || 4;
let state = createGame(size);


const myPlayerId = Math.random() < 0.5 ? 0 : 1;


// Layout constants - these define pixel-perfect alignment
const DOT = 12;      // dot diameter
const GAP = 48;      // center-to-center distance between dots
const EDGE_THICKNESS = 8;  // edge thickness

const board = document.getElementById("board");
board.style.position = "relative";
board.style.width = `${(size - 1) * GAP + DOT}px`;
board.style.height = `${(size - 1) * GAP + DOT}px`;
board.style.margin = "auto";

// Create dots at grid intersections
for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    // Position dots so their center is at (c * GAP + DOT/2, r * GAP + DOT/2)
    dot.style.left = `${c * GAP}px`;
    dot.style.top = `${r * GAP}px`;
    dot.style.width = `${DOT}px`;
    dot.style.height = `${DOT}px`;
    board.appendChild(dot);
  }
}

// Create horizontal edges - span from one dot center to the next
for (let r = 0; r < size; r++) {
  for (let c = 0; c < size - 1; c++) {
    const edge = document.createElement("div");
    edge.className = "edge h";
    edge.dataset.r = r;
    edge.dataset.c = c;
    edge.dataset.orientation = H;
    edge.dataset.edgeIndex = edgeToIndex(r, c, edge.dataset.orientation, size);

    // Edge starts at dot center and spans to next dot center
    const edgeLength = GAP - DOT;
    edge.style.left = `${c * GAP + DOT}px`;  // Start after the dot
    edge.style.top = `${r * GAP + (DOT - EDGE_THICKNESS) / 2}px`;  // Center vertically on dot
    edge.style.width = `${edgeLength}px`;
    edge.style.height = `${EDGE_THICKNESS}px`;

    addEdgeLogic(edge);
    board.appendChild(edge);
  }
}

// Create vertical edges - span from one dot center to the next
for (let r = 0; r < size - 1; r++) {
  for (let c = 0; c < size; c++) {
    const edge = document.createElement("div");
    edge.className = "edge v";
    edge.dataset.r = r;
    edge.dataset.c = c;
    edge.dataset.orientation = V;
    edge.dataset.edgeIndex = edgeToIndex(r, c, edge.dataset.orientation, size);

    // Edge starts at dot center and spans to next dot center
    const edgeLength = GAP - DOT;
    edge.style.left = `${c * GAP + (DOT - EDGE_THICKNESS) / 2}px`;  // Center horizontally on dot
    edge.style.top = `${r * GAP + DOT}px`;  // Start after the dot
    edge.style.width = `${EDGE_THICKNESS}px`;
    edge.style.height = `${edgeLength}px`;

    addEdgeLogic(edge);
    board.appendChild(edge);
  }
}

// Create boxes - positioned to fill the space between 4 dots
for (let r = 0; r < size - 1; r++) {
  for (let c = 0; c < size - 1; c++) {
    const box = document.createElement("div");
    box.classList.add("box");

    const boxIndex = r * (size - 1) + c;
    box.dataset.boxIndex = boxIndex;

    // Box fills the area between 4 dots (inside the edges)
    const boxSize = GAP - DOT;
    box.style.position = "absolute";
    box.style.left = `${c * GAP + DOT}px`;
    box.style.top = `${r * GAP + DOT}px`;
    box.style.width = `${boxSize}px`;
    box.style.height = `${boxSize}px`;

    board.appendChild(box);
  }
}


const edgeElements = document.querySelectorAll(".edge");
const boxElements  = document.querySelectorAll(".box");

const scoreP0 = document.getElementById("score-p0");
const scoreP1 = document.getElementById("score-p1");
const turnEl  = document.getElementById("turn");
const statusEl = document.getElementById("status");

turnEl.textContent = `Player ${state.currentPlayer + 1}'s Turn`;



function render(state) {
console.log("render called", state.boxes);

edgeElements.forEach(edge => {
  edge.classList.remove("active", "p0", "p1");
});

boxElements.forEach(box => {
  box.classList.remove("p0", "p1");
});


  state.edges.forEach((owner, i) => {
    const edge = edgeElements[i];
    if (owner !== null) {
      edge.classList.add("active");
      edge.classList.add(owner === 0 ? "p0" : "p1");
    }},
    state.boxes.forEach((owner, i) => {
    if (owner !== null) {
      const box = boxElements[i];
      box.classList.add(owner === 0 ? "p0" : "p1");
    }
  }));

  scoreP0.textContent = state.scores[0];
  scoreP1.textContent = state.scores[1];
  turnEl.textContent = `Player ${state.currentPlayer + 1}`;
      if (isGameOver(state)) {
    statusEl.textContent =
      state.scores[0] > state.scores[1]
        ? "Player 1 Wins!"
        : state.scores[1] > state.scores[0]
        ? "Player 2 Wins!"
        : "Draw!";
  } else {
    statusEl.textContent = `Player ${state.currentPlayer + 1}'s Turn`;
  }
}




function addEdgeLogic(edge) {
edge.addEventListener("click", () => {
  if (isGameOver(state)) return;

  const edgeIndex = Number(edge.dataset.edgeIndex);
  const move = { edgeIndex };

  if (isValidMove(state, move)) {
    applyMove(state, move);
    render(state);

  }
});

}
document.getElementById("reset").addEventListener("click", () => {
  state = createGame(size);
  render(state);
});
