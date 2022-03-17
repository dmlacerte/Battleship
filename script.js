//GAME RULES MODAL
//Retrieve the DOM elements
let modal = document.querySelector("#game-rules-modal");
let gameRulesButton = document.querySelector("#game-rules");
let close = document.querySelector(".modal-close");

//Add functions to open and close the modal
gameRulesButton.addEventListener("click", function() {
    modal.style.display = "block";
})
close.addEventListener("click", function() {
    modal.style.display = "none";
})

//OVERALL GAME SETUP
//1. Set up board
let playerShipsSetup = false;
let gameStarted = false;
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
        new Ship("destroyer", 2, "purple-ship"),
        new Ship("submarine", 3, "green-ship"),
        new Ship("battleship", 4, "blue-ship")
    ];

    shipsArrComp = [
        new Ship("destroyer", 2, "purple-ship"),
        new Ship("submarine", 3, "green-ship"),
        new Ship("battleship", 4, "blue-ship")
    ];
}

setUpShipArrays();

//b) Set up array of direction objects to move around the board
const directionsArr = [
    {
        name: "right",
        numSpaces: 1,
        spaceRef: "numOfSpacesToRight",
        compSpaceRef: "availCompShotsRight",
        reverseDirection: "left",
        reverseDirectionIndex: 1
    },
    {
        name: "left",
        numSpaces: -1,
        spaceRef: "numOfSpacesToLeft",
        compSpaceRef: "availCompShotsLeft",
        reverseDirection: "right",
        reverseDirectionIndex: 0
    },
    {
        name: "up",
        numSpaces: -5,
        spaceRef: "numOfSpacesToTop",
        compSpaceRef: "availCompShotsTop",
        reverseDirection: "bottom",
        reverseDirectionIndex: 3
    },
    {
        name: "down",
        numSpaces: 5,
        spaceRef: "numOfSpacesToBottom",
        compSpaceRef: "availCompShotsBottom",
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
        this.availCompShotsLeft = colNum - 1;
        this.availCompShotsRight = 5 - colNum;
        this.availCompShotsTop = rowNum - 1;
        this.availCompShotsBottom = 5 - rowNum;
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
let speechBubble = document.querySelector(".speech-bubble-contents");
speechBubble.innerText = "Welcome to Battleship! Please select a player ship button on the right of the page to begin.";
//1. Set up ship positions
//a. Select ship to position
const playerShips = document.querySelectorAll(".player-ship");
playerShips.forEach(ship => ship.addEventListener("click", selectShip));

let shipSize;
let shipIndex;

function selectShip(ev) {
    ev.preventDefault();

    let selectedShip = ev.target.classList[0];
    shipIndex = shipsArrPlay.findIndex(ship => ship.name === selectedShip);

    if (!shipsArrPlay[shipIndex].shipSetup) {
        shipsArrPlay[shipIndex].shipSelected = true;
        shipSize = shipsArrPlay[shipIndex].length;
        speechBubble.innerText = `You selected the ${shipsArrPlay[shipIndex].name}! Now that you've selected a ship, select a direction for your ship to face using the arrow buttons.`;
    } else {
        speechBubble.innerText = `You've already set the position of the ${shipsArrPlay[shipIndex].name}, please select another ship.`;
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
    speechBubble.innerText = `You selected the ${shipsArrPlay[shipIndex].name} facing ${directionsArr[directionIndex].name}. 
    Now select a starting space on the bottom player board (make sure there are enough available spaces in that direction!).`;
}

//c. Add event listeners to player gameboard & set up helper functions. Allow user to set down ship. 
const playerBoardSpaces = document.querySelectorAll(".player-space");
playerBoardSpaces.forEach(space => space.addEventListener("click", selectSpace));

function selectSpace(ev) {
    ev.preventDefault();
    let validPlacement = false;

    //Validate that user has selected required inputs (ship & direction) and ship has not been set up already.
    if (!!(directionIndex + 1) && shipsArrPlay[shipIndex].shipSelected && !shipsArrPlay[shipIndex].shipSetup) {       
        //Validate that the size of the ship will fit in the direction selected. 
        let selectedNumber = convertDomToArrID(ev.target);
        let moveLengthValid = validateMoveLength(selectedNumber, playerBoardArray, directionIndex, shipSize);
        if (moveLengthValid) {
            validPlacement = true;
        }

    } else if (shipsArrPlay[shipIndex].shipSetup) {
        speechBubble.innerText = "You have already set up this ship, please select an available ship.";
    }
    else {
        speechBubble.innerText = "Please select a ship and a direction before selecting a starting space.";
    }

    //If ship in a valid placement, set the ship in that space.
    if (validPlacement) {
        setShip(ev.target, shipsArrPlay[shipIndex].backgroundColor, playerBoardArray, shipsArrPlay, shipIndex, directionIndex);
        resetDefaultVariables();
    }
}

function validateMoveLength(selectedNumber, targetArray, directionIndex, shipSize) {
    targetArray[selectedNumber].updateSurroundingSpace(targetArray);
    let availableSpace = targetArray[selectedNumber][directionsArr[directionIndex].spaceRef];
    //If selected space is available, check that there is enough surrounding space to fit the ship
    if (availableSpace >= (shipSize - 1) && targetArray[selectedNumber].isTaken === false) {
        return true;
    } else {
        if (targetArray === playerBoardArray && targetArray[selectedNumber].isTaken === false) {
            speechBubble.innerText = "The ship will not fit in the selected direction, please choose another direction or another space.";
        } else if (targetArray === playerBoardArray && targetArray[selectedNumber].isTaken === true) {
            speechBubble.innerText = "You have already selected this starting space, please select another space."
        }
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

    if (shipsArrPlay.every(ship => ship.shipSetup === true)) {
        playerShipsSetup = true;
    }
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

    if (playerShipsSetup === true && gameStarted === false) {
        speechBubble.innerText = "The computer ships have been set - click on the computer board to take your first shot.";
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
                    setShip(firstTargetDiv, "none", compBoardArray, shipsArrComp, i, randomDirectionIndex);
                }
            }
        }
        gameStarted = true;
    } else if (playerShipsSetup === false) {
        speechBubble.innerText = "Don't forget to set up your ships!";
    }
}

//Add event listeners to computer gameboard
const compBoardSpaces = document.querySelectorAll(".comp-space");
compBoardSpaces.forEach(space => space.addEventListener("click", takeShot));

//MAKING MOVES
//1. Player moves
let moveResultsMessage;
function takeShot(ev) {
    ev.preventDefault();
    moveResultsMessage = "";

    if (gameStarted) {
        let targetNum = ev.target.getAttribute("id").slice(3);

        if (compBoardArray[targetNum].isMiss === true || compBoardArray[targetNum].isHit === true) {
            speechBubble.innerText = "You have already selected this space, please select another.";
            return;
        }

        if (compBoardArray[targetNum].isTaken === false && !playerWins && !compWins) {
            ev.target.classList.add("miss");
            compBoardArray[targetNum].isMiss = true;
            moveResultsMessage = `The player misses,`
        } else if (compBoardArray[targetNum].isTaken === true && !playerWins && !compWins) {
            ev.target.classList.add("hit");
            compBoardArray[targetNum].isHit = true;
            let hitShip = compBoardArray[targetNum].isTakenShipName;
            moveResultsMessage = `The player hits the computer's ${hitShip},`
            checkIfSank(hitShip, targetNum, shipsArrComp);
        }

        if (!playerWins && !compWins) {
            computerMoves();
        }
    } 
}

//2. Computer moves
//Computer selects a random space and moves
let potentialCompMoves = [];

function resetPotentialCompMoves() {
    potentialCompMoves = playerBoardArray.filter(space => (space.isHit === false && space.isMiss === false));
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
    resetPotentialCompMoves();
    let randomIndex = Math.floor(Math.random() * potentialCompMoves.length);
    let randomGuess = potentialCompMoves[randomIndex].spaceNum;

    let domSpaceID = `#pl-${randomGuess}`
    let domSpace = document.querySelector(domSpaceID);

    if (playerBoardArray[randomGuess].isTaken === false) {
        domSpace.classList.add("miss");
        playerBoardArray[randomGuess].isMiss = true;
        moveResultsMessage += ` and the computer misses.`;
    } else if (playerBoardArray[randomGuess].isTaken === true) {
        domSpace.classList.remove("player-setup");
        domSpace.classList.add("hit");
        playerBoardArray[randomGuess].isHit = true;
        let hitShip = playerBoardArray[randomGuess].isTakenShipName;
        moveResultsMessage += ` and the computer hits the player's ${hitShip}.`;
        checkIfSank(hitShip, randomGuess, shipsArrPlay);
        //Set up variables to start moving strategically
        pursueHitShip = true;
        firstShot = randomGuess;
        moveStartingSpace = firstShot;
        firstShotShip = hitShip;
    }
    speechBubble.innerText = moveResultsMessage;
}

let pursueHitShip = false; //Set in random move
let isThisFirstMove = true;
let firstShot = 0; //Set in random move
let firstShotShip = ""; //Set in random move
let lastShot = 0; //Set in strategic move 
let lastShotWasHit = false; //Set in strategic move 
let lastShotShip = ""; //Set in strategic move
let lastDirectionIndex = 0; //Set in strategic move
let moveStartingSpace = 0; //Set in random move, updated in strategic move

function resetStrategicVariables() {
    pursueHitShip = false;
    isThisFirstMove = true;
    firstShot = 0;
    firstShotShip = "";
    lastShot = 0;
    lastShotWasHit = false;
    lastShotShip = "";
    lastDirectionIndex = 0;
    moveStartingSpace = 0;
}

function computerMovesStrategically() {
    //Make valid directions array using moveStartingSpace.
    let potentialDirectionIndexArray = [];

    function updatePotentialDirectionIndexArray(space) {
        potentialDirectionIndexArray = [];
        playerBoardArray[space].updateSurroundingSpace(playerBoardArray);
        if (playerBoardArray[space].availCompShotsRight > 0) {potentialDirectionIndexArray.push(0);}
        if (playerBoardArray[space].availCompShotsLeft > 0) {potentialDirectionIndexArray.push(1);}
        if (playerBoardArray[space].availCompShotsTop > 0) {potentialDirectionIndexArray.push(2);}
        if (playerBoardArray[space].availCompShotsBottom > 0) {potentialDirectionIndexArray.push(3);}
    }

    updatePotentialDirectionIndexArray(moveStartingSpace);

    //Execute if not first shot, set direction index dependent on moveStartingSpace
    if (!isThisFirstMove) {
        let firstShotShipIndex = shipsArrPlay.findIndex(ship => ship.name === firstShotShip);
        let numberOfHitsMade = shipsArrPlay[firstShotShipIndex].hitsArr.length;
        //If back on first space, and valid vertical / horizontal has not been determined, select randomly
        if (moveStartingSpace === firstShot && numberOfHitsMade === 1) {
            randNum = Math.floor(Math.random() * potentialDirectionIndexArray.length);
            directionIndex = potentialDirectionIndexArray[randNum];
        }
        //If back on first space, and have determined valid vertical / horizontal, go in opposite direction
        if (moveStartingSpace === firstShot && numberOfHitsMade > 1) {
            directionIndex = directionsArr[lastDirectionIndex].reverseDirectionIndex;
        }
        //If current space is not first space, continue in last direction
        if (moveStartingSpace !== firstShot) {
            directionIndex = lastDirectionIndex;
        }
    }

    //Execute if first shot, set direction index as random
    if (isThisFirstMove) {
        let randNum = Math.floor(Math.random() * potentialDirectionIndexArray.length);
        directionIndex = potentialDirectionIndexArray[randNum];
        isThisFirstMove = false;
    }

    //Once direction is set, take shot in selected direction
    lastShot = moveOverOneSpace(moveStartingSpace, directionIndex);
    lastDirectionIndex = directionIndex;
    let domSpaceID = `#pl-${lastShot}`;
    let domSpace = document.querySelector(domSpaceID);

    //Execute if shot is a miss
    if (playerBoardArray[lastShot].isTaken === false) {
        //Update DOM and Array
        domSpace.classList.add("miss");
        playerBoardArray[lastShot].isMiss = true;
        moveResultsMessage += ` and the computer misses.`;
        speechBubble.innerText = moveResultsMessage;
        //Reset starting space
        moveStartingSpace = firstShot;
        lastShotWasHit = false;
    }  
    
    //Execute if shot is a hit
    if (playerBoardArray[lastShot].isTaken === true) {
        lastShotWasHit = true;
        lastShotShip = playerBoardArray[lastShot].isTakenShipName;
        //Update DOM and Array
        domSpace.classList.remove("player-setup");
        domSpace.classList.add("hit");
        playerBoardArray[lastShot].isHit = true;
        moveResultsMessage += ` and the computer hits the player's ${lastShotShip}.`;
        speechBubble.innerText = moveResultsMessage;
        //Check if hit ship is sunk
        let shipIsSunk = checkIfSank(lastShotShip, lastShot, shipsArrPlay);
        if (!shipIsSunk) {
            //If ship not sunk, refresh valid directions array
            updatePotentialDirectionIndexArray(lastShot);
            //Check if continuing in same direction is valid (i.e., there are additional spaces in that direction, and the space hit was the same ship)
            let spacesInDirection = playerBoardArray[lastShot][directionsArr[lastDirectionIndex].compSpaceRef];
            let checkDirection = spacesInDirection > 0;
            //Use to set starting space for next turn
            if (checkDirection && (firstShotShip === lastShotShip)) {
                moveStartingSpace = lastShot;
            } else {
                moveStartingSpace = firstShot;
            }
        } else if (shipIsSunk) {
            //If ship is sunk, check if there is another unsunk ship with hits. 
            let isThereAnotherTarget = shipsArrPlay.some(ship => (ship.isSunk === false && ship.hitsArr.length > 0));
            let otherTargetIndex;
            if (isThereAnotherTarget) {
                otherTargetIndex = shipsArrPlay.findIndex(ship => (ship.isSunk === false && ship.hitsArr.length > 0));
            }
            //If there is, target that ship. If not, back to random. 
            if (!isThereAnotherTarget) {
                resetStrategicVariables();
            } else if (isThereAnotherTarget) {
                isThisFirstMove = true;
                firstShot = shipsArrPlay[otherTargetIndex].hitsArr[0];
                firstShotShip = shipsArrPlay[otherTargetIndex].name;
                moveStartingSpace = firstShot;
            }
        }
    }
}

//ENDING GAME
let playerWins = false;
let compWins = false;

function checkIfSank(hitShip, randomGuess, arr) {
    let hitIndex = arr.findIndex(ship => ship.name === hitShip);
    arr[hitIndex].hitsArr.push(randomGuess);

    let shipClass;
    if (arr === shipsArrComp) {
        shipClass = `.cp-${hitShip}`;
    } else {
        shipClass = `.pl-${hitShip}`;
    }
    document.querySelector(shipClass).innerText = "HIT";
    
    if (arr[hitIndex].hitsArr.length === arr[hitIndex].spaceArr.length) {
        arr[hitIndex].isSunk = true;
        document.querySelector(shipClass).innerText = "SANK";
        checkIfWins();
        return true;
    }
}

function checkIfWins() {
    console.log(shipsArrPlay);
    if (shipsArrPlay.every(ship => ship.isSunk === true)) {
        compWins = true;
        speechBubble.innerText = "The computer won! Click the 'Reset Game' button if you'd like to play again.";
    } else if (shipsArrComp.every(ship => ship.isSunk === true)) {
        playerWins = true;
        speechBubble.innerText = "You won! Click the 'Reset Game' button if you'd like to play again.";
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

    //Reset player and computer board arrays
    playerBoardArray = [];
    compBoardArray = [];
    setUpBoardArrays(playerBoardArray, "pl");
    setUpBoardArrays(compBoardArray, "cp");

    //Reset player and computer board HTML
    classList = ["player-setup", "purple-ship", "green-ship", "blue-ship", "hit", "miss"];
    compBoardSpaces.forEach(space => space.classList.remove(...classList));
    playerBoardSpaces.forEach(space => space.classList.remove(...classList));
    let hitStatus = document.querySelectorAll(".centered-text");
    hitStatus.forEach(ship => ship.innerText = "");
    speechBubble.innerText = "Welcome to Battleship! Please select a player ship button on the right of the page to begin.";

    //Reset variables for player ship setup process
    playerShipsSetup = false;
    gameStarted = false;
    resetDefaultVariables();

    //Reset potential computer moves 
    potentialCompMoves = [];
    resetPotentialCompMoves();
    resetStrategicVariables();
}