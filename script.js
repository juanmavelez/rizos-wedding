/* ============================================
   Verónica & Emilio — Wedding Website
   Script: Countdown + Scroll Animations
   ============================================ */

(function () {
  'use strict';

  // ─── Countdown Timer ───────────────────────
  const WEDDING_DATE = new Date('2026-06-19T18:00:00+02:00'); // Madrid timezone (CEST)

  const cdDays    = document.getElementById('cd-days');
  const cdHours   = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now  = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      cdDays.textContent    = '🎉';
      cdHours.textContent   = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
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
  const navDots  = document.querySelectorAll('.nav-dot');
  const sections = document.querySelectorAll('section[id]');

  // Click navigation
  navDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      const target   = document.getElementById(targetId);
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

  // ─── Smooth number transitions ─────────────
  // Add CSS transition to countdown numbers
  [cdDays, cdHours, cdMinutes, cdSeconds].forEach((el) => {
    if (el) {
      el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }
  });
})();
