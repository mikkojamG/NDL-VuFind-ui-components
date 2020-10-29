/*global finna */
finna.scheduleWidget = (function finnaWeekSchedule(root) {
  var $holder, service, $spinner, $prevButton, $nextButton, $weekNumber;
  var timeRowTemplate, timeTemplate;
  var schedulesLoading = false;
  var servicePointsList = {};

  var toggleSpinner = function toggleSpinner(hide) {
    if (hide) {
      $spinner.addClass('hide');
    } else {
      $spinner.removeClass('hide');
    }
  };

  var updatePreviousButton = function updatePreviousButton(response) {
    var disable = response.openTimes.currentWeek || !response.openTimes.schedules.length;

    if (disable) {
      $prevButton
        .addClass('disabled')
        .attr('disabled', true);
    } else {
      $prevButton
        .removeClass('disabled')
        .attr('disabled', false);
    }
  };

  var updateNextButton = function updateNextButton(response) {
    var disable = response.openTimes.museum === true || !response.openTimes.schedules.length;

    if (disable) {
      $nextButton
        .addClass('disabled')
        .attr('disabled', true);
    } else {
      $nextButton
        .removeClass('disabled')
        .attr('disabled', false);
    }
  };

  var updateWeekNumber = function updateWeekNumber(week) {
    $weekNumber.text(week);
  };

  var handleOpenTimes = function handleOpenTimes($dayRow, object) {
    var dayCount = 0;

    var currentSelfService = null;
    var currentDate = null;
    var selfServiceAvailable = false;
    var $currentTimeRow = null;
    var addFullOpeningTimes = true;

    var firstItem = object.times[0];
    var lastItem = object.times[object.times.length - 1];

    object.times.forEach(function forEachOpenTime(time) {
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
        var $timePeriod = $(timeTemplate.html());

        if (currentSelfService === null || selfService !== currentSelfService) {
          var $timeRow = $(timeRowTemplate.html());

          $timeRow.find('.js-date').text(date);
          $timeRow.find('.js-name').text(day);

          if (addFullOpeningTimes && object.times.length > 1) {
            $timePeriod.find('.js-opens').text(firstItem.opens);
            $timePeriod.find('.js-closes').text(lastItem.closes);

            $timeRow.find('.js-time-container').append($timePeriod);

            $dayRow.append($timeRow);

            $timePeriod = $(timeTemplate.html());
            $timeRow = $(timeRowTemplate.html());

            addFullOpeningTimes = false;
          }

          if (info == null) {
            $timeRow.find('.js-info').addClass('hide');
          } else {
            $timeRow.find('.js-info').text(info);
          }

          $timePeriod.find('.js-opens').text(timeOpens);
          $timePeriod.find('.js-closes').text(timeCloses);

          $timeRow.find('.js-time-container').append($timePeriod);

          $timeRow.find('.js-opens').text(timeOpens);
          $timeRow.find('.js-closes').text(timeCloses);

          if (selfServiceAvailable && selfService !== currentSelfService) {
            $timeRow.toggleClass('staff', !selfService);
          }

          if (time.selfservice) {
            $timeRow.find('.js-staff').addClass('hide');
            $timeRow.find('.js-selfservice').removeClass('hide');
          }

          $dayRow.append($timeRow);
          $currentTimeRow = $timeRow;
        } else {
          $timePeriod.find('.js-opens').text(timeOpens);
          $timePeriod.find('.js-closes').text(timeCloses);

          $currentTimeRow.find('.js-time-container').append($timePeriod);
        }

        currentSelfService = selfService;
        currentDate = object.date;
        dayCount++;
      }
    });
  };

  var handleSchedules = function handleSchedules(schedules, $scheduleHolder) {
    schedules.forEach(function forEachSchedule(object) {
      var $dayRow = $('<div class="day-container"></div>');

      $dayRow.toggleClass('today', !!object.today);

      var closed = !!object.closed;

      if (!closed) {
        handleOpenTimes($dayRow, object);
      } else {
        var $timeRow = $(timeRowTemplate.html());
        var $timePeriod = $(timeTemplate.html());

        $timeRow.find('.js-date').text(object.date);
        $timeRow.find('.js-name').text(object.day);
        $timeRow.find('.js-info').text(object.info);

        $timeRow.find('.js-staff').addClass('hide');
        $timePeriod.find('.js-period').addClass('hide');

        $timePeriod.find('.js-closed').removeClass('hide');

        $timeRow.find('.js-time-container').append($timePeriod);

        $dayRow.append($timeRow);
        $dayRow.toggleClass('is-closed', true);
      }

      $scheduleHolder.append($dayRow);
    });
  };

  var handleLinks = function handleLinks(links, $linkHolder) {
    links.forEach(function forEachLink(object) {
      var $link = $('<li><a></a></li>');

      $link.find('a')
        .attr('href', object.url)
        .text(object.name);

      $linkHolder.append($link);
    });
  };

  var handleDescriptions = function handleDescriptions(data) {
    var $infoHolder = $holder.find('.js-schedules-info');
    $infoHolder.empty();

    if (data.details.scheduleDescriptions) {
      data.details.scheduleDescriptions.forEach(function forEachDescription(description) {
        var descriptionString = description.replace(/(?:\r\n|\r|\n)/g, '<br />');

        $infoHolder.append($('<p/>').html(descriptionString));
      });

      $infoHolder.removeClass('hide');
    }
  };

  var schedulesLoaded = function schedulesLoaded(id, data) {
    schedulesLoading = false;

    if (data.periodStart) {
      $holder.data('period-start', data.periodStart);
    }

    if (data.weekNum) {
      updateWeekNumber(parseInt(data.weekNum));
    }

    updatePreviousButton(data);
    updateNextButton(data);

    var $scheduleHolder = $holder.find('.js-opening-times-week');

    var servicePoint = servicePointsList[id];

    var hasSchedules = data.openTimes && data.openTimes.schedules && data.openTimes.schedules.length;

    if (hasSchedules) {
      $holder.find('.js-week-navigation').removeClass('hide');

      handleSchedules(data.openTimes.schedules, $scheduleHolder);
    } else {
      $holder.find('.js-week-navigation').addClass('hide');

      var $linkHolder = $holder.find('.js-mobile-schedules');

      $linkHolder.empty();

      if (servicePoint.mobile) {
        $linkHolder.removeClass('hide');

        if (servicePoint.details.links) {
          handleLinks(servicePoint.details.links, $linkHolder);
        }
      }

      if (!servicePoint.details.links) {
        $holder.find('.js-no-schedules').removeClass('hide');
      }
    }

    handleDescriptions(servicePoint);
  };

  var detailsLoaded = function detailsLoaded(id, data) {
    if (!data) {
      return;
    }

    if (data.periodStart) {
      $holder.data('period-start', data.periodStart);
    }

    updatePreviousButton(data);
    updateNextButton(data);

    if (data.phone) {
      $holder.find('.js-phone')
        .attr('data-original-title', data.phone)
        .removeClass('hide');
    }

    if (data.emails) {
      $holder.find('.js-email')
        .attr('data-original-title', data.emails)
        .removeClass('hide');
    }

    if (data.links) {
      var facebookLink = data.links.filter(function findFacebookLink(link) {
        return link.name.indexOf('Facebook') !== -1;
      });

      if (facebookLink.length) {
        $holder.find('.js-facebook')
          .attr('href', facebookLink[0].url)
          .removeClass('hide');
      }
    }

    var $img = $holder.find('.js-facility-image');

    if (data.pictures) {
      var $imgLink = $img.parent('a');

      $imgLink.attr('href', ($imgLink.data('href') + '#' + id));

      var src = data.pictures[0].url;

      if ($img.attr('src') !== src) {
        $img.fadeTo(0, 0);
        $img.on('load', function onLoadImage() {
          $(this)
            .stop(true, true)
            .fadeTo(300, 1);
        });
        $img.attr('src', src);
        $img.closest('.js-hide-onload').removeClass('hide');
      } else {
        $img.fadeTo(300, 1);
      }

      $img.parent('a').removeClass('hide');
    } else {
      $img.parent('a').addClass('hide');
    }

    if (data.services) {
      data.services.forEach(function forEachService(serviceName) {
        $holder.find('.js-services .js-service-' + serviceName).removeClass('hide');
      });
    }
  };

  var getSchedules = function getSchedules(id, allServices) {
    $holder.find('.js-hide-onload').addClass('hide');
    $holder.find('.js-is-open').addClass('hide');
    $holder.data('service-point-id', id);

    var $scheduleHolder = $holder.find('.js-opening-times-week');
    $scheduleHolder.empty();

    var organisation = $holder.data('organisation');

    service.getSchedules($holder.data('target'), organisation, id, $holder.data('period-start'), null, true, allServices,
      function handleResponse(response) {

        if (response) {
          schedulesLoaded(id, response);
          detailsLoaded(id, response);
        }

        if (!$('.js-inital-loader').hasClass('hide')) {
          $('.js-inital-loader').addClass('hide');
        }

        var data = service.getDetails(id);

        if ('openNow' in data && data.openTimes && data.openTimes.schedules.length
        ) {
          $holder.find('.js-is-open ' + (data.openNow ? '.js-open' : '.js-closed')).removeClass('hide');
        }

        $holder.find('.js-is-open').removeClass('hide');

        if (data.email) {
          $holder.find('.js-email').removeClass('hide');
        }

        var $detailsLinkHolder = $holder.find('.js-details-link');
        $detailsLinkHolder.removeClass('hide');

        var $detailsLink = $detailsLinkHolder.find('a');

        $detailsLink.attr('href', $detailsLink.data('href') + ('#' + id));

        if (data.routeUrl) {
          $holder.find('.js-route')
            .attr('href', data.routeUrl)
            .removeClass('hide');
        }

        if (data.mapUrl && data.address) {
          var $map = $holder.find('.js-map');

          $map.find('> a').attr('href', data.mapUrl);
          $map.find('.js-map-address').text(data.address);
          $map.removeClass('hide');
        }

        if (!$('.js-inital-loader').hasClass('hide')) {
          $('.js-inital-loader').addClass('hide');
        }
      }
    );
  };

  var attachWeekNaviListener = function attachWeekNaviListener() {
    $holder.find('.js-prev-week, .js-next-week')
      .unbind('click')
      .on('click', function onNaviClick() {
        if ($(this).hasClass('disabled')) {
          return;
        }
        if (schedulesLoading) {
          return;
        }

        schedulesLoading = true;
        toggleSpinner(false);

        var $scheduleHolder = $holder.find('.js-opening-times-week');
        $scheduleHolder.empty();

        var organisation = $holder.data('organisation');
        var id = $holder.data('service-point-id');

        var dir = parseInt($(this).data('dir'));
        var currentWeek = parseInt($weekNumber.text());

        $weekNumber.text(currentWeek + dir);

        service.getSchedules(
          $holder.data('target'), organisation, id, $holder.data('period-start'), dir, false, false,
          function handleResponse(response) {
            schedulesLoaded(id, response);
            toggleSpinner(true);
          }
        );
      });
  };

  var servicePointsLoaded = function servicePointsLoaded(data) {
    var servicePoints = data.list;
    var id;

    if ($holder.data('service-point-id')) {
      id = $holder.data('service-point-id');
    } else {
      id = data.id;
    }

    servicePoints.forEach(function forEachServicePoint(obj) {
      servicePointsList[obj.id] = obj;
    });

    var $menu = $holder.find('.js-service-point-menu .dropdown-menu');

    if ($menu.length) {
      servicePoints.forEach(function forEachServicePoint(obj) {
        $menu.append($('<li role="menuitem"><button data-id="' + obj.id + '">' + obj.name + '</button></li>'));
      });

      var $toggleText = $holder.find('.js-service-point-menu .dropdown-toggle span');
      var $menuItem = $menu.find('li button');

      $menuItem.on('click', function onClickMenuItem() {
        toggleSpinner(false);

        $toggleText.text($(this).text());

        $holder.find('.js-facility-image').attr('alt', $(this).text());

        getSchedules($(this).data('id'), false);
        toggleSpinner(true);
      });

      var preselected = servicePoints.filter(function findPreselectedServicePoint(servicePoint) {
        return servicePoint.id.toString() === id.toString();
      });

      if (preselected.length) {
        var servicePoint = preselected[0];

        $menu.find('button[data-id="' + servicePoint.id + '"]').click();
      } else {
        id = finna.common.getField(data.consortium.finna, 'service_point');

        if (!id) {
          id = $menu.find('li button')
            .first()
            .data('service-point-id');
        }

        $menu.find('button[data-id="' + id + '"]').click();
      }
    } else {
      toggleSpinner(false);
      getSchedules(id, false);
      toggleSpinner(true);
    }

    var week = parseInt(data.weekNum);

    updateWeekNumber(week);
    attachWeekNaviListener();

    $holder.find('.js-hidden-initally').removeClass('hide');
  };

  var getServicePoint = function getServicePoint() {
    var organisation = $holder.data('organisation');

    if (typeof organisation == 'undefined') {
      return;
    }
    var buildings = $holder.data('buildings');

    service.getOrganisations($holder.data('target'), organisation, buildings, {}, function handleResponse(response) {

      if (response) {
        servicePointsLoaded(response);
      }
    });
  };

  return {
    getServicePoint: getServicePoint,
    getSchedules: getSchedules,
    init: function init(holder, _service) {
      $holder = holder;
      service = _service;

      $spinner = $holder.find('.js-loader');
      $prevButton = $holder.find('.js-prev-week');
      $nextButton = $holder.find('.js-next-week');
      $weekNumber = $holder.find('.js-week-number');

      timeRowTemplate = $('.js-time-row-template');
      timeTemplate = $('.js-time-template');

      $(root).on('mapWidget:selectServicePoint', function onMapWidgetSelect(_, data) {
        getSchedules(data, false);
      });
    }
  };
});
