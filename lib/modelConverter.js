const moment = require('moment');
const Types = require('./enum/types');

module.exports = (rows, fields, groupTable = true) => {
  let listModel = [];

  rows.forEach(row => {
    let dados = {};

    for (let [keyTable, campos] of fields) {
      //let table = [];

      let item = {};
      for (let [key, campo] of campos) {
        let name = campo.alias ? campo.alias : campo.name;
        if (row[name]) {
          let value = row[name.toUpperCase()];
          if (campo.type === Types.DATE) {
            if (value === undefined || value === null) {
              item[key] = '';
            } else {
              item[key] = moment(value).format('DD/MM/YYYY');
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