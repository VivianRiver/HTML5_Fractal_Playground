/*
    Provide the "Progress" Javascript object, which is used to display progress to the user as tasks are completed, such as drawing images.
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

    function showProgress(title, body) {
        $('#divProgressDescription').html(body);
        $('#ProgressDialog').dialog({
            modal: true,
            title: title,
            closeOnEscape: false,
            dialogClass: 'no-close'
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