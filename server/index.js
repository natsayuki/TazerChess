// requireing needed packages
const express = require('express');
const http = require('http');
const path = require('path');
const util = require('util');
const spawn = require('child_process').spawn;
const cors = require('cors');

let prevWDL = 0;
let turn = true;
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

  // Get if player is white from url params
  let isWhite = req.query.iswhite;
  isWhite = isWhite == 'true';

  // Create python spawn to evaluate game state
  const py = spawn('python', ['py/chesseval.py', pgn]);

  // Handle data from Python script
  py.stdout.on('data', data => {
    wdl = parseFloat(data.toString('utf8'));

    const move = pgn.split('_').length - 1;

    // Set weight based on range of WDl
    let weight = 6;
    if(wdl > -5 && wdl < 5) weight = 3;

    const diff = wdl - prevWDL;

    let advantage = 'nuetral'
    if(diff > 0) advantage = 'white';
    if(diff < 0) advantage = 'black';

    let type = 'Neutral';
    if(Math.abs(diff) > weight) type = 'Blunder';

    // if(isWhite == turn){
    //   prevWDL = wdl;
    // }

    prevWDL = wdl;

    console.log(pgn);
    console.log(`${move}. ${wdl} adv ${advantage} ${type}`);

    // Sends JSON result to client
    res.send({
      'analysis': wdl,
      'advantage': advantage,
      'type': type,
    });

    turn = !turn;
  });

});

// sets static dir
app.use(express.static(__dirname));

// port is either provided by Heroku or defaults to 3000
let port = process.env.PORT || 3001;

// start server listening
app.listen(port, () => {
  console.log(`server up on port ${port}`);
});
