const Types = require('../../enum/types');
const setValueSenha = require('./functions/setSenha');

module.exports = {

  senha(fieldName = 'password') {
    return {
      name: fieldName,
      type: Types.STRING,
      required: true,
      minLength: 4,
      maxLength: 60,
      noneCase: true,
      noSelect: true,
      setValue: setValueSenha
    }
  }

}