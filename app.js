// Data Management
class DataManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Sample data
        const sampleData = {
            posts: [
                {
                    id: 1,
                    title: "Bienvenidos a nuestra plataforma",
                    content: "Este es el primer post de ejemplo en nuestra plataforma multimedia.",
                    date: "2025-04-24",
                    featuredImage: "https://via.placeholder.com/400x250/4f46e5/ffffff?text=Post+1"
                }
            ],
            images: [
                {
                    id: 1,
                    title: "Imagen Inspiradora 1",
                    url: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Imagen+1",
                    description: "Una imagen que inspira creatividad",
                    tags: ["inspiración", "creatividad"]
                },
                {
                    id: 2,
                    title: "Imagen Inspiradora 2", 
                    url: "https://via.placeholder.com/400x300/10b981/ffffff?text=Imagen+2",
                    description: "Naturaleza y tranquilidad",
                    tags: ["naturaleza", "paz"]
                }
            ],
            podcasts: [
                {
                    id: 1,
                    title: "Episodio 1: Introducción",
                    description: "Primer episodio de nuestro podcast",
                    date: "2025-04-24",
                    audioUrl: "",
                    duration: "25:30"
                },
                {
                    id: 2,
                    title: "Episodio 2: Creatividad Digital",
                    description: "Hablamos sobre creatividad en el mundo digital",
                    date: "2025-05-01",
                    audioUrl: "",
                    duration: "32:15"
                },
                {
                    id: 3,
                    title: "Episodio 3: Innovación",
                    description: "La innovación en el siglo XXI",
                    date: "2025-05-08",
                    audioUrl: "",
                    duration: "28:45"
                },
                {
                    id: 4,
                    title: "Episodio 4: Tendencias Tech",
                    description: "Las últimas tendencias tecnológicas",
                    date: "2025-05-15",
                    audioUrl: "",
                    duration: "35:20"
                },
                {
                    id: 5,
                    title: "Episodio 5: Futuro Digital",
                    description: "Exploramos el futuro digital",
                    date: "2025-05-22",
                    audioUrl: "",
                    duration: "30:10"
                }
            ]
        };

        // Initialize localStorage if empty
        if (!localStorage.getItem('multimediaData')) {
            localStorage.setItem('multimediaData', JSON.stringify(sampleData));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem('multimediaData') || '{}');
    }

    saveData(data) {
        localStorage.setItem('multimediaData', JSON.stringify(data));
    }

    addItem(type, item) {
        const data = this.getData();
        if (!data[type]) data[type] = [];
        
        item.id = this.generateId(data[type]);
        data[type].push(item);
        this.saveData(data);
        return item;
    }

    deleteItem(type, id) {
        const data = this.getData();
        if (data[type]) {
            data[type] = data[type].filter(item => item.id !== parseInt(id));
            this.saveData(data);
        }
    }

    generateId(array) {
        return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
    }
}

// Notification System
class NotificationManager {
    static show(message, type = 'success') {
        const notification = document.getElementById('notification');
        const text = document.getElementById('notificationText');
        
        text.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 4000);
    }
}

// Main Application
class MultimediaApp {
    constructor() {
        this.dataManager = new DataManager();
        this.currentPage = 'main';
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadMainPageContent();
        this.updateStats();
    }

    bindEvents() {
        // Navigation
        document.getElementById('adminBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('backToMain').addEventListener('click', () => this.showMainPage());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Login
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('cancelLogin').addEventListener('click', () => this.hideLoginModal());

        // Admin Navigation
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchAdminSection(e.target.dataset.section));
        });

        // Form toggles
        document.getElementById('addPostBtn').addEventListener('click', () => this.toggleForm('postForm'));
        document.getElementById('addImageBtn').addEventListener('click', () => this.toggleForm('imageForm'));
        document.getElementById('addPodcastBtn').addEventListener('click', () => this.toggleForm('podcastForm'));

        // Form cancels
        document.getElementById('cancelPost').addEventListener('click', () => this.hideForm('postForm'));
        document.getElementById('cancelImage').addEventListener('click', () => this.hideForm('imageForm'));
        document.getElementById('cancelPodcast').addEventListener('click', () => this.hideForm('podcastForm'));

        // Form submissions
        document.getElementById('newPostForm').addEventListener('submit', (e) => this.handlePostSubmit(e));
        document.getElementById('newImageForm').addEventListener('submit', (e) => this.handleImageSubmit(e));
        document.getElementById('newPodcastForm').addEventListener('submit', (e) => this.handlePodcastSubmit(e));

        // Modals
        document.getElementById('closeNotification').addEventListener('click', () => {
            document.getElementById('notification').classList.add('hidden');
        });

        // Image modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideImageModal();
            }
            if (e.target.classList.contains('modal-close')) {
                this.hideImageModal();
            }
        });

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('postDate').value = today;
        document.getElementById('podcastDate').value = today;
    }

    // Page Navigation
    showMainPage() {
        document.getElementById('mainPage').classList.remove('hidden');
        document.getElementById('adminPage').classList.add('hidden');
        this.currentPage = 'main';
        this.loadMainPageContent();
    }

    showAdminPage() {
        document.getElementById('mainPage').classList.add('hidden');
        document.getElementById('adminPage').classList.remove('hidden');
        this.currentPage = 'admin';
        this.loadAdminContent();
        this.updateStats();
    }

    // Authentication
    showLoginModal() {
        document.getElementById('loginModal').classList.remove('hidden');
    }

    hideLoginModal() {
        document.getElementById('loginModal').classList.add('hidden');
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'admin123') {
            this.isLoggedIn = true;
            this.hideLoginModal();
            this.showAdminPage();
            NotificationManager.show('Inicio de sesión exitoso');
        } else {
            NotificationManager.show('Credenciales incorrectas', 'error');
        }
    }

    logout() {
        this.isLoggedIn = false;
        this.showMainPage();
        NotificationManager.show('Sesión cerrada');
    }

    // Main Page Content Loading
    loadMainPageContent() {
        this.loadPosts();
        this.loadImages();
        this.loadPodcasts();
    }

    loadPosts() {
        const data = this.dataManager.getData();
        const posts = data.posts || [];
        const container = document.getElementById('postsGrid');

        container.innerHTML = posts.map(post => `
            <article class="post-card">
                ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.title}" class="post-image">` : ''}
                <div class="post-card-content">
                    <div class="post-date">${this.formatDate(post.date)}</div>
                    <h3>${post.title}</h3>
                    <p class="post-excerpt">${post.content}</p>
                </div>
            </article>
        `).join('');
    }

    loadImages() {
        const data = this.dataManager.getData();
        const images = data.images || [];
        const container = document.getElementById('imageGallery');

        container.innerHTML = images.map(image => `
            <div class="gallery-item" onclick="app.showImageModal('${image.url}', '${image.title}', '${image.description}')">
                <img src="${image.url}" alt="${image.title}">
                <div class="gallery-overlay">
                    <h3>${image.title}</h3>
                    <p>${image.description}</p>
                </div>
            </div>
        `).join('');
    }

    loadPodcasts() {
        const data = this.dataManager.getData();
        const podcasts = data.podcasts || [];
        const container = document.getElementById('podcastList');

        container.innerHTML = podcasts.map(podcast => `
            <div class="podcast-item">
                <div class="podcast-header">
                    <h3 class="podcast-title">${podcast.title}</h3>
                    <span class="podcast-duration">${podcast.duration}</span>
                </div>
                <div class="podcast-date">${this.formatDate(podcast.date)}</div>
                <p class="podcast-description">${podcast.description}</p>
                <div class="podcast-player">
                    <button class="play-btn" onclick="app.playPodcast('${podcast.title}')">
                        <i class="fas fa-play"></i>
                    </button>
                    <span>Reproducir episodio</span>
                </div>
            </div>
        `).join('');
    }

    // Admin Content Loading
    loadAdminContent() {
        this.loadPostsList();
        this.loadImagesList();
        this.loadPodcastsList();
    }

    loadPostsList() {
        const data = this.dataManager.getData();
        const posts = data.posts || [];
        const container = document.getElementById('postsList');

        container.innerHTML = posts.map(post => `
            <div class="content-item">
                <div class="content-info">
                    <h4>${post.title}</h4>
                    <p>Fecha: ${this.formatDate(post.date)}</p>
                    <p>${post.content.substring(0, 100)}...</p>
                </div>
                <div class="content-actions">
                    <button class="btn btn--outline btn--sm" onclick="app.deletePost(${post.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadImagesList() {
        const data = this.dataManager.getData();
        const images = data.images || [];
        const container = document.getElementById('imagesList');

        container.innerHTML = images.map(image => `
            <div class="content-item">
                <div class="content-info">
                    <h4>${image.title}</h4>
                    <p>${image.description}</p>
                    <p>Tags: ${image.tags.join(', ')}</p>
                </div>
                <div class="content-actions">
                    <button class="btn btn--outline btn--sm" onclick="app.deleteImage(${image.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadPodcastsList() {
        const data = this.dataManager.getData();
        const podcasts = data.podcasts || [];
        const container = document.getElementById('podcastsList');

        container.innerHTML = podcasts.map(podcast => `
            <div class="content-item">
                <div class="content-info">
                    <h4>${podcast.title}</h4>
                    <p>Fecha: ${this.formatDate(podcast.date)} | Duración: ${podcast.duration}</p>
                    <p>${podcast.description}</p>
                </div>
                <div class="content-actions">
                    <button class="btn btn--outline btn--sm" onclick="app.deletePodcast(${podcast.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Admin Section Navigation
    switchAdminSection(section) {
        // Update nav
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        // Hide all forms
        this.hideAllForms();
    }

    // Form Management
    toggleForm(formId) {
        const form = document.getElementById(formId);
        form.classList.toggle('hidden');
        
        if (!form.classList.contains('hidden')) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }

    hideForm(formId) {
        document.getElementById(formId).classList.add('hidden');
    }

    hideAllForms() {
        ['postForm', 'imageForm', 'podcastForm'].forEach(formId => {
            this.hideForm(formId);
        });
    }

    // Content Management
    handlePostSubmit(e) {
        e.preventDefault();
        
        const post = {
            title: document.getElementById('postTitle').value,
            content: document.getElementById('postContent').value,
            date: document.getElementById('postDate').value,
            featuredImage: document.getElementById('postImage').value
        };

        this.dataManager.addItem('posts', post);
        this.loadPostsList();
        this.loadPosts();
        this.updateStats();
        this.hideForm('postForm');
        document.getElementById('newPostForm').reset();
        
        NotificationManager.show('Post creado exitosamente');
    }

    handleImageSubmit(e) {
        e.preventDefault();
        
        const image = {
            title: document.getElementById('imageTitle').value,
            url: document.getElementById('imageUrl').value,
            description: document.getElementById('imageDescription').value,
            tags: document.getElementById('imageTags').value.split(',').map(tag => tag.trim())
        };

        this.dataManager.addItem('images', image);
        this.loadImagesList();
        this.loadImages();
        this.updateStats();
        this.hideForm('imageForm');
        document.getElementById('newImageForm').reset();
        
        NotificationManager.show('Imagen añadida exitosamente');
    }

    handlePodcastSubmit(e) {
        e.preventDefault();
        
        const podcast = {
            title: document.getElementById('podcastTitle').value,
            description: document.getElementById('podcastDescription').value,
            date: document.getElementById('podcastDate').value,
            duration: document.getElementById('podcastDuration').value,
            audioUrl: document.getElementById('podcastAudio').value
        };

        this.dataManager.addItem('podcasts', podcast);
        this.loadPodcastsList();
        this.loadPodcasts();
        this.updateStats();
        this.hideForm('podcastForm');
        document.getElementById('newPodcastForm').reset();
        
        NotificationManager.show('Podcast creado exitosamente');
    }

    // Delete functions
    deletePost(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
            this.dataManager.deleteItem('posts', id);
            this.loadPostsList();
            this.loadPosts();
            this.updateStats();
            NotificationManager.show('Post eliminado exitosamente');
        }
    }

    deleteImage(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            this.dataManager.deleteItem('images', id);
            this.loadImagesList();
            this.loadImages();
            this.updateStats();
            NotificationManager.show('Imagen eliminada exitosamente');
        }
    }

    deletePodcast(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este podcast?')) {
            this.dataManager.deleteItem('podcasts', id);
            this.loadPodcastsList();
            this.loadPodcasts();
            this.updateStats();
            NotificationManager.show('Podcast eliminado exitosamente');
        }
    }

    // Modal Management
    showImageModal(url, title, description) {
        const modal = document.getElementById('imageModal');
        const img = document.getElementById('modalImage');
        const titleEl = document.getElementById('modalImageTitle');
        const descEl = document.getElementById('modalImageDescription');

        img.src = url;
        img.alt = title;
        titleEl.textContent = title;
        descEl.textContent = description;
        
        modal.classList.remove('hidden');
    }

    hideImageModal() {
        document.getElementById('imageModal').classList.add('hidden');
    }

    // Stats Update
    updateStats() {
        const data = this.dataManager.getData();
        
        document.getElementById('totalPosts').textContent = (data.posts || []).length;
        document.getElementById('totalImages').textContent = (data.images || []).length;
        document.getElementById('totalPodcasts').textContent = (data.podcasts || []).length;
    }

    // Utility Functions
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    playPodcast(title) {
        NotificationManager.show(`Reproduciendo: ${title}`);
    }
}

// Initialize App
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MultimediaApp();
});