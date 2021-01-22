// requireing needed packages
const express = require('express');
const http = require('http');
const path = require('path');
const util = require('util');
const spawn = require('child_process').spawn;
const cors = require('cors');

// server setup
const app = express();
app.use(cors());
const server = http.Server(app);

// ready to accept get requests
app.get('/api', (req, res) => {
  // Gets pgn from url params
  let pgn = req.query.pgn

  // Create python spawn to evaluate game state
  const py = spawn('python', ['py/chesseval.py', pgn]);

  // Handle data from Python script
  py.stdout.on('data', data => {
    wdl = parseFloat(data.toString('utf8'));
    console.log(`WDL: ${wdl}`);

    // Sends JSON result to client
    // dummy data for now
    res.send({
      'advantage': wdl
    });
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
