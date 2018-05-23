const Operador = require('./enum/operador');
const Persist = require('./enum/persist');
const FieldsConsulta = require('./fieldsConsulta');

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
    let fieldsConsulta = new FieldsConsulta(this);
    return fieldsConsulta.init(tableName, fields);
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

  getCamposNomeSelect(fields, fieldsConsulta) {
    let camposNome = [];

    if (fieldsConsulta) {
      for (let info of fieldsConsulta) {
        let values = fields.get(info.tabela.toUpperCase());
        if (values) {
          for (let cp of info.campos) {
            let campo = values.get(cp);
            if (!campo) {
              throw Error(`Campo não localizado: ${cp}!`);
            }

            if (campo.alias) {
              camposNome.push(campo.name.toUpperCase() + ' AS ' + campo.alias.toUpperCase());
            } else {
              camposNome.push(campo.name.toUpperCase());
            }
          }
        }
      }

      if (!camposNome.length) {
        throw Error('Não encontrada nenhuma tabela para consulta!');
      }

      return camposNome.join(', ');
    }

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
    if (!criterios || !criterios.length) {
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

  prepararCriterioSQL(tableNameDefault, criterios) {
    if (!criterios) {
      return undefined;
    }

    let consulta = [];
    let params = [];

    for (let campoConsulta of criterios) {
      let tableName = campoConsulta.tabela ? campoConsulta.tabela : tableNameDefault;
      let campo = (tableName + '.' + campoConsulta.campo).toUpperCase();

      switch (campoConsulta.operador) {
        case Operador.CONTEM:
          consulta.push(`${campo} LIKE ? ${campoConsulta.comparador}`);
          break;
        case Operador.INICIA_COM:
          consulta.push(`${campo} LIKE ? ${campoConsulta.comparador}`);
          break;
        case Operador.INTERVALO:
          consulta.push(`${campo} BETWEEN ? AND ? ${campoConsulta.comparador}`);
          break;
        default:
          consulta.push(`${campo} ${campoConsulta.operador} ? ${campoConsulta.comparador}`);
      }

      if (campoConsulta.operador === Operador.CONTEM) {
        params.push('%' + campoConsulta.valor + '%');
      } else if (campoConsulta.operador === Operador.INICIA_COM) {
        params.push(campoConsulta.valor + '%');
      } else {
        params.push(campoConsulta.valor);
      }
      if (campoConsulta.operador === Operador.INTERVALO) {
        params.push(campoConsulta.valor2);
      }
    }

    let criterio = consulta.join(' ');
    criterio = criterio.substring(0, criterio.length - 3);
    return { consulta: criterio, params: params };
  },


  prepararOrderBy(tableNameDefault, orderBy, fields) {
    if (!orderBy) {
      return undefined;
    }

    let order = [];

    for (let campoOrder of orderBy) {
      let s = campoOrder.split('.');
      let tableName = s.length === 2 ? s[0].toUpperCase() : tableNameDefault;
      let campoName = s.length === 2 ? s[1] : campoOrder;
      let campo = this.getCampo(tableName, campoName, fields);
      if (!campo) {
        throw Error(`O campo ${campoName} na tabela ${tableName} não foi localizado!`);
      }

      order.push(campo.name.toUpperCase());
    }

    return order.join(', ');
  },

  getCampo(tabela, name, fields) {
    let campos = fields.get(tabela);
    return campos.get(name);
  }

}