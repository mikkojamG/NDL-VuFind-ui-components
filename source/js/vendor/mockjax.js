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
  data: { method: 'getOrganisationInfo', params: { action: 'details' } },
  type: 'GET',
  responseTime: 1000,
  response: function (settings) {
    var week = getWeekForDate(new Date);
    var weekNumber = getWeekNumber(new Date);

    this.responseText = {
      data: {
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
              day: "Ti",
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
        phone: "<ul>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:02&#x20;262&#x20;0625\">02 262 0625</a> / Lasten Saaga</p></li>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:02&#x20;262&#x20;0626\">02 262 0626</a> / Nuorten Stoori</p></li>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:040&#x20;632&#x20;3207\">040 632 3207</a> / Musiikkiosasto</p></li>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:02&#x20;262&#x20;0629\">02 262 0629</a> / Mikrofilmilukulaitteiden varaukset</p></li>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:044&#x20;9075&#x20;272\">044 9075 272</a> / Kaukopalvelu</p></li>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:02&#x20;262&#x20;0621\">02 262 0621</a> / Uutistori</p></li>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:040&#x20;160&#x20;3615\">040 160 3615</a> / Tilavaraukset (Uutistori)</p></li>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:02&#x20;262&#x20;0624\">02 262 0624</a> / Vastaanotto</p></li>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:02&#x20;262&#x20;0630\">02 262 0630</a> / Tieto-osasto</p></li>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:02&#x20;262&#x20;0623\">02 262 0623</a> / Kirjallisuus ja taiteet</p></li>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:044&#x20;907&#x20;2942\">044 907 2942</a> / Vahtimestarit</p></li>\n</ul>\n",
        emails: "<ul>\n  <li><p><i class=\"fa fa-envelope\"></i><a href=\"mailto:kaupunginkirjasto&#x40;turku.fi\">kaupunginkirjasto@turku.fi</a></p></li>\n</ul>\n",
        pictures: [
          {
            url: "https://kirkanta.kirjastot.fi/files/photos/medium/paakirjasto-57f346b5380ff.jpg",
            size: 254909,
            resolution: "1500x1000"
          }
        ],
        slogan: "Turun p\u00e4\u00e4kirjasto tarjoaa asiakkailleen viihtyis\u00e4n paikan, jossa ihmiset, tieto ja mielikuvitus kohtaavat.",
        description: "<p>Rakennettu 1903, uudisosa 2007.</p>",
        links: [
          {
            name: "Facebook",
            url: "https://www.facebook.com/turunkaupunginkirjasto/"
          },
          {
            name: "Kirjaston kotisivut",
            url: "http://www.turku.fi/turun-kaupunginkirjasto"
          }
        ],
        services: ["wifi", "print"],
        rss: [
          {
            id: "events",
            url: "https://tapahtumat.vaskikirjastot.fi/?post_type=tribe_events&kunta=turku-fi&lang=fi&order=asc&feed=rss2"
          },
          {
            id: "news",
            url: "https://tapahtumat.vaskikirjastot.fi/?post_type=uutinen&kunta=turku-fi&lang=fi&order=asc&feed=rss2"
          }
        ],
        id: "85141",
        periodStart: "2020-10-05",
        scheduleDescriptions: [
          "Lasten Saaga ja nuorten Stoori ovat koulujen lukuvuoden aikana varattu etuk\u00e4teen sovituille ryhmille ma-pe klo 9-10."
        ],
        weekNum: weekNumber
      }
    }
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
          finna: {
            service_point: 85141
          },
        },
        list: [
          {
            id: 85968,
            name: "Askaisten kirjasto",
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
