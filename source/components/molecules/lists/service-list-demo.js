// eslint-disable-next-line
var initServiceListDemo = function initServiceListDemo($holder, data) {
  data.forEach(function forEachService(service) {
    var $li = $('<li/>').addClass('service-list-item');

    var serviceTitle = '<span>' + service['0'] + '</span>';
    var serviceText, serviceDescription, serviceTooltip;

    if (service.shortDesc) {
      serviceText = $('<button/>')
        .addClass('btn btn-link')
        .data('toggle', 'tooltip')
        .data('placement', 'bottom')
        .data('html', true)
        .html(serviceTitle);

      serviceDescription = service.shortDesc;

      serviceTooltip = '<h4>' + service['0'] + '</h4>' + serviceDescription;
      serviceText.attr('original-title', serviceTooltip);
    }

    $li.append(serviceText);
    $li.appendTo($holder);
  });
};
