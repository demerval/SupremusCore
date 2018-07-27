const Types = require('../../enum/types');
const Persist = require('../../enum/persist');

module.exports = {

  string(tableName, fieldName, alias) {
    return {
      tableName: tableName,
      alias: alias,
      name: fieldName,
      type: Types.STRING,
      persist: Persist.NUNCA
    }
  }

}