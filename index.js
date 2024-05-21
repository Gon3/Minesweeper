const {Game} = require("./game");

let gameTest = new Game();
//console.log(`before:\n${gameTest}`);
gameTest.handleSelection("E5");

console.log(`${gameTest}`); 