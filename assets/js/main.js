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
    if (!el) {
      console.log('Scroll target not found:', target);
      return;
    }
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    console.log('Scrolling to:', target);
  };

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open.toString());
      console.log('Nav toggle clicked, is-open:', open);
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
            statusEl.textContent = '✓ Thank you! We\'ll be in touch shortly!';
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

  // Hero image slideshow with dots and swipe support
  const slideshow = document.querySelector('[data-slideshow]');
  if (slideshow) {
    const images = slideshow.querySelectorAll('.hero-slideshow-image');
    const dots = slideshow.querySelectorAll('.dot');
    let currentIndex = 0;
    let autoplayInterval = null;

    console.log('=== SLIDESHOW INIT ===');
    console.log('Total images:', images.length);
    console.log('Total dots:', dots.length);

    const showSlide = (targetIndex) => {
      console.log('=== SHOW SLIDE ===');
      console.log('Target index:', targetIndex);
      console.log('Current index before:', currentIndex);

      // Calculate new index with wrapping
      const newIndex = ((targetIndex % images.length) + images.length) % images.length;
      console.log('New index after wrapping:', newIndex);

      // Remove active from all
      images.forEach((img, i) => {
        img.classList.remove('active');
        // Force style check
        const computedStyle = window.getComputedStyle(img);
        console.log(`Image ${i} after remove - opacity: ${computedStyle.opacity}, zIndex: ${computedStyle.zIndex}, display: ${computedStyle.display}`);
      });
      dots.forEach((dot, i) => {
        dot.classList.remove('active');
      });

      // Update current index
      currentIndex = newIndex;

      // Add active to current
      images[currentIndex].classList.add('active');
      if (dots[currentIndex]) {
        dots[currentIndex].classList.add('active');
      }

      // Check computed style after adding active
      const activeStyle = window.getComputedStyle(images[currentIndex]);
      console.log('Active image index:', currentIndex);
      console.log('Image has active class:', images[currentIndex].classList.contains('active'));
      console.log(`Active image computed - opacity: ${activeStyle.opacity}, zIndex: ${activeStyle.zIndex}, display: ${activeStyle.display}, transition: ${activeStyle.transition}`);
      console.log('===================');
    };

    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
        console.log('Autoplay STOPPED');
      }
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayInterval = setInterval(() => {
        console.log('Auto-advancing to next slide...');
        showSlide(currentIndex + 1);
      }, 2000);
      console.log('Autoplay STARTED (2s interval)');
    };

    // Initialize first slide
    showSlide(0);

    // Click handler for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        console.log('Dot clicked:', index);
        e.preventDefault();
        showSlide(index);
        stopAutoplay();
        startAutoplay();
      });
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slideshow.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slideshow.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          console.log('Swiped left - next slide');
          showSlide(currentIndex + 1);
        } else {
          console.log('Swiped right - previous slide');
          showSlide(currentIndex - 1);
        }
        stopAutoplay();
        startAutoplay();
      }
    };

    // Start autoplay
    startAutoplay();

    // Pause autoplay when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  // Mobile select drawer - SIMPLIFIED APPROACH
  console.log('=== MOBILE SELECT DRAWER DEBUG ===');
  console.log('Window width:', window.innerWidth);
  console.log('Screen width:', window.screen.width);
  console.log('User agent:', navigator.userAgent);

  // Check if we're on mobile more reliably
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
  console.log('Is mobile device:', isMobile);

  if (isMobile) {
    console.log('Mobile device detected - setting up drawer');

    const selects = document.querySelectorAll('select');
    console.log('Found select elements:', selects.length);

    if (selects.length === 0) {
      console.warn('NO SELECT ELEMENTS FOUND!');
      return;
    }

    // Create drawer overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99999;
      display: none;
    `;
    document.body.appendChild(overlay);

    // Create drawer
    const drawer = document.createElement('div');
    drawer.style.cssText = `
      position: fixed;
      top: 0;
      right: -100%;
      bottom: 0;
      width: 85%;
      max-width: 400px;
      background: white;
      z-index: 100000;
      transition: right 0.3s ease;
      display: flex;
      flex-direction: column;
      box-shadow: -4px 0 20px rgba(0,0,0,0.3);
    `;

    drawer.innerHTML = `
      <div style="padding: 1.25rem; background: #fcd34d; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
        <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700;" id="drawer-title">Select an option</h3>
        <button type="button" style="background: transparent; border: none; font-size: 2rem; cursor: pointer; padding: 0; width: 36px; height: 36px;" id="close-drawer">&times;</button>
      </div>
      <div id="drawer-options" style="flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;"></div>
    `;
    document.body.appendChild(drawer);

    const drawerTitle = drawer.querySelector('#drawer-title');
    const drawerOptions = drawer.querySelector('#drawer-options');
    const closeBtn = drawer.querySelector('#close-drawer');

    let currentSelect = null;

    const openDrawer = (select) => {
      console.log('>>> OPENING DRAWER <<<');
      currentSelect = select;

      // Set title
      const label = select.closest('label');
      const labelText = label ? label.textContent.split('\n')[0].trim() : 'Select an option';
      drawerTitle.textContent = labelText;

      // Populate options
      drawerOptions.innerHTML = '';
      Array.from(select.options).forEach((option, index) => {
        if (!option.value) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = option.text;
        btn.style.cssText = `
          display: block;
          width: 100%;
          padding: 1rem 1.25rem;
          text-align: left;
          background: ${option.selected ? 'rgba(252, 211, 77, 0.2)' : 'transparent'};
          border: none;
          border-bottom: 1px solid #e2e8f0;
          font-size: 1rem;
          font-weight: ${option.selected ? '600' : '500'};
          cursor: pointer;
        `;

        btn.addEventListener('click', () => {
          console.log('Option clicked:', option.text);
          select.selectedIndex = index;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          closeDrawer();
        });

        drawerOptions.appendChild(btn);
      });

      // Show drawer
      overlay.style.display = 'block';
      setTimeout(() => {
        drawer.style.right = '0';
      }, 10);
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      console.log('>>> CLOSING DRAWER <<<');
      drawer.style.right = '-100%';
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      currentSelect = null;
    };

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Process each select
    selects.forEach((select, idx) => {
      console.log(`Setting up select #${idx}`);

      // Make select invisible but keep in layout
      select.style.cssText = `
        position: absolute !important;
        opacity: 0 !important;
        width: 100% !important;
        height: 100% !important;
        top: 0 !important;
        left: 0 !important;
        z-index: 10 !important;
      `;

      // Wrap it
      const parent = select.parentNode;
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'position: relative;';

      parent.insertBefore(wrapper, select);
      wrapper.appendChild(select);

      // Add touch blocker
      select.addEventListener('touchstart', (e) => {
        console.log(`SELECT #${idx} TOUCH START`);
        e.preventDefault();
        e.stopPropagation();
        openDrawer(select);
      }, { passive: false });

      select.addEventListener('mousedown', (e) => {
        console.log(`SELECT #${idx} MOUSE DOWN`);
        e.preventDefault();
        e.stopPropagation();
        openDrawer(select);
      });

      select.addEventListener('click', (e) => {
        console.log(`SELECT #${idx} CLICK`);
        e.preventDefault();
        e.stopPropagation();
        openDrawer(select);
      });

      console.log(`Select #${idx} setup complete`);
    });

    console.log('=== DRAWER SETUP COMPLETE ===');
  } else {
    console.log('Not a mobile device, skipping');
  }
});
