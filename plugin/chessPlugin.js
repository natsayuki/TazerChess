// vars
let resignFlag;
let gameStarted = false;
let gameState = '';
let prevGameState;

// main interval to handle chess scrapper and WDL grabbing
setInterval(function(){
  // Searches page for resign flag to tell if a game is in progress
  resignFlag = document.querySelector('span.icon-font-chess.flag');
  gameStarted = resignFlag != null;

  // sets previous gamestate
  prevGameState = gameState;

  if(gameStarted){
    // sets game state
    gameState = fetchPGN();

    if(gameState != prevGameState){
      // URL for node server that calcs WDL
      const url = `http://localhost:3001/api?pgn=${pgnToApiString(gameState)}`;
      
      fetch(url)
      .then(res => res.json())
      .then(data => {
        // gets WDL from the response from the API
        const wdl = data.advantage
        console.log(wdl);
      });
    }
  }
}, 200);

// function for getting PGN of current game
// Param: `long` allows for full vs abreviated PGN
function fetchPGN(long){
  // Gets list of moves from the HTML
  const moves = document.querySelectorAll('.move');
  let pgn = '';

  // PGN headers for long version
  if(long) pgn += `[Event "api check"][Site "Chess.com"][Date "???"][Round "?"][White "White"][Black "Black"][Variant "chess"]`;

  // Loops through moves from the webpage
  moves.forEach((move, index) => {
    // Adds turn numbers for long version
    if(long) pgn += `${index + 1}. `;

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

  // Adds * onto end if long form
  if(long) pgn += '*';

  // returns pgn
  return pgn;
}

// function turning PGN into a string that can be sent to the Node server API
// Param: `pgn` is PGN to be converted
function pgnToApiString(pgn){
  // replaces spaces with underscores
  pgn = pgn.replace(/\s/gm, '_');

  // replaces `=` with `-`
  pgn = pgn.replace(/=/gm, '-');

  // returns the abridged PGN
  return pgn
}
