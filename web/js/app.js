/* Application Sripts */
$(function () {
    'use strict';

    // array of strings for autocomplete
    var subjectAutocomplete = [];
    var titleAutocomplete = [];
    // Initialize the IDB
    var db = new Dexie("OnTrack");
    var t = $('#taskTable')
        .DataTable({
            data: [],
            columns: [{
                data: 'id',
                title: "Id"
            }, {
                data: 'subject',
                title: "Subject"
            }, {
                data: 'title',
                title: "Title"
            }, {
                data: 'dueDate',
                title: "Due Date"
            }, {
                data: 'completed',
                title: "Completed"
            }, {
                data: 'notify',
                title: "Notify Me"
            }]
        });
    var isEditing = false;
    var currentTask = new Task();

    main();

    function main() {
        db.version(3).stores({
            // subject (string), title (string), dueDate (string),
            // completed (bool), notify (bool)
            task: '++id,subject,title,dueDate,completed,notify,notified',
            settings: 'label,value'
        });
        // open database for storing tasks
        db.open().then(initTasks);

        $('#dueDatePicker').datetimepicker();
        $('#editTask-Btn').hide();

        // setup click handler for add task button
        $('#addTask-Btn')
            .click(function () {
                // prevent Fields from being blank
                if ($.trim($('#subject').val()) === "" || $.trim($('#title').val()) === "" ||
                    $.trim($('#dueDate').val()) === "") {
                    // show toast notification warning when user doesn't fill all text fields
                    $('.notifications.top-right')
                        .notify({
                            type: "warning",
                            message: {
                                text: "You left some fields blank when trying to add a task. "
                            }
                        })
                        .show();
                    return;
                }

                var task = new Task(null, $('#subject').val(), $('#title').val(), $('#dueDate').val(),
                    $('#completed').prop('checked'), $('#notify').prop('checked'));
                addTask(task);
            });

        // click handler for saving edited task
        $('#editTask-Btn')
            .click(function () {
                var task = new Task(currentTask.id, $('#subject').val(), $('#title').val(), $('#dueDate').val(),
                    $('#completed').prop('checked'), $('#notify').prop('checked'));

                if ($.trim($('#subject').val()) === "" || $.trim($('#title').val()) === "" || $.trim($('#dueDate').val()) === "") {
                    // show toast notification warning when user doesn't fill all text fields
                    $('.notifications.top-right')
                        .notify({
                            type: "warning",
                            message: {
                                text: "You left some fields blank when trying to edit a task. "
                            }
                        })
                        .show();
                    return;
                }

                /* returns boolean whether the db was successfully updated or not */
                editTask(task).then(function (result) {
                    if (result) {
                        // switch the buttons since we are now adding a task.
                        $('#taskPanelTitle')
                            .animate({
                                    'opacity': 0
                                }, 500,
                                function () {
                                    $(this).text('Add Task');
                                })
                            .animate({
                                "opacity": 1
                            }, 500);

                        $('#addTask-Btn').show();
                        $('#editTask-Btn').hide();
                        clearFields();
                        isEditing = false;
                    } else {
                        // error updating task
                        $('.notifications.top-right')
                            .notify({
                                type: "warning",
                                message: {
                                    text: "There was an error updating your currently selected task."
                                }
                            })
                            .show();
                    }
                });
            });

        // click handler for when a row in table is selected
        $('#taskTable tbody')
            .on('click', 'tr', function () {
                // do not allow selecting another row while a row is being edited.
                if (isEditing) {
                    return;
                }

                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    t.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            });

        // click handler for deleting task
        $('#deleteItemBtn')
            .click(function () {
                if (typeof(t.row('.selected').data()) == "undefined") {
                    return false;
                }

                var itemId = Number(t.row('.selected').data().id);
                deleteTask(itemId);
            });

        // check every second to see if tasks are overdue
        setInterval(checkDeadlines, 1000);
    }

    function initTasks() {
        var subjectAutocomplete = [];
        var titleAutocomplete = [];
        db.task.orderBy("id")
            .each(function (tasks) {
                addTaskToTable(tasks);
            })
            .then(function () {
                $.material.init();
            });
        clearFields();
    }

    function addTaskToTable(task) {
        // Add all tasks to table
        var complete = (task.completed) ? 'Yes' : 'No';
        var notify = (task.notify) ? 'Yes' : 'No';

        task.completed = complete;
        task.notify = notify;

        $('#subject').typeahead('destroy');
        subjectAutocomplete.push(task.subject);
        $('#subject').typeahead({
            source: subjectAutocomplete
        });

        $('#title').typeahead('destroy');
        titleAutocomplete.push(task.title);
        $('#title').typeahead({
            source: titleAutocomplete
        });

        t.row.add(task).draw();

        $.material.init();
    }

    /*
     * @param task (containing information to be added to the DB) | @type object
     */
    function addTask(task) {
        db.task.add({
            subject: task.subject,
            title: task.title,
            dueDate: task.dueDate,
            completed: task.completed,
            notify: task.notify,
            notified: false
        })
            .catch(function (e) {
                console.log("ERROR: " + e);

            })
            .then(function (id) {
                task.id = id;
                addTaskToTable(task);
                clearFields();
            });
    }

    function editTask(task) {
        var deferred = new $.Deferred();

        // set task to not have been already notified since we are editing it.
        task.notified = false;

        db.transaction('rw', db.task, function () {
            return db.task.update(Number(task.id), task)
                .then(function (updated) {
                    if (updated) {
                        /* Update data in table row */
                        task.completed = (task.completed) ? "Yes" : "No";
                        task.notify = (task.notify) ? "Yes" : "No";
                        t.row('.selected').data(task).draw();
                        deferred.resolve(true);
                    } else {
                        deferred.resolve(false);
                    }
                });
        });

        return deferred.promise();
    }

    function deleteTask(id) {
        db.task.delete(Number(id))
            .then(function () {
                t.row('.selected').remove().draw();
                // Reset Add/Edit Task Area back to original state in case the user decided to delete a task while it
                // was selected for editing.
                clearFields();
                $('#editTask-Btn').hide();
                $('#addTask-Btn').show();
                isEditing = false;
            });
    }

    function clearFields() {
        $('#taskPanelTitle').text('Add Task');
        $('#subject').val('');
        $('#title').val('');
        $('#dueDate').val('');
        $('#completed').prop('checked', '');
        $('#notify').prop('checked', 'checked');
    }

    $('#editItemBtn')
        .click(function () {
            if (typeof(t.row('.selected').data()) == "undefined") {
                return false;
            }
            // make sure user cannot select or unselect the current row being edited until they have saved it.
            isEditing = true;

            var itemId = Number(t.row('.selected').data().id);
            // switch the buttons since we are now editing a task.
            $('#taskPanelTitle')
                .animate({
                        'opacity': 0
                    }, 500,
                    function () {
                        $(this).text('Editing Task');
                    })
                .animate({
                    "opacity": 1
                }, 500);

            $('#addTask-Btn').hide();
            $('#editTask-Btn').show();

            var taskData = t.row('.selected').data();
            currentTask = taskData;
            // console.log(currentTask);
            setTaskEntryData(taskData.subject, taskData.title, taskData.dueDate, taskData.completed, taskData.notify);
        });

    function setTaskEntryData(subject, title, dueDate, completed, notify) {
        $('#subject').val(subject);
        $('#title').val(title);
        $('#dueDate').val(dueDate);
        $('#completed').prop('checked', (completed.toLowerCase() === "yes") ? true : false);
        $('#notify').prop('checked', (notify.toLowerCase() === "yes") ? true : false);
    }

    function checkDeadlines() {
        var now = new Date();

        var minuteCheck = now.getMinutes();
        // convert hours to 12 hour based
        var hourCheck = now.getHours() % 12;
        hourCheck = hourCheck ? hourCheck : 12;

        var ampm = now.getHours() >= 12 ? 'PM' : 'AM';
        // var dayCheck = now.getDate();
        // var monthCheck = now.getMonth();
        // var yearCheck = now.getFullYear();

        // console.log(now.toLocaleDateString() + " " + hourCheck + ":" + minuteCheck + " " + ampm);
        var currentDateTimeStr = now.toLocaleDateString() + " " + hourCheck + ":" + minuteCheck + " " + ampm;

        db.task.orderBy("dueDate").toArray()
            .then(function (tasks) {
                $.each(tasks, function (index, task) {
                    var dueDate = new Date(task.dueDate);
                    var hour = dueDate.getHours() % 12;
                    hour = hour ? hour : 12;
                    var dueDateAMPM = dueDate.getHours() >= 12 ? 'PM' : 'AM';
                    var dueDateStr = dueDate.toLocaleDateString() + " " + hour + ":" + dueDate.getMinutes() + " " + dueDateAMPM;

                    // if date/time and notifications are on, show overdue notification
                    if (dueDateStr === currentDateTimeStr && task.notify && !task.notified && !task.completed) {
                        createNotification(task.title);
                        task.notified = true;

                        db.transaction('rw', db.task, function () {
                            db.task.update(Number(task.id), task);
                        }).catch(function (error) {
                            console.error(error);
                        });
                    }
                });
            });
    }
});
