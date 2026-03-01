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
        const btn = document.getElementById('compare-btn');
        if (btn) btn.remove();
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
            <div class="favorite-card" id="card-${room.id}">
                <div class="favorite-card-header">
                    <img src="${room.image}" alt="${room.title}"
                         onerror="this.src='https://via.placeholder.com/400x300/2563a8/ffffff?text=Cuarto'">
                    <!-- Checkbox de selección para comparar -->
                    <div class="compare-select-wrapper">
                        <input type="checkbox" class="compare-checkbox"
                               id="chk-${room.id}"
                               onchange="toggleSelectForCompare(${room.id}, this)"
                               title="Seleccionar para comparar">
                    </div>
                    <button class="remove-favorite-btn" onclick="removeFavorite(${room.id})"
                            title="Quitar de favoritos">❤️</button>
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
                            Bs. ${room.price}<span>/mes</span>
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

    // Botón flotante comparar con texto
    if (favoriteRoomsData.length >= 2) {
        if (!document.getElementById('compare-btn')) {
            const compareBtn = document.createElement('button');
            compareBtn.id = 'compare-btn';
            compareBtn.className = 'compare-floating-btn';
            compareBtn.onclick = openCompareModal;
            compareBtn.innerHTML = `
                📊
                <span class="compare-btn-text">Comparar</span>
                <span class="compare-badge">${favoriteRoomsData.length}</span>
            `;
            document.body.appendChild(compareBtn);
        } else {
            document.querySelector('.compare-badge').textContent = favoriteRoomsData.length;
        }
    } else {
        const btn = document.getElementById('compare-btn');
        if (btn) btn.remove();
    }
}

// ============================================
// QUITAR FAVORITO
// ============================================

function removeFavorite(roomId) {
    const index = favoriteRooms.indexOf(roomId);
    if (index > -1) {
        favoriteRooms.splice(index, 1);
        saveFavorites();
        loadFavorites();
        showToast('🗑️ Cuarto quitado de favoritos');
    }
}

// ============================================
// LIMPIAR TODOS LOS FAVORITOS
// ============================================

function clearAllFavorites() {
    if (favoriteRoomsData.length === 0) {
        showToast('⚠️ No tienes favoritos para eliminar');
        return;
    }
    if (confirm(`¿Eliminar todos tus ${favoriteRoomsData.length} favoritos?`)) {
        favoriteRooms = [];
        saveFavorites();
        loadFavorites();
        showToast('✅ Todos los favoritos eliminados');
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
    const result = document.getElementById('compare-result');
    const btnDoCompare = document.getElementById('btn-do-compare');
    const hint = document.getElementById('compare-hint');

    // Resetear estado del modal
    result.innerHTML = '';
    btnDoCompare.style.display = 'none';
    hint.textContent = 'Selecciona 2 o 3 cuartos para comparar';

    // Mostrar cards seleccionables en el modal
    grid.innerHTML = favoriteRoomsData.map(room => `
        <div class="compare-item" id="modal-card-${room.id}" onclick="toggleModalSelect(${room.id})"
             style="cursor:pointer; border: 2px solid #e0e0e0; border-radius:12px; padding:12px; margin-bottom:10px; display:flex; align-items:center; gap:12px;">
            <input type="checkbox" id="modal-chk-${room.id}" style="width:22px; height:22px; accent-color:#2563a8; flex-shrink:0;">
            <div>
                <div style="font-weight:700; color:#333; margin-bottom:4px;">${room.title}</div>
                <div style="font-size:0.85em; color:#666;">📍 ${room.location}</div>
                <div style="font-size:1em; font-weight:700; color:#d9764a; margin-top:4px;">Bs. ${room.price}/mes</div>
            </div>
        </div>
    `).join('');

    modal.classList.add('active');
}

function doCompare() {
    const checkboxes = document.querySelectorAll('#compare-grid input[type="checkbox"]:checked');
    const selectedIds = Array.from(checkboxes).map(chk =>
        parseInt(chk.id.replace('modal-chk-', ''))
    );

    if (selectedIds.length < 2) {
        showToast('⚠️ Selecciona al menos 2 cuartos');
        return;
    }

    const selectedRooms = favoriteRoomsData.filter(r => selectedIds.includes(r.id));
    const minPrice = Math.min(...selectedRooms.map(r => r.price));

    const headers = selectedRooms.map(r =>
        `<th>${r.title.length > 18 ? r.title.substring(0,18)+'...' : r.title}</th>`
    ).join('');

    const rows = [
        {
            label: '💰 Precio/mes',
            values: selectedRooms.map(r =>
                `<td class="${r.price === minPrice ? 'highlight-best' : ''}">Bs. ${r.price}</td>`
            )
        },
        {
            label: '📍 Ubicación',
            values: selectedRooms.map(r => `<td>${r.location}</td>`)
        },
        {
            label: '🚿 Baño',
            values: selectedRooms.map(r =>
                `<td>${r.bathroom === 'privado' ? '✅ Privado' : '🔄 Compartido'}</td>`
            )
        },
        {
            label: '🛋️ Amoblado',
            values: selectedRooms.map(r =>
                `<td>${r.furnished ? '✅ Sí' : '❌ No'}</td>`
            )
        },
        {
            label: '👥 Capacidad',
            values: selectedRooms.map(r => `<td>${r.capacity} persona(s)</td>`)
        },
        {
            label: '✨ Servicios',
            values: selectedRooms.map(r => `<td>${r.services.length} incluidos</td>`)
        }
    ];

    const tableRows = rows.map(row =>
        `<tr><td>${row.label}</td>${row.values.join('')}</tr>`
    ).join('');

    document.getElementById('compare-result').innerHTML = `
        <h3 style="text-align:center; color:#333; margin-bottom:15px; font-size:1em;">
            📊 Comparación lado a lado
        </h3>
        <div style="overflow-x:auto;">
            <table class="compare-table">
                <thead>
                    <tr>
                        <th>Característica</th>
                        ${headers}
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
        <p style="text-align:center; font-size:0.8em; color:#999; margin-top:10px;">
            💡 Precio en <span class="highlight-best">azul</span> = más económico
        </p>
    `;
}

function toggleModalSelect(roomId) {
    const chk = document.getElementById(`modal-chk-${roomId}`);
    const card = document.getElementById(`modal-card-${roomId}`);
    chk.checked = !chk.checked;

    if (chk.checked) {
        card.style.borderColor = '#2563a8';
        card.style.background = '#f0f5ff';
    } else {
        card.style.borderColor = '#e0e0e0';
        card.style.background = 'white';
    }

    const selected = document.querySelectorAll('#compare-grid input[type="checkbox"]:checked');
    const btn = document.getElementById('btn-do-compare');
    const hint = document.getElementById('compare-hint');

    if (selected.length >= 2) {
        btn.style.display = 'block';
        hint.textContent = `✅ ${selected.length} cuarto(s) seleccionado(s). ¡Listo para comparar!`;
        hint.style.background = '#e8f5e9';
    } else {
        btn.style.display = 'none';
        hint.textContent = `Selecciona ${2 - selected.length} más para comparar`;
        hint.style.background = '#f0f5ff';
    }
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
        // Abrir WhatsApp directamente con tu link
        window.location.href = 'contacto-whatsapp.html';
    }
}

function showToast(message) {
    const existing = document.querySelector('.filter-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'filter-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    });
}

// También elimina la función toggleSelectForCompare si no la tienes
function toggleSelectForCompare(roomId, checkbox) {
    const card = document.getElementById(`card-${roomId}`);
    if (checkbox.checked) {
        card.classList.add('selected-for-compare');
    } else {
        card.classList.remove('selected-for-compare');
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
    window.location.href = 'perfil-inquilino.html';
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
