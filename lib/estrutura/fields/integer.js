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
  },

  integerRequiredUnique(fieldName, alias) {
    return {
      name: fieldName,
      alias: alias,
      type: Types.INTEGER,
      required: true,
      unique: true,
      setValue: setIntegerValue
    }
  },

  bigInt(fieldName, alias) {
    return {
      name: fieldName,
      alias: alias,
      type: Types.BIG_INT,
      defaultValue: 0,
      setValue: setIntegerValue
    }
  },

  bigIntRequired(fieldName, alias) {
    return {
      name: fieldName,
      alias: alias,
      type: Types.BIG_INT,
      required: true,
      setValue: setIntegerValue
    }
  },

  smallInt(fieldName, alias) {
    return {
      name: fieldName,
      alias: alias,
      type: Types.SMALL_INT,
      defaultValue: 0,
      setValue: setIntegerValue
    }
  },

  smallIntRequired(fieldName, alias) {
    return {
      name: fieldName,
      alias: alias,
      type: Types.SMALL_INT,
      required: true,
      setValue: setIntegerValue
    }
  }

}