const {Grid} = require("./grid");

let gridTest = new Grid(10, 8);

gridTest.toggleMarkIndex(4,4);
console.log(`${gridTest}`); 