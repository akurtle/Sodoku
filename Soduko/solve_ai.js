function solveSudoku(grids){
    let currPopulation = grids;
    currPopulation.forEach((grid) => {
        console.log("out");
        if(grid.dataset.fixed=="false"){
            grid.textContent = 77;
        }
    })
    return grids;
}
