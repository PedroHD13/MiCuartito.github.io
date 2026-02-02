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
    // Cargar favoritos
    loadFavorites();
});

// ============================================
// VARIABLES GLOBALES
// ============================================

let allRooms = [];
let favoriteRooms = [];
let favoriteRoomsData = [];
let currentSort = 'recent';

// ============================================
// CARGAR DATOS
// ============================================

function loadFavorites() {
    // Cargar IDs de favoritos
    favoriteRooms = JSON.parse(localStorage.getItem('favoriteRooms') || '[]');
    
    // Cargar todos los cuartos disponibles (ejemplo + publicados)
    const sampleRooms = [
        {
            id: 1,
            title: "Cuarto amplio cerca UAGRM",
            location: "Zona Norte, 3er Anillo",
            price: 600,
            type: "Privada",
            bathroom: "privado",
            furnished: true,
            capacity: 1,
            services: ["wifi", "agua", "luz"],
            image: "https://via.placeholder.com/400x300/2563a8/ffffff?text=Cuarto+1"
        },
        {
            id: 2,
            title: "Habitación económica estudiantes",
            location: "Centro, Equipetrol",
            price: 400,
            type: "Compartida",
            bathroom: "compartido",
            furnished: true,
            capacity: 2,
            services: ["agua", "luz", "gas"],
            image: "https://via.placeholder.com/400x300/d9764a/ffffff?text=Cuarto+2"
        },
        {
            id: 3,
            title: "Cuarto con baño privado",
            location: "Zona Este, Av. Alemana",
            price: 750,
            type: "Privada",
            bathroom: "privado",
            furnished: true,
            capacity: 1,
            services: ["wifi", "agua", "luz", "gas"],
            image: "https://via.placeholder.com/400x300/2563a8/ffffff?text=Cuarto+3"
        },
        {
            id: 4,
            title: "Habitación amoblada centro",
            location: "Centro, Plaza 24 de Septiembre",
            price: 500,
            type: "Privada",
            bathroom: "compartido",
            furnished: true,
            capacity: 1,
            services: ["wifi", "agua", "luz"],
            image: "https://via.placeholder.com/400x300/d9764a/ffffff?text=Cuarto+4"
        },
        {
            id: 5,
            title: "Cuarto grande para pareja",
            location: "Zona Sur, Urubó",
            price: 900,
            type: "Privada",
            bathroom: "privado",
            furnished: true,
            capacity: 2,
            services: ["wifi", "agua", "luz", "gas"],
            image: "https://via.placeholder.com/400x300/2563a8/ffffff?text=Cuarto+5"
        },
        {
            id: 6,
            title: "Habitación estudiantes UV",
            location: "Zona Oeste, cerca UV",
            price: 350,
            type: "Compartida",
            bathroom: "compartido",
            furnished: false,
            capacity: 3,
            services: ["agua", "luz"],
            image: "https://via.placeholder.com/400x300/d9764a/ffffff?text=Cuarto+6"
        }
    ];
    
    const storedRooms = JSON.parse(localStorage.getItem('cuartos') || '[]');
    allRooms = [...sampleRooms, ...storedRooms.map((room, index) => ({
        id: 100 + index,
        title: `Cuarto ${room.tipo}`,
        location: "Ubicación por definir",
        price: parseInt(room.precio),
        type: room.tipo,
        bathroom: 'privado',
        furnished: room.servicios?.includes('muebles') || false,
        capacity: parseInt(room.capacidad) || 1,
        services: room.servicios || [],
        image: room.fotos?.[0] || "https://via.placeholder.com/400x300/2563a8/ffffff?text=Cuarto"
    }))];
    
    // Filtrar solo los favoritos con fecha agregada
    favoriteRoomsData = allRooms
        .filter(room => favoriteRooms.includes(room.id))
        .map(room => ({
            ...room,
            addedDate: new Date().toISOString() // En producción, esto vendría del localStorage
        }));
    
    updateStats();
    renderFavorites();
}

function saveFavorites() {
    localStorage.setItem('favoriteRooms', JSON.stringify(favoriteRooms));
}

// ============================================
// ACTUALIZAR ESTADÍSTICAS
// ============================================

function updateStats() {
    const totalFavorites = favoriteRoomsData.length;
    
    if (totalFavorites === 0) {
        document.getElementById('total-favorites').textContent = '0';
        document.getElementById('avg-price').textContent = 'Bs. 0';
        document.getElementById('price-range').textContent = '-';
        return;
    }
    
    const prices = favoriteRoomsData.map(r => r.price);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    document.getElementById('total-favorites').textContent = totalFavorites;
    document.getElementById('avg-price').textContent = `Bs. ${avgPrice}`;
    document.getElementById('price-range').textContent = `${minPrice}-${maxPrice}`;
}

// ============================================
// RENDERIZAR FAVORITOS
// ============================================

function renderFavorites() {
    const container = document.getElementById('favorites-container');
    const emptyState = document.getElementById('empty-state');
    
    if (favoriteRoomsData.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    emptyState.style.display = 'none';
    
    container.innerHTML = favoriteRoomsData.map(room => {
        const addedDate = new Date(room.addedDate);
        const formattedDate = addedDate.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short' 
        });
        
        return `
            <div class="favorite-card">
                <div class="favorite-card-header">
                    <img src="${room.image}" alt="${room.title}" onerror="this.src='https://via.placeholder.com/400x300/2563a8/ffffff?text=Cuarto'">
                    <button class="remove-favorite-btn" onclick="removeFavorite(${room.id})" title="Quitar de favoritos">
                        ❤️
                    </button>
                    <span class="favorite-badge">${room.type}</span>
                    <span class="added-date">Agregado: ${formattedDate}</span>
                </div>
                <div class="favorite-card-body">
                    <div class="favorite-card-title">${room.title}</div>
                    <div class="favorite-card-location">📍 ${room.location}</div>
                    <div class="favorite-card-features">
                        <div class="feature-item">👥 ${room.capacity} persona(s)</div>
                        <div class="feature-item">🚿 ${room.bathroom === 'privado' ? 'Baño privado' : 'Baño compartido'}</div>
                        ${room.furnished ? '<div class="feature-item">🛋️ Amoblado</div>' : ''}
                    </div>
                    <div class="favorite-card-footer">
                        <div class="favorite-card-price">
                            Bs. ${room.price}
                            <span>/mes</span>
                        </div>
                        <div class="favorite-actions">
                            <button class="action-btn btn-view" onclick="viewRoomDetail(${room.id})">
                                👁️ Ver
                            </button>
                            <button class="action-btn btn-contact" onclick="contactOwner(${room.id})">
                                💬 Contactar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Agregar botón flotante de comparar si hay 2 o más favoritos
    if (favoriteRoomsData.length >= 2) {
        if (!document.getElementById('compare-btn')) {
            const compareBtn = document.createElement('button');
            compareBtn.id = 'compare-btn';
            compareBtn.className = 'compare-floating-btn';
            compareBtn.onclick = openCompareModal;
            compareBtn.innerHTML = `
                📊
                <span class="compare-badge">${favoriteRoomsData.length}</span>
            `;
            document.body.appendChild(compareBtn);
        } else {
            document.querySelector('.compare-badge').textContent = favoriteRoomsData.length;
        }
    } else {
        const existingBtn = document.getElementById('compare-btn');
        if (existingBtn) existingBtn.remove();
    }
}

// ============================================
// QUITAR FAVORITO
// ============================================

function removeFavorite(roomId) {
    if (confirm('¿Quitar este cuarto de tus favoritos?')) {
        const index = favoriteRooms.indexOf(roomId);
        if (index > -1) {
            favoriteRooms.splice(index, 1);
            saveFavorites();
            loadFavorites();
        }
    }
}

// ============================================
// LIMPIAR TODOS LOS FAVORITOS
// ============================================

function clearAllFavorites() {
    if (favoriteRoomsData.length === 0) {
        alert('⚠️ No tienes favoritos para eliminar');
        return;
    }
    
    if (confirm(`¿Seguro que quieres eliminar todos tus ${favoriteRoomsData.length} favoritos?\n\nEsta acción no se puede deshacer.`)) {
        favoriteRooms = [];
        saveFavorites();
        loadFavorites();
        alert('✅ Todos los favoritos fueron eliminados');
    }
}

// ============================================
// ORDENAR FAVORITOS
// ============================================

function toggleSortMenu() {
    const menu = document.getElementById('sort-menu');
    menu.classList.toggle('active');
}

function sortFavorites(sortType) {
    currentSort = sortType;
    
    switch(sortType) {
        case 'price-asc':
            favoriteRoomsData.sort((a, b) => a.price - b.price);
            document.getElementById('sort-text').textContent = 'Menor precio';
            break;
        case 'price-desc':
            favoriteRoomsData.sort((a, b) => b.price - a.price);
            document.getElementById('sort-text').textContent = 'Mayor precio';
            break;
        case 'recent':
            favoriteRoomsData.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
            document.getElementById('sort-text').textContent = 'Recientes';
            break;
    }
    
    toggleSortMenu();
    renderFavorites();
}

// ============================================
// COMPARAR CUARTOS
// ============================================

function openCompareModal() {
    const modal = document.getElementById('compare-modal');
    const grid = document.getElementById('compare-grid');
    
    grid.innerHTML = favoriteRoomsData.map(room => `
        <div class="compare-item">
            <div class="compare-item-header">
                <div class="compare-item-title">${room.title}</div>
                <div class="compare-item-price">Bs. ${room.price}</div>
            </div>
            <div class="compare-row">
                <span class="compare-label">📍 Ubicación:</span>
                <span class="compare-value">${room.location}</span>
            </div>
            <div class="compare-row">
                <span class="compare-label">🚪 Tipo:</span>
                <span class="compare-value">${room.type}</span>
            </div>
            <div class="compare-row">
                <span class="compare-label">👥 Capacidad:</span>
                <span class="compare-value">${room.capacity} persona(s)</span>
            </div>
            <div class="compare-row">
                <span class="compare-label">🚿 Baño:</span>
                <span class="compare-value">${room.bathroom === 'privado' ? 'Privado' : 'Compartido'}</span>
            </div>
            <div class="compare-row">
                <span class="compare-label">🛋️ Amoblado:</span>
                <span class="compare-value">${room.furnished ? 'Sí' : 'No'}</span>
            </div>
            <div class="compare-row">
                <span class="compare-label">✨ Servicios:</span>
                <span class="compare-value">${room.services.length} incluidos</span>
            </div>
        </div>
    `).join('');
    
    modal.classList.add('active');
}

function closeCompareModal() {
    document.getElementById('compare-modal').classList.remove('active');
}

// ============================================
// ACCIONES DE CUARTOS
// ============================================

function viewRoomDetail(roomId) {
    const room = allRooms.find(r => r.id === roomId);
    if (room) {
        alert(`📋 Detalles del Cuarto:\n\n` +
              `${room.title}\n` +
              `${room.location}\n\n` +
              `Precio: Bs. ${room.price}/mes\n` +
              `Tipo: ${room.type}\n` +
              `Capacidad: ${room.capacity} persona(s)\n` +
              `Baño: ${room.bathroom === 'privado' ? 'Privado' : 'Compartido'}\n` +
              `${room.furnished ? '✓ Amoblado\n' : ''}\n` +
              `Servicios: ${room.services.join(', ')}\n\n` +
              `(Próximamente: pantalla de detalles completa)`
        );
    }
}

function contactOwner(roomId) {
    const room = allRooms.find(r => r.id === roomId);
    if (room) {
        const message = encodeURIComponent(`Hola, me interesa el cuarto: ${room.title} - Bs. ${room.price}/mes`);
        alert(`📱 Contactando al propietario...\n\n` +
              `Cuarto: ${room.title}\n` +
              `Precio: Bs. ${room.price}/mes\n\n` +
              `(Próximamente: abrir WhatsApp directamente)`
        );
    }
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

function goToSearch() {
    window.location.href = 'buscar.html';
}

function goToProfile() {
    alert('Próximamente: Tu perfil');
}

// ============================================
// CERRAR MODALES AL HACER CLIC FUERA
// ============================================

document.getElementById('compare-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'compare-modal') {
        closeCompareModal();
    }
});

// Cerrar menú de ordenar al hacer clic fuera
document.addEventListener('click', (e) => {
    const sortMenu = document.getElementById('sort-menu');
    const sortBtn = document.querySelector('.sort-btn');
    
    if (sortMenu && sortMenu.classList.contains('active')) {
        if (!sortMenu.contains(e.target) && !sortBtn.contains(e.target)) {
            sortMenu.classList.remove('active');
        }
    }
});
