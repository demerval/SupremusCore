const path = require('path');
global.__basedir = path.resolve(__dirname, '../');

const { TabelaConsulta, AND, OR, CONTEM, MAIOR_IGUAL } = require(__basedir + '/index');
const UsuarioModel = require('./models/usuarioModel');

const usuarioConfig = require('./models/consulta/usuarioConsulta');

async function consultar() {

  const criterio = [
    { dataCadastro: ['2018-05-01', '2018-05-05'] },
    { id: 1, OR },
    { 'clientes.nome': 'deni', CONTEM }
  ];

  const usuario = new TabelaConsulta(usuarioConfig);

  console.log('*** Consulta Paginada ***');
  let rowsPag = await usuario.consultaPaginada(5, 0, criterio);
  console.log(rowsPag);

  console.log();
  console.log('*** Consultar por id ***');
  let rows = await usuario.consultar({ id: 1 });
  console.log(rows);
}

async function consultarUsuarioPorId() {
  let usuario = new UsuarioModel();
  let rows = await usuario.consultarPorId(1);
  console.log(rows);
}

async function consultarUsuario() {
  let usuario = new UsuarioModel();
  let rows = await usuario.consultar({ id: 1 });
  console.log(rows);
}

async function novoUsuario() {
  let dados = {
    nome: "Demerval",
  }

  let usuario = new UsuarioModel();
  await usuario.salvar(dados, UsuarioModel.Status.INSERT);
  console.log(usuario.getItem());
}

//consultar();
//consultarUsuarioPorId();
//consultarUsuario();
novoUsuario();