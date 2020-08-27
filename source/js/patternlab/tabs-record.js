/* global VuFind */
$(document).ready(function onDocumentReady() {
  var accordionTitleHeight = 64;

  var $menu = $('.js-records-tablist');
  var $accordions = $menu.find('.record-accordions .accordion-toggle');
  var $tabs = $menu.find('.recordTabs .record-tab');

  var getNewRecordTab = function getNewRecordTab(tabid) {
    return $('<div class="tab-pane ' + tabid + '-tab"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> ' + VuFind.translate('loading') + '...</div>');
  };

  var ajaxLoadTab = function ajaxLoadTab($newTab, tabid) {
    var data = {
      tab: tabid
    };

    return $.ajax({
      url: VuFind.path + '/AjaxTab',
      type: 'POST',
      data: data
    })
      .done(function ajaxLoadTabDone(res) {
        $newTab.html(res);
      });
  };

  var toggleAccordion = function toggleAccordion($accordion) {
    var tabid = $accordion.find('.accordion-toggle a').data('tab');
    var $recordTabs = $('.record-tabs');
    var $tabContent = $recordTabs.find('.tab-content');

    if (!$accordion.hasClass('active')) {
      $tabContent.insertAfter($accordion);

      var $recordAccordions = $menu.find('.record-accordions');

      $recordAccordions.find('.accordion.active').removeClass('active');

      $accordion.addClass('active');
      $recordTabs.find('.tab-pane.active').removeClass('active');

      if ($recordAccordions.is(':visible')) {
        $('html, body').animate({
          scrollTop: $accordion.offset().top - accordionTitleHeight
        }, 150);
      }

      var newTab = getNewRecordTab(tabid).addClass('active');
      $recordTabs.find('.tab-content').append(newTab);

      return ajaxLoadTab(newTab, tabid);
    }

    return false;
  };

  var initRecordAccordion = function initRecordAccordion() {
    $accordions.on('click', function accordionClicked(event) {
      toggleAccordion($(event.target).closest('.accordion'));
    });

    $tabs.on('click', function tabClicked() {
      var $this = $(this);
      var tabId = $this.data('tab');

      $tabs.removeClass('active').attr('aria-selected', false);

      $this.addClass('active').attr('aria-selected', true);

      var accordion = $('.accordion').toArray().filter(function filterAccordion(acc) {
        return $(acc).find('.accordion-toggle a').data('tab') === tabId;
      })[0];

      toggleAccordion($(accordion));
    })
  };

  if ($accordions.length && $tabs.length) {
    initRecordAccordion();
  }
});
