const Types = require('../../enum/types');
const setStringValue = require('./functions/setString');

module.exports = {

    string(fieldName = 'nome', tamanho = 60) {
        return {
            name: fieldName,
            type: Types.STRING,
            maxLength: tamanho,
            setValue: setStringValue
        }
    },

    stringRequired(fieldName = 'nome', tamanho = 60) {
        return {
            name: fieldName,
            type: Types.STRING,
            required: true,
            maxLength: tamanho,
            setValue: setStringValue
        }
    },

    stringRequiredUnique(fieldName = 'nome', tamanho = 60) {
        return {
            name: fieldName,
            type: Types.STRING,
            required: true,
            unique: true,
            maxLength: tamanho,
            setValue: setStringValue
        }
    },

    blob(fieldName) {
        return {
            name: fieldName,
            type: Types.BLOB,
            setValue: setStringValue
        }
    },

    blobRequired(fieldName) {
        return {
            name: fieldName,
            type: Types.BLOB,
            required: true,
            setValue: setStringValue
        }
    },

}