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
//a) Use a constructor to set up arrays of player & computer ship objects
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

let shipsArrPlay = [];
let shipsArrComp = [];

function setUpShipArrays() {
    shipsArrPlay = [
        new Ship("destroyer", 2, "gray-ship"),
        new Ship("submarine", 3, "green-ship"),
        new Ship("battleship", 4, "pink-ship")
    ];

    shipsArrComp = [
        new Ship("destroyer", 2, "gray-ship"),
        new Ship("submarine", 3, "green-ship"),
        new Ship("battleship", 4, "pink-ship")
    ];
}

setUpShipArrays();

//b) Set up array of direction objects to move around the board
const directionsArr = [
    {
        name: "right",
        numSpaces: 1,
        spaceRef: "numOfSpacesToRight",
        reverseDirection: "left",
        reverseDirectionIndex: 1
    },
    {
        name: "left",
        numSpaces: -1,
        spaceRef: "numOfSpacesToLeft",
        reverseDirection: "right",
        reverseDirectionIndex: 0
    },
    {
        name: "up",
        numSpaces: -5,
        spaceRef: "numOfSpacesToTop",
        reverseDirection: "bottom",
        reverseDirectionIndex: 3
    },
    {
        name: "down",
        numSpaces: 5,
        spaceRef: "numOfSpacesToBottom",
        reverseDirection: "top",
        reverseDirectionIndex: 2
    }
]

//c) Use a constructor to set up arrays of player & computer board space objects
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
        this.availCompShotsLeft = 0;
        this.availCompShotsRight = 0;
        this.availCompShotsTop = 0;
        this.availCompShotsBottom = 0;
        this.isTaken = false;
        this.isTakenShipName = "";
        this.isMiss = false;
        this.isHit = false;
    }

    /* Function to update object with counts of valid spaces in each direction 
    (i.e., until you hit a taken space, or a side of the board). */ 
    updateSurroundingSpace(arr) {
        //RIGHT
        let countRight = 0;
        let currentSpace = this.spaceNum;

        while (countRight < 5 - this.colNum) {
            currentSpace += directionsArr[0].numSpaces;
            if (arr[currentSpace].isTaken) { break };
            countRight++;
        }
        this.numOfSpacesToRight = countRight;

        countRight = 0;
        currentSpace = this.spaceNum;

        while (countRight < 5 - this.colNum) {
            currentSpace += directionsArr[0].numSpaces;
            if (arr[currentSpace].isHit || arr[currentSpace].isMiss) { break };
            countRight++;
        }
        this.availCompShotsRight = countRight;
        
        //LEFT
        let countLeft = 0;
        currentSpace = this.spaceNum;

        while (countLeft < this.colNum - 1) {
            currentSpace += directionsArr[1].numSpaces;
            if (arr[currentSpace].isTaken) { break };
            countLeft++;
        }
        this.numOfSpacesToLeft = countLeft;

        countLeft = 0;
        currentSpace = this.spaceNum;

        while (countLeft < this.colNum - 1) {
            currentSpace += directionsArr[1].numSpaces;
            if (arr[currentSpace].isHit || arr[currentSpace].isMiss) { break };
            countLeft++;
        }
        this.availCompShotsLeft = countLeft;
        
        //TOP
        let countTop = 0;
        currentSpace = this.spaceNum;

        while (countTop < this.rowNum - 1) {
            currentSpace += directionsArr[2].numSpaces;
            if (arr[currentSpace].isTaken) { break };
            countTop++;
        }
        this.numOfSpacesToTop = countTop;

        countTop = 0;
        currentSpace = this.spaceNum;

        while (countTop < this.rowNum - 1) {
            currentSpace += directionsArr[2].numSpaces;
            if (arr[currentSpace].isHit || arr[currentSpace].isMiss) { break };
            countTop++;
        }
        this.availCompShotsTop = countTop;
                
        //BOTTOM
        let countBottom = 0;
        currentSpace = this.spaceNum;

        while (countBottom < 5 - this.rowNum) {
            currentSpace += directionsArr[3].numSpaces;
            if (arr[currentSpace].isTaken) { break };
            countBottom++;
        }
        this.numOfSpacesToBottom = countBottom;

        countBottom = 0;
        currentSpace = this.spaceNum;

        while (countBottom < 5 - this.rowNum) {
            currentSpace += directionsArr[3].numSpaces;
            if (arr[currentSpace].isHit || arr[currentSpace].isMiss) { break };
            countBottom++;
        }
        this.availCompShotsBottom = countBottom;
    }
}

let playerBoardArray = [];
let compBoardArray = [];

//Use constructor to loop through planned rows and columns to create board arrays
function setUpBoardArrays(arr, choosePlOrCp) {
    let spaceNum = 0;
    
    for (let row = 1; row <= 5; row++) {
        for (let col = 1; col <= 5; col++) {
            let newSpace = new Space(col, row);

            //Use spaceNum to add ID features for each new space object
            newSpace.spaceNum = spaceNum;
            newSpace.domID = `${choosePlOrCp}-${spaceNum}`;
            spaceNum++;

            //Push new object into player space array
            arr.push(newSpace);
        }
    }
}

setUpBoardArrays(playerBoardArray, "pl");
setUpBoardArrays(compBoardArray, "cp");

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
        let selectedNumber = convertDomToArrID(ev.target);
        let moveLengthValid = validateMoveLength(selectedNumber, playerBoardArray, directionIndex, shipSize);
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
        setShip(ev.target, shipsArrPlay[shipIndex].backgroundColor, playerBoardArray, shipsArrPlay, shipIndex, directionIndex);
        resetDefaultVariables();
    } else {
        alert("The ship will not fit in the selected direction, please choose another direction or another space.");
    }
        
}

function validateMoveLength(selectedNumber, targetArray, directionIndex, shipSize) {
    //let selectedNumber = convertDomToArrID(targetCell);
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
            let randomNumber = Math.floor(Math.random() * (compBoardArray.length));
            let randomDirectionIndex = Math.floor(Math.random() * 3);
            let firstTargetDiv = convertArrIDToDom(compBoardArray, randomNumber);
            if (!compBoardArray[randomNumber].isTaken) {
                moveLengthValid = validateMoveLength(randomNumber, compBoardArray, randomDirectionIndex, shipsArrComp[i].length);
            }

            if (moveLengthValid) {
                validPlacement = true;
            }

            if (validPlacement) {
                setShip(firstTargetDiv, shipsArrComp[i].backgroundColor, compBoardArray, shipsArrComp, i, randomDirectionIndex);
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

    if (compBoardArray[targetNum].isMiss === true || compBoardArray[targetNum].isHit === true) {
        alert("You have already selected this space, please select another.");
        return;
    }

    if (compBoardArray[targetNum].isTaken === false && !playerWins) {
        ev.target.classList.add("miss");
        compBoardArray[targetNum].isMiss = true;
    } else if (compBoardArray[targetNum].isTaken === true && !playerWins) {
        ev.target.classList.add("hit");
        compBoardArray[targetNum].isHit = true;
        let hitShip = compBoardArray[targetNum].isTakenShipName;
        checkIfSank(hitShip, targetNum, shipsArrComp);
    }

    if (!playerWins) {
        computerMoves();
    }
}

//2. Computer moves
//Computer selects a random space and moves
let potentialCompMoves = [];

function resetPotentialCompMoves() {
    for (let i = 0; i < playerBoardArray.length; i++) {
        potentialCompMoves.push(playerBoardArray[i].spaceNum);
    }
}

resetPotentialCompMoves();

function computerMoves() {
    if (pursueHitShip === false) {
        computerMovesRandomly();
    } else {
        computerMovesStrategically();
    }
}

function computerMovesRandomly() {
    let randomNumber = Math.floor(Math.random() * potentialCompMoves.length);
    let randomGuess = potentialCompMoves[randomNumber];

    potentialCompMoves.splice(randomNumber, 1);

    let domSpaceID = `#pl-${randomGuess}`
    let domSpace = document.querySelector(domSpaceID);

    if (playerBoardArray[randomGuess].isTaken === false) {
        domSpace.classList.add("miss");
        playerBoardArray[randomGuess].isMiss = true;
    } else if (playerBoardArray[randomGuess].isTaken === true) {
        domSpace.classList.remove("player-setup");
        domSpace.classList.add("hit");
        playerBoardArray[randomGuess].isHit = true;
        let hitShip = playerBoardArray[randomGuess].isTakenShipName;
        checkIfSank(hitShip, randomGuess, shipsArrPlay);
        pursueHitShip = true;
        lastHit = randomGuess;
    }
}

let lastHit;
let hitCount = 1;
let pursueHitShip = false;
let pursueHitShipDirectionIndex;
let reverseDirection = false;

function computerMovesStrategically() {
    playerBoardArray[lastHit].updateSurroundingSpace(playerBoardArray);
    let shipHit = playerBoardArray[lastHit].isTakenShipName;
    let shipHitIndex = shipsArrPlay.findIndex(ship => ship.name === shipHit);
    let directionIndex;
    let nextMove;
    
    //If first hit, choose a random valid direction to pursue ship
    if (!pursueHitShipDirectionIndex) {
        //Determine which directions are valid based on the length of the ship hit

        // function countHorizontalSpace(currentSpace) {
        //     let countRight = 0;
        //     let countToEdge = 5 - playerBoardArray[currentSpace].colNum;
        //     let moveLeft;
        //     if (!(countToEdge === 0)) {
        //         moveLeft = currentSpace + directionsArr[1].numSpaces; 
        //         if (!playerBoardArray[moveLeft].isHit && !playerBoardArray[moveLeft].isMiss) {
        //             countRight++;
        //             moveLeft = currentSpace + directionsArr[1].numSpaces;
        //         }
        //         while (countRight < countToEdge && !playerBoardArray[moveLeft].isHit && !playerBoardArray[moveLeft].isMiss) {
        //             if (moveLeft <= countToEdge) {moveLeft += directionsArr[1].numSpaces};
        //             countRight++;
        //         }
        //     }

        //     let countLeft = 0;
        //     let countToEdge = playerBoardArray[currentSpace].colNum - 1;
        //     let moveLeft;
        //     if (!(countToEdge === 0)) {
        //         moveLeft = currentSpace + directionsArr[1].numSpaces; 
        //         if (!playerBoardArray[moveLeft].isHit && !playerBoardArray[moveLeft].isMiss) {
        //             countLeft++;
        //             moveLeft = currentSpace + directionsArr[1].numSpaces;
        //         }
        //         while (countLeft < countToEdge && !playerBoardArray[moveLeft].isHit && !playerBoardArray[moveLeft].isMiss) {
        //             if (moveLeft <= countToEdge) {moveLeft += directionsArr[1].numSpaces};
        //             countLeft++;
        //         }
        //     }
        // }

        // function countVerticalSpace(currentSpace) {

        // }

        let potentialDirectionIndexArray = [];
        playerBoardArray[lastHit].updateSurroundingSpace(playerBoardArray);

        let calcHorizontalAvailability = playerBoardArray[lastHit].availCompShotsLeft + playerBoardArray[lastHit].availCompShotsRight + 1;
        let calcVerticalAvailability = playerBoardArray[lastHit].availCompShotsTop + playerBoardArray[lastHit].availCompShotsBottom + 1;

        if (calcHorizontalAvailability >= shipsArrPlay[shipHitIndex].length) {
            potentialDirectionIndexArray.push(0);
            potentialDirectionIndexArray.push(1);
        }
        if (calcVerticalAvailability >= shipsArrPlay[shipHitIndex].length) {
            potentialDirectionIndexArray.push(2);
            potentialDirectionIndexArray.push(3);
        }

        // let right = validateMoveLength(lastHit, playerBoardArray, 0, shipsArrPlay[shipHitIndex].length);
        // if (right) {potentialDirectionIndexArray.push(0)}
        // let left = validateMoveLength(lastHit, playerBoardArray, 1, shipsArrPlay[shipHitIndex].length);
        // if (left) {potentialDirectionIndexArray.push(1);}
        // let up = validateMoveLength(lastHit, playerBoardArray, 2, shipsArrPlay[shipHitIndex].length);
        // if (up) {potentialDirectionIndexArray.push(2);}
        // let down = validateMoveLength(lastHit, playerBoardArray, 3, shipsArrPlay[shipHitIndex].length);
        // if (down) {potentialDirectionIndexArray.push(3);}

        //Randomly select a valid direction and move 1 space in that direction
        directionIndex = potentialDirectionIndexArray[Math.floor(Math.random() * potentialDirectionIndexArray.length)];
        nextMove = moveOverOneSpace(lastHit, directionIndex);
    }
    //If second hit, pursue that direction (or the opposite direction)
    else if (!reverseDirection) {
        directionIndex = pursueHitShipDirectionIndex;
        nextMove = moveOverOneSpace(lastHit, directionIndex);
    } else if (reverseDirection) {
        nextMove = moveOverOneSpace(lastHit, directionIndex);
        for (let i = 0; i <= hitCount; i++) {
            nextMove = moveOverOneSpace(nextMove, directionIndex);
        }
    }

    let domSpaceID = `#pl-${nextMove}`;
    let domSpace = document.querySelector(domSpaceID);

    if (playerBoardArray[nextMove].isTaken === false) {
        domSpace.classList.add("miss");
        playerBoardArray[nextMove].isMiss = true;
        if (pursueHitShipDirectionIndex) {
            pursueHitShipDirectionIndex = shipsArrPlay[pursueHitShipDirectionIndex].reverseDirectionIndex;
            reverseDirection = true;
        }
    } else if (playerBoardArray[nextMove].isTaken === true) {
        hitCount++;
        domSpace.classList.remove("player-setup");
        domSpace.classList.add("hit");
        playerBoardArray[nextMove].isHit = true;
        let hitShip = playerBoardArray[nextMove].isTakenShipName;
        //Check if shop hit is same ship as last shot 
        if (hitShip === shipHit) {
            lastHit = nextMove;
            pursueHitShipDirectionIndex = directionIndex;
        }
        let isShipSank = checkIfSank(hitShip, nextMove, shipsArrPlay);
        if (isShipSank) {
            pursueHitShip = false;
        }
        //Reset unless there is another unsunk ship with hits
    }
}

//ENDING GAME
let playerWins = false;
let compWins = false;

function checkIfSank(hitShip, randomGuess, arr) {
    let hitIndex = arr.findIndex(ship => ship.name === hitShip);
    arr[hitIndex].hitsArr.push(randomGuess);
    
    if (arr[hitIndex].hitsArr.length === arr[hitIndex].spaceArr.length) {
        arr[hitIndex].isSunk = true;
        checkIfWins();
    }
}

function checkIfWins() {
    if (shipsArrPlay.every(ship => ship.isSunk === true)) {
        compWins = true;
        console.log("Computer wins.");
    } else if (shipsArrComp.every(ship => ship.isSunk === true)) {
        playerWins = true;
        console.log("Player wins.");
    }
}

//RESETTING GAME
const resetButton = document.querySelector("#reset-game");
resetButton.addEventListener("click", resetGame);

function resetGame(ev) {
    ev.preventDefault();

    //Reset game results
    playerWins = false;
    compWins = false;

    //Reset ships
    setUpShipArrays();

    //Reset player board arrays
    playerBoardArray = [];
    compBoardArray = [];
    setUpBoardArrays(playerBoardArray, "pl");
    setUpBoardArrays(compBoardArray, "cp");

    //Reset player board HTML
    classList = ["player-setup", "gray-ship", "green-ship", "pink-ship", "hit", "miss"];
    compBoardSpaces.forEach(space => space.classList.remove(...classList));
    playerBoardSpaces.forEach(space => space.classList.remove(...classList));

    //Reset variables for player ship setup process
    resetDefaultVariables();

    //Reset potential computer moves 
    potentialCompMoves = [];
    resetPotentialCompMoves();
}