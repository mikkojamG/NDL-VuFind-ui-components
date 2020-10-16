/*global finna */

// eslint-disable-next-line
var initServiceListDemo = function initServiceListDemo($holder, data) {
  data.forEach(function forEachService(service) {
    var $li = $('<li/>').addClass('service-list-item');

    var titleString = '<span>' + service['0'] + '</span>';
    var $serviceLink, descriptionString, tooltipString;

    if (service.shortDesc) {
      $serviceLink = $('<button/>')
        .addClass('btn btn-link')
        .html(titleString);

      $serviceLink
        .attr('data-toggle', 'tooltip')
        .attr('data-placement', 'bottom')
        .attr('data-html', true);

      descriptionString = service.shortDesc;

      tooltipString = '<h4>' + service['0'] + '</h4>' + descriptionString;
      $serviceLink.attr('data-original-title', tooltipString);
    }

    $li.append($serviceLink);
    $li.appendTo($holder);
  });

  if (!finna.layout.initTooltips) {
    return;
  }

  finna.layout.initTooltips($holder);
};
