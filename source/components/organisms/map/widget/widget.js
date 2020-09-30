/*global VuFind, finna, L */
finna.mapWidget = (function finnaMapWidget() {
  var zoomLevel = { initial: 27, far: 5, close: 14 };
  var mapTileUrl, attribution;

  var mapMarkers = {};
  var markers = [];
  var $selectedMarker = null;

  var $holder, $map;

  var hideMarker = function hideMarker() {
    if ($selectedMarker) {
      $selectedMarker.closePopup();
    }
  }

  var selectMarker = function selectMarker(id) {
    var marker;

    if (id in mapMarkers) {
      marker = mapMarkers[id];
    }

    if (!marker) {
      hideMarker();
      return
    }

    if ($selectedMarker && $selectedMarker === marker) {
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

      var holderOffset = $($holder).offset();
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
    });
  };

  var handleOrganisation = function handleOrganisation(organisation, $ref, icons) {
    if (organisation.address && organisation.address.coordinates) {
      var infoWindowContent = organisation.map.info;
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

      $marker.bindPopup(infoWindowContent,
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

  var draw = function draw(organisationList) {
    var $this = $(this);
    var organisations = organisationList;

    var layer = L.tileLayer(mapTileUrl, {
      attribution: attribution,
      tileSize: 256
    });

    $map = L.map($($holder).attr('id'), {
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

    Object.keys(organisations).forEach(function forEachOrganisation(key) {
      handleOrganisation(organisations[key], $this, icons);
    });
  };

  return {
    selectMarker: selectMarker,
    resize: resize,
    reset: reset,
    draw: draw,
    init: function init(holder, _mapTileUrl, _attribution) {
      $holder = holder;
      mapTileUrl = _mapTileUrl;
      attribution = _attribution;
    }
  };
})();
