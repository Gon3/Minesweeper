class Grid {
    constructor (x, y){
        this.x = x;
        this.y = y; 
        this.arr = Array.from({length: y}, e => Array(x).fill(0));
        this.visibility = Array.from({length: y}, e => Array(x).fill(true));
        this.marked = Array.from({length: y}, e => Array(x).fill(false));
        this.endOfGame = false;  
    }

    getIndex(y, x) {
        return this.arr[y][x];
    }

    increaseIndex(y, x) {
        this.arr[y][x]++;
    }

    addOrRemoveBomb(y, x, remove=false) {
        if(!remove) this.arr[y][x] = -1; 
        else this.arr[y][x] = 0; 
    }

    isVisible(y, x) {
        return this.visibility[y][x]; 
    }

    makeIndexVisible(y, x){
        this.visibility[y][x] = true; 
    }

    isMarked(y, x) {
        return this.marked[y][x]; 
    }

    toggleMarkIndex(y, x){
        this.marked[y][x] = !this.marked[y][x]; 
    }

    gameOver(){
        this.endOfGame = true; 
    }

    getStringForIndex(i, j){
        if(this.marked[i][j]){
            return this.endOfGame ? (this.arr[i][j] === -1 ? "\u2713" : "\u2715") : "\u2691" ;
        }else if(this.visibility[i][j] || this.endOfGame){
            if(this.arr[i][j] === -1)
                return "\u2022";
            else if(this.arr[i][j] === 0)
                return " ";
            else 
                return this.endOfGame ? "-" : `${this.arr[i][j]}`;
        } 
        return "-"; 
    }

    toString(){
        let gridString = "    ";
        for(let c = 0; c < this.x; c++){
            gridString += String.fromCharCode(65+c) + " ";
        }
        gridString += "\n  \u250D"; 
        for(let j = 0; j < (this.x * 2)+1; j++){
            gridString += "\u2500"; 
        }
        gridString += "\u2511\n";
        for(let i = 0; i < this.y; i++){
            gridString += `${i+1} \u2502 `;
            for(let j = 0; j < this.x; j++){
                gridString += this.getStringForIndex(i,j) + ((j === this.x-1) ? "" : " "); 
            }
            gridString += " \u2502\n"; 
        }
        gridString += "  \u2515";
        for(let j = 0; j < (this.x * 2)+1; j++){
            gridString += "\u2500"; 
        }
        gridString += "\u2519";
        return gridString; 
    }
}

module.exports = {Grid}; 