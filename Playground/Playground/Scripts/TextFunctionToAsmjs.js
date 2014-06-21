/*
    Provide functionality to convert a text math function, such as z^2 + c,
    to the appropriate asm.js code.
*/

(function () {
    'use strict';
    var textFunctionToAsmjs;

    var ADD, SUBTRACT, MULTIPLY, DIVIDE, EXPONENT;
    ADD = 'ADD';
    SUBTRACT = 'SUBTRACT';
    MULTIPLY = 'MULTIPLY';
    DIVIDE = 'DIVIDE';
    EXPONENT = 'EXPONENT';

    function convert(text) {
        var mathArray, asmjsCode;
        mathArray = parseTextToMathArray(text);
        asmjsCode = convertMathArrayToAsmjs(mathArray);
        return asmjsCode;
    }    

    function parseTextToMathArray(text) {
        var ONE_ARG_FUNCTIONS;
        ONE_ARG_FUNCTIONS = ['real', 'imag', 'abs', 'sin', 'cos', 'tan', 'exp', 'ln', 'conj'];


        // Remove spaces
        text = text.replace(/ /g, '');
        text = text.replace(/−/g, '-');
        text = text.toLowerCase();

        return recurse(text);

        function recurse(text) {
            var index, operator, operand0, operand1, i;

            index = findIndex('-', text);
            if (index > -1) {
                operator = SUBTRACT;
                operand0 = text.substr(0, index);
                operand1 = text.substr(index + 1);
                return [operator, recurse(operand0), recurse(operand1)];
            }

            index = findIndex('+', text);
            if (index > -1) {
                operator = ADD;
                operand0 = text.substr(0, index);
                operand1 = text.substr(index + 1);
                return [operator, recurse(operand0), recurse(operand1)];
            }

            index = findIndex('/', text);
            if (index > -1) {
                operator = DIVIDE;
                operand0 = text.substr(0, index);
                operand1 = text.substr(index + 1);
                return [operator, recurse(operand0), recurse(operand1)];
            }

            index = findIndex('*', text);
            if (index > -1) {
                operator = MULTIPLY;
                operand0 = text.substr(0, index);
                operand1 = text.substr(index + 1);
                return [operator, recurse(operand0), recurse(operand1)];
            }

            index = findIndex('^', text);
            if (index > -1) {
                operator = EXPONENT
                operand0 = text.substr(0, index);
                operand1 = text.substr(index + 1);
                return [operator, recurse(operand0), recurse(operand1)];
            }

            // If we didn't find any of the operators, look for the one argument functions
            for (i = 0; i < ONE_ARG_FUNCTIONS.length; i++) {
                index = findIndex(ONE_ARG_FUNCTIONS[i], text);
                if (index > -1) {
                    operand0 = text.substr(index + ONE_ARG_FUNCTIONS[i].length, text.length - ONE_ARG_FUNCTIONS[i].length - index * 2);
                    return [ONE_ARG_FUNCTIONS[i], recurse(operand0)];
                }
            }


            // If we've made it this far, there isn't a single operation we can perform without going inside parenthesis.
            // This means that this is either a primitive expression (in which case there will be no parenthesis),
            // or this expression contains '(', an expression inside, and then ')', and nothing else.

            index = findIndex('(', text);
            if (index === 0) {
                return recurse(text.substr(1, text.length - 2));
            }

            return text;
        } // end function recurse

        // Search for the substring within the given text.
        // Return the index of the first letter of the first instance of the substring.            
        function findIndex(toFind, text) {
            var i, c, numParens;
            numParens = 0;
            for (i = 0; i < text.length; i++) {
                c = text.substr(i, toFind.length);
                // The first part of the expression checks for a match.
                // The second part of the expression checks that we're not looking for subtraction and finding a unary '-' instead.
                if (c === toFind && numParens === 0 && !(toFind === '-' && (i === 0 || text[i - 1] === '(' || text[i - 1] === '+' || text[i - 1] === '*' || text[i - 1] === '/' || text[i - 1] === '^')))
                    return i;
                else if (c.substr(0, 1) === '(')
                    numParens++;
                else if (c.substr(0, 1) === ')')
                    numParens--;
            }
            return -1;
        } // end function findIndex
    }

    function convertMathArrayToAsmjs(mathArray) {
        var i, numVariables, argumentTypeDeclarations, variableDeclarations, computationCode, asmjsCode;
        numVariables = 0;

        // numVariables will be incremented to the actual number of variables to declare when recurse is called.
        computationCode = recurse(mathArray);

        argumentTypeDeclarations = 'z_r = +z_r;\nz_i = +z_i;\nc_r = +c_r;\nc_i = +c_i;\n';

        // Declare all the the variables as doubles.
        variableDeclarations = [];
        for (i = 0; i < numVariables; i++) {
            variableDeclarations.push('var __r' + i + ' = 0.0;\n');
            variableDeclarations.push('var __i' + i + ' = 0.0;\n');
        }
        variableDeclarations = variableDeclarations.join('');

        asmjsCode = argumentTypeDeclarations + variableDeclarations + computationCode;
        return asmjsCode;

        function recurse(mathArray) {
            var firstVariableNum, secondVariableNum, result;

            result = [];

            // TODO: check for a literal with i
            if (typeof mathArray === 'string') {
                // If we have a string instead of an array, this should be a number or a variable (z or c)
                if (!isNaN(mathArray)) {
                    result.push('outR = +' + mathArray + ';\noutI = +0;\n');
                } else if (mathArray === 'z') {
                    result.push('outR = +z_r;\noutI = +z_i;\n');
                } else if (mathArray === 'c') {
                    result.push('outR = +c_r;\noutI = +c_i;\n');
                } else if (mathArray === 'i') {
                    result.push('outR = 0.0;\noutI = 1.0;\n');
                } else if (mathArray === '-i') {
                    result.push('outR = 0.0;\noutI = -1.0;\n');
                }
            } else if (mathArray[0] === ADD || mathArray[0] === SUBTRACT || mathArray[0] === MULTIPLY || mathArray[0] === DIVIDE || mathArray[0] === EXPONENT) {
                // var var_n;
                firstVariableNum = numVariables;
                numVariables++;
                // Result will be in outR and outI
                result.push(recurse(mathArray[1]));
                result.push('__r' + firstVariableNum + ' = +outR;\n');
                result.push('__i' + firstVariableNum + ' = +outI;\n');

                secondVariableNum = numVariables;
                numVariables++;
                result.push(recurse(mathArray[2]));
                result.push('__r' + secondVariableNum + ' = +outR;\n');
                result.push('__i' + secondVariableNum + ' = +outI;\n');

                if (mathArray[0] === ADD)
                    result.push('add(__r' + firstVariableNum + ', __i' + firstVariableNum + ', __r' + secondVariableNum + ', __i' + secondVariableNum + ');\n');
                else if (mathArray[0] === SUBTRACT)
                    result.push('subtract(__r' + firstVariableNum + ', __i' + firstVariableNum + ', __r' + secondVariableNum + ', __i' + secondVariableNum + ');\n');
                else if (mathArray[0] === MULTIPLY)
                    result.push('multiply(__r' + firstVariableNum + ', __i' + firstVariableNum + ', __r' + secondVariableNum + ', __i' + secondVariableNum + ');\n');
                else if (mathArray[0] === DIVIDE)
                    result.push('divide(__r' + firstVariableNum + ', __i' + firstVariableNum + ', __r' + secondVariableNum + ', __i' + secondVariableNum + ');\n');
                else if (mathArray[0] === EXPONENT)
                // Note that this uses only the real part of the exponent because only whole real numbers are supported, at the moment.
                    result.push('computePower(__r' + firstVariableNum + ', __i' + firstVariableNum + ', __r' + secondVariableNum + ');\n');
            } else if (mathArray[0] === 'sin' || mathArray[0] === 'cos' || mathArray[0] === 'exp' || mathArray[0] === 'abs' || mathArray[0] === 'real' || mathArray[0] === 'imag' || mathArray[0] === 'conj') {
                // Single argument functions
                firstVariableNum = numVariables;
                numVariables++;
                result.push(recurse(mathArray[1]));
                result.push('__r' + firstVariableNum + ' = outR;\n');
                result.push('__i' + firstVariableNum + ' = outI;\n');

                // This assumes that the function to compute this in asm.js is named 'compute_' followed by the name of the function.
                result.push('compute_' + mathArray[0] + '(__r' + firstVariableNum + ', __i' + firstVariableNum + ');\n');
            }



            return result.join('');
        }
    }

    textFunctionToAsmjs = {
        convert: convert
    };

    // Add the textFunctionToAsmjs object to the window to make it global.
    window.TextFunctionToAsmjs = textFunctionToAsmjs;
})();