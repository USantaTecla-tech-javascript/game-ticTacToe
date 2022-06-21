const { Console } = require("./console");

const console = new Console();
playTicTacToe();

function playTicTacToe() {
  do {
    playGame();
  } while (isResumed());

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

  function playGame() {
    const MAX_PLAYERS = 2;
    const MAX_TOKENS = 3;
    const TOKEN_EMPTY = ` `;
    let game = getInitialGame();
    let winner;
    do {
      writeln(game);
      placeToken(game);
      winner = isTicTacToe(game);
      if (!winner) {
        nextTurn(game);
      }
    } while (!winner);
    writeln(game);

    function getInitialGame() {
      return {
        users: readUsers(),
        board: getInitialBoard(),
        turn: 0
      };

      function readUsers() {
        let result;
        do {
          result = console.readNumber(`Cuántos usuarios`);
          error = result < 0 || MAX_PLAYERS < result;
          if (error) {
            console.writeln(`Indique un valor entre 0 y 2 usuarios`);
          }
        } while (error);
        return result;
      }

      function getInitialBoard() {
        let result = [];
        for (let i = 0; i < MAX_TOKENS; i++) {
          result[i] = [];
          for (let j = 0; j < MAX_TOKENS; j++) {
            result[i][j] = TOKEN_EMPTY;
          }
        }
        return result;
      }

    }

    function writeln(game) {
      const HORIZONTAL_SEPARTOR = `-------------\n`;
      const VERTICAL_SEPARATOR = `|`;
      let msg = ``;
      for (let i = 0; i < game.board.length; i++) {
        msg += `${HORIZONTAL_SEPARTOR}`;
        for (let j = 0; j < game.board[i].length; j++) {
          msg += `${VERTICAL_SEPARATOR} ${game.board[i][j]} `;
        }
        msg += `${VERTICAL_SEPARATOR}\n`;
      }
      msg += HORIZONTAL_SEPARTOR;
      if (isTicTacToe(game)) {
        msg += `Victoria para `;
      } else {
        msg += `Turno para `;
      }
      msg += `${getToken(game.turn)}.`
      console.writeln(msg);
    }

    function getToken(turn) {
      return [`X`, `Y`][turn];
    }

    function isTicTacToe(game) {
      let countRows = [0, 0, 0];
      let countColumns = [0, 0, 0];
      let countDiagonal = 0;
      let countInverse = 0;
      for (let i = 0; i < game.board.length; i++) {
        for (let j = 0; j < game.board[i].length; j++) {
          if (game.board[i][j] === getToken(game.turn)) {
            countRows[i]++;
            countColumns[j]++;
            if (i - j === 0) {
              countDiagonal++;
            }
            if (i + j === MAX_TOKENS - 1) {
              countInverse++;
            }
          }
        }
      }
      if (countDiagonal === MAX_TOKENS || countInverse === MAX_TOKENS) {
        return true;
      }
      for (let i = 0; i < countRows.length; i++) {
        if (countRows[i] === MAX_TOKENS) {
          return true;
        }
        if (countColumns[i] === MAX_TOKENS) {
          return true;
        }
      }
      return false;
    }

    function placeToken(game) {
      let origin;
      if (isMovement(game)) {
        origin = getOrigin(game);
        setToken(game, origin, TOKEN_EMPTY);
      }
      let target = getTarget(game);
      setToken(game, target, getToken(game.turn));

      function isMovement({ board }) {
        let empties = 0;
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === TOKEN_EMPTY) {
              empties++;
            }
          }
        }
        return MAX_TOKENS ** 2 - empties === MAX_PLAYERS * MAX_TOKENS;
      }

      function getOrigin(game) {
        return getCoordinate(game, `origen`,
          (game, origin) => game.board[origin.row][origin.column] === getToken(turn),
          `No hay una ficha de la propiedad de ${getToken(turn)}`);
      }

      function getCoordinate(game, title, isError, errorMsg) {
        let error;
        let result;
        do {
          result = {
            row: getIndex(`Fila`),
            column: getIndex(`Columna`)
          };
          console.writeln(`!!!(${result.row}, ${result.column})`);
          error = isError(game, result);
          if (error) {
            console.writeln(errorMsg);
          }
        } while (error);
        return result;

        function getIndex(index) {
          return game.turn < game.users ?
            readIndex(`${index} ${title}: `) :
            getRandomIndex();

          function readIndex(title) {
            let result;
            let error;
            do {
              result = console.readNumber(`${title}: `);
              error = result < 1 || 3 < result;
              if (error) {
                console.writeln(`Por favor un numero entre 1 y ${MAX_TOKENS} inclusives`)
              }
            } while (error);
            return result - 1;
          }

          function getRandomIndex() {
            return Math.floor(Math.random() * MAX_PLAYERS)
          }

        }

      }

      function getTarget(game, forbidden) {
        return getCoordinate(game, `destino`,
          (game, target) =>
            forbidden !== undefined && isEquals(forbidden, target) || !isEmpty(game, target),
          `Indique una celda vacía distinta del origen`);

        function isEquals(coordinate, { row, column }) {
          return row === coordinate.row && column == coordinate.column;
        }

        function isEmpty({ board }, { row, column }) {
          return board[row][column] === TOKEN_EMPTY;
        }
      }

      function setToken({ board }, { row, column }, token) {
        board[row][column] = token;
      }

    }

    function nextTurn(game){
      game.turn = (game.turn + 1) % MAX_PLAYERS;
    }
    
  }

}
