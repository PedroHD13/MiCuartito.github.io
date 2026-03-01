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
    // Cargar cuartos y favoritos
    loadRooms();
    loadFavorites();
});

// ============================================
// DATOS DE EJEMPLO Y VARIABLES GLOBALES
// ============================================

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

let allRooms = [];
let favoriteRooms = [];
let currentSort = 'asc';
let currentFilters = null;

// ============================================
// CARGAR DATOS
// ============================================

function loadRooms() {
    // Intentar cargar cuartos publicados del localStorage
    const storedRooms = JSON.parse(localStorage.getItem('cuartos') || '[]');
    
    // Combinar cuartos de ejemplo con los publicados    
    allRooms = [...sampleRooms, ...storedRooms.map((room, index) => ({
    id: 100 + index,
    title: `Cuarto ${room.tipo} - ${room.ubicacion || 'Sin ubicación'}`,
    location: room.ubicacion || 'Ubicación por definir',
    price: parseInt(room.precio),
    type: room.tipo,
    bathroom: room.servicios.includes('baño privado') ? 'privado' : 'compartido',
    furnished: room.servicios.includes('muebles'),
    capacity: parseInt(room.capacidad) || 1,
    services: room.servicios,
    image: room.fotos[0] || "https://via.placeholder.com/400x300/2563a8/ffffff?text=Cuarto"
    }))];

    renderRooms(allRooms);
}

function loadFavorites() {
    favoriteRooms = JSON.parse(localStorage.getItem('favoriteRooms') || '[]');
}

function saveFavorites() {
    localStorage.setItem('favoriteRooms', JSON.stringify(favoriteRooms));
}

// ============================================
// RENDERIZAR CUARTOS
// ============================================

function renderRooms(rooms = allRooms) {
    const container = document.getElementById('rooms-container');
    document.getElementById('results-count').textContent = rooms.length;
    
    if (rooms.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <div style="font-size: 3em; margin-bottom: 15px;">😔</div>
                <h3 style="margin-bottom: 10px;">No se encontraron cuartos</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = rooms.map(room => `
        <div class="room-card" onclick="viewRoomDetail(${room.id})">
            <div class="room-image">
                <img src="${room.image}" alt="${room.title}" onerror="this.src='https://via.placeholder.com/400x300/2563a8/ffffff?text=Cuarto'">
                <button class="favorite-btn ${favoriteRooms.includes(room.id) ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite(${room.id})">
                    ${favoriteRooms.includes(room.id) ? '❤️' : '🤍'}
                </button>
                <span class="room-badge">${room.type}</span>
            </div>
            <div class="room-info">
                <div class="room-title">${room.title}</div>
                <div class="room-location">📍 ${room.location}</div>
                <div class="room-features">
                    <span class="feature">👥 ${room.capacity} persona${room.capacity > 1 ? 's' : ''}</span>
                    <span class="feature">🚿 ${room.bathroom === 'privado' ? 'Baño privado' : 'Baño compartido'}</span>
                    ${room.furnished ? '<span class="feature">🛋️ Amoblado</span>' : ''}
                </div>
                <div class="room-footer">
                    <div class="room-price">
                        Bs. ${room.price}
                        <span>/mes</span>
                    </div>
                    <button class="contact-btn" onclick="event.stopPropagation(); contactOwner(${room.id})">
                        Contactar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// FAVORITOS
// ============================================

function toggleFavorite(roomId) {
    const index = favoriteRooms.indexOf(roomId);
    if (index > -1) {
        favoriteRooms.splice(index, 1);
    } else {
        favoriteRooms.push(roomId);
    }
    saveFavorites();
    
    // Re-renderizar solo si hay filtros aplicados, sino renderizar todos
    if (currentFilters) {
        renderRooms(currentFilters);
    } else {
        renderRooms(allRooms);
    }
}

// ============================================
// ORDENAMIENTO
// ============================================

function toggleSort() {
    currentSort = currentSort === 'asc' ? 'desc' : 'asc';
    const sortIcon = document.getElementById('sort-icon');
    const sortText = document.getElementById('sort-text');
    
    if (currentSort === 'asc') {
        sortIcon.textContent = '⬆️';
        sortText.textContent = 'Menor precio';
    } else {
        sortIcon.textContent = '⬇️';
        sortText.textContent = 'Mayor precio';
    }
    
    const roomsToSort = currentFilters || allRooms;
    const sorted = [...roomsToSort].sort((a, b) => {
        return currentSort === 'asc' ? a.price - b.price : b.price - a.price;
    });
    
    renderRooms(sorted);
}

// ============================================
// BÚSQUEDA POR TEXTO
// ============================================

document.getElementById('search-input')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const roomsToSearch = currentFilters || allRooms;
    const filtered = roomsToSearch.filter(room => 
        room.title.toLowerCase().includes(searchTerm) ||
        room.location.toLowerCase().includes(searchTerm)
    );
    
    renderRooms(filtered);
});

// ============================================
// FILTROS RÁPIDOS
// ============================================

const quickFilters = {
    bathroom: false,
    furnished: false,
    wifi: false
};

function toggleQuickFilter(type) {
    // Toggle estado
    quickFilters[type] = !quickFilters[type];

    // Actualizar estilo del botón
    const btnMap = {
        bathroom: 'bathroom-filter',
        furnished: 'furnished-filter',
        wifi: 'wifi-filter'
    };
    const btn = document.getElementById(btnMap[type]);
    btn.classList.toggle('active', quickFilters[type]);

    // Aplicar filtros rápidos combinados
    applyQuickFilters();
}

function applyQuickFilters() {
    let filtered = allRooms;

    if (quickFilters.bathroom) {
        filtered = filtered.filter(r => r.bathroom === 'privado');
    }
    if (quickFilters.furnished) {
        filtered = filtered.filter(r => r.furnished === true);
    }
    if (quickFilters.wifi) {
        filtered = filtered.filter(r => r.services.includes('wifi'));
    }

    // Si hay filtros del modal también activos, combinar
    if (currentFilters) {
        const modalIds = currentFilters.map(r => r.id);
        filtered = filtered.filter(r => modalIds.includes(r.id));
    }

    renderRooms(filtered);

    const label = [];
    if (quickFilters.bathroom) label.push('Baño privado');
    if (quickFilters.furnished) label.push('Amoblado');
    if (quickFilters.wifi) label.push('WiFi');

    if (label.length > 0) {
        showToast(`✅ Filtro activo: ${label.join(', ')}`);
    } else {
        renderRooms(currentFilters || allRooms);
        showToast('🗑️ Filtros rápidos quitados');
    }
}

// ============================================
// MODAL DE FILTROS
// ============================================

function openFilterModal() {
    document.getElementById('filter-modal').classList.add('active');
}

function closeFilterModal(event) {
    if (!event || event.target.id === 'filter-modal') {
        document.getElementById('filter-modal').classList.remove('active');
    }
}

function clearFilters() {
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    document.getElementById('zone-select').value = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('capacity-select').value = '';

    currentFilters = null;
    renderRooms(allRooms);
    updateFilterBadge();
    closeFilterModal();
    showToast('🗑️ Filtros eliminados');
}

function applyFilters() {
    const priceMin = parseInt(document.getElementById('price-min').value) || 0;
    const priceMax = parseInt(document.getElementById('price-max').value) || Infinity;
    const zone = document.getElementById('zone-select').value;
    const bathPrivate = document.getElementById('bath-private').checked;
    const bathShared = document.getElementById('bath-shared').checked;
    const furnished = document.getElementById('furnished').checked;
    const capacity = document.getElementById('capacity-select').value;
    const wifiRequired = document.getElementById('service-wifi').checked;
    const waterRequired = document.getElementById('service-water').checked;
    const electricityRequired = document.getElementById('service-electricity').checked;
    const gasRequired = document.getElementById('service-gas').checked;

    let filtered = allRooms.filter(room => {
        let passFilter = true;
        if (room.price < priceMin || room.price > priceMax) passFilter = false;
        if (zone && !room.location.toLowerCase().includes(zone)) passFilter = false;
        if ((bathPrivate || bathShared) &&
            !((bathPrivate && room.bathroom === 'privado') ||
              (bathShared && room.bathroom === 'compartido'))) passFilter = false;
        if (furnished && !room.furnished) passFilter = false;
        if (capacity && capacity !== '4+' && room.capacity !== parseInt(capacity)) passFilter = false;
        if (capacity === '4+' && room.capacity < 4) passFilter = false;
        if (wifiRequired && !room.services.includes('wifi')) passFilter = false;
        if (waterRequired && !room.services.includes('agua')) passFilter = false;
        if (electricityRequired && !room.services.includes('luz')) passFilter = false;
        if (gasRequired && !room.services.includes('gas')) passFilter = false;
        return passFilter;
    });

    currentFilters = filtered;
    renderRooms(filtered);
    closeFilterModal();
    updateFilterBadge();

    // Toast en lugar de alert
    const msg = filtered.length === 0
        ? '😔 Sin resultados. Ajusta los filtros.'
        : `✅ ${filtered.length} cuarto${filtered.length > 1 ? 's' : ''} encontrado${filtered.length > 1 ? 's' : ''}`;
    showToast(msg);
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
        // Abrir WhatsApp directamente con tu link
        window.location.href = 'contacto-whatsapp.html';
    }
}


// ============================================
// TOAST Y BADGE DE FILTROS
// ============================================

function showToast(message) {
    // Remover toast anterior si existe
    const existing = document.querySelector('.filter-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'filter-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animar
    requestAnimationFrame(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    });
}

function updateFilterBadge() {
    const badge = document.getElementById('filter-badge');
    const btn = document.getElementById('main-filter-btn');
    if (!badge) return;

    // Contar filtros activos
    let count = 0;
    if (document.getElementById('price-min').value) count++;
    if (document.getElementById('price-max').value) count++;
    if (document.getElementById('zone-select').value) count++;
    if (document.getElementById('bath-private').checked) count++;
    if (document.getElementById('bath-shared').checked) count++;
    if (document.getElementById('furnished').checked) count++;
    if (document.getElementById('capacity-select').value) count++;
    if (document.getElementById('service-wifi').checked) count++;
    if (document.getElementById('service-water').checked) count++;
    if (document.getElementById('service-electricity').checked) count++;
    if (document.getElementById('service-gas').checked) count++;

    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline';
        btn.style.outline = '3px solid white';
    } else {
        badge.style.display = 'none';
        btn.style.outline = 'none';
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

function goToFavorites() {
    window.location.href = 'favoritos.html';
}

function goToProfile() {
    window.location.href = 'perfil-inquilino.html';
}
