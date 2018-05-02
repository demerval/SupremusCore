const Types = require('../../enum/types');
const setStringValue = require('./functions/setString');

module.exports = {

    nome(fieldName = 'nome') {
        return {
            name: fieldName,
            type: Types.STRING,
            minLength: 5,
            maxLength: 60,
            setValue: setStringValue
        }
    },

    nomeRequired(fieldName = 'nome') {
        return {
            name: fieldName,
            type: Types.STRING,
            required: true,
            minLength: 5,
            maxLength: 60,
            setValue: setStringValue
        }
    },

    nomeRequiredUnique(fieldName = 'nome') {
        return {
            name: fieldName,
            type: Types.STRING,
            required: true,
            unique: true,
            minLength: 5,
            maxLength: 60,
            setValue: setStringValue
        }
    }

}