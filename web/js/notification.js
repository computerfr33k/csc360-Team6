function createNotification(title) {
    var message = 'HEY! Your task "' + title + '" is now overdue.';

    $('.notifications.top-right').notify({
        type: "info",
        message: {
            text: message
        },
        fadeOut: {
            enabled: false
        }
    }).show();
}
