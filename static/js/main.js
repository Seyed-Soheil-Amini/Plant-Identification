(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  };
  spinner();


  // Initiate the wowjs
  new WOW().init();


  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.sticky-top').addClass('shadow-sm').css('top', '0px');
    } else {
      $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
    }
  });


  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });


  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000
  });


  // Portfolio isotope and filter
  var portfolioIsotope = $('.portfolio-container').isotope({
    itemSelector: '.portfolio-item',
    layoutMode: 'fitRows'
  });
  $('#portfolio-flters li').on('click', function () {
    $("#portfolio-flters li").removeClass('active');
    $(this).addClass('active');

    portfolioIsotope.isotope({ filter: $(this).data('filter') });
  });


  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    items: 1,
    dots: false,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>'
    ]
  });


})(jQuery);

//make active nav bar's links
var url =  window.location.href;
if((url.search("identify"))!=-1 && (url.search("help"))==-1){
            document.getElementById("identify-link").classList.toggle("text-primary");
            document.getElementById("identify-link").style.fontWeight = "bolder";
        }
else if((url.search("explore"))!=-1 (url.search("help"))==-1){
            document.getElementById("explore-link").classList.toggle("text-primary");
            document.getElementById("explore-link").style.fontWeight = "bolder";
        }
else if((url.search("aboutus"))!=-1){
            document.getElementById("aboutus-link").classList.toggle("text-primary");
            document.getElementById("aboutus-link").style.fontWeight = "bolder";
        }
else if((url.search("help"))!=-1){
            document.getElementById("help-link").classList.toggle("text-primary");
            document.getElementById("help-link").style.fontWeight = "bolder";
        }
else if((url.search("faq"))!=-1){
            document.getElementById("faq-link").classList.toggle("text-primary");
            document.getElementById("faq-link").style.fontWeight = "bolder";
        }
else{
            document.getElementById("home-link").classList.toggle("text-primary");
            document.getElementById("home-link").style.fontWeight = "bolder";
        }

document.getElementById("services-links").addEventListener("mouseenter", change_icon_services);
document.getElementById("services-links").addEventListener("mouseleave", change_icon_services);

function change_icon_services(){
    document.getElementById("icon-services-link").classList.toggle("fa-caret-down");
    document.getElementById("icon-services-link").classList.toggle("fa-caret-up");
}