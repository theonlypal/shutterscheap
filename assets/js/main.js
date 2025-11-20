const ready = (fn) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

ready(() => {
  const header = document.querySelector('[data-component="header"]');
  const nav = document.getElementById('primary-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const yearEl = document.getElementById('year');
  const sections = document.querySelectorAll('section');
  const scrollButtons = document.querySelectorAll('[data-scroll]');
  const testimonials = Array.from(document.querySelectorAll('.testimonial'));
  const forms = document.querySelectorAll('[data-form="contact"]');
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  const tabPanels = document.querySelectorAll('.tab-panel');

  const smoothScroll = (target) => {
    const el = document.querySelector(target);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open.toString());
    });

    nav.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          event.preventDefault();
          smoothScroll(href);
        }
        if (nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      })
    );
  }

  scrollButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selector = btn.getAttribute('data-scroll');
      if (selector) {
        smoothScroll(selector);
      }
    });
  });

  window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  });

  if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-tab-target');
        const targetPanel = document.getElementById(targetId);
        if (!targetPanel) return;

        tabButtons.forEach((btn) => {
          btn.classList.toggle('is-active', btn === button);
          btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
        });

        tabPanels.forEach((panel) => {
          if (panel === targetPanel) {
            panel.classList.add('is-active');
            panel.removeAttribute('hidden');
          } else {
            panel.classList.remove('is-active');
            panel.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    sections.forEach((section) => observer.observe(section));
  } else {
    sections.forEach((section) => section.classList.add('is-visible'));
  }

  if (testimonials.length) {
    let index = 0;
    setInterval(() => {
      testimonials[index].classList.remove('is-active');
      index = (index + 1) % testimonials.length;
      testimonials[index].classList.add('is-active');
    }, 6000);
  }

  // Form submission with AJAX to prevent redirect
  forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent default form submission

      const statusEl = form.querySelector('.form-status');
      const submitBtn = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);

      if (statusEl && submitBtn) {
        // Show submitting state
        statusEl.textContent = 'Sending...';
        statusEl.style.color = '#3b82f6';
        statusEl.style.opacity = '1';
        statusEl.style.background = 'rgba(59, 130, 246, 0.1)';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
          // Submit form via AJAX to FormSubmit
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            // Show success message
            statusEl.textContent = '✓ Thank you! We'll be in touch shortly!';
            statusEl.style.color = '#10b981';
            statusEl.style.background = 'rgba(16, 185, 129, 0.15)';
            statusEl.style.fontWeight = '600';

            // Reset form after short delay
            setTimeout(() => {
              form.reset();
              submitBtn.disabled = false;
              submitBtn.textContent = 'Request my free estimate';

              // Fade out success message after 5 seconds
              setTimeout(() => {
                statusEl.style.opacity = '0';
                setTimeout(() => {
                  statusEl.textContent = '';
                }, 300);
              }, 5000);
            }, 1000);
          } else {
            throw new Error('Submission failed');
          }
        } catch (error) {
          // Show error message
          statusEl.textContent = 'Something went wrong. Please call us at 702-528-1926';
          statusEl.style.color = '#ef4444';
          statusEl.style.background = 'rgba(239, 68, 68, 0.1)';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request my free estimate';
        }
      }
    });
  });

  // Set minimum date for estimate date picker (can't book in the past)
  const dateInput = document.getElementById('estimate-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Hero image slideshow
  const slideshow = document.querySelector('[data-slideshow]');
  if (slideshow) {
    const images = slideshow.querySelectorAll('.hero-slideshow-image');
    let currentIndex = 0;

    setInterval(() => {
      // Remove active class from current image
      images[currentIndex].classList.remove('active');

      // Move to next image
      currentIndex = (currentIndex + 1) % images.length;

      // Add active class to new image
      images[currentIndex].classList.add('active');
    }, 5000); // Change image every 5 seconds
  }
});
