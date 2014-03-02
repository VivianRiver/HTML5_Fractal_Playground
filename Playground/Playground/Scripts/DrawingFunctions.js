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

    // Takes a value between 0 and the maximum number to escape for a pixel on the plot and returns
    // an array of four numbers between 0 and 255 indicating the red, green, blue, and alpha values.
    drawingFunctions.toRgbaArray = function toRgbaArray(x, max) {
        var rgba, intensity;
        if (x === max)
            return [0, 0, 0, 255];
        rgba = [];
        intensity = x * 8;
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

    // Takes an array of arrays with the inner arrays representing columns and the outer arrays representing rows.
    // Also takes an array of color values produced using toRgbaArray to tell what color corresponds with each value.
    drawingFunctions.colorPixels = function colorPixels(arrayOfRowResults, rgbaArray) {
        var rgba, value, redIndex, imageData, imageDataIndex, rowNumber, columnNumber;
        imageData = plotContext.getImageData(0, 0, width, height);
        for (rowNumber = 0; rowNumber < height; rowNumber++)
            for (columnNumber = 0; columnNumber < width; columnNumber++) {
                // Each element in imageData is 4 numbers in an array representing the
                // red, green, blue, and alpha values at that pixel.
                // Therefore, it is width * height * 4 elements long.
                // The index of the red value for the pixel at (x,y), therefore, is
                // (y * width + x) * 4 and the next three are green, blue, and alpha.
                value = arrayOfRowResults[rowNumber][columnNumber];
                rgba = rgbaArray[value];
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

    // Assign the drawing functions module to a property of the page to make it global.
    window.drawingFunctions = drawingFunctions;
})();