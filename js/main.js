// Sticky nav shadow on scroll
window.addEventListener('scroll', () => {
  document.querySelector('.nav')?.classList.toggle('scrolled', window.scrollY > 20);
});

function init() {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links?.classList.toggle('open'));

  // Hero entrance — adds .is-loaded on next frame so transitions fire
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero, .page-hero').forEach(el => el.classList.add('is-loaded'));
  });

  // Scroll-reveal via IntersectionObserver
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      const delay = el.dataset.revealDelay;
      if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
      io.observe(el);
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-revealed'));
  }

  // Service area pill click → briefly highlight HCP lead-form wrap
  // (cross-origin iframe — can't prefill fields inside it)
  window.prefillArea = function(el) {
    const wrap = document.querySelector('.lead-form-wrap');
    if (!wrap) return;
    wrap.style.boxShadow = '0 0 0 3px var(--gold)';
    setTimeout(() => { wrap.style.boxShadow = ''; }, 1500);
  };

  // Leaflet map init — only if the #service-map element is on the page
  const mapEl = document.getElementById('service-map');
  if (mapEl && typeof L !== 'undefined') {
    const map = L.map('service-map', {
      center: [40.00, -75.13],
      zoom: 10,
      scrollWheelZoom: false,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19
    }).addTo(map);

    const serviceArea = [
      [40.1380, -74.7240], [40.2100, -74.8500], [40.2300, -75.0200],
      [40.2100, -75.2200], [40.1700, -75.3800], [40.1200, -75.4600],
      [40.0500, -75.5200], [39.9800, -75.5800], [39.9200, -75.5900],
      [39.8700, -75.5200], [39.8300, -75.4200], [39.8400, -75.3200],
      [39.8600, -75.2200], [39.8500, -75.1200], [39.8500, -75.0300],
      [39.8700, -74.9500], [39.9200, -74.8900], [39.9700, -74.8500],
      [40.0200, -74.8200], [40.0600, -74.7800], [40.1000, -74.7400],
      [40.1380, -74.7240]
    ];

    const polygon = L.polygon(serviceArea, {
      color: '#c0a062', weight: 3, dashArray: '8, 6',
      fillColor: '#c0a062', fillOpacity: 0.08, opacity: 0.9
    }).addTo(map);

    const icon = L.divIcon({
      className: 'ks-marker',
      html: '<div style="width:40px;height:40px;background:#1a2630;border:3px solid #c0a062;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.3);"><span style="color:#c0a062;font-weight:800;font-size:14px;font-family:DM Serif Display,serif;">KS</span></div>',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    L.marker([39.9526, -75.1652], { icon })
      .addTo(map)
      .bindPopup('<strong style="font-size:14px;">Kennedy &amp; Smith Mechanical</strong><br>Serving Greater Philadelphia<br><a href="contact.html" style="color:#c0a062;">Request Service &rarr;</a>');

    map.fitBounds(polygon.getBounds().pad(0.05));
  }

  // Smooth scroll for in-page anchor links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
