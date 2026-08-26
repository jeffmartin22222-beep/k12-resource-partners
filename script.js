const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('is-open');
  });
}

const yearNode = document.querySelector('#year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.main-nav a');
navLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('is-current');
    link.setAttribute('aria-current', 'page');
  }
});

const inquirySelect = document.querySelector('#inquiry-type');
if (window.location.hash === '#partner' && inquirySelect) {
  inquirySelect.value = 'A reseller or partnership opportunity';
}

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('.form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : 'Send Message';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    formStatus.hidden = true;
    formStatus.classList.remove('is-error');

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      contactForm.reset();
      contactForm.querySelectorAll('input, select, textarea').forEach((field) => {
        if (field.id === 'inquiry-type') {
          field.value = '';
        }
      });
      formStatus.hidden = false;
      formStatus.classList.remove('is-error');
      formStatus.querySelector('.form-status-title').textContent = 'Thanks! Your message has been sent.';
      formStatus.querySelector('p:last-child').textContent = "We'll be in touch soon.";
      contactForm.querySelector('.hero-actions').style.display = 'none';
      contactForm.querySelector('.form-grid').style.display = 'none';
      contactForm.querySelectorAll('input, select, textarea').forEach((field) => (field.disabled = true));
    } catch (error) {
      formStatus.hidden = false;
      formStatus.classList.add('is-error');
      formStatus.querySelector('.form-status-title').textContent = 'Something went wrong. Please try again.';
      formStatus.querySelector('p:last-child').textContent = '';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}

