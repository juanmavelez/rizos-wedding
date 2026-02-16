/* ============================================
   Verónica & Emilio — Wedding Website
   Script: Countdown + Scroll Animations
   ============================================ */

(function () {
  'use strict';

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

    sections.forEach((section) => {
      // Skip top anchor if it doesn't have an ID
      if (section.id) sectionObserver.observe(section);
    });
  }


  // ─── Navbar Mobile Menu ───────────
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navbar-toggle');
  const navLinks = document.querySelectorAll('.navbar__link');

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('menu-open');
      const isExpanded = navbar.classList.contains('menu-open');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Close menu on link click
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Offset for fixed header
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── Add to Calendar Logic ─────────
  const calendarButtons = document.querySelectorAll('#add-to-calendar, #add-to-calendar-hero, #add-to-calendar-rsvp');

  calendarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const event = {
        title: 'Boda de Verónica & Emilio',
        start: '20260619T180000',
        end: '20260620T040000',
        location: 'Iglesia de San Jerónimo el Real, Madrid',
        description: '¡Nos casamos! Te esperamos para celebrar este día tan especial.'
      };

      const icsMsg = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wedding Website//ES',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@weddingwebsite.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${event.start}`,
        `DTEND:${event.end}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsMsg], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Boda_Veronica_y_Emilio.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });
})();
