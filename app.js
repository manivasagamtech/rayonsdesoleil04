// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation functionality
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animateElements = document.querySelectorAll('.section, .service__card, .testimonial__card, .credential, .video__card');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Staggered animation for service cards
    const serviceCards = document.querySelectorAll('.service__card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Staggered animation for testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial__card');
    testimonialCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    // Form handling
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Basic validation
            if (!validateForm(formObject)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                showMessage('Thank you! Your message has been sent. I\'ll get back to you soon!', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Form validation function
    function validateForm(data) {
        const errors = [];
        
        // Required field validation
        if (!data.fullName || data.fullName.trim().length < 2) {
            errors.push('Please enter your full name (at least 2 characters)');
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        // Phone validation (if provided)
        if (data.phone && data.phone.trim().length > 0 && !isValidPhone(data.phone)) {
            errors.push('Please enter a valid phone number');
        }
        
        if (errors.length > 0) {
            showMessage(errors.join('<br>'), 'error');
            return false;
        }
        
        return true;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation helper
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }

    // Show message function
    function showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = message;
        
        // Style the message
        messageDiv.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            font-weight: 500;
            ${type === 'success' ? 
                'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
                'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;
        
        // Insert message before submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        contactForm.insertBefore(messageDiv, submitBtn);
        
        // Auto remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Service card hover effects
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Video testimonial click handling
    const videoCards = document.querySelectorAll('.video__card');
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoName = this.querySelector('.video__name').textContent;
            showMessage(`Video testimonial "${videoName}" would play here. This is a placeholder for video integration.`, 'info');
        });
    });

    // Service learn more button handling
    const serviceButtons = document.querySelectorAll('.service__btn');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceTitle = this.parentElement.querySelector('.service__title').textContent;
            showServiceModal(serviceTitle);
        });
    });

    // Service modal function (simple implementation)
    function showServiceModal(serviceTitle) {
        const modal = document.createElement('div');
        modal.className = 'service-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${serviceTitle}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Thank you for your interest in ${serviceTitle}!</p>
                    <p>This service includes personalized coaching sessions designed to help you achieve breakthrough transformation. I'll work with you to create a customized approach that addresses your specific needs and goals.</p>
                    <p>To learn more about this service or to schedule a consultation, please fill out the contact form below or reach out to me directly.</p>
                    <a href="#contact" class="btn btn--primary modal-cta">Get Started Today</a>
                </div>
            </div>
        `;
        
        // Modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        `;
        
        const modalHeader = modal.querySelector('.modal-header');
        modalHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        `;
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const modalCta = modal.querySelector('.modal-cta');
        modalCta.style.cssText = `
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #FFD700 0%, #87CEEB 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin-top: 1rem;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // CTA click handler
        modalCta.addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroShapes = document.querySelectorAll('.floating-shape');
        
        heroShapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Add loading animation to CTA button
    const ctaButton = document.querySelector('.hero__cta');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${e.offsetX}px;
                top: ${e.offsetY}px;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            }, 300);
        });
    }

    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .hero__cta {
            position: relative;
            overflow: hidden;
        }
        
        .service-modal .modal-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(135, 206, 235, 0.3);
        }
    `;
    document.head.appendChild(style);

    // Initialize all animations with slight delay
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero__title, .hero__subtitle, .hero__cta, .hero__image');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 100);

    // Set initial state for hero elements
    const heroElements = document.querySelectorAll('.hero__title, .hero__subtitle, .hero__cta, .hero__image');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
    });

    // Enhanced form field interactions
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.style.borderColor = '#87CEEB';
            this.style.boxShadow = '0 0 0 3px rgba(135, 206, 235, 0.1)';
        });
        
        control.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = '#f0f0f0';
                this.style.boxShadow = 'none';
            }
        });
        
        // Add floating label effect
        control.addEventListener('input', function() {
            const label = this.previousElementSibling;
            if (this.value) {
                label.style.color = '#87CEEB';
                label.style.fontSize = '0.9rem';
            } else {
                label.style.color = '';
                label.style.fontSize = '';
            }
        });
    });

    console.log('Meghana Rao Transformation Coach website loaded successfully! ✨');
});
