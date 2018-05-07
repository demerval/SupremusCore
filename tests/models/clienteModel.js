const { Tabela } = require(__basedir + '/index');
const clienteConfig = require('./consulta/clienteConsulta');

class ClienteModel extends Tabela {

  constructor() {
    super(clienteConfig);
  }

}

module.exports = ClienteModel;