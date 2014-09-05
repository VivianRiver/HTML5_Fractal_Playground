(function () {
    'use strict';
    var assert, module;

    assert = (function () {
        function checksOut(computation, expectedr, expectedi) {
            // Set the outputs to something outlandish.
            // This will prevent a test from passing if a previous calculation had the expected result of this calculation,
            // but the computation module fails to set a new value.
            // These values should not be the expected outputs from any computation in testing.
            module.set_outR(9999);
            module.set_outI(9999);

            computation();
            areCloseEnough(expectedr, expectedi, module.get_outR(), module.get_outI(), computation.toString());
        }

        function areCloseEnough(expectedr, expectedi, actualr, actuali, message) {
            var diffr = Math.abs(expectedr - actualr),
                diffi = Math.abs(expectedi - actuali),
                diffabs = Math.sqrt(diffr * diffr + diffi * diffi),
                tolerance = 0.0001;

            log(message);
            if (diffabs <= tolerance) {
                log('assert.areCloseEnough check! ');
            } else {
                error('assert.areCloseEnough failed, expected: ' + expectedr + ' + ' + expectedi + ' i, actual: ' + actualr + ' + ' + actuali + ' i');
            }
        }

        function log(message) {
            document.writeln('<div>' + message + '</div>');
        }

        function error(message) {
            document.writeln('<div style="color:red;">' + message + '</div>');
        }

        return {
            checksOut: checksOut,
            areCloseEnough: areCloseEnough
        };
    } ());

    module = getComputationModule();

    // Transcendental functions checked on
    // http://www.mathsisfun.com/numbers/complex-number-calculator.html

    assert.checksOut(function () { module.add(1, 2, 3, 4); }, 4, 6);

    assert.checksOut(function () { module.subtract(1, 2, 3, 4); }, -2, -2);

    assert.checksOut(function () { module.multiply(1, 2, 3, 4); }, -5, 10);

    // I did check this one by hand ;-)
    assert.checksOut(function () { module.divide(1, 2, 3, 4); }, 0.44, 0.08);

    assert.checksOut(function () { module.computePower(1, 2, 1, 0); }, 1, 2);
    assert.checksOut(function () { module.computePower(1, 2, 2, 0); }, -3, 4);
    // Here, I'm simply assuming that this will be very close to the previous value.
    assert.checksOut(function () { module.computePower(1, 2, 1.99999, 0); }, -3, 4);
    assert.checksOut(function () { module.computePower(1, 2, 2.00001, 0); }, -3, 4);
    assert.checksOut(function () { module.computePower(1, 2, -1, 0); }, 0.2, -0.4);
    assert.checksOut(function () { module.computePower(1, 2, 3, 4); }, 0.129009594074467, 0.0339240929051701);

    assert.checksOut(function () { module.compute_abs(3, 4); }, 5, 0);

    assert.checksOut(function () { module.compute_real(1, 2); }, 1, 0);
    assert.checksOut(function () { module.compute_imag(1, 2); }, 0, 2);

    assert.checksOut(function () { module.compute_conj(1, 2); }, 1, -2);

    assert.checksOut(function () { module.compute_sin(0, 0); }, 0, 0);
    assert.checksOut(function () { module.compute_sin(Math.PI / 2, 0); }, 1, 0);
    assert.checksOut(function () { module.compute_sin(1, 2); }, 3.16577851321617, 1.95960104142161);

    assert.checksOut(function () { module.compute_cos(0, 0); }, 1, 0);
    assert.checksOut(function () { module.compute_cos(Math.PI / 2, 0); }, 0, 0);
    assert.checksOut(function () { module.compute_cos(1, 2); }, 2.03272300701967, -3.0518977991518);

    assert.checksOut(function () { module.compute_sh(0, 0); }, 0, 0);
    assert.checksOut(function () { module.compute_sh(1, 2); }, -0.489056259041294, 1.40311925062204);

    assert.checksOut(function () { module.compute_ch(0, 0); }, 1, 0);
    assert.checksOut(function () { module.compute_ch(1, 2); }, -0.64214812471552, 1.06860742138278);

    assert.checksOut(function () { module.compute_exp(0, 0); }, 1, 0);
    assert.checksOut(function () { module.compute_exp(1, 0); }, Math.E, 0);
    assert.checksOut(function () { module.compute_exp(1, 2 * Math.PI); }, Math.E, 0);
    assert.checksOut(function () { module.compute_exp(1, 2); }, -1.13120438375681, 2.47172667200482);

    assert.checksOut(function () { module.compute_ln(1, 0); }, 0, 0);
    assert.checksOut(function () { module.compute_ln(Math.E, 0); }, 1, 0);
    assert.checksOut(function () { module.compute_ln(1, 2); }, 0.80471895621705, 1.10714871779409);
} ());