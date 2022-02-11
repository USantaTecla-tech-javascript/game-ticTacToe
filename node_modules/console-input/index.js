const readlineSync = require('readline-sync');

const input = prompt => {
    const userInput = readlineSync.question(prompt);
    return userInput;
}

const print = item => console.log(item);

module.exports = { input, print };
