// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navbar = document.getElementById('navbar');
const navLinksArray = document.querySelectorAll('.nav-link');

// Mobile menu toggle
if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
}

// Close menu when clicking on a link
navLinksArray.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for navigation links
navLinksArray.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// PARTICLES ANIMATION
// ============================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    // Add CSS animation for particles if not already added
    if (!document.getElementById('particles-style')) {
        const style = document.createElement('style');
        style.id = 'particles-style';
        style.textContent = `
            .particle {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
                animation: particleFloat 15s ease-in-out infinite;
            }
            @keyframes particleFloat {
                0%, 100% { 
                    transform: translate(0, 0) scale(1);
                    opacity: 0.3;
                }
                50% { 
                    transform: translate(30px, -30px) scale(1.2);
                    opacity: 0.6;
                }
            }
        `;
        document.head.appendChild(style);
    }

    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = `rgba(99, 102, 241, ${Math.random() * 0.4 + 0.2})`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);
    }
}

// ============================================
// LOAD PROJECTS FROM LOCALSTORAGE
// ============================================
function loadProjects() {
    const projects = getStoredProjects();
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projectsGrid) return;
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="project-card" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                <p style="color: var(--text-secondary); font-size: 1.125rem;">
                    Nenhum projeto disponível no momento.
                </p>
            </div>
        `;
        return;
    }
    
    projectsGrid.innerHTML = projects.map((project, index) => `
        <div class="project-card fade-in" style="animation-delay: ${index * 0.1}s">
            ${project.image ? `
                <div class="project-image-container">
                    <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
                </div>
            ` : `
                <div class="project-image-container" style="display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2));">
                    <i class="fas fa-folder-open" style="font-size: 4rem; color: var(--primary-color); opacity: 0.5;"></i>
                </div>
            `}
            <div class="card-content">
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.description)}</p>
                <div class="tech-stack">
                    ${project.tech && project.tech.length > 0 
                        ? project.tech.map(t => `<small>${escapeHtml(t.trim())}</small>`).join(' ')
                        : ''
                    }
                </div>
                <div class="card-links">
                    ${project.github ? `
                        <a href="${project.github}" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-github"></i> Code
                        </a>
                    ` : ''}
                    ${project.demo ? `
                        <a href="${project.demo}" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i> Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Observe new project cards for animation
    const newCards = projectsGrid.querySelectorAll('.project-card');
    newCards.forEach(card => observer.observe(card));
}

function getStoredProjects() {
    const stored = localStorage.getItem('portfolio_projects');
    return stored ? JSON.parse(stored) : [];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// LOAD PERSONAL INFO (HERO)
// ============================================
function loadPersonalInfo() {
    const stored = localStorage.getItem('portfolio_personal');
    const data = stored ? JSON.parse(stored) : {};
    
    const heroContent = document.querySelector('.hero-content .hero-text-wrapper');
    if (!heroContent) return;
    
    // Update greeting
    const greetingEl = heroContent.querySelector('.hero-greeting');
    if (greetingEl && data.greeting) {
        greetingEl.textContent = data.greeting;
    }
    
    // Update name
    const nameEl = heroContent.querySelector('.name-text');
    if (nameEl && data.name) {
        nameEl.textContent = data.name;
    }
    
    // Update title
    const titleEl = heroContent.querySelector('.hero-title');
    if (titleEl && data.title) {
        titleEl.textContent = data.title;
    }
    
    // Update description
    const descEl = heroContent.querySelector('.hero-text');
    if (descEl && data.description) {
        descEl.textContent = data.description;
    }
}

// ============================================
// LOAD ABOUT INFO
// ============================================
function loadAboutInfo() {
    const stored = localStorage.getItem('portfolio_about');
    const data = stored ? JSON.parse(stored) : {};
    
    const aboutText = document.querySelector('#about .about-text');
    if (aboutText && data.text) {
        aboutText.textContent = data.text;
    }
    
    const skillsContainer = document.querySelector('.skills-grid');
    if (skillsContainer && data.skills && data.skills.length > 0) {
        skillsContainer.innerHTML = data.skills.map(skill => 
            `<div class="skill-item fade-in">
                <span>${escapeHtml(skill.trim())}</span>
            </div>`
        ).join('');
        
        // Observe new skill items
        const skillItems = skillsContainer.querySelectorAll('.skill-item');
        skillItems.forEach(item => observer.observe(item));
    }
}

// ============================================
// LOAD CONTACT INFO
// ============================================
function loadContactInfo() {
    const stored = localStorage.getItem('portfolio_contact');
    const data = stored ? JSON.parse(stored) : {};
    
    const contactContainer = document.querySelector('#contact .contact-content');
    if (!contactContainer) return;
    
    // Update contact text
    const textEl = contactContainer.querySelector('.contact-text');
    if (textEl && data.text) {
        textEl.textContent = data.text;
    }
    
    // Update email
    const emailLink = contactContainer.querySelector('.email-link');
    if (emailLink) {
        if (data.email) {
            emailLink.querySelector('span').textContent = data.email;
            emailLink.href = `mailto:${data.email}`;
        }
    }
    
    // Update social links
    if (data.social) {
        const socialLinks = contactContainer.querySelectorAll('.social-link');
        
        if (socialLinks.length >= 1 && data.social.linkedin && data.social.linkedin !== '#') {
            socialLinks[0].href = data.social.linkedin;
            socialLinks[0].setAttribute('aria-label', 'LinkedIn');
        }
        if (socialLinks.length >= 2 && data.social.github && data.social.github !== '#') {
            socialLinks[1].href = data.social.github;
            socialLinks[1].setAttribute('aria-label', 'GitHub');
        }
        if (socialLinks.length >= 3 && data.social.instagram && data.social.instagram !== '#') {
            socialLinks[2].href = data.social.instagram;
            socialLinks[2].setAttribute('aria-label', 'Instagram');
        }
    }
}

// ============================================
// ACTIVE NAVIGATION LINK HIGHLIGHTING
// ============================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksArray.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ============================================
// PAGE LOADER
// ============================================
function hideLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 500);
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    loadPersonalInfo();
    loadAboutInfo();
    loadProjects();
    loadContactInfo();
    updateActiveNavLink();
    
    // Hide loader after page loads
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
});

// ============================================
// UPDATE WHEN LOCALSTORAGE CHANGES
// ============================================
window.addEventListener('storage', () => {
    loadPersonalInfo();
    loadAboutInfo();
    loadProjects();
    loadContactInfo();
});

// Custom event listener for same-tab updates (for admin panel)
window.addEventListener('portfolioUpdated', () => {
    loadPersonalInfo();
    loadAboutInfo();
    loadProjects();
    loadContactInfo();
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Throttle scroll events
let ticking = false;
function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveNavLink();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ============================================
// ADD ACTIVE CLASS TO NAV LINKS CSS
// ============================================
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--text-primary);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);
