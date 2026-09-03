// $(document).on('turbolinks:load', function () {
'use strict';

// prelaoder
$('.preloader').delay(100).fadeOut(10);

// Mobile scroll-direction nav hide/show
(function() {
  var lastScrollY = window.scrollY;
  var scrollThreshold = 10;
  var mobileQuery = window.matchMedia('(max-width: 991px)');
  var $header = $('.header-nav');
  var $bottomNav = $('.mobile-bottom-nav');

  function onScroll() {
    var currentScrollY = window.scrollY;
    var delta = currentScrollY - lastScrollY;

    if (Math.abs(delta) < scrollThreshold) return;

    if (currentScrollY <= 60) {
      // Near top: always show
      $header.removeClass('nav-hidden');
      $bottomNav.removeClass('nav-hidden');
    } else if (delta > 0) {
      // Scrolling down: hide nav
      $header.addClass('nav-hidden');
      $bottomNav.addClass('nav-hidden');
    } else {
      // Scrolling up: show nav
      $header.removeClass('nav-hidden');
      $bottomNav.removeClass('nav-hidden');
    }

    lastScrollY = currentScrollY;
  }

  function handleViewportChange(e) {
    if (!e.matches) {
      // Desktop: ensure nav is visible and remove scroll listener
      $header.removeClass('nav-hidden');
      $bottomNav.removeClass('nav-hidden');
      $(window).off('scroll.navHide');
    } else {
      lastScrollY = window.scrollY;
      $(window).on('scroll.navHide', onScroll);
    }
  }

  mobileQuery.addEventListener('change', handleViewportChange);
  handleViewportChange(mobileQuery);
})();

// header sticky and reading progress
$(window).scroll(function() {
  if ($(window).scrollTop() >= 50) {
    $('.header-nav').addClass('header-sticky-top');
  } else {
    $('.header-nav').removeClass('header-sticky-top');
  }

  // Reading progress bar
  if ($('#reading-progress-bar').length) {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var textBody = document.getElementById('text-body');
    if (!textBody) {
      return;
    }

    var height = textBody.offsetHeight - document.documentElement.clientHeight;
    var scrolled = Math.min((winScroll / height) * 100, 100);
    $('#reading-progress-bar').css('width', scrolled + '%');
  }
});

$(document).ready(function() {

  // search-popup
  function searchPopup() {
    $('[data-toggle="search"]').on('click', function() {
      $('.search-block').fadeIn(200);
      setTimeout(function() {
        $('.search-block').addClass('is-visible');
        var value = $('#search-field').val();
        $('#search-query').focus().val('').val(value);
      }, 250);
    });
    $('[data-toggle="search-close"]').on('click', function() {
      $('.search-block').fadeOut(200).removeClass('is-visible');
    });
  }
  searchPopup();

  // menuHumBurger icon toggle Init
  function menuHumBurgerIcon() {
    $('.navbar-toggler').on('click', function() {
      $('i').toggleClass('d-inline d-none');
    });
  }
  menuHumBurgerIcon();

  // instafeed
  if (($('#instafeed').length) !== 0) {
    var accessToken = $('#instafeed').attr('data-accessToken');
    var userFeed = new Instafeed({
      get: 'user',
      limit: 6,
      resolution: 'low_resolution',
      accessToken: accessToken,
      template: '<div class="col-xl col-lg-2 col-md-3 col-sm-3 col-4"><a class="instagram-post" href="{{link}}" aria-label="instagram-post-link"><img loading="lazy" class="img-fluid" src="{{image}}" alt="instagram-image"></a></div>'
    });
    userFeed.run();
  }

});

// tab
$('.tab-content').find('.tab-pane').each(function(idx, item) {
  var navTabs = $(this).closest('.code-tabs').find('.nav-tabs'),
    title = $(this).attr('title');
  navTabs.append('<li class="nav-item"><a class="nav-link" href="#">' + title + '</a></li>');
});

$('.code-tabs ul.nav-tabs').each(function() {
  $(this).find("li:first").addClass('active');
})

$('.code-tabs .tab-content').each(function() {
  $(this).find("div:first").addClass('active');
});

$('.nav-tabs a').click(function(e) {
  e.preventDefault();
  var tab = $(this).parent(),
    tabIndex = tab.index(),
    tabPanel = $(this).closest('.code-tabs'),
    tabPane = tabPanel.find('.tab-pane').eq(tabIndex);
  tabPanel.find('.active').removeClass('active');
  tab.addClass('active');
  tabPane.addClass('active');
});

// Accordions
$('.collapse').on('shown.bs.collapse', function() {
  $(this).parent().find('.la-plus').removeClass('la-plus').addClass('la-minus');
}).on('hidden.bs.collapse', function() {
  $(this).parent().find('.la-minus').removeClass('la-minus').addClass('la-plus');
});

// Back to top
$('#back-to-top').on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, 400);
});

// Copy Link
$('.copy-link-btn').on('click', function(e) {
  e.preventDefault();
  var url = $(this).data('url');
  var $icon = $(this).find('i');
  navigator.clipboard.writeText(url).then(function() {
    $icon.removeClass('la-link').addClass('la-check text-success');
    setTimeout(function() {
      $icon.removeClass('la-check text-success').addClass('la-link');
    }, 2000);
  });
});

// });
