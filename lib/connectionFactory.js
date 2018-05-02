const firebird = require('node-firebird');
const config = require(__basedir + '/config/dbConfig')

const options = {};
options.host = config.host;
options.port = config.port;
options.database = config.database;
options.user = config.user;
options.password = config.password;
options.lowercase_keys = config.lowercase_keys; // set to true to lowercase keys 
options.role = config.role;            // default 
options.pageSize = config.pageSize;

module.exports = {

  open(callback) {
    return firebird.attach(options, callback);
  },

  openTransaction(db, callback) {
    db.transaction(firebird.ISOLATION_READ_COMMITED, function (err, transaction) {
      if (err) {
        callback(true);
        return;
      }

      callback(false, transaction);
    });
  }

};