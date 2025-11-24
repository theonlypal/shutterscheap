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

  // Mobile select drawer enhancement (only on small screens)
  console.log('=== MOBILE SELECT DRAWER DEBUG ===');
  console.log('Window width:', window.innerWidth);
  console.log('Will initialize drawer:', window.innerWidth <= 640);

  if (window.innerWidth <= 640) {
    const selects = document.querySelectorAll('select');
    console.log('Found selects:', selects.length);

    // Create drawer HTML (only once)
    const overlay = document.createElement('div');
    overlay.className = 'mobile-select-drawer__overlay';
    document.body.appendChild(overlay);
    console.log('Overlay created and appended');

    const drawer = document.createElement('div');
    drawer.className = 'mobile-select-drawer';
    drawer.innerHTML = `
      <div class="mobile-select-drawer__header">
        <h3 class="mobile-select-drawer__title">Select an option</h3>
        <button class="mobile-select-drawer__close" type="button" aria-label="Close">&times;</button>
      </div>
      <div class="mobile-select-drawer__options"></div>
    `;
    document.body.appendChild(drawer);
    console.log('Drawer created and appended');

    const closeBtn = drawer.querySelector('.mobile-select-drawer__close');
    const optionsContainer = drawer.querySelector('.mobile-select-drawer__options');
    const drawerTitle = drawer.querySelector('.mobile-select-drawer__title');
    let currentSelect = null;

    const closeDrawer = () => {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      currentSelect = null;
      document.body.style.overflow = '';
    };

    const openDrawer = (select) => {
      console.log('*** openDrawer called ***');
      currentSelect = select;

      // Update drawer title from label
      const label = select.closest('label');
      const labelText = label ? label.childNodes[0].textContent.trim() : 'Select an option';
      drawerTitle.textContent = labelText;
      console.log('Drawer title set to:', labelText);

      // Clear and populate options
      optionsContainer.innerHTML = '';
      Array.from(select.options).forEach((option, index) => {
        if (option.value === '') return; // Skip placeholder options

        const btn = document.createElement('button');
        btn.className = 'mobile-select-drawer__option';
        btn.textContent = option.text;
        btn.type = 'button';

        if (option.selected) {
          btn.classList.add('is-selected');
        }

        btn.addEventListener('click', () => {
          select.selectedIndex = index;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          closeDrawer();
        });

        optionsContainer.appendChild(btn);
      });

      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';

      // Open drawer
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
    };

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    selects.forEach((select, idx) => {
      console.log(`Processing select #${idx}:`, select);

      // Completely disable the native select
      select.style.pointerEvents = 'none';
      select.style.opacity = '0';
      select.style.position = 'absolute';
      console.log(`Select #${idx} hidden`);

      // Create wrapper overlay to catch clicks
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.cursor = 'pointer';

      // Create visual representation
      const fakeSelect = document.createElement('div');
      fakeSelect.className = 'mobile-select-fake';
      fakeSelect.style.cssText = `
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #cbd5e1;
        border-radius: 0.5rem;
        background: #ffffff;
        font-size: 16px;
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 500;
      `;

      const updateFakeSelect = () => {
        const selectedOption = select.options[select.selectedIndex];
        fakeSelect.textContent = selectedOption ? selectedOption.text : 'Select an option';
      };
      updateFakeSelect();
      console.log(`Fake select #${idx} created with text:`, fakeSelect.textContent);

      // Add arrow icon
      const arrow = document.createElement('span');
      arrow.innerHTML = '▼';
      arrow.style.marginLeft = '0.5rem';
      fakeSelect.appendChild(arrow);

      // Insert wrapper before select
      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(fakeSelect);
      wrapper.appendChild(select);
      console.log(`Select #${idx} wrapped and replaced`);

      // Handle clicks on the fake select
      fakeSelect.addEventListener('click', (e) => {
        console.log(`*** Fake select #${idx} CLICKED ***`);
        e.preventDefault();
        e.stopPropagation();
        openDrawer(select);
      });

      // Update fake select when real select changes
      select.addEventListener('change', updateFakeSelect);
    });

    console.log('=== MOBILE SELECT DRAWER SETUP COMPLETE ===');
  } else {
    console.log('Window too wide, skipping mobile drawer');
  }
});
