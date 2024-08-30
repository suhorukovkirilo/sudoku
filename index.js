const sudokuElement = document.getElementById('sudoku');
const popup = document.querySelector('.popup');
const numbers = document.querySelector('.numbers');
const btns = document.querySelector('.btn-group');
const score = document.getElementById('score');
btns.viewSolution = document.getElementById('view-solution');
btns.restart = document.getElementById('restart');
btns.generate = document.getElementById('generate');
btns.share = document.getElementById('share');
btns.github = document.getElementById('github');

let sudoku, backupSudoku;
if (location.href.split('#')[1] != undefined ) {
    sudoku = {board: StringToGrid(location.href.split('#')[1]), steps: []};
    let checkResults = checkBoard(sudoku.board);
    if (Object.values(checkResults).find((el) => (el != null)) != undefined) {
        sudoku = hardSudoku(generateSudoku());
    };
} else {
    sudoku = hardSudoku(generateSudoku());
};

backupSudoku = structuredClone(sudoku);
createNumbersChooser(numbers);
createBoard(sudokuElement);
fillBoard(sudoku.board, sudokuElement);

btns.viewSolution.onclick = function() {
    this.style.visibility = 'visible';
    btns.style.visibility = 'hidden';
    solveSudoku(sudoku.board, sudoku.steps, updateCell, () => {btns.style.visibility = 'visible'});
};

btns.restart.onclick = () => {
    sudoku = structuredClone(backupSudoku); 
    fillBoard(sudoku.board, sudokuElement);
    score.innerHTML = 0;
};

btns.generate.onclick = () => {location.href = location.href.split('#')[0]};
btns.github.onclick = () => {window.open('https://github.com/suhorukovkirilo/sudoku')}
btns.share.onclick = () => {
    let input = popup.querySelector('input');
    popup.classList.add('show');
    input.value = location.href.split('#')[0] + '#' + GridToString(sudoku.board);
    popup.querySelector('.copy').onclick = () => {
        input.select();
        navigator.clipboard.writeText(input.value);
    };
};

popup.querySelector('.telegram').onclick = () => {window.open(getShare('https://t.me/share/url?url=%url%&text=%text%'))};
popup.querySelector('.viber').onclick = () => {window.open(getShare('viber://forward?text=%text%:%0A%url%'))};
popup.querySelector('.whatsapp').onclick = () => {window.open(getShare('https://wa.me/?text=%text%:%0A%url%'))};
popup.querySelector('.screen').onclick = () => {popup.classList.remove('show')};

const getShare = (t) => {
    let text = 'З вами поділилися судоку';
    let url = encodeURIComponent(location.href.split('#')[0] + '#' + GridToString(sudoku.board));
    return t.replace('%text%', text).replace('%url%', url)
};
