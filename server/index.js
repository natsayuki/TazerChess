// requireing needed packages
const express = require('express');
const http = require('http');
const path = require('path');
const util = require('util');
const spawn = require('child_process').spawn;
const cors = require('cors');
const fetch = require('node-fetch');

let prevWDL = 0;
let pgn = '';

// server setup
const app = express();
app.use(cors());
const server = http.Server(app);

app.get('/reset', (req, res) => {
  prevWDL = 0;
  pgn = '';

  console.log('reset');

  res.send('success');
});

// ready to accept get requests
app.get('/api', (req, res) => {
  // Gets pgn from url params
  pgn += `${req.query.pgn}_`;


  getWDL(req, res, pgn, prevWDL);

});

function getWDL(req, res, moves, lastWDL){

  // Get if player is white from url params
  let isWhite = req.query.iswhite;
  isWhite = isWhite == 'true';

  const turn = moves.split('_').length - 1;


  // Create python spawn to evaluate game state
  const py = spawn('python', ['py/chesseval.py', pgn]);

  // Handle data from Python script
  py.stdout.on('data', data => {
    wdl = parseFloat(data.toString('utf8'));

    const move = moves.split('_').length - 1;

    // Set weight based on range of WDl
    let weight = 6;
    if(lastWDL > -5 && lastWDL < 5) weight = 3;

    const diff = wdl - lastWDL;

    let advantage = 'nuetral'
    if(diff > 0) advantage = 'white';
    if(diff < 0) advantage = 'black';

    let type = 'Neutral';
    if(diff > weight && !isWhite) type = 'Blunder';
    if(diff < -weight && isWhite) type = 'Blunder';

    prevWDL = wdl;

    if(type == 'Blunder'){
      fetch('http://192.168.1.69:3001');
    }

    // console.log(moves);
    console.log(`${move}. ${wdl} adv ${advantage} ${type}`);

    // Sends JSON result to client
    res.send({
      'analysis': wdl,
      'advantage': advantage,
      'type': type,
    });
  });
}

// sets static dir
app.use(express.static(__dirname));

// port is either provided by Heroku or defaults to 3000
let port = process.env.PORT || 3001;

// start server listening
app.listen(port, () => {
  console.log(`server up on port ${port}`);
});
