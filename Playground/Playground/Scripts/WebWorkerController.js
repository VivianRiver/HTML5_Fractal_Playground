/*
    WebWorkerController.js
    Contains logic that is used to control the web worker processes that compute the
    values to color each pixel on the canvas.
*/

// TODO: Create functions for StartDrawing and StopDrawing.
// Then, make the StartDrawing function a property on a global object that can be passed as a parameter to Form.setupForm
// because it shouldn't be called from here.

// Actually, I think it might be better to simply make it so that each time "StartDrawing" is called, it simply kills any threads from a previous draw operation.


(function () {
    var configuration, minR, maxR, minI, maxI, limit, max, rgbaArray, plotSize, rowResults, workers;

    Form.setupForm(startDrawing);

    // Draw the image.
    function startDrawing() {
        var nextRowNumber, workers, farmSize, i, rowsComputed;
        var times = [];

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

        // Now that the plot new co-ordinates have been read from the "Proposed New Plot location",
        // update the form to display the new co-ordinates in the "Plot Location"
        Form.setPlotCoordinates(minR, maxR, minI, maxI);

        // Set the canvas size to what the user specified.                
        width = height = plotSize;
        drawingFunctions.setPlotDimensions(width, height);

        rowResults = new Array(height);

        // Show the progress dialog with a [Cancel] button that will stop the drawing.
        Progress.showProgress('Drawing Image...', null, true, cancelDrawing);

        for (i = 0; i < farmSize; i++) {
            (function () {
                var worker;
                worker = new Worker('scripts/computer.js');
                nextRowNumber++;
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
                    nextRowNumber++;
                    rowsComputed++;
                    if (nextRowNumber < height) {
                        // If there is another row to compute, compute it!
                        computeNextRowAsync(worker);
                    }
                    else {
                        // If there are no more rows to compute, this worker is done.
                        // If all workers are done, then it's time to color the pixels to draw the image.
                        farmSize--;
                        if (farmSize === 0) {
                            drawingFunctions.colorPixels(rowResults, configuration.numMaxIterations);
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
            })();
        }

        function cancelDrawing() {
            // In order to cancel the drawing, terminate all of the web-worker processes.
            if (workers) {
                for (i = 0; i < workers.length; i++)
                    workers[i].terminate();
            }

            // Close any previously opened Progress dialog.
            Progress.hideProgress();
        }

        function setupWorker(thisWorker) {
            thisWorker.postMessage({
                mode: 'setup',
                code: configuration.code,
                canvasWidth: width,
                canvasHeight: height
            });
        }

        function computeNextRowAsync(thisWorker) {
            thisWorker.postMessage({
                mode: 'computeResult',
                canvasWidth: width,
                canvasHeight: height,
                limit: limit,
                max: max,
                rowNumber: nextRowNumber,
                minR: minR,
                maxR: maxR,
                minI: minI,
                maxI: maxI
            });
        }
    } // end startDrawing                                  

    Form.setPlotSizeByWindowSize();
})();