// SIH 2025 Interactive Features - Fixed Version

// Global variables
let currentStep = 1;
let totalSteps = 4;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing app');
    initNavigation();
    initCountdown();
    initAnimatedCounters();
    initRegistrationForm();
    initScrollAnimations();
    addGlobalEventListeners();
});

// Navigation functionality - FIXED
function initNavigation() {
    console.log('Initializing navigation');
    
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Mobile menu toggle - FIXED
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nav toggle clicked');
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Navigation links - FIXED
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nav link clicked:', this.getAttribute('href'));
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        });
    });
}

// Countdown timer functionality
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    // Registration deadline: Sept 13, 2025, 8:00 PM IST
    const deadline = new Date('2025-09-13T20:00:00+05:30').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = deadline - now;

        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        } else {
            // Registration closed
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Animated counters
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(target * easeOutQuart);
            
            if (target > 1000000) {
                counter.textContent = (currentValue / 100000).toFixed(1) + 'L+';
            } else {
                counter.textContent = currentValue.toLocaleString('en-IN');
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// Registration form functionality - FIXED
function initRegistrationForm() {
    console.log('Initializing registration form');
    
    const registrationForm = document.getElementById('registrationForm');
    if (!registrationForm) {
        console.log('Registration form not found');
        return;
    }

    generateMemberForms();
    
    // Form submission handler
    registrationForm.addEventListener('submit', handleFormSubmission);
    
    // Make sure first step is active
    showStep(1);
}

function generateMemberForms() {
    const membersContainer = document.getElementById('membersContainer');
    if (!membersContainer) return;

    let memberHTML = '';
    
    for (let i = 2; i <= 6; i++) {
        memberHTML += `
            <div class="member-card">
                <div class="member-header">
                    <h4>Team Member ${i}</h4>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Name *</label>
                        <input type="text" class="form-control" name="member${i}Name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email *</label>
                        <input type="email" class="form-control" name="member${i}Email" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Phone *</label>
                        <input type="tel" class="form-control" name="member${i}Phone" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Branch *</label>
                        <input type="text" class="form-control" name="member${i}Branch" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Year *</label>
                        <select class="form-control" name="member${i}Year" required>
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Gender *</label>
                        <select class="form-control" name="member${i}Gender" required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }
    
    membersContainer.innerHTML = memberHTML;
}

// Form step navigation - FIXED
function nextStep() {
    console.log('Next step clicked, current step:', currentStep);
    
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function prevStep() {
    console.log('Previous step clicked, current step:', currentStep);
    
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function showStep(step) {
    console.log('Showing step:', step);
    
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Hide all progress steps
    document.querySelectorAll('.progress-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const currentProgressEl = document.querySelector(`.progress-step[data-step="${step}"]`);
    
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    if (currentProgressEl) {
        currentProgressEl.classList.add('active');
    }
}

function validateCurrentStep() {
    console.log('Validating step:', currentStep);
    
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!currentStepElement) return false;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    // Remove previous error styling
    requiredFields.forEach(field => {
        field.classList.remove('error');
    });

    // Validate required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        }
    });

    // Special validation for step 2 - check for at least one female
    if (currentStep === 2 && isValid) {
        const genderSelects = currentStepElement.querySelectorAll('select[name*="Gender"]');
        let hasFemale = false;
        
        genderSelects.forEach(select => {
            if (select.value === 'female') {
                hasFemale = true;
            }
        });

        if (!hasFemale) {
            showNotification('Team must include at least one female member as per SIH guidelines.', 'error');
            isValid = false;
        }
    }

    // Email validation
    const emailFields = currentStepElement.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            field.classList.add('error');
            isValid = false;
        }
    });

    // Phone validation
    const phoneFields = currentStepElement.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        if (field.value && !isValidPhone(field.value)) {
            field.classList.add('error');
            isValid = false;
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

function handleFormSubmission(e) {
    e.preventDefault();
    console.log('Form submitted');
    
    if (!validateCurrentStep()) {
        return;
    }

    // Check terms checkbox
    const termsCheckbox = document.querySelector('input[name="terms"]');
    if (!termsCheckbox || !termsCheckbox.checked) {
        showNotification('Please accept the terms and conditions.', 'error');
        return;
    }

    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        const registrationForm = document.getElementById('registrationForm');
        const successMessage = document.getElementById('successMessage');
        
        if (registrationForm) registrationForm.style.display = 'none';
        if (successMessage) {
            successMessage.classList.remove('hidden');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        showNotification('Registration submitted successfully!', 'success');
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

function resetForm() {
    console.log('Resetting form');
    
    const registrationForm = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    
    if (registrationForm) {
        registrationForm.reset();
        registrationForm.style.display = 'block';
    }
    
    if (successMessage) {
        successMessage.classList.add('hidden');
    }
    
    currentStep = 1;
    showStep(1);
}

// Utility function for smooth scrolling - FIXED
function scrollToSection(sectionId) {
    console.log('Scrolling to section:', sectionId);
    
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 80;
        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);
    
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(notif => {
        notif.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 24px',
        borderRadius: '8px',
        zIndex: '10000',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    });
    
    // Colors based on type
    if (type === 'error') {
        Object.assign(notification.style, {
            backgroundColor: '#FEE',
            color: '#C53030',
            border: '1px solid #FEB2B2'
        });
    } else if (type === 'success') {
        Object.assign(notification.style, {
            backgroundColor: '#F0FFF4',
            color: '#22543D',
            border: '1px solid #9AE6B4'
        });
    } else {
        Object.assign(notification.style, {
            backgroundColor: '#EBF8FF',
            color: '#2A69AC',
            border: '1px solid #90CDF4'
        });
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.benefit-card, .category-tag, .timeline-item, .contact-card');
    
    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

// Global event listeners - FIXED
function addGlobalEventListeners() {
    console.log('Adding global event listeners');
    
    // Make nextStep and prevStep globally available
    window.nextStep = nextStep;
    window.prevStep = prevStep;
    window.scrollToSection = scrollToSection;
    window.resetForm = resetForm;
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu && navToggle && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target) && 
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Handle scroll for navbar background
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });
}

// Add error styles
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-control.error {
        border-color: #bf1922 !important;
        box-shadow: 0 0 0 3px rgba(191, 25, 34, 0.1) !important;
    }
    
    .form-control {
        background-color: var(--color-surface) !important;
        color: var(--color-text) !important;
    }
    
    .form-control:focus {
        border-color: var(--sih-orange) !important;
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2) !important;
        outline: none !important;
    }
`;
document.head.appendChild(errorStyles);