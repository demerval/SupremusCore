const CampoConsulta = require('./campoConsulta');

module.exports = (criterios) => {
  const criterio = [];

  if (criterios instanceof Array === false) {
    let cr = criterios;
    criterios = [];
    criterios.push(cr);
  }

  for (let c of criterios) {
    criterio.push(new CampoConsulta(c));
  }

  return criterio;
}