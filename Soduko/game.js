
//Selecting all the grids
const grids = document.querySelectorAll(".grid")

let randomGameArray=[
    ["004300209005009001070060043006002087190007400050083000600000105003508690042910300","864371259325849761971265843436192587198657432257483916689734125713528694542916378"],
    ["600120384008459072000006005000264030070080006940003000310000050089700000502000190","695127384138459672724836915851264739273981546946573821317692458489715263562348197"],
    ["040100050107003960520008000000000017000906800803050620090060543600080700250097100","346179258187523964529648371965832417472916835813754629798261543631485792254397186"],
    ["497200000100400005000016098620300040300900000001072600002005870000600004530097061","497258316186439725253716498629381547375964182841572639962145873718623954534897261"],
    ["005910308009403060027500100030000201000820007006007004000080000640150700890000420","465912378189473562327568149738645291954821637216397854573284916642159783891736425"],
    ["100005007380900000600000480820001075040760020069002001005039004000020100000046352","194685237382974516657213489823491675541768923769352841215839764436527198978146352"],
    ["009065430007000800600108020003090002501403960804000100030509007056080000070240090","289765431317924856645138729763891542521473968894652173432519687956387214178246395"],
    ["000000657702400100350006000500020009210300500047109008008760090900502030030018206","894231657762495183351876942583624719219387564647159328128763495976542831435918276"],
    ["503070190000006750047190600400038000950200300000010072000804001300001860086720005","563472198219386754847195623472638519951247386638519472795864231324951867186723945"],
    ["060720908084003001700100065900008000071060000002010034000200706030049800215000090","163725948584693271729184365946358127371462589852917634498231756637549812215876493"],
    ["004083002051004300000096710120800006040000500830607900060309040007000205090050803","974183652651274389283596714129835476746912538835647921568329147317468295492751863"],
    ["000060280709001000860320074900040510007190340003006002002970000300800905500000021","431567289729481653865329174986243517257198346143756892612975438374812965598634721"],
    ["004300000890200670700900050500008140070032060600001308001750900005040012980006005","254367891893215674716984253532698147178432569649571328421753986365849712987126435"]
]



let randGame = Math.floor(Math.random()*(randomGameArray.length))

//Newgame boolean
let newGame=true;


//Setting up the main game from the sudoku.csv
let mainArray=[];

let subArray=[];

let checkArray=[];

function parseSudokuString(sudokuString) {
    let sudokuArray = sudokuString.split("")
    let sudokuGrid = [];
  
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        const block = [];
        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 3; y++) {
            block.push(sudokuArray[(i + x) * 9 + j + y]);
          }
        }
        sudokuGrid.push(block);
      }
    }
  
    return sudokuGrid;
  }

mainArray= parseSudokuString(randomGameArray[randGame][0])
let sudokuGrid=parseSudokuString(randomGameArray[randGame][0])

//Handles the click and updates the values of the grid
function handleInput(event) {
    newGame=false;
    const selectedGrid = event.target;
    const block = selectedGrid.dataset.block
    const col = selectedGrid.dataset.col 
    const newNum = parseInt(selectedGrid.textContent)+1
    if(selectedGrid.dataset.fixed==="false"){
        if (newNum <= 9) {
            sudokuGrid[block][col] = newNum;
            selectedGrid.textContent = newNum;
        } else {
            sudokuGrid[block][col] = 1;
            selectedGrid.textContent = 1;
        }
    }
    
}


/*
A new game attribute to set the properties for each grid when the game first starts,
also sets the fixed attribute to check which values can be clicked 
and which cannot be.
*/
let line=0;
if(newGame===true){
    let counter=1;
    grids.forEach((grid,index) => {
        grid.addEventListener('click', handleInput);
        grid.dataset.block = Math.floor(index / 9);
        grid.dataset.col = index % 9; 
        grid.dataset.line= line % 3;
        if(counter%3==0){
            line++;
        }
        grid.textContent=sudokuGrid[grid.dataset.block][grid.dataset.col] 
        if(grid.textContent!=0){
            grid.dataset.fixed=true;
        } 
        else{
            grid.dataset.fixed=false;
        }  
        counter++
    })
    
}



const reset=document.querySelector(".resetButton");
//Resets the game by setting all the unfixed values (grids to solve) to 0
reset.addEventListener("click",()=>{
    grids.forEach((grid) => {
        if(grid.dataset.fixed=="false"){
            grid.textContent=0;
        }  
    })
})

const random= document.querySelector(".randomButton");
 
random.addEventListener("click",()=>{
    location.reload()
})



//Checks if game is solved by matching the game string with the solved string
const check= document.querySelector(".checkButton");

check.addEventListener("click",()=>{
    let checker = true
    let solved = parseSudokuString(randomGameArray[randGame][1])
    grids.forEach((grid)=>{
        if(solved.length!=0){
            if(grid.textContent==solved[grid.dataset.block][grid.dataset.col] && mainArray[grid.dataset.block][grid.dataset.col]==0){
                grid.style.backgroundColor="LightGreen"
                setTimeout(()=>{
                    grid.style.backgroundColor=""
                },2000)
                
            }
            else if(grid.textContent!=solved[grid.dataset.block][grid.dataset.col] && mainArray[grid.dataset.block][grid.dataset.col]==0 && grid.textContent!=0){
                grid.style.backgroundColor="red"
                setTimeout(()=>{
                    grid.style.backgroundColor=""
                },2000)
                checker=false
            }
            else if(grid.textContent==0){
                grid.style.backgroundColor="beige"
                setTimeout(()=>{
                    grid.style.backgroundColor=""
                },2000)
            }
            
        }
    })

    if(checker===true){
        console.log("You have finishe the game!")
    }

})


const solve = document.querySelector(".solveButton");
solve.addEventListener("click", ()=>{
    solve_ai.solveSudoku(grids);
})