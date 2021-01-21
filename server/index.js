// requireing needed packages
const express = require('express');
const http = require('http');
const path = require('path');
const util = require('util');
const ffish = require('ffish');


// server setup
const app = express();
const server = http.Server(app);

ffish['onRuntimeInitialized'] = () => {
  // ready to accept get requests
  app.get('/api', (req, res) => {
    // Gets pgn from url params
    let pgn = req.query.pgn

    // Converts pgn from string to actual pgn
    pgn = pgn.replace(/_/gm, ' ');
    pgn = pgn.replace(/-/gm, '=');

    // create game with pgn data
    const game = ffish.readGamePGN(pgn);
    const moves = game.mainlineMoves().split(' ');

    // Creates new chess board
    let board = new ffish.Board('chess');

    // adds the moves to the board
    moves.forEach(move => {
      board.push(move);
    });

    console.log(board.toString());
    console.log(ffish.evaluation());

    // console.log(util.inspect(board, {showHidden: true, depth: null}))

    // Sends JSON result to client
    // dummy data for now
    res.send({
      'advantage': 420
    });
  });
}

// sets static dir
app.use(express.static(__dirname));

// port is either provided by Heroku or defaults to 3000
let port = process.env.PORT || 3000;

// start server listening
server.listen(port, () => {
  console.log(`server up on port ${port}`);
});
