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
    constructor(shipName, length) {
        this.name = shipName;
        this.length = length;
        this.spaceArr = [];
        this.hitsArr = [];
        this.shipSetup = false;
        this.shipSelected = false;
        this.isSunk = false;
    }
}

const shipsArrPlay = [
    new Ship("destroyer", 2),
    new Ship("submarine", 3),
    new Ship("battleship", 4)
];

//Use same constructor and variables to set up array of ship objects (COMPUTER)
const shipsArrComp = [
    new Ship("destroyer", 2),
    new Ship("submarine", 3),
    new Ship("battleship", 4)
];

//b) Set up array of direction objects
const directionsArr = [
    {
        name: "right",
        numSpaces: 1,
        // availAdjacentSpaces: 0,
        // updateSpaceCount: function(arr, currentSpace) {
        //     let count = 0;
        //     let maxNumberOfSpaces = arr[currentSpace].numOfSpacesToRight;
        //     //Count spaces (including current) until you hit a taken space, or the right end of the board.
        //     while (!arr[currentSpace].isTaken && (count < maxNumberOfSpaces)) {
        //         count++;
        //         currentSpace += this.numSpaces;
        //     }
        //     this.availAdjacentSpaces = count;
        // }
    },
    {
        name: "left",
        numSpaces: -1,
        // availAdjacentSpaces: 0,
        // updateSpaceCount: function(arr, currentSpace) {
        //     let count = 0;
        //     let maxNumberOfSpaces = arr[currentSpace].numOfSpacesToLeft;
        //     //Count spaces (including current) until you hit a taken space, or the right end of the board.
        //     while (!arr[currentSpace].isTaken && (count < maxNumberOfSpaces)) {
        //         count++;
        //         currentSpace += this.numSpaces;
        //     }
        //     this.availAdjacentSpaces = count;
        // }
    },
    {
        name: "up",
        numSpaces: -5,
        // availAdjacentSpaces: 0,
        // updateSpaceCount: function(arr, currentSpace) {
        //     let count = 0;
        //     let maxNumberOfSpaces = arr[currentSpace].numOfSpacesToTop;
        //     //Count spaces (including current) until you hit a taken space, or the right end of the board.
        //     while (!arr[currentSpace].isTaken && (count < maxNumberOfSpaces)) {
        //         count++;
        //         currentSpace += this.numSpaces;
        //     }
        //     this.availAdjacentSpaces = count;
        // }
    },
    {
        name: "down",
        numSpaces: 5,
        // availAdjacentSpaces: 0,
        // updateSpaceCount: function(arr, currentSpace) {
        //     let count = 0;
        //     let maxNumberOfSpaces = arr[currentSpace].numOfSpacesToBottom;
        //     //Count spaces (including current) until you hit a taken space, or the right end of the board.
        //     while (!arr[currentSpace].isTaken && (count < maxNumberOfSpaces)) {
        //         count++;
        //         currentSpace += this.numSpaces;
        //     }
        //     this.availAdjacentSpaces = count;
        // }
    }
]

// function refreshAllSpaceCount(arr, spaceID) {
//     directionsArr.forEach(direction => direction.updateSpaceCount(arr, spaceID));
//     console.log(directionsArr);
// }


//c) Use a constructor to set up array of board space objects (PLAYER)
class Space {
    constructor(colNum, rowNum) {
        this.spaceNum = 0;
        this.domID = "";
        this.colNum = colNum;
        // this.numOfSpacesToLeft = colNum;
        // this.numOfSpacesToRight = (5 - colNum) + 1;
        this.rowNum = rowNum;
        // this.numOfSpacesToTop = rowNum;
        // this.numOfSpacesToBottom = (5 - rowNum) + 1;
        this.isTaken = false;
        this.isTakenShipName = "";
        this.isMiss = false;
        this.isHit = false;
    }
}

const playerSpaceArray = [];
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

/* REMOVE NEXT TWO LINES AFTER TESTING */
// refreshAllSpaceCount(playerSpaceArray, 5);
// console.log(directionsArr)

//Use same constructor to set up array of board space objects (COMPUTER)
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

//PLAYER SIDE SETUP
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

    if (!!(directionIndex + 1) && shipsArrPlay[shipIndex].shipSelected && !shipsArrPlay[shipIndex].shipSetup) {       
        markSpaceTakenDom(ev.target, "player-setup");
        let selectedNumber = convertDomToArrID(ev.target);
        markSpaceTakenArr(playerSpaceArray, selectedNumber);
        shipsArrPlay[shipIndex].spaceArr.push(selectedNumber);
        playerSpaceArray[selectedNumber].isTakenShipName = shipsArrPlay[shipIndex].name;

        for (let i = 2; i <= shipSize; i++) {
            selectedNumber = moveOverOneSpace(selectedNumber);
            markSpaceTakenArr(playerSpaceArray, selectedNumber);
            let shipID = `#pl-${String(selectedNumber)}`;
            markSpaceTakenDom(document.querySelector(shipID), "player-setup");
            shipsArrPlay[shipIndex].spaceArr.push(selectedNumber);
            playerSpaceArray[selectedNumber].isTakenShipName = shipsArrPlay[shipIndex].name;
        }

        shipsArrPlay[shipIndex].shipSetup = true;

        resetDefaultVariables();

    } else if (shipsArrPlay[shipIndex].shipSetup) {
        alert("You have already set up this ship, please select an available ship.");
    }
    else {
        alert("Please select a ship and a direction before selecting a starting space.");
    }
        
}

function markSpaceTakenDom(element, newClass) {
    element.classList.add(newClass);
}

function convertDomToArrID(element) {
    let selectedID = element.getAttribute("id");
    return Number(selectedID.slice(3));
}

function markSpaceTakenArr(arr, num) {
    arr[num].isTaken = true;
} 

function moveOverOneSpace(num) {
    return num + directionsArr[directionIndex].numSpaces;
}

function resetDefaultVariables() {
    shipSize = 0;
    shipIndex = -1;
    directionIndex = -1;
}

//COMPUTER GAME SETUP
//Setting up computer ships


//Add event listeners to computer gameboard
const compBoardSpaces = document.querySelectorAll(".comp-space");
compBoardSpaces.forEach(space => space.addEventListener("click", takeShot));

//MAKING MOVES
/* BELOW FOR TESTING, REMOVE AFTER FINISHED */
compSpaceArray[0].isTaken = true;
compSpaceArray[1].isTaken = true;
console.log(compSpaceArray);

//Player moves
function takeShot(ev) {
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
    }

    computerMoves();
}

//Computer moves
let potentialCompMoves = [];

for (let i = 0; i < playerSpaceArray.length; i++) {
    potentialCompMoves.push(playerSpaceArray[i].spaceNum);
}

function computerMoves() {
    let numOfGuesses = potentialCompMoves.length;
    let randomNumber = Math.floor(Math.random() * (numOfGuesses));
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