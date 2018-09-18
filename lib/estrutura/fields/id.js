const Types = require('../../enum/types');
const setIntegerValue = require('./functions/setInteger');
const setStringValue = require('./functions/setString');
const setDecimalValue = require('./functions/setDecimal');

module.exports = {

    idIntegerAutoIncrement(fieldName = 'id', alias) {
        return {
            name: fieldName,
            alias: alias,
            type: Types.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            setValue: setIntegerValue
        }
    },

    idInteger(fieldName = 'id', alias) {
        return {
            name: fieldName,
            alias: alias,
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
    },

    decimal(fieldName = 'id', decimal = 2) {
        return {
            name: fieldName,
            type: Types.DECIMAL,
            primaryKey: true,
            decimalPlaces: decimal,
            setValue: setDecimalValue
        }
    }

}