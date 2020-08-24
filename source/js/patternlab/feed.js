/*global VuFind, finna */
finna.feed = (function finnaFeed() {
  function processLoadFeed(holder, params) {
    params['touch-device'] = (finna.layout.isTouchDevice() ? 1 : 0);

    var url = VuFind.path + '/AJAX/JSON?' + $.param(params);

    // Prepend spinner
    holder.prepend('<i class="fa fa-spin fa-spinner"></i>');

    $.getJSON(url)
      .done(function loadFeedDone(response) {
        if (response.data) {
          holder.html(response.data.html);

          var settings = response.data.settings;
          if (typeof settings.height == 'undefined') {
            settings.height = 300;
          }
        }
      })
      .fail(function loadFeedFail(response/*, textStatus, err*/) {
        var err = '<!-- Feed could not be loaded';
        if (typeof response.responseJSON !== 'undefined') {
          err += ': ' + response.responseJSON.data;
        }
        err += ' -->';
        holder.html(err);
      });
  }

  function loadFeed(holder) {
    var id = holder.data('feed');
    if (typeof id == 'undefined') {
      return;
    }
    processLoadFeed(holder, { method: 'getFeed', id: id });
  }

  var my = {
    loadFeed: loadFeed,
  };

  return my;
})();
