const DAO = require('./DAO');
const GeradorSql = require('./geradorSql');
const modelConverter = require('./modelConverter');

class TabelaConsulta {

  constructor(config) {
    this._name = config.nome;
    this._joins = config.joins;
    this._fields = this.initFields(config.campos);

    if (this._joins) {
      for (let join of this._joins) {
        this.initFieldsJoin(join.config.nome, join.config.campos);
      }
    }

    this._sql = GeradorSql.sqlConsulta(this);
    this._sqlPaginado = GeradorSql.sqlConsultaPaginada(this);
    this._sqlPaginadoTotal = GeradorSql.sqlConsultaPaginadaTotal(this);
    this._dao = new DAO(config.cnnDb);
  }

  initFields(campos) {
    let tableName = this.getNome();
    for (let campo of campos.values()) {
      let name = campo.name.toUpperCase();
      campo.name = tableName + '.' + name;
      if (!campo.alias) {
        campo.alias = tableName + '_' + name;
      }
    }

    return campos;
  }

  initFieldsJoin(tableName, campos) {
    for (let [key, campo] of campos) {
      let name = campo.name.toUpperCase();
      campo.name = tableName.toUpperCase() + '.' + name;
      if (!campo.alias) {
        campo.alias = tableName.toUpperCase() + '_' + name;
      }

      this._fields.set(key, campo);
    }
  }

  async consultar(criterio) {
    try {
      let sql = this._sql;
      if (this._joins) {
        for (let join of this._joins) {
          sql += ' ' + join.join + ' ';
        }
      }

      let result = await this._prepararCriterio(criterio);

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
        for (let join of this._joins) {
          sql += ' ' + join.join + ' ';
          sqlTotal += ' ' + join.join + ' ';
        }
      }

      let result = await this._prepararCriterio(criterio);
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

  async _prepararCriterio(criterio) {
    if (!criterio) {
      return undefined;
    }

    let campos = [];
    let consulta = [];
    let params = [];

    Object.getOwnPropertyNames(criterio).forEach(name => {
      let campo = this.getCampo(name);
      if (!campo) {
        throw Error(`O campo ${name} não foi localizado!`);
      }
      campos.push({ name, campo });
    });

    for (let { name, campo } of campos) {
      consulta.push(`${campo.name.toUpperCase()} = ?`);
      params.push(await campo.setValue(campo, criterio[name]));
    }

    return { consulta: consulta.join(' AND '), params: params };
  }

  getNome() {
    if (this._alias) {
      return this._name.toUpperCase() + ' ' + this._alias.toUpperCase();
    }
    return this._name.toUpperCase();
  }

  getChavePrimaria() {
    let chave = undefined;
    for (let campo of this._fields.values()) {
      if (campo.primaryKey) {
        chave = campo;
        break;
      }
    }

    return chave;
  }

  getCampo(nome) {
    return this._fields.get(nome);
  }

  getCamposNomeSelect(campos) {
    let camposNome = [];

    for (let campo of this._fields.values()) {
      if (campo.noSelect === undefined || !campo.noSelect) {
        if (campo.alias) {
          camposNome.push(campo.name.toUpperCase() + ' AS ' + campo.alias.toUpperCase());
        } else {
          camposNome.push(campo.name.toUpperCase());
        }
      }
    }

    return camposNome.join(', ');
  }


}

module.exports = TabelaConsulta;