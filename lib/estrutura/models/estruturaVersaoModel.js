const Tabela = require('../../tabela');

const campos = new Map();
campos.set('id', require('../fields/id').idString('tabela', 40));
campos.set('versao', require('../fields/inteiro').integerRequired('versao'));

const config = {
  nome: 'ESTRUTURA_VERSAO',
  versao: 1,
  campos: campos
}

class EstruturaVersaoModel extends Tabela {

  constructor() {
    super(config);
  }

}

module.exports = EstruturaVersaoModel;