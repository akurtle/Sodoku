const grids = document.querySelectorAll(".grid")

let newGame=true;

let initialBoard=new Array(9).fill(new Array(9).fill(5))

let sudokuGrid = new Array(9).fill(new Array(9).fill(5))

function handleInput(event) {
    const selectedGrid = event.target;
    const row = selectedGrid.dataset.row
    const col = selectedGrid.dataset.col
    const newNum = parseInt(selectedGrid.textContent)+1
    if (newNum <= 9) {
        sudokuGrid[row][col] = newNum;
        selectedGrid.textContent = newNum;
    } else {
        sudokuGrid[row][col] = 1;
        selectedGrid.textContent = 1;
    }
    newGame=false;
}



grids.forEach((grid, index) => {
    grid.addEventListener('click', handleInput);

    grid.dataset.row = Math.floor(index / 9);
    grid.dataset.col = index % 9;    
});

if(newGame===true){
    grids.forEach((grid) => {
        grid.textContent=sudokuGrid[grid.dataset.row][grid.dataset.col]       
    })
}

const reset=document.querySelector(".resetButton");

reset.addEventListener("click",()=>{
    grids.forEach((grid) => {
        grid.textContent=initialBoard[grid.dataset.row][grid.dataset.col]       
    })
})
 


