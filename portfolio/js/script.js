/* =========================================================
   Ahmed Harb — AI Portfolio JavaScript
   ========================================================= */

'use strict';

// ─── DOM Ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initActiveNavLinks();
  initContactForm();
  initCopyrightYear();
});

// ─── 1. THEME (Dark / Light) ─────────────────────────────────
function initTheme() {
  const html         = document.documentElement;
  const themeToggle  = document.getElementById('theme-toggle');
  const savedTheme   = localStorage.getItem('portfolio-theme') || 'dark';

  // Apply saved or default theme
  setTheme(savedTheme);

  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    const next    = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
  }
}

// ─── 2. NAVBAR (scroll class) ───────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const scrollThreshold = 20;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load
}

// ─── 3. MOBILE MENU ──────────────────────────────────────────
function initMobileMenu() {
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu-links .nav-link');

  if (!hamburger || !mobileMenu) return;

  const openMenu  = () => {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close when viewport widens
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

// ─── 4. SCROLL REVEAL (IntersectionObserver) ─────────────────
function initScrollReveal() {
  // Respect reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const selectors = ['.fade-in', '.fade-in-left', '.fade-in-right'];
  const elements  = document.querySelectorAll(selectors.join(', '));

  if (prefersReduced) {
    // Instantly show all
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// ─── 5. ACTIVE NAV LINKS (on scroll) ─────────────────────────
function initActiveNavLinks() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');

  if (!sections.length || !navLinks.length) return;

  const highlightLink = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          highlightLink(entry.target.id);
        }
      });
    },
    { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' }
  );

  sections.forEach(section => observer.observe(section));
}

// ─── 6. CONTACT FORM VALIDATION ─────────────────────────────
function initContactForm() {
  const form      = document.getElementById('contact-form');
  const feedback  = document.getElementById('form-feedback');

  if (!form || !feedback) return;

  const fields = {
    name:    { el: form.querySelector('#f-name'),    errorEl: form.querySelector('#f-name-err')    },
    email:   { el: form.querySelector('#f-email'),   errorEl: form.querySelector('#f-email-err')   },
    subject: { el: form.querySelector('#f-subject'), errorEl: form.querySelector('#f-subject-err') },
    message: { el: form.querySelector('#f-message'), errorEl: form.querySelector('#f-message-err') },
  };

  // Live validation on blur
  Object.values(fields).forEach(({ el, errorEl }) => {
    if (!el) return;
    el.addEventListener('blur', () => validateField(el, errorEl));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(el, errorEl);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Hide previous feedback
    feedback.className = 'form-feedback';

    let valid = true;

    // Validate all fields
    Object.values(fields).forEach(({ el, errorEl }) => {
      if (!validateField(el, errorEl)) valid = false;
    });

    if (!valid) {
      showFeedback('error-msg', '⚠️ Please fill in all required fields correctly.');
      // Focus first error
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate submission (front-end demo only)
    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      showFeedback('success',
        '✓ Message prepared — note this is a front-end demo. To send messages, connect a backend or form service (e.g. Formspree, EmailJS).');
      form.reset();
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message';
      // Clear errors
      Object.values(fields).forEach(({ el, errorEl }) => {
        if (el) el.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
      });
    }, 900);
  });

  function validateField(el, errorEl) {
    if (!el) return true;

    const value = el.value.trim();
    let message = '';

    if (!value) {
      message = 'This field is required.';
    } else if (el.type === 'email') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(value)) message = 'Please enter a valid email address.';
    } else if (el.tagName === 'TEXTAREA' && value.length < 15) {
      message = 'Please enter at least 15 characters.';
    }

    const isValid = !message;
    el.classList.toggle('error', !isValid);
    if (errorEl) errorEl.textContent = message;
    el.setAttribute('aria-invalid', (!isValid).toString());
    return isValid;
  }

  function showFeedback(type, message) {
    feedback.textContent = message;
    feedback.className   = 'form-feedback ' + type;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ─── 7. DYNAMIC COPYRIGHT YEAR ──────────────────────────────
function initCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
