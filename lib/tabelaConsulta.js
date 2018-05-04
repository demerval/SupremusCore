const DAO = require('./DAO');
const modelConverter = require('./modelConverter');

class TabelaConsulta {

  constructor(config) {
    const _name = config.name;
    const _joins = config.joins;
    const _fields = config.fields;
    const _sql = undefined;
    const _sqlPaginado = undefined;
    const _sqlPaginadoTotal = undefined;
    const _dao = new DAO(config.cnnDb);
  }

  async consultar(criterio) {
    try {
      let sql = this._sql;
      if (this._joins) {
        sql += ' ' + this._joins.join(' ');
      }

      let result = this._prepararCriterio(criterio);

      if (result) {
        sql += ` WHERE ${result.consulta}`;
      }

      this._dao.openConexao(false);
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
        sql += ' ' + this._joins.join(' ');
        sqlTotal += ' ' + this._joins.join(' ');
      }

      let result = this._prepararCriterio(criterio);

      if (result) {
        sql += ` WHERE ${result.consulta}`;
        sqlTotal += ` WHERE ${result.consulta}`;
      }

      this._dao.openConexao(false);
      let rows = await this._dao.executarSql(sql, result === undefined ? undefined : result.params);
      if (rows.length > 0) {
        let rowsT = await this.executarSql(sqlTotal, result === undefined ? undefined : result.params);
        totalReg = parseInt(rowsT[0].COUNT, 0);
      }

      return { totalReg: totalReg, data: modelConverter(rows, this._fields) };
    } catch (error) {
      throw Error(error);
    } finally {
      this._dao.closeConexao();
    }
  }

  _prepararCriterio(criterio) {
    if (!criterio) {
      return undefined;
    }

    let consulta = [];
    let params = [];

    Object.getOwnPropertyNames(criterio).forEach(name => {
      let campo = this.getCampo(name);
      if (!campo) {
        throw Error(`O campo ${name} não foi localizado!`);
      }
      consulta.push(`${campo.name.toUpperCase()} = ?`);
      params.push(await campo.setValue(campo, criterio[name]));
    });

    return { consulta: consulta.join(' AND '), params: params };
  }

  getCampo(nome) {
    return this._fields.get(nome);
  }

}

module.exports = TabelaConsulta;