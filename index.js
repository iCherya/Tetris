let main = document.querySelector('.main');
const bestScoreEl = document.querySelector('#bestScore');
const scoreEl = document.querySelector('#score');
const levelEl = document.querySelector('#level');
const nextFigureEl = document.querySelector('.next-figure');
const startBtn = document.querySelector('#start');
const pauseBtn = document.querySelector('#pause');
const musicBtn = document.querySelector('#music');
const gameOverBlock = document.querySelector('#game-over');
const gamePauseBlock = document.querySelector('#game-pause');

let playField = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
let bestScore = localStorage.getItem('scores') || 0;
let flagStartGame = true;
let score = 0,
    getTimerID,
    currentLevel = 1,
    isPaused = true,
    possibleLevels = {
        1: {
            scorePerLine: 10,
            speed: 400,
            nexLevelScore: 100,
        },
        2: {
            scorePerLine: 20,
            speed: 300,
            nexLevelScore: 300,
        },
        3: {
            scorePerLine: 30,
            speed: 200,
            nexLevelScore: 1000,
        },
        4: {
            scorePerLine: 50,
            speed: 100,
            nexLevelScore: 2000,
        },
        5: {
            scorePerLine: 100,
            speed: 50,
            nexLevelScore: Infinity,
        }
    };

let figures = {
    o: [
        [1, 1],
        [1, 1],
    ],
    i: [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    s: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    l: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    j: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    t: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
};

let activeFigure = getNewFigure();
let nextFigure = getNewFigure();

function aud_play_pause() {

    let myAudio = document.getElementById("themeSong");
    if (myAudio.paused) {
        myAudio.play();
        musicBtn.classList.toggle('innactive');
        musicBtn.blur();
    } else {
        myAudio.pause();
        musicBtn.classList.toggle('innactive');
        musicBtn.blur();
    }

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

function renderNextFigure() {
    let nextFigureInnerHTML = '';
    for (let y = 0; y < nextFigure.shape.length; y++) {
        for (let x = 0; x < nextFigure.shape[y].length; x++) {
            if (nextFigure.shape[y][x]) {
                nextFigureInnerHTML += '<div class="cell moving-cell"></div>';
            } else {
                nextFigureInnerHTML += '<div class="cell"></div>';
            }
        }
        nextFigureInnerHTML += `<br>`
    }
    nextFigureEl.innerHTML = nextFigureInnerHTML;
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
    removePreviousActiveFigure();
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

function removeFullLines() {
    let canRemoveLine = true,
        filledLines = 0;
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] != 2) {
                canRemoveLine = false;
                break;
            }
        }
        if (canRemoveLine) {
            playField.splice(y, 1);
            playField.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('scores', bestScore);
    }

    scoreEl.innerHTML = score;
    bestScoreEl.innerHTML = bestScore;

    if (score >= possibleLevels[currentLevel].nexLevelScore) {
        currentLevel++;
        levelEl.innerHTML = currentLevel;
    }
}

function getNewFigure() {
    const possibleFigures = 'oiszljt',
        rand = Math.floor(Math.random() * 7),
        newFigure = figures[possibleFigures[rand]];

    return {
        x: Math.floor((playField[0].length - newFigure[0].length) / 2),
        y: 0,
        shape: newFigure,
    };
}

function fixCell() {
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] === 1) {
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
        activeFigure = nextFigure;
        if (hasCollisions()) {
            reset();
        }
        nextFigure = getNewFigure();
    }
}

function dropFigure() {
    for (let y = activeFigure.y; y < playField.length; y++) {
        activeFigure.y += 1;
        if (hasCollisions()) {
            activeFigure.y -= 1;
            break;
        }
    }
}

function reset() {
    isPaused = true;
    clearTimeout(getTimerID);
    playField = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    render();
    gameOverBlock.style.display = "flex";
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.innerHTML = "Play again";
    flagStartGame = true;
}

document.onkeydown = function (e) {
    if (!pauseBtn.disabled) {
        if (e.keyCode === 32) {
            gameIsPaused();
        }
    }
    if (e.keyCode === 13) {
        if (flagStartGame) {
            gameIsStarts();
            flagStartGame = false;
        }
    }
    if (e.keyCode === 32) {

    }
    if (!isPaused) {
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
            dropFigure();
        } else if (e.keyCode === 38 || e.keyCode === 192) {
            rotateFigure();
        }
        updateGameState();
    }
};

function updateGameState() {
    if (!isPaused) {
        addActiveFigure();
        render();
        renderNextFigure();
    }
}

pauseBtn.addEventListener('click', (e) => {
    gameIsPaused();
});

startBtn.addEventListener('click', () => {
    gameIsStarts();
});

function gameIsPaused() {
    if (pauseBtn.textContent === "Pause") {
        pauseBtn.textContent = "Continue";
        clearTimeout(getTimerID);
        gamePauseBlock.style.display = "flex";
    } else {
        pauseBtn.textContent = "Pause";
        getTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
        gamePauseBlock.style.display = "none";
    }
    pauseBtn.blur();
    isPaused = !isPaused;
}

function gameIsStarts() {
    currentLevel = 1;
    score = 0;
    scoreEl.innerText = '0';
    levelEl.innerText = '1';
    pauseBtn.disabled = false;
    startBtn.disabled = true;
    startBtn.textContent = "Enjoy";
    isPaused = false;
    getTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    gameOverBlock.style.display = 'none';
}



scoreEl.innerHTML = score;
levelEl.innerHTML = currentLevel;
bestScoreEl.innerHTML = bestScore;
render();


function startGame() {
    moveFigureDown();
    if (!isPaused) {
        updateGameState();
        getTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }
}