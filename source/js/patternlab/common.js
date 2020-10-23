/*global finna */
finna.common = (function finnaCommon() {
  function getField(obj, field) {
    if (field in obj && typeof obj[field] != 'undefined') {
      return obj[field];
    }
    return null;
  }

  return {
    getField: getField,
  }
})();
