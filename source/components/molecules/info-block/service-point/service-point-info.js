/*global finna */
finna.servicePointInfo = (function finnaServicePointInfo() {
  var $holder;
  var service;

  var getOrganisations = function getOrganisations(target, parent, buildings) {
    service.getOrganisations(target, parent, buildings, {}, function callback() { return; });
  };

  var handleOpeningTimes = function handleOpeningTimes(schedules) {
    schedules.forEach(function forEachSchedule(schedule) {
      if (schedule.today && schedule.times && schedule.times.length) {
        var openToday = schedule.times[0];

        var lastSchedule = schedule.times[schedule.times.length - 1];
        var $openingTimes = $holder.find('.js-opening-times');

        $openingTimes.find('.js-opens').text(openToday.opens);
        $openingTimes.find('.js-closes').text(lastSchedule.closes);

        var staffTimes = schedule.times.filter(function mapStaffTimes(time) {
          return !time.selfservice;
        });

        if (staffTimes.length) {
          var $staffTimes = $holder.find('.js-staff-times');

          staffTimes.forEach(function forEachStaffTime(staffTime) {
            $staffTimes.find('.js-staff-opens').text(staffTime.opens);
            $staffTimes.find('.js-staff-closes').text(staffTime.closes);
          });
        }
      }
    });
  };

  var getServicePoint = function getServicePoint(id) {
    var data = service.getDetails(id);

    $holder.find('.js-service-point-title').text(data.name);

    if (data.address) {
      $holder.find('.js-service-point-address').html(data.address);
    }

    if (data.email) {
      $holder.find('.js-service-point-email').text(data.email.replace('@', '(at)'))
    }

    if (data.homepage) {
      $holder.find('.js-homepage').attr('href', data.homepage);
    }

    if (data.routeUrl) {
      $holder.find('.js-directions').attr('href', data.routeUrl);
    }

    if (data.slogan) {
      $holder.find('.js-service-point-slogan').text(data.slogan);
    }

    if (data.details && data.details.links) {
      var facebookLink = data.details.links.map(function mapFacebooklink(link) {
        return link.name.indexOf('Facebook') !== -1;
      })[0];

      $holder.find('.js-facebook').attr('href', facebookLink.url);
    }

    var hasSchedules = data.openTimes.schedules && data.openTimes.schedules.length;

    if (hasSchedules) {
      handleOpeningTimes(data.openTimes.schedules);

      $holder.find('.js-open-today ' + data.openNow ? '.open' : '.closed').removeClass('hide');
    }


  }

  return {
    getServicePoint: getServicePoint,
    init: function init(holder, _service) {
      $holder = holder;
      service = _service;

      getOrganisations('page', 'Vaski', [85141, 85968]);
    }
  }
})();
