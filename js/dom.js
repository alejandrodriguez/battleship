import { Ship, Gameboard, NPC, Player } from "./game.js";

let computer;
let player;
let computerGameboard;
let playerGameboard;
let computershipSet;
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
        computershipSet = Ship.createShipSet(computer.name);
        playerShipSet = Ship.createShipSet(player.name);
        DOMController.getShipPlacement(playerShipSet["carrier"]);
    }
    static getShipPlacement(ship) {
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
        let x =
            document
                .querySelector(".x-input")
                .value.toLowerCase()
                .charCodeAt(0) - 97;
        const y = parseInt(document.querySelector(".y-input").value) - 1;
        const orientation = document.querySelector(".orientation-button").value;
        const ship = playerShipSet[document.querySelector("#ship-data").value];
        if (player.gameboard.placeShip(x, y, orientation, ship)) {
            DOMController.updateGameboardUI();
            console.log(ship);
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
    static getAttack() {}
    static submitAttack() {}
    static updateGameboardUI() {
        const computerGrid = computer.gameboard.readGrid();
        computerGrid.forEach((row, x) => {
            row.forEach((space, y) => {
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
        playerGrid.forEach((row, x) => {
            row.forEach((space, y) => {
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
        if (e.which === 8) {
            return;
        }
        if (e.target.classList.contains("x-input")) {
            if (e.which < 65 || e.which > 74) {
                e.preventDefault();
            }
        } else if (e.target.classList.contains("y-input")) {
            if (
                (e.target.value.length > 0 && e.which !== 48) ||
                (e.target.value.length > 0 && parseInt(e.target.value) !== 1)
            ) {
                e.preventDefault();
            } else if (e.which < 48 || e.which > 57) {
                e.preventDefault();
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", DOMController.initializeSpaces);
const newGameBtn = document.querySelector("#new-game-btn");
newGameBtn.addEventListener("click", DOMController.getName);

export { DOMController, computer, player, computerGameboard, playerGameboard };
