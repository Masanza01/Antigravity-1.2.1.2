document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in animation to service cards and sections
    const animatedElements = document.querySelectorAll('.service-card, .section-title, .client-item, .feature');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Smooth scroll for anchor links is handled by CSS (html { scroll-behavior: smooth; })

    // Accordion Functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const content = accordionItem.querySelector('.accordion-content');

            // Toggle current item
            accordionItem.classList.toggle('active');

            if (accordionItem.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // Contact Form Submission with Supabase
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formStatus.innerHTML = '';

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value || null,
                company: document.getElementById('company').value || null,
                org_type: document.getElementById('org-type').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value || null
            };

            try {
                // Insert data into Supabase
                const { data, error } = await supabase
                    .from('contact_submissions')
                    .insert([formData]);

                if (error) throw error;

                // Success
                formStatus.innerHTML = `
                    <p style="color: var(--secondary-color); font-size: 1.1rem; font-weight: 500;">
                        ✓ Message sent successfully! We'll get back to you soon.
                    </p>
                `;
                contactForm.reset();

            } catch (error) {
                // Error
                console.error('Error:', error);
                formStatus.innerHTML = `
                    <p style="color: #ff4444; font-size: 1.1rem; font-weight: 500;">
                        ✗ Failed to send message. Please try again or email us directly.
                    </p>
                `;
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // Newsletter Subscription with Supabase
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterStatus = document.getElementById('newsletterStatus');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const emailInput = document.getElementById('newsletterEmail');
            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';
            newsletterStatus.innerHTML = '';

            try {
                const { data, error } = await supabase
                    .from('newsletter_subscriptions')
                    .insert([{ email: emailInput.value }]);

                if (error) {
                    if (error.code === '23505') { // Unique constraint violation
                        throw new Error('This email is already subscribed!');
                    }
                    throw error;
                }

                newsletterStatus.innerHTML = `
                    <p style="color: var(--secondary-color); font-weight: 500;">
                        ✓ Successfully subscribed!
                    </p>
                `;
                newsletterForm.reset();

            } catch (error) {
                console.error('Error:', error);
                newsletterStatus.innerHTML = `
                    <p style="color: #ff4444; font-weight: 500;">
                        ✗ ${error.message}
                    </p>
                `;
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});
