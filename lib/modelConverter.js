const moment = require('moment');
const Types = require('./enum/types');

module.exports = (rows, fields, groupTable = true) => {
  let listModel = [];
  if (fields.size > 1) {
    groupTable = true;
  }

  rows.forEach(row => {
    let dados = {};

    for (let [keyTable, campos] of fields) {
      //let table = [];

      let item = {};
      for (let [key, campo] of campos) {
        let name = campo.alias ? campo.alias : campo.name;
        name = name.toUpperCase();
        if (name.indexOf('.') > -1) {
          name = name.split('.')[1];
        }

        if (row[name] !== undefined) {
          let value = row[name];
          if (campo.type === Types.DATE) {
            if (value === undefined || value === null) {
              item[key] = '';
            } else {
              item[key] = moment(value).format('DD/MM/YYYY');
            }
          } else if (campo.type === Types.BOOLEAN) {
            if (value === undefined || value === null) {
              item[key] = false;
            } else {
              let intValue = parseInt(value, 10);
              item[key] = (intValue === 1);
            }
          } else {
            item[key] = value;
          }
        }
      }

      if (groupTable) {
        dados[keyTable.toLowerCase()] = item;
      } else {
        listModel.push(item);
      }
    }

    if (groupTable) {
      listModel.push(dados);
    }
  });


  return listModel;
}