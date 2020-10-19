/* global VuFind, finna */
finna.organisationFeed = (function organisationFeed() {
  var $holder, $spinner;

  var loadFeed = function loadFeed(params) {
    params.method = 'getOrganisationPageFeed';
    params.url = 'https://tapahtumat.vaskikirjastot.fi/?post_type=tribe_events&kunta=turku-fi&lang=fi&order=asc&feed=rss2';

    params['touch-device'] = (finna.layout.isTouchDevice() ? 1 : 0);

    var url = VuFind.path + '/AJAX/JSON';

    $.ajax({
      url: url,
      method: 'POST',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .done(function onRequestDone(res) {
        if (res.data) {
          $spinner.addClass('hide');
          $holder.html(res.data.html);

          var settings = res.data.settings;

          if (!settings.height) {
            settings.height = 300;
          }

          if (settings.modal) {
            VuFind.lightbox.bind($holder);
          }
        }
      })
      .fail(function onRequestFail() {
      })
  };

  return {
    loadFeed: loadFeed,
    init: function init(holder, params) {
      $holder = holder;
      $spinner = $holder.find('.js-loader');

      loadFeed(params);
    }
  }
})();
