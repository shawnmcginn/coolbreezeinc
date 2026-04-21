/* ============================================================
   COOL BREEZE INC. — main.js
   ============================================================ */

(function () {
  'use strict';

  // ── Scroll-aware header ────────────────────────────────────
  const header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav toggle ──────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Close menu when any link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Scroll-reveal (Intersection Observer) ─────────────────
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      // Stagger siblings that share a parent
      var siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      var idx = siblings.indexOf(entry.target);
      var delay = Math.min(idx * 80, 320);

      setTimeout(function () {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ── Process tabs ───────────────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.dataset.tab;

      document.querySelectorAll('.tab-btn').forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.process-grid').forEach(function (g) {
        g.classList.add('hidden');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      var panel = document.getElementById('tab-' + target);
      if (panel) {
        panel.classList.remove('hidden');
        // Re-trigger reveal for newly visible steps
        panel.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
          el.classList.add('visible');
        });
      }
    });
  });

  // ── FAQ accordion ──────────────────────────────────────────
  document.querySelectorAll('.faq-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      // Close all open items
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
      });

      // Open the clicked item if it was closed
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Contact form (Formspree AJAX) ──────────────────────────
  var form       = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic client-side validation
      var name  = form.querySelector('#name');
      var email = form.querySelector('#email');
      if (!name.value.trim() || !email.value.trim()) {
        setStatus('Please fill in your name and email address.', 'error');
        return;
      }

      var submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';
      setStatus('', '');

      fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            setStatus('✓ Message sent! We\'ll be in touch soon.', 'success');
            form.reset();
            // Google Ads conversion tracking
            if (typeof gtag === 'function') {
              gtag('event', 'conversion', { 'send_to': 'AW-18095746441/rJ2-CJ2-_50cEInb3LRD' });
            }
          } else {
            return res.json().then(function (data) {
              throw new Error(data.error || 'Server error');
            });
          }
        })
        .catch(function () {
          setStatus('Something went wrong. Please call us at (506) 333-7186.', 'error');
        })
        .finally(function () {
          submitBtn.disabled    = false;
          submitBtn.textContent = 'Send Message →';
        });
    });
  }

  function setStatus(msg, type) {
    formStatus.textContent  = msg;
    formStatus.className    = 'form-status' + (type ? ' ' + type : '');
  }

  // ── Smooth scroll with fixed-header offset ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href   = anchor.getAttribute('href');
      if (href === '#') return; // logo link — let default scroll to top
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      // Read CSS custom properties for offset
      var style   = getComputedStyle(document.documentElement);
      var barH    = parseInt(style.getPropertyValue('--bar-h'))  || 40;
      var navH    = parseInt(style.getPropertyValue('--nav-h'))  || 72;
      var top     = target.getBoundingClientRect().top + window.scrollY - barH - navH - 16;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

}());
