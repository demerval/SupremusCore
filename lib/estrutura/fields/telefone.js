const Types = require('../../enum/types');
const setStringValue = require('./functions/setString');

module.exports = {

    tel(fieldName = 'tel') {
        return {
            name: fieldName,
            type: Types.STRING,
            maxLength: 14,
            setValue: setStringValue
        }
    },

    telRequired(fieldName = 'tel') {
        return {
            name: fieldName,
            type: Types.STRING,
            maxLength: 14,
            required: true,
            setValue: setStringValue
        }
    }

}