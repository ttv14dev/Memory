// ===== PROGRESS BAR =====
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight * 100) + '%';
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
});

// ===== PARALLAX HERO =====
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
    if (!heroBg) return;
    const scrollY = window.scrollY;
    const heroH   = document.querySelector('.hero-parallax')?.offsetHeight || 0;
    if (scrollY < heroH + 200) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
}, { passive: true });

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal, .reveal-section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
    let current = 0;
    const step  = Math.ceil(target / 40);
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
    }, 40);
}
const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.stat-num').forEach(el => {
                animateCounter(el, +el.dataset.target);
            });
            statsObs.disconnect();
        }
    });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.header-stats');
if (statsEl) statsObs.observe(statsEl);

// ===== LEAFLET MAP =====
window.addEventListener('load', () => {
    if (typeof L === 'undefined') return;
    const map = L.map('map', { zoomControl: true, scrollWheelZoom: false }).setView([16.0, 108.0], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    const icon = (emoji) => L.divIcon({
        html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5))">${emoji}</div>`,
        className: '', iconAnchor: [14, 28]
    });

    const places = [
        { lat: 10.0341, lng: 105.7878, name: 'Cần Thơ', emoji: '🛶', desc: 'Chợ Nổi Cái Răng · Nhà Cổ Bích Thủy · Đền Vua Hùng' },
        { lat: 11.9465, lng: 108.4419, name: 'Đà Lạt',  emoji: '🌸', desc: 'Thành phố ngàn hoa trên cao nguyên' },
        { lat: 16.4637, lng: 107.5909, name: 'Huế',     emoji: '🏯', desc: 'Cố đô lịch sử · Di sản văn hóa thế giới' },
    ];

    places.forEach(p => {
        L.marker([p.lat, p.lng], { icon: icon(p.emoji) })
            .addTo(map)
            .bindPopup(`
                <div style="font-family:'DM Sans',sans-serif;padding:4px 2px">
                    <strong style="font-size:15px">${p.emoji} ${p.name}</strong><br>
                    <span style="font-size:12px;color:#888">${p.desc}</span>
                </div>
            `, { className: 'custom-popup' });
    });
});

// ===== LIGHTBOX =====
let lbImages = [], lbIndex = 0;

document.querySelectorAll('.masonry-item').forEach(item => {
    item.addEventListener('click', () => {
        const section = item.closest('.masonry-grid');
        lbImages = Array.from(section.querySelectorAll('.masonry-item'));
        lbIndex  = lbImages.indexOf(item);
        openLightbox(lbIndex);
    });
});

function openLightbox(idx) {
    const item    = lbImages[idx];
    const img     = item.querySelector('img');
    const caption = item.dataset.caption || img.alt || '';
    document.getElementById('lightbox-img').src     = img.src;
    document.getElementById('lightbox-caption').textContent = caption;
    document.getElementById('lightbox-counter').textContent = `${idx + 1} / ${lbImages.length}`;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

function lightboxNav(dir) {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    openLightbox(lbIndex);
}

document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  lightboxNav(1);
    if (e.key === 'ArrowLeft')   lightboxNav(-1);
});
