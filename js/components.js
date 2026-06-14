document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  setActiveNavbarLink();
});

function renderHeader() {
  const headerHTML = `
    <header class="navbar-container">
      <div class="navbar-main">
        <a href="./index.html" class="nav-branding">
          <div class="logo-box">
            <img class="logo-pixel" src="images/logo.png" alt="GDK Logo">
          </div>
          <span class="nav-title">GAMEDEV KNIGHTS</span>
        </a>

        <nav class="nav-links-desktop">
          <a href="index.html" class="nav-item">HOME</a>
          <a href="about.html" class="nav-item">ABOUT</a>
          
          <div class="nav-dropdown-wrapper">
            <a href="programs.html" class="nav-item">PROGRAMS <span class="dropdown-arrow">▼</span></a>
            <div class="arcade-dropdown">
              <a href="little-big-mentorship.html" class="dropdown-sub-item">LB Mentorship</a>
              <a href="project-program.html" class="dropdown-sub-item">Project Program</a>
              <a href="gdc-trip.html" class="dropdown-sub-item">GDC Trip</a>
              <a href="downtown-career-fair.html" class="dropdown-sub-item">Career Fair</a>
            </div>
          </div>

          <a href="get-involved.html" class="nav-item">GET INVOLVED!</a>
          <a href="faq.html" class="nav-item">FAQ</a>
          <a href="resources.html" class="nav-item">RESOURCES</a>
          <a href="contact.html" class="nav-item">CONTACT</a>
        </nav>

        <button class="menu-toggle-btn" aria-label="Toggle Menu" onclick="document.querySelector('.navbar-container').classList.toggle('open')">
          <span class="btn-label">MENU</span>
          <div class="burger-icon">
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>
    </header>
  `;

  const headerElement = document.getElementById("global-header");
  if (headerElement) {
    headerElement.outerHTML = headerHTML;
  }
}

function renderFooter() {
  const footerHTML = `
    <footer class="footer">
      <div class="footer-left">
        <h2>GameDev Knights</h2>
        <p>gamedevknights@gmail.com</p>
        <p>500 W. Livingston Street, Orlando, FL 32801</p>
      </div>
      <div class="footer-right">
        <p><b>Socials</b></p>
        <ul>
          <li><a href="#">Discord</a></li>
          <li><a href="#">LinkedIn</a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">KnightConnect</a></li>
        </ul>
      </div>
    </footer>
  `;

  const footerElement = document.getElementById("global-footer");
  if (footerElement) {
    footerElement.outerHTML = footerHTML;
  }
}

function setActiveNavbarLink() {
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(item => {
    const href = item.getAttribute("href");
    
    // Check if the current URL ends with the link href attribute
    if (href && (currentPath.endsWith(href) || (href === "index.html" && (currentPath.endsWith("/") || currentPath === "")))) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  setActiveNavbarLink();
  
  // Initialize any universal carousels on the page
  initUniversalCarousels();
});

// ... keep your existing renderHeader, renderFooter, and setActiveNavbarLink functions ...

function initUniversalCarousels() {
  const carousels = document.querySelectorAll('.universal-carousel');
  
  carousels.forEach(carousel => {
    // 1. Extract slide data encoded in the HTML attribute
    let slidesData = [];
    try {
      slidesData = JSON.parse(carousel.getAttribute('data-slides') || '[]');
    } catch (e) {
      console.error("Malformed JSON in carousel data-slides attribute", e);
      return;
    }
    
    if (slidesData.length === 0) return;

    // 2. Inject the Carousel HTML Structure
    let slidesHTML = '';
    let dotsHTML = '';
    
    slidesData.forEach((slide, index) => {
      const activeClass = index === 0 ? 'active' : '';
      
      // Handle both standard images and YouTube video IFrames dynamically
      if (slide.type === 'video') {
        slidesHTML += `
          <div class="carousel-slide carousel-slide--video">
            <iframe src="${slide.src}" title="${slide.alt || 'Video slide'}" frameborder="0" allowfullscreen></iframe>
          </div>`;
      } else {
        slidesHTML += `
          <div class="carousel-slide">
            <img src="${slide.src}" alt="${slide.alt || 'Carousel image'}">
          </div>`;
      }
      
      dotsHTML += `<span class="dot ${activeClass}" data-index="${index}"></span>`;
    });

    carousel.innerHTML = `
      <div class="carousel-track-wrapper" style="overflow: hidden; width: 100%; height: 100%;">
        <div class="carousel-track" style="display: flex; height: 100%; transition: transform 0.4s ease;">
          ${slidesHTML}
        </div>
      </div>
      <button class="carousel-btn prev" aria-label="Previous slide">&#10094;</button>
      <button class="carousel-btn next" aria-label="Next slide">&#10095;</button>
      <div class="carousel-dots">${dotsHTML}</div>
    `;

    // 3. Setup Slide Mechanics & Controls
    const track = carousel.querySelector('.carousel-track');
    const dots = carousel.querySelectorAll('.dot');
    const totalSlides = slidesData.length;
    let currentIndex = 0;
    const intervalTime = parseInt(carousel.getAttribute('data-interval')) || 5000;

    function updateCarousel(targetIndex) {
      currentIndex = (targetIndex + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    }

    // Event Listeners
    carousel.querySelector('.carousel-btn.prev').addEventListener('click', () => updateCarousel(currentIndex - 1));
    carousel.querySelector('.carousel-btn.next').addEventListener('click', () => updateCarousel(currentIndex + 1));
    
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const targetIndex = parseInt(e.target.getAttribute('data-index'));
        updateCarousel(targetIndex);
      });
    });

    // Auto-rotation (only if data-autoplay isn't explicitly set to "false")
    if (carousel.getAttribute('data-autoplay') !== 'false') {
      setInterval(() => updateCarousel(currentIndex + 1), intervalTime);
    }
  });
}