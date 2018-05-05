const path = require('path');
global.__basedir = path.resolve(__dirname, '../');

const { TabelaConsulta, Fields } = require(__basedir + '/index');

const usuarioConfig = require('./models/consulta/usuarioConsulta');
const clienteConfig = require('./models/consulta/clienteConsulta');

usuarioConfig.joins = [
  {
    config: clienteConfig,
    join: 'JOIN CLIENTES ON USUARIO.ID_CLIEN = CLIENTES.ID'
  }
];

const usuario = new TabelaConsulta(usuarioConfig);
usuario.consultaPaginada(5, 0, { usuarioId: 1, usuarioNome: 'deni' })
  .then((rows) => {
    console.log(rows);
  })
  .catch(error => {
    console.log(error);
  })