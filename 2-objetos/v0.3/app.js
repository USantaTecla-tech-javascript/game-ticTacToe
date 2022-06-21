const { Console } = require("./console");

const console = new Console();

function Game() {
  this.turn = 0;
  this.MAX_PLAYERS = 2;
  this.TOKEN_X = `X`;
  this.TOKEN_Y = `Y`;
  this.TOKEN_EMPTY = ` `;
  this.MAX_TOKENS = 3;
  this.tokens = [];
  for (let i = 0; i < this.MAX_TOKENS; i++) {
    this.tokens[i] = [];
    for (let j = 0; j < this.MAX_TOKENS; j++) {
      this.tokens[i][j] = this.TOKEN_EMPTY;
    }
  }
}

Game.prototype.play = function () {
  let winner;
  do {
    this.writelnTokens();
    this.placeToken();
    winner = this.isTicTacToe();
    if (!winner) {
      this.nextTurn();
    }
  } while (!winner);
  this.writelnTokens();
  this.writeWinner();
};

Game.prototype.writelnTokens = function () {
  const HORIZONTAL_SEPARTOR = `-------------`;
  const VERTICAL_SEPARATOR = `|`;
  let msg = ``;
  for (let i = 0; i < this.tokens.length; i++) {
    msg += `${HORIZONTAL_SEPARTOR}\n`;
    for (let j = 0; j < this.tokens[i].length; j++) {
      msg += `${VERTICAL_SEPARATOR} ${this.tokens[i][j]} `;
    }
    msg += `${VERTICAL_SEPARATOR}\n`;
  }
  msg += HORIZONTAL_SEPARTOR;
  console.writeln(msg);
};

Game.prototype.placeToken = function () {
  console.writeln(`Turno para ${this.getToken()}`);
  let error;
  let origin;
  const movement = this.isMovement();
  if (movement) {
    do {
      origin = new Coordinate();
      origin.read('origen', this.MAX_TOKENS);
      error = !this.isOccupied(origin, this.getToken());
      if (error) {
        console.writeln(`No hay una ficha de la propiedad de ${this.getToken()}`);
      }
    } while (error);
  }
  let target;
  do {
    target = new Coordinate();
    target.read('destino', this.MAX_TOKENS);
    error = !this.isEmpty(target);
    if (error) {
      console.writeln(`Indique una celda vacía`);
    }
  } while (error);
  if (movement) {
    this.putEmptyToken(origin);
  }
  this.putToken(target, this.getToken());
};

Game.prototype.isTicTacToe = function () {
  let countRows = [0, 0, 0];
  let countColumns = [0, 0, 0];
  let countDiagonal = 0;
  let countInverse = 0;
  for (let i = 0; i < this.tokens.length; i++) {
    for (let j = 0; j < this.tokens[i].length; j++) {
      if (this.tokens[i][j] === this.getToken()) {
        countRows[i]++;
        countColumns[j]++;
        if (i - j === 0) {
          countDiagonal++;
        }
        if (i + j === this.MAX_TOKENS - 1) {
          countInverse++;
        }
      }
    }
  }
  if (countDiagonal === this.MAX_TOKENS || countInverse === this.MAX_TOKENS) {
    return true;
  }
  for (let i = 0; i < countRows.length; i++) {
    if (countRows[i] === this.MAX_TOKENS) {
      return true;
    }
    if (countColumns[i] === this.MAX_TOKENS) {
      return true;
    }
  }
  return false;
};

Game.prototype.nextTurn = function () {
  this.turn = (this.turn + 1) % this.MAX_PLAYERS;
};

Game.prototype.isMovement = function () {
  return this.getNumTokens() === this.MAX_PLAYERS * this.MAX_TOKENS;
};

Game.prototype.putEmptyToken = function (coordinate) {
  this.putToken(coordinate, this.TOKEN_EMPTY);
};

Game.prototype.putToken = function (coordinate, color) {
  this.tokens[coordinate.row][coordinate.column] = color;
};

Game.prototype.getNumTokens = function () {
  let empties = 0;
  for (let i = 0; i < this.MAX_TOKENS; i++) {
    for (let j = 0; j < this.MAX_TOKENS; j++) {
      if (this.tokens[i][j] === this.TOKEN_EMPTY) {
        empties++;
      }
    }
  }
  return this.MAX_TOKENS ** 2 - empties;
};

Game.prototype.isEmpty = function ({ row, column }) {
  return this.tokens[row][column] === this.TOKEN_EMPTY;
};

Game.prototype.getToken = function () {
  return this.turn === 0 ? this.TOKEN_X : this.TOKEN_Y;
};

Game.prototype.isOccupied = function (coordinate, color) {
  return this.tokens[coordinate.row][coordinate.column] === color;
};

Game.prototype.writeWinner = function () {
  console.writeln(`Victoria para ${this.getToken()}`);
};

function Coordinate() {
  this.row = undefined;
  this.column = undefined;
}

Coordinate.prototype.read = function (title, max) {
  this.row = read(`Fila ${title}`, max);
  this.column = read(`Columna ${title}`, max);

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
};

function YesNoDialog(question) {
  this.question = question;
  this.answer = ``;
}

YesNoDialog.prototype.read = function () {
  let error = false;
  do {
    answer = console.readString(this.question);
    error = !this.isAffirmative() && !this.isNegative();
    if (error) {
      console.writeln(`Por favor, responda "si" o "no"`);
    }
  } while (error);
};

YesNoDialog.prototype.isAffirmative = function () {
  return answer === `si`;
};

YesNoDialog.prototype.isNegative = function () {
  return answer === `no`;
};




function playTicTacToe() {
  let continueDialog = new YesNoDialog(`¿Quieres jugar otra partida? `);
  do {
    const game = new Game();
    game.play();
    continueDialog.read();
  } while (continueDialog.isAffirmative());
}

playTicTacToe();







