const ready = (fn) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

ready(() => {
  // ============================================
  // ANALYTICS TRACKING - Track page views
  // ============================================
  const trackPageView = () => {
    try {
      const pageName = document.title.split('|')[0].trim() || window.location.pathname;
      const analytics = JSON.parse(localStorage.getItem('shutterscheap-analytics') || '{}');

      if (!analytics[pageName]) {
        analytics[pageName] = {
          views: 0,
          firstVisit: new Date().toISOString(),
          lastVisit: new Date().toISOString()
        };
      }

      analytics[pageName].views++;
      analytics[pageName].lastVisit = new Date().toISOString();

      localStorage.setItem('shutterscheap-analytics', JSON.stringify(analytics));
    } catch (e) {
      console.log('Analytics tracking disabled (localStorage not available)');
    }
  };

  // Track page view on load
  trackPageView();

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

      // Hide/show bottom nav when hamburger menu toggles
      const bottomNav = document.querySelector('.bottom-nav');
      if (bottomNav) {
        if (open) {
          bottomNav.style.visibility = 'hidden';
          document.body.style.overflow = 'hidden';
        } else {
          bottomNav.style.visibility = 'visible';
          document.body.style.overflow = '';
        }
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

          // Show bottom nav when closing menu
          const bottomNav = document.querySelector('.bottom-nav');
          if (bottomNav) {
            bottomNav.style.visibility = 'visible';
            document.body.style.overflow = '';
          }
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

        // Show bottom nav when closing menu
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) {
          bottomNav.style.visibility = 'visible';
          document.body.style.overflow = '';
        }
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
      }, 5000);
      console.log('Autoplay STARTED (5s interval)');
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

  // NATIVE DROPDOWNS - Simple, familiar, works for everyone
  // No custom drawer needed - native selects work perfectly!

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

  // ============================================
  // INTERACTIVE SELECTOR - Expanding panels
  // ============================================
  // Handle multiple slideshow instances (desktop and mobile)
  const initSlideshow = (container) => {
    const selector = container.querySelector('.interactive-selector');
    if (!selector) return null;

    const options = selector.querySelectorAll('.selector-option');
    const dots = container.querySelectorAll('.selector-dot');
    let currentIndex = 0;
    let autoplayInterval = null;

    const showPanel = (index) => {
      options.forEach(opt => opt.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      options[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
      currentIndex = index;
    };

    const nextPanel = () => {
      const nextIndex = (currentIndex + 1) % options.length;
      showPanel(nextIndex);
    };

    const startAutoplay = () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
      autoplayInterval = setInterval(nextPanel, 4000);
    };

    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    };

    options.forEach((option, index) => {
      option.addEventListener('click', () => {
        showPanel(index);
        stopAutoplay();
        startAutoplay();
      });

      option.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
          showPanel(index);
          stopAutoplay();
        }
      });

      option.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
          startAutoplay();
        }
      });
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showPanel(index);
        stopAutoplay();
        startAutoplay();
      });
    });

    startAutoplay();

    return { startAutoplay, stopAutoplay };
  };

  // Initialize desktop slideshow
  const desktopSlideshow = document.querySelector('.hero-slideshow-desktop');
  const desktopControls = desktopSlideshow ? initSlideshow(desktopSlideshow) : null;

  // Initialize mobile slideshow
  const mobileSlideshow = document.querySelector('.interactive-selector-wrapper');
  const mobileControls = mobileSlideshow ? initSlideshow(mobileSlideshow) : null;

  // Pause autoplay when page is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (desktopControls) desktopControls.stopAutoplay();
      if (mobileControls) mobileControls.stopAutoplay();
    } else {
      if (desktopControls) desktopControls.startAutoplay();
      if (mobileControls) mobileControls.startAutoplay();
    }
  });

  // ============================================
  // VERTICAL PRODUCT SELECTOR (click only, no auto-transition)
  // ============================================
  const verticalSelector = document.querySelector('[data-vertical-selector]');
  if (verticalSelector) {
    const options = verticalSelector.querySelectorAll('.vertical-option');

    const showPanel = (index) => {
      options.forEach(opt => opt.classList.remove('active'));
      options[index].classList.add('active');
    };

    // Click handlers - expand panel on click, navigate on second click
    options.forEach((option, index) => {
      option.addEventListener('click', (e) => {
        if (!option.classList.contains('active')) {
          // First click - expand the panel
          e.preventDefault();
          showPanel(index);
        }
        // Second click (already active) - follow the link
      });
    });
  }

  // ============================================
  // WELCOME POPUP - Show on 1st and 3rd visit
  // ============================================
  const welcomePopup = document.getElementById('welcome-popup');

  if (welcomePopup) {
    const POPUP_KEY = 'shutterscheap-popup';

    // Get popup data from localStorage
    const getPopupData = () => {
      try {
        return JSON.parse(localStorage.getItem(POPUP_KEY)) || { visitCount: 0, dismissed: false };
      } catch (e) {
        return { visitCount: 0, dismissed: false };
      }
    };

    // Save popup data to localStorage
    const savePopupData = (data) => {
      try {
        localStorage.setItem(POPUP_KEY, JSON.stringify(data));
      } catch (e) {
        console.log('localStorage not available');
      }
    };

    // Show the popup
    const showPopup = () => {
      welcomePopup.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    // Hide the popup
    const hidePopup = () => {
      welcomePopup.style.display = 'none';
      document.body.style.overflow = '';
    };

    // POPUP DISABLED - Uncomment below to re-enable
    // setTimeout(() => {
    //   showPopup();
    // }, 1500);

    // Close button handler
    const closeBtn = welcomePopup.querySelector('.popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        hidePopup();
      });
    }

    // Click outside to close
    welcomePopup.addEventListener('click', (e) => {
      if (e.target === welcomePopup) {
        hidePopup();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && welcomePopup.style.display === 'flex') {
        hidePopup();
      }
    });

    // Form submission handler
    const popupForm = welcomePopup.querySelector('.popup-form');
    if (popupForm) {
      popupForm.addEventListener('submit', () => {
        // Mark as submitted so it won't show again
        const data = getPopupData();
        data.submitted = true;
        savePopupData(data);
      });
    }

    // Popup slideshow - auto transition images
    const popupSlideshow = welcomePopup.querySelector('.popup-slideshow');
    if (popupSlideshow) {
      const slides = popupSlideshow.querySelectorAll('.popup-slide');
      let currentSlide = 0;

      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 3000);
    }
  }

  // ============================================
  // GALLERY LIGHTBOX - Mobile-friendly image preview
  // ============================================
  const galleryGrid = document.querySelector('[data-gallery]');
  const lightbox = document.getElementById('galleryLightbox');

  if (galleryGrid && lightbox) {
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const thumbs = galleryGrid.querySelectorAll('.gallery-thumb');

    // Open lightbox when clicking a thumbnail
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const imgSrc = thumb.getAttribute('data-src');
        const imgAlt = thumb.querySelector('img')?.alt || 'Gallery image';

        if (imgSrc && lightboxImage) {
          lightboxImage.src = imgSrc;
          lightboxImage.alt = imgAlt;
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';

          // Hide bottom nav when lightbox is open
          const bottomNav = document.querySelector('.bottom-nav');
          if (bottomNav) {
            bottomNav.style.visibility = 'hidden';
          }
        }
      });
    });

    // Close lightbox function
    const closeLightbox = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Show bottom nav again
      const bottomNav = document.querySelector('.bottom-nav');
      if (bottomNav) {
        bottomNav.style.visibility = 'visible';
      }

      // Clear image after transition
      setTimeout(() => {
        if (lightboxImage) {
          lightboxImage.src = '';
        }
      }, 300);
    };

    // Close on button click
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on clicking outside the image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
        closeLightbox();
      }
    });
  }
});
