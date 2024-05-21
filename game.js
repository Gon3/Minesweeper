const {Grid} = require("./grid");

class Game {

    constructor(difficulty = "easy"){
        this.firstMove = true; 
        if(difficulty === "easy"){
            this.grid = new Grid(10, 8);
            this.marks = 10;
        } else if (difficulty === "medium"){
            this.grid = new Grid(18, 14);
            this.marks = 40;
        } else if(difficulty === "hard"){
            this.grid = new Grid(24, 20);
            this.marks = 99;
        } else 
            console.log("Invalid value for difficulty added"); 
    }

    alterBombNumbers(index) {
        let y = Math.floor(index/this.grid.x);
        let x = index%this.grid.x;
        let bombX, bombY; 
        for(let i = 0; i < 8; i++) {
            if(i%2 === 0){
                bombX = i !== 2 ? 1 : 0;
                bombY = i === 6 ? -1 : i >= 2 ? 1 : 0;
            }else {
                bombX = i !== 3 ? -1 : 0;
                bombY = i === 5 ? 1 : i >= 3 ? -1 : 0;
            }
            bombX += x;
            bombY += y;
            if((bombX >= 0 && bombX < this.grid.x) && (bombY >= 0 && bombY < this.grid.y) && this.grid.getIndex(bombY, bombX) !== -1){
                this.grid.increaseIndex(bombY, bombX); 
            }
        }
    }

    setUp(coord) { //put the bombs in the grid and set up the numbers
        let emptySquares = [...Array(this.grid.x * this.grid.y).keys()];
        let bombs = this.marks; 
        while(bombs !== 0){
            let index = Math.floor(Math.random() * emptySquares.length);
            let bombIndex = emptySquares[index]; 
            this.grid.addOrRemoveBomb(Math.floor(bombIndex/this.grid.x), bombIndex%this.grid.x);
            this.alterBombNumbers(bombIndex); 
            emptySquares.splice(index, 1); 
            bombs--; 
        }
    }

    coordToIndex(coord){
        return {x: coord.charCodeAt(0) - 65 , y: Number(coord.substring(1)) - 1}; 
    }

    handleSelection(coord) {//returns true is selection successful, false otherwise
        
    }

    handleMark(coord) {//returns true is marking is successful, false otherwise

    }

    toString(){
        return `${this.grid}`; 
    }
}

module.exports = {Game}; 