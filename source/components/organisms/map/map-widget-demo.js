/*global finna */

// eslint-disable-next-line no-unused-vars
var initMapWidgetDemo = function initMapWidgetDemo() {
  var attribution =
    '<i class="fa fa-map-marker marker open"></i><span class="map-marker-text">Open</span>' +
    '<i class="fa fa-map-marker marker closed"></i><span class="map-marker-text">Closed</span>' +
    '<i class="fa fa-map-marker marker no-schedule"></i><span class="map-marker-text">Not available</span>' +
    '<span class="js-expand-map expand expand-map map-marker-text marker"><i class="fa fa-expand"></i>Expand</span>' +
    '<span class="js-contract-map collapse contract-map map-marker-text marker" style="display: none"> <i class="fa fa-condense"></i>Collapse</span>';

  var url = 'http://map-api.finna.fi/v1/rendered/{z}/{x}/{y}.png';
  var map = finna.mapWidget;

  map.init($('.js-map-widget'), url, attribution);

  var organisationList = {
    85141: {
      id: 85141,
      name: "Turun pääkirjasto",
      address: {
        street: "Linnankatu 2",
        zipcode: "20100",
        city: "Keskusta (Turku)",
        coordinates: {
          lat: 60.4504634,
          lon: 22.2708644
        }
      },
      openTimes: {
        schedules: [{
          date: "28.9.",
          times: [{
            opens: "9",
            closes: "20",
            selfservice: false
          }],
          day: "Ma"
        },
        {
          date: "29.9.",
          times: [{
            opens: "9",
            closes: "20",
            selfservice: false
          }],
          day: "Ti"
        },
        {
          date: "30.9.",
          times: [{
            opens: "9",
            closes: "20",
            selfservice: false
          }],
          day: "Ke",
          "today": true
        },
        {
          date: "1.10.",
          times: [{
            opens: "9",
            closes: "20",
            selfservice: false
          }],
          day: "To"
        },
        {
          date: "2.10.",
          times: [{
            opens: "9",
            closes: "20",
            selfservice: false
          }],
          day: "Pe"
        },
        {
          date: "3.10.",
          times: [{
            opens: "11",
            closes: "17",
            selfservice: false
          }],
          day: "La"
        },
        {
          date: "4.10.",
          times: [{
            opens: "11",
            closes: "17",
            selfservice: false
          }],
          day: "Su"
        }
        ],
        openToday: [{
          opens: "9",
          closes: "20",
          selfservice: false
        }],
        currentWeek: true,
        openNow: 1
      },
      map: {
        info: "\n  <div class=\"map-bubble\">\n    <h5 class=\"name js-name\">Turun pääkirjasto</h5>\n    <p class=\"js-address\"></p>\n  </div>\n"
      }
    },
    85968: {
      id: 85968,
      name: "Askaisten kirjasto",
      address: {
        street: "Vesiläntie 3",
        zipcode: "21240",
        city: "Masku",
        coordinates: {
          lat: 60.5724247,
          lon: 21.8653932
        }
      },
      openTimes: {
        schedules: [{
          date: "28.9.",
          times: [{
            opens: "15",
            closes: "19",
            selfservice: false
          }],
          day: "Ma"
        },
        {
          date: "29.9.",
          times: [],
          day: "Ti",
          "closed": true
        },
        {
          date: "30.9.",
          times: [{
            opens: "15",
            closes: "19",
            selfservice: false
          }],
          day: "Ke",
          "today": true
        },
        {
          date: "1.10.",
          times: [{
            opens: "12",
            closes: "16",
            selfservice: false
          }],
          day: "To"
        },
        {
          date: "2.10.",
          times: [],
          day: "Pe",
          "closed": true
        },
        {
          date: "3.10.",
          times: [],
          day: "La",
          "closed": true
        },
        {
          date: "4.10.",
          times: [],
          day: "Su",
          "closed": true
        }
        ],
        openToday: [{
          opens: "15",
          closes: "19",
          selfservice: false
        }],
        currentWeek: true,
        openNow: 0
      },
      map: {
        info: "\n  <div class=\"map-bubble\">\n    <h5 class=\"name js-name\">Askaisten kirjasto</h5>\n    <p class=\"js-address\"></p>\n  </div>\n"
      }
    }
  };

  map.draw(organisationList);
  var $wrapper = $('.js-widget-wrapper');

  var $holder = $wrapper.find('.js-map-holder');
  var id = 85141;

  $wrapper.find('.js-show-map').on('click', function onShowMap() {
    if ($holder.hasClass('hidden')) {
      $holder.removeClass('hidden');

      $wrapper.find('.js-map-controls').removeClass('hidden');
      $(this).addClass('toggled');

      map.resize();
      map.reset();

      if (id in organisationList) {
        var data = organisationList[id];

        if (data.address && data.address.coordinates) {
          map.selectMarker(id);
        }
      }
    } else {
      $holder.addClass('hidden');
      $wrapper.find('.js-map-controls').addClass('hidden');
      $(this).removeClass('toggled');
    }

    $wrapper.find('.js-center').on('click', function onCenter() {
      if (id in organisationList) {
        var organisationData = organisationList[id];

        if (organisationData.address && organisationData.address.coordinates) {
          map.reset();
          map.selectMarker(id);
        }
      }
    });

    $wrapper.find('.js-show-all').on('click', function onShowAll() {
      if ($holder.hasClass('hidden')) {
        $holder.removeClass('hidden');
        $wrapper.find('.js-show-map').addClass('toggled');
      }

      map.resize();
      map.reset();
    });

    $holder.find('.js-expand-map').on('click', function onExpandMap() {
      $holder.toggleClass('expand', true);
      map.resize();
      $(this).hide();
      $holder.find('.js-contract-map').show();
    });

    $holder.find('.js-contract-map').on('click', function onContractMap() {
      $holder.toggleClass('expand', false);
      map.resize();
      $(this).hide();
      $holder.find('.js-expand-map').show();
    })
  });

  $wrapper.find('.js-office-search').autocomplete({
    source: function autocompleteSource(request, response) {
      var term = request.term.toLowerCase();
      var result = Object.keys(organisationList).map(function mapOrganisation(key, index) {

        if (organisationList[key].name.toLowerCase().indexOf(term) !== -1) {
          return {
            value: index,
            label: organisationList[key].name
          }
        }
      });

      result = result.sort(function sortCallback(a, b) {
        return a.label > b.label ? 1 : -1;
      });

      response(result);
    },
    select: function onSelect(event, ui) {
      $wrapper.find('.js-office-search').val(ui.item.label);

      return false;
    },
    focus: function onAutocompleteFocus() {
      if ($(window).width() < 768) {
        $('html, body').animate({
          scrollTop: $wrapper.find('.js-office-search').offset().top - 5
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

  $wrapper.find('.js-office-search').on('click', function onClickSearch() {
    $wrapper.find('.js-office-search').autocomplete('search', $(this).val());
  });

  $wrapper.find('.js-office-search').find('li').on('touchstart', function onTouchStartSearch() {
    $wrapper.find('.js-office-search').autocomplete('search', $(this).val());
  });

  $('.js-office-search-btn').on('click', function onClickSearchButton(event) {
    $wrapper.find('.js-office-search').autocomplete('search', '');
    $wrapper.find('.js-office-search').focus();

    event.preventDefault();
    return;
  });
};
