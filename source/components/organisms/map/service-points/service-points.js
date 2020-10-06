/*global VuFind, finna, L */
finna.mapWidget = (function finnaMapWidget() {
  var zoomLevel = { initial: 27, far: 5, close: 14 };
  var mapTileUrl;

  var mapMarkers = {};
  var organisationList = {};
  var markers = [];
  var $selectedMarker = null;

  var $widget,
    $map,
    $mapControls,
    $searchInput,
    $holder,
    $mapHolder;

  var hideMarker = function hideMarker() {
    if ($selectedMarker) {
      $selectedMarker.closePopup();
    }
  }

  var selectMarker = function selectMarker(id) {
    var marker;

    if (id in mapMarkers) {
      marker = mapMarkers[id];

      if ($selectedMarker && $selectedMarker === marker) {
        return;
      }
    } else {
      hideMarker();
      return;
    }

    marker.openPopup();
    $selectedMarker = marker;
  };

  var resize = function resize() {
    $map.invalidateSize(true);
  };

  var initMapZooming = function initMapZooming() {
    L.control.zoom({
      position: 'topleft',
      zoomInTitle: VuFind.translate('map_zoom_in'),
      zoomOutTitle: VuFind.translate('map_zoom_out')
    }).addTo($map);

    $('.leaflet-control-zoom').children('a').attr('tabindex', -1);

    $map.once('focus', function onMapFocus() {
      $map.scrollWheelZoom.enable();
    });

    $map.scrollWheelZoom.disable();
  };

  var setMarkerEventListeners = function setMarkerEventListeners($marker, $ref, organisation) {
    $marker.on('mouseover', function onMarkerMouseOver(event) {
      if ($marker === $selectedMarker) {
        return;
      }

      var holderOffset = $widget.offset();
      var offset = $(event.originalEvent.target).offset();

      var x = offset.left - holderOffset.left;
      var y = offset.top - holderOffset.top;

      $ref.trigger('marker-mouseover', { id: organisation.id, x: x, y: y })
    });

    $marker.on('mouseout', function onMarkerMouseOut() {
      $ref.trigger('marker-mouseout');
    });

    $marker.on('click', function onMarkerClick() {
      $ref.trigger('marker-click', organisation.id);
      finna.servicePointInfo.getServicePoint(organisation.id);
    });
  };

  var getMarkerBubbleHtml = function getMarkerBubbleHtml(data) {
    var bubbleTemplateString = $('.js-map-bubble').html().trim();
    var $bubble = $(bubbleTemplateString);

    $bubble.find('.js-name').text(data.name);

    return $bubble.html();
  };

  var handleOrganisation = function handleOrganisation(organisation, $ref, icons) {
    if (organisation.address && organisation.address.coordinates) {
      var point = organisation.address.coordinates;
      var icon = icons['no-schedule'];
      var openTimes = finna.common.getField(organisation, 'openTimes');

      if (openTimes) {
        var schedules = finna.common.getField(openTimes, 'schedules');
        var openNow = finna.common.getField(openTimes, 'openNow');

        icon = schedules && schedules.length ? (openNow ? icons.open : icons.closed) : icon;
      }

      var $marker = L.marker([point.lat, point.lon], { icon: icon }).addTo($map);

      setMarkerEventListeners($marker, $ref, organisation)

      var bubble = getMarkerBubbleHtml(organisation);

      organisation.map = { info: bubble };

      $marker.bindPopup(organisation.map.info,
        { zoomAnimation: true, autoPan: false }
      ).addTo($map);

      mapMarkers[organisation.id] = $marker;
      markers.push($marker);
    } else {
      return;
    }
  };

  var reset = function reset() {
    var group = new L.featureGroup(markers);
    var bounds = group.getBounds().pad(0.2);

    $map.fitBounds(bounds, { zoom: { animate: true } });
    $map.closePopup();
    $selectedMarker = null;
  };

  var draw = function draw() {
    var $ref = $(this);
    var attribution = $('.js-attribution').html().trim();

    var layer = L.tileLayer(mapTileUrl, {
      attribution: attribution,
      tileSize: 256
    });

    $map = L.map($($widget).attr('id'), {
      zoomControl: false,
      layers: layer,
      minZoom: zoomLevel.far,
      maxZoom: 18,
      zoomDelta: 0.1,
      zoomSnap: 0.1,
      closePopupOnClick: false
    });

    initMapZooming();

    $map.on('popupopen', function onPopupOpen(element) {
      $map.setZoom(zoomLevel.close, { animate: false });

      var px = $map.project(element.popup._latlng);
      px.y -= element.popup._container.clientHeight / 2;

      $map.panTo($map.unproject(px), { animate: false });
    });

    $map.on('popupclose', function onPopupClose() {
      $selectedMarker = null;
    });

    L.control.locate({
      strings: { title: VuFind.translate('map_my_location') }
    }).addTo($map);

    $('.leaflet-control-locate a').attr('aria-label', VuFind.translate('map_my_location'));

    $map.attributionControl.setPrefix('');

    var icons = {};

    ['open', 'closed', 'no-schedule'].forEach(function forEachIcon(iconName) {
      icons[iconName] = L.divIcon({
        className: 'mapMarker',
        iconSize: null,
        html: '<div class="leaflet-marker-icon leaflet-zoom-animated leaflet-interactive"><i class="fa fa-map-marker ' + iconName + '" style="position: relative; font-size: 35px;"></i></div>',
        iconAnchor: [10, 35],
        popupAnchor: [0, -36],
        labelAnchor: [-5, -86]
      });
    });

    Object.keys(organisationList).forEach(function forEachOrganisation(key) {
      handleOrganisation(organisationList[key], $ref, icons);
    });
  };

  var setControllerEventListeners = function setControllerEventListeners() {
    $holder.find('.js-center').on('click', function onCenter() {
      var id = $holder.data('organisation-id');

      if (id in organisationList) {
        if (organisationList[id].address && organisationList[id].address.coordinates) {
          reset();
          selectMarker(id);
        }
      }
    });

    if (Object.keys(organisationList).length > 1) {
      $holder.find('.js-show-all').removeClass('hidden');

      $holder.find('.js-show-all').on('click', function onShowAll() {
        resize();
        reset();
      });
    }

    $mapHolder.find('.js-expand-map').on('click', function onExpandMap() {
      $mapHolder.toggleClass('expand', true);
      resize();
      $(this).addClass('hidden');
      $mapHolder.find('.js-contract-map').removeClass('hidden');
    });

    $mapHolder.find('.js-contract-map').on('click', function onContractMap() {
      $mapHolder.toggleClass('expand', false);
      resize();
      $(this).addClass('hidden');
      $mapHolder.find('.js-expand-map').removeClass('hidden');
    });
  };

  var initMapControls = function initMapControls() {
    $holder.find('.js-show-map').on('click', function onShowMap() {
      var id = $holder.data('organisation-id');

      if ($mapHolder.hasClass('hidden')) {
        $mapHolder.removeClass('hidden');
        $mapControls.removeClass('hidden');
        $(this).addClass('toggled');

        resize();
        reset();

        if (id in organisationList) {
          if (organisationList[id].address && organisationList[id].address.coordinates) {
            selectMarker(id);
          }
        }
      } else {
        $mapHolder.addClass('hidden');
        $mapControls.addClass('hidden');
        $(this).removeClass('toggled');
      }

      setControllerEventListeners();
    });
  };

  var initAutoComplete = function initAutoComplete() {
    var organisationsAmount = Object.keys(organisationList).length;
    var placeholderString = $searchInput.attr('placeholder').replace('{0}', organisationsAmount);

    $searchInput
      .attr('placeholder', placeholderString)
      .attr('aria-placeholder', placeholderString);

    $searchInput.autocomplete({
      source: function autocompleteSource(request, response) {
        var term = request.term.toLowerCase();
        var result = Object.keys(organisationList).filter(function filterOrganisation(key) {
          return organisationList[key].name.toLowerCase().indexOf(term) !== -1;
        }).map(function mapOrganisation(key) {
          return {
            value: organisationList[key].id,
            label: organisationList[key].name
          }
        });

        result = result.sort(function sortCallback(a, b) {
          return a.label > b.label ? 1 : -1;
        });

        response(result);
      },
      select: function onSelect(_, ui) {
        $searchInput.val(ui.item.label);

        selectMarker(ui.item.value);

        $holder.data('organisation-id', ui.item.value);

        finna.servicePointInfo.getServicePoint(ui.item.value);

        return false;
      },
      focus: function onAutocompleteFocus() {
        if ($(window).width() < 768) {
          $('html, body').animate({
            scrollTop: $searchInput.offset().top - 5
          }, 100);
        }
        return false;
      },
      open: function onOpen() {
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
          $holder.find('.ui-autocomplete').off('menufocus hover mouseover');
        }
      },
      minLength: 0,
      delay: 100,
      appendTo: '.autocomplete-container',
      autoFocus: false
    }).data('ui-autocomplete')._renderItem = function addLabels(ul, item) {
      return $('<li>')
        .attr('aria-label', item.label)
        .html(item.label)
        .appendTo(ul);
    };

    $searchInput.on('click', function onClickSearch() {
      $searchInput.autocomplete('search', $(this).val());
    });

    $searchInput.find('li').on('touchstart', function onTouchStartSearch() {
      $searchInput.autocomplete('search', $(this).val());
    });

    $holder.find('.js-service-points-form button').on('click', function onClickSearchButton(event) {
      $searchInput.autocomplete('search', '');
      $searchInput.focus();

      event.preventDefault();
      return false;
    });
  };

  return {
    hideMarker: hideMarker,
    selectMarker: selectMarker,
    resize: resize,
    reset: reset,
    draw: draw,
    init: function init(holder, widget, url, organisations, $infoWrapper) {
      $holder = holder;
      $widget = widget;
      mapTileUrl = url;
      organisationList = organisations;

      $mapControls = $holder.find('.js-map-controls')
      $searchInput = $holder.find('.js-service-points-form input');
      $mapHolder = $holder.find('.js-map-holder');

      initMapControls();

      if (Object.keys(organisationList).length > 1) {
        initAutoComplete();
      }

      if (!finna.servicePointInfo && !finna.organisationInfo) {
        return;
      }

      var buildings = Object.keys(organisationList).map(function mapBuildings(key) {
        return organisationList[key].id;
      });

      finna.servicePointInfo.init($infoWrapper, finna.organisationInfo, buildings[0]);
    }
  };
})();
