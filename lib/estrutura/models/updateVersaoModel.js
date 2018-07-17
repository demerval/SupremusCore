const Tabela = require('../../tabela');
const Fields = require('../fields');

const campos = new Map();
campos.set('id', Fields.id.idInteger('id'));
campos.set('idUpdate', Fields.integer.integer('id_update'));

const config = {
  nome: 'UPDATE_VERSAO',
  versao: 1,
  campos: campos
}

class UpdateVersaoModel extends Tabela {

  constructor() {
    super(config);
  }

}

module.exports = UpdateVersaoModel;