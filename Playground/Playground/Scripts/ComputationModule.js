// These functions need unit tests.
// This line is counted as line 33 in the debugger when the code is processed with eval.
// This code is read by AJAX and has the appropriate iterating function grafted into it.

function getComputationModule() {
    var computationModule = (function foo1(stdlib, foreign, heap) {
        "use asm";
        var sqrt = stdlib.Math.sqrt,
            sin = stdlib.Math.sin,
            cos = stdlib.Math.cos,
            atan = stdlib.Math.atan,
            atan2 = stdlib.Math.atan2,
            exp = stdlib.Math.exp,
            ln = stdlib.Math.log,
            floor = stdlib.Math.floor,
            ceil = stdlib.Math.ceil,
            int32Array = new stdlib.Int32Array(heap),
            float64Array = new stdlib.Float64Array(heap),
            outR = 0.0,
            outI = 0.0;
                
        function computeRow(canvasWidth, canvasHeight, graphingMethod, limit, max, tolerance, maxPeriod, rowNumber, minR, maxR, minI, maxI) {            
            canvasWidth = +canvasWidth;
            canvasHeight = +canvasHeight;
            graphingMethod = graphingMethod | 0;
            limit = +limit;
            max = max | 0;
            tolerance = +tolerance;
            maxPeriod = maxPeriod | 0;
            rowNumber = +rowNumber;
            minR = +minR;
            maxR = +maxR;
            minI = +minI;
            maxI = +maxI;

            var columnNumber = 0.0, zReal = 0.0, zImaginary = 0.0, thisPointValue = 0;
            var columnNumberInt = 0;

            // Compute the imaginary part of the numbers that correspond to pixels in this row.            
            // This computation takes into account the the imaginary value goes *down* as the y-coordinate on the canvas increases.
            zImaginary = maxI - (((maxI - minI) * +rowNumber) / +canvasHeight);
            // Iterate over the pixels in this row.
            // Compute the number of iterations to escape for each pixel that will determine its color.
            for (columnNumber = +0; +columnNumber < +canvasWidth; columnNumber = +(+columnNumber + 1.0)) {
                // Compute the real part of the number for this pixel.
                zReal = +(((maxR - minR) * +columnNumber) / +canvasWidth + minR);
                
                // Use one of several methods to determine the value for this point based on which graphing method the user selected.
                if ((graphingMethod|0) == (1|0)) {
                    thisPointValue = howManyToEscape(zReal, zImaginary, max, limit) | 0;
                } else if ((graphingMethod | 0) == (2 | 0)) {
                    thisPointValue = howManyToBePeriodic(zReal, zImaginary, max, tolerance, maxPeriod) | 0;
                }

                columnNumberInt = columnNumberInt + 1 | 0;
                int32Array[(columnNumberInt * 4) >> 2] = thisPointValue | 0;
            }
        }

        // Add a complex number to a sequence in memory (this will ordinarily come directly after
        // the part of the array that stores values computed for each pixel in a row).
        // Each complex number is two 64 bit floating point values in an array representing the real and complex parts.
        function saveSequenceItem(r, i, offset) {
            r = +r;
            i = +i;
            offset = offset | 0;

            var startingPositionInMemory = 65536;
            startingPositionInMemory = startingPositionInMemory >> 3;

            // todo: use proper offset here to account for size of data.
            float64Array[((startingPositionInMemory + offset) | 0) * 8 >> 3] = +r;
            float64Array[((startingPositionInMemory + offset + 1) | 0) * 8 >> 3] = i;
        }
        
        function isInSequence(r, i, tolerance, maxPeriod, sequenceLength) {
            r = +r;
            i = +i;
            tolerance = +tolerance;
            maxPeriod = maxPeriod | 0;
            sequenceLength = sequenceLength | 0;

            var startingPositionInMemory = 8192;            
            var startingPositionInSequence = 0;
            var j = 0, seqR = 0.0, seqI = 0.0, temp = 0, seqRGreater = 0, seqIGreater = 0, diffR = 0.0, diffI = 0.0;

            startingPositionInSequence = ((sequenceLength | 0) - (maxPeriod | 0)) | 0;
            if ((startingPositionInSequence | 0) < 0) {
                startingPositionInSequence = 0 | 0;
            }            

            for (j = startingPositionInSequence | 0; (j | 0) < (sequenceLength | 0) ; j = (j + 1) | 0) {
                
                temp = ((startingPositionInMemory | 0) + (j * 2 | 0)) | 0;                                
                seqR = +float64Array[(temp | 0) * 8 >> 3];
                seqI = +float64Array[((temp + 1) | 0) * 8 >> 3];

                seqRGreater = seqR > r;
                diffR = seqRGreater ? seqR - r : r - seqR;
                if (diffR > tolerance) {
                    continue;
                }

                seqIGreater = seqI > i;
                diffI = seqIGreater ? seqI - i : i - seqI;
                if (diffI > tolerance) {
                    continue;
                }

                return 1 | 0;
            }
            return 0 | 0;
        }
        
        // Function to determine how many iterations it takes for the sequence for
        // a point to be determined to be periodic.
        // max tells the maximum number of iterations to compute.
        // tolerance tells how close two floating-point numbers need to be to be considered "equal".
        function howManyToBePeriodic(r, i, max, tolerance, maxPeriod) {
            r = +r;
            i = +i;
            max = max | 0;
            tolerance = +tolerance;
            maxPeriod = maxPeriod | 0;     

            var j = 0;
            outR = +r;
            outI = +i;
            for (j = 0; (j | 0) < (max | 0) ; j = (j + 1) | 0) {
                // Iterate the function.
                iteratingFunction(outR, outI, r, i);
                // Check for infinity - return maximum iterations if infinity encountered.
                // TODO: Properly check for infinity, but asm.js doesn't seem to like that, so using 1000000 for now.
                // Uss x != x to check for NaN
                if (outR != outR | outI != outI | +outR > +1000000 | +outI > +1000000| +outR < +-1000000 | +outI < +-1000000) {
                    return max | 0;
                }
                // Check if we've seen this value before.
                if (isInSequence(outR, outI, tolerance, maxPeriod, j) | 0) {
                    return j | 0;
                }
                // Add this value to the array of items we've seen in this sequence.
                saveSequenceItem(outR, outI, (j * 2) | 0);
            }
            return max | 0;
        } // end function howManyToBePeriodic

        // Function to determine how many iterations for a point to escape.
        // This function is called for every point on the plot when we use an "escape-time" algorithm.
        // max tells the maximum number of iterations to compute.
        // limit tells the "bailout" number; when an iteration has absolute value greater than this number,
        // the point is assumed to be outside the fractal set.
        function howManyToEscape(r, i, max, limit) {
            r = +r;
            i = +i;
            max = max | 0;
            limit = +limit;

            var j = 0, limitSquared = 0.0;            
            outR = +r;
            outI = +i;
            limitSquared = +(limit * limit);
            for (j = 0; (j | 0) < (max | 0) ; j = (j + 1) | 0) {
                iteratingFunction(outR, outI, r, i)                
                if (+(outR * outR + outI * outI) >= limitSquared)
                    return j | 0;
            }
            return max | 0;
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

        // Truncates the decimal part of a real number.
        function truncateDecimal(r) {
            r = +r;

            if (+r > 0.0)
                return +floor(r);
            else
                return +ceil(r);
            return 0.0;
        }

        // Compute the result of [r,i] raised to the power with the given real and imaginary parts..        
        // Places the resulting real part in outR and the imaginary part in outI.
        function computePower(r, i, expr, expi) {
            // Tell asm.js that r, i, expr, and expi are floating-point numbers.
            r = +r;
            i = +i;
            expr = +expr;
            expi = +expi;

            // Declare and initialize variables to be numbers.
            var rResult = 0.0;
            var iResult = 0.0;
            var j = 0.0;
            var tr = 0.0;
            var ti = 0.0;

            // Declare and initialize variables that will be used only in the
            // event we need to compute the reciprocal.
            var abs_squared = 0.0;
            var recr = 0.0;
            var reci = 0.0;

            if (+truncateDecimal(expr) == +expr) if (expi == 0.0) {
                // Compute the result if the exponent is an integer real number.
                if (+expr < 0.0) {
                    // For n less than 0, compute the reciprocal and then raise it to the opposite power.
                    abs_squared = +(r * r + i * i);
                    recr = +r / abs_squared;
                    reci = -i / abs_squared;
                    r = recr;
                    i = reci;
                    expr = +(-expr);
                }

                rResult = r;
                iResult = i;

                for (j = 1.0; +j < +expr; j = +(j + 1.0)) {
                    tr = rResult * r - iResult * i;
                    ti = rResult * i + iResult * r;
                    rResult = tr;
                    iResult = ti;
                }

                outR = rResult;
                outI = iResult;
                return;
            }
             
            // If the exponent is not a whole number or has non-zero imaginary part, use logarithms
            // together with the exponential function to compute the power.
            // x ^ y = e ^ (ln(x) * y)

            // Compute the natural log of the base:
            compute_ln(r, i);

            // Multiply that by the exponent:
            multiply(outR, outI, expr, expi);

            // Exponentiate the result
            compute_exp(outR, outI);

            // The result is now in outR, outI.            
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
                // outR = +(2.0 * +atan(i / (+sqrt(r * r + i * i) + r)));
                outR = +(atan2(i, r));
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

        function get_outR() {
            return +outR;
        }
        function set_outR(r) {
            r = +r;
            outR = +r;
        }

        function get_outI() {
            return +outI;
        }
        function set_outI(i) {
            i = +i;
            outI = +i;
        }

        return {
            // The primary point-of-entry for the computation module
            computeRow: computeRow,

            // These functions are exposed to make them testable, but they won't normally be directly invoked.            
            iteratingFunction: iteratingFunction,
            computePower: computePower,
            add: add,
            subtract: subtract,
            multiply: multiply,
            divide: divide,
            compute_real: compute_real,
            compute_imag: compute_imag,
            compute_abs: compute_abs,
            compute_arg: compute_arg,
            compute_conj: compute_conj,
            compute_sin: compute_sin,
            compute_cos: compute_cos,
            compute_sh: compute_sh,
            compute_ch: compute_ch,
            compute_exp: compute_exp,
            compute_ln: compute_ln,
            get_outR: get_outR,
            set_outR: set_outR,
            get_outI: get_outI,
            set_outI: set_outI
        };
    })(self, foreign, heap);

    // Return computationModule that we just defined.
    return computationModule;
}
