/* ============================================
   INTERO STUDIO — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initCustomCursor();
  initPageTransitions();
  initPortfolioFilters();
  initProjectGallery();
});

/* --- Navigation --- */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');

  if (!nav) return;

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    nav.classList.toggle('scrolled', currentScroll > 60);
    lastScroll = currentScroll;
  }, { passive: true });

  // Check on load
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  }

  // Mobile menu
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* --- Scroll Reveal (Intersection Observer) --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --- Custom Cursor --- */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  // Only on devices with fine pointer
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('visible');
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
  });

  // Hover targets
  const hoverTargets = document.querySelectorAll('a, button, .project-card, .service-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // Smooth follow
  function animate() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

/* --- Page Transitions --- */
function initPageTransitions() {
  const transition = document.querySelector('.page-transition');
  if (!transition) return;

  // Fade in on load
  transition.classList.remove('active');

  // Internal links with transition
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      transition.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
}

/* --- Portfolio Filters --- */
function initPortfolioFilters() {
  const filters = document.querySelectorAll('.portfolio-filter');
  const cards = document.querySelectorAll('.portfolio-grid .project-card');

  if (filters.length === 0) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --- Project Gallery Lightbox --- */
function initProjectGallery() {
  const galleryItems = document.querySelectorAll('.project-gallery__item');
  if (galleryItems.length === 0) return;

  galleryItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const img = item.querySelector('img, .placeholder-img');
      if (!img) return;

      // Create lightbox
      const lightbox = document.createElement('div');
      lightbox.style.cssText = `
        position: fixed; inset: 0; z-index: 10000;
        background: rgba(12,11,9,0.95);
        display: flex; align-items: center; justify-content: center;
        padding: 40px; cursor: pointer;
        opacity: 0; transition: opacity 0.3s ease;
      `;

      if (img.tagName === 'IMG') {
        const clone = img.cloneNode();
        clone.style.cssText = 'max-width: 90vw; max-height: 85vh; object-fit: contain;';
        lightbox.appendChild(clone);
      }

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
      });

      lightbox.addEventListener('click', () => {
        lightbox.style.opacity = '0';
        setTimeout(() => {
          lightbox.remove();
          document.body.style.overflow = '';
        }, 300);
      });
    });
  });
}

/* --- Parallax on scroll (subtle) --- */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroImage = document.querySelector('.hero__bg-image');
  if (heroImage) {
    heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
}, { passive: true });
