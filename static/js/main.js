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

class myHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<div class="container-fluid bg-dark text-light px-0 py-2">
  <div class="row gx-0 d-none d-lg-flex">
      <div class="col-lg-7 px-5 text-start">
          <div class="h-100 d-inline-flex align-items-center me-4">
              <span class="fa fa-phone-alt me-2"></span>
              <span>+98 910 384 5418</span>
          </div>
          <div class="h-100 d-inline-flex align-items-center">
              <span class="far fa-envelope me-2"></span>
              <span>info@semicolon.com</span>
          </div>
      </div>
      <div class="col-lg-5 px-5 text-end">
          <div class="h-100 d-inline-flex align-items-center mx-n2">
              <span>Follow Us:</span>
              <a class="btn btn-link text-light" href=""><i class="fab fa-facebook-f"></i></a>
              <a class="btn btn-link text-light" href=""><i class="fab fa-twitter"></i></a>
              <a class="btn btn-link text-light" href=""><i class="fab fa-linkedin-in"></i></a>
              <a class="btn btn-link text-light" href=""><i class="fab fa-instagram"></i></a>
          </div>
      </div>
  </div>
</div>
<!-- Topbar End -->
`
  }
}

customElements.define("plant-header", myHeader);

class myFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <!-- Footer Start -->
        <div class="container-fluid align-items-center bg-dark text-light footer
          mt-5 py-3 wow fadeIn" data-wow-delay="0.1s">
          <div class="container py-5">
            <div class="row g-5">
              <div class="col-lg-3 col-md-6">
                <h4 class="text-white mb-4">Our Office</h4>
                <p class="mb-2"><i class="fa fa-map-marker-alt me-3"></i>Yazd
                  Uni, Yazd,Iran</p>
                <p class="mb-2"><i class="fa fa-phone-alt me-3"></i>+98 910 384
                  5418</p>
                <p class="mb-2"><i class="fa fa-envelope me-3"></i>info@semicolon.com</p>
                <div class="d-flex pt-2">
                  <a class="btn btn-square btn-outline-light rounded-circle
                    me-2" href=""><i class="fab fa-twitter"></i></a>
                  <a class="btn btn-square btn-outline-light rounded-circle
                    me-2" href=""><i class="fab fa-facebook-f"></i></a>
                  <a class="btn btn-square btn-outline-light rounded-circle
                    me-2" href=""><i class="fab fa-youtube"></i></a>
                  <a class="btn btn-square btn-outline-light rounded-circle
                    me-2" href=""><i class="fab fa-linkedin-in"></i></a>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <h4 class="text-white mb-4">Services</h4>
                <a class="btn btn-link" href="">Identification</a>
                <a class="btn btn-link" href="">Explore about plants</a>
                <a class="btn btn-link" href="">Support in growth</a>
              </div>
              <div class="col-lg-3 col-md-6">
                <h4 class="text-white mb-4">Quick Links</h4>
                <a class="btn btn-link" href="">Home</a>
                <a class="btn btn-link" href="">Identify</a>
                <a class="btn btn-link" href="">Explore</a>
                <a class="btn btn-link" href="">About us</a>
                <a class="btn btn-link" href="">Help</a>
                <a class="btn btn-link" href="">FAQ</a>
              </div>
              <div class="col-lg-3 col-md-6">
                <h4 class="text-white mb-4 btn-sm align-items-center"
                  style="position: relative; right: 2mm;">Supported by
                  <u><a href="https://yazd.ac.ir">Yazd University</a></u>
                </h4>
                <div>
                  <img class="img-fluid" style="border-radius: 3.5mm;"
                    src="img/footYazdUni.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Footer End -->

        <!-- Copyright Start -->
        <div class="container-fluid copyright py-4">
          <div class="container">
            <div class="row">
              <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                &copy; <a class="border-bottom" href="#">semicheckplant.com</a>,
                All Right Reserved.
              </div>
              <div class="col-md-6 text-center text-md-end">
                Designed By <a class="border-bottom"
                  href="https://soheilmaster.ir">semicolon group</a>
              </div>
            </div>
          </div>
        </div>
        <!-- Copyright End -->
`
  }
}

customElements.define("plant-footer", myFooter);