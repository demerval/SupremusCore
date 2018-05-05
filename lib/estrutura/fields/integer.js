const Types = require('../../enum/types');
const setIntegerValue = require('./functions/setInteger');

module.exports = {

  integer(fieldName, alias) {
    return {
      name: fieldName,
      alias: alias,
      type: Types.INTEGER,
      defaultValue: 0,
      setValue: setIntegerValue
    }
  },

  integerRequired(fieldName, alias) {
    return {
      name: fieldName,
      alias: alias,
      type: Types.INTEGER,
      required: true,
      setValue: setIntegerValue
    }
  }

}