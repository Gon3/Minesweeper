const {Grid} = require("./grid");

class Game {

    constructor(difficulty = "E"){
        this.firstMove = true; 
        if(difficulty === "E"){ //easy mode
            this.grid = new Grid(10, 8);
            this.marks = 10;
        } else if (difficulty === "M"){ //medium mode
            this.grid = new Grid(18, 14);
            this.marks = 40;
        } else if(difficulty === "H"){ //hard mode
            this.grid = new Grid(24, 20);
            this.marks = 99;
        } else 
            console.log("Invalid value for difficulty added"); 
        this.bombs = this.marks; 
        this.setUpBombs();
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

    setUpBombs() { //put the bombs in the grid and set up the numbers
        let emptySquares = [...Array(this.grid.x * this.grid.y).keys()];
        let bombsToSet = this.marks; 
        while(bombsToSet !== 0){
            let index = Math.floor(Math.random() * emptySquares.length);
            let bombIndex = emptySquares[index]; 
            this.grid.addOrRemoveBomb(Math.floor(bombIndex/this.grid.x), bombIndex%this.grid.x);
            //this.alterBombNumbers(bombIndex); 
            emptySquares.splice(index, 1); 
            bombsToSet--; 
        }
    }

    fullySetUpGame(index) {
        //all squares containing bombs
        let bombSquares = [...Array(this.grid.x * this.grid.y).keys()].filter(v => this.grid.getIndex(Math.floor(v/this.grid.x), v%this.grid.x) === -1); 
        //square clicked on + surrounding squares
        let cVal = (index.y * this.grid.x) + index.x;
        let excludedSquares = [cVal, cVal + 1, cVal-1, cVal + this.grid.x, cVal - this.grid.x, cVal + this.grid.x +1, cVal + this.grid.x-1, cVal - this.grid.x +1, 
            cVal - this.grid.x -1].filter(v => v >= 0 && v < this.grid.x * this.grid.y);
        if(!excludedSquares.every(sq => this.grid.getIndex(Math.floor(sq/this.grid.x), sq%this.grid.x) !== -1)){//clicked on bomb
            let leftmost = 0;
            let removing = excludedSquares.filter(v => bombSquares.indexOf(v) !== -1); //bombs to remove
            removing.forEach(square => {
                //remove square
                this.grid.addOrRemoveBomb(Math.floor(square/this.grid.x), square%this.grid.x, true); 
                bombSquares.splice(bombSquares.indexOf(square), 1); 
                //put at empty square at leftmost corner
                while(excludedSquares.indexOf(leftmost) !== -1 || this.grid.getIndex(Math.floor(leftmost/this.grid.x), leftmost%this.grid.x) === -1) leftmost++; 
                this.grid.addOrRemoveBomb(Math.floor(leftmost/this.grid.x), leftmost%this.grid.x);
                bombSquares.push(leftmost); 
            });
        }
        //populate squares with numbers
        bombSquares.forEach((square) => {
            this.alterBombNumbers(square); 
        });
    }

    visitEmptySquares(y, x){ //bfs algo to find empty squares
        this.grid.makeVisible(y, x); 
        if(this.grid.getIndex(y, x) !== 0)
            return; 
        let dirs = [[y, x-1], [y, x+1], [y-1, x], [y+1, x], [y+1, x-1], [y+1, x+1], [y-1, x+1], [y-1, x-1]].filter(
            v => v[0] >= 0 && v[0] < this.grid.y && v[1] >= 0 && v[1] < this.grid.x && !this.grid.isVisible(v[0], v[1]) 
            && !this.grid.isMarked(v[0], v[1])); 
        dirs.forEach(coord => {
            this.visitEmptySquares(coord[0], coord[1]);
        });  
    }

    validateInput(coord){ //validates coord input 
        if(coord.search(/[A-Z][0-9]+/) === -1)
            return false; 
        let index = {x: coord.charCodeAt(0) - 65 , y: Number(coord.substring(1)) - 1}; 
        return index.x >= 0 && index.x < this.grid.x && index.y >= 0 && index.y < this.grid.y;
    }

    handleSelection(coord) {//returns 0 on failed click, 1 on successful click, 2 on failed gameover, and 3 on successful game over
        let index = {x: coord.charCodeAt(0) - 65 , y: Number(coord.substring(1)) - 1}; 
        if(this.firstMove){//handle first click 
            this.grid.removeAllMarks();
            this.marks = this.bombs;
            this.fullySetUpGame(index); 
            this.firstMove = false; 
        } 
        //click on a bomb -> game over
        if(this.grid.isVisible(index.y, index.x) || this.grid.isMarked(index.y, index.x)){ //nothing to do for visible/marked square
            return 0; 
        }
        if(this.grid.getIndex(index.y, index.x) === -1){ //if you click bomb, game over
            this.grid.gameOver();
            return 2;
        } 

        //click on empty square/numbered square -> start bfs algo 
        this.visitEmptySquares(index.y, index.x); 

        //successful game over condition
        let uncoveredSquares = [...Array(this.grid.x * this.grid.y).keys()].filter(v => this.grid.isVisible(Math.floor(v/this.grid.x), v%this.grid.x));
        if(uncoveredSquares.length === ((this.grid.x * this.grid.y) - this.bombs)){ //all squares except bombs uncovered
            this.grid.gameOver(); 
            return 3; 
        } 

        return 1; 
    }

    handleMark(coord) {//returns true if marking is successful, false otherwise
        let index = {x: coord.charCodeAt(0) - 65 , y: Number(coord.substring(1)) - 1}; 
        if(this.grid.isVisible(index.y, index.x))
            return false; 
        if(this.grid.isMarked(index.y, index.x)) this.marks++; 
        else this.marks--;
        this.grid.toggleMarkIndex(index.y, index.x);
        return true; 
    }

    toString(){
        return `${this.grid.endOfGame ? "Final Board:" : `Marks: ${this.marks}`}\n${this.grid}`; 
    }
}

module.exports = {Game}; 