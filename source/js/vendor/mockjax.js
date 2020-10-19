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
  data: { method: 'getOrganisationPageFeed' },
  type: 'POST',
  responseTime: 1000,
  response: function (settings) {
    this.responseText = {
      data: {
        html: "<!-- START of: finna - ajax/feed-grid.phtml -->\n<div class=\"feed-grid with-image\">\n            <div class=\"grid-item  \">\n      <a class=\"grid-link\" href=\"&#x2F;FeedContent&#x2F;organisation-info-events&#x2F;https&#x25;253A&#x25;252F&#x25;252Ftapahtumat.vaskikirjastot.fi&#x25;252F&#x25;253Fpost_type&#x25;253Dtribe_events&#x25;2526p&#x25;253D22353&#x3F;feedUrl&#x3D;https&#x25;3A&#x25;2F&#x25;2Ftapahtumat.vaskikirjastot.fi&#x25;2F&#x25;3Fpost_type&#x25;3Dtribe_events&#x25;26kunta&#x25;3Dturku-fi&#x25;26lang&#x25;3Dfi&#x25;26order&#x25;3Dasc&#x25;26feed&#x25;3Drss2\" data-lightbox=\"\" data-lightbox-title=\"Soile&#x20;Viljanen&#x3A;&#x20;Neli&#xF6;tiloja&#x20;1.10.&#x20;&#x2013;&#x20;31.10.2020\">\n                  <span class=\"grid-image \">\n                          <img src=\"https://i2.wp.com/tapahtumat.vaskikirjastot.fi/wp-content/uploads/2020/09/prinsessa.jpg?fit=500%2C500&ssl=1\" alt=\"\" />\n                      </span>\n                <span class=\"grid-info\">\n                    <div class=\"title\">Soile Viljanen: Neli\u00f6tiloja 1.10. \u2013 31.1...</div>\n                                          <div class=\"xcal\"><i class=\"fa fa-map-marker\" aria-label=\"Sijainti\"></i>Nummen kirjasto</div>\n                            </span>\n      </a>\n    </div>\n          <div class=\"grid-item  \">\n      <a class=\"grid-link\" href=\"&#x2F;FeedContent&#x2F;organisation-info-events&#x2F;https&#x25;253A&#x25;252F&#x25;252Ftapahtumat.vaskikirjastot.fi&#x25;252F&#x25;253Fpost_type&#x25;253Dtribe_events&#x25;2526p&#x25;253D22478&#x3F;feedUrl&#x3D;https&#x25;3A&#x25;2F&#x25;2Ftapahtumat.vaskikirjastot.fi&#x25;2F&#x25;3Fpost_type&#x25;3Dtribe_events&#x25;26kunta&#x25;3Dturku-fi&#x25;26lang&#x25;3Dfi&#x25;26order&#x25;3Dasc&#x25;26feed&#x25;3Drss2\" data-lightbox=\"\" data-lightbox-title=\"Kirjallisia&#x20;paikkoja&#x20;-valokuvan&#xE4;yttely&#x20;2.10.-1.11.\">\n                  <span class=\"grid-image \">\n                          <img src=\"https://i2.wp.com/tapahtumat.vaskikirjastot.fi/wp-content/uploads/2020/10/4.-Doblinin-Berliini-002.jpg?fit=500%2C191&ssl=1\" alt=\"\" />\n                      </span>\n                <span class=\"grid-info\">\n                    <div class=\"title\">Kirjallisia paikkoja -valokuvan\u00e4yttely 2...</div>\n                                          <div class=\"xcal\"><i class=\"fa fa-map-marker\" aria-label=\"Sijainti\"></i>Turun p\u00e4\u00e4kirjasto</div>\n                            </span>\n      </a>\n    </div>\n    </div>\n<button class=\"btn btn-primary show-more-feeds hidden\">Lis\u00e4\u00e4</button>\n<button class=\"btn btn-primary show-less-feeds hidden\">V\u00e4hemm\u00e4n</button>\n<!-- END of: finna - ajax/feed-grid.phtml -->\n",
        settings: { type: "grid", modal: true }
      }
    }
  }
},
]);
