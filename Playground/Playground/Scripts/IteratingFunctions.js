/*
    This defines various iterating functions that can be used to generate 
*/

(function () {
    var IteratingFunctions;

    // A constructor for an iterating function
    function IteratingFunction(name, numberOfParameters, iteratingFunction) {
        this.name = name;
        this.numberOfParameters = numberOfParameters;
        this.iteratingFunction = iteratingFunction;
    }

    IteratingFunctions = [];

    // Mandelbrot
    IteratingFunctions.push(new IteratingFunction('Mandelbrot', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r, i, 2);
        outR = +(r0 + outR);
        outI = +(i0 + outI);
    }));

    // Burning Ships
    IteratingFunctions.push(new IteratingFunction('Burning Ships', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r > 0 ? r : -r, i > 0 ? i : -i, 2);
        outR = +(r0 + outR);
        outI = +(i0 + outI);
    }));

    // Platypus
    IteratingFunctions.push(new IteratingFunction('Platypus', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r, i > 0 ? i : -i, 2);
        outR = +(r0 + outR);
        outI = +(i0 + outI);
    }));

    // Split Syringe
    IteratingFunctions.push(new IteratingFunction('Split Syringe', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r > 0 ? r : -r, i, 2);
        outR = +(r0 + outR);
        outI = +(i0 + outI);
    }));

    // Mandelbar
    IteratingFunctions.push(new IteratingFunction('Mandelbar', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r, -i, 2);
        outR = +(r0 + outR);
        outI = +(i0 + outI);
    }));

    // Newton
    IteratingFunctions.push(new IteratingFunction('Newton', 0, function (r, i, r0, i0) {
        r = +r;
        i = +i;
        r0 = +r0;
        i0 = +i0;
        computePower(r, i, 2);
        outR = +(outR - 1);
        outI = +outI;
    }));

    // Add the iterating functions array to the window to make it globally available.
    window.IteratingFunctions = IteratingFunctions;
})();