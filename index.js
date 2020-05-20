let main = document.querySelector('.main');
const scoreEl = document.querySelector('#score'),
    levelEl = document.querySelector('#level');

let figures = {
    o: [
        [1,1],
        [1,1],
    ],
    i: [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
    ],
    s: [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    z: [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    l: [
        [0,1,0],
        [0,1,0],
        [0,1,1],
    ],
    j: [
        [0,1,0],
        [0,1,0],
        [1,1,0],
    ],
    t: [
        [1,1,1],
        [0,1,0],
        [0,0,0],
    ],
}

let playField = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
];


let score = 0,
    currentLevel = 1;

    possibleLevels = {
        1: {
            scorePerLine: 10,
            speed: 400,
            nexLevelScore: 50,
        },
        2: {
            scorePerLine: 20,
            speed: 300,
            nexLevelScore: 100,
        },
        3: {
            scorePerLine: 30,
            speed: 200,
            nexLevelScore: 200,
        },
        4: {
            scorePerLine: 50,
            speed: 100,
            nexLevelScore: 500,
        },
        5: {
            scorePerLine: 100,
            speed: 50,
            nexLevelScore: Infinity,
        }
    }
let activeFigure = {
    x: 0,
    y: 0,
    shape: [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ]
};

function getNewFigure() {
    const possibleFigures = 'oiszljt';
    
    const rand = Math.floor(Math.random()*7);
    return figures[possibleFigures[rand]];
}

function render() {
    let mainInnerHTML = '';
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] === 1) {
                mainInnerHTML += '<div class="cell moving-cell"></div>';
            } else if (playField[y][x] === 2) {
                mainInnerHTML += '<div class="cell fixed-cell"></div>';
            } else {
                mainInnerHTML += '<div class="cell"></div>';
            }
        }
    }
    main.innerHTML = mainInnerHTML;
}

function removePreviousActiveFigure() {
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] === 1) {
                playField[y][x] = 0;
            }
            
        }
    }
}

function addActiveFigure() {
    removePreviousActiveFigure()
    for (let y = 0; y < activeFigure.shape.length; y++) {
        for (let x = 0; x < activeFigure.shape[y].length; x++) {
            if (activeFigure.shape[y][x] === 1) {
                playField[activeFigure.y + y][activeFigure.x + x] = activeFigure.shape[y][x];
            }
        }
    }
}

function rotateFigure() {
    const prevFigureState = activeFigure.shape;
    activeFigure.shape = activeFigure.shape[0].map((val, index) => 
    activeFigure.shape.map((row) => row[index]).reverse()
    );
    if (hasCollisions()) {
        activeFigure.shape = prevFigureState;
    }
}

function hasCollisions() {
    for (let y = 0; y < activeFigure.shape.length; y++) {
        for (let x = 0; x < activeFigure.shape[y].length; x++) {
            if (
                activeFigure.shape[y][x] && 
                (playField[activeFigure.y + y] === undefined ||
                playField[activeFigure.y + y][activeFigure.x + x] === undefined ||
                playField[activeFigure.y + y][activeFigure.x + x] === 2)
            ) {
                return true;
            }
        }
    }
    return false;
}

function removeFullLines(){
    let canRemoveLine = true,
        filledLines = 0;

    for (let y = 0; y < playField.length; y++) {
        
        for (let x = 0; x < playField[y].length; x++) {
            
            if(playField[y][x] != 2) {
                canRemoveLine = false;
                break;
            }
        }
        if (canRemoveLine) {
            playField.splice(y, 1);
            playField.splice(0, 0, [0,0,0,0,0,0,0,0,0,0]);
            filledLines += 1; 
        }
        canRemoveLine = true;
    }
    switch (filledLines) {
        case 1:
            score += possibleLevels[currentLevel].scorePerLine;
            break;
        case 2:
            score += possibleLevels[currentLevel].scorePerLine * 3;
            break;
        case 3:
            score += possibleLevels[currentLevel].scorePerLine * 6;
            break;
        case 4:
            score += possibleLevels[currentLevel].scorePerLine * 12;
            break;
    }
    scoreEl.innerHTML = score;
    if (score >= possibleLevels[currentLevel].nexLevelScore) {
        currentLevel++;
        levelEl.innerHTML = currentLevel;
    }
}

function fixCell() {
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if(playField[y][x] === 1) {
                playField[y][x] = 2;
            }
        }
    }
}

function moveFigureDown() {
    activeFigure.y += 1;
    if (hasCollisions()) {
        activeFigure.y -= 1;
        fixCell();
        removeFullLines();
        activeFigure.shape = getNewFigure();
        activeFigure.x = Math.floor((playField[0].length - activeFigure.shape[0].length)/2);
        activeFigure.y = 0;
    }
}

document.onkeydown = function(e) {
    if (e.keyCode === 37) {
        activeFigure.x -= 1;
        if (hasCollisions()) {
            activeFigure.x += 1;
        }
    } else if (e.keyCode === 39) {
        activeFigure.x += 1;
        if (hasCollisions()) {
            activeFigure.x -= 1;
        }
    } else if (e.keyCode === 40) {
        moveFigureDown()
    } else if (e.keyCode === 38) {
        rotateFigure();
    }
    addActiveFigure();
    render();
}

scoreEl.innerHTML = score;
levelEl.innerHTML = currentLevel;

addActiveFigure();
render();


function startGame() {
    moveFigureDown()
    addActiveFigure();
    render();
    setTimeout(startGame, possibleLevels[currentLevel].speed);
}

setTimeout(startGame, possibleLevels[currentLevel].speed);