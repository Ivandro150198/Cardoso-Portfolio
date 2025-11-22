// Configuração da senha (em produção, isso deveria estar em um backend seguro)
// Por padrão, a senha é "admin123" - ALTERE ISSO!
const ADMIN_PASSWORD = 'admin123';

// Verificar se está logado
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    if (isAuthenticated) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        loadData();
    }
}

// Login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_authenticated', 'true');
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('password').value = '';
        errorMsg.textContent = '';
        loadData();
    } else {
        errorMsg.textContent = 'Senha incorreta!';
        document.getElementById('password').value = '';
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('admin_authenticated');
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
});

// Carregar dados do localStorage
function loadData() {
    loadProjects();
    loadGallery();
}

// ========== GERENCIAMENTO DE PROJETOS ==========

let currentProjectImage = null;

document.getElementById('project-image-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentProjectImage = event.target.result;
            showProjectPreview(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

function showProjectPreview(imageUrl) {
    const previewContainer = document.getElementById('project-preview');
    previewContainer.innerHTML = `
        <div class="image-preview-item">
            <img src="${imageUrl}" alt="Preview">
            <button class="remove-preview" onclick="clearProjectPreview()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

function clearProjectPreview() {
    currentProjectImage = null;
    document.getElementById('project-preview').innerHTML = '';
    document.getElementById('project-image-upload').value = '';
}

window.clearProjectPreview = clearProjectPreview;

document.getElementById('add-project-btn').addEventListener('click', () => {
    const title = document.getElementById('project-title').value.trim();
    const description = document.getElementById('project-description').value.trim();
    const tech = document.getElementById('project-tech').value.trim();
    const github = document.getElementById('project-github').value.trim();
    const demo = document.getElementById('project-demo').value.trim();
    
    if (!title) {
        alert('Por favor, preencha pelo menos o título do projeto.');
        return;
    }
    
    const project = {
        id: Date.now(),
        title: title || 'Novo Projeto',
        description: description || 'Descrição do projeto.',
        tech: tech ? tech.split(',').map(t => t.trim()) : ['HTML', 'CSS', 'JS'],
        github: github || '#',
        demo: demo || '#',
        image: currentProjectImage || null
    };
    
    // Salvar no localStorage
    const projects = getProjects();
    projects.push(project);
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    
    // Limpar formulário
    document.getElementById('project-title').value = '';
    document.getElementById('project-description').value = '';
    document.getElementById('project-tech').value = '';
    document.getElementById('project-github').value = '';
    document.getElementById('project-demo').value = '';
    clearProjectPreview();
    
    // Recarregar lista
    loadProjects();
});

function getProjects() {
    const stored = localStorage.getItem('portfolio_projects');
    return stored ? JSON.parse(stored) : [];
}

function loadProjects() {
    const projects = getProjects();
    const projectsList = document.getElementById('projects-list');
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">Nenhum projeto adicionado ainda.</p>';
        return;
    }
    
    projectsList.innerHTML = projects.map(project => `
        <div class="admin-item-card">
            ${project.image ? `<img src="${project.image}" alt="${project.title}" class="item-image">` : ''}
            <h3 class="item-title">${project.title}</h3>
            <p class="item-description">${project.description}</p>
            <div class="item-tech">
                ${project.tech.map(t => `<small>${t}</small>`).join('')}
            </div>
            <div class="item-actions">
                <a href="${project.github}" target="_blank">
                    <i class="fab fa-github"></i> GitHub
                </a>
                <a href="${project.demo}" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Demo
                </a>
            </div>
            <button class="delete-btn" onclick="deleteProject(${project.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function deleteProject(id) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        const projects = getProjects();
        const filtered = projects.filter(p => p.id !== id);
        localStorage.setItem('portfolio_projects', JSON.stringify(filtered));
        loadProjects();
    }
}

window.deleteProject = deleteProject;

// ========== GERENCIAMENTO DE GALERIA ==========

document.getElementById('gallery-image-upload').addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                addImageToGallery(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    document.getElementById('gallery-image-upload').value = '';
});

function addImageToGallery(imageUrl) {
    const gallery = getGallery();
    gallery.push({
        id: Date.now(),
        url: imageUrl
    });
    localStorage.setItem('portfolio_gallery', JSON.stringify(gallery));
    loadGallery();
}

function getGallery() {
    const stored = localStorage.getItem('portfolio_gallery');
    return stored ? JSON.parse(stored) : [];
}

function loadGallery() {
    const gallery = getGallery();
    const galleryList = document.getElementById('gallery-list');
    
    if (gallery.length === 0) {
        galleryList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">Nenhuma imagem na galeria ainda.</p>';
        return;
    }
    
    galleryList.innerHTML = gallery.map(item => `
        <div class="gallery-item-admin">
            <img src="${item.url}" alt="Galeria">
            <button class="delete-btn" onclick="deleteGalleryItem(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function deleteGalleryItem(id) {
    if (confirm('Tem certeza que deseja excluir esta imagem?')) {
        const gallery = getGallery();
        const filtered = gallery.filter(item => item.id !== id);
        localStorage.setItem('portfolio_gallery', JSON.stringify(filtered));
        loadGallery();
    }
}

window.deleteGalleryItem = deleteGalleryItem;

// Inicializar
checkAuth();

