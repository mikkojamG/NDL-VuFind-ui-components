/* global VuFind, finna */
finna.organisationFeed = (function organisationFeed() {
  var $holder, $grid, $spinner, $error;
  var service;

  var getFeedUrl = function getFeedUrl() {
    var deferred = $.Deferred();

    var parent = $grid.data('parent');
    var id = $grid.data('organisation-id');

    service.getOrganisations('page', parent, {}, {},
      function onOrganisationsLoaded() {
        service.getSchedules('page', parent, id, null, null, true, true,
          function onSchedulesLoaded(res) {
            var rss = res.rss.filter(function findFeedRss(item) {
              return item.id === $grid.data('feed-id');
            })[0];

            deferred.resolve(rss.url);
          });
      });

    return deferred.promise();
  };

  var ajaxRequest = function ajaxRequest(params) {
    var url = VuFind.path + '/AJAX/JSON';

    $.ajax({
      url: url,
      method: 'GET',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).done(function onRequestDone(res) {
      var response = JSON.parse(res);

      if (response.data) {
        $spinner.addClass('hide');

        $grid.html(response.data.html);

        var settings = response.data.settings;

        if (!settings.height) {
          settings.height = 300;
        }

        if (settings.modal) {
          $grid.find('a').on('click', function onClickModal() {
            $('#modal').addClass('feed-content');
          });

          VuFind.lightbox.bind($grid);
        }
      }
    }).fail(function onRequestFail(err) {
      $spinner.addClass('hide');

      if (err.responseJSON) {
        $error.html(err.responseJSON.data);
      }

      $error.removeClass('hide');
    });
  };

  var loadFeed = function loadFeed(params) {
    $spinner.removeClass('hide');
    $error.addClass('hide');

    params['touch-device'] = (finna.layout.isTouchDevice() ? 1 : 0);
    params.method = 'getOrganisationPageFeed';

    if (!params.url) {
      getFeedUrl().then(function onResolve(res) {
        params.url = res;

        ajaxRequest(params);
      });
    } else {
      ajaxRequest(params);
    }
  };

  return {
    loadFeed: loadFeed,
    init: function init(holder, _service) {
      $holder = holder;
      $grid = $holder.find('.js-feed-grid');
      $spinner = $holder.find('.js-loader');
      $error = $holder.find('.js-feed-error');

      service = _service;
    }
  }
});
