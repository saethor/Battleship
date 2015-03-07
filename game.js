(function() {

var yourTable     = document.getElementById('you');
var computerTable = document.getElementById('computer');


// --===================================================-- 
// -- Boards setup
// --===================================================--
var yourBoardSetup = [['','','','','','#','#','','',''],
                     ['','','','','','','','','',''],
                     ['','','','','','','','','',''],
                     ['','#','#','#','#','','','','',''],
                     ['#','','','','','','','','',''],
                     ['#','','','','','','','','',''],
                     ['#','','','','','#','#','#','',''],
                     ['#','','','','','','','','',''],
                     ['','','#','#','#','#','#','','',''],
                     ['','','','','','','','','','']];

var computerSetup = [['','','','','','#','#','#','',''],
                     ['','','','','','','','','',''],
                     ['','#','','','','','','','',''],
                     ['','#','','','#','','','','#',''],
                     ['','#','','','#','','','','#',''],
                     ['','#','','','#','','','','',''],
                     ['','','','','#','','','','',''],
                     ['','','','','','','','','',''],
                     ['','','','','','','','','',''],
                     ['','','','#','#','#','#','#','','']];



// --===================================================-- 
// -- Function for drawing playerboards
// --===================================================-- 
function creatBoard(boardArray, tableID) 
{
    for (var i = 0; i < boardArray.length; i++) 
    {
        // Creates each row on the board and appends it to the table
        var row = document.createElement("tr");
        tableID.appendChild(row);

        // Creates <td> and ands it to each row
        for (var j = 0; j < boardArray[i].length; j++) 
        {
            var tdata = document.createElement("td");

            // Checks if td represents part of a ship and ads class if it is your ship
            // If it not your ship it adds a event listener
            if (boardArray[i][j] == '#')
            {
                if (tableID == yourTable) 
                {
                    tdata.setAttribute("class", "ship");
                } 
                else 
                {
                    tdata.addEventListener("click", function() {
                        this.setAttribute("class", "hit");
                    });
                }
                
            }
            else 
            {
                tdata.addEventListener("click", function() {
                    this.setAttribute("class", "no-hit");
                });
            }

            // Appends <td> to <tr>
            row.appendChild(tdata);
        }
    }
}

creatBoard(yourBoardSetup, yourTable);
creatBoard(computerSetup, computerTable);


// --===================================================-- 
// -- Object constructor for ship
// --===================================================-- 
function ship (size, positionX, positionY)
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

}());