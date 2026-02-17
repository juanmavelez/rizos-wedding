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
  document.addEventListener('click', (e) => {
    const calendarBtn = e.target.closest('.js-calendar-btn');
    if (!calendarBtn) return;

    try {
      // Helper to escape special ICS characters
      const escapeICS = (str) => {
        if (!str) return '';
        return String(str)
          .replace(/\\/g, '\\\\')
          .replace(/;/g, '\\;')
          .replace(/,/g, '\\,')
          .replace(/\n/g, '\\n');
      };

      /**
       * Folds lines according to RFC 5545 (75 octets max)
       * We use TextEncoder to handle byte-length correctly for UTF-8
       */
      const foldLine = (line) => {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const bytes = encoder.encode(line);

        if (bytes.length <= 75) return line;

        const result = [];
        let offset = 0;
        let isFirst = true;

        while (offset < bytes.length) {
          // Reserve 1 byte for the leading space on folded lines
          const maxLen = isFirst ? 75 : 74;
          let chunkLen = maxLen;

          if (offset + chunkLen > bytes.length) {
            chunkLen = bytes.length - offset;
          } else {
            // Ensure we don't break in the middle of a multi-byte character
            // Check if the next byte is a continuation byte (starts with 10xxxxxx)
            while (chunkLen > 0 && (bytes[offset + chunkLen] & 0xc0) === 0x80) {
              chunkLen--;
            }
          }

          const chunk = bytes.slice(offset, offset + chunkLen);
          result.push((isFirst ? '' : ' ') + decoder.decode(chunk));

          offset += chunkLen;
          isFirst = false;
        }
        return result.join('\r\n');
      };

      const event = {
        title: 'Boda de Verónica y Emilio',
        start: '20260619T180000',
        end: '20260620T040000',
        location: 'Iglesia de San Jerónimo el Real, Madrid',
        description: '¡Nos hace mucha ilusión que nos acompañes en nuestro gran día!\n\n' +
          'Ceremonia:\n' +
          '18:00 H - Iglesia de San Jerónimo el Real\n' +
          'https://maps.google.com/?q=Iglesia+de+San+Jerónimo+el+Real,+Madrid\n\n' +
          'Celebración:\n' +
          'Finca Soto del Cerrolén\n' +
          'https://maps.google.com/?q=Finca+Soto+del+Cerrolén'
      };

      const icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wedding Website//ES',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:wedding-20260619-veronica-emilio@weddingwebsite.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${event.start}`,
        `DTEND:${event.end}`,
        `SUMMARY:${escapeICS(event.title)}`,
        `DESCRIPTION:${escapeICS(event.description)}`,
        `LOCATION:${escapeICS(event.location)}`,
        'CLASS:PUBLIC',
        'TRANSP:OPAQUE',
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT',
        'END:VCALENDAR'
      ];

      // Map lines through folding
      const icsMsg = icsLines.map(foldLine).join('\r\n');

      // Use a UTF-8 BOM (\ufeff) to help some apps recognize the encoding
      const blob = new Blob(['\ufeff', icsMsg], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', 'Boda_Veronica_y_Emilio.ics');
      link.style.display = 'none';
      document.body.appendChild(link);

      link.click();

      // Cleanup
      setTimeout(() => {
        if (link.parentNode) document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 500);

    } catch (err) {
      // Silent fail for production or minimal logging if absolutely needed
    }
  });
})();
