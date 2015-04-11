/* Application Sripts */

$(function () {
  'use strict';

  if (typeof(localStorage) == 'undefined' ) {
    alert('Your browser does not support HTML5 localStorage. Try upgrading.');
  } else {
    try {
      localStorage.setItem('name', '{"name": "CSC 360 Team 6 Project"}'); //saves to the database, “key”, “value”
    } catch (e) {
      if (e == QUOTA_EXCEEDED_ERR) {
        alert('Quota exceeded!'); //data wasn’t successfully saved due to quota exceed so throw an error
      }
    }
    document.write(jQuery.parseJSON(localStorage.getItem('name')).name); //Hello World!
    localStorage.removeItem('name'); //deletes the matching item from the database
  }
});
