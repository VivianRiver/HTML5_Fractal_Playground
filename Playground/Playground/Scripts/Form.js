﻿/*
    Form.js
    This file contains Javascript to work with the form the user uses to specify what to draw.
*/

window.Form = (function () {
    'use strict';
    var editor, computationModuleCode, drawImageFunction;

    // Read the values on the form and return them as a single object.
    function getConfiguration() {
        var c, avgSize;

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

        c.fractalId = parseInt($('#selFractal').val());
        c.textFunction = document.getElementById('txtFunction').value;
        c.defaultMinR = $('#numDefaultMinR').val();
        c.defaultMaxR = $('#numDefaultMaxR').val();
        c.defaultMinI = $('#numDefaultMinI').val();
        c.defaultMaxI = $('#numDefaultMaxI').val();

        // This gets the asm.js code for ComputationModule.js and inserts the specified iterating function into the module for the asm.js compiler to compile.
        c.code = computationModuleCode
            .replace(new RegExp('"ITERATINGFUNCTION"'),
            "function iteratingFunction(z_r, z_i, c_r, c_i) {\n" + TextFunctionToAsmjs.convert(c.textFunction) + "}\n");

        return c;
    }

    function setConfigurationFromHashUrlConfiguration(c) {
        debugger;
        // Set the configuration on the form based on the configuration read from the hash URL.
        // Note that the configuration passed in is expected to have only the following fields:
        // fractalName, minR, maxR, minI, maxI, numEscape, numMaxIterations, automaticMaxIterations                

        $('#selFractal').val(c.fractalId);

        document.getElementById('numNewMinR').value = c.minR;
        document.getElementById('numNewMaxR').value = c.maxR;
        document.getElementById('numNewMinI').value = c.minI;
        document.getElementById('numNewMaxI').value = c.maxI;
        document.getElementById('numEscape').value = c.numEscape;
        document.getElementById('numMaxIterations').value = c.numMaxIterations;
        document.getElementById('chkAutomaticMaxIterations').checked = c.automaticMaxIterations;

        if (c.textFunction) {
            // If text function is specified, this is a custom iterating function
            // and these other values should be available, as well.
            document.getElementById('txtFunction').value = c.textFunction;
            document.getElementById('numDefaultMinR').value = c.defaultMinR;
            document.getElementById('numDefaultMaxR').value = c.defaultMaxR;
            document.getElementById('numDefaultMinI').value = c.defaultMinI;
            document.getElementById('numDefaultMaxI').value = c.defaultMaxI;
        }
        document.getElementById('numDefaultMaxI').value = c.defaultMaxI;

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
            if (e.charCode === 100 /* [D] */ && !optionsDialogIsOpen()) {
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
            if (e.charCode === 115 /* [S] */ && !optionsDialogIsOpen())
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
            if (e.charCode === 111 /* [O] */ && !optionsDialogIsOpen())
                showOptionsDialog();
        });

        function showOptionsDialog() {
            // Set up the jQuery-UI dialog with the form elements.
            $('#form').dialog('open');
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
        $('#selFractal').val('0');
        $(selFractal).change(function () {
            var id, iteratingFunction, i;
            // When the user changes the selection of the fractal here, update the text box
            // that contains the iterating function text.
            // Then, reset the plot coordinates and draw a new image.
            // However, if this is a custom function (id = -1),
            // don't do the above and instead, open the dialog where the user can specify the function.
            id = parseInt($(this).val());

            if (id === -1) {
                showOptionsDialog();
                $('#OptionsTabs').tabs('option', 'active', 1);
                $('#txtFunction').focus();
            } else {

                for (i = 0; i < IteratingFunctions.length; i++) {
                    if (IteratingFunctions[i].id === id) {
                        $('#txtFunction').val(IteratingFunctions[i].iteratingFunction);
                        $('#numDefaultMinR').val(IteratingFunctions[i].defaultMinR);
                        $('#numDefaultMaxR').val(IteratingFunctions[i].defaultMaxR);
                        $('#numDefaultMinI').val(IteratingFunctions[i].defaultMinI);
                        $('#numDefaultMaxI').val(IteratingFunctions[i].defaultMaxI);
                        break;
                    }
                }
                resetPlotLocation();
            }
        });

        // Set up the [Reset Plot Location] button so that we return to the original coordinates when it is clicked.
        // The user may also reset the plot location by pressing the [R] key.
        btnResetPlotLocation = document.getElementById('btnResetPlotLocation');
        btnResetPlotLocation.onclick = resetPlotLocation;
        $(document).keypress(function (e) {
            if (e.charCode === 114 /* [R] */ && !optionsDialogIsOpen())
                resetPlotLocation();
        });

        function resetPlotLocation() {
            document.getElementById('numNewMinR').value = document.getElementById('numDefaultMinR').value;
            document.getElementById('numNewMaxR').value = document.getElementById('numDefaultMaxR').value;
            document.getElementById('numNewMinI').value = document.getElementById('numDefaultMinI').value;
            document.getElementById('numNewMaxI').value = document.getElementById('numDefaultMaxI').value;
            // Draw the image again with these new coordinates.
            drawImageFunction();
            HashUrl.SetUrlConfiguration(getConfiguration());
        }

        // Set up the [Full Screen] button so that the user can toggle full screen mode when it is clicked.
        // The user may also toggle full screen mode by pressing the [F] key.
        btnFullScreen = document.getElementById('btnFullScreen');
        btnFullScreen.onclick = toggleFullScreen;
        $(document).keypress(function (e) {
            if (e.charCode === 102 /* [F] */ && !optionsDialogIsOpen())
                toggleFullScreen();
        });

        // The one and only thing inside the dialog that we need to immediately respond to is the txtFunction input.
        // When the user modifies this field manually, the selection box should immediately change to 'Custom' (id = -1)
        $('#txtFunction').change(function () {
            $('#selFractal').val('-1');
        });

        $(document).ready(function () {
            // Hide the button if full screen mode is not available.        
            if (!FullScreen.isFullScreenAvailable())
                $(btnFullScreen).css('display', 'none');

            // Initialize the options dialog, but don't open it yet.
            $('#form').dialog({
                autoOpen: false,
                title: 'Options',
                modal: false,
                width: 700
            });

            // Initialize the tabs for the options dialog.
            $('#OptionsTabs').tabs();
        });

        function toggleFullScreen() {
            if (FullScreen.isFullScreenActive())
                FullScreen.cancelFullScreen();
            else
                FullScreen.makeElementFullScreen(document.body);
        }

        function optionsDialogIsOpen() {
            // Tells whether or not the options dialog is open.                                   
            return $("#form").dialog("isOpen") === true;
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
    } // end function setupForm

    return {
        getConfiguration: getConfiguration,
        setConfigurationFromHashUrlConfiguration: setConfigurationFromHashUrlConfiguration,
        setPlotSizeByWindowSize: setPlotSizeByWindowSize,
        setPlotCoordinates: setPlotCoordinates,
        setupForm: setupForm
    };
})();