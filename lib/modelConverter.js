const moment = require('moment');
const Types = require('./enum/types');

module.exports = (rows, fields) => {
  let listModel = [];

  rows.forEach(row => {
    let dados = {};

    for (let [keyTable, campos] of fields) {
      //let table = [];

      let item = {};
      for (let [key, campo] of campos) {
        let name = campo.alias ? campo.alias : campo.name;
        let value = row[name.toUpperCase()];
        if (campo.type === Types.DATE) {
          if (value === null) {
            item[key] = '';
          } else {
            item[key] = moment(value).format('DD/MM/YYYY');
          }
        } else {
          item[key] = value;
        }
      }

      dados[keyTable.toLowerCase()] = item;
    }

    listModel.push(dados);
  });


  return listModel;
}