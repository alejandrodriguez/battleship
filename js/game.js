class Ship {
    #spacesHit = 0;
    constructor(name, length) {
        this.name = name;
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
    static createShipSet(playerName) {
        const carrier = new Ship(`carrier ${playerName}`, 5);
        const battleship = new Ship(`battleship ${playerName}`, 4);
        const cruiser = new Ship(`cruiser ${playerName}`, 3);
        const submarine = new Ship(`submarine ${playerName}`, 3);
        const destroyer = new Ship(`destroyer ${playerName}`, 2);
        return { carrier, battleship, cruiser, submarine, destroyer };
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
            return false;
        }
        attackedSpace.isHit = true;
        if (attackedSpace.shipName !== null) {
            for (let ship of Ship.allShips) {
                if (ship.name === attackedSpace.shipName) {
                    ship.hit();
                    return "hit";
                }
            }
        } else {
            return "miss";
        }
    }
    placeShip(x, y, orientation, ship) {
        /* x and y arguments should be starting points,
        i.e the left-most x coordinate and the top-most y coordinate */
        switch (orientation) {
            case "right":
                if (x + ship.length - 1 > 9) {
                    return false;
                }
                for (let i = 0; i < ship.length; i++) {
                    if (this.#grid[x + i][y].shipName !== null) {
                        return false;
                    }
                }
                for (let i = 0; i < ship.length; i++) {
                    this.#grid[x + i][y].shipName = ship.name;
                }
                break;
            case "down":
                if (y + 1 - ship.length < 0) {
                    return false;
                }
                for (let i = 0; i < ship.length; i++) {
                    if (this.#grid[x][y - i].shipName !== null) {
                        return false;
                    }
                }
                for (let i = 0; i < ship.length; i++) {
                    this.#grid[x][y - i].shipName = ship.name;
                }
                break;
        }
        this.shipsOnGameboard.push(ship);
        return true;
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
    constructor() {
        const NPCNames = [
            "H.A.L.",
            "JARVIS",
            "R2-D2",
            "Optimus Prime",
            "The Terminator",
            "WALL-E",
            "Bender",
            "Cortana",
            "GLaDOS"
        ];
        const name = NPCNames[Math.floor(Math.random() * NPCNames.length)];
        super(name);
    }
    automateAttack() {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        // Choose new ordered pair if current one is already hit
        while (this.opponent.gameboard.readGrid()[x][y].isHit) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        }
        return { x, y };
    }
    automateShipPlacement(shipSet) {
        for (let ship in shipSet) {
            let x;
            let y;
            let orientation;
            do {
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
                orientation = Math.random() > 0.5 ? "down" : "right";
            } while (
                !this.gameboard.placeShip(x, y, orientation, shipSet[ship])
            );
        }
        return true;
    }
}

export { Ship, Gameboard, Player, NPC };
