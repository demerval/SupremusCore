const Types = require('../../enum/types');
const Persist = require('../../enum/persist');
const setStringValue = require('./functions/setString');
const setIntegerValue = require('./functions/setInteger');
const setDateValue = require('./functions/setDate');

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
  },

  date(tableName, fieldName, alias) {
    return {
      tableName: tableName,
      alias: alias,
      name: fieldName,
      type: Types.DATE,
      persist: Persist.NUNCA,
      setValue: setDateValue
    }
  }

}