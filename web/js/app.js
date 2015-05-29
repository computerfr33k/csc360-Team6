/* Application Sripts */

$(function () {
  'use strict';
  // Initialize the IDB
  var db = new Dexie("OnTrack");
  var t = $('#taskTable').DataTable({
    data: [],
    columns: [
        { data: 'id', title: "Id" },
        { data: 'subject', title: "Subject" },
        { data: 'title', title: "Title" },
        { data: 'dueDate', title: "Due Date" },
        { data: 'completed', title: "Completed" },
        { data: 'notify', title: "Notify Me" }
    ]
  });
  var isEditing = false;
  var currentTask = new Task();

  main();

  function main() {
    db.version(2).stores({
      // subject (string), title (string), dueDate (string),
      // completed (bool), notify (bool)
      task: 'id++,subject,title,dueDate,completed,notify',
      settings: 'label,value'
    });
    // open database for storing tasks
    db.open().then(function () {
      initTasks();
    });

    $('#dueDatePicker').datetimepicker();
    $('#editTask-Btn').hide();

    // setup click handler for add task button
    $('#addTask-Btn').click(function () {
      // prevent Fields from being blank
      if ($.trim($('#subject').val()) === "" || $.trim($('#title').val()) === "" || $.trim($('#dueDate').val()) === "") {
        // show toast notification warning when user doesn't fill all text fields
        $('.notifications.top-right').notify({
          type: "warning",
          message: {text: "You left some fields blank when trying to add a task. " }
        }).show();
        return;
      }

      var task = new Task(null, $('#subject').val(), $('#title').val(), $('#dueDate').val(), $('#completed').prop('checked'), $('#notify').prop('checked'));
      addTask(task);
    });

    // click handler for saving edited task
    $('#editTask-Btn').click(function() {
      // switch the buttons since we are now adding a task.
      $('#taskPanelTitle').animate({'opacity': 0}, 500, function () {
        $(this).text('Add Task');
      }).animate({"opacity": 1}, 500);

      $('#addTask-Btn').show();
      $('#editTask-Btn').hide();
      clearFields();
      isEditing = false;
    });

    // click handler for when a row in table is selected
    $('#taskTable tbody').on('click', 'tr', function() {
      // do not allow selecting another row while a row is being edited.
      if(isEditing) {
        return;
      }

      if($(this).hasClass('selected')) {
        $(this).removeClass('selected');
      } else {
        t.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
      }
    });

    // click handler for deleting task
    $('#deleteItemBtn').click(function() {
      if(typeof(t.row('.selected').data()) == "undefined") {
        return false;
      }

      var itemId = Number(t.row('.selected').data().id);
      deleteTask(itemId);
    });
  }

  function initTasks() {
    db.task.orderBy("id").each(function (tasks) {
      addTaskToTable(tasks);
    }).then(function () {
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
      notify: task.notify

    }).catch(function (e) {
      console.log("ERROR: " + e);

    }).then(function (id) {
      task.id = id;
      addTaskToTable(task);
      clearFields();
    });
  }

  function editTask(task) {
  }

  function deleteTask(id) {
    db.task.delete(Number(id)).then(function () {
      t.row('.selected').remove().draw();
      // Reset Add/Edit Task Area back to original state in case the user decided to delete a task while it was selected for editing.
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

  $('#editItemBtn').click(function() {
    if(typeof(t.row('.selected').data()) == "undefined") {
      return false;
    }
    // make sure user cannot select or unselect the current row being edited until they have saved it.
    isEditing = true;

    var itemId = Number(t.row('.selected').data().id);
    // switch the buttons since we are now editing a task.
    $('#taskPanelTitle').animate({'opacity': 0}, 500, function () {
      $(this).text('Editing Task');
    }).animate({"opacity": 1}, 500);

    $('#addTask-Btn').hide();
    $('#editTask-Btn').show();

    var taskData = t.row('.selected').data();
    currentTask = taskData;
    console.log(currentTask);
    setTaskEntryData(taskData.subject, taskData.title, taskData.dueDate, taskData.completed, taskData.notify);
  });

  function setTaskEntryData(subject, title, dueDate, completed, notify) {
    $('#subject').val(subject);
    $('#title').val(title);
    $('#dueDate').val(dueDate);
    $('#completed').prop('checked', (completed.toLowerCase() === "yes") ? true : false);
    $('#notify').prop('checked', (notify.toLowerCase() === "yes") ? true : false);
  }
});
