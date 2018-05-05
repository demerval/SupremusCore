const Types = require('../../enum/types');
const setStringValue = require('./functions/setString');

module.exports = {

    string(fieldName = 'nome', alias, tamanho = 60) {
        return {
            name: fieldName,
            alias: alias,
            type: Types.STRING,
            maxLength: tamanho,
            setValue: setStringValue
        }
    },

    stringRequired(fieldName = 'nome', alias, tamanho = 60) {
        return {
            name: fieldName,
            alias: alias,
            type: Types.STRING,
            required: true,
            maxLength: tamanho,
            setValue: setStringValue
        }
    },

    stringRequiredUnique(fieldName = 'nome', alias, tamanho = 60) {
        return {
            name: fieldName,
            alias: alias,
            type: Types.STRING,
            required: true,
            unique: true,
            maxLength: tamanho,
            setValue: setStringValue
        }
    }

}