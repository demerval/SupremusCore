const Types = require('../../enum/types');
const setIntegerValue = require('./functions/setInteger');

module.exports = {

  integer(fieldName) {
    return {
      name: fieldName,
      type: Types.INTEGER,
      defaultValue: 0,
      setValue: setIntegerValue
    }
  },

  integerRequired(fieldName) {
    return {
      name: fieldName,
      type: Types.INTEGER,
      required: true,
      setValue: setIntegerValue
    }
  }

}