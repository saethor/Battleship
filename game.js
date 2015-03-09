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

    },

    // --===================================================-- 
    // -- Function for drawing playerboards
    // --===================================================-- 
    CreateBoard: function (sizeX, sizeY, tableID, ships) 
    {

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
                tdata.addEventListener('click', this.PlaceUserShip);
                
                // Appends <td> to <tr>
                row.appendChild(tdata);
            }
        }
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

            var length = 0;
            switch (Battleship.settings.userShips.length)
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


            var error = this.ValidatingShipPosition(col, row);

            
            if (!error)
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
    // -- Function for validating ships positions
    // --===================================================-- 
    ValidatingShipPosition: function(col, row) 
    {
        var error = false;

        Battleship.settings.userShips.forEach(function(ship) 
        {
            if (row === ship.positionY)
            {
                for ( var i = ship.positionX; i < (parseInt(ship.positionX) + parseInt(ship.size)); i++)
                {
                    console.log(i);
                    if (col == i)
                    {
                        error = true;
                        console.log("error");
                    }
                }
                for ( var j = col; j < (parseInt(col) + parseInt(length)); j++)
                {
                    if (j == ship.positionY)
                    {
                        error = true;

                        console.log("error2");
                    }
                }

            }
                            
        });

        return error;
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