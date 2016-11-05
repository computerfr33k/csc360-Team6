const elixir = require('laravel-elixir');

elixir((mix) => {
    mix.scripts([
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
        './node_modules/bootstrap-3-typeahead/bootstrap3-typeahead.js',
        './node_modules/bootstrap-material-design/dist/js/material.js',
        './node_modules/bootstrap-material-design/dist/js/ripples.js',
        './node_modules/dexie/dist/dexie.js',
        './node_modules/moment/moment.js',
        './node_modules/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js',
        './node_modules/bootstrap-notify/bootstrap-notify.js',
        './node_modules/datatables.net/js/jquery.dataTables.js',
        './node_modules/datatables.net-bs/js/dataTables.bootstrap.js'
    ], './web/js/all.js');

    mix.styles([
        './node_modules/normalize.css/normalize.css',
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/bootstrap-material-design/dist/css/bootstrap-material-design.css',
        './node_modules/bootstrap-material-design/dist/css/ripples.css',
        './node_modules/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css',
        './node_modules/datatables.net-bs/css/dataTables.bootstrap.css'
    ], './web/css/all.css');

    mix.copy('./node_modules/bootstrap/dist/fonts', './web/fonts');
});