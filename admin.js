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

// ========== SISTEMA DE TABS ==========
function switchTab(tabName) {
    // Esconder todas as tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover active de todos os botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar tab selecionada
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Adicionar active ao botão
    event.target.classList.add('active');
}

window.switchTab = switchTab;

// ========== NOTIFICAÇÕES (TOAST) ==========
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('.toast-icon');
    const messageEl = toast.querySelector('.toast-message');
    
    toast.className = `toast ${type}`;
    messageEl.textContent = message;
    
    if (type === 'success') {
        icon.className = 'toast-icon fas fa-check-circle';
    } else {
        icon.className = 'toast-icon fas fa-exclamation-circle';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== CARREGAR DADOS ==========
function loadData() {
    loadPersonalInfo();
    loadAboutInfo();
    loadProjects();
    loadContactInfo();
    updateStats();
}

function updateStats() {
    const projects = getProjects();
    const skills = getSkills();
    const social = getSocialLinks();
    
    document.getElementById('projects-count').textContent = projects.length;
    document.getElementById('skills-count').textContent = skills.length;
    
    const socialCount = Object.values(social).filter(link => link && link !== '#').length;
    document.getElementById('social-count').textContent = socialCount;
}

// ========== GERENCIAMENTO DE INFORMAÇÕES PESSOAIS (HERO) ==========
let currentOwnerImage = null;

// Upload da imagem do dono do portfólio
document.getElementById('owner-image-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentOwnerImage = event.target.result;
            showOwnerImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

function showOwnerImagePreview(imageUrl) {
    const previewContainer = document.getElementById('owner-image-preview');
    previewContainer.innerHTML = `
        <div class="image-preview-item" style="width: 200px; height: 200px;">
            <img src="${imageUrl}" alt="Preview" style="border-radius: 50%; object-fit: cover;">
            <button class="remove-preview" onclick="clearOwnerImagePreview()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

function clearOwnerImagePreview() {
    currentOwnerImage = null;
    document.getElementById('owner-image-preview').innerHTML = '';
    document.getElementById('owner-image-upload').value = '';
}

window.clearOwnerImagePreview = clearOwnerImagePreview;

function loadPersonalInfo() {
    const data = getPersonalInfo();
    document.getElementById('hero-greeting').value = data.greeting || '';
    document.getElementById('hero-name').value = data.name || '';
    document.getElementById('hero-title').value = data.title || '';
    document.getElementById('hero-description').value = data.description || '';
    
    // Carregar imagem do dono se existir
    if (data.image) {
        currentOwnerImage = data.image;
        showOwnerImagePreview(data.image);
    }
}

function getPersonalInfo() {
    const stored = localStorage.getItem('portfolio_personal');
    return stored ? JSON.parse(stored) : {};
}

function savePersonalInfo() {
    const existingData = getPersonalInfo();
    const data = {
        greeting: document.getElementById('hero-greeting').value.trim(),
        name: document.getElementById('hero-name').value.trim(),
        title: document.getElementById('hero-title').value.trim(),
        description: document.getElementById('hero-description').value.trim(),
        image: currentOwnerImage || existingData.image || null
    };
    
    localStorage.setItem('portfolio_personal', JSON.stringify(data));
    showToast('Informações pessoais salvas com sucesso!', 'success');
    updateStats();
}

window.savePersonalInfo = savePersonalInfo;

// ========== GERENCIAMENTO DE SOBRE MIM ==========
function loadAboutInfo() {
    const data = getAboutInfo();
    document.getElementById('about-text').value = data.text || '';
    document.getElementById('skills-input').value = data.skills ? data.skills.join(', ') : '';
}

function getAboutInfo() {
    const stored = localStorage.getItem('portfolio_about');
    return stored ? JSON.parse(stored) : {};
}

function getSkills() {
    const about = getAboutInfo();
    return about.skills || [];
}

function saveAboutInfo() {
    const text = document.getElementById('about-text').value.trim();
    const skillsInput = document.getElementById('skills-input').value.trim();
    const skills = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(s => s) : [];
    
    const data = {
        text: text,
        skills: skills
    };
    
    localStorage.setItem('portfolio_about', JSON.stringify(data));
    showToast('Informações sobre você salvas com sucesso!', 'success');
    updateStats();
}

window.saveAboutInfo = saveAboutInfo;

// ========== GERENCIAMENTO DE PROJETOS ==========
let currentProjectImage = null;
let editingProjectId = null;

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
        showToast('Por favor, preencha pelo menos o título do projeto.', 'error');
        return;
    }
    
    const projects = getProjects();
    
    if (editingProjectId) {
        // Editar projeto existente
        const index = projects.findIndex(p => p.id === editingProjectId);
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                title: title,
                description: description || 'Descrição do projeto.',
                tech: tech ? tech.split(',').map(t => t.trim()) : ['HTML', 'CSS', 'JS'],
                github: github || '#',
                demo: demo || '#',
                image: currentProjectImage || projects[index].image
            };
            showToast('Projeto atualizado com sucesso!', 'success');
        }
        editingProjectId = null;
        document.getElementById('add-project-btn').innerHTML = '<i class="fas fa-plus"></i> Adicionar Projeto';
    } else {
        // Adicionar novo projeto
        const project = {
            id: Date.now(),
            title: title,
            description: description || 'Descrição do projeto.',
            tech: tech ? tech.split(',').map(t => t.trim()) : ['HTML', 'CSS', 'JS'],
            github: github || '#',
            demo: demo || '#',
            image: currentProjectImage || null
        };
        projects.push(project);
        showToast('Projeto adicionado com sucesso!', 'success');
    }
    
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    
    // Limpar formulário
    document.getElementById('project-title').value = '';
    document.getElementById('project-description').value = '';
    document.getElementById('project-tech').value = '';
    document.getElementById('project-github').value = '';
    document.getElementById('project-demo').value = '';
    clearProjectPreview();
    
    loadProjects();
    updateStats();
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
            <button class="edit-btn" onclick="editProject(${project.id})" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="deleteProject(${project.id})" title="Excluir">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function editProject(id) {
    const projects = getProjects();
    const project = projects.find(p => p.id === id);
    
    if (project) {
        document.getElementById('project-title').value = project.title;
        document.getElementById('project-description').value = project.description;
        document.getElementById('project-tech').value = project.tech.join(', ');
        document.getElementById('project-github').value = project.github !== '#' ? project.github : '';
        document.getElementById('project-demo').value = project.demo !== '#' ? project.demo : '';
        
        if (project.image) {
            currentProjectImage = project.image;
            showProjectPreview(project.image);
        }
        
        editingProjectId = id;
        document.getElementById('add-project-btn').innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
        
        // Scroll para o formulário
        document.getElementById('project-title').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

window.editProject = editProject;

function deleteProject(id) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        const projects = getProjects();
        const filtered = projects.filter(p => p.id !== id);
        localStorage.setItem('portfolio_projects', JSON.stringify(filtered));
        loadProjects();
        updateStats();
        showToast('Projeto excluído com sucesso!', 'success');
    }
}

window.deleteProject = deleteProject;

// ========== GERENCIAMENTO DE CONTATO ==========
function loadContactInfo() {
    const data = getContactInfo();
    document.getElementById('contact-email').value = data.email || '';
    document.getElementById('contact-text').value = data.text || '';
    document.getElementById('social-linkedin').value = data.social?.linkedin || '';
    document.getElementById('social-github').value = data.social?.github || '';
    document.getElementById('social-instagram').value = data.social?.instagram || '';
    document.getElementById('social-twitter').value = data.social?.twitter || '';
}

function getContactInfo() {
    const stored = localStorage.getItem('portfolio_contact');
    return stored ? JSON.parse(stored) : {};
}

function getSocialLinks() {
    const contact = getContactInfo();
    return contact.social || {};
}

function saveContactInfo() {
    const data = {
        email: document.getElementById('contact-email').value.trim(),
        text: document.getElementById('contact-text').value.trim(),
        social: {
            linkedin: document.getElementById('social-linkedin').value.trim() || '#',
            github: document.getElementById('social-github').value.trim() || '#',
            instagram: document.getElementById('social-instagram').value.trim() || '#',
            twitter: document.getElementById('social-twitter').value.trim() || '#'
        }
    };
    
    localStorage.setItem('portfolio_contact', JSON.stringify(data));
    showToast('Informações de contato salvas com sucesso!', 'success');
    updateStats();
}

window.saveContactInfo = saveContactInfo;

// ========== EXPORTAR/IMPORTAR BACKUP ==========
function exportData() {
    const data = {
        personal: getPersonalInfo(),
        about: getAboutInfo(),
        projects: getProjects(),
        contact: getContactInfo(),
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Backup exportado com sucesso!', 'success');
}

window.exportData = exportData;

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.personal) localStorage.setItem('portfolio_personal', JSON.stringify(data.personal));
            if (data.about) localStorage.setItem('portfolio_about', JSON.stringify(data.about));
            if (data.projects) localStorage.setItem('portfolio_projects', JSON.stringify(data.projects));
            if (data.contact) localStorage.setItem('portfolio_contact', JSON.stringify(data.contact));
            
            loadData();
            showToast('Backup importado com sucesso!', 'success');
        } catch (error) {
            showToast('Erro ao importar backup. Verifique se o arquivo é válido.', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

window.importData = importData;

// Inicializar
checkAuth();
