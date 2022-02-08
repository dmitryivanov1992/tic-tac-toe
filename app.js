const board = document.querySelector('#board');
const buttonsSize = document.querySelectorAll('.btnSize');
let boardSize = 0;
const chooseSize = document.querySelector('#choose-size')
let crossFlag = false; //false- circle, true - cross
let winFlag = {};

for (let button of buttonsSize) {
    button.addEventListener('click', () => {
        boardSize = Number(button.dataset.size)
        board.style.width = `${boardSize * 50}px`
        board.style.height = `${boardSize * 50}px`
        createBoard();
        startGame();
    })
}

function createBoard() {
    let squares = document.querySelectorAll('.square');

    for (let square of squares) {
        square.remove();
    }

    for (let i = 0; i < Math.pow(boardSize, 2); i++) {
        const squareElement = document.createElement("div");
        squareElement.classList.add('square');
        const innerElement = document.createElement("div")
        innerElement.classList.add('square-inner-element')
        squareElement.append(innerElement)
        board.append(squareElement)
    }

    chooseSize.style.top = '-100vh'
    board.style.top = `calc(50% - ${board.offsetHeight / 2}px)`
}

function startGame() {
    let squares = document.querySelectorAll('.square')

    let boardTitle = document.createElement("h2")
    boardTitle.style.top = `calc(50% - ${board.offsetHeight / 2 + 50}px)`
    boardTitle.innerText = `Goes ${crossFlag ? 'cross' : 'circle'}`
    document.body.prepend(boardTitle)

    for (let i = 0; i < squares.length; i++) {
        squares[i].addEventListener('mouseover', () => {
            squares[i].style.border = '2px solid red';
        })

        squares[i].addEventListener('mouseout', () => {
            squares[i].style.border = '1px solid white';
        })

        squares[i].addEventListener('click', () => {
            if (crossFlag && !squares[i].filled) {
                squares[i].firstChild.classList.add('cross')
                squares[i].filled = true;
                squares[i].cross = true;
                crossFlag = !crossFlag;
            } else if (!crossFlag && !squares[i].filled) {
                squares[i].firstChild.classList.add('circle')
                squares[i].filled = true;
                squares[i].circle = true;
                crossFlag = !crossFlag;
            }
            document.querySelector('body h2').innerText = `Goes ${crossFlag ? 'cross' : 'circle'}`
            checkResult(squares, i)
        })
    }
}

function CrossCircleCount(array, squares) {
    if (!winFlag.flag) {
        let winCross = 0;
        let winCircle = 0;
        for (let i of array) {
            if (squares[i].cross !== undefined) {
                winCross += squares[i].cross
            }
            if (squares[i].circle !== undefined) {
                winCircle += squares[i].circle
            }
        }
        let team = '';
        let Flag = ((winCross === boardSize) || (winCircle === boardSize))
        if (Flag) {
            team = (winCross === boardSize ? 'Crosses' : 'Circles');
        }

        winFlag = {
            flag: Flag,
            team: team,
            position: array
        }
    }
}

function checkResult(squares, squareNumber) {

    //Check lines up & down
    let countStart = 0;

    for (let i = squareNumber; i >= 0;) {
        countStart = i;
        i -= boardSize;
    }
    let upDownArray = [];

    for (let i = countStart; i < boardSize * boardSize;) {
        upDownArray.push(i)
        i += boardSize;
    }

    CrossCircleCount(upDownArray, squares)

    // //Check lines right and left

    countStart = squareNumber - squareNumber % boardSize;
    let leftRightArray = [];

    for (let i = countStart; i < countStart + boardSize; i++) {
        leftRightArray.push(i)
    }

    CrossCircleCount(leftRightArray, squares);

    //check diagonals

    let firstDiagonalArray = []

    for (let i = 0; i < boardSize * boardSize;) {
        firstDiagonalArray.push(i)
        i += boardSize + 1;
    }

    CrossCircleCount(firstDiagonalArray, squares);

    let SecondDiagonalArray = []

    for (let i = boardSize - 1; i < boardSize * boardSize - 2;) {
        SecondDiagonalArray.push(i)
        i += boardSize - 1;
    }

    CrossCircleCount(SecondDiagonalArray, squares)

    if (winFlag.flag) {
        winnerHighlight(winFlag.position, squares)
        document.querySelector('body h2').innerText = `Winner ${winFlag.team}`
        let btnRestart = document.createElement('button')
        btnRestart.classList.add('btnRestart')
        btnRestart.innerText = 'RESTART GAME'
        document.body.append(btnRestart)
        btnRestart.addEventListener('click', () => {
            window.location.reload();
            btnRestart.remove()
        })
      
    }

    //check draw
    let squareArray=[]

    for (let i=0;i<squares.length;i++){
        squareArray.push(squares[i])
    }

    if ((!winFlag.flag) && (squareArray.every(item=>item.filled===true))) {
        document.querySelector('body h2').innerText = `Draw!`
        let btnRestart = document.createElement('button')
        btnRestart.classList.add('btnRestart')
        btnRestart.innerText = 'RESTART GAME'
        document.body.append(btnRestart)
        btnRestart.addEventListener('click', () => {
            window.location.reload();
            btnRestart.remove()
        })
    }

    
}

function winnerHighlight(array, squares) {
    for (let item in array) {
        squares[array[item]].firstElementChild.style.transform = 'scale(1.2)'
    }
}



