/* Application Sripts */

$(function () {
  'use strict';
  var taskList;
  // Initialize the IDB
  var db = new Dexie("OnTrack");
  db.version(1).stores({
    // subject (string), title (string), dueDate (string),
    // completed (bool), notify (bool)
    task: '++id,subject,title,dueDate,completed,notify',
    settings: 'label,value'
  });

  main();

  function main() {
    db.open();

    initTasks();
    
    $('#dueDatePicker').datetimepicker();

    $('#addTask-Btn').click(function () {
      var task = {
        subject: $('#subject').val(),
        title: $('#title').val(),
        dueDate: $('#dueDate').val(),
        completed: $('#completed').prop('checked'),
        notify: $('#notify').prop('checked')
      };

      console.log("Adding Task: " + JSON.stringify(task));
      addTask(task);
      $('#subject').val('');
      $('#title').val('');
      $('dueDate').val('');
      $('#completed').prop('checked', '');
      $('#notify').prop('checked', 'checked');
    });
  }

  function initTasks() {
    db.task.orderBy("id").each(function (tasks) {      
      addTaskToTable(tasks);
    });
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
              <td><button class="btn btn-primary">Edit</button><button class="btn btn-primary">Delete</button></td></tr>\
      ');
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
    });
  }

  function editTask(task) {

  }

  function deleteTask(task) {

  }
});
