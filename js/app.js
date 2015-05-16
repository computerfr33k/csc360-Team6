/* Application Sripts */

$(function () {
  'use strict';
  main();

  function main() {
    // Initialize Material Bootstrap Theme
    $.material.init();
    initUI();
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
