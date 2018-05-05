const { Fields } = require(__basedir + '/index');

const campos = new Map();
campos.set('clienteNome', Fields.string.string('NOME'));
campos.set('clienteTel', Fields.string.string('TEL1'));

const config = {
  nome: 'Clientes',
  campos: campos
}

module.exports = config;