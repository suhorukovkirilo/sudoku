function createBoard(parentElement) {
    for (let i = 0; i < 9; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        row.innerHTML = '<div></div>'.repeat(9);
        parentElement.appendChild(row);
    };
    for (let i = 1; i < 5; i++) {
        parentElement.innerHTML += `<div class="line line-${i}"></div>`;
    };
};

function createNumbersChooser(parentElement) {
    parentElement.innerHTML = '<button class="1 active">1</button>';
    for (let i = 2; i < 10; i++) {
        parentElement.innerHTML += `<button class="${i}">${i}</button>`
    }; 
    parentElement.innerHTML += '<div class="arrow"><div class="triangle"></div><div class="rectangle"></div></div>';

    for (let numBtn of parentElement.querySelectorAll('button')) {
        numBtn.onclick = function() {
            parentElement.querySelector('.arrow').style.cssText = `--num: ${this.innerHTML}`;
            for (let btn of parentElement.querySelectorAll('button')) {
                if (btn.innerHTML == this.innerHTML) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                };
            };
        };
    };
};

function fillBoard(sudoku, element) {
    const divs = element.querySelectorAll('.row div');
    for (let div of divs) {
        div.innerHTML = '';
    };
    for (let i = 0; i < 81; i++) {
        let [row, col] = [Math.floor(i / 9), i % 9];
        let value = sudoku[row][col].toString();
        if (value != '0') {
            divs[i].innerHTML = value;
            divs[i].classList.add('fixed');
        };
        divs[i].onclick = function() {
            if (!this.classList.contains('fixed')) {
                let i = Array.from(element.querySelectorAll('.row div')).indexOf(this);
                let [row, col] = [Math.floor(i / 9), i % 9];
                if (this.innerHTML != '') {
                    this.innerHTML = '';
                    sudoku[row][col] = 0;
                } else {
                    let numberToPut = Number(document.querySelector('.numbers button.active').innerHTML);
                    sudoku[row][col] = numberToPut;
                    this.innerHTML = numberToPut;
                };
                for (let div of divs) {
                    div.classList.remove('wrong');
                };
                let checkResults = checkBoard(sudoku);
                if (checkResults.row != null) {
                    for (let i = 0; i < 9; i++) {
                        divs[9 * checkResults.row + i].classList.add('wrong');
                    };
                } else if (checkResults.col != null) {
                    for (let i = 0; i < 9; i++) {
                        divs[9 * i + checkResults.col].classList.add('wrong');
                    };
                } else if (checkResults.square != null) {
                    for (let row = 0; row < 3; row++) {
                        for (let col = 0; col < 3; col++) {
                            divs[9 * (3 * checkResults.square.row + row) + 3* checkResults.square.col + col].classList.add('wrong');
                        };
                    };
                };

                let score = countScore(sudoku);
                document.getElementById('score').innerHTML = score;
            };
        };
    };
};

function checkBoard(sudoku) {
    for (let row = 0; row < 9; row++) {
        let count = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0};
        for (let value of sudoku[row]) {
            value != 0 ? count[value] += 1 : null;
        };
        for (let value of Object.values(count)) {
            if (value > 1) return {row: row, col: null, square: null};
        };
    };
    for (let col = 0; col < 9; col++) {
        let count = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0};
        for (let row = 0; row < 9; row++) {
            let value = sudoku[row][col];
            value != 0 ? count[value] += 1 : null;
        };
        for (let value of Object.values(count)) {
            if (value > 1) return {row: null, col: col, square: null};
        };
    };
    for (let squareRow = 0; squareRow < 3; squareRow++) {
        for (let squareCol = 0; squareCol < 3; squareCol++) {
            let square = [];
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    let value = sudoku[3 * squareRow + row][3 * squareCol + col];
                    if (value != 0) {
                        if (square.includes(value)) {
                            return {row: null, col: null, square: {row: squareRow, col: squareCol}}
                        };
                        square.push(value);
                    };
                };
            };
        };  
    };
    return {row: null, col: null, square: null};
};

function updateCell(row, col, num) {
    let i = 9 * row + col;
    let div = document.querySelectorAll('#sudoku .row div')[i];
    if (!div.classList.contains('fixed')) {
        div.innerHTML = num;
        div.classList.add('updated');
        setTimeout(() => { div.classList.remove('updated') }, 2600);
    }; 
    score.innerHTML = countScore(sudoku.board);
};

function countScore(sudoku) {
    let check = checkBoard(sudoku);
    if (!(check.row == null && check.col == null && check.square == null)) {
        return 0
    };
    let score = 0;

    for (let row of sudoku) {
        if (row.indexOf(0) == -1) {
            score += 30;
        };
    };

    for (let col = 0; col < 9; col++) {
        for (let row of sudoku) {
            if (row[col] == 0) {
                score -= 30;
                break
            };
        };
        score += 30;
    };

    for (let square = 0; square < 9; square++) {
        let [startRow, startCol] = [Math.floor(square / 3), square % 3];
        for (let pos = 0; pos < 9; pos++) {
            let num = sudoku[3 * startRow + Math.floor(pos / 3)][3 * startCol + pos % 3];
            if (num == 0) {
                score -= 51;
                break;
            };
        };
        score += 51;
    };

    return score
};