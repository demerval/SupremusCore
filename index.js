exports.VerificarEstruturaDB = require('./lib/estrutura/estruturaVerificar');

exports.DAO = require('./lib/DAO');
exports.GeradorSQL = require('./lib/geradorSql');
exports.Tabela = require('./lib/tabela');
exports.TabelaConsulta = require('./lib/tabelaConsulta');

exports.Fields = require('./lib/estrutura/fields');
exports.Enums = require('./lib/enums');

exports.AuthMiddleware = require('./lib/middlewares/auth');