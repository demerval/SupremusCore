const Types = require('../../enum/types');
const Persist = require('../../enum/persist');
const setStringValue = require('./functions/setString');

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
  }

}