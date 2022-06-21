const { Console } = require("./console");

const console = new Console();
playTicTacToe();

function playTicTacToe() {
  let continueDialog = initYesNoDialog(`¿Quieres jugar otra partida? `);
  do {
    const game = initGame();
    game.play();
    continueDialog.read();
  } while (continueDialog.isAffirmative());
}

function initGame() {
  let game = {
    turn: 0,
    MAX_PLAYERS: 2,
    TOKEN_X: `X`,
    TOKEN_Y: `Y`,
    TOKEN_EMPTY: ` `,
    MAX_TOKENS: 3,
    tokens: [],

    play: function () {
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
    },

    writelnTokens: function () {
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
    },

    placeToken: function () {
      console.writeln(`Turno para ${this.getToken()}`);
      let error;
      let origin;
      const movement = this.isMovement();
      if (movement) {
        do {
          origin = initCoordinate();
          origin.read('origen', this.MAX_TOKENS);
          error = !this.isOccupied(origin, this.getToken());
          if (error) {
            console.writeln(`No hay una ficha de la propiedad de ${this.getToken()}`);
          }
        } while (error);
      }
      let target;
      do {
        target = initCoordinate();
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
    },

    isTicTacToe: function () {
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
    },

    nextTurn: function () {
      this.turn = (this.turn + 1) % this.MAX_PLAYERS;
    },

    isMovement: function () {
      return this.getNumTokens() === this.MAX_PLAYERS * this.MAX_TOKENS;
    },

    putEmptyToken: function (coordinate) {
      this.putToken(coordinate, this.TOKEN_EMPTY);
    },

    putToken: function (coordinate, color) {
      this.tokens[coordinate.row][coordinate.column] = color;
    },

    getNumTokens: function () {
      let empties = 0;
      for (let i = 0; i < this.MAX_TOKENS; i++) {
        for (let j = 0; j < this.MAX_TOKENS; j++) {
          if (this.tokens[i][j] === this.TOKEN_EMPTY) {
            empties++;
          }
        }
      }
      return this.MAX_TOKENS ** 2 - empties;
    },

    isEmpty: function ({ row, column }) {
      return this.tokens[row][column] === this.TOKEN_EMPTY;
    },

    getToken: function () {
      return this.turn === 0 ? this.TOKEN_X : this.TOKEN_Y;
    },

    isOccupied: function (coordinate, color) {
      return this.tokens[coordinate.row][coordinate.column] === color;
    },

    writeWinner : function(){
      console.writeln(`Victoria para ${this.getToken()}`);  
    },

  };
  for (let i = 0; i < game.MAX_TOKENS; i++) {
    game.tokens[i] = [];
    for (let j = 0; j < game.MAX_TOKENS; j++) {
      game.tokens[i][j] = game.TOKEN_EMPTY;
    }
  }
  return game;
}

function initCoordinate() {
  return {
    row : undefined,
    column : undefined,

    read : function (title, max) {
      this.row  = read(`Fila ${title}`, max);
      this.column = read(`Columna ${title}`, max);
    }
  };

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
}

function initYesNoDialog(question) {
  return {
    question : question,
    answer : ``,

    read : function() {
      let error = false;
      do {
        answer = console.readString(this.question);
        error = !this.isAffirmative() && !this.isNegative();
        if (error) {
          console.writeln(`Por favor, responda "si" o "no"`);
        }
      } while (error);
    },

    isAffirmative : function(){
      return answer === `si`;
    },

    isNegative : function(){
      return answer === `no`;
    }
  };
}



