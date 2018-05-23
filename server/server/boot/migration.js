'use strict';

var argv = require('yargs').argv;

module.exports = function(app, cb) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * https://loopback.io/doc/en/lb3/Working-with-LoopBack-objects.html
   * for more info.
   */

  var mysqlDs = app.dataSources.local;

  if (argv.migration) {
    mysqlDs.automigrate([
      'person'
      //'elector'
    ], function(error) {
      console.log('DB Migration Done');
      process.nextTick(cb);
    });
  } else {
    process.nextTick(cb);
  }
};
