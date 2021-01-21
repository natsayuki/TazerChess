import chess
import chess.engine
import chess.pgn
import sys
import io

# read PGN from command line args
pgn = sys.argv[1]

# turn edited PGN into actual PGN
pgn = pgn.replace('_', ' ')
pgn = pgn.replace('-', '=')

# pretend PGN is being read from file stream
pgn = io.StringIO(pgn)

# load PGN into chess game
game = chess.pgn.read_game(pgn)

# set game to most current move and get board
game = game.end()
board = game.board()

# open stockfish 12
engine = chess.engine.SimpleEngine.popen_uci('stockfish')

# analyse current game to depth of 20
info = engine.analyse(board, chess.engine.Limit(depth=20))

# get the WDL score from the analyse
score = info['score'].white().score() / 100
print(score)
