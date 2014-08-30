// Javascript functions that are common to different methods of selecting a region to zoom in on
// regardless of the method used to select the region. (touch or mouse)

// directive for JSLint
/*jslint browser: true, white: true */
/*global Form*/

(function () {
    'use strict';

    var selectCommon, // an object representing the publicly accessible members
        selectionCanvas, // the canvas to draw the selection shading on
        context; // the 2d context of the canvas

    // Completely erase everything from the canvas.
    // This is always be done before shading a new selection to erase the old selection.
    function clearCanvas() {
        context.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
    }

    // Set the color so that the selected region is colored with the color
    // specified by the user on the form.
    function setColorFromForm() {
        context.strokeStyle = '#000000';
        context.fillStyle = Form.getConfiguration().colors[3];
    }

    // Draw a square on the canvas with x0, y0 at the upper-left-hand corner.
    // The length of the square is determined by the minimum of x1 - x0 and y1 - y0.
    function selectSquare(x0, y0, x1, y1) {
        var edgeLength, // the minimum edge of the square
            oldMinR, oldMaxR, oldMinI, oldMaxI, // the old coordinates in the complex plane
            newMinR, newMaxR, newMinI, newMaxI; // the new coordinates in the complex plane

        // Convert x-coordinate on the canvas to real coordinate in complex plane
        function convertXToR(x, minR, maxR) {
            var diff;
            diff = maxR - minR;
            return (diff * x) / selectionCanvas.width + minR;
        }
        // Convert y-coordiniate on the canvas to imaginary coordinate in complex plane.
        function convertYToI(y, minI, maxI) {
            var diff;
            diff = maxI - minI;
            return (diff * y) / selectionCanvas.height + minI;
        }

        // Clear the canvas and shade the newly selected region.        
        edgeLength = (x1 - x0 + y1 - y0) / 2;
        clearCanvas();
        setColorFromForm();
        context.fillRect(x0, y0, edgeLength, edgeLength);

        // Update the form with the newly selected region.
        // The old region has to be read from the form in order to compute the coordinates
        // in the complex plane that correspond to the coordinates on the canvas.
        oldMinR = parseFloat(document.getElementById('numMinR').value);
        oldMaxR = parseFloat(document.getElementById('numMaxR').value);
        oldMinI = parseFloat(document.getElementById('numMinI').value);
        oldMaxI = parseFloat(document.getElementById('numMaxI').value);

        newMinR = convertXToR(x0, oldMinR, oldMaxR);
        newMaxR = convertXToR(x0 + edgeLength, oldMinR, oldMaxR);
        newMinI = convertYToI(y0, oldMinI, oldMaxI);
        newMaxI = convertYToI(y0 + edgeLength, oldMinI, oldMaxI);

        document.getElementById('numNewMinR').value = newMinR;
        document.getElementById('numNewMaxR').value = newMaxR;
        document.getElementById('numNewMinI').value = newMinI;
        document.getElementById('numNewMaxI').value = newMaxI;
    }

    selectionCanvas = document.getElementById('selection');
    context = selectionCanvas.getContext('2d');

    selectCommon = {
        selectSquare: selectSquare
    };

    // Add the selectCommon object to the window to make it global.
    window.SelectCommon = selectCommon;
} ());