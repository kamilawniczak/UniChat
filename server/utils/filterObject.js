const filterObject = (object, ...allowedFields) => {
  const newObject = {};
  Object.keys(object).forEach((e) => {
    if (allowedFields.includes(e)) newObject[e] = object[e];
  });
  return newObject;
};

module.exports = filterObject;
