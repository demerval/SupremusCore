const Types = require('../../enum/types');

module.exports = {

  integer(fieldName, foreignKey) {
    return {
      name: fieldName,
      type: Types.INTEGER,
      required: true,
      defaultValue: 0,
      foreignKey: foreignKey
    }
  },

  string(fieldName, tamanho = 10, foreignKey) {
    return {
      name: fieldName,
      type: Types.STRING,
      required: true,
      maxLength: tamanho,
      foreignKey: foreignKey
    }
  }

}