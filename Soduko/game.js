const grids = document.querySelectorAll(".grid")

let sudokuGrid = new Array(9).fill(new Array(9).fill(0))


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
}

grids.forEach((grid, index) => {
    grid.addEventListener('click', handleInput);
    grid.dataset.row = Math.floor(index / 9);
    grid.dataset.col = index % 9;    
});

 


