/*
    This defines various iterating functions that can be used to generate fractal plots
*/

(function () {
    var IteratingFunctions;

    // A constructor for an iterating function
    function IteratingFunction(id, name, iteratingFunction, defaultMinR, defaultMaxR, defaultMinI, defaultMaxI) {
        this.id = id;
        this.name = name;
        this.iteratingFunction = iteratingFunction;
        this.defaultMinR = defaultMinR;
        this.defaultMaxR = defaultMaxR;
        this.defaultMinI = defaultMinI;
        this.defaultMaxI = defaultMaxI;
    }

    IteratingFunctions = [];

    // Custom - the user is prompted to enter his own iterating function when selecting this.
    IteratingFunctions.push(new IteratingFunction(-1, 'Custom'));

    // Mandelbrot
    IteratingFunctions.push(new IteratingFunction(0, 'Mandelbrot', 'z ^ 2 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(101, 'Mandelbrot-3', 'z ^ 3 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(102, 'Mandelbrot-4', 'z ^ 4 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(103, 'Mandelbrot-5', 'z ^ 5 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(104, 'Mandelbrot-6', 'z ^ 6 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(105, 'Mandelbrot-7', 'z ^ 7 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(106, 'Mandelbrot-8', 'z ^ 8 + c', -2, 2, -2, 2));

    // Burning Ships
    IteratingFunctions.push(new IteratingFunction(1, 'Burning Ships', '(abs(real(z)) + abs(imag(z)) * i) ^ 2 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(201, 'Burning Ships-3', '(abs(real(z)) + abs(imag(z)) * i) ^ 3 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(202, 'Burning Ships-4', '(abs(real(z)) + abs(imag(z)) * i) ^ 4 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(203, 'Burning Ships-5', '(abs(real(z)) + abs(imag(z)) * i) ^ 5 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(204, 'Burning Ships-6', '(abs(real(z)) + abs(imag(z)) * i) ^ 6 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(205, 'Burning Ships-7', '(abs(real(z)) + abs(imag(z)) * i) ^ 7 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(206, 'Burning Ships-8', '(abs(real(z)) + abs(imag(z)) * i) ^ 8 + c', -2, 2, -2, 2));

    // Platypus
    IteratingFunctions.push(new IteratingFunction(2, 'Platypus', '(real(z) + abs(imag(z)) * i) ^ 2 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(301, 'Platypus-3', '(real(z) + abs(imag(z)) * i) ^ 3 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(302, 'Platypus-4', '(real(z) + abs(imag(z)) * i) ^ 4 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(303, 'Platypus-5', '(real(z) + abs(imag(z)) * i) ^ 5 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(304, 'Platypus-6', '(real(z) + abs(imag(z)) * i) ^ 6 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(305, 'Platypus-7', '(real(z) + abs(imag(z)) * i) ^ 7 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(306, 'Platypus-8', '(real(z) + abs(imag(z)) * i) ^ 8 + c', -2, 2, -2, 2));

    // Heart Dagger
    IteratingFunctions.push(new IteratingFunction(3, 'Heart Dagger', '(abs(real(z)) + imag(z)) ^ 2 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(401, 'Heart Dagger-3', '(abs(real(z)) + imag(z)) ^ 3 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(402, 'Heart Dagger-4', '(abs(real(z)) + imag(z)) ^ 4 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(403, 'Heart Dagger-5', '(abs(real(z)) + imag(z)) ^ 5 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(404, 'Heart Dagger-6', '(abs(real(z)) + imag(z)) ^ 6 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(405, 'Heart Dagger-7', '(abs(real(z)) + imag(z)) ^ 7 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(406, 'Heart Dagger-8', '(abs(real(z)) + imag(z)) ^ 8 + c', -2, 2, -2, 2));

    // Mandelbar
    IteratingFunctions.push(new IteratingFunction(4, 'Mandelbar', 'conj(z) ^ 2 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(501, 'Mandelbar-3', 'conj(z) ^ 3 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(502, 'Mandelbar-4', 'conj(z) ^ 4 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(503, 'Mandelbar-5', 'conj(z) ^ 5 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(504, 'Mandelbar-6', 'conj(z) ^ 6 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(505, 'Mandelbar-7', 'conj(z) ^ 7 + c', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(506, 'Mandelbar-8', 'conj(z) ^ 8 + c', -2, 2, -2, 2));

    // Newton
    IteratingFunctions.push(new IteratingFunction(5, 'Newton', 'z ^ 2 - 1', -2, 2, -2, 2));

    // I don't know a name for this.
    IteratingFunctions.push(new IteratingFunction(6, 'sin(z / c)', 'sin(z / c)', -1, 1, -1, 1));

    // I don't know a name for this.
    IteratingFunctions.push(new IteratingFunction(8, 'c * sin(z)', 'c * sin(z)', -2, 2, -2, 2));

    // I don't know a name for this.
    IteratingFunctions.push(new IteratingFunction(7, 'cos(z / c)', 'cos(z / c)', -1, 1, -1, 1));

    // Custom
    // IteratingFunctions.push(new IteratingFunction('Custom...', 0, null));

    // Add the iterating functions array to the window to make it globally available.
    window.IteratingFunctions = IteratingFunctions;
})();