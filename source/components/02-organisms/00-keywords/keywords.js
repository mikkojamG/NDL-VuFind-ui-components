/*global VuFind, finna */
finna.keywords = (function keywords() {
  var updateCounter = function updateCounter() {
    var $keywords = $('.js-keyword');

    $('.js-keywords-counter').text($keywords.length);
  };


  var getKeywordsArray = function getKeywordsArray() {
    return $('.js-keyword').toArray();
  };

  var updateKeywords = function updateKeywords(keywordsArray) {
    var $keywords = $('.js-keywords-list');

    $keywords.empty();

    keywordsArray.forEach(function forEachKeyword(keyword) {
      var $keyword = $('<button></button>');
      $keyword.attr('data-keyword-id', encodeURIComponent(keyword));
      $keyword.attr('class', 'btn keyword js-keyword');

      $keyword.html('<span class="keyword-button-text">' + keyword + '</span><i class="fa fa-times keyword-button-icon" aria-hidden="true"></i>');

      $keyword.on('click', deleteKeyword);

      $keywords.append($keyword);
      updateCounter();
    });
  }

  var deleteKeyword = function deleteKeyword() {
    var $this = $(this);
    var editMode = $('.js-keywords-wrapper').hasClass('open');

    if (editMode) {
      var keywordId = $this.data('keyword-id');
      var listParams = {};
      var currentKeyword = getKeywordsArray();

      var modifyKeywords = currentKeyword.filter(function filterKeyword(keyword) {
        return $(keyword).data('keyword-id') !== keywordId;
      }).map(function mapKeywords(keyword) {
        return $(keyword).find('.keyword-button-text').text().trim();
      })

      listParams.tags = modifyKeywords;

      $.ajax({
        url: VuFind.path + '/AJAX/JSON?method=editList',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: { 'params': listParams }
      }).done(function onRequestDone(response) {
        updateKeywords(response.data);
      });
    }
  };

  var initDeleteKeyword = function initDeleteKeyword() {
    var $keywords = $('.js-keyword');

    $keywords.on('click', deleteKeyword);
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

        var currentKeywords = getKeywordsArray().map(function filterKeywords(keyword) {
          return $(keyword).find('.keyword-button-text').text().trim();
        });

        currentKeywords.push($input.val());
        listParams.tags = currentKeywords;

        $.ajax({
          url: VuFind.path + '/AJAX/JSON?method=editList',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: { 'params': listParams }
        }).done(function onRequestDone(response) {


          updateKeywords(response.data);
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
