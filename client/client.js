var gridWidth = 100;
var gridHeight = 40;
var clickable = true;
var generation = 0;
var calculating = false;
var isRunning = false;

// build the grid
for (i = 0; i < gridHeight; i++) {
    $("#grid").append('<div id="row-' + i + '" class="row"></div>');

    for (j = 0; j < gridWidth; j++) {
        var cellId = 'cell-' + (i * gridWidth + j);
        $('#row-' + i).append('<div id="' + cellId + '" class="cell"></div>');
        jQuery.data($('#' + cellId)[0], "x", j);
        jQuery.data($('#' + cellId)[0], "y", i);
    }
}

var removeCellFromGrid = function(data) {
    $.map(currentGrid, function(cell, index) {
        if (cell && (cell.x === data.x && cell.y === data.y)) {
            currentGrid.splice(index, 1);
        }
    });
}

var toggleCell = function(cell) {
    cell.toggleClass('alive').hasClass('alive') ? currentGrid.push(jQuery.data(cell[0])) : removeCellFromGrid(jQuery.data(cell[0]));
}

$('.cell').click(function() {
    toggleCell($(this));
})

$('body').mousedown(function() {
        $(".cell").mouseenter(function() {
            toggleCell($(this));
        })
    })
    .mouseup(function() {
        $('.cell').off('mouseenter');
    });

// apply grid from json
var applyGrid = function(data) {
    $('.cell').removeClass('alive');
    data.forEach(function(aliveCell) {
        $('#cell-' + (aliveCell.y * gridWidth + aliveCell.x)).addClass('alive');
    });
    currentGrid = data;
    generation += 1;
    $( '#generation' ).text( 'Generation: ' + generation );

    if (isRunning) {
        sendGrid();
    }
}

// initial grid
var currentGrid = [
    { x: 51, y: 18 },
    { x: 53, y: 19 },
    { x: 50, y: 20 },
    { x: 51, y: 20 },
    { x: 54, y: 20 },
    { x: 55, y: 20 },
    { x: 56, y: 20 }
];

var sendGrid = function() {
    calculating = true;

    $.ajax({
        url: '/getNextGeneration',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(currentGrid),
        success: function(data) {
            applyGrid(data);
            calculating = false;
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

var start = function () {
    isRunning = true;
    sendGrid();
};

var pause = function () {
    isRunning = false;
};

applyGrid(currentGrid);

$('#stepBtn').click(function() {
    if (!calculating) {
        sendGrid();
    }
});

$('#startBtn').click(function() {
    if (!calculating) {
        start();
        $(this).hide();
        $('#pauseBtn').show();
    }
});

$('#resetBtn').click(function() {
    generation = 0;
    $( '#generation' ).text( 'Generation: ' + generation );
    applyGrid([]);
});

$('#pauseBtn').click(function() {
    pause();
    $(this).hide();
    $('#startBtn').show();
});