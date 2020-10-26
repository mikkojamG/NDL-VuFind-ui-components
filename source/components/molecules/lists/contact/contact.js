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

  var getOrganisations = function getOrganisations(parent) {
    var deferred = $.Deferred();

    service.getOrganisations('page', parent, [], {}, function onOrganisationsLoaded(res) {
      if (res) {
        deferred.resolve(res);
      } else {
        deferred.reject();
      }
    });

    return deferred.promise();
  };

  var getSchedules = function getSchedules(parent, id) {
    var deferred = $.Deferred();

    service.getSchedules('page', parent, id, null, null, true, true, function onSchedulesLoaded(res) {
      if (res) {
        deferred.resolve(res);
      } else {
        deferred.reject();
      }
    });

    return deferred.promise();
  };

  var getContactItems = function getContactItems() {
    var parent = $holder.data('parent');
    var id = $holder.data('organisation-id');

    getOrganisations(parent)
      .then(function onOrganisationsResolve() {
        getSchedules(parent, id)
          .then(function onSchedulesResolve() {
            var data = service.getDetails(id);

            var contactData = dynamicItems.filter(function filterItem(item) {
              if (data[item.dynamicKey] || data.details[item.dynamicKey]) {

                var contactDataObject

                if (data[item.dynamicKey]) {
                  contactDataObject = Object.assign(item, { content: data[item.dynamicKey] });
                } else {
                  contactDataObject = Object.assign(item, { content: data.details[item.dynamicKey] });
                }

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
});
