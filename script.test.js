import { Ship, Gameboard, Player, NPC } from "./script.js";

test("readSpacesHit correctly returns the number of spaces that have been hit", () => {
    const testShip = new Ship("s2", 2);
    expect(testShip.readSpacesHit()).toEqual(0);
});

test("hit function correctly updates spacesHit", () => {
    const testShip = new Ship("s3", 3);
    testShip.hit(0);
    expect(testShip.readSpacesHit()).toEqual(1);
});

test("isSunk returns true if all spaces are hit", () => {
    const testShip = new Ship("s4", 4);
    for (let i = 0; i < 4; i++) {
        testShip.hit(i);
    }
    expect(testShip.isSunk()).toEqual(true);
});

test("isSunk returns false if at least one space is not hit", () => {
    const testShip = new Ship("s5", 5);
    testShip.hit(2);
    expect(testShip.isSunk()).toEqual(false);
});

test("placeShip should throw an error if ship is placed outside of Gameboard", () => {
    const testShip = new Ship("s4", 4);
    const testBoard = new Gameboard();
    expect(() => testBoard.placeShip(9, 3, "horizontal", testShip)).toThrow();
});

test("placeShip should throw an error if a ship is placed on another ship", () => {
    const testShip = new Ship("s4", 4);
    const testShip2 = new Ship("s6", 6);
    const testBoard = new Gameboard();
    testBoard.placeShip(3, 4, "horizontal", testShip);
    expect(() => testBoard.placeShip(4, 2, "vertical", testShip2)).toThrow();
});

test("placeShip should succeed if ship is placed within Gameboard and not on another ship", () => {
    const testShip = new Ship("s4", 4);
    const testBoard = new Gameboard();
    expect(() =>
        testBoard.placeShip(3, 3, "horizontal", testShip)
    ).not.toThrow();
});

test("Ship.allShips should return all instances of Ship", () => {
    Ship.freeAllShips();
    const testShip = new Ship("s4", 4);
    const testShip2 = new Ship("s6", 6);
    const testShip3 = new Ship("s2", 2);
    expect(Ship.allShips).toEqual([testShip, testShip2, testShip3]);
    Ship.freeAllShips();
});

test("receiveAttack should send the attack to the hit ship", () => {
    const testShip = new Ship("s2", 2);
    const testBoard = new Gameboard();
    testBoard.placeShip(2, 3, "horizontal", testShip);
    testBoard.receiveAttack(3, 3);
    expect(testShip.readSpacesHit()).toEqual(1);
});

test("gameboard should report when all ships are sunk", () => {
    const testShip = new Ship("s2", 2);
    const testBoard = new Gameboard();
    testBoard.placeShip(2, 3, "horizontal", testShip);
    testBoard.receiveAttack(2, 3);
    testBoard.receiveAttack(3, 3);
    expect(testBoard.areAllSunk()).toEqual(true);
});

test("NPC.randomizeCoordinates() should return an ordered pair that has not already been attacked on opponent's gameboard", () => {
    const testPlayer = new Player("John");
    const playerBoard = new Gameboard();
    testPlayer.gameboard = playerBoard;
    const testNPC = new NPC("HAL");
    const NPCBoard = new Gameboard();
    testNPC.gameboard = NPCBoard;
    testPlayer.opponent = testNPC;
    testNPC.opponent = testPlayer;
    playerBoard.receiveAttack(1, 5);
    for (let i = 0; i < 20; i++) {
        expect(testNPC.randomizeCoordinates()).not.toEqual(1, 5);
    }
});
