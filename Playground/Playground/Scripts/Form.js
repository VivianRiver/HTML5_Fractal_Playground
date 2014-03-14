/*
    Form.js
    This file contains Javascript to work with the form the user uses to specify what to draw.
*/

window.Form = (function () {
    var editor;

    // Read the values on the form and return them as a single object.
    function getConfiguration() {
        var c;

        c = {};
        c.plotSize = parseInt(document.getElementById('numSize').value);
        c.numWorkers = parseInt(document.getElementById('numWorkers').value);
        c.numEscape = parseInt(document.getElementById('numEscape').value);
        c.numMaxIterations = parseInt(document.getElementById('numMaxIterations').value);

        c.minR = parseFloat(document.getElementById('numNewMinR').value);
        c.maxR = parseFloat(document.getElementById('numNewMaxR').value);
        c.minI = parseFloat(document.getElementById('numNewMinI').value);
        c.maxI = parseFloat(document.getElementById('numNewMaxI').value);

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

        btnDraw = document.getElementById('btnDraw');
        btnDraw.onclick = drawImageFunction;

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
                drawImageFunction();
            },
            error: function (xhr) {
            }
        });
    }

    return {
        getConfiguration: getConfiguration,
        setPlotCoordinates: setPlotCoordinates,
        setupForm: setupForm
    };
})();