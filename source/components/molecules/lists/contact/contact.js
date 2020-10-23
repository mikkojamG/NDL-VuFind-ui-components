/*global finna */
finna.organisationContactList = (function organisationContactList() {
  var $holder, $list;
  var dynamicItems, service;

  var appendContactItems = function appendContactItems(data) {
    data.forEach(function forEachContactItem(item) {
      var $li = $list.find('li.' + item.class);

      $li.find('.contact-content').html(item.content);
    });

    $holder.find('.js-loader').addClass('hide');
    $list.removeClass('hide');
  };

  var getContactItems = function getContactItems() {
    var parent = $holder.data('parent');
    var id = $holder.data('organisation-id');

    service.getOrganisations('page', parent, [], {}, function onOrganisationsLoaded() {
      service.getSchedules('page', parent, id, null, null, false, false, function onSchedulesLoaded(res) {
        var contactData = dynamicItems.filter(function filterItem(item) {
          if (res[item.dynamicKey]) {
            var contactDataObject = Object.assign(item, { content: res[item.dynamicKey] });

            return contactDataObject;
          }
        });

        appendContactItems(contactData);
      });
    });
  };

  return {
    getContactItems: getContactItems,
    init: function init(_holder, _service, _items) {
      $holder = _holder;
      $list = $holder.find('.js-contact-list');

      service = _service;
      dynamicItems = _items;
    }
  }
})();
