const DAO = require('./DAO');
const GeradorSql = require('./geradorSql');
const tabelaBase = require('./tabelaBase');
const modelConverter = require('./modelConverter');

class TabelaConsulta {

  constructor(config) {
    this._name = config.nome;

    let result = tabelaBase.initFieldsConsulta(this._name.toUpperCase(), config.campos);
    this._fields = result.campos;
    this._joins = result.joins;

    this._dao = new DAO(config.cnnDb);
  }

  async consultar(criterio, orderBy, fieldsConsulta, groupTable = true) {
    try {
      let sqlDados = await GeradorSql.sqlConsulta(this, fieldsConsulta, criterio, orderBy);

      await this._dao.openConexao(false);
      let rows = await this._dao.executarSql(sqlDados.sql, sqlDados.params === undefined ? undefined : sqlDados.params);
      return modelConverter(rows, this._fields, this.onItemCarregado, groupTable);
    } catch (error) {
      throw Error(error);
    } finally {
      this._dao.closeConexao();
    }
  }

  async consultaPaginada(first, skip, criterio, orderBy, fieldsConsulta, groupTable = true) {
    try {
      let totalReg = 0;
      let sqlDados = await GeradorSql.sqlConsultaPaginada(this, fieldsConsulta, criterio, orderBy);
      let consulta = sqlDados.result ? (sqlDados.result.consulta ? sqlDados.result.consulta : undefined) : undefined;
      let params = sqlDados.result ? (sqlDados.result.params ? sqlDados.result.params : undefined) : undefined;
      let sqlTotal = GeradorSql.sqlConsultaPaginadaTotal(this, consulta);

      let valores = [];
      valores.push(first);
      valores.push(first * skip);

      if (params) {
        valores = valores.concat(params);
      }

      await this._dao.openConexao(false);
      let rows = await this._dao.executarSql(sqlDados.sql, valores);
      if (rows.length > 0) {
        let rowsT = await this._dao.executarSql(sqlTotal, params);
        totalReg = parseInt(rowsT[0].COUNT, 0);
      }

      return { totalReg: totalReg, data: modelConverter(rows, this._fields, this.onItemCarregado, groupTable) };
    } catch (error) {
      throw Error(error);
    } finally {
      this._dao.closeConexao();
    }
  }

  async executarSql(sql, params) {
    try {
      await this._dao.openConexao(false);

      return await this._dao.executarSql(sql, params);
    } catch (err) {
      throw Error(err);
    } finally {
      if (this._dao.isConexaoOpen()) {
        this._dao.closeConexao();
      }
    }
  }

  onItemCarregado(item) {
  }
  
  async prepararCriterio(criterios) {
    return await tabelaBase.prepararCriterio(this.getNome(), criterios, this._fields);
  }

  prepararOrderBy(orderBy) {
    return tabelaBase.prepararOrderBy(this.getNome(), orderBy, this._fields);
  }

  getNome() {
    if (this._alias) {
      return this._name.toUpperCase() + ' ' + this._alias.toUpperCase();
    }
    return this._name.toUpperCase();
  }

  getChavePrimaria() {
    return tabelaBase.getChavePrimaria(this._fields);
  }

  getCampo(nome) {
    return this._fields.get(nome);
  }

  getCamposNomeSelect(fieldsConsulta) {
    return tabelaBase.getCamposNomeSelect(this._fields, fieldsConsulta);
  }

  getJoins() {
    return this._joins;
  }

}

module.exports = TabelaConsulta;