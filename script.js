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

// Carregar galeria do localStorage
function loadGallery() {
    const gallery = getStoredGallery();
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (gallery.length === 0) {
        galleryGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Nenhuma imagem na galeria no momento.</p>';
        return;
    }
    
    galleryGrid.innerHTML = gallery.map(item => `
        <div class="gallery-item">
            <img src="${item.url}" alt="Galeria">
            <div class="gallery-overlay">
                <button class="gallery-view-btn" onclick="viewFullImage('${item.url}')">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getStoredGallery() {
    const stored = localStorage.getItem('portfolio_gallery');
    return stored ? JSON.parse(stored) : [];
}

function viewFullImage(imageUrl) {
    // Criar modal para visualização em tamanho real
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${imageUrl}" alt="Imagem em tamanho real">
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

window.viewFullImage = viewFullImage;

// Carregar dados quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadGallery();
});

// Atualizar quando houver mudanças no localStorage (se a página admin estiver aberta em outra aba)
window.addEventListener('storage', () => {
    loadProjects();
    loadGallery();
});