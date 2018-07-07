const Types = require('../../enum/types');
const Persist = require('../../enum/persist');

module.exports = {

  integer(fieldName, alias, functionName) {
    return {
      name: fieldName,
      alias: alias,
      functionName: functionName,
      type: Types.INTEGER,
      persist: Persist.NUNCA
    }
  },

  decimal(fieldName, alias, functionName) {
    return {
      name: fieldName,
      alias: alias,
      functionName: functionName,
      type: Types.DECIMAL,
      persist: Persist.NUNCA
    }
  }

}