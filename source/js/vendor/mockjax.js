var mockTags = [{
  id: '1',
  value: 'Testing 1'
},
{
  id: '2',
  value: 'Testing 2'
}
];

var mockKeywords = {
  data: [
    'Testing 1',
    'Testing 2'
  ]
}

$.mockjax([
  {
    url: VuFind.path + '/AJAX/JSON?method=editList',
    type: 'POST',
    responseTime: 2000,
    response: function (settings) {
      mockKeywords.data = settings.data.params.tags.slice(0);

      this.responseText = {
        data: mockKeywords.data
      }
    }
  }
]);
