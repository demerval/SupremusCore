const { Tabela } = require(__basedir + '/index');
const usuarioConfig = require('./consulta/usuarioConsulta');

class UsuarioModel extends Tabela {

  constructor() {
    super(usuarioConfig);
  }

}

module.exports = UsuarioModel;