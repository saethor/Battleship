(function(){
'use strict';

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
    lastHit: false,

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
        this.CreateBoard(this.settings.sizeX, this.settings.sizeY, yourTable);
        this.CreateBoard(this.settings.sizeX, this.settings.sizeY, computerTable);
       
        this.PlaceComputerShip();
    },

    /**
     * Checks if there is a winner
     */
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

        if (computerLeft === 0)
        {
            Battleship.Alerts('Congratulation! You just beated me!', 'success');
            Battleship.userTurn = false;
        }

        if (userLeft === 0)
        {
            Battleship.Alerts('What a SUCKER!!! I just beated you!', 'error');
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
        var tdata;
        for (var i = 0; i < sizeY; i++) 
        {
            // Creates each row on the board and appends it to the table
            var row = document.createElement('tr');
            tableID.appendChild(row);

            // Creates <td> and ands it to each row
            for (var j = 0; j < sizeX; j++) 
            {
                tdata = createRows(i, j);
                // Appends <td> to <tr>
                row.appendChild(tdata);
            }
        }

        /**
         * Fills tdata with rows and adds event listeners
         * @param  {i} i from the first for loop
         * @param  {j} j form the second for loop
         * @return {html}   
         */
        function createRows(i, j) 
        {
            var tdata = document.createElement('td');
            tdata.setAttribute('data-row', i);
            tdata.setAttribute('data-col', j);
            if (tableID === yourTable)
            {
                tdata.addEventListener('click', Battleship.PlaceUserShip);
                player = 1;
            }
            else 
            {
                player = 2;
                tdata.addEventListener('click', function() 
                {
                    var alerts = document.getElementById('alerts');
                    alerts.className = '';
                    alerts.innerHTML = '';
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
                            else 
                            {
                                Battleship.Alerts('You can\'t target the same spot twice', 'error');
                            }
                        }
                        else 
                            Battleship.Alerts('Wait for your turn!', 'error');
                    }
                    else
                    {
                        Battleship.Alerts('You have to place your ships before you can start', 'error');
                    }
                });
            }


            tdata.setAttribute('id', '' + player + i + j);

            return tdata;
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

            var row = this.getAttribute('data-row');
            var col = this.getAttribute('data-col');
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
                userHit(s, i);
            }
        } 

        /**
         * http://stackoverflow.com/questions/17981437/how-to-add-event-listeners-to-an-array-of-objects
         * @param  {int} s [var s from for-loop abowe]
         * @param  {int} i [var i from the second for-loop]
         * @return {void}
         */
        function userHit(s, i) {
            ship = document.getElementById(i);
            ship.addEventListener('click', function() 
            {
                if (Battleship.settings.userShips.length === Battleship.settings.numShips)
                {
                    if (Battleship.userTurn === true) {
                        this.setAttribute('class', 'hit');
                        computerShipsArray[s].hit('user');
                        Battleship.userHit++;
                        Battleship.Update();
                    }
                }
                else
                {
                    Battleship.Alerts('You have to place your ships before you can start', 'error');
                }
            });
        }
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

            // If last shoot was hit I find out what object that was and find
            // targets that are unshoot and shoot them 
            // (a little cheat to make the gameplay better)
            if (Battleship.lastHit !== false)
            {
                // Find the target ship
                var shipArray = Battleship.settings.userShips.filter(function(ship) {
                    for (var i = parseInt(ship.startId); i <= parseInt(ship.endId); i++)
                    {
                        if (parseInt(Battleship.lastHit) == i)
                        {
                            return ship;
                        }
                    }
                });

                var shipObject = shipArray[0];

                // Loop through and find missing targets
                for (var i = parseInt(shipObject.startId); i <= parseInt(shipObject.endId); i++)
                {
                    if (!inArray(i, Battleship.settings.computerShots))
                    {
                        targetID = i;
                    }
                }
            }

            // If last hit was false or the ship is down this chunk runs
            if (Battleship.lastHit === false || targetID === undefined)
            {
                do
                {
                    x = Math.floor(Math.random() * Battleship.settings.sizeX);
                    y = Math.floor(Math.random() * Battleship.settings.sizeY);
                    userID = 1;
                    targetID = userID.toString() + x + y; // Target id, 2 + x + y where 2 is the id for computer board
                    Battleship.lastHit = targetID;
                }
                // do while targetID is not in computerShots array (so computer
                // cant shoot the same spot twice)
                while (inArray(targetID, Battleship.settings.computerShots));
            }

            var targetEl = document.getElementById(targetID);

            // Checking if it was hit, if so it sets the class hit to it and
            // runs Update() and initializes lasthit variable
            if (Battleship.WasHit(targetID) === true)
            {
                targetEl.setAttribute('class', 'hit');
                
                Battleship.computerHit++;
                Battleship.Update();
                Battleship.lastHit = targetID;
            }

            // If it was not a hit it adds the class of no-hit and sets the
            // variable lastHit to false
            else
            {
                Battleship.lastHit = false;
                targetEl.setAttribute('class', 'no-hit');
            }

            // Adds the target id to computerShots array and sets user turn to
            // true
            Battleship.settings.computerShots.push(targetID);
            Battleship.userTurn = true;
        }
    },

    /**
     * Loops through user ships and finds if it is a hit on any of the ships, if
     * so it sets the hit to true and runs hit() function
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
                    ship.hit('computer');
                }
            }
            
        });
        return hit;
    },

    /**
     * Flashes alerts messages on top of the pages. 
     * @param {string} message Message that is being displayed
     * @param {strung} type    Type of error message, added as a class (error, success)
     */
    Alerts: function(message, type)
    {
        var div = document.getElementById('alerts');
        div.innerHTML = '';
        div.className = 'alert ' + type;
        div.innerHTML = message ;
    }

};

/**
 * If it is a hit this function decreses the live of the ship and if it sinks it changes alive to false and displays a alert message
 * @param  {string} shooter Who is the shooter
 * @return {void}         
 */ 
Battleship.Ship.prototype.hit = function(shooter) 
{
    --this.health;
    if (this.health === 0)
    {
        this.alive = false;
        switch (shooter) 
        {
            case 'computer':
                Battleship.Alerts('MUAHHAA YOU JUST LOST A SHIP', 'error');
                break;
            case 'user':
                Battleship.Alerts('NOOOOO MY SHIP!', 'success');
                break;

        }
    }
};

/**
 * Starts the game
 */
Battleship.Init();

/**
 * Helper function to find a value in a array
 * @param  {string} needle   What value are you looking for
 * @param  {array} heystack  Where are you looking for that array
 * @return {Boolean}         
 */
function inArray(needle, heystack)
{
    var length = heystack.length;
    for (var i = 0; i < length; i++)
    {
        if (heystack[i] == needle) return true;
    }
    return false;
}


}());