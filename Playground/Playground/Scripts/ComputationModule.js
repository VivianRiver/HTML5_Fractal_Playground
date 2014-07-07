// These functions need unit tests.
// This line is counted as line 33 in the debugger;
(function () {
    var computationModule = (function foo1(stdlib, foreign, heap) {
        "use asm";
        var sqrt = stdlib.Math.sqrt,
            sin = stdlib.Math.sin,
            cos = stdlib.Math.cos,
            atan = stdlib.Math.atan,
            exp = stdlib.Math.exp,
            ln = stdlib.Math.log,
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

        // This file is loaded via AJAX and the string below will be replaced with an actual iterating function.
        // The iterating function defining the fractal to draw
        // r and i are the real and imaginary parts of the value from the previous iteration
        // r0 and i0 are the starting points
        // It is expected that this file will actually be fetched by AJAX at which point,
        // the string below, will be replaced with code to implement
        // a particular iterating function.
        "ITERATINGFUNCTION"

        // The use of eval would probably give Douglas Crockford heart palpitations :-)

        // Compute the result of [r,i] raised to the power n.
        // Right now, this only supports whole numbers, but the calling code uses only doubles, so that's what it's declared as.
        // Place the resulting real part in outR and the imaginary part in outI.
        function computePower(r, i, n) {
            // Tell asm.js that r, i are floating point and n is an integer.
            r = +r;
            i = +i;
            n = +n;

            // Declare and initialize variables to be numbers.
            var rResult = 0.0;
            var iResult = 0.0;
            var j = 0.0;
            var tr = 0.0;
            var ti = 0.0;

            // Declare and initialize variables that will be used only in the
            // event we need to compute the reciprocal.
            var abs = 0.0;
            var recr = 0.0;
            var reci = 0.0;

            if (+n < 0.0) {
                // For n less than 0, compute the reciprocal and then raise it to the opposite power.
                abs = +sqrt(r * r + i * i);
                recr = r / abs;
                reci = -i / abs;
                r = recr;
                i = reci;
                n = +(-n);
            }

            rResult = r;
            iResult = i;

            for (j = 1.0; +j < +n; j = +(j + 1.0)) {
                tr = rResult * r - iResult * i;
                ti = rResult * i + iResult * r;
                rResult = tr;
                iResult = ti;
            }

            outR = rResult;
            outI = iResult;
        } // end computePower

        function add(r0, i0, r1, i1) {
            r0 = +r0;
            i0 = +i0;
            r1 = +r1;
            i1 = +i1;

            outR = +(r0 + r1);
            outI = +(i0 + i1);
        }

        function subtract(r0, i0, r1, i1) {
            r0 = +r0;
            i0 = +i0;
            r1 = +r1;
            i1 = +i1;

            outR = +(r0 - r1);
            outI = +(i0 - i1);
        }

        function multiply(r0, i0, r1, i1) {
            r0 = +r0;
            i0 = +i0;
            r1 = +r1;
            i1 = +i1;

            outR = r0 * r1 - i0 * i1;
            outI = r0 * i1 + r1 * i0;
        }

        function divide(r0, i0, r1, i1) {
            r0 = +r0;
            i0 = +i0;
            r1 = +r1;
            i1 = +i1;

            outR = +(((r0 * r1) + (i0 * i1)) / (r1 * r1 + i1 * i1));
            outI = +(((i0 * r1 - r0 * i1)) / (r1 * r1 + i1 * i1));

        }

        function compute_real(r, i) {
            r = +r;
            i = +i;
            outR = +r;
            outI = 0.0;
        }

        function compute_imag(r, i) {
            r = +r;
            i = +i;
            outR = 0.0;
            outI = +i;
        }

        function compute_abs(r, i) {
            r = +r;
            i = +i;

            // If the number is purely real, no need to compute square roots.                        
            if (i == 0.0) {
                outR = +(+r > 0.0 ? +r : -r);
                outI = 0.0;
            } else {
                outR = +sqrt(r * r + i * i);
                outI = 0.0;
            }
        }

        // Compute the "Argument" of a complex number, that is the angle of the number in polar coordinates.
        function compute_arg(r, i) {
            r = +r;
            i = +i;
            if (r == 0.0 & i == 0.0) {
                // Although arg(0) is undefined, I will use 0 here to avoid errors.
                outR = 0.0;
                outI = 0.0;
            }
            else {                
                outR = +(2.0 * +atan(i / (+sqrt(r * r + i * i) + r)));
                outI = 0.0;
            }
        }

        // Compute the conjugate of a complex number.
        function compute_conj(r, i) {
            r = +r;
            i = +i;
            outR = +r;
            outI = +(-i);
        }

        // Compute the sine of a number given its real and imaginary parts.
        function compute_sin(r, i) {
            r = +r;
            i = +i;
            outR = +(+sin(r) * (+exp(i) + +exp(-i)) / +2);
            outI = +(+cos(r) * (+exp(i) - +exp(-i)) / +2);

            //            // This is an experiment to see if using the Taylor series is faster in asm.js
            //            var powerR = 0.0;
            //            var powerI = 0.0;
            //            var factorial = 1.0;
            //            var multiple = 1.0;
            //            var z2_r = 0.0;
            //            var z2_i = 0.0;
            //            var a_r = 0.0;
            //            var a_i = 0.0;
            //            var j = 0.0;
            //            // z ^ 2
            //            multiply(r, i, r, i);
            //            z2_r = +outR;
            //            z2_i = +outI;

            //            // accumulator
            //            a_r = +r;
            //            a_i = +i;
            //            for (j = 1.0;
            //                +j < 10.0;
            //                j = +(j + 1.0)) {                
            //                factorial = +(factorial * (j * 2.0) * (j * 2.0 + 1.0));
            //                multiply(powerR, powerI, z2_r, z2_i);
            //                powerR = +outR;
            //                powerI = +outI;
            //                outR = +outR / factorial;
            //                outI = +outI / factorial;

            //                multiple = +multiple * -1.0;

            //                add(a_r, a_i, outR * multiple, outI * multiple);
            //                a_r = +outR;
            //                a_i = +outI;
            //            }
        }

        function compute_sh(r, i) {
            r = +r;
            i = +i;
            // Compute hyperbolic sine using the formula below.
            // sinh(x) = -i * sin(i * x)
            multiply(r, i, 0.0, 1.0);
            compute_sin(outR, outI);
            multiply(outR, outI, 0.0, -1.0);
        }

        function compute_cos(r, i) {
            r = +r;
            i = +i;
            outR = +(+cos(r) * (+exp(i) + +exp(-i)) / +2);
            outI = +(-(+sin(r)) * (+exp(i) - +exp(-i)) / +2);
        }

        function compute_ch(r, i) {
            r = +r;
            i = +i;
            // cosh(x) = cos(i * x)
            multiply(r, i, 0.0, 1.0);
            compute_cos(outR, outI);
        }

        // Compute the natural exponental for a number given its real and imaginary parts.
        function compute_exp(r, i) {
            r = +r;
            i = +i;
            var t = 0.0;
            t = +exp(+r);
            outR = +(t * +cos(i));
            outI = +(t * +sin(i));
        }

        // Compute the natural log for a number given its real and imaginary parts.
        // ln(a+bi) = ln(abs(z)) + i * arg(z)
        function compute_ln(r, i) {
            r = +r;
            i = +i;
            var realPart = 0.0,
                imagPart = 0.0;
            compute_abs(r, i);
            realPart = +ln(outR);
            compute_arg(r, i);
            imagPart = +outR;
            outR = +realPart;
            outI = +imagPart;
        }

        return {
            computeRow: computeRow
        };
    })(self, foreign, heap);

    // Return computationModule that we just defined.
    return computationModule;
})();