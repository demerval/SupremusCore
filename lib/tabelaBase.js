const Operador = require('./enum/operador');
const Persist = require('./enum/persist');

module.exports = {

  initFields(tableName, fields) {
    let campos = new Map();

    campos.set(tableName, fields);

    for (let [key, values] of campos) {
      for (let campo of values.values()) {
        let name = campo.name.toUpperCase();
        campo.name = name;
        if (!campo.persist) {
          campo.persist = Persist.SEMPRE;
        }
      }
    }

    return campos;
  },

  initFieldsConsulta(tableName, fields) {
    let campos = new Map();
    let joins = new Map();
    let tablesInfo = [];
    let camposRemover = [];

    campos.set(tableName, fields);

    for (let [key, campo] of fields) {
      if (campo.foreignKey && campo.tableInfo) {
        let tableInfo = campo.tableInfo;
        campos.set(tableInfo.nome.toUpperCase(), tableInfo.campos);
        camposRemover.push(key);
        tablesInfo.push({ key, name: campo.name, tableNameJoin: tableInfo.nome.toUpperCase() });
      }
    }

    for (let key of camposRemover) {
      fields.delete(key);
    }

    for (let [key, values] of campos) {
      for (let campo of values.values()) {
        let name = campo.name.toUpperCase();
        if (name.indexOf('.') === -1) {
          campo.name = key + '.' + name;
          if (!campo.alias) {
            campo.alias = key + '_' + name;
          }
        }
      }
    }

    for (let { key, name, tableNameJoin } of tablesInfo) {
      let join = joins.get(tableNameJoin);
      if (!join) {
        let chavePrimaria = this.getChavePrimaria(campos, tableNameJoin);
        if (!chavePrimaria) {
          throw Error(`Não foi localizada a chave primária da tabela ${tableNameJoin}!`);
        }
        join = `JOIN ${tableNameJoin} ON ${tableName}.${name.toUpperCase()} = ${chavePrimaria.name.toUpperCase()}`;
        joins.set(tableNameJoin, join);
      }
    }

    return { campos, joins };
  },

  getChavePrimaria(fields, tableName) {

    if (tableName) {
      let campos = fields.get(tableName);
      for (let campo of campos.values()) {
        if (campo.primaryKey) {
          return campo;
        }
      }

      return undefined;
    }

    for (let values of fields.values()) {
      for (let campo of values.values()) {
        if (campo.primaryKey) {
          return campo;
        }
      }
    }

    return undefined;
  },

  getCamposNomeSelect(fields) {
    let camposNome = [];

    for (let values of fields.values()) {
      for (let campo of values.values()) {
        if (campo.noSelect === undefined || !campo.noSelect) {
          if (campo.alias) {
            camposNome.push(campo.name.toUpperCase() + ' AS ' + campo.alias.toUpperCase());
          } else {
            camposNome.push(campo.name.toUpperCase());
          }
        }
      }
    }

    return camposNome.join(', ');
  },

  async prepararCriterio(tableNameDefault, criterios, fields) {
    if (!criterios) {
      return undefined;
    }

    let consulta = [];
    let params = [];

    for (let campoConsulta of criterios) {
      let tableName = campoConsulta.tabela ? campoConsulta.tabela.toUpperCase() : tableNameDefault;
      let campo = this.getCampo(tableName, campoConsulta.campo, fields);
      if (!campo) {
        throw Error(`O campo ${campoConsulta.campo} na tabela ${tableName} não foi localizado!`);
      }

      switch (campoConsulta.operador) {
        case Operador.CONTEM:
          consulta.push(`${campo.name.toUpperCase()} LIKE ? ${campoConsulta.comparador}`);
          break;
        case Operador.INICIA_COM:
          consulta.push(`${campo.name.toUpperCase()} LIKE ? ${campoConsulta.comparador}`);
          break;
        case Operador.INTERVALO:
          consulta.push(`${campo.name.toUpperCase()} BETWEEN ? AND ? ${campoConsulta.comparador}`);
          break;
        default:
          consulta.push(`${campo.name.toUpperCase()} ${campoConsulta.operador} ? ${campoConsulta.comparador}`);
      }

      if (campoConsulta.operador === Operador.CONTEM || campoConsulta.operador === Operador.INICIA_COM) {
        params.push(await campo.setValue(campo, campoConsulta.valor, campoConsulta.operador));
      } else {
        params.push(await campo.setValue(campo, campoConsulta.valor));
      }
      if (campoConsulta.operador === Operador.INTERVALO) {
        params.push(await campo.setValue(campo, campoConsulta.valor2));
      }
    }

    let criterio = consulta.join(' ');
    criterio = criterio.substring(0, criterio.length - 3);
    return { consulta: criterio, params: params };
  },

  getCampo(tabela, name, fields) {
    let campos = fields.get(tabela);
    return campos.get(name);
  }

}