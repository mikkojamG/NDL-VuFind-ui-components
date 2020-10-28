/* global finna */
finna.servicePointBuilding = (function servicePointBuilding(root) {
  var $holder, $loader;
  var service;

  var getOrganisationData = function getOrganisationData(organisation) {
    var deferred = $.Deferred();

    service.getOrganisations('page', organisation, [], {}, function onOrganisationsLoaded(res) {
      if (res) {
        deferred.resolve(res);
      } else {
        deferred.reject();
      }
    });

    return deferred.promise();
  };

  var getSchedules = function getSchedules(organisation, id) {
    var deferred = $.Deferred();

    service.getSchedules('page', organisation, id, null, null, true, true, function onSchedulesLoaded(res) {
      if (res) {
        deferred.resolve(res);
      } else {
        deferred.reject();
      }
    });

    return deferred.promise();
  };

  var updateBuilding = function updateBuilding(data) {
    var imgSrc = data.details.pictures[0].url;

    $holder.find('.js-building-image-primary .figure-image').attr('src', imgSrc);

    $holder.find('.figure-caption').text(data.name);
    $holder.find('.js-building-description').html(data.details.description);

    var yearBuilt = data.details.buildingYear;

    if (yearBuilt) {
      $holder.find('.js-building-year span').text(yearBuilt);
      $holder.find('.js-building-year').removeClass('hide');
    }

    var hasExtraImages = data.details.museum;

    if (hasExtraImages) {
      var extraImages = [data.details.pictures[1], data.details.pictures[2]].map(function mapExtraImages(image) {
        return $('<img />').attr('src', image.url);
      });

      extraImages.forEach(function forEachExtraImage($image) {
        $holder.find('.js-building-image-secondary').append($image);
      })

      $holder.find('.js-building-image-secondary').removeClass('hide');
    }

    $loader.addClass('hide');
  };

  var getServicePoint = function getServicePoint(id) {
    var organisation = $holder.data('organisation');

    getOrganisationData(organisation).then(function onOrganisationResolve() {
      getSchedules(organisation, id).then(function onSchedulesResolve() {
        var data = service.getDetails(id);

        updateBuilding(data);
      });
    });
  };

  return {
    getServicePoint: getServicePoint,
    init: function init(_holder, _service) {
      $holder = _holder;
      service = _service;

      $loader = $holder.find('.js-loader');

      $(root).on('mapWidget:selectServicePoint', function onMapWidgetSelect(_, data) {
        $holder.data('service-point-id', data);

        getServicePoint(data)
      })
    }
  }
});

