// Allow the user to select a region with the mouse
// The user can then zoom in on the selection region by clicking the [Draw] button.

(function () {
    'use strict';
    var selectionCanvas, downX, downY, upX, upY, context, isDown, changed;
    selectionCanvas = document.getElementById('selection');
    context = selectionCanvas.getContext('2d');
    isDown = false;

    selectionCanvas.onmousedown = function (e) {
        switch (e.button) {
            case 0:
                // Select a square area with the left button.
                downX = e.layerX;
                downY = e.layerY;
                isDown = true;
                break;
            case 1:
                // toggle the zoom with the middle button
                if (changed) {
                    drawImage();
                    context.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
                    changed = false;
                }
                break;
        }
    }

    selectionCanvas.onmousemove = function (e) {
        var min, newMinR, newMaxR, newMinI, newMaxI;

        // The problem here is that all mouse clicks are being read relative to the window, but that's not necessarily relative to the document!!!
        upX = e.layerX;
        upY = e.layerY;

        // Only draw the square when the user is holding down a button.        
        if (isDown) {
            context.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
            min = Math.min(upX - downX, upY - downY);
            setColorFromForm();
            context.fillRect(downX, downY, min, min);
        }
    };

    selectionCanvas.onmouseup = function (e) {
        var min, oldMinR, oldMaxR, oldMinI, oldMaxI, newMinR, newMaxR, newMinI, newMaxI;

        // Ignore this event except when the left button is clicked.
        if (e.button !== 0)
            return;

        upX = e.layerX;
        upY = e.layerY;

        // Originally, this code was written under the false assumption that the user would always
        // select the region top-to-bottom, left-to-right.
        // I'm adding some extra code here to reverse the coordinates when the user draws the
        // region the other way.
        if (upX < downX)
            upX = [downX, downX = upX][0]; // swap values
        if (upY < downY)
            upY = [downY, downY = upY][0]; // swap values


        context.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
        min = Math.min(upX - downX, upY - downY);
        setColorFromForm();
        context.fillRect(downX, downY, min, min);

        oldMinR = parseFloat(document.getElementById('numMinR').value);
        oldMaxR = parseFloat(document.getElementById('numMaxR').value);
        oldMinI = parseFloat(document.getElementById('numMinI').value);
        oldMaxI = parseFloat(document.getElementById('numMaxI').value);

        newMinR = convertXToR(downX, oldMinR, oldMaxR);
        newMaxR = convertXToR(downX + min, oldMinR, oldMaxR);
        newMinI = convertYToI(downY, oldMinI, oldMaxI);
        newMaxI = convertYToI(downY + min, oldMinI, oldMaxI);

        document.getElementById('numNewMinR').value = newMinR;
        document.getElementById('numNewMaxR').value = newMaxR;
        document.getElementById('numNewMinI').value = newMinI;
        document.getElementById('numNewMaxI').value = newMaxI;

        changed = true;
        isDown = false;

        function convertXToR(x, minR, maxR) {
            var diff;
            diff = maxR - minR;
            return (diff * x) / selectionCanvas.width + minR;
        }
        function convertYToI(y, minI, maxI) {
            var diff;
            diff = maxI - minI;
            return (diff * y) / selectionCanvas.height + minI;
        }
    }

    // Set the color so that the selected region is colored with the color
    // specified by the user on the form.
    function setColorFromForm() {
        context.strokeStyle = '#000000';
        context.fillStyle = Form.getConfiguration().colors[3];
    }
})();