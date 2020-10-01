/*global finna */

// eslint-disable-next-line no-unused-vars
var initMapWidgetDemo = function initMapWidgetDemo(wrapperClass, widgetClass) {
  var url = 'http://map-api.finna.fi/v1/rendered/{z}/{x}/{y}.png';
  var map = finna.mapWidget;

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


  map.init($('.' + wrapperClass + ''), $('.' + widgetClass + ''), url, organisationList);

  map.draw();
};
