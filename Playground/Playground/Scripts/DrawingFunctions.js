(function () {
    var drawingFunctions, plotCanvas, plotContext, selectionCanvas;

    plotCanvas = document.getElementById('plot');
    plotContext = plotCanvas.getContext('2d');
    selectionCanvas = document.getElementById('selection');

    drawingFunctions = {};

    // Set the width and height of the canvas to draw on, in pixels.
    drawingFunctions.setPlotDimensions = function setPlotDimensions(width, height) {
        plot.width = selection.width = width;
        plot.height = selection.height = height;
    }

    // Takes an array of arrays with the inner arrays representing columns and the outer arrays representing rows.
    // Also takes an array of color values produced using toRgbaArray to tell what color corresponds with each value.
    drawingFunctions.colorPixels = function colorPixels(arrayOfRowResults, maxIterations) {
        var rgbaArray, rgba, value, redIndex, imageData, imageDataIndex, rowNumber, columnNumber;

        rgbaArray = computeRgbaArray(arrayOfRowResults, maxIterations);

        imageData = plotContext.getImageData(0, 0, width, height);
        for (rowNumber = 0; rowNumber < height; rowNumber++)
            for (columnNumber = 0; columnNumber < width; columnNumber++) {
                // Each element in imageData is 4 numbers in an array representing the
                // red, green, blue, and alpha values at that pixel.
                // Therefore, it is width * height * 4 elements long.
                // The index of the red value for the pixel at (x,y), therefore, is
                // (y * width + x) * 4 and the next three are green, blue, and alpha.
                value = arrayOfRowResults[rowNumber][columnNumber];

                if (value === maxIterations)
                    rgba = rgbaArray[0];
                else if (value >= rgbaArray.length)
                    rgba = rgbaArray[rgbaArray.length - 1];
                else
                    rgba = rgbaArray[value];

                // I get an error sometimes where is says "rgba is undefined".  This little bit of code is meant to catch that so I can figure it out.
                if (!rgba) {
                    alert('An error occurred.\nWe suggest that you click your browser\'s "Back" button to try again.');
                    debugger;
                }

                redIndex = (rowNumber * width + columnNumber) * 4;
                // Red
                imageData.data[redIndex] = rgba[0];
                // Green
                imageData.data[redIndex + 1] = rgba[1];
                // Blue
                imageData.data[redIndex + 2] = rgba[2];
                // Alpha
                imageData.data[redIndex + 3] = rgba[3];
            }
        plotContext.putImageData(imageData, 0, 0);
    }

    // compute the array of RGBA values that tell what colors correspond to each number to escape.
    function computeRgbaArray(arrayOfRowResults, maxIterations) {
        // Before we compute anything else, we need to find what values in the numbers to escape
        // correspond to the extremeties of the colors in the gradient.
        // I want to make sure that the value that corresponds to the maximum and minimum are not just one-off flukes,
        // so I stipulate that the maximum value and minimum value must each cover a certain fraction of pixels on the canvas.
        var minimumCount, min, max, o, array;
        minimumCount = Math.floor(arrayOfRowResults.length * arrayOfRowResults.length * .01);
        o = getMaxAndMinValues(arrayOfRowResults, minimumCount, maxIterations);
        min = o.min;
        max = o.max;

        // Compute the color that corresponds to any value returned from computeRow.
        array = [];
        for (i = 0; i < max; i++) {
            array.push(toRgbaArray(i, min, max));
        }
        //        array.push(toRgbaArray(0, min, max));

        return array;
    }

    // This function computes the numbers to escape that correspond with the extremes of the color gradient.
    // Everything between will be interpolated between these two extremes.
    function getMaxAndMinValues(values, minimumCount, maxIterations) {
        var i, j, value, absoluteMinimum, absoluteMaximum, mapping, accumulator, returnObject;
        absoluteMinimum = Infinity;
        absoluteMaximum = 0;

        // First, compute the number of times each number occurs and keep track of
        // what two numbers are the absolute minimum and maximum numbers in the arrays.
        mapping = {};
        for (i = 0; i < values.length; i++) {
            for (j = 0; j < values[i].length; j++) {
                value = values[i][j];

                if (value < absoluteMinimum)
                    absoluteMinimum = value;
                else if (value > absoluteMaximum && value !== maxIterations /* exclude points assumed to be inside the set */)
                    absoluteMaximum = value;

                if (mapping[value])
                    mapping[value]++;
                else
                    mapping[value] = 1;
            }
        }

        returnObject = {};
        // Count forwards from the absolute minimum to find what number occurs at least the minimum number of times.
        accumulator = 0;
        for (i = absoluteMinimum; accumulator < minimumCount; i++) {
            if (mapping[i])
                accumulator += mapping[i];
        }
        returnObject.min = i;
        // Next, count back from the absolute maximum to find what number occurs at least the minimum number of times.
        accumulator = 0;
        for (i = absoluteMaximum; accumulator < minimumCount; i--) {
            if (mapping[i])
                accumulator += mapping[i];
        }
        returnObject.max = i;

        return returnObject;
    }

    // Compute the RGBA values corresponding to a given number to escape,
    // given the minimum and maximum values for the color gradient.
    function toRgbaArray(x, min, max) {
        var rgba, intensity;
        if (x <= min || x >= max)
            return [0, 0, 0, 255];

        rgba = [];
        intensity = Math.floor(255 * (x - min) / (max - min));
        if (intensity > 255)
            intensity = 255;
        // Red
        rgba.push(0);
        // Green
        rgba.push(intensity);
        // Blue
        rgba.push(intensity);
        // Alpha
        rgba.push(255);
        return rgba;
    };

    // Assign the drawing functions module to a property of the page to make it global.
    window.drawingFunctions = drawingFunctions;
})();