const Types = require('../../enum/types');
const Persist = require('../../enum/persist');
const setStringValue = require('./functions/setString');
const setIntegerValue = require('./functions/setInteger');

module.exports = {

  string(tableName, fieldName, alias) {
    return {
      tableName: tableName,
      alias: alias,
      name: fieldName,
      type: Types.STRING,
      persist: Persist.NUNCA,
      setValue: setStringValue
    }
  },

  integer(tableName, fieldName, alias) {
    return {
      tableName: tableName,
      alias: alias,
      name: fieldName,
      type: Types.INTEGER,
      persist: Persist.NUNCA,
      setValue: setIntegerValue
    }
  }

}