// This code is used to setup and run the operations with web workers.
// There are two operations that can be invoked: setup and computeResult.
// Since the web workers share no state, setup must be invoked on each one.

// JSLint directive
/*jslint browser: true, evil: true, white: true, unparam: true*/
/*global ArrayBuffer, Int32Array, self*/

(function () {
    'use strict';
    var computationModule, foreign, heap;

    function setup(data) {
        var code, bufferSize;
        code = data.code;
        // Buffer size has to be a power of 2 at least 65536 to make asm.js happy.
        // We want to use the smallest power of 2 that is smaller than 4 times the canvas width and at least 65536
        // That's because the value computed of each pixel in the row is represented as a 4-byte integer
        //bufferSize = (function () {
        //    var powerOfTwo = 65536;
        //    while (data.canvasWidth * 4 >= powerOfTwo) {
        //        powerOfTwo *= 2;
        //    }
        //    return powerOfTwo;
        //} ());
        // TODO: FIX THIS DEBUGGING CODE
        bufferSize = 65536 * 2;
        heap = new ArrayBuffer(bufferSize);

        foreign = {}; // This is not unused; it gets read by the eval code below.

        // I normally avoid use of the eval function.
        // However, I'm using Firefox asm.js to compile Javascript code to native code,
        // and that doesn't lend itself to me being able to modify the computationModule
        // with the code for the specific iterating equation we're using.                        
        computationModule = eval('(' + code + '())');
    }

    function computeResult(data) {
        var startDt, // the time the computation started
            endDt, // the time the computation ended
            result; // the result of the computation

        startDt = new Date();
        computationModule.computeRow(data.canvasWidth, data.canvasHeight, data.graphingMethod, data.limit, data.max, data.tolerance, data.maxPeriod, data.rowNumber, data.minR, data.maxR, data.minI, data.maxI);
        endDt = new Date();

        // The heap contains the result of the computation, but it also contains some working memory.
        // We want to only take as many elements from the heap as there are pixels in the canvas width.
        result = new Int32Array(heap, 0, data.canvasWidth);

        self.postMessage({
            rowNumber: data.rowNumber,
            time: endDt - startDt,
            result: result
        });
    }

    // This is the event handler that receives a command from the main thread to compute the pixel colors for a given row.
    self.addEventListener('message', function (e) {
        switch (e.data.mode) {
            case 'setup':
                setup(e.data);
                break;
            case 'computeResult':
                computeResult(e.data);
                break;
        }
    }, false);
} ());