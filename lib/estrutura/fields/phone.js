const Types = require('../../enum/types');
const setStringValue = require('./functions/setString');

module.exports = {

    phone(fieldName = 'tel') {
        return {
            name: fieldName,
            type: Types.STRING,
            maxLength: 14,
            setValue: setStringValue
        }
    },

    phoneRequired(fieldName = 'tel') {
        return {
            name: fieldName,
            type: Types.STRING,
            maxLength: 14,
            required: true,
            setValue: setStringValue
        }
    }

}