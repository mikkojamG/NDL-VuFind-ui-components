/*global finna */
finna.weekSchedule = (function finnaWeekSchedule() {
  var $holder, service, $spinner, $prevButton, $nextButton;
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
    $holder.data('week-num', week);
    $holder.find('.week-navi-holder .week-text .num').text(week);
  };

  var handleOpenTimes = function handleOpenTimes(dayCount, timeRowTemplate, $dayRow, object) {
    var count = dayCount;

    var currentSelfService = null;
    var currentDate = null;
    var selfServiceAvailable = false;
    var currentTimeRow = null;
    var addFullOpeningTimes = true;

    var firstItem = object.times[0];
    var lastItem = object.times[object.times.length - 1];

    $.each(object.times, function forEachOpenTime(_, time) {
      var selfService = !!time.selfservice;
      selfServiceAvailable = selfServiceAvailable || 'selfservice' in time;

      var date = count === 0 ? object.date : '';
      var day = count === 0 ? object.day : '';
      var info = time.info ? time.info : null;

      if (currentDate !== object.date) {
        count = 0;
      }

      var timeOpens = time.opens;
      var timeCloses = time.closes;

      if (!selfService || object.times.length === 1) {
        if (currentSelfService === null || selfService === currentSelfService) {
          var $timeRow = timeRowTemplate.clone();

          $timeRow.find('.date').text(date);
          $timeRow.find('.name').text(day);

          if (addFullOpeningTimes && object.times.length > 1) {
            $timeRow.find('.opens').text(firstItem.opens);
            $timeRow.find('.closes').text(lastItem.closes);

            $dayRow.append($timeRow);

            $timeRow = timeRowTemplate.clone();
            addFullOpeningTimes = false;
          }

          if (info == null) {
            $timeRow.find('.info').hide();
          } else {
            $timeRow.find('.info').text(info);
          }

          $timeRow.find('.opens').text(timeOpens);
          $timeRow.find('.closes').text(timeCloses);

          if (selfServiceAvailable && selfService !== currentSelfService) {
            $timeRow.toggleClass('staff', !selfService);
          }

          if (time.selfservice === true) {
            $timeRow.find('.name-staff').hide();
            $timeRow.find('.selfservice-only').removeClass('hide');
          }

          $dayRow.append($timeRow);
          currentTimeRow = $timeRow;
        } else {
          var $timePeriod = currentTimeRow.find('.time-template').eq(0).clone();

          $timePeriod.find('.opens').text(timeOpens);
          $timePeriod.find('.closes').text(timeCloses);

          currentTimeRow.find('.time-container').append($timePeriod);
        }

        currentSelfService = selfService;
        currentDate = object.date;

        count++;
      }
    });
  }

  var handleSchedule = function handleSchedule(object, $scheduleHolder) {
    var dayRowTemplate = $holder.find('.day-container.template').clone().removeClass('template hide');

    var $dayRow = dayRowTemplate.clone();

    var isToday = 'today' in object;
    var dayCount = 0;

    $dayRow.toggleClass('today', isToday);

    var timeRowTemplate = $holder.find('.time-row.template').not('.staff').clone().removeClass('template hide');

    if (!object.closed) {
      handleOpenTimes(dayCount, timeRowTemplate, $dayRow, object);
    } else {
      var $timeRow = timeRowTemplate.clone();

      $timeRow.find('.date').text(object.date);
      $timeRow.find('.name').text(object.day);
      $timeRow.find('.info').text(object.info);

      $timeRow.find('.period, .name-staff').hide();
      $timeRow.find('.closed-today').removeClass('hide');

      $dayRow.append($timeRow);
      $dayRow.toggleClass('is-closed');
    }

    dayCount = 0;
    $scheduleHolder.append($dayRow);
    $dayRow = dayRowTemplate.clone();
  }

  var handleLink = function handleLink($linkHolder, object) {
    var $link = $holder.find('.mobile-schedule-link-template').eq(0).clone();

    $link.removeClass('hide mobile-schedule-link-template');
    $link.find('a').attr('href', object.url).text(object.name);
    $link.appendTo($linkHolder);
  };

  var schedulesLoaded = function schedulesLoaded(id, response) {
    // schedulesLoading = false;

    $holder.find('.week-navi-holder .week-navi').each(function handleWeekNavi() {
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

    var $scheduleHolder = $holder.find('.schedules .opening-times-week');
    $scheduleHolder.find('> div').not('.template').remove();

    var data = organisationList[id];

    var hasSchedules = response.openTimes && response.openTimes.schedules && response.openTimes.schedules.length;

    if (hasSchedules) {
      var schedules = response.openTimes.schedules;

      $.each(schedules, function forEachSchedule(_, object) {
        handleSchedule(object, $scheduleHolder);
      });
    } else {
      var links = null;
      var $linkHolder = $holder.find('mobile-schedules');

      $linkHolder.empty();

      if (data.mobile) {
        $linkHolder.show();

        if (data.details.links) {
          $.each(data.details.links, function forEachLink(_, object) {
            handleLink($linkHolder, object);
          });

          links = true;
        }
      }

      if (!links) {
        $holder.find('.no-schedules').show();
      }
    }

    var $infoHolder = $holder.find('.schedules-info');

    $infoHolder.empty();

    if (data.details.scheduleDescriptions) {
      $.each(data.details.scheduleDescriptions, function forEachDescription(_, object) {
        var obj = object.replace(/(?:\r\n|\r|\n)/g, '<br />');
        $('<p/>').html(obj).appendTo($infoHolder);
      });

      $infoHolder.show();
    }
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
  };

  var showDetails = function showDetails(id, name, allServices) {
    $holder.find('.info-element').hide();

    var parent = $holder.data('parent');
    var data = service.getDetails(id);

    if (!data) {
      detailsLoaded(id, null);
      return;
    }

    $holder.data('id', id);

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
    }
  }
})();
