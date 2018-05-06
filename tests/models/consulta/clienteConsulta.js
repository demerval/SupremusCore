const { Fields } = require(__basedir + '/index');

const campos = new Map();
campos.set('id', Fields.id.idIntegerAutoIncrement());
campos.set('nome', Fields.string.string('NOME'));
campos.set('tel1', Fields.string.string('TEL1'));

const config = {
  nome: 'Clientes',
  campos: campos
}

module.exports = config;