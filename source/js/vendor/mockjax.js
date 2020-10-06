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
              day: "Ma"
            },
            {
              date: week[1],
              times: mockOpeningTimes,
              day: "Ti",
              today: true
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
        "emails": "<ul>\n  <li><p><i class=\"fa fa-envelope\"></i><a href=\"mailto:kaupunginkirjasto&#x40;turku.fi\">kaupunginkirjasto@turku.fi</a></p></li>\n</ul>\n",
        pictures: [
          {
            url: "https://kirkanta.kirjastot.fi/files/photos/medium/paakirjasto-57f346b5380ff.jpg",
            size: 254909,
            resolution: "1500x1000"
          },
          {
            url: "https://kirkanta.kirjastot.fi/files/photos/medium/viljami-schleutker-(2)-51768bfe.jpg",
            size: 1373315,
            resolution: "1571x1000"
          },
          {
            url: "https://kirkanta.kirjastot.fi/files/photos/medium/a-dsc6961-57f20f6b02f3f.jpg",
            size: 1639538,
            resolution: "1503x1000"
          },
          {
            url: "https://kirkanta.kirjastot.fi/files/photos/medium/p\u00e4\u00e4kirjasto-linnankatu-57f37fbf9a3ed.jpg",
            size: 164448,
            resolution: "1000x1027"
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
        allServices: {
          room: [
            ["Esiintymislava"],
            {
              0: "Kokoustila ja opetustila",
              shortDesc: "<p>Tarkista kotisivuilta <a href=\"https://www.turku.fi/turun-kaupunginkirjasto/palvelut/vuokrattavat-tilat-paakirjastossa\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">vuokrattavat tilat</a></p>"
            },
            ["Lukusali"],
            ["N\u00e4yttelytila"],
            {
              0: "Ryhm\u00e4ty\u00f6tila",
              shortDesc: "<p>Peli- ja ryhm\u00e4ty\u00f6huone 13-19 -vuotiaille. Ryhm\u00e4ty\u00f6tilan ajanvaraus <a href=\"https://varaamo.turku.fi\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">Varaamosta</a></p>"
            },
            {
              0: "Soittohuone",
              shortDesc: "<p>Soittohuoneen ajanvaraus <a href=\"https://varaamo.turku.fi\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">Varaamosta</a></p>"
            }
          ],
          "service": [
            ["Caf\u00e9 Sirius"],
            {
              0: "Kotipalvelu",
              shortDesc: "<p>Lis\u00e4tietoa <a href=\"https://www.turku.fi/turun-kaupunginkirjasto/palvelut/omakirjasto\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">Omakirjasto-palvelusta</a></p>"
            },
            {
              0: "Langaton verkko (Wi-Fi)",
              shortDesc: "Turku-Open. Verkkoon p\u00e4\u00e4see kirjautumaan kuukausittain vaihtuvilla yleistunnuksilla (esill\u00e4 asiakaspalvelutiskeill\u00e4)."
            },
            ["Musiikin kuuntelumahdollisuus"],
            {
              0: "Palautusluukku",
              "desc": "Aineiston palauttaminen palautusluukun kautta on omalla vastuullasi. Palautusluukun kautta palautetuista lainoista et saa kuittia, koska lainat eiv\u00e4t t\u00e4t\u00e4 kautta kirjaudu palautuneiksi   kirjastoj\u00e4rjestelm\u00e4\u00e4n. Lainat kirjataan palautuneiksi vasta seuraavana kirjaston aukiolop\u00e4iv\u00e4n\u00e4. Aineistosta kertyy my\u00f6h\u00e4stymismaksuja palautusten kirjaamiseen saakka."
            },
            {
              0: "Varausten itsepalvelunouto",
              shortDesc: "Varaukset voi noutaa ja lainata omatoimisesti varausnumerolla p\u00e4\u00e4kirjaston vastaanotosta."
            }
          ],
          hardware: [
            {
              0: "3D-tulostin",
              shortDesc: "<p>\u2022  3D-tulostinta voi k\u00e4ytt\u00e4\u00e4 uutistorilla. Ajanvaraus <a href=\"https://varaamo.turku.fi\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">Varaamosta</a></p>"
            },
            {
              0: "Digitointilaite",
              shortDesc: "Musiikkiosastolla on mahdollista digitoida VHS-kasetteja, LP-levyj\u00e4, C-kasetteja, dioja ja kuvia."
            },
            { 0: "Elektroninen suurennuslaite", shortDesc: "Uutistorilla" },
            ["Kirkasvalolamppu"],
            {
              0: "Kopiokone, tulostin ja skanneri",
              shortDesc: "Uutistorilla on v\u00e4ritulostin, kopiokone ja skanneri. Tieto-osastolla on mustavalkotulostin"
            },
            {
              0: "Mikrokortin/-filmin lukulaite",
              shortDesc: "<p>Tieto-osastolla. Lukulaitteen ajanvaraus <a href=\"https://varaamo.turku.fi\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">Varaamosta</a></p>"
            },
            {
              0: "Mobiililaitteiden lataus",
              shortDesc: "Uutistorilla ja tieto-osastolla"
            },
            {
              0: "Tietokoneet",
              shortDesc: "<p><a href=\"http://www.eb2.dpg.fi/vaski/\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">eBooking</a></p>",
              "desc": "<p><a href=\"http://www.eb2.dpg.fi/vaski/\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">eBooking</a></p>"
            }
          ]
        },
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
