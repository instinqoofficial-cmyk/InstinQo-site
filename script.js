document.addEventListener('DOMContentLoaded', () => {
    
    // --- STICKY NAV & SHRINK HEADER ---
    const header = document.getElementById('main-header');
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Initialize on load

    // --- MOBILE MENU TOGGLE ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // --- INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ---
    const fadeSections = document.querySelectorAll('.fade-in-section');
    const fadeObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Once visible, stop observing to prevent repeatedly refading on scroll
                observer.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);
    
    fadeSections.forEach(section => {
        fadeObserver.observe(section);
    });

    // --- SCROLL SPY ACTIVE NAV LINK ---
    const spySections = document.querySelectorAll('.scroll-spy-section');
    const spyNavLinks = document.querySelectorAll('.nav-link');
    
    const scrollSpy = () => {
        let currentSectionId = '';
        
        spySections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Subtract offset to activate before the section fully hits the top
            if (window.scrollY >= (sectionTop - 250)) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        spyNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        
        // Exceptional check for top of page / hero
        if (window.scrollY < 200) {
            spyNavLinks.forEach(link => link.classList.remove('active'));
        }
    };
    window.addEventListener('scroll', scrollSpy);
    scrollSpy();

    // --- FLOATING CTAs VISIBILITY & SCROLL TO TOP ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const floatingFab = document.getElementById('floating-fab');
    
    const toggleFloatingButtons = () => {
        if (window.scrollY > 400) {
            scrollToTopBtn.classList.add('visible');
            floatingFab.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
            floatingFab.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', toggleFloatingButtons);
    toggleFloatingButtons();
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- TOAST NOTIFICATIONS SYSTEM ---
    const toastContainer = document.getElementById('toast-container');
    
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Define SVG checkmark icon
        const iconSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m9 12 2 2 4-4"/>
            </svg>
        `;
        
        toast.innerHTML = `${iconSVG}<span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        // Animate out and remove toast
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s ease-in-out forwards';
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 3500);
    };

    // --- EMAIL COPY TO CLIPBOARD ---
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailLink = document.getElementById('email-link');
    
    if (copyEmailBtn && emailLink) {
        copyEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const emailText = emailLink.textContent.trim();
            
            navigator.clipboard.writeText(emailText).then(() => {
                showToast('Email address copied to clipboard!');
                
                // Temporary feedback icon change
                const originalSVG = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check">
                        <path d="M20 6 9 17l-5-5"/>
                    </svg>
                `;
                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalSVG;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }

    // --- DYNAMIC MOUSE GLOW EFFECT ON CARDS ---
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // --- CONTACT FORM SUBMISSION ---
    const contactForm = document.getElementById('contact-form');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // UI Visual Loading State
            const btnSpan = contactSubmitBtn.querySelector('span');
            const originalText = btnSpan.textContent;
            btnSpan.textContent = 'Sending Message...';
            contactSubmitBtn.style.opacity = '0.7';
            contactSubmitBtn.disabled = true;
            
            // Send to Web3Forms
            const formData = new FormData(contactForm);
            formData.append("access_key", window.ENV.WEB3FORMS_ACCESS_KEY);
            
            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });
                
                if (response.ok) {
                    showToast('Message sent successfully! We will contact you soon.');
                    contactForm.reset();
                } else {
                    showToast('Failed to send message. Please try again.', 'error');
                }
            } catch (error) {
                showToast('Failed to send message. Please try again.', 'error');
            } finally {
                btnSpan.textContent = originalText;
                contactSubmitBtn.style.opacity = '1';
                contactSubmitBtn.disabled = false;
            }
        });
    }

    // --- LOCALSTORAGE DEMO DATABASE HANDLERS ---
    const submissionsList = document.getElementById('local-submissions-list');
    const submissionsCol = document.getElementById('my-ideas-col');
    
    const loadLocalSubmissions = () => {
        const ideas = JSON.parse(localStorage.getItem('instinqo_ideas') || '[]');
        
        if (ideas.length > 0) {
            submissionsCol.style.display = 'block';
            submissionsList.innerHTML = '';
            
            // Show up to the 5 most recent submissions
            ideas.slice(-5).reverse().forEach(idea => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div style="font-size: 0.85rem; font-weight:600; color:var(--text-primary); cursor: pointer;" class="footer-idea-link" data-title="${escapeHtml(idea.title)}" data-desc="${escapeHtml(idea.description)}" data-cat="${escapeHtml(idea.category)}">
                        ${escapeHtml(idea.title)} <span style="font-size: 0.7rem; color:var(--secondary);">(${escapeHtml(idea.category)})</span>
                    </div>
                `;
                submissionsList.appendChild(li);
            });
            
            // Add click listeners to show stored idea details in toast
            document.querySelectorAll('.footer-idea-link').forEach(link => {
                link.addEventListener('click', () => {
                    const title = link.getAttribute('data-title');
                    const cat = link.getAttribute('data-cat');
                    showToast(`Viewing: "${title}" [${cat}]`, 'success');
                });
            });
        } else {
            submissionsCol.style.display = 'none';
        }
    };
    
    const escapeHtml = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    };

    // --- IDEA SUBMISSION MODAL LOGIC ---
    const modal = document.getElementById('idea-modal');
    const modalForm = document.getElementById('idea-submit-form');
    const modalSuccess = document.getElementById('modal-success');
    const selectCategory = document.getElementById('idea-category');
    
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.getElementById('modal-close');
    const successCloseBtn = document.getElementById('success-close-btn');
    
    const successTitle = document.getElementById('success-idea-title');
    const successCategory = document.getElementById('success-idea-category');

    const openModal = (initialCategory = 'General') => {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock scroll behind modal
        
        // Reset modal state
        modalForm.style.display = 'flex';
        modalSuccess.style.display = 'none';
        modalForm.reset();
        
        // Auto-select category
        if (selectCategory) {
            let matched = false;
            
            // Only auto-select if a specific valid category (not General) was passed
            if (initialCategory && initialCategory !== 'General') {
                for (let option of selectCategory.options) {
                    if (option.value.toLowerCase() === initialCategory.toLowerCase()) {
                        selectCategory.value = option.value;
                        matched = true;
                        break;
                    }
                }
            }
            
            // If no match or general button clicked, reset to placeholder
            if (!matched) {
                selectCategory.value = '';
            }
            
            // Trigger change event to update custom UI
            selectCategory.dispatchEvent(new Event('change'));
        }
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Restore scroll
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-category') || 'General';
            openModal(cat);
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // --- CUSTOM DROPDOWN LOGIC ---
    const selectWrapper = document.querySelector('.custom-select-wrapper');
    if (selectWrapper && selectCategory) {
        // Hide original select
        selectCategory.style.display = 'none';
        
        // Create custom UI
        const customSelect = document.createElement('div');
        customSelect.className = 'custom-select';
        
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        trigger.innerHTML = `<span>${selectCategory.options[selectCategory.selectedIndex]?.text || 'Select an Area'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>`;
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-options';
        
        Array.from(selectCategory.options).forEach((option, index) => {
            if (index === 0) return; // Skip placeholder
            
            const customOption = document.createElement('div');
            customOption.className = 'custom-option';
            customOption.setAttribute('data-value', option.value);
            customOption.textContent = option.text;
            
            if (option.selected) {
                customOption.classList.add('selected');
                trigger.querySelector('span').textContent = option.text;
            }
            
            customOption.addEventListener('click', function(e) {
                e.stopPropagation();
                // Update native select
                selectCategory.value = this.getAttribute('data-value');
                
                // Update UI
                trigger.querySelector('span').textContent = this.textContent;
                customSelect.classList.remove('open');
                
                // Update selected class
                optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
            
            optionsContainer.appendChild(customOption);
        });
        
        customSelect.appendChild(trigger);
        customSelect.appendChild(optionsContainer);
        selectWrapper.appendChild(customSelect);
        
        // Toggle dropdown
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            customSelect.classList.toggle('open');
        });
        
        // Close when clicking outside
        window.addEventListener('click', function(e) {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
            }
        });
        
        // Update custom UI when native select changes
        selectCategory.addEventListener('change', function() {
            const val = this.value;
            let updatedText = 'Select an Area';
            optionsContainer.querySelectorAll('.custom-option').forEach(opt => {
                if (opt.getAttribute('data-value') === val) {
                    opt.classList.add('selected');
                    updatedText = opt.textContent;
                } else {
                    opt.classList.remove('selected');
                }
            });
            trigger.querySelector('span').textContent = updatedText;
        });
    }

    // Handle Idea form submit
    if (modalForm) {
        modalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('modal-submit-btn');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.querySelector('span').textContent = 'Uploading Idea...';
            
            // Gather values
            const name = document.getElementById('submitter-name').value;
            const email = document.getElementById('submitter-email').value;
            const category = document.getElementById('idea-category').value;
            const title = document.getElementById('idea-title').value;
            const description = document.getElementById('idea-description').value;
            const impact = document.getElementById('idea-impact').value;
            
            const newIdea = {
                id: Date.now(),
                name,
                email,
                category,
                title,
                description,
                impact,
                timestamp: new Date().toISOString()
            };
            
            // Save to LocalStorage
            const ideas = JSON.parse(localStorage.getItem('instinqo_ideas') || '[]');
            ideas.push(newIdea);
            localStorage.setItem('instinqo_ideas', JSON.stringify(ideas));
            
            // Web3Forms Submission
            const formData = new FormData();
            formData.append("access_key", window.ENV.WEB3FORMS_ACCESS_KEY);
            formData.append("subject", "New Idea Submission: " + title);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("category", category);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("impact", impact);
            
            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });
                
                if (response.ok) {
                    // Show Success State
                    successTitle.textContent = title;
                    successCategory.textContent = category;
                    
                    modalForm.style.display = 'none';
                    modalSuccess.style.display = 'flex';
                    
                    showToast('Idea proposal saved and sent!');
                    
                    // Reload submissions list
                    loadLocalSubmissions();
                } else {
                    showToast('Failed to send email, but idea was saved locally.', 'error');
                }
            } catch (error) {
                showToast('Failed to send email, but idea was saved locally.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.querySelector('span').textContent = 'Submit Idea Proposal';
            }
        });
    }

    // --- INITIAL DATA LOAD ---
    loadLocalSubmissions();
});
