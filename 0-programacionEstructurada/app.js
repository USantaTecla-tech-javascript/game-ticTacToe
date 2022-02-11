const { Console } = require("./console");

const console = new Console();
let isResumed;
do {
  const MAX_PLAYERS = 2;
  const MAX_TOKENS = 3;
  const TOKEN_EMPTY = ` `;
  const TOKEN_X = `X`;
  const TOKEN_Y = `Y`;
  const horizontalSeparator = `-------------`;
  const verticalSeparator = `|`;
  let tokens = [
    [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
    [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
    [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY]
  ];
  let turn = 0;
  let winner;
  do {
    let msg = ``;
    for (let i = 0; i < tokens.length; i++) {
      msg += `${horizontalSeparator}\n`;
      for (let j = 0; j < tokens[i].length; j++) {
        msg += `${verticalSeparator} ${tokens[i][j]} `;
      }
      msg += `${verticalSeparator}\n`;
    }
    msg += horizontalSeparator;
    console.writeln(msg); console.writeln(`Turno para ${turn === 0 ? TOKEN_X : TOKEN_Y}`);
    let error;
    let originRow;
    let originColumn;
    let empties = 0;
    for (let i = 0; i < tokens.length; i++) {
      for (let j = 0; j < tokens[i].length; j++) {
        if (tokens[i][j] === TOKEN_EMPTY) {
          empties++;
        }
      }
    }
    const movement = MAX_TOKENS ** 2 - empties === MAX_PLAYERS * MAX_TOKENS;
    if (movement) {
      do {
        do {
          originRow = console.readNumber(`Fila origen: `);
          error = originRow < 1 || 3 < originRow;
          if (error) {
            console.writeln(`Por favor un numero entre 1 y ${MAX_TOKENS} inclusives`)
          }
        } while (error);
        do {
          originColumn = console.readNumber(`Columna origen: `);
          error = originColumn < 1 || 3 < originColumn;
          if (error) {
            console.writeln(`Por favor un numero entre 1 y ${MAX_TOKENS} inclusives`)
          }
        } while (error);
        error = tokens[originRow - 1][originColumn - 1] !== (turn === 0 ? TOKEN_X : TOKEN_Y);
        if (error) {
          console.writeln(`No hay una ficha de la propiedad de ${turn === 0 ? TOKEN_X : TOKEN_Y}`);
        }
      } while (error);
    }
    let targetRow;
    let targetColumn;
    do {
      do {
        targetRow = console.readNumber(`Fila destino: `);
        error = targetRow < 1 || 3 < targetRow;
        if (error) {
          console.writeln(`Por favor un numero entre 1 y ${MAX_TOKENS} inclusives`)
        }
      } while (error);
      do {
        targetColumn = console.readNumber(`Columna destino: `);
        error = targetColumn < 1 || 3 < targetColumn;
        if (error) {
          console.writeln(`Por favor un numero entre 1 y ${MAX_TOKENS} inclusives`)
        }
      } while (error);
      error = tokens[targetRow - 1][targetColumn - 1] !== TOKEN_EMPTY;
      if (error) {
        console.writeln(`Indique una celda vacía`);
      }
    } while (error);
    if (movement) {
      tokens[originRow - 1][originColumn - 1] = TOKEN_EMPTY;
    }
    tokens[targetRow - 1][targetColumn - 1] = turn === 0 ? TOKEN_X : TOKEN_Y;
    let countRows = [0, 0, 0];
    let countColumns = [0, 0, 0];
    let countDiagonal = 0;
    let countInverse = 0;
    for (let i = 0; i < tokens.length; i++) {
      for (let j = 0; j < tokens[i].length; j++) {
        if (tokens[i][j] === (turn === 0 ? TOKEN_X : TOKEN_Y)) {
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
    winner = countDiagonal === MAX_TOKENS || countInverse === MAX_TOKENS;
    for (let i = 0; i < countRows.length && !winner; i++) {
      if (countRows[i] === MAX_TOKENS) {
        winner = true;
      } else {
        if (countColumns[i] === MAX_TOKENS) {
          winner = true;
        }
      }
    }
    if (!winner) {
      turn = (turn + 1) % MAX_PLAYERS;
    }
  } while (!winner);
  let msg = ``;
  for (let i = 0; i < tokens.length; i++) {
    msg += `${horizontalSeparator}\n`;
    for (let j = 0; j < tokens[i].length; j++) {
      msg += `${verticalSeparator} ${tokens[i][j]} `;
    }
    msg += `${verticalSeparator}\n`;
  }
  msg += horizontalSeparator;
  console.writeln(msg);
  console.writeln(`Victoria para ${turn === 0 ? TOKEN_X : TOKEN_Y}`);
  let answer;
  let error = false;
  do {
    answer = console.readString(`¿Quieres jugar otra partida? `);
    isResumed = answer === `si`;
    error = !isResumed && answer !== `no`;
    if (error) {
      console.writeln(`Por favor, responda "si" o "no"`);
    }
  } while (error);
} while (isResumed);
