// Menu Responsivo
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fechar o menu ao clicar em um link (opcional, melhora UX)
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Carregar projetos do localStorage
function loadProjects() {
    const projects = getStoredProjects();
    const projectsGrid = document.getElementById('projects-grid');
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Nenhum projeto disponível no momento.</p>';
        return;
    }
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            ${project.image ? `
                <div class="project-image-container">
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                </div>
            ` : ''}
            <div class="card-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tech-stack">
                    ${project.tech.map(t => `<small>${t}</small>`).join(' ')}
                </div>
                <div class="card-links">
                    <a href="${project.github}" target="_blank"><i class="fab fa-github"></i> Code</a>
                    <a href="${project.demo}" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>
                </div>
            </div>
        </div>
    `).join('');
}

function getStoredProjects() {
    const stored = localStorage.getItem('portfolio_projects');
    return stored ? JSON.parse(stored) : [];
}


// Carregar informações pessoais (Hero)
function loadPersonalInfo() {
    const stored = localStorage.getItem('portfolio_personal');
    const data = stored ? JSON.parse(stored) : {};
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Adicionar imagem do dono se existir
        if (data.image) {
            let ownerImage = heroContent.querySelector('.owner-image');
            if (!ownerImage) {
                ownerImage = document.createElement('div');
                ownerImage.className = 'owner-image';
                heroContent.insertBefore(ownerImage, heroContent.firstChild);
            }
            ownerImage.innerHTML = `<img src="${data.image}" alt="${data.name || 'Foto do perfil'}">`;
        }
        
        if (data.greeting) {
            const greetingEl = heroContent.querySelector('p');
            if (greetingEl) greetingEl.textContent = data.greeting;
        }
        if (data.name) {
            const nameEl = heroContent.querySelector('h1');
            if (nameEl) nameEl.textContent = data.name;
        }
        if (data.title) {
            const titleEl = heroContent.querySelector('h2');
            if (titleEl) titleEl.textContent = data.title;
        }
        if (data.description) {
            const descEl = heroContent.querySelector('.hero-text');
            if (descEl) descEl.textContent = data.description;
        }
    }
}

// Carregar seção Sobre Mim
function loadAboutInfo() {
    const stored = localStorage.getItem('portfolio_about');
    const data = stored ? JSON.parse(stored) : {};
    
    const aboutText = document.querySelector('#about .about-text p');
    if (aboutText && data.text) {
        aboutText.textContent = data.text;
    }
    
    const skillsContainer = document.querySelector('.skills');
    if (skillsContainer && data.skills && data.skills.length > 0) {
        skillsContainer.innerHTML = data.skills.map(skill => 
            `<span>${skill}</span>`
        ).join('');
    }
}

// Carregar informações de contato
function loadContactInfo() {
    const stored = localStorage.getItem('portfolio_contact');
    const data = stored ? JSON.parse(stored) : {};
    
    const contactContainer = document.querySelector('#contact .contact-container');
    if (contactContainer) {
        if (data.text) {
            const textEl = contactContainer.querySelector('p');
            if (textEl) textEl.textContent = data.text;
        }
        
        if (data.email) {
            const emailLink = contactContainer.querySelector('.email-link');
            if (emailLink) {
                emailLink.textContent = data.email;
                emailLink.href = `mailto:${data.email}`;
            }
        }
        
        if (data.social) {
            const socialLinks = contactContainer.querySelectorAll('.social-links a');
            if (socialLinks.length >= 1 && data.social.linkedin && data.social.linkedin !== '#') {
                socialLinks[0].href = data.social.linkedin;
            }
            if (socialLinks.length >= 2 && data.social.github && data.social.github !== '#') {
                socialLinks[1].href = data.social.github;
            }
            if (socialLinks.length >= 3 && data.social.instagram && data.social.instagram !== '#') {
                socialLinks[2].href = data.social.instagram;
            }
        }
    }
}

// Carregar dados quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadPersonalInfo();
    loadAboutInfo();
    loadProjects();
    loadContactInfo();
});

// Atualizar quando houver mudanças no localStorage (se a página admin estiver aberta em outra aba)
window.addEventListener('storage', () => {
    loadPersonalInfo();
    loadAboutInfo();
    loadProjects();
    loadContactInfo();
});