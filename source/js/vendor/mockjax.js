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
        phone: "<ul>\n  <li><p><i class=\"fa fa-phone-square\"></i><a href=\"tel:02&#x20;9412&#x20;3196\">02 9412 3196</a> / Asiakaspalvelu</p></li>\n</ul>\n",
        emails: "<ul>\n  <li><p><i class=\"fa fa-envelope\"></i><a href=\"mailto:kk-palvelu&#x40;helsinki.fi\">kk-palvelu@helsinki.fi</a></p></li>\n</ul>\n",
        pictures: [
          {
            url: "https://kirkanta.kirjastot.fi/files/photos/medium/kanki-k-590867ab71c76.jpg",
            size: 643166,
            resolution: "1543x1000"
          },
          {
            url: "https://kirkanta.kirjastot.fi/files/photos/medium/kanki8-k-590867f193450.jpg",
            size: 458578,
            resolution: "1498x1000"
          },
          {
            url: "https://kirkanta.kirjastot.fi/files/photos/medium/kanki3-k-5908677567274.jpg",
            size: 679768,
            resolution: "1498x1000"
          }
        ],
        slogan: "Kansakunnan aarteet kaikille",
        links: [
          { name: "Twitter", url: "https://twitter.com/NatLibFi" },
          {
            name: "Instagram",
            url: "https://www.instagram.com/kansalliskirjasto/"
          },
          {
            name: "Facebook",
            url: "https://www.facebook.com/Kansalliskirjasto/"
          },
          {
            name: "Kirjaston kotisivut",
            url: "http://www.kansalliskirjasto.fi/"
          }
        ],
        id: "86154",
        periodStart: "2020-09-14",
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
          name: "Kansalliskirjasto",
          description: "<p>Kansalliskirjasto on humanististen tieteiden kirjasto jonka kokoelmiin kuuluu laajat historialliset aineistot sek\u00e4 kattavasti suomalainen julkaisutuotanto.</p>",
          homepageLabel: "www.kansalliskirjasto.fi",
          homepage: "https://www.kansalliskirjasto.fi/",
          logo: {
            small: "https://kirkanta.kirjastot.fi/files/logos/small/5bf5a8a4e6a1f840110994.png"
          },
          finna: {
            usage_info: "<p>Kansalliskirjaston kokoelman perustan muodostaa kotimaisten julkaisujen arkistokokoelma. Kansalliskirjaston ulkomaiset kokoelmat kytkev\u00e4t Suomen tieteen ja kulttuurin eurooppalaisiin ja kansainv\u00e4lisiin yhteyksiins\u00e4.&nbsp;</p><p>Humanistisen kokoelman kirjat ovat historiantutkimuksen, taiteiden tutkimuksen ja filosofian aloilta.&nbsp;Slaavilaisen kirjaston kirjat k\u00e4sittelev\u00e4t p\u00e4\u00e4asiassa Ven\u00e4j\u00e4\u00e4 ja muita slaavilaisia maita, kansoja ja kulttuureja.</p><p>Kansalliskokoelma sis\u00e4lt\u00e4\u00e4 kattavasti suomalaiset julkaisut. Ne on luetteloitu&nbsp;<i>Fennica</i>-&nbsp;ja <i>Viola</i>-tietokantoihin. N\u00e4m\u00e4 aineistot palvelevat&nbsp;etup\u00e4\u00e4ss\u00e4 tutkimustarkoitusta, ja ovat&nbsp;k\u00e4ytett\u00e4viss\u00e4 ainoastaan Kansalliskirjaston lukusaleissa.</p><p>Kansalliskirjasto on digitoinut kotimaisia <a href=\"http://digi.kansalliskirjasto.fi/\">aikakaus- ja sanomalehti\u00e4</a>, <a href=\"https://www.doria.fi/handle/10024/4194\">arjen painatteita, varhaisimpia \u00e4\u00e4nitteit\u00e4 sek\u00e4 kirjoja ja karttoja</a>. N\u00e4m\u00e4 ovat&nbsp;mukana Finnan hakutuloksissa, mutta l\u00f6ytyv\u00e4t my\u00f6s kyseisten aineistojen omista hakuliittymist\u00e4 (linkit edell\u00e4).</p><p><i>Arto </i>on kotimaisten artikkelien viitetietokanta. Se sis\u00e4lt\u00e4\u00e4&nbsp;runsaasti linkkej\u00e4 artikkeleiden kokoteksteihin, mutta ei lainkaan lainattavien aineistojen saatavuustietoja.&nbsp; Artikkelin tiedoissa on kuitenkin linkki julkaisun tietoihin, joista voi tarkistaa julkaisun saatavuuden eri kirjastoissa. Suuri osa kokoteksteist\u00e4, mm. Elektra-aineisto, vaatii k\u00e4ytt\u00f6luvan. T\u00e4ll\u00e4 hetkell\u00e4 aineistot ovat k\u00e4ytett\u00e4viss\u00e4 mm. yleisiss\u00e4 kirjastoissa sek\u00e4 ammattikorkeakoulujen ja useimpien yliopistojen paikallisverkoissa, mkl. Kansalliskirjasto. Elektran julkaisujen viitetiedot ovat vapaasti selattavissa, mutta itse sis\u00e4lt\u00f6jen k\u00e4ytt\u00f6 edellytt\u00e4\u00e4 sopimusta.</p><p><i>Doria </i>on julkaisuarkisto joka tarjoaa sek\u00e4 digitoituja kulttuuriperint\u00f6aineistoja, ett\u00e4 tuoreempia tutkielmia, raportteja yms.</p><p>&nbsp;</p>",
            notification: null,
            finna_coverage: null,
            usage_perc: null,
            finnaLink: [
              {
                name: "kansalliskirjasto.finna.fi",
                value: "https://kansalliskirjasto.finna.fi/"
              },
              {
                name: "Lis\u00e4tietoa kokoelmista",
                value: "https://www.kansalliskirjasto.fi/fi/collections/search"
              },
              {
                name: "Lis\u00e4tietoa aineistojen k\u00e4yt\u00f6st\u00e4",
                value: "https://www.kansalliskirjasto.fi/fi/aineistot/aineiston-saatavuus-ja-kaytto"
              },
              {
                name: "Digitoidut sanoma- ja aikakauslehdet",
                value: "http://digi.kansalliskirjasto.fi/"
              },
              {
                name: "Digitoidut kirjat, kartat, pienpainatteet, musiikki",
                value: "http://www.doria.fi/handle/10024/4194"
              }
            ],
            service_point: 86154
          },
          id: 2184
        },
        list: [
          {
            id: 86154,
            name: "Kansalliskirjasto",
            shortName: null,
            slug: "kansalliskirjasto",
            type: "university",
            mobile: 0,
            email: "kk-palvelu@helsinki.fi",
            homepage: "https://www.facebook.com/Kansalliskirjasto/",
            address: {
              street: "Unioninkatu 36",
              zipcode: "00170",
              city: "Helsinki",
              coordinates: { "lat": 60.17037, "lon": 24.95034 }
            },
            routeUrl: "https://opas.matka.fi/?to=Unioninkatu%2036,%20Helsinki",
            mapUrl: "http://maps.google.com/?q=Unioninkatu%2036%20Helsinki",
            openTimes: {
              schedules: [
                {
                  date: "14.9.",
                  times: [
                    { opens: "9", closes: "10", selfservice: true },
                    { opens: "10", closes: "17", selfservice: false },
                    { opens: "17", closes: "18", selfservice: true }
                  ],
                  day: "Ma"
                },
                {
                  date: "15.9.",
                  times: [
                    { opens: "9", closes: "10", selfservice: true },
                    { opens: "10", closes: "17", selfservice: false },
                    { opens: "17", closes: "18", selfservice: true }
                  ],
                  day: "Ti"
                },
                {
                  date: "16.9.",
                  times: [
                    { opens: "9", closes: "10", selfservice: true },
                    { opens: "10", closes: "17", selfservice: false },
                    { opens: "17", closes: "18", selfservice: true }
                  ],
                  day: "Ke"
                },
                {
                  date: "17.9.",
                  times: [
                    { opens: "9", closes: "10", selfservice: true },
                    { opens: "10", closes: "17", selfservice: false },
                    { opens: "17", closes: "18", selfservice: true }
                  ],
                  day: "To",
                  today: true
                },
                {
                  date: "18.9.",
                  times: [
                    { opens: "9", closes: "10", selfservice: true },
                    { opens: "10", closes: "17", selfservice: false },
                    { opens: "17", closes: "18", selfservice: true }
                  ],
                  day: "Pe"
                },
                { date: "19.9.", times: [], day: "La", "closed": true },
                { date: "20.9.", times: [], day: "Su", "closed": true }
              ],
              openToday: [
                { opens: "9", closes: "10", selfservice: true },
                { opens: "10", closes: "17", selfservice: false },
                { opens: "17", closes: "18", selfservice: true }
              ],
              currentWeek: true,
              openNow: 2
            },
            openNow: true
          }
        ],
        id: "86154",
        weekNum: "38"
      }
    }
  }
}
]);
