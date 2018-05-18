const DAO = require('./DAO');
const GeradorSql = require('./geradorSql');
const tabelaBase = require('./tabelaBase');
const CriterioConsulta = require('./criterioConsulta');
const modelConverter = require('./modelConverter');

class TabelaConsulta {

  constructor(config) {
    this._name = config.nome;

    let result = tabelaBase.initFieldsConsulta(this._name.toUpperCase(), config.campos);
    this._fields = result.campos;
    this._joins = result.joins;

    this._sql = GeradorSql.sqlConsulta(this);
    this._sqlPaginado = GeradorSql.sqlConsultaPaginada(this);
    this._sqlPaginadoTotal = GeradorSql.sqlConsultaPaginadaTotal(this);
    this._dao = new DAO(config.cnnDb);
  }

  async consultar(criterio) {
    try {
      let sql = this._sql;
      if (this._joins) {
        for (let join of this._joins.values()) {
          sql += ' ' + join + ' ';
        }
      }

      let criterios = criterio ? CriterioConsulta(criterio) : undefined;
      let result = await tabelaBase.prepararCriterio(this._name.toUpperCase(), criterios, this._fields);

      if (result) {
        sql += ` WHERE ${result.consulta}`;
      }

      await this._dao.openConexao(false);
      let rows = await this._dao.executarSql(sql, result === undefined ? undefined : result.params);
      return modelConverter(rows, this._fields);
    } catch (error) {
      throw Error(error);
    } finally {
      this._dao.closeConexao();
    }
  }

  async consultaPaginada(first, skip, criterio) {
    try {
      let totalReg = 0;
      let sql = this._sqlPaginado;
      let sqlTotal = this._sqlPaginadoTotal;
      if (this._joins) {
        for (let join of this._joins.values()) {
          sql += ' ' + join + ' ';
          sqlTotal += ' ' + join + ' ';
        }
      }

      let criterios = criterio ? CriterioConsulta(criterio) : undefined;
      let result = await tabelaBase.prepararCriterio(this._name.toUpperCase(), criterios, this._fields);
      let valores = [];
      valores.push(first);
      valores.push(skip);

      if (result) {
        sql += ` WHERE ${result.consulta}`;
        sqlTotal += ` WHERE ${result.consulta}`;
        valores = valores.concat(result.params);
      }

      await this._dao.openConexao(false);
      let rows = await this._dao.executarSql(sql, valores);
      if (rows.length > 0) {
        let rowsT = await this._dao.executarSql(sqlTotal, result === undefined ? undefined : result.params);
        totalReg = parseInt(rowsT[0].COUNT, 0);
      }

      return { totalReg: totalReg, data: modelConverter(rows, this._fields) };
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

  getCamposNomeSelect(campos) {
    return tabelaBase.getCamposNomeSelect(this._fields);
  }

}

module.exports = TabelaConsulta;