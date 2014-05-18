/*
    This defines various iterating functions that can be used to generate fractal plots
*/

(function () {
    var IteratingFunctions;

    // A constructor for an iterating function
    function IteratingFunction(id, name, numberOfParameters, iteratingFunction) {
        this.id = id;
        this.name = name;
        this.numberOfParameters = numberOfParameters;
        this.iteratingFunction = iteratingFunction;
    }

    IteratingFunctions = [];

    // Mandelbrot
    IteratingFunctions.push(new IteratingFunction(0, 'Mandelbrot', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r, i, 2);
        outR = +(r0 + outR);
        outI = +(i0 + outI);
    }));

    // Burning Ships
    IteratingFunctions.push(new IteratingFunction(1, 'Burning Ships', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r > 0 ? r : -r, i > 0 ? i : -i, 2);
        outR = +(r0 + outR);
        outI = +(i0 + outI);
    }));

    // Platypus
    IteratingFunctions.push(new IteratingFunction(2, 'Platypus', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r, i > 0 ? i : -i, 2);
        outR = +(r0 + outR);
        outI = +(i0 + outI);
    }));

    // Split Syringe
    IteratingFunctions.push(new IteratingFunction(3, 'Heart Dagger', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r > 0 ? r : -r, i, 2);
        outR = +(r0 + outR);
        outI = +(i0 + outI);
    }));

    // Mandelbar
    IteratingFunctions.push(new IteratingFunction(4, 'Mandelbar', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r, -i, 2);
        outR = +(r0 + outR);
        outI = +(i0 + outI);
    }));

    // Newton
    IteratingFunctions.push(new IteratingFunction(5, 'Newton', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r, i, 2);
        outR = +(outR - 1);
        outI = +outI;
    }));

    // I don't know a name for this.
    IteratingFunctions.push(new IteratingFunction(6, 'sin(z/c)', 0, function (r, i, r0, i0) {
        // Divide the previous value by the starting point.
        // I do this by multiplying by the reciprocal
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        divide(r, i, r0, i0);
        computeSine(outR, outI);
    }));

    // I don't know a name for this.
    IteratingFunctions.push(new IteratingFunction(7, 'cos(z/c)', 0, function (r, i, r0, i0) {
        // Divide the previous value by the starting point.
        // I do this by multiplying by the reciprocal
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        divide(r, i, r0, i0);
        computeCosine(outR, outI);
    }));

    // Custom
    // IteratingFunctions.push(new IteratingFunction('Custom...', 0, null));

    // Add the iterating functions array to the window to make it globally available.
    window.IteratingFunctions = IteratingFunctions;
})();