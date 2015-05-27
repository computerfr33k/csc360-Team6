/* Application Sripts */

$(function () {
  'use strict';
  // Initialize the IDB
  var db = new Dexie("OnTrack");
  var editBtns = $('.edit-item-btn'),
    removeBtns = $('.remove-item-btn');
  var t = $('#taskTable').DataTable();
  main();

  function main() {
    t.row.add([
      "owbegjb",
      "owbegjb",
      "owbegjb",
      '<div class="checkbox">\
        <label>\
          <input id="notify" type="checkbox" />\
        </label>\
      </div>',
      '<div class="checkbox">\
        <label>\
          <input id="notify" type="checkbox" />\
        </label>\
      </div>',
      '<button id="editTask-Btn" class="btn btn-primary">Edit Task</button>'
    ]).draw();

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

      var task = {
        subject: $('#subject').val(),
        title: $('#title').val(),
        dueDate: $('#dueDate').val(),
        completed: $('#completed').prop('checked'),
        notify: $('#notify').prop('checked')
      };
      addTask(task);
    });

    // click handler for saving edited task
    $('#editTask-Btn').click(function() {
      // switch the buttons since we are now adding a task.
      $('#addTask-Btn').show();
      $('#editTask-Btn').hide();
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
    var complete = (task.completed) ? 'checked' : '';
    var notify = (task.notify) ? 'checked' : '';

    t.row.add([
      task.subject,
      task.title,
      task.dueDate,
      task.completed,
      task.notify,
      ""
    ]).draw();
/*
    $('.list:last').append('<tr><td class="id hide ot-valign">' + task.id + '</td>\
              <td class="subject ot-valign">' + task.subject + '</td>\
              <td class="title ot-valign">' + task.title + '</td>\
              <td class="dueDate ot-valign">\
                ' + task.dueDate + '\
              </td>\
              <td class="completed ot-valign">\
                <div class="checkbox">\
                  <label>\
                    <input type="checkbox" disabled ' + complete + '/>\
                  </label>\
                </div>\
              </td>\
              <td class="notify ot-valign">\
                <div class="checkbox">\
                  <label>\
                    <input type="checkbox" disabled ' + notify + ' />\
                  </label>\
                </div>\
              </td>\
              <td><button class="btn btn-primary edit-item-btn">Edit</button><button class="btn btn-primary remove-item-btn">Delete</button></td></tr>\
      ');
      */

    refreshCallbacks();
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
    db.task.delete(Number(id)).then(function (r) {
      console.log(JSON.stringify(r));
    });
  }

  function clearFields() {
    $('#subject').val('');
    $('#title').val('');
    $('#dueDate').val('');
    $('#completed').prop('checked', '');
    $('#notify').prop('checked', 'checked');
  }

  function refreshCallbacks() {
    removeBtns = $(removeBtns.selector);
    editBtns = $(editBtns.selector);

    removeBtns.click(function () {
      var itemId = $(this).closest('tr').find('.id').text();
      deleteTask(itemId);

      $(this).closest('tr').remove();
    });

    // Send Existing Data to Add Task inputs (re-using the same UI for both adding and editing).
    editBtns.click(function() {
      // switch the buttons since we are now editing a task.
      $('#addTask-Btn').hide();
      $('#editTask-Btn').show();

      var itemId = Number($(this).closest('tr').find('.id').text());
      console.log(itemId);
    });
  }
});
