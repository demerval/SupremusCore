const Types = require('../../enum/types');
const setDefault = require('./functions/setDefault');

module.exports = {

  boolean(fieldName, alias) {
    return {
      name: fieldName,
      alias: alias,
      type: Types.BOOLEAN,
      defaultValue: false,
      setValue: setDefault
    }
  }

}