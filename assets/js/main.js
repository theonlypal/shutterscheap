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
    // Toggle menu on button click
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open.toString());

      // Prevent body scroll when menu is open
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking a link
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
          document.body.style.overflow = '';
        }
      })
    );

    // Close menu when clicking overlay (outside the nav)
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') &&
          !nav.contains(e.target) &&
          !navToggle.contains(e.target)) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
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

  // MOBILE SELECT REPLACEMENT - Wait for everything to load then replace
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

  if (isMobile) {
    // Use setTimeout to ensure this runs AFTER any other scripts
    setTimeout(() => {
      const selects = document.querySelectorAll('select');

      if (selects.length === 0) return;

      // Create overlay
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

      const drawerHeader = document.createElement('div');
      drawerHeader.style.cssText = `
        padding: 1.25rem;
        background: #fcd34d;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      `;
      drawerHeader.innerHTML = `
        <h3 id="drawer-title" style="margin: 0; font-size: 1.125rem; font-weight: 700;">Select</h3>
        <button type="button" id="close-drawer" style="background: transparent; border: none; font-size: 2rem; cursor: pointer; padding: 0; width: 36px; height: 36px;">&times;</button>
      `;

      const drawerContent = document.createElement('div');
      drawerContent.id = 'drawer-options';
      drawerContent.style.cssText = `
        flex: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      `;

      drawer.appendChild(drawerHeader);
      drawer.appendChild(drawerContent);
      document.body.appendChild(drawer);

      const openDrawer = (button, hiddenInput, options, label) => {
        document.getElementById('drawer-title').textContent = label;

        drawerContent.innerHTML = '';
        options.forEach(opt => {
          const optBtn = document.createElement('button');
          optBtn.type = 'button';
          optBtn.textContent = opt.text;
          optBtn.style.cssText = `
            display: block;
            width: 100%;
            padding: 1rem 1.25rem;
            text-align: left;
            background: ${opt.value === hiddenInput.value ? 'rgba(252, 211, 77, 0.2)' : 'transparent'};
            border: none;
            border-bottom: 1px solid #e2e8f0;
            font-size: 1rem;
            font-weight: ${opt.value === hiddenInput.value ? '600' : '500'};
            cursor: pointer;
          `;

          optBtn.addEventListener('click', () => {
            hiddenInput.value = opt.value;
            button.textContent = opt.text;
            button.style.color = '#0f172a';
            closeDrawer();
          });

          drawerContent.appendChild(optBtn);
        });

        overlay.style.display = 'block';
        setTimeout(() => {
          drawer.style.right = '0';
        }, 10);
        document.body.style.overflow = 'hidden';
      };

      const closeDrawer = () => {
        drawer.style.right = '-100%';
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      };

      document.getElementById('close-drawer').addEventListener('click', closeDrawer);
      overlay.addEventListener('click', closeDrawer);

      // Replace each select
      selects.forEach((select) => {
        const isRequired = select.hasAttribute('required');
        const name = select.getAttribute('name');

        // Extract options
        const options = Array.from(select.options)
          .filter(opt => opt.value)
          .map(opt => ({ value: opt.value, text: opt.text }));

        // Get label text
        const label = select.closest('label');
        const labelText = label ? label.textContent.split('\n')[0].trim().replace(/\*$/, '') : 'Select';

        // Create hidden input
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = name;
        hiddenInput.value = '';
        if (isRequired) {
          hiddenInput.setAttribute('data-required', 'true');
        }

        // Create visible button
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Select one';
        button.style.cssText = `
          width: 100%;
          font-size: 16px;
          padding: 0.75rem;
          border-radius: 0.5rem;
          min-height: 48px;
          background-color: #ffffff;
          border: 2px solid #cbd5e1;
          cursor: pointer;
          font-weight: 500;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%230f172a' d='M4 6l4 4 4-4z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 16px;
          padding-right: 2.5rem;
          text-align: left;
          font-family: inherit;
          color: #94a3b8;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        `;

        button.addEventListener('touchstart', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openDrawer(button, hiddenInput, options, labelText);
        }, { passive: false });

        button.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openDrawer(button, hiddenInput, options, labelText);
        });

        // Handle form validation
        const form = select.closest('form');
        if (form && isRequired) {
          form.addEventListener('submit', (e) => {
            if (!hiddenInput.value) {
              e.preventDefault();
              e.stopPropagation();
              button.style.borderColor = '#ef4444';
              button.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
              alert(`Please select ${labelText}`);
              return false;
            }
          }, true);
        }

        // CRITICAL: Remove select from DOM completely
        const parent = select.parentNode;
        parent.insertBefore(button, select);
        parent.insertBefore(hiddenInput, select);
        parent.removeChild(select);
      });
    }, 100);
  }

  // ============================================
  // BOTTOM NAVIGATION BAR - Active State Management
  // ============================================
  const bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) {
    const bottomNavItems = bottomNav.querySelectorAll('.bottom-nav__item');

    // Set active state based on current page
    const currentPage = window.location.pathname;
    const currentHash = window.location.hash;

    bottomNavItems.forEach(item => {
      const href = item.getAttribute('href');

      // Check if this is the current page
      if (href) {
        // For hash links (like #contact)
        if (href.startsWith('#') && currentHash === href) {
          item.classList.add('active');
        }
        // For page links (like shutters.html)
        else if (href.includes('.html') && currentPage.includes(href.split('?')[0].split('#')[0])) {
          item.classList.add('active');
        }
        // For home page
        else if (href.includes('#home') && (currentPage === '/' || currentPage.includes('index.html'))) {
          item.classList.add('active');
        }
      }
    });

    // Handle smooth scrolling for hash links
    bottomNavItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');

        // Only handle hash links on the same page
        if (href && href.startsWith('#')) {
          e.preventDefault();

          // Remove active from all items
          bottomNavItems.forEach(i => i.classList.remove('active'));

          // Add active to clicked item
          item.classList.add('active');

          // Smooth scroll to target
          smoothScroll(href);

          // Update URL hash without jumping
          history.pushState(null, null, href);
        }

        // For external links (like tel:), let them work normally
        // For page navigation, let the browser handle it
      });
    });

    // Update active state on scroll (for hash sections)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.pageYOffset + 100;

        // Check which section is in view
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          const sectionId = section.getAttribute('id');

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Find matching bottom nav item
            bottomNavItems.forEach(item => {
              const href = item.getAttribute('href');
              if (href && href.includes('#' + sectionId)) {
                bottomNavItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
              }
            });
          }
        });
      }, 100);
    });
  }
});
