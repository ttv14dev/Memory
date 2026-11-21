// ===== SCROLL ANIMATION (Intersection Observer) =====
const animatedEls = document.querySelectorAll('.scroll-animate, .scroll-animate-section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger delay for children
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, 100);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

animatedEls.forEach(el => observer.observe(el));


// ===== CAROUSEL =====
const carouselStates = {};

function initCarousel(id) {
    const wrapper = document.getElementById(id);
    if (!wrapper) return;
    const items = wrapper.querySelectorAll('.carousel-item');
    carouselStates[id] = { current: 0, total: items.length };

    // Build dots
    const dotsContainer = document.getElementById('dots-' + id);
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        items.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(id, i));
            dotsContainer.appendChild(dot);
        });
    }

    updateCarousel(id);

    // Auto-play every 4 seconds
    setInterval(() => moveCarousel(id, 1), 4000);
}

function getVisibleCount(wrapper) {
    const item = wrapper.querySelector('.carousel-item');
    if (!item) return 1;
    const wrapperW = wrapper.getBoundingClientRect().width - 120; // subtract padding
    const itemW = item.getBoundingClientRect().width;
    return Math.round(wrapperW / (itemW || 1)) || 1;
}

function updateCarousel(id) {
    const wrapper = document.getElementById(id);
    if (!wrapper) return;
    const state = carouselStates[id];
    const track = wrapper.querySelector('.carousel-track');
    const items = wrapper.querySelectorAll('.carousel-item');
    if (!items.length) return;

    const gap = 20;
    const itemW = items[0].getBoundingClientRect().width;
    const offset = state.current * (itemW + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    const dots = wrapper.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === state.current));
}

function moveCarousel(id, dir) {
    const state = carouselStates[id];
    if (!state) return;
    const wrapper = document.getElementById(id);
    const items = wrapper.querySelectorAll('.carousel-item');
    const visibleCount = getVisibleCount(wrapper);
    const maxIndex = Math.max(0, items.length - visibleCount);

    state.current = Math.max(0, Math.min(state.current + dir, maxIndex));
    updateCarousel(id);
}

function goToSlide(id, index) {
    const state = carouselStates[id];
    if (!state) return;
    state.current = index;
    updateCarousel(id);
}

// Init all carousels after layout
window.addEventListener('load', () => {
    ['carousel-vua-hung', 'carousel-bich-thuy', 'carousel-cai-rang'].forEach(id => {
        initCarousel(id);
    });
    // Also trigger scroll check on load
    animatedEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add('visible');
    });
});

// Re-calculate on resize
window.addEventListener('resize', () => {
    Object.keys(carouselStates).forEach(id => updateCarousel(id));
});


// ===== LIGHTBOX =====
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(imgEl) {
    // Collect all images in the same carousel
    const carousel = imgEl.closest('.carousel-wrapper') || document.body;
    const imgs = Array.from(carousel.querySelectorAll('.carousel-item img'));
    lightboxImages = imgs;
    lightboxIndex = imgs.indexOf(imgEl);

    setLightboxImage(lightboxIndex);
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function setLightboxImage(idx) {
    const img = lightboxImages[idx];
    if (!img) return;
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox-caption').textContent = img.alt || '';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

function lightboxNav(dir, event) {
    event.stopPropagation();
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    setLightboxImage(lightboxIndex);
}

// Close lightbox on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; setLightboxImage(lightboxIndex); }
    if (e.key === 'ArrowLeft')  { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; setLightboxImage(lightboxIndex); }
});
