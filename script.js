// DOM Elements
const header = document.getElementById('header');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const scrollToTopBtn = document.getElementById('scroll-to-top');
const currentYearEl = document.getElementById('current-year');
const skillProgressBars = document.querySelectorAll('.skill-progress');
const contactForm = document.getElementById('contact-form');

// Set current year in footer
currentYearEl.textContent = new Date().getFullYear();

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    
    // Smooth scroll to section
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Header shadow on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Show/hide scroll to top button
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
});

// Scroll to top
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Animate skill progress bars when in viewport
function animateSkillBars() {
  skillProgressBars.forEach(bar => {
    const width = bar.getAttribute('data-width');
    bar.style.width = `${width}%`;
  });
}

// Handle form submission
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset error messages
    document.querySelectorAll('.form-error').forEach(error => {
      error.textContent = '';
    });
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Simple validation
    let isValid = true;
    
    if (name.length < 2) {
      document.getElementById('name-error').textContent = 'Name must be at least 2 characters';
      isValid = false;
    }
    
    if (!isValidEmail(email)) {
      document.getElementById('email-error').textContent = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (subject.length < 2) {
      document.getElementById('subject-error').textContent = 'Subject must be at least 2 characters';
      isValid = false;
    }
    
    if (message.length < 10) {
      document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
      isValid = false;
    }
    
    if (isValid) {
      // Simulate form submission with a delay
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        // Log form data (would normally be sent to a server)
        console.log({
          name,
          email,
          subject,
          message
        });
        
        // Show success message
        showToast('Message sent!', 'Thank you for your message. I\'ll get back to you soon.');
        
        // Reset form
        contactForm.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }, 1000);
    }
  });
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Toast notification system
function showToast(title, message) {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // Add toast container styles
    const style = document.createElement('style');
    style.textContent = `
      .toast-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
      }
      
      .toast {
        background-color: white;
        color: #1f2937;
        border-radius: 8px;
        padding: 16px;
        margin-top: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        max-width: 350px;
        animation: slideInRight 0.3s, fadeOut 0.5s 4.5s forwards;
      }
      
      .toast-title {
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .toast-message {
        font-size: 14px;
        color: #4b5563;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const toastTitle = document.createElement('div');
  toastTitle.className = 'toast-title';
  toastTitle.textContent = title;
  
  const toastMessage = document.createElement('div');
  toastMessage.className = 'toast-message';
  toastMessage.textContent = message;
  
  toast.appendChild(toastTitle);
  toast.appendChild(toastMessage);
  toastContainer.appendChild(toast);
  
  // Remove toast after animation
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add animations for specific sections
      if (entry.target.id === 'skills') {
        animateSkillBars();
      }
      
      // Add fade-in animation to all sections
      entry.target.classList.add('fade-in');
      
      // Unobserve after animation
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Initialize animations when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add delay classes to hero elements for staggered animation
  const heroElements = document.querySelectorAll('.hero-subtitle, .hero-title, .hero-description, .hero-paragraph, .hero-buttons');
  
  heroElements.forEach((element, index) => {
    element.classList.add(`delay-${index + 1}`);
  });
});