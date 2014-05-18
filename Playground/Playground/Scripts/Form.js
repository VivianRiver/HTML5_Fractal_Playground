/*
    Form.js
    This file contains Javascript to work with the form the user uses to specify what to draw.
*/

window.Form = (function () {
    'use strict';
    var editor, computationModuleCode, drawImageFunction;

    // Read the values on the form and return them as a single object.
    function getConfiguration() {
        var c, avgSize, iteratingFunction;

        c = {};

        c.automaticPlotSize = document.getElementById('chkAutoPlotSize').checked;
        if (c.automaticPlotSize) {
            // If the user has checked the box to automatically determine the plot size based on the window size, compute it here.
            Form.setPlotSizeByWindowSize();
        }
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
            document.getElementById('numMaxIterations').value = (function () {
                var value;
                //  Math.floor(200 / avgSize * 4 );
                value = Math.floor(200 * Math.log(8 / avgSize) / Math.log(1.5));
                if (value === Infinity)
                    value = 2147483647;
                return value;
            })();
        }
        c.numMaxIterations = parseInt(document.getElementById('numMaxIterations').value);

        c.numEscape = parseInt(document.getElementById('numEscape').value);

        iteratingFunction = (function () {
            var fractalIndex, t, retval;
            fractalIndex = parseInt(document.getElementById('selFractal').value);
            return IteratingFunctions[fractalIndex];
        })();

        c.fractalId = iteratingFunction.id;

        c.code = computationModuleCode
            .replace(new RegExp('"ITERATINGFUNCTION"'), iteratingFunction.iteratingFunction.toString().replace(new RegExp('function \\('), 'function iteratingFunction ('));

        return c;
    }

    function setConfigurationFromHashUrlConfiguration(c) {
        // Set the configuration on the form based on the configuration read from the hash URL.
        // Note that the configuration passed in is expected to have only the following fields:
        // fractalName, minR, maxR, minI, maxI, numEscape, numMaxIterations, automaticMaxIterations                

        // $('#selFractal option:contains(' + c.fractalName + ')').attr('selected', true)
        $('#selFractal').val(c.fractalId);

        document.getElementById('numNewMinR').value = c.minR;
        document.getElementById('numNewMaxR').value = c.maxR;
        document.getElementById('numNewMinI').value = c.minI;
        document.getElementById('numNewMaxI').value = c.maxI;
        document.getElementById('numEscape').value = c.numEscape;
        document.getElementById('numMaxIterations').value = c.numMaxIterations;
        document.getElementById('chkAutomaticMaxIterations').checked = c.automaticMaxIterations;

        drawImageFunction();
    }

    // Size the plot so that it fits the browser window.
    function setPlotSizeByWindowSize() {
        document.getElementById('numSize').value = Math.min(window.innerWidth, window.innerHeight);
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
    function setupForm(p_drawImageFunction) {
        var i, btnDraw, btnSave, btnOptions, selFractal, $option, btnResetPlotLocation, btnFullScreen;

        drawImageFunction = p_drawImageFunction;

        // Set up the [Draw] button so that the user can click to draw the image.
        // The user may also draw the image by pressing the [D] key.
        btnDraw = document.getElementById('btnDraw');
        btnDraw.onclick = function () {
            drawImageFunction();
            HashUrl.SetUrlConfiguration(getConfiguration());
        };
        $(document).keypress(function (e) {
            if (e.charCode === 100 /* [D] */) {
                drawImageFunction();
                // After drawing the image, set the hash URL so that the user can bookmark it.
                HashUrl.SetUrlConfiguration(Form.getConfiguration());
            }
        });

        // Set up the [Save] button to allow for the image to be saved to disk.
        // The user may also save the image by pressing the [S] key.
        btnSave = document.getElementById('btnSave');
        btnSave.onclick = saveImageFunction;
        $(document).keypress(function (e) {
            if (e.charCode === 115 /* [S] */)
                saveImageFunction();
        });

        function saveImageFunction() {
            var plot;
            plot = document.getElementById('plot');
            plot.toBlob(function (image) {
                saveAs(image);
            });
        }

        // Set up the [Options] button so that the user can see the options form when he clicks it.
        // The user may also open the form by pressing the [O] key.
        btnOptions = document.getElementById('btnOptions');
        btnOptions.onclick = showOptionsDialog;
        $(document).keypress(function (e) {
            if (e.charCode === 111 /* [O] */)
                showOptionsDialog();
        });

        function showOptionsDialog() {
            // Set up the jQuery-UI dialog with the form elements.
            $('#form').dialog({
                title: 'Options',
                modal: false,
                width: 700
            });

        }

        // Set up the iterating function selection so that the user can choose a fractal.
        // The iterating functions are defined in the file IteratingFunctions.js
        selFractal = document.getElementById('selFractal');
        for (i = 0; i < IteratingFunctions.length; i++) {
            $option = $('<option>', {
                value: IteratingFunctions[i].id
            }).html(IteratingFunctions[i].name);
            $(selFractal).append($option);
        }

        // Set up the [Reset Plot Location] button so that we return to the original coordinates when it is clicked.
        // The user may also reset the plot location by pressing the [R] key.
        btnResetPlotLocation = document.getElementById('btnResetPlotLocation');
        btnResetPlotLocation.onclick = resetPlotLocation;
        $(document).keypress(function (e) {
            if (e.charCode === 114 /* [R] */)
                resetPlotLocation();
        });

        function resetPlotLocation() {
            document.getElementById('numNewMinR').value = '-2';
            document.getElementById('numNewMaxR').value = '2';
            document.getElementById('numNewMinI').value = '-2';
            document.getElementById('numNewMaxI').value = '2';
            // Draw the image again with these new coordinates.
            drawImageFunction();
        }

        // Set up the [Full Screen] button so that the user can toggle full screen mode when it is clicked.
        // The user may also toggle full screen mode by pressing the [F] key.
        btnFullScreen = document.getElementById('btnFullScreen');
        btnFullScreen.onclick = toggleFullScreen;
        $(document).keypress(function (e) {
            if (e.charCode === 102 /* [F] */)
                toggleFullScreen();
        });

        // Hide the button if full screen mode is not available.        
        $(document).ready(function () {
            if (!FullScreen.isFullScreenAvailable())
                $(btnFullScreen).css('display', 'none');
        });

        function toggleFullScreen() {
            if (FullScreen.isFullScreenActive())
                FullScreen.cancelFullScreen();
            else
                FullScreen.makeElementFullScreen(document.body);
        }

        // Estimate the number of cores in the user's CPU and put it in the "Number of Web Workers" input.
        // Once that is done, get the ComputationModule script 
        Progress.showProgress('Setup', 'Estimating the number of cores in your CPU...')
        Progress.setProgress(-1);
        navigator.getHardwareConcurrency(function (numCores) {
            Progress.hideProgress();
            document.getElementById('numWorkers').value = numCores.toString();

            // The estimation is done, so proceed to load the script and invoke the drawImageHandler when that's done.            
            $.ajax({
                method: 'GET',
                url: 'Scripts/ComputationModule.js',
                dataType: 'text',
                success: function (response) {
                    var hashUrlConfiguration;
                    computationModuleCode = response;
                    // Try to find a hash URL passed in.
                    hashUrlConfiguration = HashUrl.GetUrlConfiguration();                    
                    if (hashUrlConfiguration !== null)
                        Form.setConfigurationFromHashUrlConfiguration(hashUrlConfiguration);
                    // Draw the image.
                    drawImageFunction();
                    // Make sure the has URL is correct after drawing.                    
                    HashUrl.SetUrlConfiguration(getConfiguration());
                },
                error: function (xhr) {
                }
            });
        });


        // Set up the ACE editor that allows the user to modify the Javascript.
        editor = ace.edit('divCode');
        editor.setTheme('ace/theme/monokai');
        editor.getSession().setMode('ace/mode/javascript');
    }

    return {
        getConfiguration: getConfiguration,
        setConfigurationFromHashUrlConfiguration: setConfigurationFromHashUrlConfiguration,
        setPlotSizeByWindowSize: setPlotSizeByWindowSize,
        setPlotCoordinates: setPlotCoordinates,
        setupForm: setupForm
    };
})();