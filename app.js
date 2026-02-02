// Variables globales
let currentUserType = '';

// Usuarios de prueba
const demoUsers = {
    'propietario': { 
        password: 'propietario123', 
        type: 'propietario', 
        name: 'Carlos Propietario' 
    },
    'inquilino': { 
        password: 'inquilino123', 
        type: 'inquilino', 
        name: 'María Inquilina' 
    }
};

// ============================================
// FUNCIONES DE LOGIN
// ============================================

function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.form-section');

    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(tab).classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = demoUsers[username];

    if (user && user.password === password) {
        currentUserType = user.type;
        // Guardar en localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        showDashboard(user);
    } else {
        alert('❌ Usuario o contraseña incorrectos.\n\nPrueba con:\n• propietario / propietario123\n• inquilino / inquilino123');
    }
}

function handleRegister(e) {
    e.preventDefault();
    alert('ℹ️ El registro está deshabilitado en la versión demo.\n\nUsa los usuarios de prueba para iniciar sesión.');
}

// ============================================
// FUNCIONES DE DASHBOARD
// ============================================

function showDashboard(user) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard-screen').classList.add('active');

    // Actualizar información del usuario
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-avatar').textContent = user.name.charAt(0);
    
    if (user.type === 'propietario') {
        document.getElementById('user-type-display').innerHTML = '🏠 Alquilo Cuarto';
        document.getElementById('propietario-section').classList.add('active');
        document.getElementById('inquilino-section').classList.remove('active');
        // Mostrar navegación de propietario
        document.getElementById('propietario-nav').style.display = 'flex';
        document.getElementById('inquilino-nav').style.display = 'none';
    } else {
        document.getElementById('user-type-display').innerHTML = '🔍 Busco Cuarto';
        document.getElementById('inquilino-section').classList.add('active');
        document.getElementById('propietario-section').classList.remove('active');
        // Mostrar navegación de inquilino
        document.getElementById('inquilino-nav').style.display = 'flex';
        document.getElementById('propietario-nav').style.display = 'none';
    }
}

function navigateTo(section) {
    // Si es publicar, redirigir a la página de publicar
    if (section === 'publicar') {
        window.location.href = 'publicar.html';
        return;
    }

    // Si es buscar, redirigir a la página de búsqueda
    if (section === 'buscar') {
        window.location.href = 'buscar.html';
        return;
    }

    // Si es mis cuartos, redirigir a la página de mis cuartos
    if (section === 'mis-cuartos') {
        window.location.href = 'mis-cuartos.html';
        return;
    }

    // Si es favoritos, redirigir a la página de favoritos
    if (section === 'favoritos') {
        window.location.href = 'favoritos.html';
        return;
    }
    //perfiles
    if (section === 'perfil-inquilino') {
        window.location.href = 'perfil-inquilino.html';
        return;
    }

    if (section === 'perfil-propietario') {
        window.location.href = 'perfil-propietario.html';
        return;
    }

    // Para las demás secciones, mostrar mensaje de próximamente
    const messages = {
        'contactos': 'Próximamente: Contactos recibidos',
        'ayuda': 'Próximamente: Ayuda y reglas'
    };
    
    alert(messages[section] || 'Sección en desarrollo');
}

// ============================================
// NAVEGACIÓN INFERIOR
// ============================================

function goToHome() {
    updateActiveNav(0);
}

function goToSearch() {
    updateActiveNav(1);
    navigateTo('buscarcuarto');
}

function goToPublish() {
    updateActiveNav(1);
    navigateTo('publicar');
}

function goToMyRooms() {
    updateActiveNav(2);
    navigateTo('mis-cuartos');
}

function goToFavorites() {
    updateActiveNav(2);
    navigateTo('favoritos');
}

function goToProfile() {
    updateActiveNav(3);
    navigateTo('perfil-' + currentUserType);
}

function updateActiveNav(index) {
    // Determinar qué navegación está visible
    const inquilinoNav = document.getElementById('inquilino-nav');
    const propietarioNav = document.getElementById('propietario-nav');
    
    let activeNav;
    if (inquilinoNav && inquilinoNav.style.display !== 'none') {
        activeNav = inquilinoNav;
    } else if (propietarioNav && propietarioNav.style.display !== 'none') {
        activeNav = propietarioNav;
    }
    
    if (activeNav) {
        activeNav.querySelectorAll('.nav-item').forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// ============================================
// CERRAR SESIÓN
// ============================================

function cerrarSesion() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        // Limpiar el usuario guardado
        localStorage.removeItem('currentUser');
        
        // Resetear variables
        currentUserType = '';
        
        // Ocultar dashboard y mostrar login
        document.getElementById('dashboard-screen').classList.remove('active');
        document.getElementById('login-screen').style.display = 'flex';
        
        // Limpiar formulario de login
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        
        // Mostrar mensaje
        alert('✅ Sesión cerrada exitosamente');
    }
}

// ============================================
// VERIFICAR SI HAY USUARIO LOGUEADO
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        currentUserType = user.type;
        showDashboard(user);
    }
});