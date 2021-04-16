/* GLOBAL VARIABLES */
const gameArea = document.querySelector('#conteiner-game');
const player = document.querySelector('#player');
const charList = document.querySelector('.modal__chooseChar ul');
const modal = document.querySelector('.modal');
const startButton = document.querySelector('input[type=\'button\']');
const MOVEMENT_PER_MILISECONDS = 200;
let charSelected = '';
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

const boardCreator = (index = 0) => {
    if(index === map.length){
        return false;
    }
    let currentLine = map[index];
    let line = createElement('div', 'conteiner-game__lines', gameArea);
    line.dataset.line = index;


    for(let i = 0; i < currentLine.length; i++){
        let block = currentLine[i];
        if(block === 'W'){
            const element = createElement('div', 'conteiner-game__walls', line);
            element.dataset.cell = i;

        }
        else if(block === 'S' || block ==='F'){
            const element = createElement('div', 'conteiner-game__paths', line);
            element.setAttribute('id', block);
            element.dataset.cell = i;

        }
        else {
           const element = createElement('div', 'conteiner-game__paths', line);
           element.dataset.cell = i;
        }
    }
    boardCreator(index += 1);
}
boardCreator();
/* CRIAÇÃO DO LABIRINTO */

const lines = document.querySelectorAll('.conteiner-game__lines');

const positionAtBeginning = () => {
    const playerInitialPos = document.querySelector('.conteiner-game__paths#S');
    const enemyInitialPos = document.querySelector('.conteiner-game__paths#F');
    playerInitialPos.appendChild(player);
    enemyInitialPos.appendChild(enemy);
}
positionAtBeginning();

const canMove = (steps , key) => {
    const line = Number(player.parentElement.parentElement.dataset.line);
    const playerLocation = Number(player.parentElement.dataset.cell);
    const nextLocationIndex = playerLocation + steps;
    const currentLine = lines[line].childNodes;

    if(key === 'ArrowLeft' || key === 'ArrowRight'){
        const nextPosition = currentLine[nextLocationIndex];
        if(nextPosition !== undefined && nextPosition.className === 'conteiner-game__paths'){
            return nextPosition;
        }
        return currentLine[playerLocation];
    } else {
        if(key === 'ArrowUp'){
            const nextLine = lines[line - 1].childNodes;
            const nextPosition = nextLine[playerLocation];
            if(nextPosition.className === 'conteiner-game__paths'){
                return nextPosition;
            }    
        }
        else if(key === 'ArrowDown'){
            const nextLine = lines[line + 1].childNodes;
            const nextPosition = nextLine[playerLocation];
            if(nextPosition.className === 'conteiner-game__paths'){
                return nextPosition;
            }    
        }
        return currentLine[playerLocation];
    }
}

const keyListener = evt => {
    const key = evt.key;
    movePlayer(key)
    return key;
}
const movePlayer = (key) => {
 
    const keys = {
        ArrowUp () {
            const nextPosition = canMove(0, 'ArrowUp');
            nextPosition.appendChild(player);
        },
        ArrowDown () {
            const nextPosition = canMove(0, 'ArrowDown');
            nextPosition.appendChild(player);
        },
        ArrowLeft () {
            const nextPosition = canMove(- 1, 'ArrowLeft');
            nextPosition.appendChild(player);
        },
        ArrowRight () {
            const nextPosition = canMove(+ 1, 'ArrowRight');
            nextPosition.appendChild(player);
        }
    }
    const moveTo = keys[key];
    if(moveTo !== undefined){
        moveTo();
        energizeBackground(true);
    }
}

const energizeBackground = (condition) => {
    if(condition) {
        gameArea.classList.add('dynamic-background-red');
    }
    else {
        gameArea.classList.remove('dynamic-background-red');
    }
}

const resetPage = () => {
    location.reload();
}

const showEndMessage = (condition) => {
    activeMovEnemy(false);
    modal.classList.remove('hidden');
    gameArea.classList.add('hidden');

    const message = createElement('h2', 'message', modal);
    const button = createElement('button', 'buttons', modal);

    if(condition === 'defeat'){
        message.innerText = 'Você perdeu';
    }
    else {
        message.innerText = 'Você venceu';
    }
    button.innerText = 'Restart'
    button.addEventListener('click', resetPage);
}

const defeatGame = () => {
    if(player.parentElement === enemy.parentElement){
        showEndMessage('defeat');
    }
    if(player.parentElement.id === 'F'){
        showEndMessage('victory');
    }
}

const moveEnemy = () =>{
    const line = Math.floor(Math.random() * ((lines.length-1) - 0 + 1) + 0);
    const block = Math.floor(Math.random() * (20 - 0 + 1) + 0);
    let nextLine = lines[line];
    let nextPosition = nextLine.childNodes[block];
    if((nextPosition.className === 'conteiner-game__paths')){
        nextPosition.appendChild(enemy);
    }
    defeatGame();
    energizeBackground(false);
    return nextPosition;
}

const activeMovEnemy = (condition) => {
    if(condition){
        enemyIsMoving = setInterval(moveEnemy, MOVEMENT_PER_MILISECONDS);
    }
    else {
        clearInterval(enemyIsMoving);   
    }
}

const playThemeSong = (char) => {
    const audio = document.createElement('audio');
    audio.src = `assets/songs/${char}-theme.mp3`;
    document.body.appendChild(audio);
    audio.play();
}

const closeCharScreen = () => {
    charList.parentElement.classList.add('hidden');
    gameArea.classList.remove('hidden');
}
const chooseYourChar = (evt) => {
    let selected = evt.target.alt;

    modal.classList.add('char-selected');

    if(selected === 'wanda'){
        modal.style.backgroundImage = 'url(assets/imagens/background-choose-char/wanda-selected.jpg)';
        player.children[0].src = 'assets/imagens/game/wanda-game.png';
        player.children[0].alt = selected;
        enemy.children[0].src = 'assets/imagens/game/agatha-game.png';

    } else {
        modal.style.backgroundImage = 'url(assets/imagens/background-choose-char/vision-selected.jpg)';
        player.children[0].src = 'assets/imagens/game/vision-game.png';
        player.children[0].alt = selected;
        enemy.children[0].src = 'assets/imagens/game/white-vision-game.png';

    }
    charSelected = selected;
}

const startGame = (evt) => { 
    if(player.children[0].src !== ''){
        closeCharScreen();
        playThemeSong(charSelected);
        activeMovEnemy(true);
        modal.classList.add('hidden');
    }
}

startButton.addEventListener('click', startGame);
charList.addEventListener('click', chooseYourChar);
document.addEventListener('keydown', keyListener);
