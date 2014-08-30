// Wrap methods having to do with the fullscreen API so that I can change them in one place if the API changes.
// Cross-browser code is described at http://www.sitepoint.com/use-html5-full-screen-api/

// jslint directive
/*jslint browser: true, white: true*/

(function () {
    'use strict';
    var fullScreen;

    function isFullScreenAvailable() {
        return document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled;
    }

    function isFullScreenActive() {
        return !!(document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement);
    }

    function makeElementFullScreen(elem) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }

    function cancelFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    fullScreen = {
        isFullScreenAvailable: isFullScreenAvailable,
        isFullScreenActive: isFullScreenActive,
        makeElementFullScreen: makeElementFullScreen,
        cancelFullScreen: cancelFullScreen
    };

    // Attach the FullScreen object to the window object to make it globally available.
    window.FullScreen = fullScreen;
} ());