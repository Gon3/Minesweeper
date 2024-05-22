const {Game} = require("./game");
const prompt = require("prompt-sync")({sigint: true}); 
//let gameTest = new Game();
//console.log(`before:\n${gameTest}`);
//gameTest.handleSelection("E5");
//console.log(`${gameTest}`); 

console.log("Minesweeper v1");
let diff; 
while(true){
    console.log("Enter difficulty: "); 
    console.log("[E] Easy\n[M] Medium\n[H] Hard");
    diff = prompt(); 
    if(diff.toUpperCase() === "E" || diff.toUpperCase() === "M" || diff.toUpperCase() === "H")
        break; 
    console.log("Incorrect Option; Option does not exist.");
}
let game = new Game(diff);
while(true){
    let ans;
    while(true){
        console.log(`${game}`);
        console.log("Enter Action: ");
        console.log("[D] Dig Tile\n[M] Mark/Unmark Tile");
        ans = prompt();
        if(ans.toUpperCase() === "D" || ans.toUpperCase() === "M")
            break; 
        console.log("Incorrect Option; Option does not exist.");
    }

    let coord;
    while(true){
        console.log(`${game}`);
        coord = prompt("Enter coordinate of tile (for example: B1 for (0,1)): ");
        if(game.validateInput(coord.toUpperCase()))
            break; 
        console.log("Incorrect input was entered. Make sure the format is correct and the coordinate is valid.");
    }

    if(ans.toUpperCase() === "D"){
        let result = game.handleSelection(coord.toUpperCase());
        if(result === 0){
            console.log("You cannot dig a marked or already uncovered square!");
        } if(result === 3){
            console.log("Congratulations, you're a pro!! You cleared the board!!")
            console.log(`${game}`);
            break;
        } if(result === 2){
            console.log("Wow you suck!! You hit a bomb!! Game Over!!");
            console.log(`${game}`);
            break;
        } 
    } else {
        let result = game.handleMark(coord.toUpperCase());
        if(!result)
            console.log("You cannot mark an already uncovered tile."); 
    }
}
