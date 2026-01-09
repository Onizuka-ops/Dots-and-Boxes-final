
export const H = 0;
export const V = 1;

export function edgeToIndex(r , c , orientation , size){    // 0 based indexing
  if(orientation == H && c < size-1){
    return (size-1)*r + c
  }
  else if (orientation == V && r < size-1){
    return ((size*r) + c)+(size)*(size-1);
  }
  else{
      return "Invalid Edge";
  }
}
export function indexToEdge(index, size) {
  const horizontalEdges = size * (size - 1);

  if (index >= 0 && index < horizontalEdges) {
    let r = Math.floor(index / (size - 1));
    let c = index % (size - 1);
    return [r, c, H];
  } else if (index >= horizontalEdges && index < 2 * horizontalEdges) {
    index -= horizontalEdges;
    let r = Math.floor(index / size);
    let c = index % size;
    return [r, c, V];
  } else {
    return "Invalid Index";
  }
}

export function getTotalEdges(size){
  return 2*(size)*(size-1);
}
export function getTotalBoxes(size){
return (size-1)**2;

}
export function getBoxEdges(BoxIndex , size){    // 0 based indexing
   // we will first find the top left coordinate of the box and deduce all others
  if(BoxIndex < (size-1)**2 && BoxIndex >=0 ){
          let topleftx = Math.floor(BoxIndex/(size-1));
          let toplefty = BoxIndex%(size-1);


          let toprightx = topleftx;
          let toprighty = toplefty+1;

          let bottomleftx = topleftx+1;
          let bottomlefty = toplefty;

          let edges = [edgeToIndex(topleftx , toplefty , H , size) , edgeToIndex(topleftx , toplefty , V , size) , edgeToIndex(toprightx , toprighty , V , size) , edgeToIndex(bottomleftx ,bottomlefty , H , size)]
          return edges;

  }
}

export function createGame(size){

  const obj = {
    size : size ,
    edges: new Array(getTotalEdges(size)).fill(null),
    boxes : new Array(getTotalBoxes(size)).fill(null),
    currentPlayer: 0,
    scores : [0,0]
  }
  return obj;
}

export function isGameOver(state){
  return state.boxes.every(box => box !== null);
}

export function isValidMove(state , move){
  const edgeIndex = move.edgeIndex;

  if(!isGameOver(state)){
    if(edgeIndex >= 0 && edgeIndex < state.edges.length){
      if(state.edges[edgeIndex] == null){
        return true;
      }
    }
  }
  return false;
}


export function getBoxesForEdge(edgeIndex , size){
 const boxes = [];
 const rowcol = indexToEdge(edgeIndex , size);
 const row = rowcol[0];
 const col = rowcol[1];
 const dir = rowcol[2];
     if(dir == 0){
      if(row > 0){  boxes.push((row-1)*(size-1) + col)}
      if(row < (size-1)){boxes.push(row*(size-1) + col)}
    }
    if(dir == 1){
      if(col > 0){boxes.push(row*(size-1) + (col-1))}
      if(col < (size-1)){boxes.push(row*(size-1) + col)}
    }
    return boxes;
}


export function applyMove(state , move){
  const edgeIndex = move.edgeIndex;   // get the index of edge clicked

  state.edges[edgeIndex] = state.currentPlayer;

  const affectedBoxes = getBoxesForEdge(edgeIndex , state.size);   // array of boxes affected by edge

  let completedBoxes = 0;
  for(let box of affectedBoxes){
    let isAllTaken = true;
    for (let edge of getBoxEdges(box, state.size)) {
    if (edge === -1 || state.edges[edge] === null) {
      isAllTaken = false;
      break;
    }
    }
    if (isAllTaken && state.boxes[box] == null){
      state.boxes[box] = state.currentPlayer;
      completedBoxes++;

    }

  }


  state.scores[state.currentPlayer] += completedBoxes;
  if(completedBoxes == 0){
    state.currentPlayer = 1 - state.currentPlayer;
  }




}
