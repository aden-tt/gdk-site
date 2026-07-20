document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  setActiveNavbarLink();
  initUniversalCarousels();
  initUniversalAccordions();
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
            <a href="get-involved.html" class="nav-item">GET INVOLVED!</a>
          </div>
          <div class="nav-dropdown-wrapper">
            <a href="programs.html" class="nav-item">PROGRAMS / EVENTS<span class="dropdown-arrow">▼</span></a>
            <div class="arcade-dropdown">
              <a href="project-program.html" class="dropdown-sub-item">Project Program</a>
              <a href="gdc-trip.html" class="dropdown-sub-item">GDC Trip</a>
              <a href="little-big-mentorship.html" class="dropdown-sub-item">Little Big Mentorship</a>
              <a href="downtown-career-fair.html" class="dropdown-sub-item">Downtown Career Fair</a>
            </div>
          </div>
          <a href="faq.html" class="nav-item">FAQ</a>
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
          <li><a href="https://discord.gg/WgPk4Tp8Cg">Discord</a></li>
          <li><a href="https://www.linkedin.com/company/game-development-knights/">LinkedIn</a></li>
          <li><a href="https://www.instagram.com/gamedevknights/">Instagram</a></li>
          <li><a href="https://knightconnect.campuslabs.com/engage/organization/gamedevknights">KnightConnect</a></li>
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
    if (href && (currentPath.endsWith(href) || (href === "index.html" && (currentPath.endsWith("/") || currentPath === "")))) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function initUniversalCarousels() {
  const carousels = document.querySelectorAll('.universal-carousel');
  
  carousels.forEach(carousel => {
    let slidesData = [];
    try {
      slidesData = JSON.parse(carousel.getAttribute('data-slides') || '[]');
    } catch (e) {
      console.error("Malformed JSON in carousel data-slides attribute", e);
      return;
    }
    
    if (slidesData.length === 0) return;

    let slidesHTML = '';
    let dotsHTML = '';
    
    slidesData.forEach((slide, index) => {
      const activeClass = index === 0 ? 'active' : '';
      
      if (slide.type === 'video') {
        slidesHTML += `
          <div class="carousel-slide carousel-slide--video">
          <iframe width="560" height="315" src="${slide.src}" title="${slide.alt || 'Video slide'}" frameborder="0" allow="accelerometer; 
            autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
          </iframe>
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

    carousel.querySelector('.carousel-btn.prev').addEventListener('click', () => updateCarousel(currentIndex - 1));
    carousel.querySelector('.carousel-btn.next').addEventListener('click', () => updateCarousel(currentIndex + 1));
    
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const targetIndex = parseInt(e.target.getAttribute('data-index'));
        updateCarousel(targetIndex);
      });
    });

    if (carousel.getAttribute('data-autoplay') !== 'false') {
      setInterval(() => updateCarousel(currentIndex + 1), intervalTime);
    }
  });
}
function initUniversalAccordions() {
  const groups = document.querySelectorAll('.universal-accordion-group');

  groups.forEach(group => {
    // 1. Parse encoded item data string securely
    let itemsData = [];
    try {
      itemsData = JSON.parse(group.getAttribute('data-items') || '[]');
    } catch (e) {
      console.error("Malformed JSON string inside accordion data-items attribute", e);
      return;
    }

    // 2. Generate and inject DOM nodes programmatically
    group.innerHTML = itemsData.map(item => `
      <div class="universal-accordion-node">
        <button class="accordion-trigger" aria-label="Toggle Answer">
          <h5>${item.title}</h5>
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-panel">
          <div class="accordion-panel-content">
            <p>${item.content}</p>
          </div>
        </div>
      </div>
    `).join('');

    // 3. Attach actionable click physics events to generated targets
    const nodes = group.querySelectorAll('.universal-accordion-node');
    const isExclusive = group.getAttribute('data-exclusive') === 'true';

    nodes.forEach(node => {
      const trigger = node.querySelector('.accordion-trigger');
      const panel = node.querySelector('.accordion-panel');

      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const isActive = node.classList.contains('active');

        // Handle exclusive mutual collapse states if active
        if (isExclusive && !isActive) {
          nodes.forEach(sibling => {
            sibling.classList.remove('active');
            const siblingPanel = sibling.querySelector('.accordion-panel');
            if (siblingPanel) siblingPanel.style.maxHeight = '';
          });
        }

        // Toggle active layouts
        if (!isActive) {
          node.classList.add('active');
          panel.style.maxHeight = panel.scrollHeight + "px";
        } else {
          node.classList.remove('active');
          panel.style.maxHeight = '';
        }
      });
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  // ... Keep existing initialization hooks (Header, Footer, Accordions, etc.)
  
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevents browser redirect page refresh

    const data = new FormData(form);
    const submitBtn = form.querySelector(".form-submit-btn");
    
    // Visual feedback state during transit
    if (submitBtn) submitBtn.innerText = "SENDING...";

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        form.reset(); // Wipe inputs clean
        triggerAchievement("MESSAGE SENT!", "We'll get back to you shortly!");
      } else {
        throw new Error("Formspree server error rejection response");
      }
    } catch (error) {
      triggerAchievement("TRANSMISSION ERROR", "Failed to connect. Use Discord instead.", true);
    } finally {
      if (submitBtn) submitBtn.innerText = "SEND MESSAGE";
    }
  });
}

function triggerAchievement(title, subtitle, isError = false) {
  const container = document.getElementById("achievement-toast-container");
  if (!container) return;

  // Create individual notification token
  const toast = document.createElement("div");
  toast.className = "achievement-toast";
  
  // Custom logic to alter icon presentation based on payload status
  const iconSymbol = isError ? "⚠" : "🏆";
  if (isError) toast.style.borderColor = "#ff5555";

  toast.innerHTML = `
    <div class="achievement-icon">${iconSymbol}</div>
    <div class="achievement-details">
      <h4>${title}</h4>
      <p>${subtitle}</p>
    </div>
  `;

  container.appendChild(toast);

  // Force reflow for CSS execution slide trigger
  setTimeout(() => toast.classList.add("show"), 50);

  // Cleanup: Slide out and purge DOM node completely
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 8000);
}