(function () {
    var computationModule = (function foo1(stdlib, foreign, heap) {
        "use asm";
        var sqrt = stdlib.Math.sqrt,
            heapArray = new stdlib.Int32Array(heap),
            outR = 0.0,
            outI = 0.0;

        function computeRow(canvasWidth, canvasHeight, limit, max, rowNumber, minR, maxR, minI, maxI) {
            canvasWidth = +canvasWidth;
            canvasHeight = +canvasHeight;
            limit = +limit;
            max = max | 0;
            rowNumber = +rowNumber;
            minR = +minR;
            maxR = +maxR;
            minI = +minI;
            maxI = +maxI;

            var columnNumber = 0.0, zReal = 0.0, zImaginary = 0.0, numberToEscape = 0;
            var columnNumberInt = 0;

            // Compute the imaginary part of the numbers that correspond to pixels in this row.
            zImaginary = +(((maxI - minI) * +rowNumber) / +canvasHeight + minI);
            // Iterate over the pixels in this row.
            // Compute the number of iterations to escape for each pixel that will determine its color.
            for (columnNumber = +0; +columnNumber < +canvasWidth; columnNumber = +(+columnNumber + 1.0)) {
                // Compute the real part of the number for this pixel.
                zReal = +(((maxR - minR) * +columnNumber) / +canvasWidth + minR);
                numberToEscape = howManyToEscape(zReal, zImaginary, max, limit) | 0;
                columnNumberInt = columnNumberInt + 1 | 0;
                heapArray[(columnNumberInt * 4) >> 2] = numberToEscape | 0;
            }
        }

        // Function to determine how many iterations for a point to escape.
        function howManyToEscape(r, i, max, limit) {
            r = +r;
            i = +i;
            max = max | 0;
            limit = +limit;

            var j = 0, ar = 0.0, ai = 0.0;
            ar = +r;
            ai = +i;
            for (j = 0; (j | 0) < (max | 0); j = (j + 1) | 0) {
                iteratingFunction(ar, ai, r, i)
                ar = outR;
                ai = outI;
                if (+(ar * ar + ai * ai) >= +(limit * limit))
                    return j | 0;
            }
            return j | 0;
        }

        // The iterating function defining the fractal to draw
        // r and i are the real and imaginary parts of the value from the previous iteration
        // r0 and i0 are the starting points
        function iteratingFunction(r, i, r0, i0) {
            r = +r;
            i = +i;
            r0 = +r0;
            i0 = +i0;
            computePower(r, i, 2);
            // Set the output from this function to t
            outR = +(r0 + outR);
            outI = +(i0 + outI);
        }

        // Compute the result of [r,i] raised to the power n.
        // Place the resulting real part in outR and the imaginary part in outI.
        function computePower(r, i, n) {
            // Tell asm.js that r, i are floating point and n is an integer.
            r = +r;
            i = +i;
            n = n | 0;

            // Declare and initialize variables to be numbers.
            var rResult = 0.0;
            var iResult = 0.0;
            var j = 0;
            var tr = 0.0;
            var ti = 0.0;

            // Declare and initialize variables that will be used only in the
            // event we need to compute the reciprocal.
            var abs = 0.0;
            var recr = 0.0;
            var reci = 0.0;

            if ((n | 0) < (0 | 0)) {
                // For n less than 0, compute the reciprocal and then raise it to the opposite power.
                abs = +sqrt(r * r + i * i);
                recr = r / abs;
                reci = -i / abs;
                r = recr;
                i = reci;
                n = -n | 0;
            }

            rResult = r;
            iResult = i;

            for (j = 1; (j | 0) < (n | 0); j = (j + 1) | 0) {
                tr = rResult * r - iResult * i;
                ti = rResult * i + iResult * r;
                rResult = tr;
                iResult = ti;
            }

            outR = rResult;
            outI = iResult;
        } // end computePower

        return {
            computeRow: computeRow
        };
    })(self, foreign, heap);

    // Return computationModule that we just defined.
    return computationModule;
})();