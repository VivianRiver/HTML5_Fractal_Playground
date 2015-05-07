/*
    WebWorkerController.js
    Contains logic that is used to control the web worker processes that compute the
    values to color each pixel on the canvas.
*/

// jslint directive
/*jslint browser: true, white: true*/
/*global Form, drawingFunctions, Progress, alert, Worker*/

(function () {
    'use strict';
    var configuration, minR, maxR, minI, maxI, graphingMethod, limit, max, tolerance, maxPeriod, plotSize, rowResults, workers;

    // Cancel any currently running drawing.
    function cancelDrawing() {
        var i;
        // In order to cancel the drawing, terminate all of the web-worker processes.
        if (workers) {
            for (i = 0; i < workers.length; i += 1) {
                workers[i].terminate();
            }
        }

        // Close any previously opened Progress dialog.
        Progress.hideProgress();
    }

    // Draw the image.
    function startDrawing() {
        var nextRowNumber, width, height, farmSize, i, rowsComputed,
            times = [];

        function setupWorker(thisWorker) {
            thisWorker.postMessage({
                mode: 'setup',
                code: configuration.code,
                canvasWidth: width,
                canvasHeight: height
            });
        }

        // Post a message to a particular worker to compute the next row of escape values.
        function computeNextRowAsync(thisWorker) {            
            thisWorker.postMessage({
                mode: 'computeResult',
                canvasWidth: width,
                canvasHeight: height,
                graphingMethod: graphingMethod,
                limit: limit,
                max: max,
                tolerance: tolerance,
                maxPeriod: maxPeriod,
                rowNumber: nextRowNumber,
                minR: minR,
                maxR: maxR,
                minI: minI,
                maxI: maxI
            });
        }

        // Before doing anything, stop any previous drawing operation.
        cancelDrawing();

        // Starts at -1 because it gets incremented at the beginning of a loop and should be 0 at the first run.
        nextRowNumber = -1;
        rowsComputed = 0;
        workers = [];

        configuration = Form.getConfiguration();
        if (configuration.textFunction === '') {
            alert('There is no iterating function specified.');
            return;
        }
        plotSize = configuration.plotSize;
        limit = configuration.numEscape;
        max = configuration.numMaxIterations;
        farmSize = configuration.numWorkers;

        minR = configuration.minR;
        maxR = configuration.maxR;
        minI = configuration.minI;
        maxI = configuration.maxI;

        graphingMethod = configuration.graphingMethod;

        // Parameters to the "Perodicity Time" graphing method
        tolerance = configuration.tolerance;
        maxPeriod = configuration.maxPeriod;        

        // Now that the plot new co-ordinates have been read from the "Proposed New Plot location",
        // update the form to display the new co-ordinates in the "Plot Location"
        Form.setPlotCoordinates(minR, maxR, minI, maxI);

        // Set the canvas size to what the user specified.                
        width = height = plotSize;
        drawingFunctions.setPlotDimensions(width, height);

        rowResults = new Array(height);

        // Show the progress dialog with a [Cancel] button that will stop the drawing.
        Progress.showProgress('Drawing Image...', null, true, cancelDrawing);

        for (i = 0; i < farmSize; i += 1) {
            (function () {
                var worker;
                worker = new Worker('scripts/computer.js');
                nextRowNumber += 1;
                // When we get a message back from the web worker, we expect that it contains the howManyToEscape values
                // for a row of pixels in the canvas.
                // In the event listener that listens to these messages, we read and display this data.
                // Once that's done, check and see if this was the last row, and if it's not, go process the new row.
                worker.addEventListener('message', function (e) {
                    var computedRowNumber, result;
                    times.push(e.data.time);
                    computedRowNumber = e.data.rowNumber;
                    result = e.data.result;
                    rowResults[computedRowNumber] = result;
                    // nextRowNumber and rowsComputed must be trackes separately because some rows
                    // take longer to draw than others.
                    nextRowNumber += 1;
                    rowsComputed += 1;
                    if (nextRowNumber < height) {
                        // If there is another row to compute, compute it!
                        computeNextRowAsync(worker);
                    }
                    else {
                        // If there are no more rows to compute, this worker is done.
                        // If all workers are done, then it's time to color the pixels to draw the image.
                        farmSize -= 1;
                        if (farmSize === 0) {
                            drawingFunctions.colorPixels(rowResults, configuration.numMaxIterations, configuration.colors);
                            Progress.hideProgress();
                        }
                    }
                    // Update the progress bar with the current progress as a result of the computation being done.
                    Progress.setProgress(rowsComputed, height);
                }, false);
                // Setup the worker with the code specified by the user.
                setupWorker(worker);
                // Start the worker on the next row.
                computeNextRowAsync(worker);

                // Put the worker into an array that allows us to easily stop the operation if the user clicks [Cancel].
                workers.push(worker);
            } ());
        }        
    } // end startDrawing                                  

    Form.setPlotSizeByWindowSize();
    Form.setupForm(startDrawing);
} ());