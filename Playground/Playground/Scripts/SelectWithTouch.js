// Allow the user to select a region with touch.
// The user is to simultaneously touch the opposite corners of the selected region.
// The user can then zoom in on the selection region by clicking the [Draw] button.
// There is a shortcut where touching with a third finger is equivalent to clicking [Draw]

// directive for JSLint
/*jslint white: true*/
/*global SelectCommon, document*/

(function () {
    'use strict';

    // Given a TouchList object that represents all the touches on the screen,
    // return only the touches that are on the selection canvas
    function getTouchesOnSelectCanvas(touchList) {
        var array = [], // an array to contain the touches we return
            i; // loop counter

        for (i = 0; i < touchList.length; i += 1) {
            if (touchList[i].target.id === 'selection') {
                array.push(touchList[i]);
            }
        }
        return array;
    }

    function selectWithTwoTouches(touch0, touch1) {
        var x0, y0, x1, y1; // the coordinates of the two touches.

        if (touch0.clientX < touch1.clientX) {
            // If the first touch is to the left of the second touch.                
            x0 = touch0.clientX;
            y0 = touch0.clientY;
            x1 = touch1.clientX;
            y1 = touch1.clientY;
        } else {
            // Else the second touch is to the right of the first touch.                
            x0 = touch1.clientX;
            y0 = touch1.clientY;
            x1 = touch0.clientX;
            y1 = touch0.clientY;
        }

        SelectCommon.selectSquare(x0, y0, x1, y1);
    }

    function documentTouched(e) {        
        var canvasTouches; // Touches on the canvas        

        // Cancel default functionality when canvas is touched.
        e.preventDefault();

        // We only care about touches on the canvas.
        // We don't want to process touches on other elements.
        canvasTouches = getTouchesOnSelectCanvas(e.touches);

        if (canvasTouches.length === 2) {
            // If two touches, then select a region between them.
            selectWithTwoTouches(canvasTouches[0], canvasTouches[1]);           
        } else if (canvasTouches.length === 3) {
            // If three touches, zoom in on the newly selected region and redraw.
            // This is a shortcut for clicking the [Draw] button.
            document.getElementById('btnDraw')
                .click();            
        }
    }

    function touchStart(e) {
        documentTouched(e);
    }

    function touchMove(e) {
        documentTouched(e);
    }

    function touchEnd(e) {
    }

    function touchCancel(e) {
    }

    document.ontouchstart = touchStart;
    document.ontouchmove = touchMove;
    document.ontouchend = touchEnd;
    document.ontouchcancel = touchCancel;

    document.oncontextmenu = function (e) {
        /*
        There is an issue with Firefox where the touch input for the selection interferes
        with the default touch functionality in Firefox.
        It appears to be the case that when the document is touched in two places at once,
        Firefox opens the context menu.  Since we don't want the context menu to appear,
        we need to cancel the contextmenu event.
        Firefox does give us the option to tell what the source of the input is:
        When the mozInputSource property of the event is 5, it was triggered by touch.
        We cancel the contextmenu event only when it is triggered by touch.            
        This is not part of the specification, so other browsers should ignore this code.
        */
        if (e.mozInputSource === 5) {
            e.preventDefault();
        }
        //        else {
        //            debugger;
        //            alert(e.mozInputSource);
        //        }
    };
} ());