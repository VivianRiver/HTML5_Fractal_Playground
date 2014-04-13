/*
    Provide the "Progress" Javascript object, which is used to display progress to the user as images are drawn.
*/

(function () {
    var progress;
    'use strict';

    progress = {
        showProgress: showProgress,
        setProgress: setProgress,
        hideProgress: hideProgress
    }

    // Attach the progress object to the window to make it globally available.
    window.Progress = progress;

    function showProgress() {
        $('#ProgressDialog').dialog({            
            modal: true,
            title: 'Drawing Image'
        });
    }

    function setProgress(current, max) {
        $('#progress')
            .attr('value', current)
            .attr('max', max)
    }

    function hideProgress() {        
        $('#ProgressDialog').dialog('close');
    }
})();