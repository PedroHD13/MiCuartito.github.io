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
    if (user.type !== 'inquilino') {
        alert('⚠️ Solo los inquilinos pueden acceder a esta sección');
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
        name: savedProfile.name || savedUser.name || 'María Inquilina',
        email: savedProfile.email || 'maria@ejemplo.com',
        phone: savedProfile.phone || '+591 71234567',
        birthdate: savedProfile.birthdate || '1995-06-15',
        bio: savedProfile.bio || 'Estudiante universitaria, responsable y ordenada. Busco un cuarto tranquilo cerca de la universidad.',
        occupation: savedProfile.occupation || 'Estudiante',
        budget: savedProfile.budget || 800,
        avatar: savedProfile.avatar || savedUser.name.charAt(0) || 'M'
    };
    
    // Actualizar UI
    document.getElementById('profile-name').textContent = profileData.name;
    document.getElementById('profile-avatar').textContent = profileData.avatar;
    document.getElementById('input-name').value = profileData.name;
    document.getElementById('input-email').value = profileData.email;
    document.getElementById('input-phone').value = profileData.phone;
    document.getElementById('input-birthdate').value = profileData.birthdate;
    document.getElementById('input-bio').value = profileData.bio;
    document.getElementById('input-occupation').value = profileData.occupation;
    document.getElementById('input-budget').value = profileData.budget;
    
    // Cargar estadísticas
    loadStats();
    
    // Guardar datos originales
    originalProfileData = { ...profileData };
}

function loadStats() {
    // Cargar favoritos
    const favoriteRooms = JSON.parse(localStorage.getItem('favoriteRooms') || '[]');
    document.getElementById('stat-favorites').textContent = favoriteRooms.length;
    
    // Calificación simulada
    const rating = 4.8;
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
        document.getElementById('input-occupation').disabled = false;
        document.getElementById('input-budget').disabled = false;
        document.getElementById('input-zones').disabled = false;
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
    document.getElementById('input-occupation').disabled = true;
    document.getElementById('input-budget').disabled = true;
    document.getElementById('input-zones').disabled = true;
    
    // Restaurar datos originales
    document.getElementById('input-name').value = originalProfileData.name;
    document.getElementById('input-email').value = originalProfileData.email;
    document.getElementById('input-phone').value = originalProfileData.phone;
    document.getElementById('input-birthdate').value = originalProfileData.birthdate;
    document.getElementById('input-bio').value = originalProfileData.bio;
    document.getElementById('input-occupation').value = originalProfileData.occupation;
    document.getElementById('input-budget').value = originalProfileData.budget;
}

function saveProfile() {
    // Recopilar datos
    const profileData = {
        name: document.getElementById('input-name').value,
        email: document.getElementById('input-email').value,
        phone: document.getElementById('input-phone').value,
        birthdate: document.getElementById('input-birthdate').value,
        bio: document.getElementById('input-bio').value,
        occupation: document.getElementById('input-occupation').value,
        budget: document.getElementById('input-budget').value,
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
    const avatars = ['M', 'A', '👩', '👩‍🎓', '🧑', '👤', '😊'];
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
    const message = encodeURIComponent('Hola, necesito ayuda con mi cuenta de inquilino en Micuartito');
    alert('💬 Contactar Soporte\n\n(Próximamente: chat de soporte o abrir WhatsApp)');
    // window.open(`https://wa.me/59171234567?text=${message}`, '_blank');
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

function goToSearch() {
    if (isEditMode) {
        if (confirm('¿Salir sin guardar los cambios?')) {
            window.location.href = 'buscar.html';
        }
    } else {
        window.location.href = 'buscar.html';
    }
}

function goToFavorites() {
    if (isEditMode) {
        if (confirm('¿Salir sin guardar los cambios?')) {
            window.location.href = 'favoritos.html';
        }
    } else {
        window.location.href = 'favoritos.html';
    }
}
