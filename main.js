import { Ship, Gameboard, Player, NPC } from "./script.js";

const newGameBtn = document.querySelector("#new-game-btn");

class DOMController {
    static initializeSpaces() {
        const NPCGameboard = document.querySelector("#npc-gb");
        const playerGameboard = document.querySelector("#player-gb");
        for (let i = 0; i < 100; i++) {
            const space = document.createElement("div");
            space.classList.add("gb-space");
            space.dataset.x = 9 - Math.floor(i / 10);
            space.dataset.y = i % 10;
            NPCGameboard.append(space);
        }
        for (let i = 0; i < 100; i++) {
            const space = document.createElement("div");
            space.classList.add("gb-space");
            space.dataset.x = i % 10;
            space.dataset.y = 10 - Math.floor((i + 1) / 10);
            playerGameboard.append(space);
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
    static placeCarrier() {
        const newGameContainer = document.querySelector("#new-game-container");
        const form = document.createElement("form");
        form.classList.add("place-ship-form");
        const instructions = document.createElement("h2");
        instructions.classList.add("instructions");
        instructions.textContent = "Place your carrier!";
        const length = document.createElement("p");
        length.classList.add("length");
        length.textContent = "Length: 5";
        const xInput = document.createElement("input");
        const yInput = document.createElement("input");
        xInput.classList.add("coordinate-form", "x-input");
        yInput.classList.add("coordinate-form", "y-input");
        xInput.placeholder = "X";
        yInput.placeholder = "Y";
        xInput.maxLength = 1;
        yInput.maxLength = 2;
        xInput.addEventListener("keydown", e =>
            DOMController.preventIncorrectChars(e)
        );
        yInput.addEventListener("keydown", e =>
            DOMController.preventIncorrectChars(e)
        );
        const placeBtn = document.createElement("button");
        placeBtn.type = "submit";
        placeBtn.textContent = "Place";
        placeBtn.addEventListener("click", e =>
            DOMController.submitShipPlacement(e)
        );
        newGameBtn.remove();
        form.append(instructions, xInput, yInput, length, placeBtn);
        newGameContainer.append(form);
        // const xValidation = /^[A-Ja-j]$/;
        // const yValidation = /^([1-9]|10)$/;
    }
    static placeBattleship() {
        // TODO
    }
    static placeCruiser() {
        // TODO
    }
    static placeSubmarine() {
        // TODO
    }
    static placeDestroyer() {
        // TODO
    }
    static submitShipPlacement(e) {
        e.preventDefault();
    }
}

document.addEventListener("DOMContentLoaded", DOMController.initializeSpaces);
newGameBtn.addEventListener("click", DOMController.placeCarrier);
