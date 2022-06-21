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
    let board = getInitialBoard();
    let turn = 0;
    let winner;
    do {
      writelnBoard(board);
      placeToken(board, turn);
      winner = isTicTacToe(board, turn);
      if (!winner) {
        turn = (turn + 1) % MAX_PLAYERS;
      }
    } while (!winner);
    writelnBoard(board);
    console.writeln(`Victoria para ${getToken(turn)}!!!`);

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

    function placeToken(tokens, turn) {
      console.writeln(`Turno para ${getToken(turn)}.`);
      let origin;
      if (isMovement(tokens)) {
        origin = getOrigin(tokens, turn);
      }
      let target = getTarget(tokens, origin);
      if (isMovement(tokens)) {
        setToken(tokens, origin, TOKEN_EMPTY);
      }
      setToken(tokens, target, getToken(turn));

      function isMovement(tokens) {
        let empties = 0;
        for (let i = 0; i < tokens.length; i++) {
          for (let j = 0; j < tokens[i].length; j++) {
            if (tokens[i][j] === TOKEN_EMPTY) {
              empties++;
            }
          }
        }
        return MAX_TOKENS ** 2 - empties === MAX_PLAYERS * MAX_TOKENS;
      }

      function getOrigin(tokens, turn) {
        let error;
        let result;
        do {
          result = getCoordinate(`origen`);
          console.writeln(`(${result.row}, ${result.column})`);
          error = !isOccupied(tokens, result, turn);
          if (error) {
            console.writeln(`No hay una ficha de la propiedad de ${getToken(turn)}`);
          }
        } while (error);
        return result;

        function isOccupied(tokens, { row, column }, turn) {
          return tokens[row][column] === getToken(turn);
        }
      }

      function getCoordinate(title) {
        let result = {};
        result.row = readIndex(`Fila ${title}: `);
        result.column = readIndex(`Columna ${title}: `);
        return result;

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
      }

      function getTarget(tokens, forbidden) {
        let error;
        let result;
        do {
          result = getCoordinate(`destino`);
          console.writeln(`(${result.row}, ${result.column})`);
          error = forbidden !== undefined && isEquals(forbidden, result) || !isEmpty(tokens, result);
          if (error) {
            console.writeln(`Indique una celda vacía distinta del origen`);
          }
        } while (error);
        return result;

        function isEquals({ row, column }, coordinate) {
          return row === coordinate.row && column == coordinate.column;
        }

        function isEmpty(tokens, { row, column }) {
          return tokens[row][column] === TOKEN_EMPTY;
        }
      }

      function setToken(tokens, { row, column }, token) {
        tokens[row][column] = token;
      }

    }

    function getToken(turn) {
      return [`X`, `Y`][turn];
    }
    
    function writelnBoard(tokens) {
      const HORIZONTAL_SEPARTOR = `-------------`;
      const VERTICAL_SEPARATOR = `|`;
      let msg = ``;
      for (let i = 0; i < tokens.length; i++) {
        msg += `${HORIZONTAL_SEPARTOR}\n`;
        for (let j = 0; j < tokens[i].length; j++) {
          msg += `${VERTICAL_SEPARATOR} ${tokens[i][j]} `;
        }
        msg += `${VERTICAL_SEPARATOR}\n`;
      }
      msg += HORIZONTAL_SEPARTOR;
      console.writeln(msg);
    }

    function isTicTacToe(tokens, turn) {
      let countRows = [0, 0, 0];
      let countColumns = [0, 0, 0];
      let countDiagonal = 0;
      let countInverse = 0;
      for (let i = 0; i < tokens.length; i++) {
        for (let j = 0; j < tokens[i].length; j++) {
          if (tokens[i][j] === getToken(turn)) {
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
  }

}
