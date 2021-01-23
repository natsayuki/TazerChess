console.log('infiltrated');

// vars
let gameState = '';
let prevGameState;

setInterval(function(){
  // sets previous gamestate
  prevGameState = gameState;

  // sets game state
  gameState = fetchPGN();

  if(gameState != prevGameState && recentMove(gameState)){

    const isWhite = 

    // If it is the first move of the game, reset the WDL on server
    if(gameState.split(' ').length - 1 == 1) fetch('http://localhost:3001/reset');


    // URL for node server that calcs WDL
    const url = `http://localhost:3001/api?pgn=${recentMove(gameState)}&iswhite=true`;
    console.log(recentMove(gameState));

    fetch(url)
    .then(res => res.json())
    .then(data => {
      // gets WDL from the response from the API
      const wdl = data.advantage
    });
  }
}, 250);


// function for getting PGN of current game
function fetchPGN(){
  // Gets list of moves from the HTML
  const moves = document.querySelectorAll('.move');
  let pgn = '';

  // Loops through moves from the webpage
  moves.forEach((move, index) => {
    // parses HTML within each move element to get PGN
    move.querySelectorAll('.node').forEach(node => {
      // Child is the element that contains raw PGN vs an image
      let child = 0;
      if(node.textContent.indexOf('=') != -1) child = 1;

      // Gets classes of the image child to parse images to PGN
      const classes = node.childNodes[child].className;
      let piece = '';
      if(classes){
        if(classes.indexOf('rook') != -1) {piece = 'R'}
        if(classes.indexOf('knight') != -1) {piece = 'N'}
        if(classes.indexOf('bishop') != -1) {piece = 'B'}
        if(classes.indexOf('king') != -1) {piece = 'K'}
        if(classes.indexOf('queen') != -1) {piece = 'Q'}
      }

      // If there is an =, it is a pawn assension and PGN is swapped
      if(node.textContent.indexOf('=') != -1) pgn += `${node.textContent}${piece} `;

      // Normal PGN order
      else pgn += `${piece}${node.textContent} `;
    });
  });

  // returns pgn
  return pgn;
}

function recentMove(pgn){
  pgn = pgn.split(' ');
  return pgn[pgn.length - 2];
}
