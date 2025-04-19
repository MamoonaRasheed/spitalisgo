$(document).ready(function() {
    $('.tabs-buttons-main button').click(function() {
        $('.tabs-buttons-main button').removeClass('active');
        $(this).addClass('active');
    });
    $('.tabs-buttons-main button').click(function () {
        const targetClass = $(this).attr('class').split('-')[0];
        $('.a1-tab-content, .a2-tab-content, .b1-tab-content, .b2-tab-content').removeClass('active-tabs');
        $(`.${targetClass}-tab-content`).addClass('active-tabs');
    });
    $('.mobile-hamburger, .close-mob-nav').click(function() {
        $('body').toggleClass('menu-show');
    });


    $(window).on('scroll', function() {
        if ($(this).scrollTop() >= 50) {
          $('#main-header').addClass('fix-header');
        } else {
          $('#main-header').removeClass('fix-header');
        }
      });

    var swiper = new Swiper(".testiSwiper", {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        speed: 500,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        breakpoints: {
          320: {
            slidesPerView: 1.5,
            spaceBetween: 12,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 30,
          },
        },
      });

});