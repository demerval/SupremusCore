const Types = require('../../enum/types');
const Persist = require('../../enum/persist');

module.exports = {

  string(fieldName, sql) {
    return {
      name: fieldName,
      sql: sql,
      type: Types.STRING,
      persist: Persist.NUNCA
    }
  }

}