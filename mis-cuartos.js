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

    // Cargar cuartos
    loadMyRooms();
});

// ============================================
// VARIABLES GLOBALES
// ============================================

let myRooms = [];
let currentFilter = 'all';
let editingRoomIndex = null;
let deletingRoomIndex = null;

// ============================================
// CARGAR CUARTOS
// ============================================

function loadMyRooms() {
    // Cargar cuartos del localStorage
    const storedRooms = JSON.parse(localStorage.getItem('cuartos') || '[]');
    
    // Agregar propiedades adicionales si no existen
    myRooms = storedRooms.map((room, index) => ({
        ...room,
        id: room.id || index,
        active: room.active !== undefined ? room.active : true,
        views: room.views || Math.floor(Math.random() * 50) + 10, // Vistas simuladas
        createdAt: room.createdAt || new Date().toISOString()
    }));

    updateStats();
    updateFilterCounts();
    renderRooms();
}

function saveRooms() {
    localStorage.setItem('cuartos', JSON.stringify(myRooms));
}

// ============================================
// ACTUALIZAR ESTADÍSTICAS
// ============================================

function updateStats() {
    const totalRooms = myRooms.length;
    const activeRooms = myRooms.filter(r => r.active).length;
    const totalViews = myRooms.reduce((sum, r) => sum + (r.views || 0), 0);

    document.getElementById('total-rooms').textContent = totalRooms;
    document.getElementById('active-rooms').textContent = activeRooms;
    document.getElementById('total-views').textContent = totalViews;
}

function updateFilterCounts() {
    const allCount = myRooms.length;
    const activeCount = myRooms.filter(r => r.active).length;
    const inactiveCount = myRooms.filter(r => !r.active).length;

    document.getElementById('count-all').textContent = allCount;
    document.getElementById('count-active').textContent = activeCount;
    document.getElementById('count-inactive').textContent = inactiveCount;
}

// ============================================
// FILTRAR CUARTOS
// ============================================

function filterRooms(filter) {
    currentFilter = filter;
    
    // Actualizar tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`tab-${filter}`).classList.add('active');
    
    renderRooms();
}

// ============================================
// RENDERIZAR CUARTOS
// ============================================

function renderRooms() {
    const container = document.getElementById('my-rooms-container');
    const emptyState = document.getElementById('empty-state');
    
    // Filtrar cuartos
    let filteredRooms = myRooms;
    if (currentFilter === 'active') {
        filteredRooms = myRooms.filter(r => r.active);
    } else if (currentFilter === 'inactive') {
        filteredRooms = myRooms.filter(r => !r.active);
    }
    
    // Mostrar estado vacío si no hay cuartos
    if (myRooms.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Si el filtro no tiene resultados
    if (filteredRooms.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <div style="font-size: 3em; margin-bottom: 15px;">📭</div>
                <h3 style="margin-bottom: 10px;">No hay cuartos en esta categoría</h3>
                <p>Cambia el filtro para ver más publicaciones</p>
            </div>
        `;
        return;
    }
    
    // Renderizar cuartos
    container.innerHTML = filteredRooms.map((room, index) => {
        const realIndex = myRooms.indexOf(room);
        const firstImage = room.fotos && room.fotos.length > 0 ? room.fotos[0] : 
                          'https://via.placeholder.com/400x300/2563a8/ffffff?text=Cuarto';
        
        return `
            <div class="my-room-card ${!room.active ? 'inactive' : ''}">
                <div class="room-card-header">
                    <img src="${firstImage}" alt="Cuarto" onerror="this.src='https://via.placeholder.com/400x300/2563a8/ffffff?text=Cuarto'">
                    <span class="room-status-badge ${room.active ? 'active' : 'inactive'}">
                        ${room.active ? '✓ Activo' : '⏸ Pausado'}
                    </span>
                    <span class="room-views">
                        👁️ ${room.views || 0} vistas
                    </span>
                </div>
                <div class="room-card-body">
                    <div class="room-card-title">
                        Cuarto ${room.tipo} - ${room.capacidad} persona(s)
                    </div>
                    <div class="room-card-info">
                        <div class="info-item">
                            <span>🚪</span> ${room.tipo}
                        </div>
                        <div class="info-item">
                            <span>👥</span> ${room.capacidad} ${parseInt(room.capacidad) > 1 ? 'personas' : 'persona'}
                        </div>
                        ${room.servicios && room.servicios.length > 0 ? `
                        <div class="info-item">
                            <span>✨</span> ${room.servicios.length} servicios
                        </div>
                        ` : ''}
                    </div>
                    <div class="room-card-price">
                        Bs. ${room.precio}
                        <span>/mes</span>
                    </div>
                    <div class="room-card-actions">
                        <button class="action-btn btn-edit" onclick="editRoom(${realIndex})">
                            ✏️ Editar
                        </button>
                        <button class="action-btn btn-toggle ${room.active ? 'active' : ''}" 
                                onclick="toggleRoomStatus(${realIndex})">
                            ${room.active ? '⏸️ Pausar' : '▶️ Activar'}
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteRoom(${realIndex})">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// EDITAR CUARTO
// ============================================

function editRoom(index) {
    editingRoomIndex = index;
    const room = myRooms[index];
    
    // Llenar formulario
    document.getElementById('edit-tipo').value = room.tipo || 'privada';
    document.getElementById('edit-capacidad').value = room.capacidad || '1';
    document.getElementById('edit-precio').value = room.precio || '';
    document.getElementById('edit-reglas').value = room.reglas || '';
    
    // Mostrar modal
    document.getElementById('edit-modal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
    editingRoomIndex = null;
}

// Manejar submit del formulario de edición
document.getElementById('edit-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (editingRoomIndex === null) return;
    
    // Actualizar datos
    myRooms[editingRoomIndex].tipo = document.getElementById('edit-tipo').value;
    myRooms[editingRoomIndex].capacidad = document.getElementById('edit-capacidad').value;
    myRooms[editingRoomIndex].precio = document.getElementById('edit-precio').value;
    myRooms[editingRoomIndex].reglas = document.getElementById('edit-reglas').value;
    
    // Guardar y actualizar
    saveRooms();
    updateStats();
    renderRooms();
    closeEditModal();
    
    alert('✅ Cuarto actualizado exitosamente');
});

// ============================================
// ACTIVAR/PAUSAR CUARTO
// ============================================

function toggleRoomStatus(index) {
    myRooms[index].active = !myRooms[index].active;
    
    saveRooms();
    updateStats();
    updateFilterCounts();
    renderRooms();
    
    const status = myRooms[index].active ? 'activado' : 'pausado';
    alert(`✅ Cuarto ${status} exitosamente`);
}

// ============================================
// ELIMINAR CUARTO
// ============================================

function deleteRoom(index) {
    deletingRoomIndex = index;
    document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
    deletingRoomIndex = null;
}

function confirmDelete() {
    if (deletingRoomIndex === null) return;
    
    // Eliminar cuarto
    myRooms.splice(deletingRoomIndex, 1);
    
    saveRooms();
    updateStats();
    updateFilterCounts();
    renderRooms();
    closeDeleteModal();
    
    alert('✅ Cuarto eliminado exitosamente');
}

// ============================================
// NAVEGACIÓN
// ============================================

function goBack() {
    window.location.href = 'index.html';
}

function goToHome() {
    window.location.href = 'index.html';
}

function goToPublish() {
    window.location.href = 'publicar.html';
}

function goToProfile() {
    window.location.href = 'perfil-propietario.html';
}

// ============================================
// CERRAR MODALES AL HACER CLIC FUERA
// ============================================

document.getElementById('edit-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'edit-modal') {
        closeEditModal();
    }
});

document.getElementById('delete-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'delete-modal') {
        closeDeleteModal();
    }
});
