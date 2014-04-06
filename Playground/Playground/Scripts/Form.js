/*
    Form.js
    This file contains Javascript to work with the form the user uses to specify what to draw.
*/

window.Form = (function () {
    'use strict';
    var editor;

    // Read the values on the form and return them as a single object.
    function getConfiguration() {
        var c, avgSize;

        c = {};
        c.plotSize = parseInt(document.getElementById('numSize').value);
        c.numWorkers = parseInt(document.getElementById('numWorkers').value);

        c.minR = parseFloat(document.getElementById('numNewMinR').value);
        c.maxR = parseFloat(document.getElementById('numNewMaxR').value);
        c.minI = parseFloat(document.getElementById('numNewMinI').value);
        c.maxI = parseFloat(document.getElementById('numNewMaxI').value);

        c.automaticMaxIterations = document.getElementById('chkAutomaticMaxIterations').checked;

        if (c.automaticMaxIterations) {
            // If the user has checked the box to automatically determine the maximum number of iterations, compute it here.
            // This needs a *lot* of work.  I'm just guessing right now.
            avgSize = (c.maxR - c.minR + c.maxI - c.minI) / 2;
            document.getElementById('numMaxIterations').value =
            //  Math.floor(200 / avgSize * 4 );
                Math.floor(200 * Math.log(8 / avgSize) / Math.log(1.5));
        }

        c.numEscape = parseInt(document.getElementById('numEscape').value);
        c.numMaxIterations = parseInt(document.getElementById('numMaxIterations').value);

        c.code = editor.getSession().getValue();

        return c;
    }

    function setPlotCoordinates(minR, maxR, minI, maxI) {
        document.getElementById('numMinR').value = minR;
        document.getElementById('numMaxR').value = maxR;
        document.getElementById('numMinI').value = minI;
        document.getElementById('numMaxI').value = maxI;
    }

    // Set up events to make the form work.
    // Since the form interaction module does not contain the functions to draw,
    // a handler to this function must be passed in.
    function setupForm(drawImageFunction) {
        var btnDraw, btnResetPlotLocation, btnSave;

        // We were passed in a function that draws the image, but we need to tell the image drawing function
        // how to display the drawing progress.
        function curriedDrawImageFunction() {
            drawImageFunction(setProgress);
        }

        btnDraw = document.getElementById('btnDraw');
        btnDraw.onclick = curriedDrawImageFunction;

        btnResetPlotLocation = document.getElementById('btnResetPlotLocation');
        btnResetPlotLocation.onclick = (function (e) {
            document.getElementById('numNewMinR').value = '-2';
            document.getElementById('numNewMaxR').value = '2';
            document.getElementById('numNewMinI').value = '-2';
            document.getElementById('numNewMaxI').value = '2';
        });

        btnSave = document.getElementById('btnSave');
        btnSave.onclick = (function (e) {
            var plot;
            plot = document.getElementById('plot');
            plot.toBlob(function (image) {
                saveAs(image);
            });
        });

        // Set up the ACE editor that allows the user to modify the Javascript.
        editor = ace.edit('divCode');
        editor.setTheme('ace/theme/monokai');
        editor.getSession().setMode('ace/mode/javascript');

        // Load the Javascript asynchronously, and when it's done, invoke the drawImageHandler.
        $.ajax({
            method: 'GET',
            url: 'Scripts/ComputationModule.js',
            dataType: 'text',
            success: function (response) {
                editor.getSession().setValue(response);
                curriedDrawImageFunction();
            },
            error: function (xhr) {
            }
        });
    }

    function setProgress(current, max) {        
        var progress;
        progress = document.getElementById('progress');
        progress.value = current;
        progress.max = max;
    }

    return {
        getConfiguration: getConfiguration,
        setPlotCoordinates: setPlotCoordinates,
        setupForm: setupForm
    };
})();