/*global finna */
finna.layout = (function finnaLayout(_holder) {
  var initTooltips = function initTooltips() {
    var $holder = _holder ? _holder : $(document);

    var currentOpenTooltips = [];

    $holder.find('[data-toggle="tooltip"]')
      .on('show.bs.tooltip', function onShowTooltip() {
        var $this = $(this);

        $(currentOpenTooltips).each(function hideOtherTooltips() {
          if ($(this)[0] !== $this[0]) {
            $(this).tooltip('hide');
          }
        });

        currentOpenTooltips = [$this];
      })
      .on('hidden.bs.tooltip', function onHideTooltip(event) {
        $(event.target).data('bs.tooltip').inState.click = false;
      })
      .tooltip({ trigger: 'click', viewport: '.pl-js-pattern-example' });

    $holder.find('[data-toggle="tooltip"] > i').on('click', function onClickTooltip(event) {
      event.preventDefault();
    });

    $('html').on('click', function onClickHtml(event) {
      if (typeof $(event.target).parent().data('original-title') == 'undefined' && typeof $(event.target).data('original-title') == 'undefined') {
        $('[data-toggle="tooltip"]').tooltip('hide');
        currentOpenTooltips = [];
      }
    })
  };

  return {
    initTooltips: initTooltips,
    init: function init() {
      initTooltips();
    }
  }
})();

$(document).ready(function onDocumentReady() {
  finna.layout.init();
});
