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

        if (holder.find('.grid-item.truncate').length > 0) {
          holder.find('.show-more-feeds').removeClass('hidden');
        }
        holder.find('.show-more-feeds').click(function moreFeedsButton() {
          holder.find('.grid-item.truncate').removeClass('hidden');
          holder.find('.show-less-feeds').removeClass('hidden');
          $(this).addClass('hidden');
        });
        holder.find('.show-less-feeds').click(function lessFeedsButton() {
          holder.find('.grid-item.truncate').addClass('hidden');
          holder.find('.show-more-feeds').removeClass('hidden');
          $(this).addClass('hidden');
        });
        var feedGrid = holder.find('.feed-grid:not(.news-feed .feed-grid, .events-feed .feed-grid)');
        if (feedGrid.width() <= 500) {
          feedGrid.find('.grid-item').css('flex-basis', '100%');
        } else if (feedGrid.width() <= 800) {
          feedGrid.find('.grid-item').css('flex-basis', '50%');
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
