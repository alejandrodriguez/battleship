import { Ship, Gameboard, Player, NPC } from "./game.js";

test("readSpacesHit correctly returns the number of spaces that have been hit", () => {
    const testShip = new Ship("s2", 2);
    expect(testShip.readSpacesHit()).toBe(0);
});

test("hit function correctly updates spacesHit", () => {
    const testShip = new Ship("s3", 3);
    testShip.hit(0);
    expect(testShip.readSpacesHit()).toBe(1);
});

test("isSunk returns true if all spaces are hit", () => {
    const testShip = new Ship("s4", 4);
    for (let i = 0; i < 4; i++) {
        testShip.hit(i);
    }
    expect(testShip.isSunk()).toBe(true);
});

test("isSunk returns false if at least one space is not hit", () => {
    const testShip = new Ship("s5", 5);
    testShip.hit(2);
    expect(testShip.isSunk()).toBe(false);
});

test("placeShip should return false if ship is placed outside of Gameboard", () => {
    const testShip = new Ship("s4", 4);
    const testBoard = new Gameboard();
    expect(testBoard.placeShip(9, 3, "down", testShip)).toBe(false);
});

test("placeShip should return false if a ship is placed on another ship", () => {
    const testShip = new Ship("s4", 4);
    const testShip2 = new Ship("s6", 6);
    const testBoard = new Gameboard();
    testBoard.placeShip(3, 4, "down", testShip);
    expect(testBoard.placeShip(4, 2, "down", testShip2)).toBe(false);
});

test("placeShip should return true if ship is placed within Gameboard and not on another ship", () => {
    const testShip = new Ship("s4", 4);
    const testBoard = new Gameboard();
    expect(testBoard.placeShip(3, 3, "down", testShip)).toBe(true);
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
    testBoard.placeShip(2, 3, "down", testShip);
    testBoard.receiveAttack(3, 3);
    expect(testShip.readSpacesHit()).toBe(1);
});

test("gameboard should report when all ships are sunk", () => {
    const testShip = new Ship("s2", 2);
    const testBoard = new Gameboard();
    testBoard.placeShip(2, 3, "down", testShip);
    testBoard.receiveAttack(2, 3);
    testBoard.receiveAttack(3, 3);
    expect(testBoard.areAllSunk()).toBe(true);
});

test("NPC.automateAttack() should return an ordered pair that has not already been attacked on opponent's gameboard", () => {
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
        expect(testNPC.automateAttack()).not.toBe(1, 5);
    }
});

test("automate ship placement should successfully place all ships randomly", () => {
    const testPlayer = new Player("John");
    const playerBoard = new Gameboard();
    testPlayer.gameboard = playerBoard;
    const testNPC = new NPC("HAL");
    const NPCBoard = new Gameboard();
    testNPC.gameboard = NPCBoard;
    testPlayer.opponent = testNPC;
    testNPC.opponent = testPlayer;
    expect(
        testNPC.automateShipPlacement(Ship.createShipSet(testNPC.name))
    ).toBe(true);
    console.log(testNPC.gameboard.readGrid());
});
