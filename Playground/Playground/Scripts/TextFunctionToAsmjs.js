/*
    Provide functionality to convert a text math function, such as z^2 + c,
    to the appropriate asm.js code.
*/

// jslint directive
/*jslint browser: true, white: true*/

(function () {
    'use strict';
    var textFunctionToAsmjs,
        ADD = 'ADD',
        SUBTRACT = 'SUBTRACT',
        MULTIPLY = 'MULTIPLY',
        DIVIDE = 'DIVIDE',
        EXPONENT = 'EXPONENT',
        ONE_ARG_FUNCTIONS = ['real', 'imag', 'abs', 'arg', 'sin', 'cos', 'sh', 'ch', 'exp', 'ln', 'conj', 'gamma'];

    // Return an array that parses the output into a sort of ternary tree where the branches of the tree
    // are either an operator and two operands, or a function with a single argument.
    // This function operates recursively.
    function parseTextToMathArray(text) {
        function recurse(text) {
            var index, operator, operand0, operand1, i;

            // Search for the substring within the given text.
            // Return the index of the first letter of the first instance of the substring.            
            function findIndex(toFind, text) {
                var j, c, numParens;
                numParens = 0;
                for (j = 0; j < text.length; j += 1) {
                    c = text.substr(j, toFind.length);
                    // The first part of the expression checks for a match.
                    // The second part of the expression checks that we're not looking for subtraction and finding a unary '-' instead.
                    if (c === toFind && numParens === 0 && !(toFind === '-' && (j === 0 || text[j - 1] === '(' || text[j - 1] === '+' || text[j - 1] === '*' || text[j - 1] === '/' || text[j - 1] === '^'))) {
                        return j;
                    }
                    if (c.substr(0, 1) === '(') {
                        numParens += 1;
                    } else if (c.substr(0, 1) === ')') {
                        numParens -= 1;
                    }
                }
                return -1;
            } // end function findIndex

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
                operator = EXPONENT;
                operand0 = text.substr(0, index);
                operand1 = text.substr(index + 1);
                return [operator, recurse(operand0), recurse(operand1)];
            }

            // If we didn't find any of the operators, look for the one argument functions
            for (i = 0; i < ONE_ARG_FUNCTIONS.length; i += 1) {
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

        // Remove spaces
        text = text.replace(/ /g, '');
        text = text.replace(/−/g, '-');
        text = text.toLowerCase();

        return recurse(text);
    } // end function parseTextToMathArray

    // Parse a tree-like structure representing a mathematical expression and generate corresponding asm.js code.    
    // This function operates recursively.
    function convertMathArrayToAsmjs(mathArray) {
        var i, numVariables, argumentTypeDeclarations, variableDeclarations, computationCode, asmjsCode;

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
                numVariables += 1;
                // Result will be in outR and outI
                result.push(recurse(mathArray[1]));
                result.push('__r' + firstVariableNum + ' = +outR;\n');
                result.push('__i' + firstVariableNum + ' = +outI;\n');

                secondVariableNum = numVariables;
                numVariables += 1;
                result.push(recurse(mathArray[2]));
                result.push('__r' + secondVariableNum + ' = +outR;\n');
                result.push('__i' + secondVariableNum + ' = +outI;\n');

                if (mathArray[0] === ADD) {
                    result.push('add(__r' + firstVariableNum + ', __i' + firstVariableNum + ', __r' + secondVariableNum + ', __i' + secondVariableNum + ');\n');
                } else if (mathArray[0] === SUBTRACT) {
                    result.push('subtract(__r' + firstVariableNum + ', __i' + firstVariableNum + ', __r' + secondVariableNum + ', __i' + secondVariableNum + ');\n');
                } else if (mathArray[0] === MULTIPLY) {
                    result.push('multiply(__r' + firstVariableNum + ', __i' + firstVariableNum + ', __r' + secondVariableNum + ', __i' + secondVariableNum + ');\n');
                } else if (mathArray[0] === DIVIDE) {
                    result.push('divide(__r' + firstVariableNum + ', __i' + firstVariableNum + ', __r' + secondVariableNum + ', __i' + secondVariableNum + ');\n');
                } else if (mathArray[0] === EXPONENT) {                    
                    result.push('computePower(__r' + firstVariableNum + ', __i' + firstVariableNum + ', __r' + secondVariableNum + ', __i' + secondVariableNum + ');\n');
                }

                // This needs a bit of cleaning up.  I defined a list of these functions elsewhere and the same list should be used here.
            } else if (mathArray[0] === 'sin' || mathArray[0] === 'cos' || mathArray[0] === 'sh' || mathArray[0] === 'ch' || mathArray[0] === 'exp' || mathArray[0] === 'abs' || mathArray[0] === 'real' || mathArray[0] === 'imag' || mathArray[0] === 'ln' || mathArray[0] === 'conj' || mathArray[0] === 'gamma') {
                // Single argument functions
                firstVariableNum = numVariables;
                numVariables += 1;
                result.push(recurse(mathArray[1]));
                result.push('__r' + firstVariableNum + ' = outR;\n');
                result.push('__i' + firstVariableNum + ' = outI;\n');

                // This assumes that the function to compute this in asm.js is named 'compute_' followed by the name of the function.
                result.push('compute_' + mathArray[0] + '(__r' + firstVariableNum + ', __i' + firstVariableNum + ');\n');
            }

            return result.join('');
        }

        numVariables = 0;

        // numVariables will be incremented to the actual number of variables to declare when recurse is called.
        computationCode = recurse(mathArray);

        argumentTypeDeclarations = 'z_r = +z_r;\nz_i = +z_i;\nc_r = +c_r;\nc_i = +c_i;\n';

        // Declare all the the variables as doubles.
        variableDeclarations = [];
        for (i = 0; i < numVariables; i += 1) {
            variableDeclarations.push('var __r' + i + ' = 0.0;\n');
            variableDeclarations.push('var __i' + i + ' = 0.0;\n');
        }
        variableDeclarations = variableDeclarations.join('');

        asmjsCode = argumentTypeDeclarations + variableDeclarations + computationCode;
        return asmjsCode;


    }

    // Convert a textual mathematics expression to asm.js code.
    // This is the only function that is exposed to the calling code.
    function convert(text) {
        var mathArray, asmjsCode;
        mathArray = parseTextToMathArray(text);
        asmjsCode = convertMathArrayToAsmjs(mathArray);
        return asmjsCode;
    }


    textFunctionToAsmjs = {
        convert: convert
    };

    // Add the textFunctionToAsmjs object to the window to make it global.
    window.TextFunctionToAsmjs = textFunctionToAsmjs;
} ());