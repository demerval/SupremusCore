const moment = require('moment');

module.exports = async (campo, value) => {
  return moment(value).format('YYYY-MM-DD');
}