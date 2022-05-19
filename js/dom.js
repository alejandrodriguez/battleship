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
        const formWrapper = document.querySelector(".form-wrapper");
        const form = document.createElement("form");
        form.classList.add("form-flex");
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
    static getShipPlacement(ship) {
        const formWrapper = document.querySelector(".form-wrapper");
        const form = document.createElement("form");
        // form.classList.add("place-ship-form");
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
        container.classList.add("form-flex");
        const xInput = document.createElement("input");
        const yInput = document.createElement("input");
        xInput.classList.add("coordinate-form", "x-input");
        yInput.classList.add("coordinate-form", "y-input");
        xInput.placeholder = "X";
        yInput.placeholder = "Y";
        xInput.maxLength = 1;
        yInput.maxLength = 2;
        xInput.required = true;
        yInput.required = true;
        xInput.addEventListener("keydown", e =>
            DOMController.preventIncorrectChars(e)
        );
        yInput.addEventListener("keydown", e =>
            DOMController.preventIncorrectChars(e)
        );
        yInput.addEventListener("keyup", e =>
            DOMController.preventIncorrectChars(e)
        );
        const orientation = document.createElement("button");
        orientation.type = "button";
        orientation.classList.add("orientation-button");
        orientation.value = "down";
        orientation.innerHTML = "&darr;";
        orientation.addEventListener("click", DOMController.changeOrientation);
        container.append(shipData, xInput, yInput, orientation);
        const placeBtn = document.createElement("button");
        placeBtn.type = "submit";
        placeBtn.textContent = "Place";
        placeBtn.addEventListener("click", e =>
            DOMController.submitShipPlacement(e)
        );
        form.append(instructions, container, length, placeBtn);
        while (formWrapper.lastChild) {
            formWrapper.removeChild(formWrapper.lastChild);
        }
        formWrapper.append(form);
        // const xValidation = /^[A-Ja-j]$/;
        // const yValidation = /^([1-9]|10)$/;
        // TODO starting point description
    }
    static submitShipPlacement(e) {
        e.preventDefault();
        if (
            document.querySelector(".x-input").value === "" ||
            document.querySelector(".y-input").value === ""
        ) {
            return;
        }
        // Convert alphabetic character to valid coordinate
        const x =
            document
                .querySelector(".x-input")
                .value.toLowerCase()
                .charCodeAt(0) - 97;
        const y = parseInt(document.querySelector(".y-input").value) - 1;
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
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Invalid coordinates";
            errorMessage.classList.add("error");
            document.body.append(errorMessage);
            setTimeout(() => errorMessage.remove(), 3000);
        }
    }
    static getAttack() {
        const formWrapper = document.querySelector(".form-wrapper");
        const form = document.createElement("form");
        const instructions = document.createElement("h2");
        instructions.classList.add("instructions");
        instructions.textContent = "Attack your enemy!";
        const container = document.createElement("div");
        container.classList.add("form-flex");
        const xInput = document.createElement("input");
        const yInput = document.createElement("input");
        xInput.classList.add("coordinate-form", "x-input");
        yInput.classList.add("coordinate-form", "y-input");
        xInput.placeholder = "X";
        yInput.placeholder = "Y";
        xInput.maxLength = 1;
        yInput.maxLength = 2;
        xInput.required = true;
        yInput.required = true;
        xInput.addEventListener("keydown", e =>
            DOMController.preventIncorrectChars(e)
        );
        yInput.addEventListener("keydown", e =>
            DOMController.preventIncorrectChars(e)
        );
        yInput.addEventListener("keyup", e =>
            DOMController.preventIncorrectChars(e)
        );
        container.append(xInput, yInput);
        const attackBtn = document.createElement("button");
        attackBtn.classList.add("attack-btn");
        attackBtn.type = "submit";
        attackBtn.textContent = "Fire!";
        attackBtn.addEventListener("click", e => DOMController.submitAttack(e));
        form.append(instructions, container, attackBtn);
        while (formWrapper.lastChild) {
            formWrapper.removeChild(formWrapper.lastChild);
        }
        formWrapper.append(form);
    }
    static submitAttack(e) {
        e.preventDefault();
        if (
            document.querySelector(".x-input").value === "" ||
            document.querySelector(".y-input").value === ""
        ) {
            return;
        }
        // Convert alphabetic character to valid coordinate
        const x =
            document
                .querySelector(".x-input")
                .value.toLowerCase()
                .charCodeAt(0) - 97;
        const y = parseInt(document.querySelector(".y-input").value) - 1;
        const hitOrMiss = player.opponent.gameboard.receiveAttack(x, y);
        switch (hitOrMiss) {
            case false:
                const errorMessage = document.createElement("div");
                errorMessage.textContent = "You have already hit that space!";
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
                    }
                } else {
                    DOMController.updateGameboardUI("Hit!", "computer");
                }
                DOMController.attackPlayer();
                break;
            case "miss":
                DOMController.updateGameboardUI("Miss!", "computer");
                DOMController.attackPlayer();
                break;
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
            setTimeout(() => popUp.remove(), 3000);
        }
    }
    static attackPlayer() {
        const xInput = document.querySelector(".x-input");
        const yInput = document.querySelector(".y-input");
        const attackBtn = document.querySelector(".attack-btn");
        xInput.disabled = true;
        yInput.disabled = true;
        attackBtn.disabled = true;
        const { x, y } = computer.automateAttack();
        const hitOrMiss = computer.opponent.gameboard.receiveAttack(x, y);
        const instructions = document.querySelector(".instructions");
        instructions.textContent = `${computer.name} is thinking...`;
        const randomTime = Math.floor(Math.random() * 4000 + 1000);
        setTimeout(() => {
            instructions.textContent = "Attack your enemy!";
            switch (hitOrMiss) {
                case "hit":
                    const hitShip = computer.opponent.gameboard
                        .readGrid()
                        [x][y].shipName.split(" ")[0];
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
                    break;
            }
            xInput.disabled = false;
            yInput.disabled = false;
            attackBtn.disabled = false;
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
