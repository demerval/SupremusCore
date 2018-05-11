const Types = require('../../enum/types');
const setDecimalValue = require('./functions/setDecimal');

module.exports = {

  decimal(fieldName, alias, decimal) {
    return {
      name: fieldName,
      alias: alias,
      type: Types.DECIMAL,
      defaultValue: 0,
      decimalPlaces: decimal,
      setValue: setDecimalValue
    }
  },

  decimalRequired(fieldName, alias, decimal) {
    return {
      name: fieldName,
      alias: alias,
      type: Types.DECIMAL,
      required: true,
      decimalPlaces: decimal,
      setValue: setDecimalValue
    }
  }

}