import { Ship, Gameboard, NPC, Player } from "./game.js";

let computer;
let player;
let computerGameboard;
let playerGameboard;
let computerShipSet;
let playerShipSet;

class DOMController {
    static initializeSpaces() {
        const computerGameboardUI = document.querySelector("#computer-gb");
        const playerGameboardUI = document.querySelector("#player-gb");
        for (let i = 0; i < 100; i++) {
            const space = document.createElement("div");
            space.classList.add("gb-space", "computer-space");
            space.dataset.x = i % 10;
            space.dataset.y = 9 - Math.floor(i / 10);
            computerGameboardUI.append(space);
        }
        for (let i = 0; i < 100; i++) {
            const space = document.createElement("div");
            space.classList.add("gb-space", "player-space");
            space.dataset.x = i % 10;
            space.dataset.y = 9 - Math.floor(i / 10);
            playerGameboardUI.append(space);
        }
    }
    static getName() {
        const music = new Audio("audio/battle-music.mp3");
        music.play();
        music.loop = true;
        const formWrapper = document.querySelector(".form-wrapper");
        const form = document.createElement("form");
        const nameInput = document.createElement("input");
        nameInput.classList.add("name-input");
        nameInput.placeholder = "What's your name?";
        nameInput.required = true;
        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit";
        submitBtn.addEventListener("click", e =>
            DOMController.initializeGame(e)
        );
        form.append(nameInput, submitBtn);
        newGameBtn.remove();
        formWrapper.append(form);
    }
    static initializeGame(e) {
        e.preventDefault();
        computer = new NPC();
        player = new Player(document.querySelector("input").value);
        computerGameboard = new Gameboard();
        playerGameboard = new Gameboard();
        computer.opponent = player;
        player.opponent = computer;
        computer.gameboard = computerGameboard;
        player.gameboard = playerGameboard;
        computerShipSet = Ship.createShipSet(computer.name);
        playerShipSet = Ship.createShipSet(player.name);
        computer.automateShipPlacement(computerShipSet);
        document.querySelector("#player-name").textContent = player.name
            ? player.name
            : "Player";
        document.querySelector("#computer-name").textContent = computer.name
            ? computer.name
            : "CPU";
        DOMController.getShipPlacement(playerShipSet["carrier"]);
    }
    static showShipPreview(e) {
        const ship = document.querySelector("#ship-data").value;
        const orientation = document.querySelector(".orientation-button").value;
        console.log({ ship, orientation });
        if (!ship || !orientation) {
            return;
        }
        const playerSpaces = document.querySelectorAll(".player-space");
        playerSpaces.forEach(space => {
            space.classList.remove("preview-space-valid");
            space.classList.remove("preview-space-invalid");
        });
        const x = parseInt(e.target.dataset.x, 10);
        const y = parseInt(e.target.dataset.y, 10);
        let valid = true;
        switch (orientation) {
            case "down":
                for (let i = y; i > y - playerShipSet[ship].length; i--) {
                    if (
                        !document.querySelector(
                            `.player-space[data-x="${x}"][data-y="${i}"]`
                        ) ||
                        document
                            .querySelector(
                                `.player-space[data-x="${x}"][data-y="${i}"]`
                            )
                            .classList.contains("occupied-space")
                    ) {
                        valid = false;
                    }
                }
                if (valid) {
                    for (let i = y; i > y - playerShipSet[ship].length; i--) {
                        document
                            .querySelector(
                                `.player-space[data-x="${x}"][data-y="${i}"]`
                            )
                            .classList.add("preview-space-valid");
                    }
                } else {
                    for (let i = y; i > y - playerShipSet[ship].length; i--) {
                        if (
                            document.querySelector(
                                `.player-space[data-x="${x}"][data-y="${i}"]`
                            )
                        ) {
                            document
                                .querySelector(
                                    `.player-space[data-x="${x}"][data-y="${i}"]`
                                )
                                .classList.add("preview-space-invalid");
                        }
                    }
                }
                break;
            case "right":
                for (let i = x; i < x + playerShipSet[ship].length; i++) {
                    if (
                        !document.querySelector(
                            `.player-space[data-x="${i}"][data-y="${y}"]`
                        ) ||
                        document
                            .querySelector(
                                `.player-space[data-x="${i}"][data-y="${y}"]`
                            )
                            .classList.contains("occupied-space")
                    ) {
                        valid = false;
                    }
                }
                if (valid) {
                    for (let i = x; i < x + playerShipSet[ship].length; i++) {
                        document
                            .querySelector(
                                `.player-space[data-x="${i}"][data-y="${y}"]`
                            )
                            .classList.add("preview-space-valid");
                    }
                } else {
                    for (let i = x; i < x + playerShipSet[ship].length; i++) {
                        if (
                            document.querySelector(
                                `.player-space[data-x="${i}"][data-y="${y}"]`
                            )
                        ) {
                            document
                                .querySelector(
                                    `.player-space[data-x="${i}"][data-y="${y}"]`
                                )
                                .classList.add("preview-space-invalid");
                        }
                    }
                }
        }
    }
    static getShipPlacement(ship) {
        DOMController.makeSpacesSelectable("player");
        const formWrapper = document.querySelector(".form-wrapper");
        const form = document.createElement("form");
        form.classList.add("place-ship-form");
        const shipData = document.createElement("input");
        shipData.id = "ship-data";
        shipData.type = "hidden";
        shipData.value = `${ship.name.split(" ")[0]}`;
        const instructions = document.createElement("h2");
        instructions.classList.add("instructions");
        instructions.textContent = `Place your ${ship.name.split(" ")[0]}!`;
        const length = document.createElement("p");
        length.classList.add("length");
        length.textContent = `Length: ${ship.length}`;
        const container = document.createElement("div");
        let orientation;
        const prevOrientation = document.querySelector(".orientation-button");
        if (prevOrientation) {
            orientation = prevOrientation.cloneNode(true);
        } else {
            orientation = document.createElement("button");
            orientation.type = "button";
            orientation.classList.add("orientation-button");
            orientation.value = "down";
            orientation.innerHTML = "&darr;";
        }
        orientation.addEventListener("click", DOMController.changeOrientation);
        container.append(shipData, orientation);
        form.append(instructions, container, length);
        while (formWrapper.lastChild) {
            formWrapper.removeChild(formWrapper.lastChild);
        }
        formWrapper.append(form);
    }
    static submitShipPlacement(e) {
        e.preventDefault();
        DOMController.makeSpacesSelectable("none");
        const x = parseInt(e.target.dataset.x, 10);
        const y = parseInt(e.target.dataset.y, 10);
        const orientation = document.querySelector(".orientation-button").value;
        const ship = playerShipSet[document.querySelector("#ship-data").value];
        if (player.gameboard.placeShip(x, y, orientation, ship)) {
            DOMController.updateGameboardUI();
            switch (ship.name.split(" ")[0]) {
                case "carrier":
                    DOMController.getShipPlacement(playerShipSet["battleship"]);
                    break;
                case "battleship":
                    DOMController.getShipPlacement(playerShipSet["cruiser"]);
                    break;
                case "cruiser":
                    DOMController.getShipPlacement(playerShipSet["submarine"]);
                    break;
                case "submarine":
                    DOMController.getShipPlacement(playerShipSet["destroyer"]);
                    break;
                case "destroyer":
                    DOMController.getAttack();
                    break;
            }
        } else {
            DOMController.makeSpacesSelectable("player");
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Invalid coordinates";
            errorMessage.classList.add("error");
            document.body.append(errorMessage);
            setTimeout(() => errorMessage.remove(), 1000);
        }
    }
    static getAttack() {
        DOMController.makeSpacesSelectable("computer");

        const formWrapper = document.querySelector(".form-wrapper");
        const instructions = document.createElement("h2");
        instructions.classList.add("instructions");
        instructions.textContent = "Attack your enemy!";
        while (formWrapper.lastChild) {
            formWrapper.removeChild(formWrapper.lastChild);
        }
        formWrapper.append(instructions);
    }
    static submitAttack(e) {
        e.preventDefault();
        DOMController.makeSpacesSelectable("none");
        const x = parseInt(e.target.dataset.x, 10);
        const y = parseInt(e.target.dataset.y, 10);
        const hitOrMiss = player.opponent.gameboard.receiveAttack(x, y);
        switch (hitOrMiss) {
            case false:
                const errorMessage = document.createElement("div");
                errorMessage.textContent =
                    "You have already attacked that space!";
                errorMessage.classList.add("error");
                document.body.append(errorMessage);
                setTimeout(() => errorMessage.remove(), 3000);
                break;
            case "hit":
                const hitShip = player.opponent.gameboard
                    .readGrid()
                    [x][y].shipName.split(" ")[0];
                if (computerShipSet[hitShip].isSunk()) {
                    DOMController.updateGameboardUI(
                        `You sunk their ${hitShip}!`,
                        "computer"
                    );
                    if (computer.gameboard.areAllSunk()) {
                        DOMController.endGame("player");
                    } else {
                        DOMController.attackPlayer();
                    }
                } else {
                    DOMController.updateGameboardUI("Hit!", "computer");
                    DOMController.attackPlayer();
                }
                break;
            case "miss":
                DOMController.updateGameboardUI("Miss!", "computer");
                DOMController.attackPlayer();
                break;
        }
    }
    static makeSpacesSelectable(gameboard) {
        switch (gameboard) {
            case "player":
                const playerSpaces = document.querySelectorAll(".player-space");
                playerSpaces.forEach(playerSpace => {
                    playerSpace.classList.add("selectable-space");
                    playerSpace.addEventListener("click", e =>
                        DOMController.submitShipPlacement(e)
                    );
                    playerSpace.addEventListener("mouseover", e =>
                        DOMController.showShipPreview(e)
                    );
                });
                break;
            case "computer":
                const computerSpaces =
                    document.querySelectorAll(".computer-space");
                computerSpaces.forEach(computerSpace => {
                    computerSpace.classList.add("selectable-space");
                    computerSpace.addEventListener("click", e =>
                        DOMController.submitAttack(e)
                    );
                });
                break;
            case "none":
                const spaces = document.querySelectorAll(".gb-space");
                spaces.forEach(space => {
                    const clonedSpace = space.cloneNode(true);
                    clonedSpace.classList.remove("selectable-space");
                    clonedSpace.classList.remove("preview-space-valid");
                    clonedSpace.classList.remove("preview-space-invalid");
                    space.parentElement.insertBefore(clonedSpace, space);
                    space.remove();
                });
        }
    }
    static updateGameboardUI(notification = null, displayGB = null) {
        const computerGrid = computer.gameboard.readGrid();
        computerGrid.forEach((column, x) => {
            column.forEach((space, y) => {
                if (space.isHit) {
                    const spaceUI = document.querySelector(
                        `.computer-space[data-x="${x}"][data-y="${y}"]`
                    );
                    if (space.shipName !== null) {
                        spaceUI.classList.add("hit");
                    } else {
                        spaceUI.classList.add("miss");
                    }
                }
            });
        });
        const playerGrid = player.gameboard.readGrid();
        playerGrid.forEach((column, x) => {
            column.forEach((space, y) => {
                if (space.isHit) {
                    const spaceUI = document.querySelector(
                        `.player-space[data-x="${x}"][data-y="${y}"]`
                    );
                    if (space.shipName !== null) {
                        spaceUI.classList.add("hit");
                    } else {
                        spaceUI.classList.add("miss");
                    }
                } else if (space.shipName !== null) {
                    const spaceUI = document.querySelector(
                        `.player-space[data-x="${x}"][data-y="${y}"]`
                    );
                    spaceUI.classList.add("occupied-space");
                }
            });
        });
        if (notification !== null) {
            const popUp = document.createElement("div");
            popUp.classList.add("pop-up");
            const popUpText = document.createElement("p");
            popUpText.textContent = notification;
            const displayGBDiv = document.querySelector(`#${displayGB}-gb`);
            popUp.append(popUpText);
            displayGBDiv.append(popUp);
            setTimeout(() => {
                if (displayGB === "player") {
                    DOMController.makeSpacesSelectable("computer");
                    const instructions =
                        document.querySelector(".instructions");
                    instructions.textContent = "Attack your enemy!";
                }
                popUp.remove();
            }, 1000);
        }
    }
    static attackPlayer() {
        const { x, y } = computer.automateAttack();
        const hitOrMiss = computer.opponent.gameboard.receiveAttack(x, y);
        const instructions = document.querySelector(".instructions");
        instructions.textContent = `${computer.name} is thinking...`;
        const randomTime = Math.floor(Math.random() * 2000 + 1000);
        setTimeout(() => {
            switch (hitOrMiss) {
                case "hit":
                    const hitShip = computer.opponent.gameboard
                        .readGrid()
                        [x][y].shipName.split(" ")[0];
                    instructions.textContent = `${computer.name} hit!`;
                    if (playerShipSet[hitShip].isSunk()) {
                        DOMController.updateGameboardUI(
                            `They sunk your ${hitShip}!`,
                            "player"
                        );
                        if (player.gameboard.areAllSunk()) {
                            DOMController.endGame("computer");
                        }
                    } else {
                        DOMController.updateGameboardUI("Hit!", "player");
                    }
                    break;
                case "miss":
                    DOMController.updateGameboardUI("Miss!", "player");
                    instructions.textContent = `${computer.name} missed!`;
                    break;
            }
        }, randomTime);
    }
    static changeOrientation() {
        const oBtn = document.querySelector(".orientation-button");
        if (oBtn.value === "down") {
            oBtn.value = "right";
            oBtn.innerHTML = "&rarr;";
        } else if (oBtn.value === "right") {
            oBtn.value = "down";
            oBtn.innerHTML = "&darr;";
        }
    }
    static preventIncorrectChars(e) {
        // If function is called by keyup, validate that 2nd char in input is always to make value equal to "10"
        if (e.type === "keyup" && e.target.value.length > 1) {
            if (e.target.value.length > 2) {
                e.target.value = "10";
            } else if (e.target.value !== "10") {
                e.target.value = e.target.value[0];
            }
        }
        // If key is not alphanumeric, allow it
        else if (e.key.length !== 1) {
            return;
        }
        // If key is 0 and it is the first number input prevent default
        else if (e.key === "0" && e.target.value.length === 0) {
            e.preventDefault();
        }
        // If validating x-input, check to make sure it is equal to a-j
        else if (e.target.classList.contains("x-input")) {
            const letterRegEx = /[A-Ja-j]/;
            if (!letterRegEx.test(e.key)) {
                e.preventDefault();
            }
        }
        // If validating y-input, check to make sure character is numeric
        else if (e.target.classList.contains("y-input")) {
            const numberRegEx = /[0-9]/;
            if (!numberRegEx.test(e.key)) {
                e.preventDefault();
            }
        }
    }
    static endGame(winner) {
        document.querySelector(".form-wrapper").remove();
        const winMessage = document.createElement("h1");
        switch (winner) {
            case "player":
                if (player.name) {
                    winMessage.textContent = `${player.name} wins!`;
                } else {
                    winMessage.textContent = "You win!";
                }
                break;
            case "computer":
                winMessage.textContent = `${computer.name} wins :(`;
                break;
        }
        document.body.append(winMessage);
    }
}

document.addEventListener("DOMContentLoaded", DOMController.initializeSpaces);
const newGameBtn = document.querySelector("#new-game-btn");
newGameBtn.addEventListener("click", DOMController.getName);

export { DOMController, computer, player, computerGameboard, playerGameboard };
