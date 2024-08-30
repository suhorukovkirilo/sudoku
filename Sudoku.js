const Random = {randint: (min , max) => (Math.floor(Math.random() * (max - min) + min)),
shuffle: (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    return array
}};

const emptyBoard = (length=9) => (Array.from({length: length}, () => Array(length).fill(0)));
  
function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
    };
    [row, col] = [row - (row % 3), col - (col % 3)];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + row][j + col] === num) return false;
        }
    }
    return true;
};

function isEmpty(sudoku) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudoku[i][j] === 0) return {row: i, col: j, empty: true};
        };
    };
    return {empty: false};
};
  
function Sudoku(board) {
    board = board ? board : emptyBoard();
    const {row, col, empty} = isEmpty(board);
    if (!empty) return true;
    for (let num of Random.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if(Sudoku(board)) return board;
        }
    };
};

function countSolutions(sudoku, counter={value: 0}) {
    let row, col;
    for (let i = 0; i < 81; i++) {
        [row, col] = [Math.floor(i / 9), i % 9];
        if (sudoku[row][col] == 0) {
            for (let num = 1; num < 10; num++) {
                if (isValid(sudoku, row, col, num)) {
                    sudoku[row][col] = num;
                    if (!isEmpty(sudoku).empty) {
                        counter.value += 1;
                        break
                    } else {
                        if (countSolutions(sudoku, counter)) {
                            return true
                        };
                    };
                };
            };
            break
        };
    };
    sudoku[row][col] = 0;
};

function hardSudoku(sudoku, attempts=5) {
    let steps = [];
    sudoku = structuredClone(sudoku);
    while (attempts > 0) {
        let [row, col] = [Random.randint(0, 9), Random.randint(0, 9)];
        while (sudoku[row][col] == 0) {
            [row, col] = [Random.randint(0, 9), Random.randint(0, 9)]; 
        };
        let backup = sudoku[row][col];
        sudoku[row][col] = 0;
        let copy = structuredClone(sudoku);
        let counter = {value: 0};
        countSolutions(copy, counter);
        if (counter.value != 1) {
            sudoku[row][col] = backup;
            attempts -= 1;
        } else {
            steps.push([row, col, backup])
        };
    };
    return {board: sudoku, steps: steps}
};

function solveSudoku(sudoku, steps=[], onchange=() => {}, afterall=() => {}, delay=500) {
    let interval = setInterval(() => {
        if (!isEmpty(sudoku).empty) {
            clearInterval(interval);
            afterall(sudoku);
        } else if (steps.length > 0) {
            let [row, col, num] = steps.pop();
            sudoku[row][col] = num;
            onchange(row, col, num);
        } else {
            steps = [];

            function solve(board) {
                for (let row = 0; row < 9; row++) {
                    for (let col = 0; col < 9; col++) {
                        if (board[row][col] === 0) {
                            for (let num = 1; num <= 9; num++) {
                                if (isValid(board, row, col, num)) {
                                    board[row][col] = num;
                                    steps.push([row, col, num]);
        
                                    if (solve(board)) {
                                        return true;
                                    } else {
                                        board[row][col] = 0;
                                        steps.pop();
                                    }
                                }
                            }
                            return false;
                        }
                    }
                }
                return true;
            }
        
            solve(structuredClone(sudoku));

            steps = Random.shuffle(steps);   
        };
    }, delay);
};

function GridToString(sudoku) {
    let string = '';
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            string += sudoku[row][col];
        };
    };
    return string.replace(/0+/g, (match) => (match.length > 2 ? `(${match.length})` : match))
};

function StringToGrid(string) {
    string = string.replace(/\((\d+)\)/g, (m, p) => '0'.repeat(parseInt(p)));
    let sudoku = [[], [], [], [], [], [], [], [], []];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            sudoku[row].push(Number(string[9 * row + col]));
        };
    };
    return sudoku
};

const generateSudoku = () => {let sudoku = null; while (!sudoku) sudoku = Sudoku(); return sudoku};