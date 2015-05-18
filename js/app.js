/* Application Sripts */

$(function () {
  'use strict';
  var db;
  var DBOpenRequest;

  // create a blank instance of the object that is used to transfer data into the IDB.
  var newItem = [
    {taskSubject: "", taskTitle: "", taskDueDate: "", taskCompleted: "no"}
  ];
  main();

  function main() {
    // Initialize Material Bootstrap Theme
    $.material.init();
    initUI();

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    DBOpenRequest = window.indexedDB.open("toDoList", 1);
  }

  DBOpenRequest.onsuccess = function(event) {
    db = DBOpenRequest.result;
  }
  
  function initUI() {
    if(localStorage.getItem("options") == "undefined" || localStorage.getItem("options") == null) {
      initStorage();
    } else {
      var options = getOptions();
      if(options.showNotifications) {
        $("#notifications").prop("checked", "checked");
      }
    }
    
    $("#notifications").click(function() {
      var options = getOptions();
      options.showNotifications = $("#notifications").prop("checked");
      
      localStorage.setItem("options", JSON.stringify(options));
    });
  }
  
  function getOptions() {
    return JSON.parse(localStorage.getItem("options"));
  }
  
  function saveOptions(options) {
    localStorage.setItem("options", JSON.stringify(options));
  }

  function initStorage() {
    var options = {
      "showNotifications": true
    };
    var tasks = {
      
    };
    
    // LocalStorage can only store key/value as strings
    localStorage.setItem("options", JSON.stringify(options));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
