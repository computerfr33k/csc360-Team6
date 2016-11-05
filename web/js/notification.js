function createNotification(title) {
    var message = 'HEY! Your task "' + title + '" is now overdue.';

    $.notify({
        message: message
    }, {
        type: 'info'
    });
}
