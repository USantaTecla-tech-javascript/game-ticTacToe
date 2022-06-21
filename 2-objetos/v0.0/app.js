const { Console } = require("./console");

const console = new Console();
playTicTacToe();

function playTicTacToe() {
  do {
    playGame();
  } while (isResumed());
}

function playGame() {
  let game = initGame();
  let winner;
  do {
    writelnTokens(game);
    placeToken(game);
    winner = isTicTacToe(game);
    if (!winner) {
      nextTurn(game);
    }
  } while (!winner);
  writelnTokens(game);
  console.writeln(`Victoria para ${getToken(game)}`);
}

function initGame() {
  let game = {
    turn: 0,
    MAX_PLAYERS: 2,
    TOKEN_X: `X`,
    TOKEN_Y: `Y`,
    TOKEN_EMPTY: ` `,
    MAX_TOKENS: 3,
    tokens: []
  };
  for (let i = 0; i < game.MAX_TOKENS; i++) {
    game.tokens[i] = [];
    for (let j = 0; j < game.MAX_TOKENS; j++) {
      game.tokens[i][j] = game.TOKEN_EMPTY;
    }
  }
  return game;
}

function placeToken(game) {
  console.writeln(`Turno para ${getToken(game)}`);
  let error;
  let origin;
  const movement = isMovement(game);
  if (movement) {
    do {
      origin = readCoordinate('origen', game.MAX_TOKENS);
      error = !isOccupied(game, origin, getToken(game));
      if (error) {
        console.writeln(`No hay una ficha de la propiedad de ${getToken(game)}`);
      }
    } while (error);
  }
  let target;
  do {
    target = readCoordinate('destino', game.MAX_TOKENS);
    error = !isEmpty(game, target);
    if (error) {
      console.writeln(`Indique una celda vacía`);
    }
  } while (error);
  if (movement) {
    putEmptyToken(game, origin);
  }
  putToken(game, target, getToken(game));
}

function isMovement(game) {
  return getNumTokens(game) === game.MAX_PLAYERS * game.MAX_TOKENS;
}

function readCoordinate(title, max) {
  return {
    row: read(`Fila ${title}`, max),
    column: read(`Columna ${title}`, max)
  }
}

function putEmptyToken(game, coordinate) {
  putToken(game, coordinate, game.TOKEN_EMPTY);
}

function putToken(game, coordinate, color) {
  game.tokens[coordinate.row][coordinate.column] = color;
}

function getNumTokens(game) {
  let empties = 0;
  for (let i = 0; i < game.MAX_TOKENS; i++) {
    for (let j = 0; j < game.MAX_TOKENS; j++) {
      if (game.tokens[i][j] === game.TOKEN_EMPTY) {
        empties++;
      }
    }
  }
  return game.MAX_TOKENS ** 2 - empties;
}

function read(title, max) {
  let position;
  let error;
  do {
    position = console.readNumber(`${title}: `);
    error = position < 1 || max < position;
    if (error) {
      console.writeln(`Por favor un numero entre 1 y ${max} inclusives`)
    }
  } while (error);
  return position - 1;
}

function isEmpty(game, {row, column}) {
  return game.tokens[row][column] === game.TOKEN_EMPTY;
}

function getToken(game) {
  return game.turn === 0 ? game.TOKEN_X : game.TOKEN_Y;
}

function writelnTokens(game) {
  const HORIZONTAL_SEPARTOR = `-------------`;
  const VERTICAL_SEPARATOR = `|`;
  let msg = ``;
  for (let i = 0; i < game.tokens.length; i++) {
    msg += `${HORIZONTAL_SEPARTOR}\n`;
    for (let j = 0; j < game.tokens[i].length; j++) {
      msg += `${VERTICAL_SEPARATOR} ${game.tokens[i][j]} `;
    }
    msg += `${VERTICAL_SEPARATOR}\n`;
  }
  msg += HORIZONTAL_SEPARTOR;
  console.writeln(msg);
}

function nextTurn(game) {
  game.turn = (game.turn + 1) % game.MAX_PLAYERS;
}

function isOccupied(game, coordinate, token) {
  return game.tokens[coordinate.row][coordinate.column] === token;
}

function isTicTacToe(game) {
  let countRows = [0, 0, 0];
  let countColumns = [0, 0, 0];
  let countDiagonal = 0;
  let countInverse = 0;
  for (let i = 0; i < game.tokens.length; i++) {
    for (let j = 0; j < game.tokens[i].length; j++) {
      if (game.tokens[i][j] === getToken(game)) {
        countRows[i]++;
        countColumns[j]++;
        if (i - j === 0) {
          countDiagonal++;
        }
        if (i + j === game.MAX_TOKENS - 1) {
          countInverse++;
        }
      }
    }
  }
  if (countDiagonal === game.MAX_TOKENS || countInverse === game.MAX_TOKENS) {
    return true;
  }
  for (let i = 0; i < countRows.length; i++) {
    if (countRows[i] === game.MAX_TOKENS) {
      return true;
    }
    if (countColumns[i] === game.MAX_TOKENS) {
      return true;
    }
  }
  return false;
}


function isResumed() {
  let result;
  let answer;
  let error = false;
  do {
    answer = console.readString(`¿Quieres jugar otra partida? `);
    result = answer === `si`;
    error = !result && answer !== `no`;
    if (error) {
      console.writeln(`Por favor, responda "si" o "no"`);
    }
  } while (error);
  return result;
}

