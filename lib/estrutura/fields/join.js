const Types = require('../../enum/types');
const Persist = require('../../enum/persist');
const setDefault = require('./functions/setDefault');

module.exports = {

  string(tableName, fieldName) {
    return {
      tableName: tableName,
      name: fieldName,
      type: Types.STRING,
      persist: Persist.NUNCA
    }
  }

}