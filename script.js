class Ship {
    #spacesHit = 0;
    constructor(name, length) {
        this.name = name; // TODO come up with unique auto naming
        this.length = length;
        Ship.allShips.push(this);
    }
    readSpacesHit() {
        return this.#spacesHit;
    }
    hit() {
        this.#spacesHit++;
    }
    isSunk() {
        if (this.#spacesHit < this.length) {
            return false;
        }
        return true;
    }
    static allShips = [];
    static freeAllShips() {
        this.allShips = [];
    }
}

class Gameboard {
    // Initialize an x-axis of size 10
    #grid = [[], [], [], [], [], [], [], [], [], []];
    constructor() {
        // Initialize a y-axis of size 10
        this.#grid.forEach((element, index) => {
            for (let i = 0; i < 10; i++) {
                // Track whether space is hit and if it holds a ship, initialized to false
                this.#grid[index].push({ isHit: false, shipName: null });
            }
        });
        this.shipsOnGameboard = [];
    }
    receiveAttack(x, y) {
        const attackedSpace = this.#grid[x][y];
        if (attackedSpace.isHit) {
            return;
        }
        attackedSpace.isHit = true;
        if (attackedSpace.shipName !== null) {
            for (let ship of Ship.allShips) {
                if (ship.name === attackedSpace.shipName) {
                    ship.hit();
                    if (ship.isSunk()) {
                        this.areAllSunk();
                    }
                }
            }
        } else {
            // it's a miss
        }
    }
    createShips() {
        // TODO
    }
    placeShip(x, y, orientation, Ship) {
        /* x and y arguments should be starting points,
        i.e the left-most x coordinate and the top-most y coordinate */
        switch (orientation) {
            case "horizontal":
                if (x + Ship.length > 9) {
                    throw new Error("Ship falls outside the gameboard");
                }
                for (let i = 0; i < Ship.length; i++) {
                    if (this.#grid[x + i][y].shipName !== null) {
                        throw new Error("Cannot place ship on another ship");
                    }
                    this.#grid[x + i][y].shipName = Ship.name;
                }
                break;
            case "vertical":
                if (y + Ship.length > 9) {
                    throw new Error("Ship falls outside the gameboard");
                }
                for (let i = 0; i < Ship.length; i++) {
                    if (this.#grid[x][y + i].shipName !== null) {
                        throw new Error("Cannot place ship on another ship");
                    }
                    this.#grid[x][y + i].shipName = Ship.name;
                }
                break;
        }
        this.shipsOnGameboard.push(Ship);
    }
    areAllSunk() {
        if (this.shipsOnGameboard === []) {
            return;
        }
        for (let ship of this.shipsOnGameboard) {
            if (!ship.isSunk()) {
                return false;
            }
        }
        return true;
    }
    readGrid() {
        return this.#grid;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this._opponent = null;
        this._gameboard = null;
    }
    set opponent(player) {
        if (player instanceof Player || player === null) {
            this._opponent = player;
        } else {
            throw new Error("Opponent must be an instance of Player");
        }
    }
    get opponent() {
        return this._opponent;
    }
    set gameboard(gameboard) {
        if (gameboard instanceof Gameboard || gameboard === null) {
            this._gameboard = gameboard;
        } else {
            throw new Error("Gameboard must be an instance of Gameboard");
        }
    }
    get gameboard() {
        return this._gameboard;
    }
}

class NPC extends Player {
    constructor(name) {
        super(name);
    }
    randomizeCoordinates() {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        // Choose new ordered pair if current one is already hit
        while (this.opponent.gameboard.readGrid()[x][y].isHit) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        }
        return { x, y };
    }
}

export { Ship, Gameboard, Player, NPC };
