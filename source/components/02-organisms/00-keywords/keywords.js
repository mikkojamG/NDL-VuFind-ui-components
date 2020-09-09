/*global VuFind, finna */
finna.keywords = (function keywords() {
  var $keywordsList, $keywordsCounter, $wrapper, $spinner, $error;

  var updateCounter = function updateCounter() {
    $keywordsCounter.text($('.js-keyword').length);
  };

  var getKeywordsArray = function getKeywordsArray() {
    return $('.js-keyword').toArray();
  };

  var updateKeywords = function updateKeywords(keywordsArray) {
    $keywordsList.empty();

    if (keywordsArray) {
      keywordsArray.forEach(function forEachKeyword(keyword) {
        var $keyword = $('<button></button>');
        $keyword.attr('data-keyword-id', encodeURIComponent(keyword));
        $keyword.attr('class', 'btn keyword js-keyword');

        $keyword.html('<span class="keyword-button-text">' + keyword + '</span><i class="fa fa-times keyword-button-icon" aria-hidden="true"></i>');

        $keyword.on('click', deleteKeyword);

        $keywordsList.append($keyword);
        updateCounter();
      });
    } else {
      updateCounter();
    }
  }

  var editListRequest = function editListRequest(params) {
    return $.ajax({
      url: VuFind.path + '/AJAX/JSON?method=editList',
      method: 'POST',
      dataType: 'json',
      data: { 'params': params }
    }).done(function onRequestDone(response) {
      updateKeywords(response.data.tags);
      $spinner.addClass('hidden');
    }).fail(function onRequestFail() {
      $spinner.addClass('hidden');

      $error.removeClass('hidden');
      $error.focus();
    });
  }

  var deleteKeyword = function deleteKeyword() {
    var $this = $(this);
    var editMode = $wrapper.hasClass('open');

    if (editMode) {
      $spinner.removeClass('hidden');
      $error.addClass('hidden');

      var listParams = {
        id: $('input[name="listID"]').val(),
        title: $('.list-title span').text(),
        public: $(".list-visibility input[type='radio']:checked").val()
      };

      var keywordId = $this.data('keyword-id');
      var currentKeywords = getKeywordsArray();

      var modifyKeywords = currentKeywords
        .filter(function filterKeyword(keyword) {
          return $(keyword).data('keyword-id') !== keywordId;
        }).map(function mapKeywords(keyword) {
          return $(keyword).find('.keyword-button-text').text().trim();
        })

      listParams.tags = modifyKeywords;

      editListRequest(listParams);
    }
  };

  var initDeleteKeyword = function initDeleteKeyword() {
    $('.js-keyword').on('click', deleteKeyword);
  };

  var initAddKeyword = function initAddKeyword() {
    var $input = $wrapper.find('input[id="keyword"]');
    var $form = $('.js-add-keyword');

    $input.one('blur keydown', function onInputTouched() {
      $(this).addClass('touched');
    });

    $form.on('submit', function onSubmit(event) {
      event.preventDefault();

      $form.removeClass('invalid');
      $error.addClass('hidden');

      if ($form[0].checkValidity()) {
        $spinner.removeClass('hidden');

        var listParams = {
          id: $('input[name="listID"]').val(),
          title: $('.list-title span').text(),
          public: $(".list-visibility input[type='radio']:checked").val()
        };

        var currentKeywords = getKeywordsArray()
          .map(function filterKeywords(keyword) {
            return $(keyword).find('.keyword-button-text').text().trim();
          });

        currentKeywords.push($input.val());
        listParams.tags = currentKeywords;

        editListRequest(listParams);

        $input.val('');
      } else {
        $form.addClass('invalid');
      }
    });
  };

  var initToggle = function initToggle() {
    var $toggleModuleButton = $('.js-toggle-keywords');

    $toggleModuleButton.on('click', function onToggleModule() {
      $(this).toggleClass('open');
      $wrapper.toggleClass('open');
      $('.js-controls').toggleClass('open');
      $('.js-current').toggleClass('open');
    });
  };

  var init = function init() {
    $spinner = $('.js-spinner');
    $error = $('.js-keywords-error');
    $keywordsList = $('.js-keywords-list');
    $keywordsCounter = $('.js-keywords-counter');
    $wrapper = $('.js-keywords-wrapper');

    initDeleteKeyword();
    initToggle();
    initAddKeyword();
  };

  return {
    init: init
  };
})();
