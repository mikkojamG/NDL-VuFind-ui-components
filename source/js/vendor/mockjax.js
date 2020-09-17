var mockTags = [{
  id: '1',
  value: 'Testing 1'
},
{
  id: '2',
  value: 'Testing 2'
}
];

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
  response: function () {
    this.responseText = {
      data: {
        phone: "<ul>\n<li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:02&#x20;262&#x20;0625\">02 262 0625</a> / Lasten Saaga</p></li>\n</ul>\n",
        pictures: [
          {
            "url": "https://kirkanta.kirjastot.fi/files/photos/medium/paakirjasto-57f346b5380ff.jpg",
            "size": 254909,
            "resolution": "1500x1000"
          },
        ],
        slogan: "Turun p\u00e4\u00e4kirjasto tarjoaa asiakkailleen viihtyis\u00e4n paikan, jossa ihmiset, tieto ja mielikuvitus kohtaavat.",
        description: "<p>Rakennettu 1903, uudisosa 2007.</p>",
        links: [
          {
            "name": "Facebook",
            "url": "https://www.facebook.com/turunkaupunginkirjasto/"
          },
          {
            "name": "Kirjaston kotisivut",
            "url": "http://www.turku.fi/turun-kaupunginkirjasto"
          }
        ],
        services: ["wifi", "print"],
        allServices: {
          room: [
            ["Esiintymislava"],
            {
              "0": "Kokoustila ja opetustila",
              "shortDesc": "<p>Tarkista kotisivuilta <a href=\"https://www.turku.fi/turun-kaupunginkirjasto/palvelut/vuokrattavat-tilat-paakirjastossa\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">vuokrattavat tilat</a></p>"
            },
          ],
          service: [
            ["Caf\u00e9 Sirius"],
            {
              "0": "Kotipalvelu",
              "shortDesc": "<p>Lis\u00e4tietoa <a href=\"https://www.turku.fi/turun-kaupunginkirjasto/palvelut/omakirjasto\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">Omakirjasto-palvelusta</a></p>"
            },
            {
              "0": "Langaton verkko (Wi-Fi)",
              "shortDesc": "Turku-Open. Verkkoon p\u00e4\u00e4see kirjautumaan kuukausittain vaihtuvilla yleistunnuksilla (esill\u00e4 asiakaspalvelutiskeill\u00e4)."
            },
          ],
          hardware: [
            {
              "0": "3D-tulostin",
              "shortDesc": "<p>\u2022  3D-tulostinta voi k\u00e4ytt\u00e4\u00e4 uutistorilla. Ajanvaraus <a href=\"https://varaamo.turku.fi\" rel=\"nofollow noreferrer noopener\" target=\"_blank\">Varaamosta</a></p>"
            },
          ]
        },
        rss: [
          {
            "id": "events",
            "url": "https://tapahtumat.vaskikirjastot.fi/?post_type=tribe_events&kunta=turku-fi&lang=fi&order=asc&feed=rss2"
          },
          {
            "id": "news",
            "url": "https://tapahtumat.vaskikirjastot.fi/?post_type=uutinen&kunta=turku-fi&lang=fi&order=asc&feed=rss2"
          }
        ],
        id: "85141",
        periodStart: "2020-09-14",
        scheduleDescriptions: [
          "Lasten Saaga ja nuorten Stoori ovat koulujen lukuvuoden aikana varattu etuk\u00e4teen sovituille ryhmille ma-pe klo 9-10."
        ],
        weekNum: "38"
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
    this.responseText = {
      data: {
        consortium: {
          name: "Vaski-kirjastot", "description": "<p>Vaski-kirjastot ovat varsinaissuomalaisten kirjastojen yhteenliittym\u00e4. Vaski-kirjastoilla on yhteinen verkkokirjasto, kirjastokortti, k\u00e4ytt\u00f6s\u00e4\u00e4nn\u00f6t ja yhteisk\u00e4ytt\u00f6inen kokoelma. Vaski-kirjastot tarjoavat asiakkaille koko Vaski-alueen aineiston ja ammattitaidon. Vaskiin kuuluu 50 kirjastoa ja 7&nbsp;kirjastoautoa.<\/p>", "homepageLabel": "vaski.finna.fi", "homepage": "https:\/\/vaski.finna.fi\/", "logo": { "small": "https:\/\/kirkanta.kirjastot.fi\/files\/logos\/small\/5f4dff8dcb641578397306.png" },
          finna: {
            "usage_info": "<p>Vaski-kirjastoista lainaamiseen tarvitset aina kirjastokortin. Henkil\u00f6kohtaisen kirjastokortin ja tunnusluvun saat kaikista Vaski-kirjastoista esitt\u00e4m\u00e4ll\u00e4 kuvallisen henkil\u00f6llisyystodistuksen ja sitoutumalla kirjaston k\u00e4ytt\u00f6s\u00e4\u00e4nt\u00f6ihin. Ensimm\u00e4inen kirjastokortti on maksuton, sen j\u00e4lkeen annetusta kirjastokortista perit\u00e4\u00e4n maksu. Sama kirjastokortti k\u00e4y kaikissa Vaski-kirjastoissa ja voit palauttaa aineiston mihin tahansa Vaski-kirjastoon.<\/p>", "notification": null, "finna_coverage": "99", "usage_perc": "99", "finnaLink": [{ name: "Asiakkaana kirjastossa", "value": "https:\/\/vaski.finna.fi\/Content\/asiakkaana" },
            { name: "E-aineistot", "value": "https:\/\/vaski.finna.fi\/Content\/eaineistot" },
            { name: "vaskikirjastot.fi", "value": "http:\/\/www.vaskikirjastot.fi\/" }], "service_point": 85141
          },
          id: 2115
        },
        list: [{
          id: 85968, name: "Askaisten kirjasto", "shortName": "Askainen", "slug": "askainen", "type": "municipal", "mobile": 0, "email": "askaisten.kirjasto@masku.fi", "homepage": "https:\/\/www.masku.fi\/vapaa-aika\/kirjastopalvelut\/", "address": { "street": "Vesil\u00e4ntie 3", "zipcode": "21240", "city": "Masku", "coordinates": { "lat": 60.5724247, "lon": 21.8653932 } },
          routeUrl: "https:\/\/opas.matka.fi\/?to=Vesil%C3%A4ntie%203,%20Masku", mapUrl: "http:\/\/maps.google.com\/?q=Vesil%C3%A4ntie%203%20Masku", openTimes: {
            schedules: [{ date: "14.9.", times: [{ opens: "15", closes: "19", selfservice: false }], day: "Ma" },
            { date: "15.9.", times: [], day: "Ti", closed: true },
            { date: "16.9.", times: [{ opens: "15", closes: "19", selfservice: false }], day: "Ke" },
            { date: "17.9.", times: [{ opens: "12", closes: "16", selfservice: false }], day: "To", "today": true },
            { date: "18.9.", times: [], day: "Pe", closed: true },
            { date: "19.9.", times: [], day: "La", closed: true },
            { date: "20.9.", times: [], day: "Su", closed: true }], openToday: [{ opens: "12", closes: "16", selfservice: false }], currentWeek: true, openNow: 0
          },
          openNow: false
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
                date: "14.9.",
                times: [{
                  opens: "9", closes: "20", selfservice: false
                }],
                day: "Ma"
              },
              {
                date: "15.9.",
                times: [{
                  opens: "9", closes: "20", selfservice: false
                }],
                day: "Ti"
              },
              {
                date: "16.9.",
                times: [{
                  opens: "9", closes: "20", selfservice: false
                }],
                day: "Ke"
              },
              {
                date: "17.9.",
                times: [{
                  opens: "9", closes: "20", selfservice: false
                }],
                day: "To",
                today: true
              },
              {
                date: "18.9.",
                times: [{
                  opens: "9", closes: "20", selfservice: false
                }],
                day: "Pe"
              },
              {
                date: "19.9.",
                times: [{
                  opens: "11", closes: "17", selfservice: false
                }],
                day: "La"
              },
              {
                date: "20.9.",
                times: [{
                  opens: "11", closes: "17", selfservice: false
                }],
                day: "Su"
              }
            ],
            openToday: [{ opens: "9", closes: "20", selfservice: false }],
            currentWeek: true,
            openNow: 1
          },
          openNow: true
        }],
        id: "85141", weekNum: "38"
      }
    }
  }
}
]);
