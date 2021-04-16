/* GLOBAL VARIABLES */
const gameArea = document.querySelector('#conteiner-game');
const player = document.querySelector('#player');
/* GLOBAL VARIABLES */

/* CRIAÇÃO DO LABIRINTO */
const map = [
    "WWWWWWWWWWWWWWWWWWWWW",
    "W   W     W     W W W",
    "W W W WWW WWWWW W W W",
    "W W W   W     W W   W",
    "W WWWWWWW W WWW W W W",
    "W         W     W W W",
    "W WWW WWWWW WWWWW W W",
    "W W   W   W W     W W",
    "W WWWWW W W W WWW W F",
    "S     W W W W W W WWW",
    "WWWWW W W W W W W W W",
    "W     W W W   W W W W",
    "W WWWWWWW WWWWW W W W",
    "W       W       W   W",
    "WWWWWWWWWWWWWWWWWWWWW",
];
const createElement = (element, elClass, parent) => {
    let createdElement = document.createElement(element);
    createdElement.classList.add(elClass);
    parent.appendChild(createdElement);
    return createdElement;
}
const putCellDatasetInBlocks = (element,value) => {
    element.dataset.cell = value;
}

const boardCreator = (index = 0) => {
    if(index === map.length-1){
        return false;
    }
    let currentLine = map[index];
    let line = createElement('div', 'conteiner-game__lines', gameArea);
    line.dataset.line = index;


    for(let i = 0; i < currentLine.length; i++){
        let block = currentLine[i];
        if(block === 'W'){
            const element = createElement('div', 'conteiner-game__walls', line);
            putCellDatasetInBlocks(element, i);

        }
        else if(block === 'S' || block ==='F'){
            const element = createElement('div', 'conteiner-game__paths', line);
            element.setAttribute('id', block);
            putCellDatasetInBlocks(element, i);

        }
        else {
           const element = createElement('div', 'conteiner-game__paths', line);
           putCellDatasetInBlocks(element, i);
        }

    }
    boardCreator(index += 1);
}
boardCreator();
/* CRIAÇÃO DO LABIRINTO */

const putPlayerInStartPos = () => {
    const initialPosition = document.querySelector('.conteiner-game__paths#S');
    initialPosition.appendChild(player);
    return initialPosition;
}

/* VERIFICAÇÃO DO MOVIMENTO */
const canWalk = (steps , key) => {
    const board = document.querySelectorAll('.conteiner-game__lines');
    const line = Number(player.parentElement.parentElement.dataset.line);
    const playerLocation = Number(player.parentElement.dataset.cell);
    const nextLocationIndex = playerLocation + steps;


    if(key === 'ArrowLeft' || key === 'ArrowRight'){
        const currentLine = board[line].childNodes;
        const nextPosition = currentLine[nextLocationIndex];
        if(nextPosition.className === 'conteiner-game__paths'){
            return nextPosition;
        }
        return currentLine[playerLocation];
    } else {
        if(key === 'ArrowUp'){
            const nextLine = board[line - 1].childNodes;
            const nextPosition = nextLine[playerLocation];
            if(nextPosition.className === 'conteiner-game__paths'){
                return nextPosition;
            }    
        }
        else if(key === 'ArrowDown'){
            const nextLine = board[line + 1].childNodes;
            const nextPosition = nextLine[playerLocation];
            if(nextPosition.className === 'conteiner-game__paths'){
                return nextPosition;
            }    
        }
        return currentLine[playerLocation];
    }

}
/* VERIFICAÇÃO DO MOVIMENTO */

const keyListener = evt => {
    const key = evt.key;
    movePlayer(key)
    return key;
}
const movePlayer = (key) => {
    const keys = {
        ArrowUp () {
            const nextPosition = canWalk(0, 'ArrowUp');
            nextPosition.appendChild(player);
        },
        ArrowDown () {
            const nextPosition = canWalk(0, 'ArrowDown');
            nextPosition.appendChild(player);
        },
        ArrowLeft () {
            const nextPosition = canWalk(- 1, 'ArrowLeft');
            nextPosition.appendChild(player);
        },
        ArrowRight () {
            const nextPosition = canWalk(+ 1, 'ArrowRight');
            nextPosition.appendChild(player);
        }
    }
    const moveTo = keys[key];
    if(moveTo !== undefined){
        moveTo();
    }
}
putPlayerInStartPos();

document.addEventListener('keydown', keyListener);
