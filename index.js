exports.VerificarEstruturaDB = require('./lib/estrutura/estruturaVerificar');

exports.DAO = require('./lib/DAO');
exports.GeradorSQL = require('./lib/geradorSql');
exports.Tabela = require('./lib/tabela');
exports.TabelaConsulta = require('./lib/tabelaConsulta');
exports.CampoConsulta = require('./lib/campoConsulta');
exports.CriterioConsulta = require('./lib/criterioConsulta');

exports.Fields = require('./lib/estrutura/fields');
exports.Enums = require('./lib/enums');

exports.AuthMiddleware = require('./lib/middlewares/auth');


// Constantes
const AND = 'AND';
const OR = 'OR';

exports.AND = AND;
exports.OR = OR;

exports.IGUAL = '=';
exports.DIFERENTE = '<>';
exports.MAIOR = '>';
exports.MENOR = '<';
exports.MAIOR_IGUAL = '>=';
exports.MENOR_IGUAL = '<=';
exports.CONTEM = 'contem';
exports.INICIA_COM = 'inicia';
exports.INTERVALO = 'intervalo';