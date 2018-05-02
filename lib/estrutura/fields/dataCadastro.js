const Types = require('../../enum/types');
const Persist = require('../../enum/persist');
const setValueDate = require('./functions/setDate');

module.exports = {
    name: 'data_cadastro',
    type: Types.DATE,
    defaultValue: new Date(),
    persist: Persist.INCLUSAO,
    setValue: setValueDate
}