module.exports = async (campo, value) => {
  let newValue;

  if (campo.noneCase) {
    newValue = value.trim();
  } else if (campo.lowerCase) {
    newValue = value.trim().toLowerCase();
  } else {
    newValue = value.trim().toUpperCase();
  }

  return newValue;
}