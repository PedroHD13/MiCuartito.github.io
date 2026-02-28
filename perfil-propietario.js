// ============================================
// VERIFICAR AUTENTICACIÓN
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
        alert('⚠️ Debes iniciar sesión primero');
        window.location.href = 'index.html';
        return;
    }

    const user = JSON.parse(savedUser);
    if (user.type !== 'propietario') {
        alert('⚠️ Solo los propietarios pueden acceder a esta sección');
        window.location.href = 'index.html';
        return;
    }

    // Cargar datos del perfil
    loadProfile();
});

// ============================================
// VARIABLES GLOBALES
// ============================================

let isEditMode = false;
let originalProfileData = {};

// ============================================
// CARGAR PERFIL
// ============================================

function loadProfile() {
    // Cargar datos guardados del perfil
    const savedProfile = JSON.parse(localStorage.getItem('profileData') || '{}');
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Datos por defecto
    const profileData = {
        name: savedProfile.name || savedUser.name || 'Carlos Propietario',
        email: savedProfile.email || 'carlos@ejemplo.com',
        phone: savedProfile.phone || '+591 71234567',
        birthdate: savedProfile.birthdate || '1990-01-01',
        bio: savedProfile.bio || 'Soy propietario con experiencia en alquiler de cuartos. Busco inquilinos responsables y respetuosos.',
        avatar: savedProfile.avatar || savedUser.name.charAt(0) || 'P'
    };
    
    // Actualizar UI
    document.getElementById('profile-name').textContent = profileData.name;
    document.getElementById('profile-avatar').textContent = profileData.avatar;
    document.getElementById('input-name').value = profileData.name;
    document.getElementById('input-email').value = profileData.email;
    document.getElementById('input-phone').value = profileData.phone;
    document.getElementById('input-birthdate').value = profileData.birthdate;
    document.getElementById('input-bio').value = profileData.bio;
    
    // Cargar estadísticas
    loadStats();
    
    // Guardar datos originales
    originalProfileData = { ...profileData };
}

function loadStats() {
    // Cargar cuartos publicados
    const cuartos = JSON.parse(localStorage.getItem('cuartos') || '[]');
    const totalRooms = cuartos.length;
    const activeCuartos = cuartos.filter(r => r.active !== false).length;
    
    document.getElementById('stat-rooms').textContent = activeCuartos;
    
    // Calificación simulada
    const rating = 4.5;
    document.getElementById('stat-rating').textContent = `⭐ ${rating.toFixed(1)}`;
    
    // Año de registro
    const year = new Date().getFullYear();
    document.getElementById('stat-since').textContent = year;
}

// ============================================
// MODO EDICIÓN
// ============================================

function toggleEditMode() {
    isEditMode = !isEditMode;
    
    if (isEditMode) {
        // Activar modo edición
        document.body.classList.add('edit-mode');
        document.getElementById('edit-toggle-btn').textContent = '✕';
        document.getElementById('save-section').style.display = 'flex';
        
        // Habilitar campos
        document.getElementById('input-name').disabled = false;
        document.getElementById('input-email').disabled = false;
        document.getElementById('input-phone').disabled = false;
        document.getElementById('input-birthdate').disabled = false;
        document.getElementById('input-bio').disabled = false;
    } else {
        cancelEdit();
    }
}

function cancelEdit() {
    isEditMode = false;
    document.body.classList.remove('edit-mode');
    document.getElementById('edit-toggle-btn').textContent = '✏️';
    document.getElementById('save-section').style.display = 'none';
    
    // Deshabilitar campos
    document.getElementById('input-name').disabled = true;
    document.getElementById('input-email').disabled = true;
    document.getElementById('input-phone').disabled = true;
    document.getElementById('input-birthdate').disabled = true;
    document.getElementById('input-bio').disabled = true;
    
    // Restaurar datos originales
    document.getElementById('input-name').value = originalProfileData.name;
    document.getElementById('input-email').value = originalProfileData.email;
    document.getElementById('input-phone').value = originalProfileData.phone;
    document.getElementById('input-birthdate').value = originalProfileData.birthdate;
    document.getElementById('input-bio').value = originalProfileData.bio;
}

function saveProfile() {
    // Recopilar datos
    const profileData = {
        name: document.getElementById('input-name').value,
        email: document.getElementById('input-email').value,
        phone: document.getElementById('input-phone').value,
        birthdate: document.getElementById('input-birthdate').value,
        bio: document.getElementById('input-bio').value,
        avatar: originalProfileData.avatar
    };
    
    // Validar
    if (!profileData.name || !profileData.email) {
        alert('⚠️ El nombre y el correo son obligatorios');
        return;
    }
    
    // Guardar en localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Actualizar usuario actual
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    savedUser.name = profileData.name;
    localStorage.setItem('currentUser', JSON.stringify(savedUser));
    
    // Actualizar UI
    document.getElementById('profile-name').textContent = profileData.name;
    originalProfileData = { ...profileData };
    
    // Desactivar modo edición
    cancelEdit();
    
    alert('✅ Perfil actualizado exitosamente');
}

// ============================================
// CAMBIAR AVATAR
// ============================================

function changeAvatar() {
    const avatars = ['P', 'C', '👨', '👨‍💼', '🧑', '👤', '😊'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    document.getElementById('profile-avatar').textContent = randomAvatar;
    
    // Guardar
    const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    profileData.avatar = randomAvatar;
    localStorage.setItem('profileData', JSON.stringify(profileData));
    originalProfileData.avatar = randomAvatar;
}

// ============================================
// ACCIONES DE CUENTA
// ============================================

function changePassword() {
    alert('🔑 Cambiar Contraseña\n\n(Próximamente: formulario para cambiar contraseña)');
}

function privacySettings() {
    alert('🔒 Configuración de Privacidad\n\n(Próximamente: opciones de privacidad)');
}

function showHelp() {
    alert('📚 Centro de Ayuda\n\n(Próximamente: guías y tutoriales)');
}

function contactSupport() {
    // Abrir WhatsApp de soporte
    window.location.href = 'contacto-whatsapp.html';
}

function showTerms() {
    alert('📄 Términos y Condiciones\n\n(Próximamente: página de términos)');
}

function confirmLogout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        alert('✅ Sesión cerrada exitosamente');
        window.location.href = 'index.html';
    }
}

// ============================================
// NAVEGACIÓN
// ============================================

function goBack() {
    if (isEditMode) {
        if (confirm('¿Salir sin guardar los cambios?')) {
            window.location.href = 'index.html';
        }
    } else {
        window.location.href = 'index.html';
    }
}

function goToHome() {
    if (isEditMode) {
        if (confirm('¿Salir sin guardar los cambios?')) {
            window.location.href = 'index.html';
        }
    } else {
        window.location.href = 'index.html';
    }
}

function goToPublish() {
    if (isEditMode) {
        if (confirm('¿Salir sin guardar los cambios?')) {
            window.location.href = 'publicar.html';
        }
    } else {
        window.location.href = 'publicar.html';
    }
}

function goToMyRooms() {
    if (isEditMode) {
        if (confirm('¿Salir sin guardar los cambios?')) {
            window.location.href = 'mis-cuartos.html';
        }
    } else {
        window.location.href = 'mis-cuartos.html';
    }
}
