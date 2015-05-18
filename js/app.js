/* Application Sripts */

$(function () {
  'use strict';
  // Initialize the IDB
  var db = new Dexie("tasks");
  db.version(1).stores({
  });

  main();

  function main() {
    // Initialize Material Bootstrap Theme
    $.material.init();
    initUI();

    db.open();
  }
});
