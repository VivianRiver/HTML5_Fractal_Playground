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

    function showProgress(title, body, showCancelButton, cancelButton_callback) {
        var $btnCancelProgress;
        $btnCancelProgress = $('#btnCancelProgress');

        // Show the "Progress" dialog.
        $('#divProgressDescription').html(body);
        $('#ProgressDialog').dialog({
            modal: true,
            title: title,
            closeOnEscape: false,
            dialogClass: 'no-close'
        });

        // Show or hide the [Cancel] button according to user preference.
        if (showCancelButton) {
            $btnCancelProgress.show();
        } else {
            $btnCancelProgress.hide();
        }

        // If a callback function for the [Cancel] button is passed in, bind it to the button.
        $btnCancelProgress.unbind('click');
        if (cancelButton_callback)
            $btnCancelProgress.bind('click', cancelButton_callback);
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