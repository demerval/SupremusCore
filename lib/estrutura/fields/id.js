const Types = require('../../enum/types');
const setIntegerValue = require('./functions/setInteger');
const setStringValue = require('./functions/setString');

module.exports = {

    idIntegerAutoIncrement(fieldName = 'id') {
        return {
            name: fieldName,
            type: Types.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            setValue: setIntegerValue
        }
    },

    idInteger(fieldName = 'id') {
        return {
            name: fieldName,
            type: Types.INTEGER,
            primaryKey: true,
            setValue: setIntegerValue
        }
    },

    idString(fieldName = 'id', tamanho = 10) {
        return {
            name: fieldName,
            type: Types.STRING,
            primaryKey: true,
            maxLength: tamanho,
            setValue: setStringValue
        }
    }

}