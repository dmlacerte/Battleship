/*Game Rules:

Objective: 
Be the first to sink all of your opponent's ships.

Contents: 
3 ships each (6 total), 
1 opponent board (hits - red, misses - gray, hidden ships - no color), 
1 player board (blue - ships, hits - red, misses - gray)

Rules:
1. Each player places their ships on the board horizontally or vertically
(this position cannot be changed once placed). <Add Figure with Example>
< Stretch - Start with randomly generated ships, but later add ability to select ship, 
and then select position using an arrow. >
2. First player selects a spot on the opponent's board. If the shot is a hit,
the spot will turn red. If it is a miss, the spot will turn gray.
< Stretch - hits yellow until full ship is sunk, then turns red. >
< Stretch - indicate which ship was hit, and change that ship in the DOM. >
3. After the player goes, the computer takes a turn. 
< Stretch - computer will act strategically instead of selecting a random open spot. >

*/

/*Layout:

Boards: 
5x5 boards 
< Stretch - customizable board size >  
Left border has letters, top border has numbers 
Under / Above boards - three ships, names of ship underneath 
< Stretch - bottom is buttons for setting ships >
< Stretch - ships has dots representing number of spaces, will change colors when hit > 
< Stretch - adding animations when a ship is hit > 
Right side of boards - start game button, reset button
< Stretch - arrows for setting ships >

*/

/*Design Goals:

MVP (HTML):

MVP Goals (CSS):

-----

Stretch Goals (HTML):

Stretch Goals (CSS):

*/

/*Player Side JS Design: 

MVP (JS):

Stretch Goals (JS):

*/

/*Computer Side JS Design: 

MVP Goals (JS):

Stretch Goals (JS):

*/



//OVERALL GAME SETUP
//1. Set up board
let gameSetup = true;

//a) Use a constructor to set up array of ship objects (PLAYER)
class Ship {
    constructor(shipName, length, color) {
        this.name = shipName;
        this.length = length;
        this.backgroundColor = color;
        this.spaceArr = [];
        this.hitsArr = [];
        this.shipSetup = false;
        this.shipSelected = false;
        this.isSunk = false;
    }
}

const shipsArrPlay = [
    new Ship("destroyer", 2, "gray-ship"),
    new Ship("submarine", 3, "green-ship"),
    new Ship("battleship", 4, "pink-ship")
];

//Use same constructor to set up array of ship objects (COMPUTER)
const shipsArrComp = [
    new Ship("destroyer", 2, "gray-ship"),
    new Ship("submarine", 3, "green-ship"),
    new Ship("battleship", 4, "pink-ship")
];

//b) Set up array of direction objects to move around the board
const directionsArr = [
    {
        name: "right",
        numSpaces: 1,
        spaceRef: "numOfSpacesToRight"
    },
    {
        name: "left",
        numSpaces: -1,
        spaceRef: "numOfSpacesToLeft"
    },
    {
        name: "up",
        numSpaces: -5,
        spaceRef: "numOfSpacesToTop"
    },
    {
        name: "down",
        numSpaces: 5,
        spaceRef: "numOfSpacesToBottom"
    }
]

//c) Use a constructor to set up array of board space objects (PLAYER)
class Space {
    constructor(colNum, rowNum) {
        this.spaceNum = 0;
        this.domID = "";
        this.colNum = colNum;
        this.rowNum = rowNum;
        this.numOfSpacesToLeft = colNum - 1;
        this.numOfSpacesToRight = 5 - colNum;
        this.numOfSpacesToTop = rowNum - 1;
        this.numOfSpacesToBottom = 5 - rowNum;
        this.isTaken = false;
        this.isTakenShipName = "";
        this.isMiss = false;
        this.isHit = false;
    }

    updateSurroundingSpace(arr) {
        //While loops to count spaces until you hit a taken space, or a side of the board
        //RIGHT
        let countRight = 0;
        let currentSpace = this.spaceNum;

        while (countRight < 5 - this.colNum) {
            currentSpace += directionsArr[0].numSpaces;
            if (arr[currentSpace].isTaken) {break};
            countRight++;
        }
        this.numOfSpacesToRight = countRight;

        //LEFT
        let countLeft = 0;
        currentSpace = this.spaceNum;

        while (countLeft < this.colNum - 1) {
            currentSpace += directionsArr[1].numSpaces;
            if (arr[currentSpace].isTaken) {break};
            countLeft++;
        }
        this.numOfSpacesToLeft = countLeft;

        //TOP
        let countTop = 0;
        currentSpace = this.spaceNum;

        while (countTop < this.rowNum - 1) {
            currentSpace += directionsArr[2].numSpaces;
            if (arr[currentSpace].isTaken) {break};
            countTop++;
        }
        this.numOfSpacesToTop = countTop;

        //BOTTOM
        let countBottom = 0;
        currentSpace = this.spaceNum;

        while (countBottom < 5 - this.rowNum) {
            currentSpace += directionsArr[3].numSpaces;
            if (arr[currentSpace].isTaken) {break};
            countBottom++;
        }
        this.numOfSpacesToBottom = countBottom;
    }
}

//Set up empty player array
const playerSpaceArray = [];

//Use constructor to loop through planned rows and columns to player array
let spaceNumPlay = 0;
for (let row = 1; row <= 5; row++) {
    for (let col = 1; col <= 5; col++) {
        let newSpace = new Space(col, row);

        //Use spaceNumPlay to add ID features for each new space object
        newSpace.spaceNum = spaceNumPlay;
        newSpace.domID = `pl-${spaceNumPlay}`;
        spaceNumPlay++;

        //Set if the space is on the left or right side of the board
        (col === 1 || col === 5) ? newSpace.isEndCol = true : newSpace.isEndCol = false;

        //Push new object into player space array
        playerSpaceArray.push(newSpace);
    }
}

//Use same constructor & process to set up array of board space objects (COMPUTER)
const compSpaceArray = [];

let spaceNumComp = 0;
for (let row = 1; row <= 5; row++) {
    for (let col = 1; col <= 5; col++) {
        let newSpace = new Space(col, row);

        //Use spaceNumPlay to add ID features for each new space object
        newSpace.spaceNum = spaceNumComp;
        newSpace.domID = `cp-${spaceNumComp}`;
        spaceNumComp++;

        //Set if the space is on the left or right side of the board
        (col === 1 || col === 5) ? newSpace.isEndCol = true : newSpace.isEndCol = false;

        //Push new object into player space array
        compSpaceArray.push(newSpace);
    }
}

//PLAYER SIDE BOARD SETUP
//1. Set up ship positions
//a. Select ship to position
const playerShips = document.querySelectorAll(".player-ship");
playerShips.forEach(ship => ship.addEventListener("click", selectShip));

let shipSize;
let shipIndex;

function selectShip(ev) {
    ev.preventDefault();

    let selectedShip = ev.target.parentNode.getAttribute("id");
    shipIndex = shipsArrPlay.findIndex(ship => ship.name === selectedShip);

    if (!shipsArrPlay[shipIndex].shipSetup) {
        shipsArrPlay[shipIndex].shipSelected = true;
        shipSize = shipsArrPlay[shipIndex].length;
    } else {
        alert("You've already set the position of this ship.");
    }
}

//b. Select direction to position ship
const arrowButtons = document.querySelectorAll(".direction");
arrowButtons.forEach(arrow => arrow.addEventListener("click", selectDirection));
let directionIndex;

function selectDirection(ev) {
    ev.preventDefault();

    let selectedDirection = ev.target.getAttribute("id");
    directionIndex = directionsArr.findIndex(direction => direction.name === selectedDirection);
}

//c. Add event listeners to player gameboard & set up helper functions. Allow user to set down ship. 
const playerBoardSpaces = document.querySelectorAll(".player-space");
playerBoardSpaces.forEach(space => space.addEventListener("click", selectSpace));

function selectSpace(ev) {
    ev.preventDefault();
    let validPlacement = false;

    //Validate that user has selected required inputs (ship & direction), and that ship has not been set up already.
    if (!!(directionIndex + 1) && shipsArrPlay[shipIndex].shipSelected && !shipsArrPlay[shipIndex].shipSetup) {       
        //Validate that the size of the ship will fit in the direction selected. 
        let moveLengthValid = validateMoveLength(ev.target, playerSpaceArray, directionIndex, shipSize);
        if (moveLengthValid) {
            validPlacement = true;
        }

    } else if (shipsArrPlay[shipIndex].shipSetup) {
        alert("You have already set up this ship, please select an available ship.");
    }
    else {
        alert("Please select a ship and a direction before selecting a starting space.");
    }

    //If ship in a valid placement, set the ship in that space.
    if (validPlacement) {
        setShip(ev.target, shipsArrPlay[shipIndex].backgroundColor, playerSpaceArray, shipsArrPlay, shipIndex, directionIndex);
        resetDefaultVariables();
    } else {
        alert("The ship will not fit in the selected direction, please choose another direction or another space.");
    }
        
}

function validateMoveLength(targetCell, targetArray, directionIndex, shipSize) {
    let selectedNumber = convertDomToArrID(targetCell);
    targetArray[selectedNumber].updateSurroundingSpace(targetArray);
    let availableSpace = targetArray[selectedNumber][directionsArr[directionIndex].spaceRef];
    if (availableSpace >= (shipSize - 1)) {
        return true;
    } else {
        return false;
    }
}

function setShip(targetCell, newDomClass, targetSpaceArray, targetShipsArray, shipIndex, directionIndex) {
    markSpaceTakenDom(targetCell, newDomClass);
    let selectedNumber = convertDomToArrID(targetCell);
    markSpaceTakenArr(targetSpaceArray, selectedNumber);
    targetShipsArray[shipIndex].spaceArr.push(selectedNumber);
    targetSpaceArray[selectedNumber].isTakenShipName = targetShipsArray[shipIndex].name;

    for (let i = 2; i <= targetShipsArray[shipIndex].length; i++) {
        //Set selected number to be one space over in specified direction
        selectedNumber = moveOverOneSpace(selectedNumber, directionIndex);
        markSpaceTakenArr(targetSpaceArray, selectedNumber);
        let shipID = `#${targetSpaceArray[selectedNumber].domID}`;
        markSpaceTakenDom(document.querySelector(shipID), newDomClass);
        targetShipsArray[shipIndex].spaceArr.push(selectedNumber);
        targetSpaceArray[selectedNumber].isTakenShipName = targetShipsArray[shipIndex].name;
    }

    targetShipsArray[shipIndex].shipSetup = true;
}

function markSpaceTakenDom(element, newClass) {
    element.classList.add(newClass);
}

function convertDomToArrID(element) {
    let selectedID = element.getAttribute("id");
    return Number(selectedID.slice(3));
}

function convertArrIDToDom(arr, space) {
    let domID = `#${arr[space].domID}`;
    return document.querySelector(domID);
}

function markSpaceTakenArr(arr, num) {
    arr[num].isTaken = true;
} 

function moveOverOneSpace(num, directionIndex) {
    return num + directionsArr[directionIndex].numSpaces;
}

function resetDefaultVariables() {
    shipSize = 0;
    shipIndex = -1;
    directionIndex = -1;
}

//COMPUTER GAME SETUP
//Setting up computer ships
let startButton = document.querySelector("#start-game");
startButton.addEventListener("click", startGame);

function startGame(ev) {
    ev.preventDefault();

    for (let i = 0; i < shipsArrComp.length; i++) {
        let validPlacement = false;
        let moveLengthValid = false;

        while (validPlacement === false) {
            let randomNumber = Math.floor(Math.random() * (compSpaceArray.length));
            let randomDirectionIndex = Math.floor(Math.random() * 3);
            let firstTargetDiv = convertArrIDToDom(compSpaceArray, randomNumber);
            if (!compSpaceArray[randomNumber].isTaken) {
                moveLengthValid = validateMoveLength(firstTargetDiv, compSpaceArray, randomDirectionIndex, shipsArrComp[i].length);
            }

            if (moveLengthValid) {
                validPlacement = true;
            }

            if (validPlacement) {
                setShip(firstTargetDiv, shipsArrComp[i].backgroundColor, compSpaceArray, shipsArrComp, i, randomDirectionIndex);
            }
        }
    }
}

//Add event listeners to computer gameboard
const compBoardSpaces = document.querySelectorAll(".comp-space");
compBoardSpaces.forEach(space => space.addEventListener("click", takeShot));

//MAKING MOVES
//1. Player moves
function takeShot(ev) {
    ev.preventDefault();
    let targetNum = ev.target.getAttribute("id").slice(3);

    if (compSpaceArray[targetNum].isMiss === true || compSpaceArray[targetNum].isHit === true) {
        alert("You have already selected this space, please select another.");
        return;
    }

    if (compSpaceArray[targetNum].isTaken === false) {
        ev.target.classList.add("miss");
        compSpaceArray[targetNum].isMiss = true;
    } else if (compSpaceArray[targetNum].isTaken === true) {
        ev.target.classList.add("hit");
        compSpaceArray[targetNum].isHit = true;
        // let hitShip = playerSpaceArray[targetNum].isTakenShipName;
        // checkIfSank(hitShip, targetNum);
        //NEED TO UPDATE ABOVE TO BE TRANSLATABLE TO PLAYER
    }

    computerMoves();
}

//2. Computer moves
//Computer selects a random space and moves
let potentialCompMoves = [];

for (let i = 0; i < playerSpaceArray.length; i++) {
    potentialCompMoves.push(playerSpaceArray[i].spaceNum);
}

function computerMoves() {
    let randomNumber = Math.floor(Math.random() * (potentialCompMoves.length));
    let randomGuess = potentialCompMoves[randomNumber];

    potentialCompMoves.splice(randomNumber, 1);

    let domSpaceID = `#pl-${randomGuess}`
    let domSpace = document.querySelector(domSpaceID);

    if (playerSpaceArray[randomGuess].isTaken === false) {
        domSpace.classList.add("miss");
        playerSpaceArray[randomGuess].isMiss = true;
    } else if (playerSpaceArray[randomGuess].isTaken === true) {
        domSpace.classList.remove("player-setup");
        domSpace.classList.add("hit");
        playerSpaceArray[randomGuess].isHit = true;
        let hitShip = playerSpaceArray[randomGuess].isTakenShipName;
        checkIfSank(hitShip, randomGuess);
    }
}

//ENDING GAME
let playerWins = false;
let compWins = false;

function checkIfSank(hitShip, randomGuess) {
    let hitIndex = shipsArrPlay.findIndex(ship => ship.name === hitShip);
    shipsArrPlay[hitIndex].hitsArr.push(randomGuess);
    
    if (shipsArrPlay[hitIndex].hitsArr.length === shipsArrPlay[hitIndex].spaceArr.length) {
        shipsArrPlay[hitIndex].isSunk = true;
        checkIfWins();
    }
}

function checkIfWins() {
    if (shipsArrPlay.every(ship => ship.isSunk === true)) {
        compWins = true;
    } else if (shipsArrComp.every(ship => ship.isSunk === true)) {
        playerWins = true;
    }
}

//RESETTING GAME
//moveCount = 0;