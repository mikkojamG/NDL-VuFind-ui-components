/*global finna */
finna.weekSchedule = (function finnaWeekSchedule() {
  var $holder, service, $spinner, $prevButton, $nextButton;
  var timeRowTemplate, timeTemplate, mobileScheduleLinkTemplate;
  // var schedulesLoading = false;
  var organisationList = {};

  var toggleSpinner = function toggleSpinner(hide) {
    if (hide) {
      $spinner.hide();
    } else {
      $spinner.fadeIn();
    }
  };

  var updatePrevBtn = function updatePrevBtn(response) {
    var shouldDisable = response.openTimes && response.openTimes.currentWeek;

    if (shouldDisable) {
      $prevButton.fadeTo(200, 0).addClass('disabled');
    } else {
      $prevButton.fadeTo(200, 1).removeClass('disabled');
    }
  };

  var updateNextBtn = function updateNextBtn(response) {
    var shouldDisable = response.openTimes.museum === true;

    if (shouldDisable) {
      $nextButton.fadeTo(200, 0).addClass('disabled');
    } else {
      $nextButton.fadeTo(200, 1).removeClass('disabled');
    }
  };

  var updateWeekNumber = function updateWeekNumber(week) {
    $holder.find('.js-week-number').text(week);
  };

  var handleOpenTimes = function handleOpenTimes($dayRow, object) {
    var dayCount = 0;

    var currentSelfService = null;
    var currentDate = null;
    var selfServiceAvailable = false;
    var currentTimeRow = null;
    var addFullOpeningTimes = true;

    var firstItem = object.times[0];
    var lastItem = object.times[object.times.length - 1];

    $.each(object.times, function forEachOpenTime(_, time) {
      var selfService = !!time.selfservice;
      selfServiceAvailable = selfServiceAvailable || time.selfservice;

      var date = dayCount === 0 ? object.date : '';
      var day = dayCount === 0 ? object.day : '';
      var info = time.info ? time.info : null;

      if (currentDate !== object.date) {
        dayCount = 0;
      }

      var timeOpens = time.opens;
      var timeCloses = time.closes;

      if (!selfService || object.times.length === 1) {
        if (currentSelfService === null || selfService === currentSelfService) {
          var $timeRow = timeRowTemplate.clone();

          $timeRow.find('.js-date').text(date);
          $timeRow.find('.js-name').text(day);

          if (addFullOpeningTimes && object.times.length > 1) {
            $timeRow.find('.js-opens').text(firstItem.opens);
            $timeRow.find('.js-closes').text(lastItem.closes);

            $dayRow.append($timeRow);

            $timeRow = timeRowTemplate.clone();
            addFullOpeningTimes = false;
          }

          if (info == null) {
            $timeRow.find('.js-info').hide();
          } else {
            $timeRow.find('.js-info').text(info);
          }

          $timeRow.find('.js-opens').text(timeOpens);
          $timeRow.find('.js-closes').text(timeCloses);

          if (selfServiceAvailable && selfService !== currentSelfService) {
            $timeRow.toggleClass('staff', !selfService);
          }

          if (time.selfservice) {
            $timeRow.find('.js-staff').hide();
            $timeRow.find('.js-selfservice').removeClass('hide');
          }

          $dayRow.append($timeRow);
          currentTimeRow = $timeRow;
        } else {
          var $timePeriod = timeTemplate.clone();

          $timePeriod.find('.js-opens').text(timeOpens);
          $timePeriod.find('.js-closes').text(timeCloses);

          currentTimeRow.find('.js-time-container').append($timePeriod);
        }

        currentSelfService = selfService;
        currentDate = object.date;

        dayCount++;
      }
    });
  }

  var handleSchedules = function handleSchedules(schedules, $scheduleHolder) {
    $.each(schedules, function forEachSchedule(_, object) {
      var isToday = 'today' in object;

      var $dayRow = $('<div></div>').addClass('day-container');

      $dayRow.toggleClass('today', isToday);

      if (!object.closed) {
        handleOpenTimes($dayRow, object);
      } else {
        var $timeRow = timeRowTemplate.clone();

        $timeRow.find('.js-date').text(object.date);
        $timeRow.find('.js-name').text(object.day);
        $timeRow.find('.js-info').text(object.info);

        $timeRow.find('.js-period, .js-staff').hide();
        $timeRow.find('.js-closed').removeClass('hide');

        $dayRow.append($timeRow);
        $dayRow.toggleClass('is-closed', true);
      }

      $scheduleHolder.append($dayRow);
    });
  };

  var handleLinks = function handleLinks(links, $linkHolder) {
    $.each(links, function forEachLink(_, object) {
      var $link = mobileScheduleLinkTemplate.clone();

      $link.find('a').attr('href', object.url).text(object.name);
      $link.appendTo($linkHolder);
    });
  };

  var handleReferences = function handleReferences(data) {
    var $infoHolder = $holder.find('.js-schedules-info');
    $infoHolder.empty();

    if (data.details.scheduleDescriptions) {
      $.each(data.details.scheduleDescriptions, function forEachDescription(_, object) {
        var obj = object.replace(/(?:\r\n|\r|\n)/g, '<br />');
        $('<p/>').html(obj).appendTo($infoHolder);
      });

      $infoHolder.show();
    }
  };

  var schedulesLoaded = function schedulesLoaded(id, response) {
    // schedulesLoading = false;

    $holder.find('.js-week-navigate').each(function handleWeekNavi() {
      var classes = $(this).data('classes');

      if (classes) {
        $(this).attr('class', classes);
      }
    });

    if (response.periodStart) {
      $holder.data('period-start', response.periodStart);
    }

    if (response.weekNum) {
      updateWeekNumber(parseInt(response.weekNum));
    }

    updatePrevBtn(response);
    updateNextBtn(response);

    var $scheduleHolder = $holder.find('.js-opening-times-week');

    $scheduleHolder.find('> div').remove();

    var data = organisationList[id];
    var hasSchedules = response.openTimes && response.openTimes.schedules && response.openTimes.schedules.length;

    if (hasSchedules) {
      var schedules = response.openTimes.schedules;

      handleSchedules(schedules, $scheduleHolder);
    } else {
      var links = null;
      var $linkHolder = $holder.find('.js-mobile-schedules');

      $linkHolder.empty();

      if (data.mobile) {
        $linkHolder.show();

        if (data.details.links) {
          handleLinks(data.details.links, $linkHolder);

          links = true;
        }
      }

      if (!links) {
        $holder.find('.js-no-schedules').show();
      }
    }

    handleReferences(data);
  };

  var detailsLoaded = function detailsLoaded(id, response) {
    toggleSpinner(false);

    if (response === null) {
      return;
    }

    if (response.periodStart) {
      $holder.data('period-start', response.periodStart);
    }

    updatePrevBtn(response);
    updateNextBtn(response);

    if (response.phone) {
      $holder.find('.js-phone').attr('data-original-title', response.phone).show();
    }

    if (response.emails) {
      $holder.find('.js-email').attr('data-original-title', response.emails).attr('data-toggle', 'tooltip').show();

      //finna.layout.initToolTips(holder);
    }

    if (response.links) {
      var links = response.links;

      if (links.length) {
        $.each(links, function handleLink(_, obj) {
          if (obj.name.indexOf('Facebook') > 0) {
            $holder.find('.js-facebook').attr('href', obj.url).show();
          }
        });
      }
    }

    var img = $holder.find('.js-facility-image');

    if (response.pictures) {
      var imgLink = img.parent('a');

      imgLink.attr('href', (imgLink.data('href') + '#' + id));

      var src = response.pictures[0].url;

      img.show();

      if (img.attr('src') !== src) {
        img.fadeTo(0, 0);
        img.on('load', function onLoadImage() {
          $(this).stop(true, true).fadeTo(300, 1);
        });
        img.attr('src', src).attr('alt', name);
        img.closest('.info-element').show();
      } else {
        img.fadeTo(300, 1);
      }
    } else {
      img.hide();
    }

    if (response.services) {
      $.each(response.services, function handleService(_, serviceName) {
        $holder.find('.js-services .js-service-' + serviceName).show();
      });
    }
  };

  var showDetails = function showDetails(id, name, allServices) {
    $holder.find('.info-element').hide();
    $holder.find('.js-is-open').hide();

    var parent = $holder.data('parent');
    var data = service.getDetails(id);

    if (!data) {
      detailsLoaded(id, null);
      return;
    }

    $holder.data('id', id);

    if (data.openTimes && data.openNow && data.openTimes.schedules && data.openTimes.schedules.length
    ) {
      $holder.find('.js-is-open' + (data.openNow ? '.js-open' : '.js-closed')).show();
    }

    if (data.email) {
      $holder.find('.js-email').wrap($('<a/>').attr('href', 'mailto:' + data.email)).show();
    }

    var detailsLinkHolder = $holder.find('.js-details-link').show();
    var detailsLink = detailsLinkHolder.find('a');
    detailsLink.attr('href', detailsLink.data('href') + ('#' + id));

    if (data.routeUrl) {
      $holder.find('.js-route').attr('href', data.routeUrl).show();
    }

    if (data.mapUrl && data.address) {
      var map = $holder.find('.js-map');

      map.find('> a').attr('href', data.mapUrl);
      map.find('.js-map-address').text(data.address);
      map.show();
    }

    service.getSchedules($holder.data('target'), parent, id, $holder.data('period-start'), null, true, allServices,
      function handleResponse(response) {
        if (response) {
          schedulesLoaded(id, response);

          detailsLoaded(id, response);

          $holder.trigger('detailsLoaded', id);
        }
      }
    );
  };

  return {
    showDetails: showDetails,
    init: function init(holder, _service) {
      $holder = holder;
      service = _service;

      $spinner = $holder.find('.js-loader');
      $prevButton = $holder.find('.js-prev-week');
      $nextButton = $holder.find('.js-next-week');

      timeRowTemplate = $('.js-time-row-template');
      timeTemplate = $('.js-time-template');
      mobileScheduleLinkTemplate = $('.js-mobile-schedule-link-template')
    }
  }
})();
