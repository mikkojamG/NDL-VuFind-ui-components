var mockTags = [{
  id: '1',
  value: 'Testing 1'
},
{
  id: '2',
  value: 'Testing 2'
}
];

var mockOpeningTimes = [
  { opens: "9", closes: "10", selfservice: true },
  { opens: "10", closes: "17", selfservice: false },
  { opens: "17", closes: "18", selfservice: true }
];

var getWeekForDate = function (date) {
  var weekModel = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

  return weekModel.map(function (_, index) {
    var first = date.getDate() - date.getDay() + (index + 1);
    var day = new Date(date.setDate(first)).toISOString().slice(0, 10);

    var dayArray = day.split('-').reverse();
    var yearRemoved = dayArray.slice(0, -1);
    var dateString = yearRemoved.join('.')

    return dateString
  });
};

var getWeekNumber = function (date) {
  var oneJan = new Date(date.getFullYear(), 0, 1);

  return Math.ceil((((date.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
};

$.mockjax([{
  url: '/finna/tags',
  type: 'GET',
  responseTime: 2000,
  response: function () {
    this.responseText = {
      'tags': mockTags
    };
  }
},
{
  url: '/finna/tags',
  type: 'POST',
  responseTime: 1000,
  response: function (settings) {
    mockTags.push({
      id: Math.floor(Math.random() * 100 + 1).toString(),
      value: JSON.parse(settings.data).tag
    });

    this.responseText = {
      'status': 'OK'
    };
  }
},
{
  url: '/finna/tags',
  type: 'DELETE',
  responseTime: 1000,
  response: function (settings) {
    var deleteTagId = JSON.parse(settings.data).id;

    var newTags = mockTags.filter(function (tag) {
      return tag.id !== deleteTagId;
    });

    mockTags = newTags.slice(0);

    this.responseText = {
      'status': 'OK'
    };
  }
},
{
  url: VuFind.path + '/AJAX/JSON',
  data: { method: 'getOrganisationInfo', params: { action: 'consortium' } },
  type: 'GET',
  responseTime: 1000,
  response: function () {
    var week = getWeekForDate(new Date);
    var weekNumber = getWeekNumber(new Date);

    this.responseText = {
      data: {
        consortium: {
          name: "Vaski-kirjastot",
          description: "<p>Vaski-kirjastot ovat varsinaissuomalaisten kirjastojen yhteenliittym\u00e4. Vaski-kirjastoilla on yhteinen verkkokirjasto, kirjastokortti, k\u00e4ytt\u00f6s\u00e4\u00e4nn\u00f6t ja yhteisk\u00e4ytt\u00f6inen kokoelma. Vaski-kirjastot tarjoavat asiakkaille koko Vaski-alueen aineiston ja ammattitaidon. Vaskiin kuuluu 50 kirjastoa ja 7&nbsp;kirjastoautoa.</p>",
          homepageLabel: "vaski.finna.fi",
          homepage: "https://vaski.finna.fi/",
          logo: {
            small: "https://kirkanta.kirjastot.fi/files/logos/small/5f4dff8dcb641578397306.png"
          },
          finna: {
            usage_info: "<p>Vaski-kirjastoista lainaamiseen tarvitset aina kirjastokortin. Henkil\u00f6kohtaisen kirjastokortin ja tunnusluvun saat kaikista Vaski-kirjastoista esitt\u00e4m\u00e4ll\u00e4 kuvallisen henkil\u00f6llisyystodistuksen ja sitoutumalla kirjaston k\u00e4ytt\u00f6s\u00e4\u00e4nt\u00f6ihin. Ensimm\u00e4inen kirjastokortti on maksuton, sen j\u00e4lkeen annetusta kirjastokortista perit\u00e4\u00e4n maksu. Sama kirjastokortti k\u00e4y kaikissa Vaski-kirjastoissa ja voit palauttaa aineiston mihin tahansa Vaski-kirjastoon.</p>",
            notification: null,
            finna_coverage: "99",
            usage_perc: "99",
            finnaLink: [
              {
                name: "Asiakkaana kirjastossa",
                value: "https://vaski.finna.fi/Content/asiakkaana"
              },
              {
                name: "E-aineistot",
                value: "https://vaski.finna.fi/Content/eaineistot"
              },
              {
                name: "vaskikirjastot.fi",
                value: "http://www.vaskikirjastot.fi/"
              }
            ],
            service_point: 85141
          },
          id: 2115
        },
        list: [
          {
            id: 85968,
            name: "Askaisten kirjasto",
            shortName: "Askainen",
            slug: "askainen",
            type: "municipal",
            mobile: 0,
            email: "askaisten.kirjasto@masku.fi",
            homepage: "https://www.masku.fi/vapaa-aika/kirjastopalvelut/",
            address: {
              street: "Vesil\u00e4ntie 3",
              zipcode: "21240",
              city: "Masku",
              coordinates: { lat: 60.5724247, lon: 21.8653932 }
            },
            routeUrl: "https://opas.matka.fi/?to=Vesil%C3%A4ntie%203,%20Masku",
            mapUrl: "http://maps.google.com/?q=Vesil%C3%A4ntie%203%20Masku",
            openTimes: {
              schedules: [
                {
                  date: week[0],
                  times: mockOpeningTimes,
                  day: "Ma",
                  today: true
                },
                {
                  date: week[1],
                  times: mockOpeningTimes,
                  day: "Ti"
                },
                {
                  date: week[2],
                  times: mockOpeningTimes,
                  day: "Ke"
                },
                {
                  date: week[3],
                  times: mockOpeningTimes,
                  day: "To"
                },
                {
                  date: week[4],
                  times: mockOpeningTimes,
                  day: "Pe"
                },
                {
                  date: week[5],
                  times: mockOpeningTimes,
                  day: "La"
                },
                {
                  date: week[6],
                  times: mockOpeningTimes,
                  day: "Su"
                }
              ],
              openToday: mockOpeningTimes,
              currentWeek: true,
              openNow: 2
            },
            openNow: true
          },
          {
            id: 85141,
            name: "Turun p\u00e4\u00e4kirjasto",
            shortName: "Turku",
            slug: "paakirjasto-turku",
            type: "municipal",
            mobile: 0,
            email: "kaupunginkirjasto@turku.fi",
            homepage: "http://www.turku.fi/turun-kaupunginkirjasto",
            address: {
              street: "Linnankatu 2",
              zipcode: "20100",
              city: "Keskusta (Turku)",
              coordinates: { lat: 60.4504634, lon: 22.2708644 }
            },
            routeUrl: "https://opas.matka.fi/?to=Linnankatu%202,%20Turku",
            mapUrl: "http://maps.google.com/?q=Linnankatu%202%20Turku",
            openTimes: {
              schedules: [
                {
                  date: week[0],
                  times: mockOpeningTimes,
                  day: "Ma",
                  today: true
                },
                {
                  date: week[1],
                  times: mockOpeningTimes,
                  day: "Ti"
                },
                {
                  date: week[2],
                  times: mockOpeningTimes,
                  day: "Ke"
                },
                {
                  date: week[3],
                  times: mockOpeningTimes,
                  day: "To"
                },
                {
                  date: week[4],
                  times: mockOpeningTimes,
                  day: "Pe"
                },
                {
                  date: week[5],
                  times: mockOpeningTimes,
                  day: "La"
                },
                {
                  date: week[6],
                  times: mockOpeningTimes,
                  day: "Su"
                }
              ],
              openToday: mockOpeningTimes,
              currentWeek: true,
              openNow: 1
            },
            openNow: true
          }
        ],
        id: "85141",
        weekNum: weekNumber
      }
    }
  }
}
]);
