const Operador = require('./enum/operador');
const Persist = require('./enum/persist');
const FieldsConsulta = require('./fieldsConsulta');

module.exports = {

  initFields(tableName, fields) {
    let campos = new Map();

    campos.set(tableName, fields);

    for (let [key, values] of campos) {
      for (let campo of values.values()) {
        this.initField(tableName, campo);
      }
    }

    return campos;
  },

  initFieldsConsulta(tableName, fields) {
    let fieldsConsulta = new FieldsConsulta(this);
    return fieldsConsulta.init(tableName, fields);
  },

  initField(tableName, field) {
    let name = field.name.toUpperCase();
    if (field.tableName || field.sql) {
      field.name = name;
    } else {
      field.name = tableName.toUpperCase() + '.' + name;
    }
    if (!field.persist) {
      field.persist = Persist.SEMPRE;
    }

    return field;
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

  getChavePrimariaId(fields, tableName) {

    if (tableName) {
      let campos = fields.get(tableName);
      for (let [key, campo] of campos) {
        if (campo.primaryKey) {
          return { key, campo };
        }
      }

      return undefined;
    }

    for (let values of fields.values()) {
      for (let [key, campo] of values.values()) {
        if (campo.primaryKey) {
          return { key, campo };
        }
      }
    }

    return undefined;
  },

  getCamposNomeSelect(fields, fieldsConsulta) {
    let camposNome = [];
    let camposGroup = [];
    let groupBy = false;

    if (fieldsConsulta) {
      for (let info of fieldsConsulta) {
        let values = fields.get(info.tabela.toUpperCase());
        if (values) {
          for (let cp of info.campos) {
            let campo = values.get(cp);
            if (!campo) {
              throw Error(`Campo não localizado: ${cp}!`);
            }

            let campoName = undefined;
            if (campo.functionName) {
              const functionName = campo.functionName.toUpperCase();
              if (functionName !== 'SUM' && functionName !== 'COUNT') {
                throw Error(`Função não suportada: ${functionName}`);
              }
              let nome = campo.tableName
                ? `${campo.tableName.toUpperCase()}.${campo.name.toUpperCase()}`
                : campo.name.toUpperCase();
              campoName = `${functionName}(${nome}) AS ${campo.alias}`;
              groupBy = true;
            } else if (campo.sql) {
              campoName = `(${campo.sql}) AS ${campo.name.toUpperCase()}`;
            } else if (campo.tableName) {
              campoName = `${campo.tableName.toUpperCase()}.${campo.name.toUpperCase()}`;
              if (campo.alias) {
                campoName += ` AS ${campo.alias.toUpperCase()}`;
              }
            } else if (campo.alias) {
              campoName = campo.name.toUpperCase() + ' AS ' + campo.alias.toUpperCase();
            } else {
              campoName = campo.name.toUpperCase();
            }

            if (campoName === undefined) {
              throw Error(`Campo não localizado: ${campo.name}`);
            }

            camposNome.push(campoName);
            if (campo.functionName === undefined) {
              camposGroup.push(campoName);
            }
          }
        }
      }

      if (!camposNome.length) {
        throw Error('Não encontrada nenhuma tabela para consulta!');
      }

      if (groupBy) {
        return { campos: camposNome.join(', '), groupBy: camposGroup.join(', ') };
      }

      return { campos: camposNome.join(', ') };
    }

    for (let values of fields.values()) {
      for (let campo of values.values()) {
        if (campo.noSelect === undefined || !campo.noSelect) {
          let campoName = undefined;

          if (campo.functionName) {
            const functionName = campo.functionName.toUpperCase();
            if (functionName !== 'SUM' && functionName !== 'COUNT') {
              throw Error(`Função não suportada: ${functionName}`);
            }
            let nome = campo.tableName
              ? `${campo.tableName.toUpperCase()}.${campo.name.toUpperCase()}`
              : campo.name.toUpperCase();
            campoName = `${functionName}(${nome}) AS ${campo.alias}`;
            groupBy = true;
          } else if (campo.sql) {
            campoName = `(${campo.sql}) AS ${campo.name.toUpperCase()}`;
          } else if (campo.tableName) {
            campoName = `${campo.tableName.toUpperCase()}.${campo.name.toUpperCase()}`;
          } else if (campo.alias) {
            campoName = campo.name.toUpperCase() + ' AS ' + campo.alias.toUpperCase();
          } else {
            campoName = campo.name.toUpperCase();
          }

          if (campoName === undefined) {
            throw Error(`Campo não localizado: ${campo.name}`);
          }

          camposNome.push(campoName);
          if (campo.functionName === undefined) {
            camposGroup.push(campoName);
          }
        }
      }
    }

    if (!camposNome.length) {
      throw Error('Não encontrada nenhuma tabela para consulta!');
    }

    if (groupBy) {
      return { campos: camposNome.join(', '), groupBy: camposGroup.join(', ') };
    }

    return { campos: camposNome.join(', ') };
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

      if (campo.tableName) {
        order.push(campo.tableName.toUpperCase() + '.' + campo.name.toUpperCase());
      } else {
        order.push(campo.name.toUpperCase());
      }
    }

    return order.join(', ');
  },

  getCampo(tabela, name, fields) {
    let campos = fields.get(tabela);
    return campos.get(name);
  }

}