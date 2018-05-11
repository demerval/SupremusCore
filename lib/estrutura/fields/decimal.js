const Types = require('../../enum/types');
const setDecimalValue = require('./functions/setDecimal');

module.exports = {

  decimal(fieldName, decimal = 2) {
    return {
      name: fieldName,
      type: Types.DECIMAL,
      defaultValue: 0,
      decimalPlaces: decimal,
      setValue: setDecimalValue
    }
  },

  decimalRequired(fieldName, decimal = 2) {
    return {
      name: fieldName,
      type: Types.DECIMAL,
      required: true,
      decimalPlaces: decimal,
      setValue: setDecimalValue
    }
  }

}