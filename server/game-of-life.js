var _ = require('lodash');
var checkedDeadCells = [];

var getNeighbours = function function_name(cell) {
	return  [
        { x: cell.x - 1, y: cell.y - 1 },
        { x: cell.x, y: cell.y - 1 },
        { x: cell.x + 1, y: cell.y - 1 },
        { x: cell.x - 1, y: cell.y },
        { x: cell.x + 1, y: cell.y },
        { x: cell.x - 1, y: cell.y + 1 },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x + 1, y: cell.y + 1 },
    ];
}

var sortNeighbours = function(cell, grid) {
    return {
    	alive: _.intersectionWith(grid, getNeighbours(cell), _.isEqual),
    	dead: _.differenceWith(getNeighbours(cell), grid, _.isEqual)
    };
}

exports.calculateNextGridCycle = function(currentGrid) {
    var newGrid = [];

    // reset checkedDeadCells
    checkedDeadCells = [];

    // go trough alive cells
    currentGrid.forEach(function(aliveCell) {
        var neighbours = sortNeighbours(aliveCell, currentGrid);
        if (neighbours.alive.length === 2 || neighbours.alive.length === 3) {
        	newGrid.push(aliveCell);
        }

        // go trough dead neighbours
        neighbours.dead.forEach(function (deadCell) {
        	// make sure you don't check an already checked dead cell
        	if (_.some(checkedDeadCells, deadCell)) {
        		return;
        	}

        	checkedDeadCells.push(deadCell);

        	var deacCellNeighbours = sortNeighbours(deadCell, currentGrid);
	        if (deacCellNeighbours.alive.length === 3) {
	        	newGrid.push(deadCell);
	        }
        })
    });

    return newGrid;
};