/* Application Sripts */

$(function () {
  'use strict';
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
    
    var options = {
      valueNames: ['subject', 'title', 'dueDate', 'completed', 'notify']
    };
    
    var taskList = new List('tasks', options);
    
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
    });
  }

  function editTask(task) {

  }

  function deleteTask(task) {

  }
});
