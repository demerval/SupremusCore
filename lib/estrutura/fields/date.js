const Types = require('../../enum/types');
const Persist = require('../../enum/persist');
const setValueDate = require('./functions/setDate');

module.exports = {

    dateDefaultValue(fieldName) {
        return {
            name: fieldName,
            type: Types.DATE,
            defaultValue: new Date(),
            setValue: setValueDate
        }
    },

    dateRegister(fieldName = 'data_cadastro') {
        return {
            name: fieldName,
            type: Types.DATE,
            defaultValue: new Date(),
            persist: Persist.INCLUSAO,
            setValue: setValueDate
        }
    },

    dateRequired(fieldName) {
        return {
            name: fieldName,
            type: Types.DATE,
            required: true,
            setValue: setValueDate
        }
    }

}