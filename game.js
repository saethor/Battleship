(function(){
"use strict";

var yourTable     = document.getElementById('you');
var computerTable = document.getElementById('computer');

/**
 * Main Object for Battleship game
 * @type {Object}
 */
var Battleship = {

    /**
     * If it is user turn then it is true, else it is computurs turn
     * @type {Boolean}
     */
    userTurn: true,
    userHit: 0,
    computerHit: 0,

    /**
     * Main settings for the game
     * @type {Object}
     */
    settings: 
    {
        sizeX: 10,
        sizeY: 10,
        numShips: 5,
        userShips: [],
        computerShips: [],
        computerShots: [],
        userShots: [],
    },

    /**
     * Initializes the game
     */
    Init: function () 
    {
        this.CreateBoard(this.settings.sizeX, this.settings.sizeY, yourTable, []);
        this.CreateBoard(this.settings.sizeX, this.settings.sizeY, computerTable, []);
       
        this.PlaceComputerShip();
    },

    Update: function () 
    {
        var computerTotalTargets = 0;
        var computerLeft = 0;
        Battleship.settings.computerShips.forEach(function(ship)
        {
            computerTotalTargets += ship.size;
        });
        computerLeft = computerTotalTargets - Battleship.userHit;

        var userTotalTargets = 0;
        var userLeft = 0;
        Battleship.settings.userShips.forEach(function(ship)
        {
            userTotalTargets += ship.size;
        });
        userLeft = userTotalTargets - Battleship.computerHit;


        console.log('user: ' + userLeft + ' . computerLeft: ' + computerLeft);

        if (computerLeft === 0)
        {
            alert('Congratulation! You just beated me!');
            Battleship.userTurn = false;
        }

        if (userLeft === 0)
        {
            alert('What a SUCKER!!! I just beated you!');
            Battleship.userTurn = false;
        }
    },

    /**
     * Function for the player board
     * 
     * @param {int} sizeX   
     * @param {int} sizeY   
     * @param {string} tableID string with the id for the table
     */
    CreateBoard: function (sizeX, sizeY, tableID) 
    {
        var player;
        for (var i = 0; i < sizeY; i++) 
        {
            // Creates each row on the board and appends it to the table
            var row = document.createElement('tr');
            tableID.appendChild(row);

            // Creates <td> and ands it to each row
            for (var j = 0; j < sizeX; j++) 
            {
                var tdata = document.createElement('td');
                tdata.setAttribute('data-row', i);
                tdata.setAttribute('data-col', j);
                if (tableID === yourTable)
                {
                    tdata.addEventListener('click', this.PlaceUserShip);
                    player = 1;
                }
                else 
                {
                    player = 2;
                    tdata.addEventListener('click', function() {
                        if (Battleship.settings.userShips.length === Battleship.settings.numShips)
                        {
                            if (Battleship.userTurn === true)
                            {
                                if (Battleship.settings.userShots.indexOf(this.getAttribute('id')) == -1)
                                {
                                    this.setAttribute('class', 'no-hit');

                                    Battleship.settings.userShots.push(this.getAttribute('id'));
                                    Battleship.userTurn = false;
                                    Battleship.ComputerTurn();
                                }
                                else {
                                    alert('Same spot twice');
                                }
                            }
                            else 
                                alert('Wait for your turn!');
                        }
                        else
                        {
                            alert('You have to place your ships before you can start');
                        }
                    });
                }


                tdata.setAttribute('id', '' + player + i + j);
                // Appends <td> to <tr>
                row.appendChild(tdata);
            }
        }
    },


    /**
     * Returns the length of next ship that is being created
     * @param {array} shipArray 
     * @returns {int} 
     */
    GetLengthOfShips: function(shipArray) 
    {
        var switchArray = (shipArray === 'userShips') ? Battleship.settings.userShips.length : Battleship.settings.computerShips.length; 
        var length = 0;
            switch (switchArray)
            {
                case 0:
                    length = 2;
                    break;

                case 1:
                    length = 2;
                    break;

                case 2:
                    length = 3;
                    break;

                case 3:
                    length = 3;
                    break;

                case 4:
                    length = 4;
                    break;
            }
        return length;
    },



    /**
     * Function for placing users ships
     */
    PlaceUserShip: function() 
    {
        if (Battleship.settings.userShips.length < Battleship.settings.numShips)
        {
            var length = Battleship.GetLengthOfShips('userShips');

            var row = this.getAttribute("data-row");
            var col = this.getAttribute("data-col");
            var shipStartId = '' + 1 + row + col;
            var shipEndId = '' + 1 + row + (parseInt(col) + length - 1);
            
            if (Battleship.ValidatingShipPosition(shipStartId, shipEndId, Battleship.settings.userShips) !== false)
            {
                this.setAttribute('class', 'ship');


                for(var i = 1; i < length; i++)
                {
                    var sibling;
                    if(!sibling)
                    {
                        sibling = this.nextSibling;
                        
                    }
                    else {
                        sibling = sibling.nextSibling;
                    }
                    sibling.setAttribute('class', 'ship');
                }

                Battleship.settings.userShips.push(new Battleship.Ship(length, shipStartId, shipEndId));
            }
        }
    },



    /**
     * Function for placing computer ships
     */
    PlaceComputerShip: function() 
    {
        for (var s = 0; s < Battleship.settings.numShips; s++) 
        {
            var row;
            var col;
            var shipStartId;
            var shipEndId;
            var length = Battleship.GetLengthOfShips('computerShips');
            var computerShipsArray = Battleship.settings.computerShips;
            

            do
            {
                row = Math.floor(Math.random() * Battleship.settings.sizeY);
                col = Math.floor(Math.random() * Battleship.settings.sizeX);
                shipStartId = '' + 2 + row + col;
                shipEndId = '' + 2 + row + (col + length - 1);
            } 
            while (Battleship.ValidatingShipPosition(shipStartId, shipEndId, computerShipsArray) === false);

            computerShipsArray.push(new Battleship.Ship(length, shipStartId, shipEndId));

            var ship;
            for (var i = shipStartId; i <= shipEndId; i++)
            {

                ship = document.getElementById(i);
                ship.addEventListener('click', function() 
                {
                    if (Battleship.settings.userShips.length === Battleship.settings.numShips)
                    {
                        if (Battleship.userTurn === true) {
                            this.setAttribute('class', 'hit');
                            Battleship.userHit++;
                            Battleship.Update();
                        }
                    }
                    else
                    {
                        alert('You have to place your ships before you can start');
                    }
                });
            }
        }

        /**
         * Function if user hits a enemy ship
         * @return {void} 
         */     
    },



    /**
     * Function for validating ships positions
     * @param {int} start  id of column ship starts in
     * @param {int} stop   id of column ship ends in
     * @param {string} player object of players ships
     * @returns {Bool} 
     */
    ValidatingShipPosition: function(start, stop, player) 
    {
        if (stop.length === 4)
        {
            return false;
        }

        for (var i = player.length - 1; i >= 0; i--) 
        { 
            for (var j = player[i].startId; j <= player[i].endId; j++)
            {
                for (var k = start; k <= stop; k++)
                {
                    if (k == j)
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    },

    /**
     * Object constructor for ships
     * @param {int} size  Determines how long each ship is
     * @param {int} start Determines where the ship starts
     * @param {int} end   Determines where the ship ends
     */
    Ship: function  (size, start, end)
    {
        var self = this;

        this.size = size;
        this.health = parseInt(size);
        this.alive = true;
        this.startId = start;
        this.endId = end;
    },

    /**
     * Function that makes computer fire random field on user board
     */
    ComputerTurn: function () 
    {
        if (Battleship.userTurn === false && (Battleship.settings.computerShots.length !== (Battleship.settings.sizeX * Battleship.settings.sizeY)))
        {
            var x;
            var y;
            var userID;
            var targetID;

            do
            {
                x = Math.floor(Math.random() * Battleship.settings.sizeX);
                y = Math.floor(Math.random() * Battleship.settings.sizeY);
                userID = 1;
                targetID = userID.toString() + x + y;  
            } 
            while (Battleship.settings.computerShots.indexOf(targetID) != -1);
            
            var targetEl = document.getElementById(targetID);

            if (Battleship.WasHit(targetID) === true)
            {
                targetEl.setAttribute('class', 'hit');
                Battleship.computerHit++;
                Battleship.Update();
            }
            else 
            {
                targetEl.setAttribute('class', 'no-hit');
            }

            Battleship.settings.computerShots.push(targetID);
            Battleship.userTurn = true;
        }
    },

    /**
     * Calculates if computer hits or not. If it hits then it adds the class of
     * hit else it adds the class of no-hit
     * @param {string}   
     * @returns {bool}
     */
    WasHit: function(targetID) 
    {
        var hit = false;
        Battleship.settings.userShips.forEach(function(ship)
        {
            for(var i = parseInt(ship.startId); i <= parseInt(ship.endId); i++) 
            {
                if (parseInt(targetID) === i)
                {
                    hit = true;
                }
            }
            
        });
        return hit;
    }

};

Battleship.Ship.prototype.hit = function() 
{
    --this.health;
    console.log(this);
    if (this.health === 0)
    {
        this.alive = false;
        alert("ship.down");
    }
};

/**
 * Starts the game
 */
Battleship.Init();


}());