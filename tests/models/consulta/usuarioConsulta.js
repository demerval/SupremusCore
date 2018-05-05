const { Fields } = require(__basedir + '/index');

const campos = new Map();
campos.set('usuarioId', Fields.id.idIntegerAutoIncrement('ID'));
campos.set('usuarioNome', Fields.string.stringRequiredUnique('NOME'));
campos.set('usuarioDataCad', Fields.date.dateRegister('DATA_CADASTRO'));

const config = {
  nome: 'Usuario',
  campos: campos
}

module.exports = config;