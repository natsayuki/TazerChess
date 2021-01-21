console.log('infiltrated');

let resignFlag;
let gameStarted = false;
let gameState = '';
let prevGameState;

setInterval(function(){
  resignFlag = document.querySelector('span.icon-font-chess.flag');
  gameStarted = resignFlag != null;

  prevGameState = gameState;

  if(gameStarted){
    gameState = fetchPGN();

    if(gameState != prevGameState){
      console.log(pgnToApiString(gameState));
      console.log(gameState);
    }
  }
}, 200);

function fetchPieces(){
  const pieces = document.querySelectorAll('.piece');
  pieces.forEach(piece => {
    const classes = piece.className.split(' ');
    classes[2] = classes[2].substring(7, 9);

  });
}

function initGameState(){
  const state = [];
  for(let x = 0; x < 8; x++){
    const row = [];
    for(let y = 0; y < 8; y++){
      row.push('*');
    }
    state.push(row);
  }
  return state;
}

function fetchPGN(long){
  const moves = document.querySelectorAll('.move');
  let pgn = '';
  if(long) pgn += `[Event "api check"][Site "Chess.com"][Date "???"][Round "?"][White "White"][Black "Black"][Variant "chess"]`;
  moves.forEach((move, index) => {
    if(long) pgn += `${index + 1}. `;
    move.querySelectorAll('.node').forEach(node => {
      let child = 0;
      if(node.textContent.indexOf('=') != -1) child = 1;
      const classes = node.childNodes[child].className;
      let piece = '';
      if(classes){
        if(classes.indexOf('rook') != -1) {piece = 'R'}
        if(classes.indexOf('knight') != -1) {piece = 'N'}
        if(classes.indexOf('bishop') != -1) {piece = 'B'}
        if(classes.indexOf('king') != -1) {piece = 'K'}
        if(classes.indexOf('queen') != -1) {piece = 'Q'}
      }
      if(node.textContent.indexOf('=') != -1) pgn += `${node.textContent}${piece} `;
      else pgn += `${piece}${node.textContent} `;
    });
  });
  if(long) pgn += '*';
  return pgn;
}

function pgnToApiString(pgn){
  pgn = pgn.replace(/\s/gm, '_');
  pgn = pgn.replace(/=/gm, '-');
  return pgn
}
