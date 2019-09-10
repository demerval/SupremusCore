const path = require('path');
global.__basedir = path.resolve(__dirname, '../');

const ClienteModel = require('./models/participanteModel');

async function testeOR() {
  const idEmpresa = 2;
  const criterio = [];
  criterio.push([{ idEmpresa: 0, c: 'OR' }, { idEmpresa }]);
  criterio.push({ cliente: true });

  const fieldsConsulta = [
    { tabela: 'clientes', campos: ['id', 'razao', 'fantasia', 'tel1', 'doc1', 'cliente', 'fornecedor', 'transportadora', 'terceiro', 'representante'] },
  ];

  const clienteModel = new ClienteModel();
  const rows = await clienteModel.consultaPaginada(10, 0, criterio, ['razao'], fieldsConsulta, false);

  console.log(rows);
}

testeOR().then(response => console.log('fim'));