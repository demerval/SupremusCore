const Types = require('../../enum/types');
const Persist = require('../../enum/persist');

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