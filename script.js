/**
 * Bheemshetty Ankitha - Portfolio Scripts
 * White & Black Mode theme switcher, mobile menu, scroll spy, entrance animations, and Formspree contact form.
 * Strictly separate JS file with no inline scripts in HTML.
 */

// 1. Immediate theme execution: runs as soon as script is parsed to prevent theme flash on refresh
(function initTheme() {
  const savedTheme = localStorage.getItem('ankitha-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.documentElement;

  // 2. Current Year in Footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. White & Black Mode Toggle Button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Add temporary transition class only during user click so page reloads never flash
      rootElement.classList.add('theme-transitioning');

      const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      rootElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('ankitha-theme', newTheme);

      setTimeout(() => {
        rootElement.classList.remove('theme-transitioning');
      }, 300);
    });
  }

  // 4. Mobile Navigation Menu Toggle (opens directly on current screen position)
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 5. Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links .nav-item');

  if (sections.length && navItems.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;

      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItems.forEach((item) => {
            if (item.getAttribute('href') === `#${sectionId}`) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, { passive: true });
  }

  // 6. Scroll & Entrance Reveal Animations (Sections and boxes slide up into view)
  const revealElements = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // 7. Formspree Contact Form Submission (AJAX)
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const formResponse = document.getElementById('form-response');

  if (contactForm && submitBtn && formResponse) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      formResponse.textContent = '';
      formResponse.className = 'form-response';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json'
          }
        });

        if (response.ok) {
          formResponse.textContent = 'Thank you! Your message has been sent successfully.';
          formResponse.classList.add('success');
          contactForm.reset();

          // Auto-hide message after 3 seconds
          setTimeout(() => {
            formResponse.textContent = '';
            formResponse.className = 'form-response';
          }, 3000);
        } else {
          const res = await response.json();
          const errorMsg = res?.errors?.map((err) => err.message).join(', ') || 'Something went wrong. Please try again.';
          formResponse.textContent = errorMsg;
          formResponse.classList.add('error');

          // Auto-hide error message after 3 seconds
          setTimeout(() => {
            formResponse.textContent = '';
            formResponse.className = 'form-response';
          }, 3000);
        }
      } catch (err) {
        formResponse.textContent = 'Unable to send message. Please check your network and try again.';
        formResponse.classList.add('error');

        // Auto-hide error message after 3 seconds
        setTimeout(() => {
          formResponse.textContent = '';
          formResponse.className = 'form-response';
        }, 3000);
      } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});
