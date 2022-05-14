import { Ship, Gameboard, Player, NPC } from "./script.js";

// Create individual spaces on each gameboard
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
