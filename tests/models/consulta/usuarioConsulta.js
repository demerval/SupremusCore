const { Fields } = require(__basedir + '/index');

const campos = new Map();
campos.set('id', Fields.id.idIntegerAutoIncrement('ID'));
campos.set('nome', Fields.string.stringRequiredUnique('NOME'));
campos.set('dataCadastro', Fields.date.dateRegister('DATA_CADASTRO'));
campos.set('clienteId', Fields.foreignKey.integerRequired('ID_CLIEN', require('./clienteConsulta')));

const config = {
  nome: 'Usuario',
  campos: campos
}

module.exports = config;