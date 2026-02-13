/* ============================================
   Verónica & Emilio — Wedding Website
   Script: Countdown + Scroll Animations
   ============================================ */

(function () {
  'use strict';

  // ─── Countdown Timer ───────────────────────
  const WEDDING_DATE = new Date('2026-06-19T18:00:00+02:00'); // Madrid timezone (CEST)

  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      cdDays.textContent = '🎉';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    // Animate number change
    animateNumber(cdDays, days);
    animateNumber(cdHours, pad(hours));
    animateNumber(cdMinutes, pad(minutes));
    animateNumber(cdSeconds, pad(seconds));
  }

  function animateNumber(element, newValue) {
    const strValue = String(newValue);
    if (element.textContent !== strValue) {
      element.style.transform = 'translateY(-4px)';
      element.style.opacity = '0.6';
      requestAnimationFrame(() => {
        element.textContent = strValue;
        requestAnimationFrame(() => {
          element.style.transform = 'translateY(0)';
          element.style.opacity = '1';
        });
      });
    }
  }

  // Initial call + interval
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ─── Scroll Reveal ─────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // ─── Navigation Dots ───────────────────────
  const navDots = document.querySelectorAll('.nav-dot');
  const sections = document.querySelectorAll('section[id]');

  // Click navigation
  navDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Active dot on scroll
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navDots.forEach((dot) => {
              dot.classList.toggle(
                'active',
                dot.getAttribute('data-target') === entry.target.id
              );
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ─── Falling Leaves Animation ───────────────
  const leafContainer = document.getElementById('leaf-container');
  const LEAF_TYPES = ['leaf--type-1', 'leaf--type-2', 'leaf--type-3'];

  function createLeaf() {
    if (!leafContainer) return;

    const leaf = document.createElement('div');
    const type = LEAF_TYPES[Math.floor(Math.random() * LEAF_TYPES.length)];

    leaf.classList.add('leaf', type);

    // Random position and animation properties
    const startX = Math.random() * window.innerWidth;
    const duration = 5 + Math.random() * 5; // 5-10s
    const size = 15 + Math.random() * 25; // 15-40px
    const delay = Math.random() * 5;

    leaf.style.left = `${startX}px`;
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    leaf.style.animation = `fall ${duration}s linear ${delay}s infinite`;

    leafContainer.appendChild(leaf);

    // Remove leaf after one animation cycle to prevent DOM bloat
    setTimeout(() => {
      leaf.remove();
    }, (duration + delay) * 1000);
  }

  // Create initial leaves
  for (let i = 0; i < 15; i++) {
    createLeaf();
  }

  // Keep adding leaves periodically
  setInterval(createLeaf, 1500);

  // ─── Smooth number transitions ─────────────
  // Add CSS transition to countdown numbers
  [cdDays, cdHours, cdMinutes, cdSeconds].forEach((el) => {
    if (el) {
      el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }
  });
})();
