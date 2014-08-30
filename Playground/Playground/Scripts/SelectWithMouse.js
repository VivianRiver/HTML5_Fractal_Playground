// Allow the user to select a region with the mouse
// The user can then zoom in on the selection region by clicking the [Draw] button.

// directive for JSLint
/*jslint browser: true, white: true */
/*global SelectCommon*/

(function () {
    'use strict';
    var selectionCanvas, downX, downY, upX, upY, isDown;

    selectionCanvas = document.getElementById('selection');
    isDown = false;

    selectionCanvas.onmousedown = function onmousedown(e) {
        switch (e.button) {
            case 0:
                // Select a square area with the left button.
                downX = e.layerX;
                downY = e.layerY;
                isDown = true;
                break;
            //            case 1:       
            //                // toggle the zoom with the middle button       
            //                if (changed) {       
            //                    drawImage();       
            //                    changed = false;       
            //                }       
            //                break;       
        }
    };

    selectionCanvas.onmousemove = function onmousemove(e) {
        upX = e.layerX;
        upY = e.layerY;

        // Only draw the square when the user is holding down a button
        // and the X and Y coordinates are different from when the mouse button was originall clicked.
        // In other words, don't select when the user clicks without moving the mouse or moves the mouse without clicking.
        if (isDown && downX !== upX && downY !== upY) {
            SelectCommon.selectSquare(downX, downY, upX, upY);
        }
    };

    selectionCanvas.onmouseup = function onmouseup(e) {
        // Ignore this event except when the left button is clicked.
        if (e.button === 0) {
            upX = e.layerX;
            upY = e.layerY;

            // Originally, this code was written under the false assumption that the user would always
            // select the region top-to-bottom, left-to-right.
            // I'm adding some extra code here to reverse the coordinates when the user draws the
            // region the other way.
            if (upX < downX) {
                upX = [downX, downX = upX][0]; // swap values
            }
            if (upY < downY) {
                upY = [downY, downY = upY][0]; // swap values
            }

            SelectCommon.selectSquare(downX, downY, upX, upY);
            
            isDown = false;
        }
    };
} ());