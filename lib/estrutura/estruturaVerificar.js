'use strict';

const fs = require('fs');
const path = require('path');
const FirebirdEstruturaFactory = require('./estruturaFactory');
const DAO = require('../DAO');
const cnnFB = require('../connectionFactory');

const dao = new DAO(cnnFB);

module.exports = {

  async verificarEstruturaModels(dirModels) {
    await dao.openConexao(false);
    let Model = require('./models/estruturaVersaoModel');
    await executarVerificacao(new Model());
    console.log(__basedir);
    let files = fs.readdirSync(__basedir + '/' + dirModels);
    let models = [];

    for (let it in files) {
      let file = files[it];
      if (file.indexOf('.js') > -1) {
        let fileName = path.basename(file, '.js');
        let Model = require(__basedir + '/' + dirModels + '/' + fileName);
        models.push(await executarVerificacao(new Model()));
      }
    }

    await Promise.all(models);
    dao.closeConexao();
    return true;
  }

}

async function executarVerificacao(model) {
  let fef = new FirebirdEstruturaFactory(model);
  if (!fef.isVerificar()) {
    return;
  }
  fef.criarSql();

  let existe = await tabelaExiste(fef.getNomeTabela());
  if (existe) {
    return verificarTabela(fef);
  } else {
    return criarTabela(fef);
  }
}

function tabelaExiste(tabela) {
  let sql = "SELECT RDB$RELATION_NAME FROM RDB$RELATIONS "
    + "WHERE RDB$RELATION_NAME = '" + tabela + "'";

  return dao.executarSql(sql)
    .then(rows => {
      return (rows.length === 1);
    });
}
//-----------------------------------------------------------------------------
// Verificar Tabela
//-----------------------------------------------------------------------------
async function verificarTabela(fef) {
  let sql = "SELECT VERSAO FROM ESTRUTURA_VERSAO WHERE "
    + "TABELA = '" + fef.getNomeTabela() + "';"

  let rows = await dao.executarSql(sql);
  if (rows.length === 0) {
    let existe = await tabelaExiste(fef.getNomeTabela());
    if (!existe) {
      return criarTabela(fef);
    }

    await ajustarTabela(fef);
    return atualizarVersaoTabela(fef);
  }

  if (fef.getVersao() <= rows[0].VERSAO) {
    return 'ATUALIZADO';
  }

  await ajustarTabela(fef);
  return atualizarVersaoTabela(fef);
}
//-----------------------------------------------------------------------------
// Criar Tabela
//-----------------------------------------------------------------------------
async function criarTabela(fef) {
  await dao.executarSql(fef.getSqlCriarTabela());
  if (fef.getSqlCriarPrimaryKey()) {
    await criarChavePrimaria(fef.getSqlCriarPrimaryKey(), fef.getNomeTabela());
  }
  if (fef.getSqlCriarGenerator()) {
    await criarGerador(fef.getSqlCriarGenerator(), fef.getNomeGerador());
  }

  return atualizarVersaoTabela(fef);
}
//-----------------------------------------------------------------------------
// Chave Primaria
//-----------------------------------------------------------------------------
async function criarChavePrimaria(sql, tabela) {
  let existe = await chavePrimariaExiste(tabela);
  if (existe) {
    return;
  }

  return dao.executarSql(sql);
}

async function chavePrimariaExiste(tabela) {
  let sql = "SELECT RDB$FIELD_NAME FROM RDB$RELATION_CONSTRAINTS C, RDB$INDEX_SEGMENTS S WHERE "
    + "C.RDB$CONSTRAINT_TYPE = 'PRIMARY KEY' AND S.RDB$INDEX_NAME = C.RDB$INDEX_NAME "
    + "AND RDB$RELATION_NAME = '" + tabela.toUpperCase() + "';";

  let rows = await dao.executarSql(sql);
  return (rows.length === 1);
}
//-----------------------------------------------------------------------------
// Gerador
//-----------------------------------------------------------------------------
async function criarGerador(sql, nomeGerador) {
  let existe = await geradorExiste(nomeGerador);
  if (existe) {
    return;
  }

  return dao.executarSql(sql);
}

async function geradorExiste(nomeGerador) {
  let sql = "SELECT RDB$GENERATOR_NAME FROM RDB$GENERATORS "
    + "WHERE RDB$GENERATOR_NAME = '" + nomeGerador.toUpperCase() + "';";

  let rows = await dao.executarSql(sql);
  return (rows.length === 1);
}
//-----------------------------------------------------------------------------
// Atualizar Versao da Tabela
//-----------------------------------------------------------------------------
function atualizarVersaoTabela(fef) {
  let sql = "UPDATE OR INSERT INTO ESTRUTURA_VERSAO "
    + "(TABELA, VERSAO) "
    + "VALUES ('" + fef.getNomeTabela() + "', " + fef.getVersao() + ") "
    + "MATCHING (TABELA);";

  return dao.executarSql(sql);
}
//-----------------------------------------------------------------------------
// Ajustar Tabela
//-----------------------------------------------------------------------------
async function ajustarTabela(fef) {
  let promises = [];
  let campos = fef.getCampos();
  for (let it in campos) {
    promises.push(await verificarCampo(fef, campos[it]));
  }

  return Promise.all(promises);
}

async function verificarCampo(fef, campo) {
  let sql = "SELECT RDB$RELATION_NAME, RDB$FIELD_NAME FROM RDB$RELATION_FIELDS "
    + "WHERE RDB$FIELD_NAME = '" + campo.getNome() + "' AND "
    + "RDB$RELATION_NAME = '" + fef.getNomeTabela() + "';";

  let rows = await dao.executarSql(sql);
  if (rows.length === 0) {
    return criarCampo(fef, campo);
  }
  if (campo.getTipo() === 'VARCHAR') {
    return ajustarCampo(fef, campo);
  }

  return true;
}
//-----------------------------------------------------------------------------
// Criar Campo
//-----------------------------------------------------------------------------
async function criarCampo(fef, campo) {
  let tipo = fef.getTipoDB(campo);
  let sql = "ALTER TABLE " + fef.getNomeTabela() + " ADD "
    + campo.name + " " + tipo;
  if (tipo === "VARCHAR") {
    sql += "(" + campo.maxLength + ")";
  }
  if (campo.required || campo.primaryKey) {
    sql += " NOT NULL";
  }
  sql += ";";

  await dao.executarSql(sql);
  if (campo.primaryKey) {
    await criarChavePrimaria(fef.getSqlCriarPrimaryKey(), fef.getNomeTabela());
  }
  if (fef.getNomeGerador()) {
    await criarGerador(fef.getSqlCriarGenerator(), fef.getNomeGerador());
  }

  return true;
}
//-----------------------------------------------------------------------------
// Ajustar Campo
//-----------------------------------------------------------------------------
async function ajustarCampo(fef, campo) {
  let ajustar = await verificarTamanhoCampo(fef.getNomeTabela(), campo.getNome(), campo.getMax());
  if (ajustar) {
    let sql = "ALTER TABLE " + fef.getNomeTabela() + " ALTER "
      + campo.name + " TYPE VARCHAR("
      + campo.maxLength + ");";

    await dao.executarSql(sql);
  }

  return true;
}

async function verificarTamanhoCampo(tabela, campo, tamanho) {
  let sql = "SELECT RDB$RELATION_FIELDS.RDB$FIELD_NAME FIELD_NAME, "
    + "RDB$FIELDS.RDB$FIELD_LENGTH FIELD_SIZE "
    + "FROM RDB$RELATION_FIELDS "
    + "JOIN RDB$FIELDS "
    + "ON RDB$FIELDS.RDB$FIELD_NAME = "
    + "RDB$RELATION_FIELDS.RDB$FIELD_SOURCE "
    + "JOIN RDB$TYPES "
    + "ON RDB$FIELDS.RDB$FIELD_TYPE = RDB$TYPES.RDB$TYPE AND "
    + "RDB$TYPES.RDB$FIELD_NAME = 'RDB$FIELD_TYPE' "
    + "WHERE RDB$RELATION_FIELDS.RDB$RELATION_NAME = '" + tabela + "'"
    + "AND RDB$RELATION_FIELDS.RDB$FIELD_NAME = '" + campo + "';";

  let rows = await dao.executarSql(sql);
  if (rows.length === 0) {
    return false;
  }

  return (tamanho > rows[0].FIELD_SIZE);
}