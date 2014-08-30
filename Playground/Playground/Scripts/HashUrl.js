/*
    Provide functionality to allow for the configuration data to be read and written from a hash URL.
    Note that not all parts of the configuration, such as the number of web workers and plot size are included.
    Only data that tells what image to draw is included.
*/

// jslint directive
/*jslint browser: true, white: true*/
/*global Form, self*/

(function () {
    'use strict';
    var hashUrl, ignoreUrlChange;

    function getUrlConfiguration() {
        var currentUrl, array, configuration;
        currentUrl = self.location.toString();
        if (currentUrl.indexOf("#") > -1) {
            array = currentUrl.split('#')[1].split(',');
            configuration = {
                fractalId: array[0],
                minR: parseFloat(array[1]),
                maxR: parseFloat(array[2]),
                minI: parseFloat(array[3]),
                maxI: parseFloat(array[4]),
                numEscape: parseInt(array[5], 10),
                numMaxIterations: parseInt(array[6], 10),
                automaticMaxIterations: array[7] === 'true',
                textFunction: decodeURIComponent(array[8]),
                defaultMinR: array[9],
                defaultMaxR: array[10],
                defaultMinI: array[11],
                defaultMaxI: array[12]
            };

            // Remember that the configuration returned here does not contain everything that is contained in the configuration
            // returned from the Form!
            return configuration;
        }
        return null;
    }

    /*
    Set the configuration in the hash URL.        
    */
    function setUrlConfiguration(configuration) {
        var previousUrl, newUrl;

        // object level value that indicates what the URL was before we changed it.
        previousUrl = self.location.toString();

        newUrl = previousUrl.split('#')[0] + '#' + [
            configuration.fractalId,
            configuration.minR,
            configuration.maxR,
            configuration.minI,
            configuration.maxI,
            configuration.numEscape,
            configuration.numMaxIterations,
            configuration.automaticMaxIterations,
            encodeURIComponent(configuration.textFunction),
            configuration.defaultMinR,
            configuration.defaultMaxR,
            configuration.defaultMinI,
            configuration.defaultMaxI
        ].join(',');

        // Set ignoreUrlChange to true so that the program doesn't try to respond to the URL that it just set.
        ignoreUrlChange = true;
        self.location = newUrl;
    }

    self.onhashchange = function onhashchange() {
        var hashUrlConfiguration;

        if (ignoreUrlChange) {
            ignoreUrlChange = false;
            return;
        }

        hashUrlConfiguration = getUrlConfiguration();
        // Send the hash URL configuration to the Form object with the instructions
        // to update the form and then draw the image.
        Form.setConfigurationFromHashUrlConfiguration(hashUrlConfiguration, true);
    };

    hashUrl = {
        GetUrlConfiguration: getUrlConfiguration,
        SetUrlConfiguration: setUrlConfiguration
    };

    // Add the HashUrl object to the window to make it globally available.
    window.HashUrl = hashUrl;
} ());