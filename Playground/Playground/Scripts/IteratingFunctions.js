/*
    This defines various iterating functions that can be used to generate fractal plots
*/

// jslint directive
/*jslint white: true*/
/*global window*/

(function () {
    'use strict';
    var IteratingFunctions;

    // A constructor for an iterating function
    function IteratingFunction(id, name, iteratingFunction, defaultMinR, defaultMaxR, defaultMinI, defaultMaxI) {
        this.id = id;
        // If no name is specified, use the iterating function in place of the name.
        this.name = name === null ? iteratingFunction : name;
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
    IteratingFunctions.push(new IteratingFunction(801, 'Newton-3', 'z ^ 3 - 1', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(802, 'Newton-4', 'z ^ 4 - 1', -2, 2, -2, 2));

    // I don't know a name for this.
    IteratingFunctions.push(new IteratingFunction(6, null, 'sin(z / c)', -1, 1, -1, 1));
    IteratingFunctions.push(new IteratingFunction(601, null, 'sin(z^2 / c)', -1, 1, -1, 1));
    IteratingFunctions.push(new IteratingFunction(602, null, 'sin(z^3 / c)', -1, 1, -1, 1));

    IteratingFunctions.push(new IteratingFunction(1101, null, 'sh(z / c)', -1, 1, -1, 1));
    IteratingFunctions.push(new IteratingFunction(1102, null, 'sh(z^2 / c)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1103, null, 'sh(z^3 / c)', -1.5, 1.5, -1.5, 1.5));

    IteratingFunctions.push(new IteratingFunction(1301, null, 'sin(z / c^2)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1302, null, 'sin(z / c^3)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1303, null, 'sin(z / c^4)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1304, null, 'sin(z / c^5)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1305, null, 'sin(z / c^6)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1305, null, 'sin(z / c^7)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1306, null, 'sin(z / c^8)', -1.5, 1.5, -1.5, 1.5));

    IteratingFunctions.push(new IteratingFunction(1202, null, 'sh(z / c^2)', -1, 1, -1, 1));
    IteratingFunctions.push(new IteratingFunction(1203, null, 'sh(z / c^3)', -1, 1, -1, 1));
    IteratingFunctions.push(new IteratingFunction(1204, null, 'sh(z / c^4)', -1, 1, -1, 1));
    IteratingFunctions.push(new IteratingFunction(1205, null, 'sh(z / c^5)', -1, 1, -1, 1));
    IteratingFunctions.push(new IteratingFunction(1206, null, 'sh(z / c^6)', -1, 1, -1, 1));
    IteratingFunctions.push(new IteratingFunction(1207, null, 'sh(z / c^7)', -1, 1, -1, 1));
    IteratingFunctions.push(new IteratingFunction(1208, null, 'sh(z / c^8)', -1, 1, -1, 1));

    // I don't know a name for this.
    IteratingFunctions.push(new IteratingFunction(8, null, 'c * sin(z)', -2, 2, -2, 2));

    // I don't know a name for this.
    IteratingFunctions.push(new IteratingFunction(7, null, 'cos(z / c)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(701, null, 'cos(z^2 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(702, null, 'cos(z^3 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(703, null, 'cos(z^4 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(705, null, 'cos(z^5 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(706, null, 'cos(z^6 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(707, null, 'cos(z^7 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(708, null, 'cos(z^8 / c)', -2, 2, -2, 2));

    IteratingFunctions.push(new IteratingFunction(1401, null, 'ch(z / c)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1402, null, 'ch(z^2 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(1403, null, 'ch(z^3 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(1404, null, 'ch(z^4 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(1405, null, 'ch(z^5 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(1406, null, 'ch(z^6 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(1407, null, 'ch(z^7 / c)', -2, 2, -2, 2));
    IteratingFunctions.push(new IteratingFunction(1408, null, 'ch(z^8 / c)', -2, 2, -2, 2));

    IteratingFunctions.push(new IteratingFunction(901, null, 'cos(z / c^2)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(902, null, 'cos(z / c^3)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(903, null, 'cos(z / c^4)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(904, null, 'cos(z / c^5)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(905, null, 'cos(z / c^6)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(906, null, 'cos(z / c^7)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(907, null, 'cos(z / c^8)', -1.5, 1.5, -1.5, 1.5));

    IteratingFunctions.push(new IteratingFunction(1501, null, 'ch(z / c^2)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1502, null, 'ch(z / c^3)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1503, null, 'ch(z / c^4)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1504, null, 'ch(z / c^5)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1505, null, 'ch(z / c^6)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1506, null, 'ch(z / c^7)', -1.5, 1.5, -1.5, 1.5));
    IteratingFunctions.push(new IteratingFunction(1507, null, 'ch(z / c^8)', -1.5, 1.5, -1.5, 1.5));

    IteratingFunctions.push(new IteratingFunction(1601, null, 'z ^ 2 + c * arg(c)', -1, 1, -1, 1));

    // Add the iterating functions array to the window to make it globally available.
    window.IteratingFunctions = IteratingFunctions;
} ());