const moment = require('moment');

module.exports = (rows, fields) => {
  let listModel = [];

  rows.forEach(row => {
    let item = {};

    for (let [key, campo] of fields) {
      let value = row[campo.name.toUpperCase()];
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

    listModel.push(item);
  });

  return listModel;
}