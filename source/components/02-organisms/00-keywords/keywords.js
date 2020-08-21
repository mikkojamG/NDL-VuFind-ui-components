/*global VuFind, finna */
finna.keywords = (function keywords() {
  var updateCounter = function updateCounter() {
    var $keywords = $('.js-keyword');

    $('.js-keywords-counter').text($keywords.length);
  };


  var getCurrentTags = function getCurrentTags() {
    return $('.js-keyword').toArray().map(function mapTags(keyword) {
      return $(keyword);
    })
  };

  var updateTags = function updateTags(data) {
    var $keywords = $('.js-keywords-list');

    $keywords.empty();

    data.forEach(function forEachTag(tag) {
      var $keyword = $('<button></button>');
      $keyword.attr('data-tag-id', encodeURIComponent(tag));
      $keyword.attr('class', 'btn keyword js-keyword');

      $keyword.html('<span class="keyword-button-text">' + tag + '</span><i class="fa fa-times keyword-button-icon" aria-hidden="true"></i>');

      $keyword.on('click', deleteItem);

      $keywords.append($keyword);
      updateCounter();
    });
  }

  var deleteItem = function onDeleteItem() {
    var $this = $(this);
    var tagId = $this.data('tag-id');

    var editMode = $('.js-keywords-wrapper').hasClass('open');

    if (editMode) {
      var listParams = {};
      var currentTags = getCurrentTags();

      var modifyTags = currentTags.filter(function filterTags(tag) {
        return tag.data('tag-id') !== tagId;
      }).map(function mapTags(tag) {
        return $(tag).find('.keyword-button-text').text().trim();
      })

      listParams.tags = modifyTags;

      $.ajax({
        url: VuFind.path + '/AJAX/JSON?method=editList',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: { 'params': listParams }
      }).done(function onRequestDone(response) {
        updateTags(response.data);
      });
    }
  };

  var initDeleteKeyword = function deleteKeyword() {
    var $keywords = $('.js-keyword');

    $keywords.on('click', deleteItem);
  };

  var initAddKeyword = function initAddKeyword() {
    var $input = $('.js-keywords-wrapper').find('input[id="keyword"]');
    var $form = $('.js-add-keyword');

    $input.one('blur keydown', function onInputTouched() {
      $(this).addClass('touched');
    });

    $form.on('submit', function onSubmit(event) {
      event.preventDefault();

      $form.removeClass('invalid');

      if ($form[0].checkValidity()) {
        $('.js-spinner').show();

        var listParams = {};

        var currentTags = getCurrentTags().filter(function filterTags(tag) {
          return $(tag).find('.keyword-button-text').text().trim();
        });

        currentTags.push($input.val());
        listParams.tags = currentTags;

        $.ajax({
          url: VuFind.path + '/AJAX/JSON?method=editList',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: { 'params': listParams }
        }).done(function onRequestDone(response) {


          updateTags(response.data);
        });
      } else {
        $form.addClass('invalid');
      }
    });
  };

  var initToggle = function initToggle() {
    var $toggleModuleButton = $('.js-toggle-keywords');

    $toggleModuleButton.on('click', function onToggleModule() {
      $(this).toggleClass('open');
      $('.js-keywords-wrapper').toggleClass('open');
      $('.js-controls').toggleClass('open');
      $('.js-current').toggleClass('open');
    });
  };

  var init = function init() {
    initDeleteKeyword();
    initToggle();
    initAddKeyword();
  };

  return {
    init: init
  };
})();
