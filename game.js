(function(){
"use strict";

var yourTable     = document.getElementById('you');
var computerTable = document.getElementById('computer');

var Battleship = {

    settings: 
    {
        sizeX: 10,
        sizeY: 10,
        numShips: 5,
        userShips: [],
        computerShips: []
    },

    Init: function () 
    {
        this.CreateBoard(this.settings.sizeX, this.settings.sizeY, yourTable, []);
        this.CreateBoard(this.settings.sizeX, this.settings.sizeY, computerTable, []);
       
        this.PlaceComputerShip();

    },

    // --===================================================-- 
    // -- Function for drawing playerboards
    // --===================================================-- 
    CreateBoard: function (sizeX, sizeY, tableID, ships) 
    {
        var player;
        for (var i = 0; i < sizeY; i++) 
        {
            // Creates each row on the board and appends it to the table
            var row = document.createElement("tr");
            tableID.appendChild(row);

            // Creates <td> and ands it to each row
            for (var j = 0; j < sizeX; j++) 
            {
                var tdata = document.createElement("td");
                tdata.setAttribute("data-row", i);
                tdata.setAttribute("data-col", j);
                if (tableID === yourTable)
                {
                    tdata.addEventListener('click', this.PlaceUserShip);
                    player = 1;
                }
                else 
                {
                    player = 2;
                    tdata.addEventListener('click', function() {
                        this.setAttribute('class', 'no-hit');
                    });
                }


                tdata.setAttribute("id", '' + player + i + j);
                // Appends <td> to <tr>
                row.appendChild(tdata);
            }
        }
    },



    GetLengthOfShips: function(shipArray) 
    {
        var switchArray = (shipArray === "userShips") ? Battleship.settings.userShips.length : Battleship.settings.computerShips.length; 
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



    // --===================================================-- 
    // -- Function for placing users ships
    // --===================================================-- 
    PlaceUserShip: function(player) 
    {

        if (Battleship.settings.userShips.length < Battleship.settings.numShips)
        {

            var row = this.getAttribute("data-row");
            var col = this.getAttribute("data-col");

            var length = Battleship.GetLengthOfShips("userShips");
            
            if (Battleship.ValidatingShipPosition(col, row, length))
            {
                this.setAttribute("class", "ship");


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
                    sibling.setAttribute("class", "ship");
                }

                Battleship.settings.userShips.push(new Battleship.Ship(length, col, row));
            }
        }
    },



    // --===================================================-- 
    // -- Function for placing computer ships
    // --===================================================-- 
    PlaceComputerShip: function() 
    {
        for (var s = 0; s < Battleship.settings.numShips; s++) 
        {
            
        
        var row;
        var col;
        var shipStartId;
        var shipEndId;
        var length = Battleship.GetLengthOfShips("computerShips");

        do
        {
            row = Math.floor(Math.random() * Battleship.settings.sizeY);
            col = Math.floor(Math.random() * Battleship.settings.sizeX);
        } 
        while (Battleship.ValidatingShipPosition(col, row, length) === false);

        shipStartId = '' + 2 + row + col;
        shipEndId = '' + 2 + row + (col + length - 1);

        console.log(shipStartId + ' ' + shipEndId);

        var ship;
        for (var i = shipStartId; i <= shipEndId; i++)
        {
            ship = document.getElementById(i);
            ship.setAttribute("class", "ship");

            ship.addEventListener('click', function() 
            {
                this.setAttribute('class', 'hit');
            });
        }

        

        ship = document.getElementById(shipEndId);
        ship.setAttribute("class", "ship");

        Battleship.settings.computerShips.push(new Battleship.Ship(length, col, row));
    }
    },



    // --===================================================-- 
    // -- Function for validating ships positions
    // --===================================================-- 
    ValidatingShipPosition: function(col, row, length) 
    {
        var bool = true;

        Battleship.settings.userShips.forEach(function(ship) 
        {
            if (row === ship.positionY)
            {
                for ( var i = ship.positionX; i < (parseInt(ship.positionX) + parseInt(ship.size)); i++)
                {
                    if (col == i)
                    {
                        bool = false;
                    }
                }
                
                for ( var j = col; j < (parseInt(col) + parseInt(length)); j++)
                {
                    if (j == ship.positionX)
                    {
                        bool = false;
                    }
                }

            }                            
        });

        if ((parseInt(col) + length) > Battleship.settings.sizeX)
        {
            bool = false;
        }
        return bool;
    },

    // --===================================================-- 
    // -- Object constructor for ship
    // --===================================================-- 
    Ship: function  (size, positionX, positionY)
    {
        var self = this;

        this.size = size;
        this.health = size;
        this.alive = true;
        this.positionX = positionX;
        this.positionY = positionY;

        function hit()
        {
            --self.health;
            if (self.health === 0) 
            {
                self.alive = false;
            }
        }
    }
};

Battleship.Init();


}());