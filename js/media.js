document.addEventListener("DOMContentLoaded", () => {
    initUniversalCarousels();
    initUniversalAccordions();
});

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