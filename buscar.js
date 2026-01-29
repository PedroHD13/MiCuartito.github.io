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
        title: `Cuarto ${room.tipo}`,
        location: "Ubicación por definir",
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
    closeFilterModal();
}

function applyFilters() {
    const priceMin = parseInt(document.getElementById('price-min').value) || 0;
    const priceMax = parseInt(document.getElementById('price-max').value) || Infinity;
    const zone = document.getElementById('zone-select').value;
    const bathPrivate = document.getElementById('bath-private').checked;
    const bathShared = document.getElementById('bath-shared').checked;
    const furnished = document.getElementById('furnished').checked;
    const capacity = document.getElementById('capacity-select').value;
    
    // Servicios
    const wifiRequired = document.getElementById('service-wifi').checked;
    const waterRequired = document.getElementById('service-water').checked;
    const electricityRequired = document.getElementById('service-electricity').checked;
    const gasRequired = document.getElementById('service-gas').checked;
    
    let filtered = allRooms.filter(room => {
        let passFilter = true;
        
        // Filtro de precio
        if (room.price < priceMin || room.price > priceMax) passFilter = false;
        
        // Filtro de zona
        if (zone && !room.location.toLowerCase().includes(zone)) passFilter = false;
        
        // Filtro de baño
        if ((bathPrivate || bathShared) && 
            !((bathPrivate && room.bathroom === 'privado') || 
              (bathShared && room.bathroom === 'compartido'))) {
            passFilter = false;
        }
        
        // Filtro de amoblado
        if (furnished && !room.furnished) passFilter = false;
        
        // Filtro de capacidad
        if (capacity && capacity !== '4+' && room.capacity !== parseInt(capacity)) {
            passFilter = false;
        }
        if (capacity === '4+' && room.capacity < 4) {
            passFilter = false;
        }
        
        // Filtros de servicios
        if (wifiRequired && !room.services.includes('wifi')) passFilter = false;
        if (waterRequired && !room.services.includes('agua')) passFilter = false;
        if (electricityRequired && !room.services.includes('luz')) passFilter = false;
        if (gasRequired && !room.services.includes('gas')) passFilter = false;
        
        return passFilter;
    });
    
    currentFilters = filtered;
    renderRooms(filtered);
    closeFilterModal();
    
    if (filtered.length === 0) {
        alert('⚠️ No se encontraron cuartos con estos filtros.\nIntenta ajustar tus criterios de búsqueda.');
    } else {
        alert(`✅ Filtros aplicados. Mostrando ${filtered.length} resultado${filtered.length > 1 ? 's' : ''}.`);
    }
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
        // Simular apertura de WhatsApp
        const message = encodeURIComponent(`Hola, me interesa el cuarto: ${room.title} - Bs. ${room.price}/mes`);
        alert(`📱 Contactando al propietario...\n\n` +
              `Cuarto: ${room.title}\n` +
              `Precio: Bs. ${room.price}/mes\n\n` +
              `(Próximamente: abrir WhatsApp directamente)\n` +
              `Mensaje: "Hola, me interesa el cuarto..."`
        );
        
        // En producción, descomentar esta línea:
        // window.open(`https://wa.me/59171234567?text=${message}`, '_blank');
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
    alert('Próximamente: Pantalla de favoritos');
}

function goToProfile() {
    alert('Próximamente: Tu perfil');
}
