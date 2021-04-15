const gameArea = document.querySelector('#conteiner-game');
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
    let currentLine = map[index];

    if(index === map.length-1){
        return false;
    }
    else {
        let line = createElement('div', 'line', gameArea);
        for(let i = 0; i < currentLine.length; i++){
            let block = currentLine[i];
            if(block === 'W'){
                createElement('div', 'wall', line);
            }
            else if(block === 'S' || 'F'){
                const element = createElement('div', 'path', line);
                element.setAttribute('id', block);
            }
        }
        boardCreator(index += 1);
    }
}
boardCreator();