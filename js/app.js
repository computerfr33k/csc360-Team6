/* Application Sripts */

$(function () {
  'use strict';
  // Initialize the IDB
  var db = new Dexie("OnTrack");
  var editBtns = $('.edit-item-btn'),
    removeBtns = $('.remove-item-btn');
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
    $('#warning-alert').hide();
    $('#editTask-Btn').hide();

    // setup click handler for add task button
    $('#addTask-Btn').click(function () {
      // prevent Fields from being blank
      if ($.trim($('#subject').val()) === "" || $.trim($('#title').val()) === "" || $.trim($('#dueDate').val()) === "") {
        $('#warning-alert').fadeIn();
        return;
      }
      $('#warning-alert').fadeOut();

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
