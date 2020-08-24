/*global finna */
finna.layout = (function finnaLayout() {
  function isTouchDevice() {
    return (('ontouchstart' in window)
      || (navigator.maxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0)); // IE10, IE11, Edge
  }


  var my = {
    isTouchDevice: isTouchDevice,
  };

  return my;
})();
