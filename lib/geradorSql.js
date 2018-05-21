const Persist = require('./enum/persist');

module.exports = {

    sqlInsert(tabela) {
        let campos = tabela.getCampos(Persist.INCLUSAO);
        let sql = `INSERT INTO ${tabela.getNome()} (${tabela.getCamposNome(Persist.INCLUSAO)}) VALUES (`;
        let params = [];

        for (let campo of campos) {
            params.push('?');
        }

        return sql + params.join(', ') + ');';
    },

    sqlUpdate(tabela) {
        let campos = tabela.getCampos(Persist.ALTERACAO);
        let sql = `UPDATE ${tabela.getNome()} SET `;
        let chavePrimaria = undefined;
        let params = [];

        for (let campo of campos) {
            if (campo.persist === Persist.SEMPRE || campo.persist === Persist.ALTERACAO) {
                if (campo.primaryKey) {
                    chavePrimaria = campo.name.toUpperCase();
                } else {
                    params.push(campo.name.toUpperCase() + ' = ?');
                }
            }
        };

        if (!chavePrimaria) {
            throw Error('Não foi localizada a chave primária da tabela!');
        }

        return sql + params.join(', ') + ' WHERE ' + chavePrimaria + ' = ?;';
    },

    sqlDelete(tabela) {
        let chavePrimaria = tabela.getChavePrimaria();
        if (!chavePrimaria) {
            throw Error('Não foi localizada a chave primária da tabela!');
        }

        return `DELETE FROM ${tabela.getNome()} WHERE ${chavePrimaria.name.toUpperCase()} = ?;`;
    },

    sqlConsulta(tabela, fieldsConsulta) {
        let sql = `SELECT ${tabela.getCamposNomeSelect(fieldsConsulta)} FROM ${tabela.getNome()}`;
        return sql;
    },

    sqlConsultaPaginada(tabela, fieldsConsulta) {
        let sql = `SELECT FIRST ? SKIP ? ${tabela.getCamposNomeSelect(fieldsConsulta)} FROM ${tabela.getNome()}`;
        return sql;
    },

    sqlConsultaPaginadaTotal(tabela) {
        let chavePrimaria = tabela.getChavePrimaria();
        if (!chavePrimaria) {
            throw Error('Não foi localizada a chave primária da tabela!');
        }

        let sql = `SELECT COUNT(${chavePrimaria.name.toUpperCase()}) FROM ${tabela.getNome()}`;
        return sql;
    }

}