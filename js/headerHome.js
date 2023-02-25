class OtherHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        
<!-- Navbar Start -->
<!-- <base href="/" target="_blank"> -->
<!-- <base href="/Plant-Identification/" target="_blank"> -->
<nav class="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0">
  <a href="index.html" class="navbar-brand d-flex align-items-center px-4 px-lg-5">
      <h1 class="m-0" style="font-family:Georgia, 'Times New Roman', Times, serif, oblique;">Detector plants</h1>
  </a>
  <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
      <span class="navbar-toggler-icon"></span>
  </button>

        <div class="collapse navbar-collapse" id="navbarCollapse">
        <div class="navbar-nav ms-auto p-4 p-lg-0">
<<<<<<< HEAD
            <a href="/index.html" class="nav-item nav-link">Home</a>
            <a href="/IdentifyPage/index.html" class="nav-item nav-link">Identify</a>
            <a href="/ExplorPage/index.html" class="nav-item nav-link">Explore</a>
            <a href="/AboutPage/index.html" class="nav-item nav-link">About us</a>
            <a href="/HelpPage/index.html" class="nav-item nav-link">Help</a>
            <a href="/FAQPage/index.html" class="nav-item nav-link">FAQ</a>
=======
            <a href="index.html" class="nav-item nav-link">Home</a>
            <a href="IdentifyPage/index.html" class="nav-item nav-link">Identify</a>
            <a href="ExplorePage/index.html" class="nav-item nav-link">Explore</a>
            <a href="AboutPage/index.html" class="nav-item nav-link">About us</a>
            <a href="HelpPage/index.html" class="nav-item nav-link">Help</a>
            <a href="FAQPage/index.html" class="nav-item nav-link">FAQ</a>
>>>>>>> d247425668c9742eccd13ab4de4ca2874a3f7146
        </div>
    </div> 
    </nav>
  `;
  }
}

customElements.define("other-header", OtherHeader);
