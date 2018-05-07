let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let dimension = 50;
let grid = createMatrix(dimension);
let copiedGrid = createMatrix(dimension);

// Create empty matrix.
function createMatrix(dimension) {
    let arr = [];
    for (let i = 0; i < dimension; i++) {
        arr[i] = [];
    }
    return arr;
}

// Run when index.html is started. Do matrix with random cells alive.
function start() {
    document.getElementById("btnStop").style.display = "none";
    clickGrid();
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            let randBin = Math.floor((Math.random() * 8));
            if (randBin === 1) {
                grid[i][j] = 1;
            } else {
                grid[i][j] = 0;
            }
        }
    }
    drawGrid();
}

// Load matrix in grid and draw it in canvas.
function drawGrid() {
    ctx.clearRect(0, 0, 500, 500);
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (grid[i][j] === 1) {
                ctx.fillStyle = '#384e72';
                ctx.fillRect(i * 10, j * 10, 10, 10);
            }
            ctx.strokeStyle = '#696969';
            ctx.strokeRect(i * 10, j * 10, 10, 10);
        }
    }
}

// Make possible clicking on the grid in browser and change cell state.
function clickGrid() {
    canvas.addEventListener('click', function (event) {
        let elemLeft = canvas.offsetLeft;
        let elemTop = canvas.offsetTop;
        let x = Math.floor((event.pageX - elemLeft) / 10);
        let y = Math.floor((event.pageY - elemTop) / 10);

        grid[x][y] = (grid[x][y] + 1) % 2;
        drawGrid();
    });
}

// Make all cells dead.
function clearGrid() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            grid[i][j] = 0;
        }
    }
    drawGrid();
}

// Function for game's logic
function newGrid() {
    // Checks how many living neighboring cells each cell has
    // Iterate the grid
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            // Count surrounding living cells
            let cellsCount = 0;
            // Check the three cells above the current one
            if (i !== 0) { // continue only if this is not the first/zero row
                if (j !== 0) // continue only if this is not the first/zero column
                    cellsCount += grid[i - 1][j - 1];
                cellsCount += grid[i - 1][j];
                if (j !== (dimension - 1)) // continue only if this is not the last column
                    cellsCount += grid[i - 1][j + 1];
            }
            // Check the cell on the left
            if (j !== 0) // continue only if this is not the first/zero column
                cellsCount += grid[i][j - 1];
            // Check the cell on the right    
            if (j !== (dimension - 1)) // continue only if this is not the last column
                cellsCount += grid[i][j + 1];
            // Check the three cells below the current one
            if (i !== (dimension - 1)) {
                if (j !== 0)  // continue only if this is not the first/zero column
                    cellsCount += grid[i + 1][j - 1];
                cellsCount += grid[i + 1][j];
                if (j !== (dimension - 1)) // continue only if this is not the last column
                    cellsCount += grid[i + 1][j + 1];
            }

            // Check if the currnet cell is dead
            if (grid[i][j] === 0) {
                // Become alive if three surrounding cells are alive, else die
                if (cellsCount === 3) {
                    copiedGrid[i][j] = 1;
                } else {
                    copiedGrid[i][j] = 0;
                }
            } 
            // Current cell is alive
            else if (grid[i][j] === 1) {
                // stay alive with 2 or 3 living neighbours, else die
                if (cellsCount === 2 || cellsCount === 3) {
                    copiedGrid[i][j] = 1;
                } else {
                    copiedGrid[i][j] = 0;
                }
            }
        }
    }

    // Copy the temporary grid in real one
    for (let j = 0; j < dimension; j++) {
        for (let k = 0; k < dimension; k++) {
            grid[j][k] = copiedGrid[j][k];
        }
    }

    drawGrid();
}

var refreshIntervalId;
// Load with Start button. Automatic grid change in half a second.
function autoGrid(value) {

    if (value === 1) {
        refreshIntervalId = setInterval(function () { newGrid(); }, 500);
        document.getElementById("btnStop").style.display = "inline-block";
        document.getElementById("btnStart").style.display = "none";
    }
    else {

        clearInterval(refreshIntervalId);
        document.getElementById("btnStart").style.display = "inline-block";
        document.getElementById("btnStop").style.display = "none";

    }
}