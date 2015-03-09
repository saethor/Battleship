(function(){
"use strict";

var yourTable     = document.getElementById('you');
var computerTable = document.getElementById('computer');

var Battleship = {

    settings: 
    {
        sizeX: 10,
        sizeY: 10,
        numShips: 5
    },

    Init: function () 
    {
        this.CreateBoard(this.settings.sizeX, this.settings.sizeY, yourTable);
        this.StartGame();

    },

    // --===================================================-- 
    // -- Function for drawing playerboards
    // --===================================================-- 
    CreateBoard: function (sizeX, sizeY, tableID) 
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
                
                // Appends <td> to <tr>
                row.appendChild(tdata);
            }
        }
    },

    StartGame: function() 
    {
        
    },

    // --===================================================-- 
    // -- Object constructor for ship
    // --===================================================-- 
    Ship: function  (size, positionX, positionY)
    {
        this.size = size;
        this.health = size;
        this.alive = true;
        this.positionX = positionX;
        this.positionY = positionY;

        function hit()
        {
            --this.health;
            if (this.health === 0) 
            {
                this.alive = false;
            }
        }
    }
};

Battleship.Init();


}());