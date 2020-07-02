finna.keywords = (function () {
  var $wrapper = $('.js-keywords-wrapper');
  var $controls = $('.js-controls');
  var $current = $('.js-current');
  var $counter = $('.js-keywords-counter');
  var $keywordsList = $('.js-keywords-list');
  var $loader = $('.js-spinner');

  var updateCounter = function () {
    var $keywords = $('.js-keyword');

    $counter.text($keywords.length);
  };

  var getTags = function () {
    $loader.show();

    $.ajax({
      url: '/finna/tags',
      method: 'GET'
    }).done(function (response) {
      $keywordsList.empty();

      $.each(response.tags, function (index, tag) {
        var $newKeyword = $(
          '<button data-tag-id="' +
            tag.id +
            '" class="btn keyword js-keyword"><span class="keyword__button-text">' +
            tag.value +
            '</span><i class="fa fa-times keyword__button-icon" aria-hidden="true"></i></button>'
        );

        $keywordsList.append($newKeyword);
        $newKeyword.on('click', deleteKeyword);
      });

      updateCounter();

      $loader.hide();
    });
  };

  var deleteKeyword = function () {
    var editMode = $wrapper.hasClass('open');

    if (editMode) {
      $loader.show();

      var data = {
        id: $(this).data('tag-id').toString()
      };

      $.ajax({
        url: '/finna/tags',
        method: 'DELETE',
        data: JSON.stringify(data)
      }).done(function () {
        getTags();
      });
    }
  };

  var initAddKeyword = function () {
    var $input = $wrapper.find('input[id="keyword"]');
    var $form = $('.js-add-keyword');

    $input.one('blur keydown', function () {
      $(this).addClass('touched');
    });

    $form.on('submit', function (event) {
      event.preventDefault();

      $form.removeClass('invalid');

      if ($form[0].checkValidity()) {
        $loader.show();

        $.ajax({
          url: '/finna/tags',
          method: 'POST',
          data: JSON.stringify({tag: $input.val()})
        }).done(function () {
          getTags();
        });
      } else {
        $form.addClass('invalid');
      }
    });
  };

  var initToggle = function () {
    var $toggleModuleButton = $('.js-toggle-keywords');

    $toggleModuleButton.on('click', function () {
      $(this).toggleClass('open');
      $wrapper.toggleClass('open');
      $controls.toggleClass('open');
      $current.toggleClass('open');
    });
  };

  var initKeywords = function () {
    getTags();
  };

  var init = function () {
    initKeywords();
    initToggle();
    initAddKeyword();
  };

  return {
    init: init
  };
})();
