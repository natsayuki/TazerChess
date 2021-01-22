# Tazer Chess

This is a project that is supposed to help me get better at chess.

I am too lazy to actually learn chess, so the idea is that I will
get tazed every time I blunder. This will with out a doubt make me
a better chess player.  

There are two parts:
 1. The browser plugin
 2. The server

## Plugin

### Read the chess game

The browser plugin is written for FireFox and runs on https://chess.com.
The plugin detects when a game has started when the surrender flag is
present on the page, and starts working from there. Chess.com was really
helpful in the fact that it transcribes the chess game as it is happening
on the right side of the board. The plugin scrapes through all of that and
converts it into PGN which is a format used to essentially write out
chess games.

## Server

The server uses Express and Node.js to operate. Its only purpose is to
serve as a simple API between the plugin and the Stockfish chess engine.
The server receives PGN data through the API which it immediately sends
to a child Python script. The Python script serves as the middle man between
the Express server and Stockfish. The Stockfish engine evaluates the current
chess game state based on the PGN data and sends its evaluation back
to the Express server. The Express server keeps track of the evaluations
throughout the game and will detect blunders. A blunder is defined as follows:

```
If the evaluation is > -5, < 5, and the absolute value of the difference
between the current evaluation and the previous evaluation is > 3, the move
is a blunder.
```

```
If the evaluation is < -5 or > 5, and the absolute value of the difference
between the current evaluation and the previous evaluation is > 6, the move
is a blunder.
```

## The future

If the server determines that the move is a blunder, a request will be sent
to a Raspberry Pi running another Node.js server that will be able to
tell a TENS unit to send electric shocks. 
